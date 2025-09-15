// Simple database connection test
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'your-supabase-url'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('Testing database connection...')

    // Test basic query
    const { data, error } = await supabase
      .from('construction_teams')
      .select('*')
      .limit(1)

    if (error) {
      console.error('Query error:', error)
    } else {
      console.log('Connection successful, sample data:', data)
    }

    // Test insert
    const testTeam = {
      team_name: 'Test Team',
      team_leader: 'Test Leader',
      status: '空闲',
      efficiency_rating: 1
    }

    console.log('Testing insert with data:', testTeam)

    const { data: insertData, error: insertError } = await supabase
      .from('construction_teams')
      .insert(testTeam)
      .select()

    if (insertError) {
      console.error('Insert error:', insertError)
    } else {
      console.log('Insert successful:', insertData)
    }

  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

testConnection()