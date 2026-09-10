-- ======================================================
-- Supabase SQL Query for clean serial ID & photo columns in 'appointament1'
-- For Figure 4 & Figure 5
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/dasrkwfegjqhkalawdfu/sql/new
-- ======================================================

-- 1. Ensure 'id' column accepts clean formatted text IDs like 'APP-1001' or integer serials
-- If id column is UUID and you want numeric serial or formatted string:
ALTER TABLE IF EXISTS public.appointament1 
  ALTER COLUMN id TYPE TEXT USING id::text;

-- 2. Add columns if not already present for direct photo storage
ALTER TABLE IF EXISTS public.appointament1 
  ADD COLUMN IF NOT EXISTS photo_url TEXT,
  ADD COLUMN IF NOT EXISTS tracking_id TEXT;

-- 3. Update existing records with clean readable serial IDs if they have UUIDs
UPDATE public.appointament1 
SET tracking_id = COALESCE(tracking_id, 'APP-2026-' || LPAD(ROW_NUMBER() OVER ()::text, 4, '0'))
WHERE tracking_id IS NULL;
