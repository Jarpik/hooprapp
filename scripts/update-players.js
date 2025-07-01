const { Pool } = require('pg');
const fetch = require('node-fetch');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Ball Dont Lie API configuration
const API_KEY = '1455ffa8-a57a-4182-9a12-37c96635b746';
const BASE_URL = 'https://api.balldontlie.io/v1';
const RATE_LIMIT_DELAY = 12000; // 12 seconds between requests

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function makeAPIRequest(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  
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
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ API Response: ${data.data ? data.data.length : 0} items`);
    
    return data;
    
  } catch (error) {
    console.error(`❌ API Request failed: ${error.message}`);
    throw error;
  }
}

async function getAllAPIPlayers() {
  console.log('🏀 Fetching ALL NBA players from Ball Dont Lie API...');
  
  const allPlayers = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    try {
      console.log(`📄 Fetching page ${page}...`);
      
      const response = await makeAPIRequest('/players', {
        page: page,
        per_page: 100
      });
      
      if (response.data && response.data.length > 0) {
        allPlayers.push(...response.data);
        console.log(`   Added ${response.data.length} players (Total: ${allPlayers.length})`);
        
        if (response.meta && response.meta.next_page) {
          page++;
          console.log(`⏳ Rate limiting: waiting 12 seconds...`);
          await sleep(RATE_LIMIT_DELAY);
        } else {
          hasMore = false;
          console.log(`✅ Complete! Total players: ${allPlayers.length}`);
        }
      } else {
        hasMore = false;
      }
      
    } catch (error) {
      console.error(`❌ Error fetching page ${page}: ${error.message}`);
      break;
    }
  }
  
  return allPlayers;
}

async function recreatePlayersTable() {
  console.log('🔧 Recreating players table with Ball Dont Lie data...');
  
  try {
    // Drop existing table and recreate with all needed columns
    await pool.query(`DROP TABLE IF EXISTS players`);
    
    await pool.query(`
      CREATE TABLE players (
        id SERIAL PRIMARY KEY,
        api_id INTEGER UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        position VARCHAR(10),
        height VARCHAR(10),
        weight INTEGER,
        team VARCHAR(50),
        team_abbreviation VARCHAR(5),
        country VARCHAR(100),
        draft_year INTEGER,
        draft_round INTEGER,
        draft_number INTEGER,
        ppg DECIMAL(4,1) DEFAULT 0,
        rpg DECIMAL(4,1) DEFAULT 0,
        apg DECIMAL(4,1) DEFAULT 0,
        age INTEGER,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        last_updated DATE DEFAULT CURRENT_DATE
      )
    `);
    
    console.log('✅ Players table recreated successfully');
    
  } catch (error) {
    console.error('❌ Error recreating table:', error.message);
    throw error;
  }
}

async function insertAPIPlayers(apiPlayers) {
  console.log(`🔄 Inserting ${apiPlayers.length} players into database...`);
  
  let inserted = 0;
  let skipped = 0;
  
  for (let i = 0; i < apiPlayers.length; i++) {
    const player = apiPlayers[i];
    
    try {
      const name = `${player.first_name} ${player.last_name}`.trim();
      
      // Extract height
      let height = null;
      if (player.height_feet && player.height_inches) {
        height = `${player.height_feet}'${player.height_inches}"`;
      }
      
      // Extract team info
      const team = player.team ? player.team.full_name : null;
      const teamAbbr = player.team ? player.team.abbreviation : null;
      
      console.log(`[${i + 1}/${apiPlayers.length}] Inserting ${name}...`);
      
      await pool.query(`
        INSERT INTO players (
          api_id, name, first_name, last_name, position, height, weight,
          team, team_abbreviation, country, draft_year, draft_round, draft_number
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (api_id) DO NOTHING
      `, [
        player.id,
        name,
        player.first_name,
        player.last_name,
        player.position,
        height,
        player.weight_pounds ? parseInt(player.weight_pounds) : null,
        team,
        teamAbbr,
        player.country,
        player.draft_year ? parseInt(player.draft_year) : null,
        player.draft_round ? parseInt(player.draft_round) : null,
        player.draft_number ? parseInt(player.draft_number) : null
      ]);
      
      inserted++;
      
      console.log(`   ✅ ${name} - ${player.position || 'No pos'} - ${team || 'No team'} - ${height || 'No height'}`);
      
    } catch (error) {
      console.error(`   ❌ Error inserting ${player.first_name} ${player.last_name}: ${error.message}`);
      skipped++;
    }
  }
  
  console.log(`\n📊 Insert Results:`);
  console.log(`   ✅ Inserted: ${inserted} players`);
  console.log(`   ❌ Skipped: ${skipped} players`);
  
  return inserted;
}

async function showFinalStats() {
  try {
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN position IS NOT NULL THEN 1 END) as with_position,
        COUNT(CASE WHEN height IS NOT NULL THEN 1 END) as with_height,
        COUNT(CASE WHEN weight IS NOT NULL THEN 1 END) as with_weight,
        COUNT(CASE WHEN country IS NOT NULL THEN 1 END) as with_country,
        COUNT(CASE WHEN draft_year IS NOT NULL THEN 1 END) as with_draft,
        COUNT(CASE WHEN team IS NOT NULL THEN 1 END) as with_team
      FROM players
    `);
    
    const stats = statsResult.rows[0];
    
    console.log(`\n📊 NEW PLAYER DATABASE STATS:`);
    console.log(`   Total players: ${stats.total}`);
    console.log(`   With position: ${stats.with_position} (${Math.round(stats.with_position/stats.total*100)}%)`);
    console.log(`   With height: ${stats.with_height} (${Math.round(stats.with_height/stats.total*100)}%)`);
    console.log(`   With weight: ${stats.with_weight} (${Math.round(stats.with_weight/stats.total*100)}%)`);
    console.log(`   With country: ${stats.with_country} (${Math.round(stats.with_country/stats.total*100)}%)`);
    console.log(`   With draft info: ${stats.with_draft} (${Math.round(stats.with_draft/stats.total*100)}%)`);
    console.log(`   With team: ${stats.with_team} (${Math.round(stats.with_team/stats.total*100)}%)`);
    
    // Show sample players
    const sampleResult = await pool.query(`
      SELECT name, position, height, weight, team, country, draft_year
      FROM players 
      ORDER BY name 
      LIMIT 10
    `);
    
    console.log(`\n📋 Sample Players:`);
    sampleResult.rows.forEach(player => {
      console.log(`   ${player.name} - ${player.position || 'N/A'} - ${player.height || 'N/A'} - ${player.team || 'N/A'}`);
    });
    
  } catch (error) {
    console.error('Error showing stats:', error.message);
  }
}

async function rebuildDatabaseFromAPI() {
  try {
    console.log('🚀 REBUILDING PLAYER DATABASE FROM BALL DONT LIE API');
    console.log('================================================');
    
    // Step 1: Get all API players
    const apiPlayers = await getAllAPIPlayers();
    
    if (apiPlayers.length === 0) {
      console.log('❌ No players received from API');
      return;
    }
    
    // Step 2: Recreate database table
    await recreatePlayersTable();
    
    // Step 3: Insert all API players
    const inserted = await insertAPIPlayers(apiPlayers);
    
    // Step 4: Show final stats
    await showFinalStats();
    
    console.log(`\n🎉 DATABASE REBUILD COMPLETE!`);
    console.log(`   🏀 Your game now has ${inserted} current NBA players`);
    console.log(`   📊 All data from official Ball Dont Lie API`);
    console.log(`   🎯 Ready for 2024-25 season stats integration`);
    
  } catch (error) {
    console.error('💥 Fatal error:', error.message);
    console.error(error.stack);
  } finally {
    await pool.end();
  }
}

// Run the rebuild
if (require.main === module) {
  rebuildDatabaseFromAPI();
}

module.exports = { rebuildDatabaseFromAPI };
