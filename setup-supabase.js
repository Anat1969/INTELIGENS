#!/usr/bin/env node
// Setup script for creating Supabase table for synthesis engine
// Usage: node setup-supabase.js <SUPABASE_URL> <SUPABASE_ANON_KEY>

const supabaseUrl = process.argv[2];
const supabaseAnonKey = process.argv[3];

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Usage: node setup-supabase.js <SUPABASE_URL> <SUPABASE_ANON_KEY>');
  console.error('\nExample:');
  console.error('  node setup-supabase.js https://xxxxx.supabase.co "eyJhbGc..."');
  process.exit(1);
}

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupDatabase() {
  console.log('🚀 Creating Supabase schema for synthesis engine...\n');

  try {
    // Create table
    console.log('📝 Creating synthesized_intelligences table...');
    const { error: tableError } = await supabase.rpc('sql', {
      query: `
        CREATE TABLE IF NOT EXISTS synthesized_intelligences (
          id BIGSERIAL PRIMARY KEY,
          source_key TEXT NOT NULL UNIQUE,
          source_ids TEXT[] NOT NULL,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          essence TEXT NOT NULL,
          power TEXT NOT NULL,
          roles TEXT[] NOT NULL,
          quote TEXT NOT NULL,
          source TEXT NOT NULL DEFAULT 'synthesized',
          times_found INTEGER DEFAULT 1,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    }).catch(err => ({ error: null })); // Ignore RPC errors, try direct SQL

    // Use direct SQL execution via query method if available
    // Otherwise, we'll guide them to run the SQL manually

    console.log('✅ Table creation schema is ready!');
    console.log('\n📍 Next steps:');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Go to SQL Editor');
    console.log('4. Paste the content of supabase-schema.sql');
    console.log('5. Execute the SQL\n');
    console.log('🎉 Then run: npm run dev\n');

  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error('\nℹ️  This is normal - execute the SQL manually instead:');
    console.error('1. Go to Supabase SQL Editor');
    console.error('2. Copy content from supabase-schema.sql');
    console.error('3. Paste and execute');
  }
}

setupDatabase();
