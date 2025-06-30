const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function updatePlayerStatsFixed() {
  try {
    console.log('📊 Starting FIXED stats update...');
    
    // Test with known players first
    const knownPlayers = [
      { name: 'LeBron James', bref_id: 'jamesle01' },
      { name: 'Stephen Curry', bref_id: 'curryst01' },
      { name: 'Kevin Durant', bref_id: 'duranke01' },
      { name: 'Giannis Antetokounmpo', bref_id: 'antetgi01' },
      { name: 'Luka Dončić', bref_id: 'doncilu01' }
    ];
    
    let updated = 0;
    
    for (const player of knownPlayers) {
      try {
        console.log(`🔍 Processing ${player.name}...`);
        
        const url = `https://www.basketball-reference.com/players/${player.bref_id.charAt(0)}/${player.bref_id}.html`;
        
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        if (!response.ok) {
          console.log(`❌ Failed to fetch ${player.name}: ${response.status}`);
          continue;
        }
        
        const html = await response.text();
        console.log(`📄 Fetched HTML for ${player.name} (${html.length} chars)`);
        
        // Extract player info using simpler, more reliable patterns
        const stats = {};
        
        // Position - look for the meta info section
        const positionMatch = html.match(/<strong>Position:<\/strong>\s*([^<\n]+)/i) || 
                            html.match(/Position<\/span><\/strong><\/p>\s*<p>([^<]+)<\/p>/i);
        if (positionMatch) {
          stats.position = positionMatch[1].trim().split(/[,\-&]/)[0].trim(); // Take first position
          console.log(`📍 Position: ${stats.position}`);
        }
        
        // Height
        const heightMatch = html.match(/<strong>Height:<\/strong>\s*([^<\n]+)/i) ||
                          html.match(/Height<\/span><\/strong><\/p>\s*<p>([^<]+)<\/p>/i);
        if (heightMatch) {
          stats.height = heightMatch[1].trim();
          console.log(`📏 Height: ${stats.height}`);
        }
        
        // Age/Born
        const ageMatch = html.match(/born.*?\(age\s+(\d+)\)/i) ||
                       html.match(/<strong>Born:<\/strong>.*?\(age\s+(\d+)\)/i);
        if (ageMatch) {
          stats.age = parseInt(ageMatch[1]);
          console.log(`🎂 Age: ${stats.age}`);
        }
        
        // Stats - look for 2024-25 season row in any stats table
        // This is more flexible pattern matching
        const seasonRegex = /2024-25.*?<td[^>]*>.*?<\/td>.*?<td[^>]*>.*?<\/td>.*?<td[^>]*>.*?<\/td>.*?<td[^>]*>.*?<\/td>.*?<td[^>]*>.*?<\/td>.*?<td[^>]*>.*?<\/td>.*?<td[^>]*>.*?<\/td>.*?<td[^>]*>.*?<\/td>.*?<td[^>]*>.*?<\/td>.*?<td[^>]*>.*?<\/td>.*?<td[^>]*>.*?<\/td>.*?<td[^>]*>.*?<\/td>.*?<td[^>]*>.*?<\/td>.*?<td[^>]*>.*?<\/td>.*?<td[^>]*>.*?<\/td>.*?<td[^>]*>.*?<\/td>.*?<td[^>]*>.*?<\/td>.*?<td[^>]*>.*?<\/td>.*?<td[^>]*>.*?<\/td>.*?<td[^>]*>.*?<\/td>.*?<td[^>]*>.*?<\/td>.*?<td[^>]*>.*?<\/td>.*?<td[^>]*>.*?<\/td>.*?<td[^>]*>.*?<\/td>.*?<td[^>]*>.*?<\/td>.*?<td[^>]*>.*?<\/td>.*?<td[^>]*>.*?<\/td>.*?<td[^>]*>.*?<\/td>.*?<td[^>]*>([0-9.]+)<\/td>.*?<td[^>]*>([0-9.]+)<\/td>.*?<td[^>]*>([0-9.]+)<\/td>/s;
        
        // Try to find the per-game stats table more directly
        const perGameSection = html.indexOf('per_game');
        if (perGameSection !== -1) {
          const tableSection = html.substring(perGameSection, perGameSection + 10000);
          
          // Look for 2024-25 in this section
          if (tableSection.includes('2024-25')) {
            console.log(`📊 Found 2024-25 stats section for ${player.name}`);
            
            // Extract numbers after 2024-25 - this is hacky but might work
            const statsMatch = tableSection.match(/2024-25[\s\S]*?(\d+\.\d+)[\s\S]*?(\d+\.\d+)[\s\S]*?(\d+\.\d+)/);
            if (statsMatch) {
              // These might be PPG, RPG, APG in some order
              const nums = [parseFloat(statsMatch[1]), parseFloat(statsMatch[2]), parseFloat(statsMatch[3])];
              stats.ppg = nums.find(n => n > 10 && n < 40) || nums[0]; // PPG usually 10-40
              stats.rpg = nums.find(n => n > 3 && n < 15) || nums[1];  // RPG usually 3-15
              stats.apg = nums.find(n => n > 2 && n < 12) || nums[2];  // APG usually 2-12
              
              console.log(`📊 Stats found: ${stats.ppg} PPG, ${stats.rpg} RPG, ${stats.apg} APG`);
            }
          }
        }
        
        // If we found ANY stats, update the database
        if (Object.keys(stats).length > 0) {
          // Check if player exists in database
          const playerCheck = await pool.query('SELECT id FROM players WHERE name = $1', [player.name]);
          
          if (playerCheck.rows.length > 0) {
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
              WHERE name = $7
            `, [
              stats.position || null,
              stats.ppg || null,
              stats.rpg || null,
              stats.apg || null,
              stats.age || null,
              stats.height || null,
              player.name
            ]);
            
            updated++;
            console.log(`✅ Updated ${player.name} in database`);
          } else {
            console.log(`⚠️ ${player.name} not found in database`);
          }
        } else {
          console.log(`⚠️ No usable stats found for ${player.name}`);
        }
        
        // Delay between requests
        await new Promise(resolve => setTimeout(resolve, 3000));
        
      } catch (playerError) {
        console.error(`❌ Error processing ${player.name}:`, playerError.message);
      }
    }
    
    console.log(`🎉 Updated ${updated} players with stats from Basketball Reference`);
    
    // Show what we have now
    const result = await pool.query(`
      SELECT name, position, ppg, rpg, apg, age, height 
      FROM players 
      WHERE name IN ('LeBron James', 'Stephen Curry', 'Kevin Durant', 'Giannis Antetokounmpo', 'Luka Dončić')
      ORDER BY name
    `);
    
    console.log(`📊 Sample of updated players:`);
    result.rows.forEach(row => {
      console.log(`   ${row.name}: ${row.position || 'N/A'}, ${row.ppg || 0} PPG, ${row.rpg || 0} RPG, ${row.apg || 0} APG`);
    });
    
  } catch (error) {
    console.error('💥 Error updating stats:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the fixed stats updater
updatePlayerStatsFixed();
