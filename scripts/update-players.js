const { Pool } = require('pg');
const fetch = require('node-fetch');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Enhanced Basketball Reference ID generation with more mappings
function generateBRefID(playerName) {
  const parts = playerName.toLowerCase().split(' ');
  if (parts.length < 2) return null;
  
  let firstName = parts[0].replace(/[^a-z]/g, '');
  let lastName = parts[parts.length - 1].replace(/[^a-z]/g, '');
  
  // Handle special cases
  if (lastName === 'jr' || lastName === 'sr' || lastName === 'iii' || lastName === 'ii' || lastName === 'iv') {
    if (parts.length >= 3) {
      lastName = parts[parts.length - 2].replace(/[^a-z]/g, '');
    }
  }
  
  // Expanded special name handling
  const nameMap = {
    'paul george': 'georgpa01',
    'victor wembanyama': 'wembavi01', 
    'shai gilgeous-alexander': 'gilgesh01',
    'walker kessler': 'kesslwa01',
    'lebron james': 'jamesle01',
    'stephen curry': 'curryst01',
    'kevin durant': 'duranke01',
    'giannis antetokounmpo': 'antetgi01',
    'luka dončić': 'doncilu01',
    'luka doncic': 'doncilu01',
    'nikola jokić': 'jokicni01',
    'nikola jokic': 'jokicni01',
    'bogdan bogdanović': 'bogdabo02',
    'bogdan bogdanovic': 'bogdabo02',
    'jusuf nurkić': 'nurkiju01',
    'jusuf nurkic': 'nurkiju01',
    'kristaps porziņģis': 'porzikr01',
    'kristaps porzingis': 'porzikr01',
    'alperen şengün': 'sengual01',
    'alperen sengun': 'sengual01',
    'franz wagner': 'wagnefr01',
    'moritz wagner': 'wagnemo01',
    'kelly oubre jr': 'oubreke01',
    'kelly oubre': 'oubreke01',
    'derrick white': 'whitede01',
    'coby white': 'whiteco01',
    'aaron gordon': 'gordoaa01',
    'anthony davis': 'davisan02',
    'russell westbrook': 'westbru01',
    'chris paul': 'paulch01',
    'kawhi leonard': 'leonaka01',
    'damian lillard': 'lillada01',
    'jayson tatum': 'tatumja01',
    'jaylen brown': 'brownja02',
    'jimmy butler': 'butleji01',
    'bam adebayo': 'adebaba01'
  };
  
  const fullName = playerName.toLowerCase().replace(/[^a-z\s]/g, '');
  if (nameMap[fullName]) {
    return nameMap[fullName];
  }
  
  // Standard Basketball Reference format
  const lastPart = lastName.substring(0, 5).padEnd(5, 'x');
  const firstPart = firstName.substring(0, 2).padEnd(2, 'x');
  
  return `${lastPart}${firstPart}01`;
}

// Multiple ID attempts for hard-to-find players
function generateAlternativeIDs(playerName) {
  const baseId = generateBRefID(playerName);
  const alternatives = [baseId];
  
  if (baseId) {
    // Try with 02, 03 endings for common names
    alternatives.push(baseId.replace('01', '02'));
    alternatives.push(baseId.replace('01', '03'));
    
    // Try shortened versions
    const parts = playerName.toLowerCase().split(' ');
    if (parts.length >= 2) {
      const shortLast = parts[parts.length - 1].substring(0, 4).padEnd(5, 'x');
      const shortFirst = parts[0].substring(0, 2);
      alternatives.push(`${shortLast}${shortFirst}01`);
    }
  }
  
  return [...new Set(alternatives)].filter(Boolean);
}

// Improved data extraction with multiple strategies
function extractPlayerData(html, playerName) {
  const stats = {};
  
  try {
    // Strategy 1: Look for current season stats table
    const currentSeasonMatch = html.match(/<tr[^>]*id="per_game\.\d{4}"[^>]*>(.*?)<\/tr>/s);
    if (currentSeasonMatch) {
      const row = currentSeasonMatch[1];
      
      // Extract stats from table row
      const statCells = row.match(/<td[^>]*data-stat="[^"]*"[^>]*>([^<]*)<\/td>/g);
      if (statCells) {
        statCells.forEach(cell => {
          const statMatch = cell.match(/data-stat="([^"]*)"[^>]*>([^<]*)</);
          if (statMatch) {
            const statName = statMatch[1];
            const statValue = parseFloat(statMatch[2]);
            
            if (!isNaN(statValue)) {
              if (statName === 'pts_per_g') stats.ppg = statValue;
              if (statName === 'trb_per_g') stats.rpg = statValue;
              if (statName === 'ast_per_g') stats.apg = statValue;
            }
          }
        });
      }
    }
    
    // Strategy 2: Look for summary box stats (your original method as fallback)
    if (!stats.ppg) {
      const ptsMatch = html.match(/<span[^>]*data-tip="[^"]*"[^>]*><strong>PTS<\/strong><\/span>\s*<p[^>]*>([0-9.]+)<\/p>/);
      if (ptsMatch) stats.ppg = parseFloat(ptsMatch[1]);
    }
    
    if (!stats.rpg) {
      const trbMatch = html.match(/<span[^>]*data-tip="[^"]*"[^>]*><strong>TRB<\/strong><\/span>\s*<p[^>]*>([0-9.]+)<\/p>/);
      if (trbMatch) stats.rpg = parseFloat(trbMatch[1]);
    }
    
    if (!stats.apg) {
      const astMatch = html.match(/<span[^>]*data-tip="[^"]*"[^>]*><strong>AST<\/strong><\/span>\s*<p[^>]*>([0-9.]+)<\/p>/);
      if (astMatch) stats.apg = parseFloat(astMatch[1]);
    }
    
    // Strategy 3: Extract player info from meta section
    const infoBoxMatch = html.match(/<div[^>]*class="[^"]*players[^"]*"[^>]*>(.*?)<\/div>/s);
    if (infoBoxMatch) {
      const infoBox = infoBoxMatch[1];
      
      // Position extraction - multiple patterns
      const positionPatterns = [
        /Position:\s*<\/strong>\s*([A-Z-]+)/i,
        /<strong>Position<\/strong>[^>]*>\s*([A-Z-]+)/i,
        /Position[^>]*>\s*<p[^>]*>([A-Z-]+)<\/p>/i,
        /<p[^>]*>Position:\s*([A-Z-]+)<\/p>/i
      ];
      
      for (const pattern of positionPatterns) {
        const match = infoBox.match(pattern);
        if (match && match[1] && /^[A-Z-]+$/.test(match[1].trim())) {
          stats.position = match[1].trim();
          break;
        }
      }
      
      // Height extraction
      const heightPatterns = [
        /Height:\s*<\/strong>\s*([0-9]+-[0-9]+)/i,
        /<strong>Height<\/strong>[^>]*>\s*([0-9]+-[0-9]+|[0-9]'[0-9]+")/i,
        /([0-9]+-[0-9]+|\d+'\s*\d+")/
      ];
      
      for (const pattern of heightPatterns) {
        const match = infoBox.match(pattern);
        if (match && match[1]) {
          let height = match[1].trim();
          if (/^\d+-\d+$/.test(height)) {
            height = height.replace('-', "'") + '"';
          }
          stats.height = height;
          break;
        }
      }
      
      // Age extraction
      const agePatterns = [
        /Born:[\s\S]*?\(age\s+(\d+)\)/i,
        /\(age\s+(\d+)\)/i,
        /Age:\s*(\d+)/i
      ];
      
      for (const pattern of agePatterns) {
        const match = infoBox.match(pattern);
        if (match && match[1]) {
          const age = parseInt(match[1]);
          if (age >= 18 && age <= 50) {
            stats.age = age;
            break;
          }
        }
      }
    }
    
    // Strategy 4: Look in page header/title area
    const headerMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/s);
    if (headerMatch && !stats.position) {
      const posMatch = headerMatch[1].match(/([A-Z]{1,2}(?:-[A-Z]{1,2})?)/);
      if (posMatch && /^(PG|SG|SF|PF|C|G|F)$/i.test(posMatch[1])) {
        stats.position = posMatch[1];
      }
    }
    
  } catch (error) {
    console.error(`Error extracting data for ${playerName}:`, error.message);
  }
  
  return stats;
}

// Enhanced fetch with better error handling and retries
async function fetchPlayerPage(url, playerName, retryCount = 0) {
  const maxRetries = 3;
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Cache-Control': 'no-cache'
  };
  
  try {
    const response = await fetch(url, { headers });
    
    if (response.status === 429) {
      if (retryCount < maxRetries) {
        const waitTime = Math.min(60 * Math.pow(2, retryCount), 300); // Exponential backoff, max 5 minutes
        console.log(`⚠️ Rate limited! Waiting ${waitTime} seconds before retry ${retryCount + 1}...`);
        await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
        return fetchPlayerPage(url, playerName, retryCount + 1);
      } else {
        throw new Error(`Rate limited after ${maxRetries} retries`);
      }
    }
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    
    // Verify we got a real player page
    if (html.includes('Page Not Found') || html.includes('404') || html.length < 1000) {
      throw new Error('Player page not found or invalid');
    }
    
    return html;
    
  } catch (error) {
    if (retryCount < maxRetries && !error.message.includes('not found')) {
      console.log(`⚠️ Fetch error: ${error.message}. Retrying in ${10 * (retryCount + 1)} seconds...`);
      await new Promise(resolve => setTimeout(resolve, 10000 * (retryCount + 1)));
      return fetchPlayerPage(url, playerName, retryCount + 1);
    }
    throw error;
  }
}

async function updatePlayersWithEnhancedScraping() {
  try {
    console.log('🏀 Starting ENHANCED NBA player data update...');
    
    // Get players that need data, prioritizing those with no stats at all
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
      LIMIT 25
    `);
    
    const players = playersResult.rows;
    console.log(`📋 Found ${players.length} players needing data update`);
    
    let updated = 0;
    let failed = 0;
    let skipped = 0;
    
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      
      try {
        console.log(`\n🔍 [${i + 1}/${players.length}] Processing ${player.name}...`);
        
        // Try multiple Basketball Reference IDs
        const alternativeIds = generateAlternativeIDs(player.name);
        let html = null;
        let successfulUrl = null;
        
        for (const brefId of alternativeIds) {
          if (!brefId) continue;
          
          const url = `https://www.basketball-reference.com/players/${brefId.charAt(0)}/${brefId}.html`;
          console.log(`🔗 Trying: ${url}`);
          
          try {
            html = await fetchPlayerPage(url, player.name);
            
            // Verify this is the right player
            const playerFirstName = player.name.split(' ')[0].toLowerCase();
            const playerLastName = player.name.split(' ').pop().toLowerCase();
            
            if (html.toLowerCase().includes(playerFirstName) && html.toLowerCase().includes(playerLastName)) {
              successfulUrl = url;
              console.log(`✅ Found correct page: ${url}`);
              break;
            } else {
              console.log(`❌ Wrong player page, trying next ID...`);
              html = null;
            }
            
          } catch (fetchError) {
            console.log(`❌ Failed to fetch ${url}: ${fetchError.message}`);
            continue;
          }
        }
        
        if (!html) {
          console.log(`❌ Could not find Basketball Reference page for ${player.name}`);
          failed++;
          // Wait before next attempt
          await new Promise(resolve => setTimeout(resolve, 5000));
          continue;
        }
        
        // Extract all available data
        const stats = extractPlayerData(html, player.name);
        
        console.log(`📊 Extracted data for ${player.name}:`);
        console.log(`   PPG: ${stats.ppg || 'Not found'}`);
        console.log(`   RPG: ${stats.rpg || 'Not found'}`);
        console.log(`   APG: ${stats.apg || 'Not found'}`);
        console.log(`   Position: ${stats.position || 'Not found'}`);
        console.log(`   Height: ${stats.height || 'Not found'}`);
        console.log(`   Age: ${stats.age || 'Not found'}`);
        
        // Only update if we got some useful data
        if (stats.ppg || stats.position || stats.age || stats.height) {
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
          console.log(`⚠️ No useful data extracted for ${player.name}`);
          skipped++;
        }
        
        // Progressive delay - longer waits as we make more requests
        const delay = Math.min(20 + (i * 2), 60); // Start at 20s, increase by 2s each request, max 60s
        console.log(`⏳ Waiting ${delay} seconds before next player...`);
        await new Promise(resolve => setTimeout(resolve, delay * 1000));
        
      } catch (playerError) {
        console.error(`❌ Error processing ${player.name}:`, playerError.message);
        failed++;
        // Wait even on errors
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }
    
    console.log(`\n🎉 Enhanced update complete!`);
    console.log(`   ✅ Updated: ${updated} players`);
    console.log(`   ⚠️ Skipped (no data): ${skipped} players`);
    console.log(`   ❌ Failed: ${failed} players`);
    
    // Show detailed database status
    const statusResult = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN ppg > 0 THEN 1 END) as with_ppg,
        COUNT(CASE WHEN rpg > 0 THEN 1 END) as with_rpg,
        COUNT(CASE WHEN apg > 0 THEN 1 END) as with_apg,
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
    console.log(`   With RPG: ${status.with_rpg} (${Math.round(status.with_rpg/status.total*100)}%)`);
    console.log(`   With APG: ${status.with_apg} (${Math.round(status.with_apg/status.total*100)}%)`);
    console.log(`   With position: ${status.with_position} (${Math.round(status.with_position/status.total*100)}%)`);
    console.log(`   With age: ${status.with_age} (${Math.round(status.with_age/status.total*100)}%)`);
    console.log(`   With height: ${status.with_height} (${Math.round(status.with_height/status.total*100)}%)`);
    console.log(`   Complete basic data: ${status.complete_basic} (${Math.round(status.complete_basic/status.total*100)}%)`);
    
    const remaining = status.total - status.complete_basic;
    if (remaining > 0) {
      console.log(`\n🔄 ${remaining} players still need complete data. Run again to continue!`);
    } else {
      console.log(`\n🎉 ALL PLAYERS HAVE BASIC COMPLETE DATA!`);
    }
    
  } catch (error) {
    console.error('💥 Fatal error:', error.message);
    console.error(error.stack);
  } finally {
    await pool.end();
  }
}

// Run the enhanced updater
if (require.main === module) {
  updatePlayersWithEnhancedScraping();
}

module.exports = { updatePlayersWithEnhancedScraping, generateBRefID, extractPlayerData };
