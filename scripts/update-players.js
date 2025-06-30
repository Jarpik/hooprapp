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
    console.log('🏀 Starting FULL NBA players scraping...');
    
    // ALL 30 NBA teams
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
    
    console.log(`📊 Processing ALL ${teams.length} NBA teams...`);
    
    // Process ALL teams (not just 5)
    for (const team of teams) {
      try {
        console.log(`🔍 Scraping ${team.name}... (${teams.indexOf(team) + 1}/${teams.length})`);
        
        // Try multiple URL patterns for Basketball Reference
        const urls = [
          `https://www.basketball-reference.com/teams/${team.code}/2025.html`,
          `https://www.basketball-reference.com/teams/${team.code}/2024.html`
        ];
        
        let html = null;
        for (const url of urls) {
          try {
            console.log(`📡 Trying: ${url}`);
            const response = await fetch(url, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              }
            });
            
            if (response.ok) {
              html = await response.text();
              console.log(`✅ Successfully fetched from ${url}`);
              break;
            }
          } catch (urlError) {
            console.log(`⚠️ Failed URL ${url}: ${urlError.message}`);
          }
        }
        
        if (!html) {
          console.log(`❌ Could not fetch any data for ${team.name}`);
          continue;
        }
        
        // More aggressive player name extraction
        const patterns = [
          // Pattern 1: Standard roster table
          /<tr[^>]*>.*?<th[^>]*data-stat="player"[^>]*><a[^>]*>([^<]+)<\/a>.*?<td[^>]*data-stat="pos"[^>]*>([^<]*)<\/td>.*?<td[^>]*data-stat="age"[^>]*>([^<]*)<\/td>/gs,
          // Pattern 2: Simple player links
          /<a[^>]*href="\/players\/[^"]*"[^>]*>([A-Z][a-z]+ [A-Z][a-z]+(?:\s[A-Z][a-z]+)?)<\/a>/g,
          // Pattern 3: Player names in roster context
          /player"[^>]*>([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)<\/a>/g
        ];
        
        let foundPlayers = new Set();
        
        for (const pattern of patterns) {
          const matches = [...html.matchAll(pattern)];
          console.log(`📋 Pattern found ${matches.length} matches for ${team.name}`);
          
          for (const match of matches) {
            const playerName = match[1].trim();
            const position = match[2] ? match[2].trim() : 'N/A';
            const age = match[3] ? parseInt(match[3]) : null;
            
            // Validate player name
            if (playerName.length < 5 || 
                playerName.length > 50 ||
                /[0-9]/.test(playerName) ||
                /(Player|Name|Subscribe|Manage|Menu|Search|Login)/i.test(playerName)) {
              continue;
            }
            
            foundPlayers.add(JSON.stringify({ name: playerName, position, age }));
          }
        }
        
        console.log(`✅ Found ${foundPlayers.size} unique players for ${team.name}`);
        
        // Process unique players
        for (const playerJson of foundPlayers) {
          const player = JSON.parse(playerJson);
          
          try {
            // Check if player exists
            const existingPlayer = await pool.query(
              'SELECT id FROM players WHERE name = $1',
              [player.name]
            );
            
            if (existingPlayer.rows.length === 0) {
              // Add new player
              await pool.query(`
                INSERT INTO players (name, team, position, age, active, last_updated) 
                VALUES ($1, $2, $3, $4, true, CURRENT_DATE)
              `, [player.name, team.name, player.position, player.age]);
              newPlayers++;
              console.log(`➕ Added: ${player.name} (${team.name})`);
            } else {
              // Update existing player
              await pool.query(`
                UPDATE players 
                SET team = $1, position = $2, age = $3, active = true, last_updated = CURRENT_DATE 
                WHERE name = $4
              `, [team.name, player.position, player.age, player.name]);
              updatedPlayers++;
              console.log(`🔄 Updated: ${player.name} (${team.name})`);
            }
            
            totalPlayers++;
          } catch (dbError) {
            console.error(`❌ Database error for ${player.name}:`, dbError.message);
          }
        }
        
        // Delay between teams to be respectful
        await new Promise(resolve => setTimeout(resolve, 3000));
        
      } catch (teamError) {
        console.error(`❌ Error processing team ${team.code}:`, teamError.message);
      }
    }
    
    // Clean up any remaining bad entries
    console.log('🧹 Final cleanup...');
    const cleanupResult = await pool.query(`
      DELETE FROM players 
      WHERE name ~ '[0-9]' 
      OR LENGTH(name) < 5 
      OR LENGTH(name) > 50
      OR name ILIKE '%subscribe%'
      OR name ILIKE '%manage%'
      OR name ILIKE '%menu%'
      OR name ILIKE '%search%'
    `);
    
    console.log(`🗑️ Cleaned up ${cleanupResult.rowCount} invalid entries`);
    
    // Final count
    const totalResult = await pool.query('SELECT COUNT(*) as count FROM players WHERE active = true');
    
    console.log(`🎉 SCRAPING COMPLETE!`);
    console.log(`📊 Total active players in database: ${totalResult.rows[0].count}`);
    console.log(`📊 Added ${newPlayers} new players`);
    console.log(`📊 Updated ${updatedPlayers} existing players`);
    console.log(`📊 Processed ${totalPlayers} players this run`);
    
  } catch (error) {
    console.error('💥 Error scraping NBA players:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the scraper
scrapeNBAPlayers();
