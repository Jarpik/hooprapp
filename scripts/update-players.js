const { Pool } = require('pg');
const fetch = require('node-fetch');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Known ESPN Player IDs for common players
const knownESPNIds = {
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
  'anthony davis': '6583',
  'alex sarr': '5160992',
  'alex len': '2596107',
  'adem bona': '5105637'
};

// Generate potential ESPN player IDs using various strategies
function generatePotentialESPNIds(playerName) {
  const ids = [];
  
  // Check known IDs first
  const knownId = knownESPNIds[playerName.toLowerCase()];
  if (knownId) {
    ids.push(knownId);
    return ids; // Return early if we have a known ID
  }
  
  // Generate potential IDs based on patterns
  // ESPN seems to use sequential IDs, rookies get higher numbers
  
  // Try common ID ranges
  const baseRanges = [
    // Recent rookies (2024-2025)
    [5100000, 5200000],
    // Players from 2020-2024  
    [4000000, 5100000],
    // Players from 2015-2020
    [3000000, 4000000],
    // Veteran players
    [1000, 10000]
  ];
  
  // Generate some IDs to test (we'll try a few from each range)
  for (const [start, end] of baseRanges) {
    // Try a few IDs from each range
    for (let i = 0; i < 5; i++) {
      const randomId = Math.floor(Math.random() * (end - start)) + start;
      ids.push(randomId.toString());
    }
  }
  
  return ids;
}

// Create ESPN profile URL slug from player name
function createESPNSlug(playerName) {
  return playerName
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, '-');
}

// Fetch and parse ESPN player profile
async function fetchESPNProfile(espnId, playerName) {
  try {
    const slug = createESPNSlug(playerName);
    const url = `https://www.espn.com/nba/player/_/id/${espnId}/${slug}`;
    
    console.log(`🔗 Trying ESPN URL: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Referer': 'https://www.google.com/',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site',
        'Sec-Fetch-User': '?1'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const html = await response.text();
    
    // Verify this is the right player page
    const playerFirstName = playerName.split(' ')[0].toLowerCase();
    const playerLastName = playerName.split(' ').pop().toLowerCase();
    
    if (!html.toLowerCase().includes(playerFirstName) || !html.toLowerCase().includes(playerLastName)) {
      throw new Error('Wrong player page');
    }
    
    console.log(`✅ Found correct ESPN page for ${playerName}`);
    return extractESPNStats(html, playerName);
    
  } catch (error) {
    throw error;
  }
}

// Extract player stats from ESPN profile HTML
function extractESPNStats(html, playerName) {
  const stats = {};
  
  try {
    // Position extraction
    const positionPatterns = [
      /Position<\/span><span[^>]*>([^<]+)<\/span>/i,
      /"position":"([^"]+)"/i,
      /Position:\s*([A-Z\-]+)/i
    ];
    
    for (const pattern of positionPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        const position = match[1].trim();
        if (/^[A-Z\-]+$/.test(position) && position.length <= 10) {
          stats.position = position;
          break;
        }
      }
    }
    
    // Height extraction
    const heightPatterns = [
      /Height<\/span><span[^>]*>([^<]+)<\/span>/i,
      /"height":"([^"]+)"/i,
      /Height:\s*([0-9]+['']?\s*[0-9]+"?)/i,
      /(\d+'\s*\d+"|\d+'\d+")/
    ];
    
    for (const pattern of heightPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        const height = match[1].trim();
        if (/\d+['']?\s*\d+"?/.test(height)) {
          stats.height = height.replace(/['']/g, "'");
          if (!stats.height.includes('"')) {
            stats.height += '"';
          }
          break;
        }
      }
    }
    
    // Age extraction
    const agePatterns = [
      /Age<\/span><span[^>]*>(\d+)<\/span>/i,
      /"age":(\d+)/i,
      /Age:\s*(\d+)/i,
      /\((\d+)\s*years?\s*old\)/i
    ];
    
    for (const pattern of agePatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        const age = parseInt(match[1]);
        if (age >= 18 && age <= 50) {
          stats.age = age;
          break;
        }
      }
    }
    
    // Stats extraction (PPG, RPG, APG)
    const statPatterns = [
      // Current season averages
      /PTS<\/span><span[^>]*>([0-9.]+)<\/span>/i,
      /PPG[^>]*>([0-9.]+)</i,
      /Points[^>]*>([0-9.]+)</i,
    ];
    
    for (const pattern of statPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        const ppg = parseFloat(match[1]);
        if (ppg > 0 && ppg < 50) {
          stats.ppg = ppg;
          break;
        }
      }
    }
    
    // RPG
    const reboundPatterns = [
      /REB<\/span><span[^>]*>([0-9.]+)<\/span>/i,
      /RPG[^>]*>([0-9.]+)</i,
      /Rebounds[^>]*>([0-9.]+)</i,
    ];
    
    for (const pattern of reboundPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        const rpg = parseFloat(match[1]);
        if (rpg > 0 && rpg < 30) {
          stats.rpg = rpg;
          break;
        }
      }
    }
    
    // APG
    const assistPatterns = [
      /AST<\/span><span[^>]*>([0-9.]+)<\/span>/i,
      /APG[^>]*>([0-9.]+)</i,
      /Assists[^>]*>([0-9.]+)</i,
    ];
    
    for (const pattern of assistPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        const apg = parseFloat(match[1]);
        if (apg > 0 && apg < 20) {
          stats.apg = apg;
          break;
        }
      }
    }
    
    console.log(`📊 Extracted ESPN data for ${playerName}:`);
    console.log(`   Position: ${stats.position || 'Not found'}`);
    console.log(`   Height: ${stats.height || 'Not found'}`);
    console.log(`   Age: ${stats.age || 'Not found'}`);
    console.log(`   PPG: ${stats.ppg || 'Not found'}`);
    console.log(`   RPG: ${stats.rpg || 'Not found'}`);
    console.log(`   APG: ${stats.apg || 'Not found'}`);
    
  } catch (error) {
    console.error(`Error extracting ESPN stats for ${playerName}:`, error.message);
  }
  
  return stats;
}

// Main function to get player data from ESPN
async function getESPNPlayerData(playerName) {
  const potentialIds = generatePotentialESPNIds(playerName);
  
  console.log(`🔍 Trying ${potentialIds.length} potential ESPN IDs for ${playerName}...`);
  
  for (const espnId of potentialIds) {
    try {
      const stats = await fetchESPNProfile(espnId, playerName);
      
      // If we got some meaningful data, return it
      if (stats && (stats.position || stats.ppg || stats.age || stats.height)) {
        console.log(`✅ Successfully found data for ${playerName} with ESPN ID: ${espnId}`);
        
        // Add the successful ID to our known list for future runs
        knownESPNIds[playerName.toLowerCase()] = espnId;
        
        return stats;
      }
      
    } catch (error) {
      console.log(`❌ ESPN ID ${espnId} failed: ${error.message}`);
      continue;
    }
    
    // Small delay between attempts
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return null;
}

// Main update function
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
      LIMIT 10
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
          console.log(`⚠️ No ESPN data found for ${player.name}`);
          failed++;
        }
        
        // Respectful delay between players
        console.log(`⏳ Waiting 8 seconds before next player...`);
        await new Promise(resolve => setTimeout(resolve, 8000));
        
      } catch (playerError) {
        console.error(`❌ Error processing ${player.name}:`, playerError.message);
        failed++;
        await new Promise(resolve => setTimeout(resolve, 5000));
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
