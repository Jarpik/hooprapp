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
    
    // Fetch current players from Ball Don't Lie API
    const response = await fetch('https://www.balldontlie.io/api/v1/players?per_page=100');
    const data = await response.json();
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
    
    for (const player of activePlayers) {
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
        } else {
          // Update existing player
          await pool.query(`
            UPDATE players 
            SET team = $1, position = $2, active = true, last_updated = CURRENT_DATE 
            WHERE name = $3
          `, [team, position, fullName]);
          updatedPlayers++;
        }
      } catch (error) {
        console.error(`❌ Error processing ${fullName}:`, error.message);
      }
    }
    
    console.log(`🎉 Update complete! Added ${newPlayers} new players, updated ${updatedPlayers} existing players`);
    
  } catch (error) {
    console.error('💥 Error updating NBA players:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the update
updateNBAPlayers();
