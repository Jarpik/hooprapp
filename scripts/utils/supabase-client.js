// scripts/utils/supabase-client.js
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

// Import players function
async function importPlayers(players, divisionName) {
  const supabase = createSupabaseClient();
  
  console.log(`🏀 Starting ${divisionName} import...`);
  console.log(`📊 Processing ${players.length} players...`);

  try {
    // Insert players into database
    const { data, error } = await supabase
      .from('players')
      .insert(players);

    if (error) {
      throw error;
    }

    console.log(`✅ Successfully imported ${players.length} players from ${divisionName}!`);
    return { success: true, count: players.length };
    
  } catch (error) {
    console.error(`❌ Error importing ${divisionName}:`, error.message);
    throw error;
  }
}

module.exports = {
  createSupabaseClient,
  importPlayers
};
