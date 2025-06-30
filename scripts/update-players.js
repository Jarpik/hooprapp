const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function updatePlayerStats() {
  try {
    console.log('📊 Starting stats update for existing players...');
    
    // Get all players without stats
    const playersResult = await pool.query(`
      SELECT id, name, team 
      FROM players 
      WHERE active = true 
      AND (ppg IS NULL OR ppg = 0 OR position = 'N/A' OR position IS NULL)
      ORDER BY name
      LIMIT 50
    `);
    
    const players = playersResult.rows;
    console.log(`📋 Found ${players.length} players needing stats update`);
    
    let updated = 0;
    
    for (const player of players) {
      try {
        console.log(`🔍 Getting stats for ${player.name}...`);
        
        // Create search-friendly name for Basketball Reference
        const searchName = player.name.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z-]/g, '');
        
        // Try different Basketball Reference URL patterns
        const urlPatterns = [
          `https://www.basketball-reference.com/players/${searchName.charAt(0)}/${searchName.substring(0, 8)}.html`,
          `https://www.basketball-reference.com/players/${searchName.charAt(0)}/${searchName}.html`
        ];
        
        let playerHtml = null;
        
        for (const url of urlPatterns) {
          try {
            console.log(`📡 Trying: ${url}`);
            const response = await fetch(url, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              }
            });
            
            if (response.ok) {
              playerHtml = await response.text();
              console.log(`✅ Found player page for ${player.name}`);
              break;
            }
          } catch (urlError) {
            console.log(`⚠️ URL failed: ${urlError.message}`);
          }
        }
        
        if (!playerHtml) {
          console.log(`❌ Could not find stats page for ${player.name}`);
          continue;
        }
        
        // Extract stats from the HTML
        const stats = extractPlayerStats(playerHtml, player.name);
        
        if (stats) {
          // Update player with stats
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
            stats.position, 
            stats.ppg, 
            stats.rpg, 
            stats.apg, 
            stats.age, 
            stats.height, 
            player.id
          ]);
          
          updated++;
          console.log(`✅ Updated ${player.name}: ${stats.position}, ${stats.ppg} PPG, ${stats.rpg} RPG, ${stats.apg} APG`);
        } else {
          console.log(`⚠️ No stats found for ${player.name}`);
        }
        
        // Respectful delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (playerError) {
        console.error(`❌ Error processing ${player.name}:`, playerError.message);
      }
    }
    
    console.log(`🎉 Stats update complete! Updated ${updated} players with detailed stats`);
    
  } catch (error) {
    console.error('💥 Error updating player stats:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

function extractPlayerStats(html, playerName) {
  try {
    // Extract current season stats (2024-25)
    const stats = {};
    
    // Position
    const positionMatch = html.match(/<strong>Position:<\/strong>\s*([^<\n]+)/);
    if (positionMatch) {
      stats.position = positionMatch[1].trim().split(/[,&]/)[0]; // Take first position if multiple
    }
    
    // Height
    const heightMatch = html.match(/<strong>(?:Height|Ht):<\/strong>\s*([^<\n]+)/);
    if (heightMatch) {
      stats.height = heightMatch[1].trim();
    }
    
    // Age/Born
    const ageMatch = html.match(/<strong>Born:<\/strong>.*?\(age (\d+)\)/);
    if (ageMatch) {
      stats.age = parseInt(ageMatch[1]);
    }
    
    // Current season stats - look for 2024-25 row in per-game table
    const statPatterns = [
      // Pattern for per-game stats table
      /2024-25.*?<td[^>]*data-stat="pts_per_g"[^>]*>([^<]+)<\/td>.*?<td[^>]*data-stat="trb_per_g"[^>]*>([^<]+)<\/td>.*?<td[^>]*data-stat="ast_per_g"[^>]*>([^<]+)<\/td>/s,
      // Alternative pattern
      /<tr[^>]*id="per_game\.2025"[^>]*>.*?<td[^>]*>([0-9.]+)<\/td>.*?<td[^>]*>([0-9.]+)<\/td>.*?<td[^>]*>([0-9.]+)<\/td>/s
    ];
    
    for (const pattern of statPatterns) {
      const statMatch = html.match(pattern);
      if (statMatch) {
        stats.ppg = parseFloat(statMatch[1]) || 0;
        stats.rpg = parseFloat(statMatch[2]) || 0;
        stats.apg = parseFloat(statMatch[3]) || 0;
        break;
      }
    }
    
    // If no current season, try career averages
    if (!stats.ppg) {
      const careerMatch = html.match(/Career.*?<td[^>]*data-stat="pts_per_g"[^>]*>([^<]+)<\/td>.*?<td[^>]*data-stat="trb_per_g"[^>]*>([^<]+)<\/td>.*?<td[^>]*data-stat="ast_per_g"[^>]*>([^<]+)<\/td>/s);
      if (careerMatch) {
        stats.ppg = parseFloat(careerMatch[1]) || 0;
        stats.rpg = parseFloat(careerMatch[2]) || 0;
        stats.apg = parseFloat(careerMatch[3]) || 0;
      }
    }
    
    console.log(`📊 Extracted stats for ${playerName}:`, stats);
    return Object.keys(stats).length > 0 ? stats : null;
    
  } catch (error) {
    console.error(`❌ Error extracting stats for ${playerName}:`, error.message);
    return null;
  }
}

// Run the stats updater
updatePlayerStats();
