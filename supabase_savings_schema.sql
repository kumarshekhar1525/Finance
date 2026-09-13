-- SQL Script to create 'savings_applications' table in Supabase

CREATE TABLE IF NOT EXISTS savings_applications (
  id TEXT PRIMARY KEY,
  tracking_id TEXT UNIQUE NOT NULL,
  applicant_name TEXT NOT NULL,
  aadhaar_number TEXT NOT NULL,
  pan_number TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  state TEXT NOT NULL,
  beneficiary_category TEXT,
  deposit_amount NUMERIC NOT NULL,
  tenure_years NUMERIC NOT NULL,
  expected_maturity_amount NUMERIC NOT NULL,
  interest_rate NUMERIC NOT NULL,
  scheme_id TEXT NOT NULL,
  scheme_name TEXT NOT NULL,
  nominee_name TEXT,
  nominee_relation TEXT,
  nominee_aadhaar TEXT,
  nominee_aadhaar_photo TEXT,
  applicant_photo TEXT,
  aadhaar_card_doc TEXT,
  pan_doc TEXT,
  handwritten_doc TEXT,
  documents JSONB DEFAULT '[]'::jsonb,
  biometric_record JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'submitted',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by Aadhaar & tracking ID
CREATE INDEX IF NOT EXISTS idx_savings_aadhaar ON savings_applications(aadhaar_number);
CREATE INDEX IF NOT EXISTS idx_savings_tracking ON savings_applications(tracking_id);

SELECT 'savings_applications table created successfully!' AS status;
