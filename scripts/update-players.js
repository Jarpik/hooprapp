const { Pool } = require('pg');
const fetch = require('node-fetch');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// NBA Teams with StatMuse URLs
const nbaTeams = [
  { name: 'Atlanta Hawks', slug: 'atlanta-hawks-1', abbreviation: 'ATL' },
  { name: 'Boston Celtics', slug: 'boston-celtics-2', abbreviation: 'BOS' },
  { name: 'Brooklyn Nets', slug: 'brooklyn-nets-17', abbreviation: 'BKN' },
  { name: 'Charlotte Hornets', slug: 'charlotte-hornets-3', abbreviation: 'CHA' },
  { name: 'Chicago Bulls', slug: 'chicago-bulls-4', abbreviation: 'CHI' },
  { name: 'Cleveland Cavaliers', slug: 'cleveland-cavaliers-5', abbreviation: 'CLE' },
  { name: 'Dallas Mavericks', slug: 'dallas-mavericks-6', abbreviation: 'DAL' },
  { name: 'Denver Nuggets', slug: 'denver-nuggets-7', abbreviation: 'DEN' },
  { name: 'Detroit Pistons', slug: 'detroit-pistons-8', abbreviation: 'DET' },
  { name: 'Golden State Warriors', slug: 'golden-state-warriors-9', abbreviation: 'GSW' },
  { name: 'Houston Rockets', slug: 'houston-rockets-10', abbreviation: 'HOU' },
  { name: 'Indiana Pacers', slug: 'indiana-pacers-11', abbreviation: 'IND' },
  { name: 'LA Clippers', slug: 'la-clippers-12', abbreviation: 'LAC' },
  { name: 'Los Angeles Lakers', slug: 'los-angeles-lakers-13', abbreviation: 'LAL' },
  { name: 'Memphis Grizzlies', slug: 'memphis-grizzlies-14', abbreviation: 'MEM' },
  { name: 'Miami Heat', slug: 'miami-heat-15', abbreviation: 'MIA' },
  { name: 'Milwaukee Bucks', slug: 'milwaukee-bucks-16', abbreviation: 'MIL' },
  { name: 'Minnesota Timberwolves', slug: 'minnesota-timberwolves-18', abbreviation: 'MIN' },
  { name: 'New Orleans Pelicans', slug: 'new-orleans-pelicans-19', abbreviation: 'NOP' },
  { name: 'New York Knicks', slug: 'new-york-knicks-5', abbreviation: 'NYK' },
  { name: 'Oklahoma City Thunder', slug: 'oklahoma-city-thunder-20', abbreviation: 'OKC' },
  { name: 'Orlando Magic', slug: 'orlando-magic-21', abbreviation: 'ORL' },
  { name: 'Philadelphia 76ers', slug: 'philadelphia-76ers-22', abbreviation: 'PHI' },
  { name: 'Phoenix Suns', slug: 'phoenix-suns-23', abbreviation: 'PHX' },
  { name: 'Portland Trail Blazers', slug: 'portland-trail-blazers-24', abbreviation: 'POR' },
  { name: 'Sacramento Kings', slug: 'sacramento-kings-25', abbreviation: 'SAC' },
  { name: 'San Antonio Spurs', slug: 'san-antonio-spurs-26', abbreviation: 'SAS' },
  { name: 'Toronto Raptors', slug: 'toronto-raptors-27', abbreviation: 'TOR' },
  { name: 'Utah Jazz', slug: 'utah-jazz-28', abbreviation: 'UTA' },
  { name: 'Washington Wizards', slug: 'washington-wizards-24', abbreviation: 'WAS' }
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Fetch page with proper headers
async function fetchPage(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Referer': 'https://www.google.com/',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.text();
    
  } catch (error) {
    console.error(`❌ Error fetching ${url}: ${error.message}`);
    return null;
  }
}

// Extract player URLs from team roster page
async function getTeamPlayerURLs(team) {
  try {
    const url = `https://www.statmuse.com/nba/team/${team.slug}/roster/2024`;
    console.log(`📋 Getting ${team.name} roster...`);
    
    const html = await fetchPage(url);
    if (!html) return [];
    
    const playerURLs = [];
    
    // Look for player profile links in the roster page
    // Pattern: /nba/player/player-name-id
    const playerLinkPattern = /href="(\/nba\/player\/[^"]+)"/gi;
    let match;
    
    while ((match = playerLinkPattern.exec(html)) !== null) {
      const playerPath = match[1];
      const fullURL = `https://www.statmuse.com${playerPath}`;
      
      // Extract player name from URL for logging
      const nameMatch = playerPath.match(/\/nba\/player\/([^\/]+)/);
      const playerSlug = nameMatch ? nameMatch[1] : 'unknown';
      
      playerURLs.push({
        url: fullURL,
        bioURL: `${fullURL}/bio`,
        slug: playerSlug,
        team: team.name,
        teamAbbr: team.abbreviation
      });
    }
    
    // Remove duplicates
    const uniqueURLs = playerURLs.filter((player, index, self) => 
      index === self.findIndex(p => p.url === player.url)
    );
    
    console.log(`   Found ${uniqueURLs.length} players for ${team.name}`);
    return uniqueURLs;
    
  } catch (error) {
    console.error(`❌ Error getting ${team.name} roster: ${error.message}`);
    return [];
  }
}

// Extract player bio data
function extractBioData(html, playerInfo) {
  const bioData = {};
  
  try {
    // Height - look for patterns like "6'2"" or "6-2"
    const heightPatterns = [
      /Height[^0-9]*(\d+['']?\s*\d+"?)/i,
      /(\d+'\s*\d+")/g,
      /(\d+['']\d+)/g
    ];
    
    for (const pattern of heightPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        let height = match[1].trim();
        // Normalize height format
        height = height.replace(/['']/g, "'").replace(/\s+/g, '');
        if (!height.includes('"')) height += '"';
        if (/^\d+'\d+"$/.test(height)) {
          bioData.height = height;
          break;
        }
      }
    }
    
    // Weight - look for weight in pounds
    const weightPatterns = [
      /Weight[^0-9]*(\d+)\s*lbs?/i,
      /(\d+)\s*lbs?/g
    ];
    
    for (const pattern of weightPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        const weight = parseInt(match[1]);
        if (weight > 150 && weight < 350) {
          bioData.weight = weight;
          break;
        }
      }
    }
    
    // Position
    const positionPatterns = [
      /Position[^A-Z]*([A-Z-]+)/i,
      /\b(Point Guard|Shooting Guard|Small Forward|Power Forward|Center|PG|SG|SF|PF|C)\b/i
    ];
    
    for (const pattern of positionPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        let position = match[1].trim();
        
        // Convert full position names to abbreviations
        const positionMap = {
          'Point Guard': 'PG',
          'Shooting Guard': 'SG', 
          'Small Forward': 'SF',
          'Power Forward': 'PF',
          'Center': 'C'
        };
        
        position = positionMap[position] || position;
        
        if (/^(PG|SG|SF|PF|C|G|F)$/i.test(position)) {
          bioData.position = position.toUpperCase();
          break;
        }
      }
    }
    
    // Age - from birth date or direct age
    const agePatterns = [
      /Age[^0-9]*(\d+)/i,
      /Born[^0-9]*\d+[^0-9]*\d+[^0-9]*(\d{4})/i, // Birth year
      /(\d+)\s*years?\s*old/i
    ];
    
    for (const pattern of agePatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        let age = parseInt(match[1]);
        
        // If it's a birth year, calculate age
        if (age > 1980 && age < 2010) {
          age = new Date().getFullYear() - age;
        }
        
        if (age >= 18 && age <= 50) {
          bioData.age = age;
          break;
        }
      }
    }
    
    // Draft information
    const draftPatterns = [
      /Draft[^0-9]*(\d{4})[^0-9]*(\d+)[^0-9]*(\d+)/i,
      /(\d{4})[^0-9]*Round\s*(\d+)[^0-9]*Pick\s*(\d+)/i
    ];
    
    for (const pattern of draftPatterns) {
      const match = html.match(pattern);
      if (match && match[1] && match[2] && match[3]) {
        bioData.draft_year = parseInt(match[1]);
        bioData.draft_round = parseInt(match[2]);
        bioData.draft_number = parseInt(match[3]);
        break;
      }
    }
    
    // Country/Nationality
    const countryPatterns = [
      /Born[^A-Z]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
      /Nationality[^A-Z]*([A-Z][a-z]+)/i
    ];
    
    for (const pattern of countryPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        const country = match[1].trim();
        if (country.length > 2 && country.length < 30) {
          bioData.country = country;
          break;
        }
      }
    }
    
  } catch (error) {
    console.error(`Error extracting bio data: ${error.message}`);
  }
  
  return bioData;
}

// Extract player stats data
function extractStatsData(html, playerInfo) {
  const statsData = {};
  
  try {
    // Look for 2024-25 season stats
    // PPG, RPG, APG patterns
    const statPatterns = [
      /(\d+\.\d+)\s*PPG/i,
      /(\d+\.\d+)\s*RPG/i,
      /(\d+\.\d+)\s*APG/i,
      /Points[^0-9]*(\d+\.\d+)/i,
      /Rebounds[^0-9]*(\d+\.\d+)/i,
      /Assists[^0-9]*(\d+\.\d+)/i
    ];
    
    // Look for current season stats table or summary
    const seasonMatch = html.match(/2024-25[\s\S]*?(\d+\.\d+)[\s\S]*?(\d+\.\d+)[\s\S]*?(\d+\.\d+)/);
    if (seasonMatch) {
      const stat1 = parseFloat(seasonMatch[1]);
      const stat2 = parseFloat(seasonMatch[2]);
      const stat3 = parseFloat(seasonMatch[3]);
      
      // Usually in order: PPG, RPG, APG
      if (stat1 >= 0 && stat1 <= 50) statsData.ppg = stat1;
      if (stat2 >= 0 && stat2 <= 25) statsData.rpg = stat2;
      if (stat3 >= 0 && stat3 <= 15) statsData.apg = stat3;
    }
    
    // Fallback: Look for individual stats
    if (!statsData.ppg) {
      const ppgMatch = html.match(/(\d+\.\d+)\s*PPG/i);
      if (ppgMatch) {
        const ppg = parseFloat(ppgMatch[1]);
        if (ppg >= 0 && ppg <= 50) statsData.ppg = ppg;
      }
    }
    
    if (!statsData.rpg) {
      const rpgMatch = html.match(/(\d+\.\d+)\s*RPG/i);
      if (rpgMatch) {
        const rpg = parseFloat(rpgMatch[1]);
        if (rpg >= 0 && rpg <= 25) statsData.rpg = rpg;
      }
    }
    
    if (!statsData.apg) {
      const apgMatch = html.match(/(\d+\.\d+)\s*APG/i);
      if (apgMatch) {
        const apg = parseFloat(apgMatch[1]);
        if (apg >= 0 && apg <= 15) statsData.apg = apg;
      }
    }
    
  } catch (error) {
    console.error(`Error extracting stats data: ${error.message}`);
  }
  
  return statsData;
}

// Get complete player data (bio + stats)
async function getCompletePlayerData(playerInfo) {
  try {
    console.log(`   📊 Getting complete data for ${playerInfo.slug}...`);
    
    // Fetch bio page
    const bioHTML = await fetchPage(playerInfo.bioURL);
    
    // Small delay
    await sleep(2000);
    
    // Fetch stats page
    const statsHTML = await fetchPage(playerInfo.url);
    
    if (!bioHTML && !statsHTML) {
      console.log(`     ❌ Failed to fetch both bio and stats pages`);
      return null;
    }
    
    // Extract data from both pages
    const bioData = bioHTML ? extractBioData(bioHTML, playerInfo) : {};
    const statsData = statsHTML ? extractStatsData(statsHTML, playerInfo) : {};
    
    // Combine all data
    const completeData = {
      name: playerInfo.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      team: playerInfo.team,
      team_abbreviation: playerInfo.teamAbbr,
      statmuse_url: playerInfo.url,
      ...bioData,
      ...statsData
    };
    
    console.log(`     ✅ Extracted: ${completeData.position || 'N/A'} | ${completeData.height || 'N/A'} | ${completeData.ppg || 'N/A'} PPG`);
    
    return completeData;
    
  } catch (error) {
    console.error(`❌ Error getting complete data for ${playerInfo.slug}: ${error.message}`);
    return null;
  }
}

// Recreate players table
async function recreatePlayersTable() {
  console.log('🔧 Recreating players table for complete StatMuse data...');
  
  try {
    await pool.query(`DROP TABLE IF EXISTS players`);
    
    await pool.query(`
      CREATE TABLE players (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        position VARCHAR(10),
        height VARCHAR(10),
        weight INTEGER,
        age INTEGER,
        team VARCHAR(50),
        team_abbreviation VARCHAR(5),
        ppg DECIMAL(4,1),
        rpg DECIMAL(4,1),
        apg DECIMAL(4,1),
        country VARCHAR(100),
        draft_year INTEGER,
        draft_round INTEGER,
        draft_number INTEGER,
        statmuse_url VARCHAR(200),
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        last_updated DATE DEFAULT CURRENT_DATE,
        UNIQUE(name, team_abbreviation)
      )
    `);
    
    console.log('✅ Players table recreated with complete data structure');
    
  } catch (error) {
    console.error('❌ Error recreating table:', error.message);
    throw error;
  }
}

// Insert complete player data
async function insertCompletePlayerData(allPlayers) {
  console.log(`🔄 Inserting ${allPlayers.length} complete player profiles...`);
  
  let inserted = 0;
  let skipped = 0;
  
  for (const player of allPlayers) {
    try {
      await pool.query(`
        INSERT INTO players (
          name, position, height, weight, age, team, team_abbreviation,
          ppg, rpg, apg, country, draft_year, draft_round, draft_number, statmuse_url
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (name, team_abbreviation) DO UPDATE SET
          position = EXCLUDED.position,
          height = EXCLUDED.height,
          weight = EXCLUDED.weight,
          age = EXCLUDED.age,
          ppg = EXCLUDED.ppg,
          rpg = EXCLUDED.rpg,
          apg = EXCLUDED.apg,
          country = EXCLUDED.country,
          draft_year = EXCLUDED.draft_year,
          draft_round = EXCLUDED.draft_round,
          draft_number = EXCLUDED.draft_number,
          last_updated = CURRENT_DATE
      `, [
        player.name,
        player.position || null,
        player.height || null,
        player.weight || null,
        player.age || null,
        player.team,
        player.team_abbreviation,
        player.ppg || null,
        player.rpg || null,
        player.apg || null,
        player.country || null,
        player.draft_year || null,
        player.draft_round || null,
        player.draft_number || null,
        player.statmuse_url
      ]);
      
      inserted++;
      
    } catch (error) {
      console.error(`❌ Error inserting ${player.name}: ${error.message}`);
      skipped++;
    }
  }
  
  console.log(`📊 Insert Results:`);
  console.log(`   ✅ Inserted: ${inserted} players`);
  console.log(`   ❌ Skipped: ${skipped} players`);
  
  return inserted;
}

// Show comprehensive final stats
async function showComprehensiveStats() {
  try {
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN position IS NOT NULL THEN 1 END) as with_position,
        COUNT(CASE WHEN height IS NOT NULL THEN 1 END) as with_height,
        COUNT(CASE WHEN weight IS NOT NULL THEN 1 END) as with_weight,
        COUNT(CASE WHEN age IS NOT NULL THEN 1 END) as with_age,
        COUNT(CASE WHEN ppg IS NOT NULL THEN 1 END) as with_ppg,
        COUNT(CASE WHEN rpg IS NOT NULL THEN 1 END) as with_rpg,
        COUNT(CASE WHEN apg IS NOT NULL THEN 1 END) as with_apg,
        COUNT(CASE WHEN country IS NOT NULL THEN 1 END) as with_country,
        COUNT(CASE WHEN draft_year IS NOT NULL THEN 1 END) as with_draft,
        COUNT(DISTINCT team_abbreviation) as team_count
      FROM players
    `);
    
    const stats = statsResult.rows[0];
    
    console.log(`\n📊 COMPLETE STATMUSE DATABASE STATS:`);
    console.log(`   Total players: ${stats.total}`);
    console.log(`   With position: ${stats.with_position} (${Math.round(stats.with_position/stats.total*100)}%)`);
    console.log(`   With height: ${stats.with_height} (${Math.round(stats.with_height/stats.total*100)}%)`);
    console.log(`   With weight: ${stats.with_weight} (${Math.round(stats.with_weight/stats.total*100)}%)`);
    console.log(`   With age: ${stats.with_age} (${Math.round(stats.with_age/stats.total*100)}%)`);
    console.log(`   With 2024-25 PPG: ${stats.with_ppg} (${Math.round(stats.with_ppg/stats.total*100)}%)`);
    console.log(`   With 2024-25 RPG: ${stats.with_rpg} (${Math.round(stats.with_rpg/stats.total*100)}%)`);
    console.log(`   With 2024-25 APG: ${stats.with_apg} (${Math.round(stats.with_apg/stats.total*100)}%)`);
    console.log(`   With country: ${stats.with_country} (${Math.round(stats.with_country/stats.total*100)}%)`);
    console.log(`   With draft info: ${stats.with_draft} (${Math.round(stats.with_draft/stats.total*100)}%)`);
    console.log(`   Teams represented: ${stats.team_count}/30`);
    
    // Show sample players with complete data
    const sampleResult = await pool.query(`
      SELECT name, position, height, weight, age, ppg, rpg, apg, team_abbreviation
      FROM players 
      WHERE ppg IS NOT NULL 
      ORDER BY ppg DESC 
      LIMIT 10
    `);
    
    console.log(`\n📋 Top 10 Scorers (2024-25 Season):`);
    sampleResult.rows.forEach((player, index) => {
      console.log(`   ${index + 1}. ${player.name} (${player.team_abbreviation}) - ${player.position || 'N/A'} - ${player.height || 'N/A'} - ${player.ppg} PPG, ${player.rpg || 'N/A'} RPG, ${player.apg || 'N/A'} APG`);
    });
    
  } catch (error) {
    console.error('Error showing comprehensive stats:', error.message);
  }
}

// Main comprehensive scraping function
async function scrapeCompleteStatMuseData() {
  try {
    console.log('🏀 COMPREHENSIVE STATMUSE NBA DATA SCRAPING');
    console.log('==========================================');
    console.log('📊 Getting complete player profiles: Bio + Current Season Stats');
    console.log(`📋 Processing ${nbaTeams.length} teams...`);
    
    // Recreate database table
    await recreatePlayersTable();
    
    const allPlayers = [];
    let totalPlayersFound = 0;
    
    // Phase 1: Get all player URLs from roster pages
    console.log('\n🔍 PHASE 1: Getting player URLs from team rosters...');
    
    for (let i = 0; i < nbaTeams.length; i++) {
      const team = nbaTeams[i];
      console.log(`\n[${i + 1}/${nbaTeams.length}] ${team.name}...`);
      
      const playerURLs = await getTeamPlayerURLs(team);
      
      if (playerURLs.length > 0) {
        allPlayers.push(...playerURLs);
        totalPlayersFound += playerURLs.length;
        console.log(`   ✅ Found ${playerURLs.length} players`);
      } else {
        console.log(`   ⚠️ No players found`);
      }
      
      // Respectful delay
      if (i < nbaTeams.length - 1) {
        console.log(`   ⏳ Waiting 3 seconds...`);
        await sleep(3000);
      }
    }
    
    console.log(`\n📊 Phase 1 Complete: Found ${totalPlayersFound} total players across all teams`);
    
    // Phase 2: Get complete data for each player
    console.log('\n📊 PHASE 2: Getting complete bio + stats data...');
    
    const completePlayerData = [];
    let processed = 0;
    let successful = 0;
    
    for (const playerInfo of allPlayers) {
      processed++;
      console.log(`\n[${processed}/${allPlayers.length}] Processing ${playerInfo.slug}...`);
      
      const playerData = await getCompletePlayerData(playerInfo);
      
      if (playerData) {
        completePlayerData.push(playerData);
        successful++;
      }
      
      // Progress update every 10 players
      if (processed % 10 === 0) {
        console.log(`   📈 Progress: ${processed}/${allPlayers.length} (${successful} successful)`);
      }
      
      // Respectful delay between players
      await sleep(3000);
    }
    
    console.log(`\n📊 Phase 2 Complete:`);
    console.log(`   👥 Processed: ${processed} players`);
    console.log(`   ✅ Successful: ${successful} players`);
    console.log(`   ❌ Failed: ${processed - successful} players`);
    
    // Phase 3: Insert into database
    if (completePlayerData.length > 0) {
      console.log('\n💾 PHASE 3: Inserting complete player data into database...');
      
      const inserted = await insertCompletePlayerData(completePlayerData);
      
      // Show comprehensive final statistics
      await showComprehensiveStats();
      
      console.log(`\n🎉 COMPREHENSIVE STATMUSE SCRAPING COMPLETE!`);
      console.log(`   🏀 Successfully processed ${inserted} NBA players`);
      console.log(`   📊 Complete profiles with bio + 2024-25 stats`);
      console.log(`   🎯 Your game now has current, comprehensive player data!`);
    } else {
      console.log(`\n❌ No complete player data was successfully extracted`);
    }
    
  } catch (error) {
    console.error('💥 Fatal error:', error.message);
    console.error(error.stack);
  } finally {
    await pool.end();
  }
}

// Run the comprehensive StatMuse scraper
if (require.main === module) {
  scrapeCompleteStatMuseData();
}

module.exports = { scrapeCompleteStatMuseData };
