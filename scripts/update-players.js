const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function updateNBAPlayers() {
  try {
    console.log('🏀 Starting NBA players update...');
    
    // Fetch current players from Ball Don't Lie API with error handling
    console.log('📡 Calling Ball Don\'t Lie API...');
    const response = await fetch('https://www.balldontlie.io/api/v1/players?per_page=100');
    
    console.log(`📊 API Response Status: ${response.status}`);
    console.log(`📊 Content Type: ${response.headers.get('content-type')}`);
    
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }
    
    const responseText = await response.text();
    console.log(`📄 Response preview: ${responseText.substring(0, 200)}...`);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse JSON response');
      console.error('Response was:', responseText.substring(0, 500));
      throw new Error('API returned invalid JSON');
    }
    
    if (!data || !data.data) {
      throw new Error('API response missing data field');
    }
    
    const players = data.data;
    console.log(`📥 Fetched ${players.length} players from API`);
    
    // Filter for active NBA players (those with teams)
    const activePlayers = players.filter(player => 
      player.team && 
      player.team.id && 
      player.first_name && 
      player.last_name
    );
    
    console.log(`✅ Found ${activePlayers.length} active players`);
    
    // Update database
    let newPlayers = 0;
    let updatedPlayers = 0;
    
    for (const player of activePlayers.slice(0, 10)) { // Limit to first 10 for testing
      const fullName = `${player.first_name} ${player.last_name}`;
      const team = player.team.full_name;
      const position = player.position || 'N/A';
      
      try {
        // Check if player exists
        const existingPlayer = await pool.query(
          'SELECT id FROM players WHERE name = $1',
          [fullName]
        );
        
        if (existingPlayer.rows.length === 0) {
          // Add new player
          await pool.query(`
            INSERT INTO players (name, team, position, active, last_updated) 
            VALUES ($1, $2, $3, true, CURRENT_DATE)
          `, [fullName, team, position]);
          newPlayers++;
          console.log(`➕ Added: ${fullName} (${team})`);
        } else {
          // Update existing player
          await pool.query(`
            UPDATE players 
            SET team = $1, position = $2, active = true, last_updated = CURRENT_DATE 
            WHERE name = $3
          `, [team, position, fullName]);
          updatedPlayers++;
          console.log(`🔄 Updated: ${fullName} (${team})`);
        }
      } catch (error) {
        console.error(`❌ Error processing ${fullName}:`, error.message);
      }
    }
    
    console.log(`🎉 Update complete! Added ${newPlayers} new players, updated ${updatedPlayers} existing players`);
    
  } catch (error) {
    console.error('💥 Error updating NBA players:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the update
updateNBAPlayers();
