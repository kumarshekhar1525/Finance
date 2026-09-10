-- SQL Script to alter public.appointament1 table in Supabase
-- Execute this script in Supabase Dashboard -> SQL Editor

ALTER TABLE public.appointament1 
ADD COLUMN IF NOT EXISTS date_of_birth TEXT,
ADD COLUMN IF NOT EXISTS age INT;

-- Verify table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'appointament1';
