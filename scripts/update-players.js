const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Function to generate Basketball Reference ID from player name
function generateBRefID(playerName) {
  // Basketball Reference naming convention: first 5 letters of last name + first 2 of first name + 01
  const parts = playerName.toLowerCase().split(' ');
  if (parts.length < 2) return null;
  
  const firstName = parts[0].replace(/[^a-z]/g, '');
  const lastName = parts[parts.length - 1].replace(/[^a-z]/g, '');
  
  const lastPart = lastName.substring(0, 5).padEnd(5, 'x');
  const firstPart = firstName.substring(0, 2).padEnd(2, 'x');
  
  return `${lastPart}${firstPart}01`;
}

async function updateAllPlayersWithStats() {
  try {
    console.log('🏀 Updating ALL players in database with real stats...');
    
    // Get ALL players from database
    const playersResult = await pool.query(`
      SELECT id, name, team 
      FROM players 
      WHERE active = true 
      ORDER BY name
    `);
    
    const allPlayers = playersResult.rows;
    console.log(`📋 Found ${allPlayers.length} total players to update`);
    
    let updated = 0;
    let failed = 0;
    
    // Process each player
    for (let i = 0; i < allPlayers.length; i++) {
      const player = allPlayers[i];
      
      try {
        console.log(`\n🔍 [${i + 1}/${allPlayers.length}] Processing ${player.name}...`);
        
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
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        if (!response.ok) {
          console.log(`❌ Basketball Reference page not found for ${player.name} (${response.status})`);
          failed++;
          continue;
        }
        
        const html = await response.text();
        
        // Verify this is the right player by checking if name appears in HTML
        if (!html.toLowerCase().includes(player.name.toLowerCase())) {
          console.log(`❌ Page doesn't match ${player.name} - wrong player`);
          failed++;
          continue;
        }
        
        console.log(`✅ Found correct Basketball Reference page for ${player.name}`);
        
        // Extract stats from the SUMMARY section
        const stats = {};
        
        // PPG - Points
        const ptsMatch = html.match(/<span[^>]*data-tip="Points"[^>]*><strong>PTS<\/strong><\/span><p>([0-9.]+)<\/p>/);
        if (ptsMatch) {
          stats.ppg = parseFloat(ptsMatch[1]);
          console.log(`📊 PPG: ${stats.ppg}`);
        }
        
        // RPG - Total Rebounds  
        const trbMatch = html.match(/<span[^>]*data-tip="Total Rebounds"[^>]*><strong>TRB<\/strong><\/span><p>([0-9.]+)<\/p>/);
        if (trbMatch) {
          stats.rpg = parseFloat(trbMatch[1]);
          console.log(`📊 RPG: ${stats.rpg}`);
        }
        
        // APG - Assists
        const astMatch = html.match(/<span[^>]*data-tip="Assists"[^>]*><strong>AST<\/strong><\/span><p>([0-9.]+)<\/p>/);
        if (astMatch) {
          stats.apg = parseFloat(astMatch[1]);
          console.log(`📊 APG: ${stats.apg}`);
        }
        
        // Position, Age, Height
        const infoSection = html.substring(0, 50000);
        
        // Position
        const positionPatterns = [
          /Position:\s*<\/strong>\s*([^<\n]+)/i,
          /Position<\/strong><\/p>\s*<p[^>]*>([^<]+)<\/p>/i,
          /<strong>Position<\/strong>[\s\S]*?<p[^>]*>([^<]+)<\/p>/i
        ];
        
        for (const pattern of positionPatterns) {
          const match = infoSection.match(pattern);
          if (match) {
            stats.position = match[1].trim().split(/[,\-&]/)[0].trim();
            console.log(`📍 Position: ${stats.position}`);
            break;
          }
        }
        
        // Age
        const ageMatch = infoSection.match(/\(age\s+(\d+)\)/i);
        if (ageMatch) {
          stats.age = parseInt(ageMatch[1]);
          console.log(`🎂 Age: ${stats.age}`);
        }
        
        // Height
        const heightMatch = infoSection.match(/(\d+'-\d+")/);
        if (heightMatch) {
          stats.height = heightMatch[1].trim();
          console.log(`📏 Height: ${stats.height}`);
        }
        
        // Update database
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
          console.log(`✅ Updated ${player.name} with real stats!`);
        } else {
          console.log(`⚠️ No stats extracted for ${player.name}`);
          failed++;
        }
        
        // Respectful delay between requests
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (playerError) {
        console.error(`❌ Error processing ${player.name}:`, playerError.message);
        failed++;
      }
    }
    
    console.log(`\n🎉 COMPLETE! Updated ${updated} players, ${failed} failed`);
    
    // Show final stats
    const finalResult = await pool.query(`
      SELECT COUNT(*) as total_with_stats,
             AVG(ppg) as avg_ppg,
             MAX(ppg) as max_ppg,
             MIN(ppg) as min_ppg
      FROM players 
      WHERE active = true AND ppg > 0
    `);
    
    const finalStats = finalResult.rows[0];
    console.log(`📊 Final Database Stats:`);
    console.log(`   Players with stats: ${finalStats.total_with_stats}`);
    console.log(`   Average PPG: ${Math.round(finalStats.avg_ppg * 10) / 10}`);
    console.log(`   Highest PPG: ${finalStats.max_ppg}`);
    console.log(`   Lowest PPG: ${finalStats.min_ppg}`);
    
  } catch (error) {
    console.error('💥 Error updating all players:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the complete updater
updateAllPlayersWithStats();
