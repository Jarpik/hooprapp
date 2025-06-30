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
    console.log('🏀 Starting NBA players scraping...');
    
    // ESPN NBA teams (we'll scrape each team's roster)
    const teams = [
      'atlanta-hawks', 'boston-celtics', 'brooklyn-nets', 'charlotte-hornets',
      'chicago-bulls', 'cleveland-cavaliers', 'dallas-mavericks', 'denver-nuggets',
      'detroit-pistons', 'golden-state-warriors', 'houston-rockets', 'indiana-pacers',
      'la-clippers', 'los-angeles-lakers', 'memphis-grizzlies', 'miami-heat',
      'milwaukee-bucks', 'minnesota-timberwolves', 'new-orleans-pelicans', 'new-york-knicks',
      'oklahoma-city-thunder', 'orlando-magic', 'philadelphia-76ers', 'phoenix-suns',
      'portland-trail-blazers', 'sacramento-kings', 'san-antonio-spurs', 'toronto-raptors',
      'utah-jazz', 'washington-wizards'
    ];
    
    const teamDisplayNames = {
      'atlanta-hawks': 'Atlanta Hawks',
      'boston-celtics': 'Boston Celtics',
      'brooklyn-nets': 'Brooklyn Nets',
      'charlotte-hornets': 'Charlotte Hornets',
      'chicago-bulls': 'Chicago Bulls',
      'cleveland-cavaliers': 'Cleveland Cavaliers',
      'dallas-mavericks': 'Dallas Mavericks',
      'denver-nuggets': 'Denver Nuggets',
      'detroit-pistons': 'Detroit Pistons',
      'golden-state-warriors': 'Golden State Warriors',
      'houston-rockets': 'Houston Rockets',
      'indiana-pacers': 'Indiana Pacers',
      'la-clippers': 'LA Clippers',
      'los-angeles-lakers': 'Los Angeles Lakers',
      'memphis-grizzlies': 'Memphis Grizzlies',
      'miami-heat': 'Miami Heat',
      'milwaukee-bucks': 'Milwaukee Bucks',
      'minnesota-timberwolves': 'Minnesota Timberwolves',
      'new-orleans-pelicans': 'New Orleans Pelicans',
      'new-york-knicks': 'New York Knicks',
      'oklahoma-city-thunder': 'Oklahoma City Thunder',
      'orlando-magic': 'Orlando Magic',
      'philadelphia-76ers': 'Philadelphia 76ers',
      'phoenix-suns': 'Phoenix Suns',
      'portland-trail-blazers': 'Portland Trail Blazers',
      'sacramento-kings': 'Sacramento Kings',
      'san-antonio-spurs': 'San Antonio Spurs',
      'toronto-raptors': 'Toronto Raptors',
      'utah-jazz': 'Utah Jazz',
      'washington-wizards': 'Washington Wizards'
    };
    
    let totalPlayers = 0;
    let newPlayers = 0;
    let updatedPlayers = 0;
    
    // Process each team
    for (const team of teams.slice(0, 3)) { // Start with first 3 teams for testing
      try {
        console.log(`🔍 Scraping ${teamDisplayNames[team]}...`);
        
        const url = `https://www.espn.com/nba/team/roster/_/name/${team}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          console.log(`⚠️ Failed to fetch ${team}: ${response.status}`);
          continue;
        }
        
        const html = await response.text();
        
        // Simple regex to extract player names from ESPN roster page
        // Look for patterns like: >Player Name</a> or >Player Name
        const nameRegex = /class="[^"]*"[^>]*>([A-Z][a-z]+ [A-Z][a-z]+(?:\s[A-Z][a-z]+)?)<\/a>/g;
        const matches = [...html.matchAll(nameRegex)];
        
        console.log(`📋 Found ${matches.length} potential players on ${team}`);
        
        for (const match of matches) {
          const playerName = match[1].trim();
          
          // Skip if name is too short or contains weird characters
          if (playerName.length < 5 || /[0-9]/.test(playerName)) {
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
                INSERT INTO players (name, team, position, active, last_updated) 
                VALUES ($1, $2, $3, true, CURRENT_DATE)
              `, [playerName, teamDisplayNames[team], 'TBD']);
              newPlayers++;
              console.log(`➕ Added: ${playerName} (${teamDisplayNames[team]})`);
            } else {
              // Update existing player
              await pool.query(`
                UPDATE players 
                SET team = $1, active = true, last_updated = CURRENT_DATE 
                WHERE name = $2
              `, [teamDisplayNames[team], playerName]);
              updatedPlayers++;
              console.log(`🔄 Updated: ${playerName} (${teamDisplayNames[team]})`);
            }
            
            totalPlayers++;
          } catch (dbError) {
            console.error(`❌ Database error for ${playerName}:`, dbError.message);
          }
        }
        
        // Small delay between requests to be respectful
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (teamError) {
        console.error(`❌ Error processing team ${team}:`, teamError.message);
      }
    }
    
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
