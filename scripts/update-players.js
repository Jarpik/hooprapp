const { Pool } = require('pg');
const fetch = require('node-fetch');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Ball Don't Lie API configuration
const API_KEY = '1455ffa8-a57a-4182-9a12-37c96635b746';
const BASE_URL = 'https://api.balldontlie.io/v1';

// Rate limiting: 5 requests per minute = one request every 12 seconds
const RATE_LIMIT_DELAY = 12000; // 12 seconds

// Sleep function for rate limiting
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Make API request with rate limiting
async function makeAPIRequest(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  
  // Add parameters
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });
  
  console.log(`🔗 API Request: ${url.toString()}`);
  
  try {
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': API_KEY,
        'Accept': 'application/json',
        'User-Agent': 'NBA-Stats-Updater/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ API Response received (${data.data ? data.data.length : 0} items)`);
    
    return data;
    
  } catch (error) {
    console.error(`❌ API Request failed: ${error.message}`);
    throw error;
  }
}

// Get all players from Ball Don't Lie API
async function getAllPlayers() {
  console.log('🏀 Fetching all NBA players from Ball Dont Lie API...');
  
  const allPlayers = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    try {
      console.log(`📄 Fetching page ${page}...`);
      
      const response = await makeAPIRequest('/players', {
        page: page,
        per_page: 100 // Maximum per page
      });
      
      if (response.data && response.data.length > 0) {
        allPlayers.push(...response.data);
        console.log(`   Added ${response.data.length} players (Total: ${allPlayers.length})`);
        
        // Check if there are more pages
        if (response.meta && response.meta.next_page) {
          page++;
          
          // Rate limiting - wait 12 seconds before next request
          console.log(`⏳ Rate limiting: waiting 12 seconds before next page...`);
          await sleep(RATE_LIMIT_DELAY);
        } else {
          hasMore = false;
          console.log(`✅ Reached last page. Total players fetched: ${allPlayers.length}`);
        }
      } else {
        hasMore = false;
        console.log('❌ No more players found');
      }
      
    } catch (error) {
      console.error(`❌ Error fetching page ${page}: ${error.message}`);
      break;
    }
  }
  
  return allPlayers;
}

// Match your database players with API players
async function matchPlayersWithAPI(apiPlayers) {
  console.log('\n🔍 Matching database players with API players...');
  
  // Get all players from your database
  const dbResult = await pool.query(`
    SELECT id, name, team 
    FROM players 
    WHERE active = true 
    ORDER BY name
  `);
  
  const dbPlayers = dbResult.rows;
  console.log(`📋 Database has ${dbPlayers.length} active players`);
  console.log(`🌐 API has ${apiPlayers.length} total players`);
  
  const matches = [];
  const unmatched = [];
  
  for (const dbPlayer of dbPlayers) {
    const dbName = dbPlayer.name.toLowerCase().trim();
    
    // Try to find matching API player
    const apiPlayer = apiPlayers.find(api => {
      const apiName = `${api.first_name} ${api.last_name}`.toLowerCase().trim();
      return apiName === dbName;
    });
    
    if (apiPlayer) {
      matches.push({
        dbPlayer: dbPlayer,
        apiPlayer: apiPlayer
      });
      console.log(`✅ Matched: ${dbPlayer.name} → API ID ${apiPlayer.id}`);
    } else {
      unmatched.push(dbPlayer);
      console.log(`❌ No match: ${dbPlayer.name}`);
    }
  }
  
  console.log(`\n📊 Matching Results:`);
  console.log(`   ✅ Matched: ${matches.length} players`);
  console.log(`   ❌ Unmatched: ${unmatched.length} players`);
  console.log(`   🎯 Success Rate: ${Math.round(matches.length / dbPlayers.length * 100)}%`);
  
  return { matches, unmatched };
}

// Extract player data from API response
function extractPlayerData(apiPlayer) {
  const data = {};
  
  try {
    // Position
    if (apiPlayer.position) {
      data.position = apiPlayer.position.trim();
    }
    
    // Height - API might give in different formats
    if (apiPlayer.height_feet && apiPlayer.height_inches) {
      data.height = `${apiPlayer.height_feet}'${apiPlayer.height_inches}"`;
    } else if (apiPlayer.height) {
      data.height = apiPlayer.height;
    }
    
    // Weight
    if (apiPlayer.weight_pounds) {
      data.weight = parseInt(apiPlayer.weight_pounds);
    } else if (apiPlayer.weight) {
      data.weight = parseInt(apiPlayer.weight);
    }
    
    // Country
    if (apiPlayer.country) {
      data.country = apiPlayer.country.trim();
    }
    
    // Draft information
    if (apiPlayer.draft_year) {
      data.draft_year = parseInt(apiPlayer.draft_year);
    }
    
    if (apiPlayer.draft_round) {
      data.draft_round = parseInt(apiPlayer.draft_round);
    }
    
    if (apiPlayer.draft_number) {
      data.draft_number = parseInt(apiPlayer.draft_number);
    }
    
    // Team (update if different)
    if (apiPlayer.team && apiPlayer.team.abbreviation) {
      data.team = apiPlayer.team.abbreviation;
    }
    
    console.log(`📊 Extracted data for ${apiPlayer.first_name} ${apiPlayer.last_name}:`);
    console.log(`   Position: ${data.position || 'Not found'}`);
    console.log(`   Height: ${data.height || 'Not found'}`);
    console.log(`   Weight: ${data.weight || 'Not found'} lbs`);
    console.log(`   Country: ${data.country || 'Not found'}`);
    console.log(`   Draft: ${data.draft_year || 'N/A'} Round ${data.draft_round || 'N/A'} Pick ${data.draft_number || 'N/A'}`);
    
  } catch (error) {
    console.error(`Error extracting data for ${apiPlayer.first_name} ${apiPlayer.last_name}: ${error.message}`);
  }
  
  return data;
}

// Update database with new columns if they don't exist
async function ensureColumnsExist() {
  console.log('🔧 Ensuring all required columns exist in database...');
  
  const columns = [
    'weight INTEGER',
    'country VARCHAR(100)',
    'draft_year INTEGER',
    'draft_round INTEGER', 
    'draft_number INTEGER'
  ];
  
  for (const column of columns) {
    const columnName = column.split(' ')[0];
    try {
      await pool.query(`ALTER TABLE players ADD COLUMN IF NOT EXISTS ${column}`);
      console.log(`✅ Column '${columnName}' ready`);
    } catch (error) {
      console.log(`⚠️ Column '${columnName}': ${error.message}`);
    }
  }
}

// Update database with API data
async function updateDatabaseWithAPI() {
  try {
    console.log('🏀 Starting Ball Dont Lie API data update...');
    
    // Ensure database has required columns
    await ensureColumnsExist();
    
    // Get all players from API
    const apiPlayers = await getAllPlayers();
    
    if (apiPlayers.length === 0) {
      console.log('❌ No players received from API');
      return;
    }
    
    // Match with database players
    const { matches, unmatched } = await matchPlayersWithAPI(apiPlayers);
    
    if (matches.length === 0) {
      console.log('❌ No matches found between database and API');
      return;
    }
    
    // Update matched players
    console.log(`\n🔄 Updating ${matches.length} matched players...`);
    let updated = 0;
    let failed = 0;
    
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const { dbPlayer, apiPlayer } = match;
      
      try {
        console.log(`\n[${i + 1}/${matches.length}] Updating ${dbPlayer.name}...`);
        
        const data = extractPlayerData(apiPlayer);
        
        if (Object.keys(data).length > 0) {
          await pool.query(`
            UPDATE players 
            SET 
              position = COALESCE($1, position),
              height = COALESCE($2, height),
              weight = COALESCE($3, weight),
              country = COALESCE($4, country),
              draft_year = COALESCE($5, draft_year),
              draft_round = COALESCE($6, draft_round),
              draft_number = COALESCE($7, draft_number),
              team = COALESCE($8, team),
              last_updated = CURRENT_DATE
            WHERE id = $9
          `, [
            data.position || null,
            data.height || null,
            data.weight || null,
            data.country || null,
            data.draft_year || null,
            data.draft_round || null,
            data.draft_number || null,
            data.team || null,
            dbPlayer.id
          ]);
          
          updated++;
          console.log(`✅ Updated ${dbPlayer.name} successfully`);
        } else {
          console.log(`⚠️ No valid data found for ${dbPlayer.name}`);
          failed++;
        }
        
      } catch (error) {
        console.error(`❌ Error updating ${dbPlayer.name}: ${error.message}`);
        failed++;
      }
    }
    
    console.log(`\n🎉 Ball Don't Lie API update complete!`);
    console.log(`   ✅ Updated: ${updated} players`);
    console.log(`   ❌ Failed: ${failed} players`);
    console.log(`   ⚠️ Unmatched: ${unmatched.length} players`);
    
    // Show final database status
    const statusResult = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN position IS NOT NULL THEN 1 END) as with_position,
        COUNT(CASE WHEN height IS NOT NULL THEN 1 END) as with_height,
        COUNT(CASE WHEN weight IS NOT NULL THEN 1 END) as with_weight,
        COUNT(CASE WHEN country IS NOT NULL THEN 1 END) as with_country,
        COUNT(CASE WHEN draft_year IS NOT NULL THEN 1 END) as with_draft_info
      FROM players 
      WHERE active = true
    `);
    
    const status = statusResult.rows[0];
    console.log(`\n📊 Final Database Status:`);
    console.log(`   Total active players: ${status.total}`);
    console.log(`   With position: ${status.with_position} (${Math.round(status.with_position/status.total*100)}%)`);
    console.log(`   With height: ${status.with_height} (${Math.round(status.with_height/status.total*100)}%)`);
    console.log(`   With weight: ${status.with_weight} (${Math.round(status.with_weight/status.total*100)}%)`);
    console.log(`   With country: ${status.with_country} (${Math.round(status.with_country/status.total*100)}%)`);
    console.log(`   With draft info: ${status.with_draft_info} (${Math.round(status.with_draft_info/status.total*100)}%)`);
    
  } catch (error) {
    console.error('💥 Fatal error:', error.message);
    console.error(error.stack);
  } finally {
    await pool.end();
  }
}

// Run the Ball Don't Lie updater
if (require.main === module) {
  updateDatabaseWithAPI();
}

module.exports = { updateDatabaseWithAPI, getAllPlayers };
