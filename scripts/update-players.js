const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Enhanced Basketball Reference ID generation
function generateBRefID(playerName) {
  const parts = playerName.toLowerCase().split(' ');
  if (parts.length < 2) return null;
  
  let firstName = parts[0].replace(/[^a-z]/g, '');
  let lastName = parts[parts.length - 1].replace(/[^a-z]/g, '');
  
  // Handle special cases
  if (lastName === 'jr' || lastName === 'sr' || lastName === 'iii') {
    lastName = parts[parts.length - 2].replace(/[^a-z]/g, '');
  }
  
  // Special name handling
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
    'luka doncic': 'doncilu01'
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

function extractPlayerData(html, playerName) {
  const stats = {};
  
  try {
    // 1. STATS from SUMMARY section (this works reliably)
    const ptsMatch = html.match(/<span[^>]*data-tip="Points"[^>]*><strong>PTS<\/strong><\/span><p>([0-9.]+)<\/p>/);
    if (ptsMatch) {
      stats.ppg = parseFloat(ptsMatch[1]);
    }
    
    const trbMatch = html.match(/<span[^>]*data-tip="Total Rebounds"[^>]*><strong>TRB<\/strong><\/span><p>([0-9.]+)<\/p>/);
    if (trbMatch) {
      stats.rpg = parseFloat(trbMatch[1]);
    }
    
    const astMatch = html.match(/<span[^>]*data-tip="Assists"[^>]*><strong>AST<\/strong><\/span><p>([0-9.]+)<\/p>/);
    if (astMatch) {
      stats.apg = parseFloat(astMatch[1]);
    }
    
    // 2. POSITION - Look in the player info section more precisely
    const positionPatterns = [
      // Look for actual position words in context
      /Position:<\/strong>\s*([^<\n]+)/i,
      /Position:\s*<\/strong>\s*([A-Z]{1,2}(?:-[A-Z]{1,2})?)/i,
      /<strong>Position<\/strong>[\s\S]*?<p[^>]*>([A-Z]{1,2}(?:-[A-Z]{1,2})?)<\/p>/i,
      // Look for position in meta or structured areas
      /"position"[^>]*:[\s"]*([A-Z]{1,2}(?:-[A-Z]{1,2})?)/i,
      // Last resort - look for common position abbreviations near player name
      new RegExp(`${playerName.split(' ')[0]}[\\s\\S]{0,200}\\b(PG|SG|SF|PF|C|G|F)\\b`, 'i')
    ];
    
    for (const pattern of positionPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        const position = match[1].trim();
        // Validate it's a real position
        if (/^(PG|SG|SF|PF|C|G|F|Guard|Forward|Center)$/i.test(position)) {
          stats.position = position.toUpperCase();
          break;
        }
      }
    }
    
    // 3. HEIGHT - Look for height in various formats
    const heightPatterns = [
      /Height:<\/strong>\s*([0-9]+-[0-9]+|[0-9]'[0-9]+")/i,
      /Height:\s*<\/strong>\s*([0-9]+-[0-9]+|[0-9]'[0-9]+")/i,
      /<strong>Height<\/strong>[\s\S]*?<p[^>]*>([0-9]+-[0-9]+|[0-9]'[0-9]+")<\/p>/i,
      /([0-9]'-[0-9]+"|\d+'\d+")/
    ];
    
    for (const pattern of heightPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        let height = match[1].trim();
        // Convert formats: 6-9 -> 6'9"
        if (/^\d+-\d+$/.test(height)) {
          height = height.replace('-', "'") + '"';
        }
        if (/^\d+'\d+"?$/.test(height)) {
          stats.height = height.endsWith('"') ? height : height + '"';
          break;
        }
      }
    }
    
    // 4. AGE - Look for age information
    const agePatterns = [
      /Born:[\s\S]*?\(age\s+(\d+)\)/i,
      /\(age\s+(\d+)\)/i,
      /Age:\s*(\d+)/i,
      /"age"[^>]*:\s*(\d+)/i
    ];
    
    for (const pattern of agePatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        const age = parseInt(match[1]);
        if (age >= 18 && age <= 45) { // Reasonable NBA age range
          stats.age = age;
          break;
        }
      }
    }
    
    // 5. Alternative: Look for data in JSON-LD structured data
    const jsonLdMatch = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
    if (jsonLdMatch) {
      try {
        const jsonData = JSON.parse(jsonLdMatch[1]);
        if (jsonData.height && !stats.height) {
          stats.height = jsonData.height;
        }
        if (jsonData.position && !stats.position) {
          stats.position = jsonData.position;
        }
        if (jsonData.age && !stats.age) {
          stats.age = parseInt(jsonData.age);
        }
      } catch (e) {
        // JSON parsing failed, continue
      }
    }
    
  } catch (error) {
    console.error(`Error extracting data for ${playerName}:`, error.message);
  }
  
  return stats;
}

async function updateAllPlayersWithCorrectScraping() {
  try {
    console.log('🏀 Starting comprehensive NBA player data update...');
    
    // Get players that still need complete data
    const playersResult = await pool.query(`
      SELECT id, name, team 
      FROM players 
      WHERE active = true 
      AND (ppg IS NULL OR ppg = 0 OR position IS NULL OR position = 'N/A' OR position = 'A')
      ORDER BY name
      LIMIT 50
    `);
    
    const players = playersResult.rows;
    console.log(`📋 Found ${players.length} players needing complete data update`);
    
    let updated = 0;
    let failed = 0;
    let rateLimited = 0;
    
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      
      try {
        console.log(`\n🔍 [${i + 1}/${players.length}] Processing ${player.name}...`);
        
        // Generate Basketball Reference ID
        const brefId = generateBRefID(player.name);
        if (!brefId) {
          console.log(`❌ Could not generate Basketball Reference ID for ${player.name}`);
          failed++;
          continue;
        }
        
        console.log(`🔗 Trying Basketball Reference ID: ${brefId}`);
        const url = `https://www.basketball-reference.com/players/${brefId.charAt(0)}/${brefId}.html`;
        
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
          }
        });
        
        if (response.status === 429) {
          console.log(`⚠️ Rate limited! Waiting 60 seconds...`);
          rateLimited++;
          await new Promise(resolve => setTimeout(resolve, 60000));
          
          // Retry after waiting
          const retryResponse = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          
          if (!retryResponse.ok) {
            console.log(`❌ Still failed after retry: ${retryResponse.status}`);
            failed++;
            continue;
          }
          
          var html = await retryResponse.text();
        } else if (!response.ok) {
          console.log(`❌ HTTP ${response.status} for ${player.name}`);
          failed++;
          continue;
        } else {
          var html = await response.text();
        }
        
        // Verify we have the right player page
        const playerFirstName = player.name.split(' ')[0].toLowerCase();
        const playerLastName = player.name.split(' ').pop().toLowerCase();
        
        if (!html.toLowerCase().includes(playerFirstName) || !html.toLowerCase().includes(playerLastName)) {
          console.log(`❌ Page doesn't match ${player.name} - wrong player or page not found`);
          failed++;
          continue;
        }
        
        console.log(`✅ Found correct Basketball Reference page for ${player.name}`);
        
        // Extract all data
        const stats = extractPlayerData(html, player.name);
        
        console.log(`📊 Extracted data:`);
        console.log(`   PPG: ${stats.ppg || 'Not found'}`);
        console.log(`   RPG: ${stats.rpg || 'Not found'}`);
        console.log(`   APG: ${stats.apg || 'Not found'}`);
        console.log(`   Position: ${stats.position || 'Not found'}`);
        console.log(`   Height: ${stats.height || 'Not found'}`);
        console.log(`   Age: ${stats.age || 'Not found'}`);
        
        // Update database with extracted data
        if (Object.keys(stats).length > 0) {
          await pool.query(`
            UPDATE players 
            SET 
              position = COALESCE($1, position),
              ppg = COALESCE($2, ppg),
              rpg = COALESCE($3, rpg),
              apg = COALESCE($4, apg),
              age = COALESCE($5, age),
              height = COALESCE($6, height),
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
          console.log(`⚠️ No data extracted for ${player.name}`);
          failed++;
        }
        
        // Respectful delay (15 seconds to avoid rate limits)
        console.log(`⏳ Waiting 15 seconds before next player...`);
        await new Promise(resolve => setTimeout(resolve, 15000));
        
      } catch (playerError) {
        console.error(`❌ Error processing ${player.name}:`, playerError.message);
        failed++;
      }
    }
    
    console.log(`\n🎉 Update batch complete!`);
    console.log(`   ✅ Updated: ${updated} players`);
    console.log(`   ❌ Failed: ${failed} players`);
    console.log(`   ⚠️ Rate limited: ${rateLimited} times`);
    
    // Show current database status
    const statusResult = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN ppg > 0 THEN 1 END) as with_stats,
        COUNT(CASE WHEN position IS NOT NULL AND position != 'N/A' AND position != 'A' THEN 1 END) as with_position,
        COUNT(CASE WHEN age IS NOT NULL THEN 1 END) as with_age,
        COUNT(CASE WHEN height IS NOT NULL THEN 1 END) as with_height
      FROM players 
      WHERE active = true
    `);
    
    const status = statusResult.rows[0];
    console.log(`\n📊 Database Status:`);
    console.log(`   Total active players: ${status.total}`);
    console.log(`   With stats (PPG/RPG/APG): ${status.with_stats} (${Math.round(status.with_stats/status.total*100)}%)`);
    console.log(`   With position: ${status.with_position} (${Math.round(status.with_position/status.total*100)}%)`);
    console.log(`   With age: ${status.with_age} (${Math.round(status.with_age/status.total*100)}%)`);
    console.log(`   With height: ${status.with_height} (${Math.round(status.with_height/status.total*100)}%)`);
    
    const remaining = status.total - status.with_stats;
    if (remaining > 0) {
      console.log(`\n🔄 Run this script again to continue updating the remaining players!`);
    } else {
      console.log(`\n🎉 ALL PLAYERS HAVE COMPLETE DATA!`);
    }
    
  } catch (error) {
    console.error('💥 Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the comprehensive updater
updateAllPlayersWithCorrectScraping();
