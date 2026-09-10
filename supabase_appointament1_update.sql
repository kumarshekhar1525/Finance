-- =========================================================================
-- Supabase SQL Query to Create / Update 'appointament1' Table with Nominee Details
-- Copy & Run this SQL in your Supabase SQL Editor:
-- Dashboard Link: https://supabase.com/dashboard/project/dasrkwfegjqhkalawdfu/sql/new
-- =========================================================================

-- 1. Create 'appointament1' table if it does not exist
CREATE TABLE IF NOT EXISTS public.appointament1 (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    requested_amount NUMERIC,
    tenure_months INT,
    monthly_emi NUMERIC,
    interest_rate NUMERIC,
    scheme_id TEXT,
    scheme_name TEXT,
    loan_category TEXT,
    specific_purpose TEXT,
    applicant_name TEXT,
    aadhaar_number TEXT,
    phone TEXT,
    email TEXT,
    state TEXT,
    beneficiary_category TEXT,
    photo_url TEXT,
    nominee_name TEXT,
    nominee_relation TEXT,
    nominee_phone TEXT,
    nominee_aadhaar TEXT,
    documents JSONB DEFAULT '[]'::jsonb,
    biometric_record JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'Submitted'
);

-- 2. Alter column types & add Nominee columns if table already existed
ALTER TABLE IF EXISTS public.appointament1 
  ALTER COLUMN id TYPE TEXT USING id::text;

ALTER TABLE IF EXISTS public.appointament1 
  ADD COLUMN IF NOT EXISTS photo_url TEXT,
  ADD COLUMN IF NOT EXISTS nominee_name TEXT,
  ADD COLUMN IF NOT EXISTS nominee_relation TEXT,
  ADD COLUMN IF NOT EXISTS nominee_phone TEXT,
  ADD COLUMN IF NOT EXISTS nominee_aadhaar TEXT,
  ADD COLUMN IF NOT EXISTS beneficiary_category TEXT,
  ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS biometric_record JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Submitted';

-- 3. Enable Row Level Security (RLS) & Grant Access
ALTER TABLE IF EXISTS public.appointament1 ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert on appointament1" ON public.appointament1;
DROP POLICY IF EXISTS "Allow public select on appointament1" ON public.appointament1;
DROP POLICY IF EXISTS "Allow public update on appointament1" ON public.appointament1;

CREATE POLICY "Allow public insert on appointament1" 
ON public.appointament1 FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public select on appointament1" 
ON public.appointament1 FOR SELECT 
USING (true);

CREATE POLICY "Allow public update on appointament1" 
ON public.appointament1 FOR UPDATE 
USING (true);

-- 4. Reload Schema Cache Notice
NOTIFY pgrst, 'reload schema';
