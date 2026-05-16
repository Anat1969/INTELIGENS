#!/usr/bin/env node
/**
 * Lovable Supabase Setup Automation
 * This script automates the creation of synthesized_intelligences table
 * in your Lovable project's Supabase instance.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise(resolve => {
    rl.question(question, resolve);
  });
}

async function main() {
  console.log('\n🚀 Lovable Supabase Setup');
  console.log('========================\n');

  // Check if .env.local exists
  const envPath = path.join(process.cwd(), '.env.local');
  let existingEnv = {};

  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    lines.forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        existingEnv[match[1]] = match[2];
      }
    });
  }

  console.log('📍 Getting your Supabase credentials from Lovable...\n');

  // Prompt for credentials
  const supabaseUrl = existingEnv.VITE_SUPABASE_URL ||
    await prompt('Paste your Supabase Project URL (from Lovable Dashboard > Settings > API):\n> ');

  const supabaseKey = existingEnv.VITE_SUPABASE_ANON_KEY ||
    await prompt('\nPaste your Supabase Anon Public Key:\n> ');

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing credentials');
    rl.close();
    process.exit(1);
  }

  // Update .env.local
  const envContent = `# Gemini API
VITE_GEMINI_API_KEY=${existingEnv.VITE_GEMINI_API_KEY || 'AIzaSyCHrYd-oN78ysRjClRhPtyBcd5TkceZZtk'}

# Supabase Configuration (using Lovable's built-in Supabase)
VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=${supabaseKey}
`;

  fs.writeFileSync(envPath, envContent);
  console.log('\n✅ .env.local updated\n');

  // Try to create table via Supabase API
  console.log('🔨 Creating synthesized_intelligences table...\n');

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Read the SQL schema
    const schemaPath = path.join(process.cwd(), 'supabase-schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Split SQL into individual statements
    const statements = schemaSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    // Execute each statement
    for (const statement of statements) {
      const { error } = await supabase.rpc('query', { statement });

      // Note: Direct SQL execution via RPC may not work
      // We'll provide instructions instead
    }

    console.log('⚠️  Direct SQL execution requires manual setup.\n');
  } catch (err) {
    console.log('⚠️  Could not auto-execute SQL (this is normal).\n');
  }

  // Provide manual instructions
  console.log('📋 Next Step: Create the Database Table\n');
  console.log('1. Go to: https://supabase.com/dashboard');
  console.log('2. Select your project');
  console.log('3. Left sidebar → SQL Editor → New Query');
  console.log('4. Copy the entire content of supabase-schema.sql');
  console.log('5. Paste into the SQL Editor');
  console.log('6. Click Run (or Ctrl/Cmd + Enter)\n');
  console.log('✅ You should see: CREATE TABLE, CREATE INDEX, CREATE POLICY messages\n');

  console.log('🎉 Then run: npm run dev\n');

  rl.close();
}

main().catch(err => {
  console.error('❌ Setup failed:', err.message);
  rl.close();
  process.exit(1);
});
