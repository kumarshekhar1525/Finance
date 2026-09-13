-- SQL Script to update Supabase 'appointament1' table with all required e-KYC and document columns

ALTER TABLE appointament1 ADD COLUMN IF NOT EXISTS nominee_name TEXT;
ALTER TABLE appointament1 ADD COLUMN IF NOT EXISTS nominee_relation TEXT;
ALTER TABLE appointament1 ADD COLUMN IF NOT EXISTS nominee_phone TEXT;
ALTER TABLE appointament1 ADD COLUMN IF NOT EXISTS nominee_aadhaar TEXT;
ALTER TABLE appointament1 ADD COLUMN IF NOT EXISTS nominee_aadhaar_photo TEXT;
ALTER TABLE appointament1 ADD COLUMN IF NOT EXISTS aadhaar_card_doc TEXT;
ALTER TABLE appointament1 ADD COLUMN IF NOT EXISTS applicant_photo TEXT;
ALTER TABLE appointament1 ADD COLUMN IF NOT EXISTS handwritten_doc TEXT;
ALTER TABLE appointament1 ADD COLUMN IF NOT EXISTS verified_by_gov BOOLEAN DEFAULT true;

-- Verification Notice
SELECT 'appointament1 table schema updated successfully!' AS status;
