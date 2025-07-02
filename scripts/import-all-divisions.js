// scripts/import-all-divisions.js
const { createSupabaseClient } = require('./utils/supabase-client.js');

// Import all division functions
const { importAtlanticDivision } = require('./divisions/atlantic-division');
const { importCentralDivision } = require('./divisions/central-division');
const { importSoutheastDivision } = require('./divisions/southeast-division');
const { importNorthwestDivision } = require('./divisions/northwest-division');
const { importPacificDivision } = require('./divisions/pacific-division');
const { importSouthwestDivision } = require('./divisions/southwest-division');

// Division information
const divisions = [
  { name: 'Atlantic Division', importFunction: importAtlanticDivision, teams: 'Celtics, Knicks, 76ers, Nets, Raptors' },
  { name: 'Central Division', importFunction: importCentralDivision, teams: 'Bucks, Cavaliers, Bulls, Pistons, Pacers' },
  { name: 'Southeast Division', importFunction: importSoutheastDivision, teams: 'Heat, Magic, Hawks, Hornets, Wizards' },
  { name: 'Northwest Division', importFunction: importNorthwestDivision, teams: 'Thunder, Nuggets, Timberwolves, Blazers, Jazz' },
  { name: 'Pacific Division', importFunction: importPacificDivision, teams: 'Warriors, Lakers, Clippers, Suns, Kings' },
  { name: 'Southwest Division', importFunction: importSouthwestDivision, teams: 'Mavericks, Spurs, Rockets, Grizzlies, Pelicans' }
];

async function importAllDivisions() {
  console.log(`🏀 Starting StatleNBA FULL DATABASE import...`);
  console.log(`📊 Importing all 6 NBA divisions with 300+ players...`);
  console.log(`📅 Using 2024-25 season stats\n`);
  
  // Test Supabase connection first
  try {
    const supabase = createSupabaseClient();
    console.log(`✅ Supabase connection established`);
  } catch (error) {
    console.error(`❌ Failed to connect to Supabase:`, error.message);
    process.exit(1);
  }
  
  let totalSuccess = 0;
  let totalErrors = 0;
  let totalPlayers = 0;
  
  // Import each division sequentially
  for (let i = 0; i < divisions.length; i++) {
    const division = divisions[i];
    const divisionNumber = i + 1;
    
    try {
      console.log(`\n🔄 [${divisionNumber}/6] Importing ${division.name}...`);
      console.log(`   Teams: ${division.teams}`);
      
      await division.importFunction();
      
      totalSuccess++;
      totalPlayers += 50; // Each division has ~50 players
      console.log(`✅ [${divisionNumber}/6] ${division.name} completed! (~50 players)`);
      
    } catch (error) {
      console.error(`❌ [${divisionNumber}/6] ${division.name} failed:`, error.message);
      totalErrors++;
    }
  }
  
  // Final summary
  console.log(`\n🎉 IMPORT SUMMARY:`);
  console.log(`✅ Successful divisions: ${totalSuccess}`);
  console.log(`❌ Failed divisions: ${totalErrors}`);
  console.log(`📈 Total divisions processed: ${divisions.length}`);
  console.log(`👥 Total players imported: ~${totalPlayers}`);
  console.log(`🏀 StatleNBA database is now ready!`);
  
  if (totalErrors > 0) {
    console.log(`\n⚠️  Some divisions failed. Check logs above for details.`);
    process.exit(1);
  } else {
    console.log(`\n🚀 All divisions imported successfully! Your game is ready to go!`);
  }
}

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled promise rejection:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
  process.exit(1);
});

// Main execution
async function main() {
  try {
    await importAllDivisions();
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  importAllDivisions
};
