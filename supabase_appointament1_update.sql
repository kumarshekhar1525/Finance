-- ======================================================
-- Supabase SQL Query for appointament1 Table Update
-- Adds Nominee columns, photo_url, and text ID support
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/dasrkwfegjqhkalawdfu/sql/new
-- ======================================================

-- 1. Ensure 'id' column accepts formatted text serial IDs like '00001001-2026-4000-8000-000000001001'
ALTER TABLE IF EXISTS public.appointament1 
  ALTER COLUMN id TYPE TEXT USING id::text;

-- 2. Add Nominee and Photo columns if not present
ALTER TABLE IF EXISTS public.appointament1 
  ADD COLUMN IF NOT EXISTS photo_url TEXT,
  ADD COLUMN IF NOT EXISTS nominee_name TEXT,
  ADD COLUMN IF NOT EXISTS nominee_relation TEXT,
  ADD COLUMN IF NOT EXISTS nominee_phone TEXT,
  ADD COLUMN IF NOT EXISTS nominee_aadhaar TEXT;

-- 3. Enable RLS permissions
ALTER TABLE IF EXISTS public.appointament1 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on appointament1" 
ON public.appointament1 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public select on appointament1" 
ON public.appointament1 
FOR SELECT 
USING (true);
