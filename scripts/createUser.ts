import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  console.error('Please make sure VITE_SUPABASE_URL and SUPABASE_SERVICE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createUser(email: string, password: string, fullName?: string) {
  try {
    console.log(`Creating user account for: ${email}`);

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName || email.split('@')[0],
        username: email.split('@')[0],
      },
    });

    if (error) {
      console.error('Error creating user:', error);
      return null;
    }

    console.log('✅ User created successfully!');
    console.log('User ID:', data.user?.id);
    console.log('Email:', data.user?.email);

    return data.user;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

const email = 'tongkai@qusvip.cn';
const password = '12345678';
const fullName = 'Tong Kai';

createUser(email, password, fullName).then((user) => {
  if (user) {
    console.log('\n🎉 User account created successfully!');
    console.log('User can now login with:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  } else {
    console.error('\n❌ Failed to create user account');
  }
  process.exit(0);
});