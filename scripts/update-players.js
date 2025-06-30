const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

function generateBRefID(playerName) {
  const parts = playerName.toLowerCase().split(' ');
  if (parts.length < 2) return null;
  
  const firstName = parts[0].replace(/[^a-z]/g, '');
  const lastName = parts[parts.length - 1].replace(/[^a-z]/g, '');
  
  const lastPart = lastName.substring(0, 5).padEnd(5, 'x');
  const firstPart = firstName.substring(0, 2).padEnd(2, 'x');
  
  return `${lastPart}${firstPart}01`;
}

function extractAllPlayerData(html, playerName) {
  const stats = {};
  
  // 1. STATS from SUMMARY section (this works!)
  const ptsMatch = html.match(/<span[^>]*data-tip="Points"[^>]*><strong>PTS<\/strong><\/span><p>([0-9.]+)<\/p>/);
  if (ptsMatch) stats.ppg = parseFloat(ptsMatch[1]);
  
  const trbMatch = html.match(/<span[^>]*data-tip="Total Rebounds"[^>]*><strong>TRB<\/strong><\/span><p>([0-9.]+)<\/p>/);
  if (trbMatch) stats.rpg = parseFloat(trbMatch[1]);
  
  const astMatch = html.match(/<span[^>]*data-tip="Assists"[^>]*><strong>AST<\/strong><\/span><p>([0-9.]+)<\/p>/);
  if (astMatch) stats.apg = parseFloat(astMatch[1]);
  
  // 2. POSITION - Try multiple comprehensive patterns
  const positionPatterns = [
    // Pattern 1: Standard format
    /<strong>Position:<\/strong>\s*([^<\n]+)/i,
    // Pattern 2: In paragraph tags
    /<p><strong>Position<\/strong><\/p>\s*<p[^>]*>([^<]+)<\/p>/i,
    // Pattern 3: Different HTML structure
    /Position<\/strong>[\s\S]*?<p[^>]*>([A-Z]{1,3}(?:-[A-Z]{1,3})?)<\/p>/i,
    // Pattern 4: Meta data format
    /<span[^>]*>Position<\/span>[\s\S]*?<span[^>]*>([A-Z]{1,3})<\/span>/i,
    // Pattern 5: Simple position in parentheses or brackets
    /\b([A-Z]{1,2}(?:-[A-Z]{1,2})?)\b/g
  ];
  
  for (const pattern of positionPatterns) {
    const match = html.match(pattern);
    if (match) {
      let position = match[1].trim();
      // Validate it looks like a position (PG, SG, SF, PF, C, etc.)
      if (/^[A-Z]{1,3}(?:-[A-Z]{1,3})?$/.test(position)) {
        stats.position = position;
        console.log(`📍 Position found: ${position}`);
        break;
      }
    }
  }
  
  // 3. HEIGHT - Multiple patterns
  const heightPatterns = [
    // Pattern 1: Standard format
    /<strong>Height:<\/strong>\s*([^<\n]+)/i,
    // Pattern 2: In paragraph format
    /<p><strong>Height<\/strong><\/p>\s*<p[^>]*>([^<]+)<\/p>/i,
    // Pattern 3: Direct height format
    /(\d+'-\d+"|\d+'\d+"|\d+ ft \d+ in)/i,
    // Pattern 4: Metric to feet conversion context
    /(\d+'-\d+")[\s\S]*?cm/i
  ];
  
  for (const pattern of heightPatterns) {
    const match = html.match(pattern);
    if (match) {
      let height = match[1].trim();
      // Validate it looks like height
      if (/\d+'\d*"?|\d+ ft/.test(height)) {
        stats.height = height;
        console.log(`📏 Height found: ${height}`);
        break;
      }
    }
  }
  
  // 4. AGE - Multiple patterns
  const agePatterns = [
    // Pattern 1: Standard age format
    /\(age\s+(\d+)\)/i,
    // Pattern 2: Born format
    /<strong>Born:<\/strong>[\s\S]*?\(age\s+(\d+)\)/i,
    // Pattern 3: Simple age context
    /age[:\s]+(\d+)/i,
    // Pattern 4: Birth year calculation (if we can find birth year)
    /Born[\s\S]*?(\d{4})[\s\S]*?\(age\s+(\d+)\)/i
  ];
  
  for (const pattern of agePatterns) {
    const match = html.match(pattern);
    if (match) {
      let age = parseInt(match[1]) || parseInt(match[2]);
      if (age && age > 15 && age < 50) { // Reasonable NBA player age
        stats.age = age;
        console.log(`🎂 Age found: ${age}`);
        break;
      }
    }
  }
  
  // 5. Alternative: Look in the player bio/info section more specifically
  const bioSectionMatch = html.match(/<div[^>]*class="[^"]*info[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
  if (bioSectionMatch) {
    const bioSection = bioSectionMatch[1];
    
    // Try position in bio
    if (!stats.position) {
      const bioPosition = bioSection.match(/Position[:\s]*([A-Z]{1,3}(?:-[A-Z]{1,3})?)/i);
      if (bioPosition) {
        stats.position = bioPosition[1];
        console.log(`📍 Position found in bio: ${stats.position}`);
      }
    }
    
    // Try height in bio
    if (!stats.height) {
      const bioHeight = bioSection.match(/(\d+'-\d+")/);
      if (bioHeight) {
        stats.height = bioHeight[1];
        console.log(`📏 Height found in bio: ${stats.height}`);
      }
    }
    
    // Try age in bio
    if (!stats.age) {
      const bioAge = bioSection.match(/age[:\s]*(\d+)/i);
      if (bioAge) {
        stats.age = parseInt(bioAge[1]);
        console.log(`🎂 Age found in bio: ${stats.age}`);
      }
    }
  }
  
  console.log(`📊 Final extracted data for ${playerName}:`, stats);
  return stats;
}

async function updateWithBetterExtraction() {
  try {
    console.log('🏀 Testing better data extraction on a few known players...');
    
    // Test with a few players that we know have good data
    const testPlayers = [
      { name: 'LeBron James', bref_id: 'jamesle01' },
      { name: 'Stephen Curry', bref_id: 'curryst01' },
      { name: 'Giannis Antetokounmpo', bref_id: 'antetgi01' }
    ];
    
    for (const player of testPlayers) {
      try {
        console.log(`\n🔍 Testing extraction for ${player.name}...`);
        
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
        
        // Use enhanced extraction
        const stats = extractAllPlayerData(html, player.name);
        
        console.log(`\n📋 COMPLETE DATA for ${player.name}:`);
        console.log(`   PPG: ${stats.ppg || 'Not found'}`);
        console.log(`   RPG: ${stats.rpg || 'Not found'}`);
        console.log(`   APG: ${stats.apg || 'Not found'}`);
        console.log(`   Position: ${stats.position || 'Not found'}`);
        console.log(`   Height: ${stats.height || 'Not found'}`);
        console.log(`   Age: ${stats.age || 'Not found'}`);
        
        // Update database
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
          
          console.log(`✅ Updated ${player.name} with enhanced data extraction`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        
      } catch (error) {
        console.error(`❌ Error testing ${player.name}:`, error.message);
      }
    }
    
    console.log('\n🎯 Test complete! Check if the enhanced extraction found position/age/height.');
    
  } catch (error) {
    console.error('💥 Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the enhanced extraction test
updateWithBetterExtraction();
