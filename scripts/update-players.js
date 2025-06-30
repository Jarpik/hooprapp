const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function extractRealNBAStats() {
  try {
    console.log('🏀 Extracting REAL NBA stats using correct parsing...');
    
    // Test with known players and their Basketball Reference IDs
    const knownPlayers = [
      { name: 'LeBron James', bref_id: 'jamesle01' },
      { name: 'Stephen Curry', bref_id: 'curryst01' },
      { name: 'Kevin Durant', bref_id: 'duranke01' },
      { name: 'Giannis Antetokounmpo', bref_id: 'antetgi01' },
      { name: 'Luka Dončić', bref_id: 'doncilu01' },
      { name: 'Jayson Tatum', bref_id: 'tatumja01' },
      { name: 'Nikola Jokić', bref_id: 'jokicni01' },
      { name: 'Joel Embiid', bref_id: 'embiijo01' }
    ];
    
    let updated = 0;
    
    for (const player of knownPlayers) {
      try {
        console.log(`\n🔍 Processing ${player.name}...`);
        
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
        
        // Position and Height - try alternative patterns since the basic ones didn't work
        // Look in the player info section more broadly
        const infoSection = html.substring(0, 50000); // First 50k chars usually have player info
        
        // Position - try multiple patterns
        const positionPatterns = [
          /Position:\s*<\/strong>\s*([^<\n]+)/i,
          /Position<\/strong><\/p>\s*<p[^>]*>([^<]+)<\/p>/i,
          /<strong>Position<\/strong>[\s\S]*?<p[^>]*>([^<]+)<\/p>/i,
          /Position[^>]*>([A-Z]{1,2}(?:-[A-Z]{1,2})?)<\/span>/i
        ];
        
        for (const pattern of positionPatterns) {
          const match = infoSection.match(pattern);
          if (match) {
            stats.position = match[1].trim().split(/[,\-&]/)[0].trim();
            console.log(`📍 Position: ${stats.position}`);
            break;
          }
        }
        
        // Age - try in info section
        const agePatterns = [
          /\(age\s+(\d+)\)/i,
          /Born:.*?\(age\s+(\d+)\)/i,
          /age\s+(\d+)/i
        ];
        
        for (const pattern of agePatterns) {
          const match = infoSection.match(pattern);
          if (match) {
            stats.age = parseInt(match[1]);
            console.log(`🎂 Age: ${stats.age}`);
            break;
          }
        }
        
        // Height patterns
        const heightPatterns = [
          /Height:\s*<\/strong>\s*([^<\n]+)/i,
          /Height<\/strong><\/p>\s*<p[^>]*>([^<]+)<\/p>/i,
          /(\d+'-\d+")/
        ];
        
        for (const pattern of heightPatterns) {
          const match = infoSection.match(pattern);
          if (match) {
            stats.height = match[1].trim();
            console.log(`📏 Height: ${stats.height}`);
            break;
          }
        }
        
        // Update database if we found stats
        if (Object.keys(stats).length > 0) {
          // Check if player exists
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
            console.log(`✅ Updated ${player.name} with real stats!`);
          } else {
            console.log(`⚠️ ${player.name} not found in database`);
          }
        } else {
          console.log(`⚠️ No stats extracted for ${player.name}`);
        }
        
        // Respectful delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
      } catch (playerError) {
        console.error(`❌ Error processing ${player.name}:`, playerError.message);
      }
    }
    
    console.log(`\n🎉 Successfully updated ${updated} players with REAL NBA stats!`);
    
    // Show results
    const result = await pool.query(`
      SELECT name, position, ppg, rpg, apg, age, height 
      FROM players 
      WHERE ppg > 0
      ORDER BY ppg DESC
      LIMIT 10
    `);
    
    console.log(`\n📊 Top players by PPG (with real stats):`);
    result.rows.forEach(row => {
      console.log(`   ${row.name}: ${row.position || 'N/A'} | ${row.ppg} PPG, ${row.rpg} RPG, ${row.apg} APG | Age ${row.age || 'N/A'} | ${row.height || 'N/A'}`);
    });
    
  } catch (error) {
    console.error('💥 Error extracting stats:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the real stats extractor
extractRealNBAStats();
