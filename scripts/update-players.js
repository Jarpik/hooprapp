const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function scrapeNBAPlayers() {
  try {
    console.log('🏀 Starting NBA players scraping from Basketball Reference...');
    
    // NBA teams and their Basketball Reference codes
    const teams = [
      { code: 'ATL', name: 'Atlanta Hawks' },
      { code: 'BOS', name: 'Boston Celtics' },
      { code: 'BRK', name: 'Brooklyn Nets' },
      { code: 'CHO', name: 'Charlotte Hornets' },
      { code: 'CHI', name: 'Chicago Bulls' },
      { code: 'CLE', name: 'Cleveland Cavaliers' },
      { code: 'DAL', name: 'Dallas Mavericks' },
      { code: 'DEN', name: 'Denver Nuggets' },
      { code: 'DET', name: 'Detroit Pistons' },
      { code: 'GSW', name: 'Golden State Warriors' },
      { code: 'HOU', name: 'Houston Rockets' },
      { code: 'IND', name: 'Indiana Pacers' },
      { code: 'LAC', name: 'LA Clippers' },
      { code: 'LAL', name: 'Los Angeles Lakers' },
      { code: 'MEM', name: 'Memphis Grizzlies' },
      { code: 'MIA', name: 'Miami Heat' },
      { code: 'MIL', name: 'Milwaukee Bucks' },
      { code: 'MIN', name: 'Minnesota Timberwolves' },
      { code: 'NOP', name: 'New Orleans Pelicans' },
      { code: 'NYK', name: 'New York Knicks' },
      { code: 'OKC', name: 'Oklahoma City Thunder' },
      { code: 'ORL', name: 'Orlando Magic' },
      { code: 'PHI', name: 'Philadelphia 76ers' },
      { code: 'PHX', name: 'Phoenix Suns' },
      { code: 'POR', name: 'Portland Trail Blazers' },
      { code: 'SAC', name: 'Sacramento Kings' },
      { code: 'SAS', name: 'San Antonio Spurs' },
      { code: 'TOR', name: 'Toronto Raptors' },
      { code: 'UTA', name: 'Utah Jazz' },
      { code: 'WAS', name: 'Washington Wizards' }
    ];
    
    let totalPlayers = 0;
    let newPlayers = 0;
    let updatedPlayers = 0;
    
    // Process first 5 teams for testing
    for (const team of teams.slice(0, 5)) {
      try {
        console.log(`🔍 Scraping ${team.name}...`);
        
        // Basketball Reference roster URL
        const url = `https://www.basketball-reference.com/teams/${team.code}/2025.html`;
        console.log(`📡 Fetching: ${url}`);
        
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        if (!response.ok) {
          console.log(`⚠️ Failed to fetch ${team.code}: ${response.status}`);
          continue;
        }
        
        const html = await response.text();
        
        // Look for player table rows - Basketball Reference has cleaner structure
        const playerRegex = /<tr[^>]*>.*?<th[^>]*data-stat="player"[^>]*><a[^>]*>([^<]+)<\/a>.*?<td[^>]*data-stat="pos"[^>]*>([^<]*)<\/td>.*?<td[^>]*data-stat="age"[^>]*>([^<]*)<\/td>/gs;
        
        const matches = [...html.matchAll(playerRegex)];
        console.log(`📋 Found ${matches.length} players on ${team.name}`);
        
        for (const match of matches) {
          const playerName = match[1].trim();
          const position = match[2].trim() || 'N/A';
          const age = parseInt(match[3]) || null;
          
          // Skip if name is too short or looks invalid
          if (playerName.length < 3 || playerName.includes('Player') || playerName.includes('Name')) {
            continue;
          }
          
          try {
            // Check if player exists
            const existingPlayer = await pool.query(
              'SELECT id FROM players WHERE name = $1',
              [playerName]
            );
            
            if (existingPlayer.rows.length === 0) {
              // Add new player
              await pool.query(`
                INSERT INTO players (name, team, position, age, active, last_updated) 
                VALUES ($1, $2, $3, $4, true, CURRENT_DATE)
              `, [playerName, team.name, position, age]);
              newPlayers++;
              console.log(`➕ Added: ${playerName} (${team.name}) - ${position}, Age ${age}`);
            } else {
              // Update existing player
              await pool.query(`
                UPDATE players 
                SET team = $1, position = $2, age = $3, active = true, last_updated = CURRENT_DATE 
                WHERE name = $4
              `, [team.name, position, age, playerName]);
              updatedPlayers++;
              console.log(`🔄 Updated: ${playerName} (${team.name}) - ${position}, Age ${age}`);
            }
            
            totalPlayers++;
          } catch (dbError) {
            console.error(`❌ Database error for ${playerName}:`, dbError.message);
          }
        }
        
        // Respectful delay between requests
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (teamError) {
        console.error(`❌ Error processing team ${team.code}:`, teamError.message);
      }
    }
    
    // Clean up bad entries
    console.log('🧹 Cleaning up invalid entries...');
    await pool.query(`
      DELETE FROM players 
      WHERE name IN ('Subscribe Now', 'Manage Favorites', 'Player', 'Name') 
      OR LENGTH(name) < 3
    `);
    
    console.log(`🎉 Scraping complete! Processed ${totalPlayers} players total`);
    console.log(`📊 Added ${newPlayers} new players, updated ${updatedPlayers} existing players`);
    
  } catch (error) {
    console.error('💥 Error scraping NBA players:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the scraper
scrapeNBAPlayers();
