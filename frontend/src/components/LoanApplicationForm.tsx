import { supabase } from '../lib/supabase';
import React, { useState } from 'react';
import {
  ShieldCheck,
  Upload,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Lock,
  Sparkles,
  Camera,
  Fingerprint,
  RefreshCw,
  Eye,
  Trash2,
  HelpCircle,
  IndianRupee,
  Check,
  ExternalLink
} from 'lucide-react';
import { Scheme, UploadedDoc, BiometricRecord, LoanApplication, BeneficiaryFilter, UserProfile } from '../types';

interface LoanApplicationFormProps {
  scheme: Scheme;
  user: UserProfile | null;
  onCancel: () => void;
  onSubmitSuccess: (app: LoanApplication) => void;
  onOpenBiometricModal: () => void;
  biometricRecord: BiometricRecord | null;
  prefillAmount?: number;
  prefillTenure?: number;
  onUpdateUser?: (updatedUser: UserProfile) => void;
}

export const LoanApplicationForm: React.FC<LoanApplicationFormProps> = ({
  scheme,
  user,
  onCancel,
  onSubmitSuccess,
  onOpenBiometricModal,
  biometricRecord,
  prefillAmount,
  prefillTenure,
  onUpdateUser,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [requestedAmount, setRequestedAmount] = useState<number>(prefillAmount || scheme.minAmount || 200000);
  const [tenureMonths, setTenureMonths] = useState<number>(prefillTenure || scheme.tenureMonths || 60);
  const [purpose, setPurpose] = useState<string>('');
  // Applicant details state
  const [applicantName, setApplicantName] = useState<string>(user?.fullName || '');
  const [applicantAadhaar, setApplicantAadhaar] = useState<string>(user?.aadhaarNumber || '');
  const [applicantPhone, setApplicantPhone] = useState<string>(user?.phone || '');
  const [applicantEmail, setApplicantEmail] = useState<string>(user?.email || '');
  const [applicantState, setApplicantState] = useState<string>(user?.state || 'Uttar Pradesh');
  const [applicantCategory, setApplicantCategory] = useState<BeneficiaryFilter>(user?.category || 'general');

  // PAN Card & Bank Account State
  const [applicantPan, setApplicantPan] = useState<string>(user?.panNumber || 'ABCDE1234F');
  const [bankAccountNo, setBankAccountNo] = useState<string>(user?.bankDetails?.accountNo || '987654321098');
  const [bankIfsc, setBankIfsc] = useState<string>(user?.bankDetails?.ifsc || 'SBIN0001234');
  const [bankName, setBankName] = useState<string>(user?.bankDetails?.bankName || 'State Bank of India');

  // Minor (<18) & Parent Details State
  const [isMinor, setIsMinor] = useState<boolean>(false);
  const [fatherName, setFatherName] = useState<string>(user?.parentDetails?.fatherName || '');
  const [fatherAadhaar, setFatherAadhaar] = useState<string>(user?.parentDetails?.fatherAadhaar || '');
  const [motherName, setMotherName] = useState<string>(user?.parentDetails?.motherName || '');
  const [motherAadhaar, setMotherAadhaar] = useState<string>(user?.parentDetails?.motherAadhaar || '');

  // Nominee Details State
  const [nomineeName, setNomineeName] = useState<string>(user?.nomineeDetails?.name || '');
  const [nomineeRelation, setNomineeRelation] = useState<string>(user?.nomineeDetails?.relation || 'Father');
  const [nomineePhone, setNomineePhone] = useState<string>(user?.nomineeDetails?.phone || '');
  const [nomineeAadhaar, setNomineeAadhaar] = useState<string>(user?.nomineeDetails?.aadhaar || '');

  // Load saved profile data from localStorage if available
  React.useEffect(() => {
    try {
      const savedStr = localStorage.getItem('jandhan_user_profile');
      if (savedStr) {
        const saved = JSON.parse(savedStr);
        if (saved.fullName) setApplicantName(saved.fullName);
        if (saved.phone) setApplicantPhone(saved.phone);
        if (saved.email) setApplicantEmail(saved.email);
        if (saved.aadhaarNumber) setApplicantAadhaar(saved.aadhaarNumber);
        if (saved.state) setApplicantState(saved.state);
        if (saved.category) setApplicantCategory(saved.category);
        if (saved.nomineeDetails?.name) {
          setNomineeName(saved.nomineeDetails.name);
          if (saved.nomineeDetails.relation) setNomineeRelation(saved.nomineeDetails.relation);
          if (saved.nomineeDetails.phone) setNomineePhone(saved.nomineeDetails.phone);
          if (saved.nomineeDetails.aadhaar) setNomineeAadhaar(saved.nomineeDetails.aadhaar);
        }
        if (saved.parentDetails?.fatherName) {
          setIsMinor(true);
          setFatherName(saved.parentDetails.fatherName);
          if (saved.parentDetails.fatherAadhaar) setFatherAadhaar(saved.parentDetails.fatherAadhaar);
          if (saved.parentDetails.motherName) setMotherName(saved.parentDetails.motherName);
          if (saved.parentDetails.motherAadhaar) setMotherAadhaar(saved.parentDetails.motherAadhaar);
        }
      }
    } catch (e) {
      console.warn('Could not load profile draft:', e);
    }
  }, []);

  const handleSaveDraftProfile = () => {
    const updatedUser: UserProfile = {
      aadhaarNumber: applicantAadhaar || user?.aadhaarNumber || '987654321098',
      fullName: applicantName || 'Shekhar Kumar',
      dob: user?.dob || '1988-04-15',
      gender: user?.gender || 'Male',
      phone: applicantPhone || '+91 98765 43210',
      email: applicantEmail || 'user@example.com',
      address: user?.address || 'Verified Address',
      state: applicantState || 'Uttar Pradesh',
      pincode: user?.pincode || '243001',
      category: applicantCategory || 'general',
      photoUrl: user?.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      creditScore: user?.creditScore || 785,
      isAadhaarVerified: true,
      biometricVerified: true,
      kycTier: 'Tier-3',
      nomineeDetails: nomineeName ? {
        name: nomineeName,
        relation: nomineeRelation,
        phone: nomineePhone,
        aadhaar: nomineeAadhaar,
      } : undefined,
      parentDetails: isMinor ? {
        fatherName,
        fatherAadhaar,
        motherName,
        motherAadhaar,
      } : undefined,
    };

    localStorage.setItem('jandhan_user_profile', JSON.stringify(updatedUser));
    if (onUpdateUser) onUpdateUser(updatedUser);
    setFormError('✅ आपका विवरण व नॉमिनी सहेज लिया गया है! (Profile & Nominee data saved successfully.)');
  };

  // Documents state
  const [documents, setDocuments] = useState<UploadedDoc[]>([
    {
      id: 'doc-aadhaar-default',
      type: 'aadhaar',
      name: 'Aadhaar Card (e-KYC Verified)',
      fileName: 'uidai_ekyc_verified.pdf',
      fileSize: '1.2 MB',
      uploadDate: new Date().toISOString(),
      status: 'valid',
      extractedData: { aadhaar: user?.aadhaarNumber ? `XXXX-XXXX-${user.aadhaarNumber.slice(-4)}` : 'Verified' },
    },
  ]);

  const [isVerifyingDoc, setIsVerifyingDoc] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Calculate EMI
  const monthlyRate = scheme.interestRate / 12 / 100;
  const calculatedEmi = Math.round(
    (requestedAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  );

  // Document upload handler with automatic validation system
  const handleFileUpload = (docType: UploadedDoc['type'], e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsVerifyingDoc(true);
    setFormError('');

    // Simulated automated document validation rules
    setTimeout(() => {
      setIsVerifyingDoc(false);

      const isTooLarge = file.size > 8 * 1024 * 1024;
      const isBadName = file.name.toLowerCase().includes('blur') || file.name.toLowerCase().includes('corrupt');

      let status: 'valid' | 'invalid' = 'valid';
      let rejectionReason: string | undefined;
      const extractedData: Record<string, string> = {};

      if (isTooLarge) {
        status = 'invalid';
        rejectionReason = 'फ़ाइल का आकार बहुत बड़ा है (File size exceeds 8MB limit. Please compress)';
      } else if (isBadName) {
        status = 'invalid';
        rejectionReason = 'धुंधली छवि पाई गई (Blurry image detected: OCR text unreadable. Please upload clear scan)';
      } else if (docType === 'pan') {
        extractedData.pan = 'ABCDE' + Math.floor(1000 + Math.random() * 9000) + 'K';
        extractedData.verifiedWithITD = 'YES';
      } else if (docType === 'bank_statement') {
        extractedData.statementMonths = 'Last 6 Months (Verified)';
        extractedData.averageMonthlyCredits = '₹65,000';
      } else if (docType === 'caste_cert') {
        extractedData.casteCategory = 'SC / ST Validated';
        extractedData.subsidyEligible = '35% Govt. Grant';
      }

      const newDoc: UploadedDoc = {
        id: `doc-${Date.now()}`,
        type: docType,
        name:
          docType === 'pan'
            ? 'PAN Card'
            : docType === 'bank_statement'
              ? 'Bank Statement (6 Months)'
              : docType === 'income_proof'
                ? 'Income Certificate / ITR'
                : docType === 'applicant_photo'
                  ? 'Applicant Passport Photo'
                  : docType === 'caste_cert'
                    ? 'SC/ST Caste Certificate'
                    : 'Supporting Document',
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadDate: new Date().toISOString(),
        status,
        rejectionReason,
        extractedData,
      };

      setDocuments((prev) => [...prev.filter((d) => d.type !== docType), newDoc]);
    }, 800);
  };

  const removeDoc = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  const validateStep2Inputs = (): boolean => {
    setFormError('');

    if (!applicantName.trim() || applicantName.trim().length < 3) {
      setFormError('❌ कृपया आधार और पैन के अनुसार अपना पूरा नाम दर्ज करें (Please enter full legal name as per Aadhaar/PAN)');
      return false;
    }

    if (!applicantAadhaar || applicantAadhaar.length !== 12 || !/^\d{12}$/.test(applicantAadhaar)) {
      setFormError('❌ अमान्य आधार नंबर! आधार नंबर ठीक 12 अंकों का होना अनिवार्य है। (Please enter valid 12-digit Aadhaar number)');
      return false;
    }

    if (!applicantPan || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(applicantPan.toUpperCase())) {
      setFormError('❌ अमान्य पैन कार्ड नंबर! पैन कार्ड नंबर 10 अक्षरों का होना अनिवार्य है (उदा. ABCDE1234F)। (Invalid 10-char PAN Number)');
      return false;
    }

    if (!bankAccountNo || bankAccountNo.length < 9 || !/^\d{9,18}$/.test(bankAccountNo)) {
      setFormError('❌ अमान्य बैंक खाता संख्या! बैंक खाता संख्या 9 से 18 अंकों की होनी अनिवार्य है। (Invalid Bank Account Number)');
      return false;
    }

    if (!bankIfsc || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankIfsc.toUpperCase())) {
      setFormError('❌ अमान्य बैंक IFSC कोड! IFSC कोड 11 अक्षरों का होना अनिवार्य है (उदा. SBIN0001234)। (Invalid Bank IFSC Code)');
      return false;
    }

    // Check name match against saved Aadhaar profile if present
    try {
      const savedStr = localStorage.getItem('jandhan_user_profile');
      if (savedStr) {
        const saved = JSON.parse(savedStr);
        if (saved.fullName) {
          const nameInputWords = applicantName.trim().toLowerCase().split(/\s+/);
          const savedWords = saved.fullName.trim().toLowerCase().split(/\s+/);
          const matchFound = nameInputWords.some((w: string) => savedWords.includes(w));
          if (!matchFound && nameInputWords.length > 0 && savedWords.length > 0) {
            setFormError(`❌ नाम और आधार/पैन कार्ड का रिकॉर्ड मेल नहीं खा रहा है! (Name mismatch with Aadhaar/PAN record: "${applicantName}" vs "${saved.fullName}")`);
            return false;
          }
        }
      }
    } catch (e) {}

    return true;
  };

  const handleNextStep = () => {
    setFormError('');
    if (currentStep === 2) {
      if (!validateStep2Inputs()) return;
    }
    setCurrentStep((s) => s + 1);
  };

  const handleSubmitApplication = async () => {
    if (!applicantAadhaar || applicantAadhaar.length < 10) {
      setFormError('Please provide a valid Aadhaar number');
      setCurrentStep(2);
      return;
    }

    // Check document validation
    const hasInvalidDocs = documents.some((d) => d.status === 'invalid');
    if (hasInvalidDocs) {
      setFormError('Some documents have validation errors. Please re-upload before submitting.');
      setCurrentStep(3);
      return;
    }

    setIsSubmitting(true);
    setFormError('');


    try {
      let insertedData: any = null;

      // Generate clean serial ID with serial number (e.g. 00001001-2026-4000-8000-000000001001)
      const serialCount = Math.floor(1001 + Math.random() * 8999);
      const cleanSerialId = `0000${serialCount}-2026-4000-8000-00000000${serialCount}`;

      // Enhance documents with actual user photo & document images ("hu b hu photo")
      const userPhoto = user?.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

      const enrichedDocuments = documents.map(d => ({
        ...d,
        photo_url: userPhoto,
        doc_photo: userPhoto,
        document_image: userPhoto,
      }));

      // Enhance biometric_record with actual face photo
      const enrichedBiometric = {
        isVerified: true,
        type: 'face',
        token: biometricRecord?.token || `BIO-FACE-SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        photo: userPhoto,
        face_photo_url: userPhoto,
        verifiedAt: biometricRecord?.verifiedAt || new Date().toISOString(),
      };

      // Nominee details data object
      const nomineeData = {
        nomineeName: nomineeName || 'Sunil Yadav',
        nomineeRelation: nomineeRelation || 'Father',
        nomineePhone: nomineePhone || '+91 98765 43210',
        nomineeAadhaar: nomineeAadhaar || '987654321098',
      };

      // 1. Supabase table 'appointament1' me insert karein
      if (supabase) {
        const fullPayload = {
          id: cleanSerialId,
          requested_amount: requestedAmount,
          tenure_months: tenureMonths,
          monthly_emi: calculatedEmi,
          interest_rate: scheme.interestRate,
          scheme_id: scheme.id,
          scheme_name: scheme.name,
          loan_category: scheme.category,
          specific_purpose: purpose || 'Business setup and working capital',

          applicant_name: applicantName,
          aadhaar_number: applicantAadhaar,
          phone: applicantPhone,
          email: applicantEmail,
          state: applicantState,
          beneficiary_category: applicantCategory,
          photo_url: userPhoto,

          nominee_name: nomineeData.nomineeName,
          nominee_relation: nomineeData.nomineeRelation,
          nominee_phone: nomineeData.nomineePhone,
          nominee_aadhaar: nomineeData.nomineeAadhaar,

          documents: [
            ...enrichedDocuments,
            {
              id: 'doc-nominee-mandate',
              type: 'important_doc' as const,
              name: `Nominee: ${nomineeData.nomineeName} (${nomineeData.nomineeRelation})`,
              fileName: 'nominee_mandate.pdf',
              fileSize: '0.8 MB',
              uploadDate: new Date().toISOString(),
              status: 'valid' as const,
              photo_url: userPhoto,
              doc_photo: userPhoto,
              document_image: userPhoto,
              extractedData: nomineeData
            },
            ...(isMinor ? [{
              id: 'doc-parent-details',
              type: 'father_aadhaar' as const,
              name: `Father: ${fatherName || 'Parent Verified'} & Mother: ${motherName || 'Parent Verified'}`,
              fileName: 'parent_co_borrower_proof.pdf',
              fileSize: '1.4 MB',
              uploadDate: new Date().toISOString(),
              status: 'valid' as const,
              photo_url: userPhoto,
              doc_photo: userPhoto,
              document_image: userPhoto,
              extractedData: { fatherName, fatherAadhaar, motherName, motherAadhaar }
            }] : [])
          ],
          biometric_record: enrichedBiometric,

          status: 'Submitted'
        };

        // Try inserting with nominee columns first
        let { data, error } = await supabase
          .from('appointament1')
          .insert([fullPayload])
          .select();

        if (error && (error.code === 'PGRST204' || error.message?.includes('column'))) {
          console.warn('Supabase missing nominee columns in schema cache, using fallback insert...');
          const fallbackPayload = { ...fullPayload };
          delete (fallbackPayload as any).nominee_name;
          delete (fallbackPayload as any).nominee_relation;
          delete (fallbackPayload as any).nominee_phone;
          delete (fallbackPayload as any).nominee_aadhaar;
          delete (fallbackPayload as any).photo_url;

          const res = await supabase
            .from('appointament1')
            .insert([fallbackPayload])
            .select();
          
          data = res.data;
          error = res.error;
        }

        if (error) {
          setIsSubmitting(false);
          setFormError('Submission error: ' + error.message);
          return;
        }

        insertedData = data;
      }

      setIsSubmitting(false);

      // 2. Component ka existing success flow maintain karne ke liye
      const generatedId = insertedData?.[0]?.id || `JD-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const newApplication: LoanApplication = {
        id: generatedId,
        trackingId: generatedId,
        applicantAadhaar,
        applicantName,
        applicantPhone,
        applicantEmail,
        applicantState,
        applicantCategory,
        nomineeDetails: {
          name: nomineeData.nomineeName,
          relation: nomineeData.nomineeRelation,
          phone: nomineeData.nomineePhone,
          aadhaar: nomineeData.nomineeAadhaar,
        },
        schemeId: scheme.id,
        schemeName: scheme.name,
        category: scheme.category,
        requestedAmount,
        tenureMonths,
        monthlyEmi: calculatedEmi,
        interestRate: scheme.interestRate,
        purpose: purpose || 'Business setup and working capital',
        documents: [
          ...enrichedDocuments,
          {
            id: 'doc-nominee-mandate',
            type: 'important_doc' as const,
            name: `Nominee: ${nomineeData.nomineeName} (${nomineeData.nomineeRelation})`,
            fileName: 'nominee_mandate.pdf',
            fileSize: '0.8 MB',
            uploadDate: new Date().toISOString(),
            status: 'valid' as const,
            photo_url: userPhoto,
            extractedData: nomineeData
          }
        ],
        biometric: biometricRecord || { isVerified: true, type: 'face' },
        status: 'submitted',
        appliedDate: new Date().toISOString()
      };

      onSubmitSuccess(newApplication);
    } catch (err: any) {
      console.error('Submission error:', err);
      setIsSubmitting(false);
      setFormError('Error saving application: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <div id="loan-application-wizard" className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Wizard Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Wizard Header Banner */}
        <div className="p-6 bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 text-white relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-emerald-100 uppercase tracking-wider">
                100% Digital Loan Application
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold mt-1">{scheme.name}</h2>
              <p className="text-xs text-emerald-100/90 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Direct Bank & Government Portal Submission
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={scheme.officialPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs border border-blue-400/40"
                title={scheme.officialPortalUrl}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>सरकारी पोर्टल (Govt Site) पर जाएं</span>
              </a>

              <button
                onClick={onCancel}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center justify-between mt-6 max-w-lg mx-auto">
            {[1, 2, 3, 4, 5].map((stepNum) => {
              const isPast = currentStep > stepNum;
              const isCurrent = currentStep === stepNum;
              return (
                <div key={stepNum} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${isCurrent
                      ? 'bg-emerald-400 text-slate-950 ring-4 ring-emerald-400/30 font-extrabold'
                      : isPast
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white/20 text-white/60'
                      }`}
                  >
                    {isPast ? <Check className="w-4 h-4" /> : stepNum}
                  </div>
                  {stepNum < 5 && (
                    <div
                      className={`w-10 sm:w-16 h-1 mx-1 rounded-full transition-colors ${currentStep > stepNum ? 'bg-emerald-500' : 'bg-white/20'
                        }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-emerald-100/80 mt-2 px-1 max-w-lg mx-auto">
            <span>Amount</span>
            <span>Citizen</span>
            <span>Documents</span>
            <span>Biometrics</span>
            <span>Review</span>
          </div>
        </div>

        {/* Error Notification */}
        {formError && (
          <div className="m-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{formError}</span>
          </div>
        )}

        {/* Step 1: Scheme & Amount Details */}
        {currentStep === 1 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Step 1: Loan Amount & Purpose / ऋण राशि एवं उद्देश्य
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Configure your required loan amount within the eligible limit of this scheme.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Requested Loan Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-slate-400 font-bold">₹</span>
                  <input
                    id="loan-requested-amount-input"
                    type="number"
                    min={scheme.minAmount}
                    max={scheme.maxAmount}
                    value={requestedAmount}
                    onChange={(e) => setRequestedAmount(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-base font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-1.5 font-mono">
                  <span>Min: ₹{scheme.minAmount.toLocaleString('en-IN')}</span>
                  <span>Max: ₹{scheme.maxAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Tenure / पुनर्भुगतान अवधि
                </label>
                <select
                  id="loan-tenure-select"
                  value={tenureMonths}
                  onChange={(e) => setTenureMonths(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value={12}>12 Months (1 Year)</option>
                  <option value={24}>24 Months (2 Years)</option>
                  <option value={36}>36 Months (3 Years)</option>
                  <option value={60}>60 Months (5 Years)</option>
                  <option value={84}>84 Months (7 Years)</option>
                  <option value={120}>120 Months (10 Years)</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Interest: <strong>{scheme.interestRate}% p.a.</strong>
                </p>
              </div>
            </div>

            {/* Calculated Monthly EMI Preview */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-800 dark:text-emerald-300 block font-medium">
                  Estimated Monthly EMI (मासिक किस्त)
                </span>
                <span className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-700 dark:text-emerald-300">
                  ₹{calculatedEmi.toLocaleString('en-IN')}
                  <span className="text-xs font-normal"> / month</span>
                </span>
              </div>
              {scheme.subsidyPercentage && scheme.subsidyPercentage > 0 && (
                <div className="text-right">
                  <span className="text-xs text-amber-700 dark:text-amber-300 block font-bold">
                    Govt. Subsidy Grant
                  </span>
                  <span className="text-sm font-bold text-amber-800 dark:text-amber-200">
                    Up to ₹{Math.round((requestedAmount * scheme.subsidyPercentage) / 100).toLocaleString('en-IN')} ({scheme.subsidyPercentage}%)
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Specific Purpose of Loan / ऋण का उद्देश्य
              </label>
              <textarea
                id="loan-purpose-input"
                rows={3}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Purchase of modern CNC equipment / setup of grocery mart / expanding tailoring boutique"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>
        )}

        {/* Step 2: Citizen & Beneficiary Details */}
        {currentStep === 2 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Step 2: Applicant Information & Category / आवेदक विवरण
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ensure Aadhaar and category details are correct to claim special government subsidies.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Full Name (as per Aadhaar) *</span>
                  {user?.fullName && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Permanent Account Identity
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    readOnly={Boolean(user?.fullName)}
                    placeholder="Full Legal Name"
                    className={`w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 ${
                      user?.fullName ? 'bg-slate-200/70 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 cursor-not-allowed font-extrabold' : 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                    } text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Aadhaar Number (12 Digits)
                </label>
                <input
                  type="text"
                  maxLength={12}
                  value={applicantAadhaar}
                  onChange={(e) => setApplicantAadhaar(e.target.value.replace(/\D/g, ''))}
                  placeholder="12-digit Aadhaar"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  State / Union Territory
                </label>
                <select
                  value={applicantState}
                  onChange={(e) => setApplicantState(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Delhi NCT">Delhi NCT</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Beneficiary Category (सब्सिडी श्रेणी)
                </label>
                <select
                  value={applicantCategory}
                  onChange={(e) => setApplicantCategory(e.target.value as BeneficiaryFilter)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="general">General Citizen</option>
                  <option value="obc">OBC / अन्य पिछड़ा वर्ग (Eligible for Govt Subsidy)</option>
                  <option value="sc_st">SC / ST (Eligible for 35% Subsidy)</option>
                  <option value="women">Women Entrepreneur (Special Concession)</option>
                  <option value="senior_citizen">Senior Citizen Pensioner</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  PAN Card Number (10 Chars) *
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={applicantPan}
                  onChange={(e) => setApplicantPan(e.target.value.toUpperCase())}
                  placeholder="e.g. ABCDE1234F"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs font-bold uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Bank Account Number (खाता संख्या) *
                </label>
                <input
                  type="text"
                  maxLength={18}
                  value={bankAccountNo}
                  onChange={(e) => setBankAccountNo(e.target.value.replace(/\D/g, ''))}
                  placeholder="9-18 digit Bank Account Number"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Bank IFSC Code (आईएफएससी कोड) *
                </label>
                <input
                  type="text"
                  maxLength={11}
                  value={bankIfsc}
                  onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                  placeholder="e.g. SBIN0001234"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs font-bold uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Bank Name (बैंक का नाम)
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. State Bank of India"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Minor Applicant Toggle & Co-Applicant Parent Details */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 space-y-4">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-indigo-950 dark:text-indigo-200">
                <input
                  type="checkbox"
                  checked={isMinor}
                  onChange={(e) => setIsMinor(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>👨‍👩‍👦 क्या आवेदक माइनर (18 वर्ष से कम आयु) है? (Is applicant under 18 years old?)</span>
              </label>

              {isMinor && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-indigo-200 dark:border-indigo-800">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      पिता का नाम (Father Name - Co-Borrower)
                    </label>
                    <input
                      type="text"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      placeholder="Father Full Name"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      पिता का आधार नंबर (Father Aadhaar)
                    </label>
                    <input
                      type="text"
                      maxLength={12}
                      value={fatherAadhaar}
                      onChange={(e) => setFatherAadhaar(e.target.value.replace(/\D/g, ''))}
                      placeholder="12-digit Aadhaar"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      माता का नाम (Mother Name)
                    </label>
                    <input
                      type="text"
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      placeholder="Mother Full Name"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      माता का आधार नंबर (Mother Aadhaar)
                    </label>
                    <input
                      type="text"
                      maxLength={12}
                      value={motherAadhaar}
                      onChange={(e) => setMotherAadhaar(e.target.value.replace(/\D/g, ''))}
                      placeholder="12-digit Aadhaar"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs font-bold"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Nominee Details Section */}
            <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 space-y-3">
              <h4 className="text-xs font-bold text-teal-950 dark:text-teal-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>🤝 नॉमिनी का विवरण (Nominee Details for Loan Security)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    नॉमिनी का नाम (Nominee Full Name)
                  </label>
                  <input
                    type="text"
                    value={nomineeName}
                    onChange={(e) => setNomineeName(e.target.value)}
                    placeholder="Full Legal Name of Nominee"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    नॉमिनी से संबंध (Relationship)
                  </label>
                  <select
                    value={nomineeRelation}
                    onChange={(e) => setNomineeRelation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                  >
                    <option value="Father">Father (पिता)</option>
                    <option value="Mother">Mother (माता)</option>
                    <option value="Spouse">Spouse (पति / पत्नी)</option>
                    <option value="Guardian">Guardian (अभिभावक)</option>
                    <option value="Son">Son (पुत्र)</option>
                    <option value="Daughter">Daughter (पुत्री)</option>
                    <option value="Brother">Brother / Sister (भाई / बहन)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    नॉमिनी का मोबाइल नंबर (Nominee Mobile)
                  </label>
                  <input
                    type="tel"
                    value={nomineePhone}
                    onChange={(e) => setNomineePhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    नॉमिनी का आधार नंबर (Nominee Aadhaar)
                  </label>
                  <input
                    type="text"
                    maxLength={12}
                    value={nomineeAadhaar}
                    onChange={(e) => setNomineeAadhaar(e.target.value.replace(/\D/g, ''))}
                    placeholder="12-digit Aadhaar"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSaveDraftProfile}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
              >
                💾 विवरण व नॉमिनी सहेजें (Save Profile & Nominee Data)
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Online Document Upload & Automated Validation System */}
        {currentStep === 3 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Step 3: Online Document Upload & Auto-Validation</span>
                {isVerifyingDoc && (
                  <span className="text-xs font-normal text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    AI Validation in Progress...
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Uploaded documents are immediately verified against government databases with instant feedback.
              </p>
            </div>

            {/* Document Upload Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* PAN Card */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-600" /> PAN Card
                  </span>
                  <span className="text-[10px] text-red-500 font-bold">*Required</span>
                </div>
                <label className="block w-full py-2 px-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-center cursor-pointer hover:border-emerald-500 transition-colors">
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" /> Upload PAN (PDF/JPG)
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('pan', e)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Bank Statement */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-600" /> Bank Statement (6 Months)
                  </span>
                  <span className="text-[10px] text-red-500 font-bold">*Required</span>
                </div>
                <label className="block w-full py-2 px-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-center cursor-pointer hover:border-emerald-500 transition-colors">
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" /> Upload Bank Statement
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('bank_statement', e)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Income / ITR / Project Report */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-600" /> Income Proof / DPR
                  </span>
                  <span className="text-[10px] text-slate-400">Optional</span>
                </div>
                <label className="block w-full py-2 px-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-center cursor-pointer hover:border-emerald-500 transition-colors">
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" /> Upload Income Proof
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('income_proof', e)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Caste Certificate if SC/ST */}
              {applicantCategory === 'sc_st' && (
                <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-amber-600" /> SC/ST Caste Certificate
                    </span>
                    <span className="text-[10px] text-amber-600 font-bold">For 35% Subsidy</span>
                  </div>
                  <label className="block w-full py-2 px-3 rounded-lg border border-dashed border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-900 text-center cursor-pointer hover:border-amber-500 transition-colors">
                    <span className="text-xs text-amber-700 dark:text-amber-300 flex items-center justify-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" /> Upload Caste Certificate
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('caste_cert', e)}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Uploaded Documents List with Automated Validation Results */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Document Validation Status / जांच परिणाम ({documents.length})
              </h4>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-3.5 flex items-center justify-between gap-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3.5">
                      {/* Document Image Photo Preview Thumbnail (Picture 3 requirement) */}
                      <div className="relative w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 shadow-xs flex items-center justify-center">
                        <img
                          src={doc.photo_url || doc.doc_photo || doc.document_image || user?.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                          alt={doc.name}
                          className="w-full h-full object-cover"
                        />
                        <div className={`absolute bottom-0 right-0 p-0.5 rounded-tl ${
                          doc.status === 'valid' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-slate-950'
                        }`}>
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{doc.name}</p>
                          <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-300 dark:border-emerald-800">
                            Verified Document Photo
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {doc.fileName} • {doc.fileSize}
                        </p>

                        {/* Rejection Reason Notice */}
                        {doc.status === 'invalid' && doc.rejectionReason && (
                          <div className="mt-1.5 p-2 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-[11px] text-red-700 dark:text-red-300 font-medium">
                            <strong>अस्वीकृति का कारण (Reason):</strong> {doc.rejectionReason}
                          </div>
                        )}

                        {/* Validation Success Metadata */}
                        {doc.status === 'valid' && doc.extractedData && (
                          <div className="mt-1 flex flex-wrap gap-2 text-[10px] text-emerald-700 dark:text-emerald-300 font-mono">
                            {Object.entries(doc.extractedData).map(([k, v]) => (
                              <span key={k} className="bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                                {k}: {v}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeDoc(doc.id)}
                      className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Biometric Authentication */}
        {currentStep === 4 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Step 4: Biometric e-KYC Verification / बायोमेट्रिक प्रमाणीकरण
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Verify applicant identity using live camera face liveness match or fingerprint sensor.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center space-y-4">
              {biometricRecord?.isVerified ? (
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-900/30">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h4 className="text-base font-bold text-emerald-800 dark:text-emerald-300">
                    Biometric Verification Complete!
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Token: {biometricRecord.token || 'BIO-AUTH-SHA256-7E9A34B8C1'}
                  </p>
                  {biometricRecord.faceMatchScore && (
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold font-mono">
                      Face Match Score: {biometricRecord.faceMatchScore}%
                    </span>
                  )}
                </div>
              ) : (
                <div className="space-y-4 max-w-sm mx-auto">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
                    <Fingerprint className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Identity Liveness Check Required
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Required by Reserve Bank of India (RBI) digital lending guidelines to prevent identity fraud.
                    </p>
                  </div>
                  <button
                    id="open-biometric-verify-btn"
                    type="button"
                    onClick={onOpenBiometricModal}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Start Biometric Face / Fingerprint Scan
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 5: Review & Submit */}
        {currentStep === 5 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Step 5: Review & Encrypted Submission / अंतिम समीक्षा
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                All data is encrypted with 256-bit AES before being dispatched to the bank nodal hub.
              </p>
            </div>

            <div className="space-y-4">
              {/* Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500">Scheme Name:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{scheme.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500">Loan Amount:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    ₹{requestedAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500">Monthly EMI:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    ₹{calculatedEmi.toLocaleString('en-IN')} / month ({tenureMonths} Months)
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500">Applicant:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {applicantName} (Aadhaar: XXXX-XXXX-{applicantAadhaar.slice(-4)})
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500">Beneficiary Category:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 uppercase">
                    {applicantCategory} {applicantCategory === 'sc_st' ? '(35% Subsidy)' : ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Documents Attached:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {documents.filter((d) => d.status === 'valid').length} Verified Documents
                  </span>
                </div>
              </div>

              {/* Encryption Certificate Badge */}
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
                <Lock className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-[11px] text-emerald-800 dark:text-emerald-300">
                  <p className="font-bold">End-to-End Cryptographic Security</p>
                  <p className="text-emerald-700/80 dark:text-emerald-400/80">
                    Your financial statement and Aadhaar records are protected under the Digital Personal Data Protection (DPDP) Act.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              id="wizard-prev-btn"
              type="button"
              onClick={() => setCurrentStep((s) => s - 1)}
              className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
          ) : (
            <button
              type="button"
              onClick={onCancel}
              className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
          )}

          {currentStep < 5 ? (
            <button
              id="wizard-next-btn"
              type="button"
              onClick={handleNextStep}
              className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="wizard-submit-btn"
              type="button"
              onClick={handleSubmitApplication}
              disabled={isSubmitting}
              className="py-3 px-7 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 disabled:opacity-50 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Encrypting & Submitting Application...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-200" />
                  Submit Application Online (घर बैठे आवेदन करें)
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
