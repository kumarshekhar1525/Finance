import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dasrkwfegjqhkalawdfu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhc3Jrd2ZlZ2pxaGthbGF3ZGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2NzM3NDcsImV4cCI6MjEwMzI0OTc0N30.4jyEQVj5PdcuBOz0JWwnLHcIpfga9ft8QO3giBtZs2s';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLoginInsert() {
  console.log('Testing insert into login table...');
  const { data, error } = await supabase
    .from('login')
    .insert([
      {
        email: 'kumarshekharyadav9931@gmail.com',
        password: 'Shekhu@1525',
        role: 'admin',
        user_name: 'Bank Nodal Officer (Shekhar)',
        login_time: new Date().toISOString()
      }
    ])
    .select();

  if (error) {
    console.warn('Supabase login insert note (table created via SQL editor):', error.message);
  } else {
    console.log('Success! Inserted row in login table:', JSON.stringify(data, null, 2));
  }
}

testLoginInsert();
