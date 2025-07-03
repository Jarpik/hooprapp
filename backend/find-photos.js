// Script to find and add missing player photos
// Run this as a Node.js script to systematically add photos for all players

const { Pool } = require('pg');
const https = require('https');

// Your database connection (same as server.js)
const pool = new Pool({
  connectionString: 'postgresql://postgres.sdpvfaoekjckxbwcxfjj:Legoboy99!!@aws-0-us-east-1.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

// Function to test if an image URL exists
function testImageUrl(url) {
  return new Promise((resolve) => {
    const request = https.get(url, (response) => {
      // If we get a 200 response and it's an image, the URL works
      resolve(response.statusCode === 200 && response.headers['content-type']?.startsWith('image/'));
    });
    
    request.on('error', () => {
      resolve(false);
    });
    
    // Set timeout to avoid hanging
    request.setTimeout(5000, () => {
      request.destroy();
      resolve(false);
    });
  });
}

// Function to generate potential NBA player IDs for a player
function generatePotentialPlayerIds(playerName) {
  // NBA player IDs follow certain patterns:
  // - Older players (pre-2010): Usually 6-digit numbers starting with 2xxxxx or 1xxxxx
  // - Recent players (2010+): Usually 7-digit numbers starting with 16xxxxx, 162xxxx, 163xxxx, etc.
  // - Very recent (2020+): 164xxxx, 165xxxx, etc.
  
  const currentYear = new Date().getFullYear();
  const playerYear = estimatePlayerYear(playerName);
  
  const potentialIds = [];
  
  if (playerYear < 2010) {
    // Try older ID patterns
    for (let i = 200000; i <= 209999; i += 100) {
      potentialIds.push(i.toString());
    }
    for (let i = 101000; i <= 109999; i += 100) {
      potentialIds.push(i.toString());
    }
  } else if (playerYear < 2015) {
    // Try 2010-2015 patterns
    for (let i = 1625000; i <= 1629999; i += 100) {
      potentialIds.push(i.toString());
    }
  } else if (playerYear < 2020) {
    // Try 2015-2020 patterns  
    for (let i = 1628000; i <= 1629999; i += 50) {
      potentialIds.push(i.toString());
    }
  } else {
    // Try recent patterns
    for (let i = 1630000; i <= 1642000; i += 25) {
      potentialIds.push(i.toString());
    }
  }
  
  return potentialIds.slice(0, 100); // Limit to 100 attempts per player
}

// Estimate when a player likely entered the NBA (rough heuristic)
function estimatePlayerYear(playerName) {
  // This is a very rough estimation - you could improve this by looking at age data
  const currentYear = new Date().getFullYear();
  
  // Some heuristics based on common naming patterns and known eras
  const name = playerName.toLowerCase();
  
  if (name.includes('jr.') || name.includes('iii')) {
    return currentYear - 5; // Likely more recent
  }
  
  // Default to recent for most players
  return currentYear - 3;
}

// Main function to find photos for all players
async function findPhotosForAllPlayers() {
  try {
    console.log('🔍 Finding players without photos...\n');
    
    // Get all players without photos
    const result = await pool.query(`
      SELECT id, name, age, years_pro 
      FROM players 
      WHERE active = true AND (headshot_url IS NULL OR headshot_url = '')
      ORDER BY name
    `);
    
    const playersWithoutPhotos = result.rows;
    console.log(`Found ${playersWithoutPhotos.length} players without photos:\n`);
    
    // Show the list
    playersWithoutPhotos.forEach((player, index) => {
      console.log(`${index + 1}. ${player.name} (Age: ${player.age || 'N/A'}, Years Pro: ${player.years_pro || 'N/A'})`);
    });
    
    console.log('\n🔍 Starting systematic photo search...\n');
    
    const foundPhotos = [];
    const notFoundPlayers = [];
    
    // Process each player
    for (let i = 0; i < playersWithoutPhotos.length; i++) {
      const player = playersWithoutPhotos[i];
      console.log(`\n[${i + 1}/${playersWithoutPhotos.length}] Searching for: ${player.name}`);
      
      // Generate potential player IDs
      const potentialIds = generatePotentialPlayerIds(player.name);
      let foundUrl = null;
      
      // Test each potential ID
      for (const playerId of potentialIds) {
        const testUrl = `https://cdn.nba.com/headshots/nba/latest/1040x760/${playerId}.png`;
        
        const isValid = await testImageUrl(testUrl);
        if (isValid) {
          console.log(`   ✅ Found photo: ID ${playerId}`);
          foundUrl = testUrl;
          break;
        }
        
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      if (foundUrl) {
        foundPhotos.push({
          id: player.id,
          name: player.name,
          url: foundUrl
        });
      } else {
        console.log(`   ❌ No photo found for ${player.name}`);
        notFoundPlayers.push(player.name);
      }
      
      // Progress update every 10 players
      if ((i + 1) % 10 === 0) {
        console.log(`\n📊 Progress: ${i + 1}/${playersWithoutPhotos.length} players processed`);
        console.log(`   Found: ${foundPhotos.length} photos`);
        console.log(`   Not found: ${notFoundPlayers.length} players`);
      }
    }
    
    console.log('\n🎉 Search complete!');
    console.log(`\n📊 Final Results:`);
    console.log(`   Total players without photos: ${playersWithoutPhotos.length}`);
    console.log(`   Photos found: ${foundPhotos.length}`);
    console.log(`   Still missing: ${notFoundPlayers.length}`);
    
    // Generate SQL to update the database
    if (foundPhotos.length > 0) {
      console.log('\n📝 SQL to update your database:\n');
      console.log('-- Update players with found photos');
      
      foundPhotos.forEach(player => {
        console.log(`UPDATE players SET headshot_url = '${player.url}' WHERE id = ${player.id}; -- ${player.name}`);
      });
      
      console.log('\n✅ Copy and run these SQL statements to add the photos to your database!');
    }
    
    // Show remaining players without photos
    if (notFoundPlayers.length > 0) {
      console.log('\n❌ Players still without photos:');
      notFoundPlayers.forEach((name, index) => {
        console.log(`${index + 1}. ${name}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

// Alternative: Manual search function for specific players
async function searchSpecificPlayer(playerName) {
  console.log(`🔍 Searching for photos of: ${playerName}`);
  
  const potentialIds = generatePotentialPlayerIds(playerName);
  
  for (const playerId of potentialIds) {
    const testUrl = `https://cdn.nba.com/headshots/nba/latest/1040x760/${playerId}.png`;
    console.log(`Testing ID ${playerId}...`);
    
    const isValid = await testImageUrl(testUrl);
    if (isValid) {
      console.log(`✅ FOUND: ${playerName} - ID: ${playerId}`);
      console.log(`URL: ${testUrl}`);
      return { playerId, url: testUrl };
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`❌ No photo found for ${playerName}`);
  return null;
}

// Helper function to show players without photos
async function showPlayersWithoutPhotos() {
  try {
    const result = await pool.query(`
      SELECT name, team, age, years_pro 
      FROM players 
      WHERE active = true AND (headshot_url IS NULL OR headshot_url = '')
      ORDER BY name
    `);
    
    console.log(`\n📋 Players without photos (${result.rows.length} total):\n`);
    
    result.rows.forEach((player, index) => {
      console.log(`${index + 1}. ${player.name} - ${player.team} (Age: ${player.age || 'N/A'})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

// Run the script
if (require.main === module) {
  const command = process.argv[2];
  
  if (command === 'list') {
    showPlayersWithoutPhotos();
  } else if (command === 'search' && process.argv[3]) {
    searchSpecificPlayer(process.argv[3]).then(() => pool.end());
  } else {
    findPhotosForAllPlayers();
  }
}

module.exports = {
  findPhotosForAllPlayers,
  searchSpecificPlayer,
  showPlayersWithoutPhotos
};
