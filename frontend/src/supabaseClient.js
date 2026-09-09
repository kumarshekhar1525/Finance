import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dasrkwfegjqhkalawdfu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhc3Jrd2ZlZ2pxaGthbGF3ZGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2NzM3NDcsImV4cCI6MjEwMzI0OTc0N30.4jyEQVj5PdcuBOz0JWwnLHcIpfga9ft8QO3giBtZs2s'; // Supabase dashboard se anon key copy karein

export const supabase = createClient(supabaseUrl, supabaseAnonKey);