const { Pool } = require('pg');
const fetch = require('node-fetch');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// ESPN Player ID mapping for common players
const playerIDMap = {
  'lebron james': '1966',
  'stephen curry': '3975',
  'kevin durant': '3202',
  'giannis antetokounmpo': '3032977',
  'luka doncic': '4066648',
  'nikola jokic': '3112335',
  'jayson tatum': '4065648',
  'joel embiid': '3059318',
  'damian lillard': '6606',
  'jimmy butler': '6430',
  'paul george': '4251',
  'kawhi leonard': '6450',
  'russell westbrook': '3468',
  'chris paul': '2779',
  'anthony davis': '6583'
};

// Convert player name to potential ESPN search terms
function generateESPNSearchTerms(playerName) {
  const cleaned = playerName.toLowerCase().replace(/[^a-z\s]/g, '');
  const parts = cleaned.split(' ');
  
  return [
    cleaned,                           // "lebron james"
    parts.join('+'),                   // "lebron+james"  
    parts.join('%20'),                 // "lebron%20james"
    parts[0] + '+' + parts[parts.length - 1]  // "lebron+james" (first+last)
  ];
}

// Get ESPN player data using their search/API
async function getESPNPlayerData(playerName) {
  // Check if we have a direct ID mapping
  const directId = playerIDMap[playerName.toLowerCase()];
  if (directId) {
    return await fetchESPNPlayerById(directId, playerName);
  }
  
  // Try to search for the player
  const searchTerms = generateESPNSearchTerms(playerName);
  
  for (const term of searchTerms) {
    try {
      // Try ESPN's athlete search API
      const searchUrl = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/athletes?limit=50`;
      
      console.log(`🔍 Searching ESPN API for: ${playerName}`);
      
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
          'Accept': 'application/json',
          'Referer': 'https://www.espn.com/',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Search for our player in the results
        const foundPlayer = findPlayerInESPNData(data, playerName);
        if (foundPlayer) {
          console.log(`✅ Found ${playerName} with ESPN ID: ${foundPlayer.id}`);
          return await fetchESPNPlayerById(foundPlayer.id, playerName);
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
      
    } catch (error) {
      console.log(`⚠️ ESPN search error for ${playerName}: ${error.message}`);
      continue;
    }
  }
  
  return null;
}

// Find player in ESPN API response
function findPlayerInESPNData(data, targetName) {
  if (!data.athletes) return null;
  
  const targetFirst = targetName.split(' ')[0].toLowerCase();
  const targetLast = targetName.split(' ').pop().toLowerCase();
  
  for (const athlete of data.athletes) {
    if (!athlete.displayName) continue;
    
    const athleteName = athlete.displayName.toLowerCase();
    const athleteFirst = athlete.firstName?.toLowerCase() || '';
    const athleteLast = athlete.lastName?.toLowerCase() || '';
    
    // Check for exact match or close match
    if (athleteName.includes(targetFirst) && athleteName.includes(targetLast)) {
      return athlete;
    }
    
    if (athleteFirst.includes(targetFirst) && athleteLast.includes(targetLast)) {
      return athlete;
    }
  }
  
  return null;
}

// Fetch detailed player data from ESPN by ID
async function fetchESPNPlayerById(playerId, playerName) {
  try {
    // ESPN player profile URL
    const profileUrl = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/athletes/${playerId}`;
    
    console.log(`📊 Fetching detailed data for ${playerName}...`);
    
    const response = await fetch(profileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Referer': 'https://www.espn.com/',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const playerData = await response.json();
    return extractPlayerStats(playerData, playerName);
    
  } catch (error) {
    console.log(`❌ Error fetching ${playerName} details: ${error.message}`);
    return null;
  }
}

// Extract stats from ESPN player data
function extractPlayerStats(data, playerName) {
  const stats = {};
  
  try {
    // Basic info
    if (data.position?.displayName) {
      stats.position = data.position.displayName;
    }
    
    if (data.height) {
      stats.height = data.height;
    }
    
    if (data.age) {
      stats.age = parseInt(data.age);
    }
    
    // Current season stats
    if (data.statistics && data.statistics.length > 0) {
      // Get the most recent season stats
      const currentStats = data.statistics[0].splits?.categories;
      
      if (currentStats) {
        for (const category of currentStats) {
          if (category.name === 'general') {
            for (const stat of category.stats) {
              if (stat.name === 'avgPointsPerGame' || stat.displayName === 'PPG') {
                stats.ppg = parseFloat(stat.value);
              }
              if (stat.name === 'avgReboundsPerGame' || stat.displayName === 'RPG') {
                stats.rpg = parseFloat(stat.value);
              }
              if (stat.name === 'avgAssistsPerGame' || stat.displayName === 'APG') {
                stats.apg = parseFloat(stat.value);
              }
            }
          }
        }
      }
    }
    
    console.log(`📊 ESPN data for ${playerName}:`);
    console.log(`   Position: ${stats.position || 'Not found'}`);
    console.log(`   Height: ${stats.height || 'Not found'}`);
    console.log(`   Age: ${stats.age || 'Not found'}`);
    console.log(`   PPG: ${stats.ppg || 'Not found'}`);
    console.log(`   RPG: ${stats.rpg || 'Not found'}`);
    console.log(`   APG: ${stats.apg || 'Not found'}`);
    
  } catch (error) {
    console.error(`Error extracting stats for ${playerName}:`, error.message);
  }
  
  return stats;
}

// Main function to update players using ESPN
async function updatePlayersWithESPN() {
  try {
    console.log('🏀 Starting ESPN NBA player data update...');
    
    // Get players that need data
    const playersResult = await pool.query(`
      SELECT id, name, team 
      FROM players 
      WHERE active = true 
      AND (
        ppg IS NULL OR ppg = 0 OR 
        position IS NULL OR position = 'N/A' OR position = 'A' OR
        age IS NULL OR height IS NULL
      )
      ORDER BY 
        CASE WHEN ppg IS NULL OR ppg = 0 THEN 0 ELSE 1 END,
        name
      LIMIT 15
    `);
    
    const players = playersResult.rows;
    console.log(`📋 Found ${players.length} players needing data update`);
    
    let updated = 0;
    let failed = 0;
    
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      
      try {
        console.log(`\n🔍 [${i + 1}/${players.length}] Processing ${player.name}...`);
        
        const stats = await getESPNPlayerData(player.name);
        
        if (stats && Object.keys(stats).length > 0) {
          // Update database
          await pool.query(`
            UPDATE players 
            SET 
              position = CASE WHEN $1 IS NOT NULL THEN $1 ELSE position END,
              ppg = CASE WHEN $2 IS NOT NULL THEN $2 ELSE ppg END,
              rpg = CASE WHEN $3 IS NOT NULL THEN $3 ELSE rpg END,
              apg = CASE WHEN $4 IS NOT NULL THEN $4 ELSE apg END,
              age = CASE WHEN $5 IS NOT NULL THEN $5 ELSE age END,
              height = CASE WHEN $6 IS NOT NULL THEN $6 ELSE height END,
              last_updated = CURRENT_DATE
            WHERE id = $7
          `, [
            stats.position || null,
            stats.ppg || null,
            stats.rpg || null,
            stats.apg || null,
            stats.age || null,
            stats.height || null,
            player.id
          ]);
          
          updated++;
          console.log(`✅ Updated ${player.name} in database`);
        } else {
          console.log(`⚠️ No data found for ${player.name}`);
          failed++;
        }
        
        // Respectful delay
        console.log(`⏳ Waiting 5 seconds before next player...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        
      } catch (playerError) {
        console.error(`❌ Error processing ${player.name}:`, playerError.message);
        failed++;
      }
    }
    
    console.log(`\n🎉 ESPN update complete!`);
    console.log(`   ✅ Updated: ${updated} players`);
    console.log(`   ❌ Failed: ${failed} players`);
    
    // Show current database status
    const statusResult = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN ppg > 0 THEN 1 END) as with_ppg,
        COUNT(CASE WHEN position IS NOT NULL AND position != 'N/A' AND position != 'A' THEN 1 END) as with_position,
        COUNT(CASE WHEN age IS NOT NULL AND age > 0 THEN 1 END) as with_age,
        COUNT(CASE WHEN height IS NOT NULL THEN 1 END) as with_height,
        COUNT(CASE WHEN ppg > 0 AND position IS NOT NULL AND position != 'N/A' THEN 1 END) as complete_basic
      FROM players 
      WHERE active = true
    `);
    
    const status = statusResult.rows[0];
    console.log(`\n📊 Current Database Status:`);
    console.log(`   Total active players: ${status.total}`);
    console.log(`   With PPG: ${status.with_ppg} (${Math.round(status.with_ppg/status.total*100)}%)`);
    console.log(`   With position: ${status.with_position} (${Math.round(status.with_position/status.total*100)}%)`);
    console.log(`   With age: ${status.with_age} (${Math.round(status.with_age/status.total*100)}%)`);
    console.log(`   With height: ${status.with_height} (${Math.round(status.with_height/status.total*100)}%)`);
    console.log(`   Complete basic data: ${status.complete_basic} (${Math.round(status.complete_basic/status.total*100)}%)`);
    
  } catch (error) {
    console.error('💥 Fatal error:', error.message);
    console.error(error.stack);
  } finally {
    await pool.end();
  }
}

// Run the ESPN updater
if (require.main === module) {
  updatePlayersWithESPN();
}

module.exports = { updatePlayersWithESPN, getESPNPlayerData };
