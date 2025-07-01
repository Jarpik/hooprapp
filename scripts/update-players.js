const { Pool } = require('pg');
const fetch = require('node-fetch');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Known player IDs for multiple sources
const knownPlayerIDs = {
  // ESPN IDs
  espn: {
    'lebron james': '1966',
    'stephen curry': '3975',
    'kevin durant': '3202',
    'giannis antetokounmpo': '3032977',
    'luka doncic': '4066648',
    'nikola jokic': '3112335',
    'jayson tatum': '4065648',
    'joel embiid': '3059318',
    'alex sarr': '5160992',
    'alex len': '2596107',
    'adem bona': '5105637'
  },
  // Yahoo Sports IDs (more reliable for height/age)
  yahoo: {
    'alex sarr': '10294',
    'lebron james': '3704',
    'stephen curry': '4612',
    'kevin durant': '4244'
  }
};

// Create player name slug for URLs
function createSlug(playerName) {
  return playerName
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, '-');
}

// Calculate age from birth date
function calculateAge(birthDateString) {
  if (!birthDateString) return null;
  
  const today = new Date();
  const birthDate = new Date(birthDateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age >= 18 && age <= 50 ? age : null;
}

// Fetch Yahoo Sports player data
async function fetchYahooSportsData(playerName) {
  try {
    const yahooId = knownPlayerIDs.yahoo[playerName.toLowerCase()];
    if (!yahooId) return null;
    
    const url = `https://sports.yahoo.com/nba/players/${yahooId}/`;
    console.log(`🔗 Trying Yahoo Sports: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.google.com/'
      }
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const html = await response.text();
    
    // Verify this is the right player
    const playerFirstName = playerName.split(' ')[0].toLowerCase();
    const playerLastName = playerName.split(' ').pop().toLowerCase();
    
    if (!html.toLowerCase().includes(playerFirstName) || !html.toLowerCase().includes(playerLastName)) {
      throw new Error('Wrong player page');
    }
    
    console.log(`✅ Found Yahoo Sports page for ${playerName}`);
    return extractYahooData(html, playerName);
    
  } catch (error) {
    console.log(`❌ Yahoo Sports failed for ${playerName}: ${error.message}`);
    return null;
  }
}

// Extract data from Yahoo Sports
function extractYahooData(html, playerName) {
  const stats = {};
  
  try {
    // Height/Weight pattern: "Height/Weight: 7' 0"/205 lbs"
    const heightWeightMatch = html.match(/Height\/Weight:\s*([^\/]+)\/\d+\s*lbs/i);
    if (heightWeightMatch) {
      let height = heightWeightMatch[1].trim();
      // Clean up height format
      height = height.replace(/["''\s]/g, '').replace(/(\d)(\d)/, "$1'$2") + '"';
      if (/^\d+'\d+"$/.test(height)) {
        stats.height = height;
      }
    }
    
    // Position - look for position indicators
    const positionPatterns = [
      /Position[^>]*>([^<]+)</i,
      /"position":"([^"]+)"/i,
      /\b(PG|SG|SF|PF|C|Guard|Forward|Center)\b/i
    ];
    
    for (const pattern of positionPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        const position = match[1].trim().toUpperCase();
        if (/^(PG|SG|SF|PF|C|GUARD|FORWARD|CENTER)$/.test(position)) {
          stats.position = position;
          break;
        }
      }
    }
    
    // Season stats - look for current season averages
    const seasonStatsMatch = html.match(/(\d+\.\d+)\s+(\d+\.\d+)\s+(\d+\.\d+)/);
    if (seasonStatsMatch) {
      const stat1 = parseFloat(seasonStatsMatch[1]);
      const stat2 = parseFloat(seasonStatsMatch[2]);
      const stat3 = parseFloat(seasonStatsMatch[3]);
      
      // Usually in order: PPG, RPG, APG
      if (stat1 >= 0 && stat1 <= 50) stats.ppg = stat1;
      if (stat2 >= 0 && stat2 <= 25) stats.rpg = stat2;
      if (stat3 >= 0 && stat3 <= 15) stats.apg = stat3;
    }
    
    console.log(`📊 Yahoo Sports data for ${playerName}:`);
    console.log(`   Position: ${stats.position || 'Not found'}`);
    console.log(`   Height: ${stats.height || 'Not found'}`);
    console.log(`   PPG: ${stats.ppg || 'Not found'}`);
    console.log(`   RPG: ${stats.rpg || 'Not found'}`);
    console.log(`   APG: ${stats.apg || 'Not found'}`);
    
  } catch (error) {
    console.error(`Error extracting Yahoo data for ${playerName}:`, error.message);
  }
  
  return stats;
}

// Fetch ESPN player data with updated patterns
async function fetchESPNData(playerName) {
  try {
    const espnId = knownPlayerIDs.espn[playerName.toLowerCase()];
    if (!espnId) return null;
    
    const slug = createSlug(playerName);
    const url = `https://www.espn.com/nba/player/_/id/${espnId}/${slug}`;
    console.log(`🔗 Trying ESPN: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.google.com/'
      }
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const html = await response.text();
    
    // Verify this is the right player
    const playerFirstName = playerName.split(' ')[0].toLowerCase();
    const playerLastName = playerName.split(' ').pop().toLowerCase();
    
    if (!html.toLowerCase().includes(playerFirstName) || !html.toLowerCase().includes(playerLastName)) {
      throw new Error('Wrong player page');
    }
    
    console.log(`✅ Found ESPN page for ${playerName}`);
    return extractESPNData(html, playerName);
    
  } catch (error) {
    console.log(`❌ ESPN failed for ${playerName}: ${error.message}`);
    return null;
  }
}

// Extract data from ESPN with updated patterns
function extractESPNData(html, playerName) {
  const stats = {};
  
  try {
    // Position from title: "Alex Sarr - Washington Wizards Power Forward - ESPN"
    const titlePositionMatch = html.match(/<title>[^-]+-[^-]+(Power Forward|Point Guard|Shooting Guard|Small Forward|Center|Guard|Forward)[^<]*<\/title>/i);
    if (titlePositionMatch) {
      const position = titlePositionMatch[1].trim().toUpperCase();
      // Convert full names to abbreviations
      const positionMap = {
        'POINT GUARD': 'PG',
        'SHOOTING GUARD': 'SG', 
        'SMALL FORWARD': 'SF',
        'POWER FORWARD': 'PF',
        'CENTER': 'C',
        'GUARD': 'G',
        'FORWARD': 'F'
      };
      stats.position = positionMap[position] || position;
    }
    
    // Stats from ESPN format: "PTS · 13.0 · 83rd"
    const ptsMatch = html.match(/PTS[^0-9]*(\d+\.\d+)/i);
    if (ptsMatch) {
      const ppg = parseFloat(ptsMatch[1]);
      if (ppg >= 0 && ppg <= 50) stats.ppg = ppg;
    }
    
    const rebMatch = html.match(/REB[^0-9]*(\d+\.\d+)/i);
    if (rebMatch) {
      const rpg = parseFloat(rebMatch[1]);
      if (rpg >= 0 && rpg <= 25) stats.rpg = rpg;
    }
    
    const astMatch = html.match(/AST[^0-9]*(\d+\.\d+)/i);
    if (astMatch) {
      const apg = parseFloat(astMatch[1]);
      if (apg >= 0 && apg <= 15) stats.apg = apg;
    }
    
    // Age from draft info or birth year
    const agePatterns = [
      /Age[^0-9]*(\d+)/i,
      /\((\d+)\s*years?\s*old\)/i,
      /Born[^0-9]*(\d{4})/i  // Birth year, we'll calculate age
    ];
    
    for (const pattern of agePatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        let age = parseInt(match[1]);
        
        // If it's a birth year, calculate current age
        if (age > 1950 && age < 2010) {
          age = new Date().getFullYear() - age;
        }
        
        if (age >= 18 && age <= 50) {
          stats.age = age;
          break;
        }
      }
    }
    
    console.log(`📊 ESPN data for ${playerName}:`);
    console.log(`   Position: ${stats.position || 'Not found'}`);
    console.log(`   Age: ${stats.age || 'Not found'}`);
    console.log(`   PPG: ${stats.ppg || 'Not found'}`);
    console.log(`   RPG: ${stats.rpg || 'Not found'}`);
    console.log(`   APG: ${stats.apg || 'Not found'}`);
    
  } catch (error) {
    console.error(`Error extracting ESPN data for ${playerName}:`, error.message);
  }
  
  return stats;
}

// Wikipedia scraping for birth dates and heights
async function fetchWikipediaData(playerName) {
  try {
    const wikiSlug = playerName.replace(/\s+/g, '_');
    const url = `https://en.wikipedia.org/wiki/${wikiSlug}`;
    console.log(`🔗 Trying Wikipedia: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const html = await response.text();
    
    // Verify this is about the basketball player
    if (!html.toLowerCase().includes('basketball') || !html.toLowerCase().includes('nba')) {
      throw new Error('Not a basketball player page');
    }
    
    console.log(`✅ Found Wikipedia page for ${playerName}`);
    return extractWikipediaData(html, playerName);
    
  } catch (error) {
    console.log(`❌ Wikipedia failed for ${playerName}: ${error.message}`);
    return null;
  }
}

// Extract data from Wikipedia
function extractWikipediaData(html, playerName) {
  const stats = {};
  
  try {
    // Birth date patterns
    const birthPatterns = [
      /born (\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i,
      /\(born[^)]*(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i
    ];
    
    for (const pattern of birthPatterns) {
      const match = html.match(pattern);
      if (match) {
        const day = match[1];
        const month = match[2];
        const year = match[3];
        const birthDate = new Date(`${month} ${day}, ${year}`);
        const age = calculateAge(birthDate);
        if (age) {
          stats.age = age;
          break;
        }
      }
    }
    
    // Height patterns in Wikipedia
    const heightPatterns = [
      /(\d+)\s*ft\s*(\d+)\s*in/i,
      /(\d+)′(\d+)″/,
      /height[^0-9]*(\d+)[^0-9]*(\d+)/i
    ];
    
    for (const pattern of heightPatterns) {
      const match = html.match(pattern);
      if (match && match[1] && match[2]) {
        const feet = parseInt(match[1]);
        const inches = parseInt(match[2]);
        if (feet >= 5 && feet <= 8 && inches >= 0 && inches <= 11) {
          stats.height = `${feet}'${inches}"`;
          break;
        }
      }
    }
    
    console.log(`📊 Wikipedia data for ${playerName}:`);
    console.log(`   Age: ${stats.age || 'Not found'}`);
    console.log(`   Height: ${stats.height || 'Not found'}`);
    
  } catch (error) {
    console.error(`Error extracting Wikipedia data for ${playerName}:`, error.message);
  }
  
  return stats;
}

// Main function to get comprehensive player data
async function getPlayerData(playerName) {
  console.log(`\n🔍 Getting comprehensive data for ${playerName}...`);
  
  const combinedStats = {};
  
  try {
    // Try ESPN first (for stats and position)
    const espnData = await fetchESPNData(playerName);
    if (espnData) {
      Object.assign(combinedStats, espnData);
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Try Yahoo Sports (for height and additional stats)
    const yahooData = await fetchYahooSportsData(playerName);
    if (yahooData) {
      // Merge data, prioritizing non-null values
      Object.keys(yahooData).forEach(key => {
        if (yahooData[key] && !combinedStats[key]) {
          combinedStats[key] = yahooData[key];
        }
      });
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Try Wikipedia for age/height if still missing
    if (!combinedStats.age || !combinedStats.height) {
      const wikiData = await fetchWikipediaData(playerName);
      if (wikiData) {
        Object.keys(wikiData).forEach(key => {
          if (wikiData[key] && !combinedStats[key]) {
            combinedStats[key] = wikiData[key];
          }
        });
      }
    }
    
    console.log(`\n📊 FINAL combined data for ${playerName}:`);
    console.log(`   Position: ${combinedStats.position || 'Not found'}`);
    console.log(`   Height: ${combinedStats.height || 'Not found'}`);
    console.log(`   Age: ${combinedStats.age || 'Not found'}`);
    console.log(`   PPG: ${combinedStats.ppg || 'Not found'}`);
    console.log(`   RPG: ${combinedStats.rpg || 'Not found'}`);
    console.log(`   APG: ${combinedStats.apg || 'Not found'}`);
    
    return combinedStats;
    
  } catch (error) {
    console.error(`Error getting player data for ${playerName}:`, error.message);
    return null;
  }
}

// Main update function
async function updatePlayersWithMultiSource() {
  try {
    console.log('🏀 Starting MULTI-SOURCE NBA player data update...');
    console.log('📊 Using ESPN + Yahoo Sports + Wikipedia for comprehensive data');
    
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
      LIMIT 50
    `);
    
    const players = playersResult.rows;
    console.log(`📋 Found ${players.length} players needing data update`);
    
    let updated = 0;
    let failed = 0;
    
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      
      try {
        console.log(`\n🔍 [${i + 1}/${players.length}] Processing ${player.name}...`);
        
        const stats = await getPlayerData(player.name);
        
        if (stats && Object.keys(stats).length > 0) {
          // Validate data before database update
          const validPosition = stats.position && typeof stats.position === 'string' && stats.position.length <= 10 ? stats.position : null;
          const validPPG = stats.ppg && !isNaN(stats.ppg) && stats.ppg >= 0 && stats.ppg <= 50 ? stats.ppg : null;
          const validRPG = stats.rpg && !isNaN(stats.rpg) && stats.rpg >= 0 && stats.rpg <= 25 ? stats.rpg : null;
          const validAPG = stats.apg && !isNaN(stats.apg) && stats.apg >= 0 && stats.apg <= 15 ? stats.apg : null;
          const validAge = stats.age && !isNaN(stats.age) && stats.age >= 18 && stats.age <= 45 ? stats.age : null;
          const validHeight = stats.height && typeof stats.height === 'string' && /^\d+'\d+"$/.test(stats.height) ? stats.height : null;
          
          // Only update if we have at least one valid piece of data
          if (validPosition || validPPG || validRPG || validAPG || validAge || validHeight) {
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
              validPosition,
              validPPG,
              validRPG,
              validAPG,
              validAge,
              validHeight,
              player.id
            ]);
            
            updated++;
            console.log(`✅ Updated ${player.name} in database with valid data`);
            console.log(`   📊 Updated: Position=${validPosition}, PPG=${validPPG}, RPG=${validRPG}, APG=${validAPG}, Age=${validAge}, Height=${validHeight}`);
          } else {
            console.log(`⚠️ No valid data found for ${player.name} across all sources`);
            failed++;
          }
        } else {
          console.log(`⚠️ No data found for ${player.name} from any source`);
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
    
    console.log(`\n🎉 Multi-source update complete!`);
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
    
    const remaining = status.total - status.complete_basic;
    if (remaining > 0) {
      console.log(`\n🔄 ${remaining} players still need complete data. Run again to continue!`);
    } else {
      console.log(`\n🎉 ALL PLAYERS HAVE COMPLETE DATA!`);
    }
    
  } catch (error) {
    console.error('💥 Fatal error:', error.message);
    console.error(error.stack);
  } finally {
    await pool.end();
  }
}

// Run the multi-source updater
if (require.main === module) {
  updatePlayersWithMultiSource();
}

module.exports = { updatePlayersWithMultiSource, getPlayerData };
