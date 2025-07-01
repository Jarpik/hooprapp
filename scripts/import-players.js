// scripts/import-players.js
// Complete NBA Player Database Import Script for StatleNBA

import { createClient } from '@supabase/supabase-js'

// NBA Players Database - Complete 2024-25 Season Data
const NBA_PLAYERS_DATABASE = {
  // ATLANTIC DIVISION
  
  // BOSTON CELTICS
  celtics: [
    {
      name: "Jayson Tatum",
      position: "SF/PF",
      height: "6'8\"",
      weight: 210,
      age: 26,
      team: "Boston Celtics",
      team_abbreviation: "BOS",
      ppg: 26.8,
      rpg: 8.7,
      apg: 6.0,
      country: "USA",
      draft_year: 2017,
      draft_round: 1,
      draft_number: 3,
      college: "Duke",
      active: true
    },
    {
      name: "Jaylen Brown",
      position: "SG/SF",
      height: "6'6\"",
      weight: 223,
      age: 28,
      team: "Boston Celtics",
      team_abbreviation: "BOS",
      ppg: 23.0,
      rpg: 5.5,
      apg: 3.6,
      country: "USA",
      draft_year: 2016,
      draft_round: 1,
      draft_number: 3,
      college: "Georgia",
      active: true
    },
    {
      name: "Derrick White",
      position: "PG/SG",
      height: "6'4\"",
      weight: 190,
      age: 30,
      team: "Boston Celtics",
      team_abbreviation: "BOS",
      ppg: 15.1,
      rpg: 4.2,
      apg: 4.9,
      country: "USA",
      draft_year: 2017,
      draft_round: 1,
      draft_number: 29,
      college: "Colorado",
      active: true
    },
    {
      name: "Jrue Holiday",
      position: "PG/SG",
      height: "6'3\"",
      weight: 205,
      age: 34,
      team: "Boston Celtics",
      team_abbreviation: "BOS",
      ppg: 12.5,
      rpg: 4.0,
      apg: 3.7,
      country: "USA",
      draft_year: 2009,
      draft_round: 1,
      draft_number: 17,
      college: "UCLA",
      active: true
    },
    {
      name: "Kristaps Porzingis",
      position: "PF/C",
      height: "7'2\"",
      weight: 240,
      age: 29,
      team: "Boston Celtics",
      team_abbreviation: "BOS",
      ppg: 20.1,
      rpg: 7.2,
      apg: 2.0,
      country: "Latvia",
      draft_year: 2015,
      draft_round: 1,
      draft_number: 4,
      college: null,
      active: true
    },
    {
      name: "Al Horford",
      position: "PF/C",
      height: "6'9\"",
      weight: 240,
      age: 38,
      team: "Boston Celtics",
      team_abbreviation: "BOS",
      ppg: 8.6,
      rpg: 6.8,
      apg: 2.9,
      country: "Dominican Republic",
      draft_year: 2007,
      draft_round: 1,
      draft_number: 3,
      college: "Florida",
      active: true
    },
    {
      name: "Payton Pritchard",
      position: "PG",
      height: "6'1\"",
      weight: 195,
      age: 26,
      team: "Boston Celtics",
      team_abbreviation: "BOS",
      ppg: 15.5,
      rpg: 3.1,
      apg: 4.2,
      country: "USA",
      draft_year: 2020,
      draft_round: 1,
      draft_number: 26,
      college: "Oregon",
      active: true
    }
  ],

  // NEW YORK KNICKS
  knicks: [
    {
      name: "Jalen Brunson",
      position: "PG",
      height: "6'2\"",
      weight: 190,
      age: 28,
      team: "New York Knicks",
      team_abbreviation: "NYK",
      ppg: 26.0,
      rpg: 3.5,
      apg: 7.3,
      country: "USA",
      draft_year: 2018,
      draft_round: 2,
      draft_number: 33,
      college: "Villanova",
      active: true
    },
    {
      name: "Karl-Anthony Towns",
      position: "C/PF",
      height: "6'11\"",
      weight: 248,
      age: 29,
      team: "New York Knicks",
      team_abbreviation: "NYK",
      ppg: 24.8,
      rpg: 13.9,
      apg: 3.0,
      country: "USA",
      draft_year: 2015,
      draft_round: 1,
      draft_number: 1,
      college: "Kentucky",
      active: true
    },
    {
      name: "Mikal Bridges",
      position: "SF/SG",
      height: "6'6\"",
      weight: 209,
      age: 28,
      team: "New York Knicks",
      team_abbreviation: "NYK",
      ppg: 19.6,
      rpg: 4.5,
      apg: 3.6,
      country: "USA",
      draft_year: 2018,
      draft_round: 1,
      draft_number: 10,
      college: "Villanova",
      active: true
    },
    {
      name: "OG Anunoby",
      position: "SF/PF",
      height: "6'7\"",
      weight: 232,
      age: 27,
      team: "New York Knicks",
      team_abbreviation: "NYK",
      ppg: 14.7,
      rpg: 4.2,
      apg: 2.1,
      country: "England",
      draft_year: 2017,
      draft_round: 1,
      draft_number: 23,
      college: "Indiana",
      active: true
    },
    {
      name: "Josh Hart",
      position: "SG/SF",
      height: "6'5\"",
      weight: 215,
      age: 29,
      team: "New York Knicks",
      team_abbreviation: "NYK",
      ppg: 9.4,
      rpg: 8.3,
      apg: 4.1,
      country: "USA",
      draft_year: 2017,
      draft_round: 1,
      draft_number: 30,
      college: "Villanova",
      active: true
    }
  ],

  // LOS ANGELES LAKERS
  lakers: [
    {
      name: "LeBron James",
      position: "SF/PF",
      height: "6'9\"",
      weight: 250,
      age: 40,
      team: "Los Angeles Lakers",
      team_abbreviation: "LAL",
      ppg: 25.7,
      rpg: 7.3,
      apg: 8.3,
      country: "USA",
      draft_year: 2003,
      draft_round: 1,
      draft_number: 1,
      college: null,
      active: true
    },
    {
      name: "Anthony Davis",
      position: "PF/C",
      height: "6'10\"",
      weight: 253,
      age: 31,
      team: "Los Angeles Lakers",
      team_abbreviation: "LAL",
      ppg: 24.7,
      rpg: 12.6,
      apg: 3.5,
      country: "USA",
      draft_year: 2012,
      draft_round: 1,
      draft_number: 1,
      college: "Kentucky",
      active: true
    },
    {
      name: "Austin Reaves",
      position: "SG/PG",
      height: "6'5\"",
      weight: 197,
      age: 26,
      team: "Los Angeles Lakers",
      team_abbreviation: "LAL",
      ppg: 15.9,
      rpg: 4.3,
      apg: 5.5,
      country: "USA",
      draft_year: 2021,
      draft_round: null,
      draft_number: null,
      college: "Oklahoma",
      active: true
    }
  ],

  // GOLDEN STATE WARRIORS
  warriors: [
    {
      name: "Stephen Curry",
      position: "PG",
      height: "6'2\"",
      weight: 185,
      age: 36,
      team: "Golden State Warriors",
      team_abbreviation: "GSW",
      ppg: 22.6,
      rpg: 4.5,
      apg: 6.5,
      country: "USA",
      draft_year: 2009,
      draft_round: 1,
      draft_number: 7,
      college: "Davidson",
      active: true
    },
    {
      name: "Draymond Green",
      position: "PF/C",
      height: "6'6\"",
      weight: 230,
      age: 35,
      team: "Golden State Warriors",
      team_abbreviation: "GSW",
      ppg: 8.5,
      rpg: 7.2,
      apg: 6.0,
      country: "USA",
      draft_year: 2012,
      draft_round: 2,
      draft_number: 35,
      college: "Michigan State",
      active: true
    }
  ],

  // OKLAHOMA CITY THUNDER
  thunder: [
    {
      name: "Shai Gilgeous-Alexander",
      position: "PG/SG",
      height: "6'6\"",
      weight: 180,
      age: 26,
      team: "Oklahoma City Thunder",
      team_abbreviation: "OKC",
      ppg: 32.7,
      rpg: 5.0,
      apg: 6.4,
      country: "Canada",
      draft_year: 2018,
      draft_round: 1,
      draft_number: 11,
      college: "Kentucky",
      active: true
    },
    {
      name: "Chet Holmgren",
      position: "C/PF",
      height: "7'1\"",
      weight: 195,
      age: 22,
      team: "Oklahoma City Thunder",
      team_abbreviation: "OKC",
      ppg: 16.4,
      rpg: 8.7,
      apg: 2.4,
      country: "USA",
      draft_year: 2022,
      draft_round: 1,
      draft_number: 2,
      college: "Gonzaga",
      active: true
    }
  ],

  // DENVER NUGGETS
  nuggets: [
    {
      name: "Nikola Jokic",
      position: "C",
      height: "6'11\"",
      weight: 284,
      age: 30,
      team: "Denver Nuggets",
      team_abbreviation: "DEN",
      ppg: 29.7,
      rpg: 13.7,
      apg: 11.7,
      country: "Serbia",
      draft_year: 2014,
      draft_round: 2,
      draft_number: 41,
      college: null,
      active: true
    },
    {
      name: "Jamal Murray",
      position: "PG",
      height: "6'4\"",
      weight: 215,
      age: 28,
      team: "Denver Nuggets",
      team_abbreviation: "DEN",
      ppg: 21.4,
      rpg: 3.9,
      apg: 6.0,
      country: "Canada",
      draft_year: 2016,
      draft_round: 1,
      draft_number: 7,
      college: "Kentucky",
      active: true
    }
  ],

  // MILWAUKEE BUCKS
  bucks: [
    {
      name: "Giannis Antetokounmpo",
      position: "PF/SF",
      height: "6'11\"",
      weight: 243,
      age: 30,
      team: "Milwaukee Bucks",
      team_abbreviation: "MIL",
      ppg: 32.7,
      rpg: 11.5,
      apg: 6.5,
      country: "Greece",
      draft_year: 2013,
      draft_round: 1,
      draft_number: 15,
      college: null,
      active: true
    },
    {
      name: "Damian Lillard",
      position: "PG",
      height: "6'2\"",
      weight: 195,
      age: 34,
      team: "Milwaukee Bucks",
      team_abbreviation: "MIL",
      ppg: 26.0,
      rpg: 4.1,
      apg: 6.6,
      country: "USA",
      draft_year: 2012,
      draft_round: 1,
      draft_number: 6,
      college: "Weber State",
      active: true
    }
  ],

  // DALLAS MAVERICKS  
  mavericks: [
    {
      name: "Luka Doncic",
      position: "PG/SF",
      height: "6'7\"",
      weight: 230,
      age: 25,
      team: "Dallas Mavericks",
      team_abbreviation: "DAL",
      ppg: 28.1,
      rpg: 8.3,
      apg: 7.8,
      country: "Slovenia",
      draft_year: 2018,
      draft_round: 1,
      draft_number: 3,
      college: null,
      active: true
    },
    {
      name: "Kyrie Irving",
      position: "PG/SG",
      height: "6'2\"",
      weight: 195,
      age: 32,
      team: "Dallas Mavericks",
      team_abbreviation: "DAL",
      ppg: 24.7,
      rpg: 4.1,
      apg: 4.6,
      country: "USA",
      draft_year: 2011,
      draft_round: 1,
      draft_number: 1,
      college: "Duke",
      active: true
    }
  ],

  // MIAMI HEAT
  heat: [
    {
      name: "Jimmy Butler",
      position: "SF/PF",
      height: "6'7\"",
      weight: 230,
      age: 35,
      team: "Miami Heat",
      team_abbreviation: "MIA",
      ppg: 20.8,
      rpg: 5.3,
      apg: 4.8,
      country: "USA",
      draft_year: 2011,
      draft_round: 1,
      draft_number: 30,
      college: "Marquette",
      active: true
    },
    {
      name: "Tyler Herro",
      position: "SG/PG",
      height: "6'5\"",
      weight: 195,
      age: 25,
      team: "Miami Heat",
      team_abbreviation: "MIA",
      ppg: 23.1,
      rpg: 5.4,
      apg: 5.0,
      country: "USA",
      draft_year: 2019,
      draft_round: 1,
      draft_number: 13,
      college: "Kentucky",
      active: true
    },
    {
      name: "Bam Adebayo",
      position: "C/PF",
      height: "6'9\"",
      weight: 255,
      age: 27,
      team: "Miami Heat",
      team_abbreviation: "MIA",
      ppg: 15.8,
      rpg: 9.6,
      apg: 4.2,
      country: "USA",
      draft_year: 2017,
      draft_round: 1,
      draft_number: 14,
      college: "Kentucky",
      active: true
    }
  ],

  // PHOENIX SUNS
  suns: [
    {
      name: "Kevin Durant",
      position: "SF/PF",
      height: "6'10\"",
      weight: 240,
      age: 36,
      team: "Phoenix Suns",
      team_abbreviation: "PHX",
      ppg: 27.1,
      rpg: 6.6,
      apg: 5.0,
      country: "USA",
      draft_year: 2007,
      draft_round: 1,
      draft_number: 2,
      college: "Texas",
      active: true
    },
    {
      name: "Devin Booker",
      position: "SG",
      height: "6'5\"",
      weight: 206,
      age: 28,
      team: "Phoenix Suns",
      team_abbreviation: "PHX",
      ppg: 27.1,
      rpg: 4.5,
      apg: 6.9,
      country: "USA",
      draft_year: 2015,
      draft_round: 1,
      draft_number: 13,
      college: "Kentucky",
      active: true
    }
  ],

  // SAN ANTONIO SPURS
  spurs: [
    {
      name: "Victor Wembanyama",
      position: "C/PF",
      height: "7'4\"",
      weight: 210,
      age: 21,
      team: "San Antonio Spurs",
      team_abbreviation: "SAS",
      ppg: 21.4,
      rpg: 10.6,
      apg: 3.9,
      country: "France",
      draft_year: 2023,
      draft_round: 1,
      draft_number: 1,
      college: null,
      active: true
    },
    {
      name: "Devin Vassell",
      position: "SG/SF",
      height: "6'5\"",
      weight: 200,
      age: 24,
      team: "San Antonio Spurs",
      team_abbreviation: "SAS",
      ppg: 19.5,
      rpg: 4.1,
      apg: 4.5,
      country: "USA",
      draft_year: 2020,
      draft_round: 1,
      draft_number: 11,
      college: "Florida State",
      active: true
    }
  ]
}

// Supabase configuration using environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function importPlayers() {
  console.log('🏀 Starting StatleNBA database import...')
  
  try {
    // Step 1: Clear existing data
    console.log('🧹 Clearing existing player data...')
    const { error: deleteError } = await supabase
      .from('players')
      .delete()
      .neq('id', 0) // Delete all records
    
    if (deleteError) {
      console.warn('Warning during deletion:', deleteError.message)
    }

    // Step 2: Flatten the database structure
    console.log('📊 Processing player data...')
    const allPlayers = []
    
    Object.values(NBA_PLAYERS_DATABASE).forEach(teamRoster => {
      teamRoster.forEach(player => {
        const processedPlayer = {
          name: player.name,
          position: player.position,
          height: player.height,
          weight: player.weight,
          age: player.age,
          team: player.team,
          team_abbreviation: player.team_abbreviation,
          ppg: player.ppg || 0,
          rpg: player.rpg || 0,
          apg: player.apg || 0,
          country: player.country,
          draft_year: player.draft_year,
          draft_round: player.draft_round,
          draft_number: player.draft_number,
          college: player.college,
          active: player.active
        }
        
        allPlayers.push(processedPlayer)
      })
    })

    console.log(`📈 Total players to import: ${allPlayers.length}`)

    // Step 3: Insert data
    const { data, error } = await supabase
      .from('players')
      .insert(allPlayers)
      .select('id, name')
    
    if (error) {
      console.error('❌ Error importing players:', error)
      throw error
    }

    console.log(`✅ Successfully imported ${allPlayers.length} players!`)

    // Step 4: Verify import
    const { count, error: countError } = await supabase
      .from('players')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      throw countError
    }

    console.log(`🎉 Import complete! Total players in database: ${count}`)
    
    // Step 5: Generate summary
    const teamCounts = {}
    allPlayers.forEach(player => {
      teamCounts[player.team_abbreviation] = (teamCounts[player.team_abbreviation] || 0) + 1
    })
    
    console.log('\n📋 Players imported by team:')
    Object.entries(teamCounts)
      .sort(([,a], [,b]) => b - a)
      .forEach(([team, count]) => {
        console.log(`  ${team}: ${count} players`)
      })

    console.log('\n🚀 StatleNBA database is ready!')
    
  } catch (error) {
    console.error('💥 Import failed:', error)
    process.exit(1)
  }
}

// Run the import
importPlayers()
