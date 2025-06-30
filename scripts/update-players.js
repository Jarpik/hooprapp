const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function debugPlayerStats() {
  try {
    console.log('🔍 DEBUGGING: Testing stats extraction...');
    
    // Test with a few well-known players
    const testPlayers = [
      { name: 'LeBron James', expectedUrl: 'jamesle01' },
      { name: 'Stephen Curry', expectedUrl: 'curryst01' },
      { name: 'Giannis Antetokounmpo', expectedUrl: 'antetgi01' }
    ];
    
    for (const player of testPlayers) {
      console.log(`\n🏀 Testing ${player.name}...`);
      
      // Try the standard Basketball Reference URL format
      const url = `https://www.basketball-reference.com/players/${player.expectedUrl.charAt(0)}/${player.expectedUrl}.html`;
      
      try {
        console.log(`📡 Fetching: ${url}`);
        
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        console.log(`📊 Response Status: ${response.status}`);
        console.log(`📊 Content Type: ${response.headers.get('content-type')}`);
        
        if (response.ok) {
          const html = await response.text();
          console.log(`📄 HTML Length: ${html.length} characters`);
          
          // Look for key indicators
          const hasPlayerName = html.includes(player.name);
          const hasStatsTable = html.includes('per_game');
          const hasPosition = html.includes('Position:');
          
          console.log(`✅ Contains player name: ${hasPlayerName}`);
          console.log(`✅ Contains stats table: ${hasStatsTable}`);
          console.log(`✅ Contains position: ${hasPosition}`);
          
          // Try to extract basic info
          const positionMatch = html.match(/<strong>Position:<\/strong>\s*([^<\n]+)/);
          const heightMatch = html.match(/<strong>Height:<\/strong>\s*([^<\n]+)/);
          
          if (positionMatch) console.log(`📍 Position found: ${positionMatch[1].trim()}`);
          if (heightMatch) console.log(`📏 Height found: ${heightMatch[1].trim()}`);
          
          // Look for 2024-25 stats
          const currentSeasonMatch = html.includes('2024-25');
          console.log(`📅 Has 2024-25 season: ${currentSeasonMatch}`);
          
          if (currentSeasonMatch) {
            // Show a snippet around the 2024-25 season
            const seasonIndex = html.indexOf('2024-25');
            const snippet = html.substring(seasonIndex, seasonIndex + 500);
            console.log(`📊 2024-25 snippet: ${snippet.substring(0, 200)}...`);
          }
          
        } else {
          console.log(`❌ Failed to fetch: ${response.status} ${response.statusText}`);
        }
        
      } catch (error) {
        console.log(`❌ Error fetching ${player.name}: ${error.message}`);
      }
      
      // Delay between requests
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    console.log('\n🎉 Debug complete! Check the logs above to see what we can extract.');
    
  } catch (error) {
    console.error('💥 Debug error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the debug
debugPlayerStats();
