const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function analyzeAndExtractRealStats() {
  try {
    console.log('🔍 ANALYZING actual HTML structure...');
    
    // Test with LeBron James first
    const url = 'https://www.basketball-reference.com/players/j/jamesle01.html';
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const html = await response.text();
    console.log(`📄 Got HTML (${html.length} chars)`);
    
    // STEP 1: Find and analyze the info box
    console.log('\n🔍 SEARCHING FOR POSITION...');
    const positionMatches = [
      html.match(/<strong>Position:<\/strong>\s*([^<\n]+)/i),
      html.match(/Position<\/strong><\/p>\s*<p[^>]*>([^<]+)<\/p>/i),
      html.match(/<p><strong>Position<\/strong><\/p>\s*<p[^>]*>([^<]+)<\/p>/i),
      html.match(/data-label="Position"[^>]*>([^<]+)<\/p>/i),
    ];
    
    for (let i = 0; i < positionMatches.length; i++) {
      if (positionMatches[i]) {
        console.log(`✅ Position pattern ${i + 1} found: "${positionMatches[i][1].trim()}"`);
      } else {
        console.log(`❌ Position pattern ${i + 1} not found`);
      }
    }
    
    // STEP 2: Look for height
    console.log('\n🔍 SEARCHING FOR HEIGHT...');
    const heightMatches = [
      html.match(/<strong>Height:<\/strong>\s*([^<\n]+)/i),
      html.match(/Height<\/strong><\/p>\s*<p[^>]*>([^<]+)<\/p>/i),
      html.match(/<p><strong>Height<\/strong><\/p>\s*<p[^>]*>([^<]+)<\/p>/i),
    ];
    
    for (let i = 0; i < heightMatches.length; i++) {
      if (heightMatches[i]) {
        console.log(`✅ Height pattern ${i + 1} found: "${heightMatches[i][1].trim()}"`);
      } else {
        console.log(`❌ Height pattern ${i + 1} not found`);
      }
    }
    
    // STEP 3: Look for age/birth info
    console.log('\n🔍 SEARCHING FOR AGE...');
    const ageMatches = [
      html.match(/\(age\s+(\d+)\)/i),
      html.match(/<strong>Born:<\/strong>.*?\(age\s+(\d+)\)/i),
      html.match(/Born.*?age\s+(\d+)/i),
    ];
    
    for (let i = 0; i < ageMatches.length; i++) {
      if (ageMatches[i]) {
        console.log(`✅ Age pattern ${i + 1} found: "${ageMatches[i][1]}"`);
      } else {
        console.log(`❌ Age pattern ${i + 1} not found`);
      }
    }
    
    // STEP 4: Find the per-game stats table
    console.log('\n🔍 SEARCHING FOR 2024-25 STATS...');
    
    // Look for the table containing per-game stats
    if (html.includes('per_game')) {
      console.log('✅ Found per_game table');
      
      // Find the 2024-25 row
      if (html.includes('2024-25')) {
        console.log('✅ Found 2024-25 season');
        
        // Extract a larger chunk around 2024-25 to analyze
        const season2425Index = html.indexOf('2024-25');
        const chunk = html.substring(season2425Index - 200, season2425Index + 2000);
        
        console.log('\n📊 2024-25 STATS CHUNK (showing structure):');
        console.log('='.repeat(50));
        console.log(chunk);
        console.log('='.repeat(50));
        
        // Try to find PPG, RPG, APG in the chunk
        const numberPattern = /(\d+\.\d+)/g;
        const numbers = [...chunk.matchAll(numberPattern)];
        
        console.log(`\n🔢 Found ${numbers.length} decimal numbers in chunk:`);
        numbers.slice(0, 20).forEach((match, i) => {
          console.log(`   ${i + 1}: ${match[1]}`);
        });
        
      } else {
        console.log('❌ No 2024-25 season found');
      }
    } else {
      console.log('❌ No per_game table found');
    }
    
    // STEP 5: Try alternative - look for ANY stats table
    console.log('\n🔍 LOOKING FOR ANY STATS TABLE...');
    const tableRegex = /<table[^>]*id="[^"]*stats[^"]*"[^>]*>/gi;
    const tables = [...html.matchAll(tableRegex)];
    
    console.log(`📊 Found ${tables.length} stats tables:`);
    tables.forEach((table, i) => {
      console.log(`   ${i + 1}: ${table[0]}`);
    });
    
    console.log('\n🎯 ANALYSIS COMPLETE!');
    console.log('Check the logs above to see what data structure we can actually extract from.');
    
  } catch (error) {
    console.error('💥 Analysis error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the analyzer
analyzeAndExtractRealStats();
