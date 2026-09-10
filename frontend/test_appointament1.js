import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dasrkwfegjqhkalawdfu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhc3Jrd2ZlZ2pxaGthbGF3ZGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2NzM3NDcsImV4cCI6MjEwMzI0OTc0N30.4jyEQVj5PdcuBOz0JWwnLHcIpfga9ft8QO3giBtZs2s';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAppointament1Insert() {
  console.log('Testing insert into appointament1 table with nominee data & document photos...');
  const serialNum = Math.floor(1001 + Math.random() * 8999);
  const serialId = `0000${serialNum}-2026-4000-8000-00000000${serialNum}`;
  const samplePhoto = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

  const { data, error } = await supabase
    .from('appointament1')
    .insert([
      {
        id: serialId,
        requested_amount: 500000,
        tenure_months: 60,
        monthly_emi: 9500,
        interest_rate: 8.5,
        scheme_id: 'pmegp',
        scheme_name: 'Prime Minister Employment Generation Programme',
        loan_category: 'business_loan',
        specific_purpose: 'Business setup and working capital',

        applicant_name: 'Shekhar Kumar',
        aadhaar_number: '123456789012',
        phone: '9876543210',
        email: 'shekhar@example.com',
        state: 'Uttar Pradesh',
        beneficiary_category: 'general',
        photo_url: samplePhoto,

        nominee_name: 'Sunil Yadav',
        nominee_relation: 'Father',
        nominee_phone: '+91 98765 43210',
        nominee_aadhaar: '987654321098',

        documents: [
          { 
            id: 'doc-aadhaar-1', 
            name: 'aadhaar.pdf', 
            status: 'valid', 
            photo_url: samplePhoto, 
            doc_photo: samplePhoto,
            document_image: samplePhoto 
          },
          {
            id: 'doc-nominee-mandate',
            type: 'important_doc',
            name: 'Nominee: Sunil Yadav (Father)',
            fileName: 'nominee_mandate.pdf',
            fileSize: '0.8 MB',
            status: 'valid',
            photo_url: samplePhoto,
            extractedData: {
              nomineeName: 'Sunil Yadav',
              nomineeRelation: 'Father',
              nomineePhone: '+91 98765 43210',
              nomineeAadhaar: '987654321098'
            }
          }
        ],
        biometric_record: { 
          isVerified: true, 
          type: 'face', 
          token: 'BIO-FACE-SHA256-TEST99', 
          photo: samplePhoto, 
          face_photo_url: samplePhoto 
        },

        status: 'Submitted'
      }
    ])
    .select();

  if (error) {
    console.error('Supabase appointament1 Error:', error);
  } else {
    console.log('Success! Inserted row in appointament1 with Nominee & Document Photo:', JSON.stringify(data, null, 2));
  }
}

testAppointament1Insert();
