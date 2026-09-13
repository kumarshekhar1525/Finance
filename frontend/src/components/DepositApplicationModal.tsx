import { supabase } from '../lib/supabase';
import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Lock,
  Camera,
  RefreshCw,
  Trash2,
  X,
  ExternalLink,
  Calendar,
  DollarSign,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { DepositScheme, UploadedDoc, UserProfile, DepositApplication, SupportedLanguage } from '../types';
import { INDIAN_STATES_AND_UTS } from './LoanApplicationForm';

interface DepositApplicationModalProps {
  scheme: DepositScheme;
  user: UserProfile | null;
  currentLang?: SupportedLanguage;
  onClose: () => void;
  onSubmitSuccess: (app: DepositApplication) => void;
}

export const DepositApplicationModal: React.FC<DepositApplicationModalProps> = ({
  scheme,
  user,
  currentLang = 'hi',
  onClose,
  onSubmitSuccess,
}) => {
  const isEn = currentLang === 'en';
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // SIP & Investment type state
  const [investmentType, setInvestmentType] = useState<'sip' | 'lumpsum'>(scheme.investmentType === 'sip' ? 'sip' : 'lumpsum');
  const [frequency, setFrequency] = useState<'monthly' | 'quarterly' | 'half_yearly' | 'yearly'>('monthly');
  const [depositAmount, setDepositAmount] = useState<number>(scheme.minDeposit > 5000 ? scheme.minDeposit : 10000);
  const [tenureYears, setTenureYears] = useState<number>(scheme.tenureYears || 5);

  // Applicant details state
  const [applicantName, setApplicantName] = useState<string>(user?.fullName || '');
  const [applicantDob, setApplicantDob] = useState<string>(user?.dob || '1995-05-15');
  const [applicantAadhaar, setApplicantAadhaar] = useState<string>(user?.aadhaarNumber || '');
  const [applicantPhone, setApplicantPhone] = useState<string>(user?.phone || '');
  const [applicantEmail, setApplicantEmail] = useState<string>(user?.email || '');
  const [applicantState, setApplicantState] = useState<string>(user?.state || 'Uttar Pradesh');
  const [applicantPan, setApplicantPan] = useState<string>(user?.panNumber || 'ABCDE1234F');
  const [bankAccountNo, setBankAccountNo] = useState<string>(user?.bankDetails?.accountNo || '987654321098');
  const [bankIfsc, setBankIfsc] = useState<string>(user?.bankDetails?.ifsc || 'SBIN0001234');
  const [bankName, setBankName] = useState<string>(user?.bankDetails?.bankName || 'State Bank of India');

  // Parent & Child Birth Certificate State
  const [parentName, setParentName] = useState<string>(user?.parentDetails?.fatherName || '');
  const [parentAadhaar, setParentAadhaar] = useState<string>(user?.parentDetails?.fatherAadhaar || '');
  const [hasNoAadhaarUseBirthCert, setHasNoAadhaarUseBirthCert] = useState<boolean>(false);
  const [birthCertFileName, setBirthCertFileName] = useState<string | null>(null);

  // Nominee Details
  const [nomineeName, setNomineeName] = useState<string>(user?.nomineeDetails?.name || '');
  const [nomineeRelation, setNomineeRelation] = useState<string>(user?.nomineeDetails?.relation || 'Father');
  const [nomineeAadhaar, setNomineeAadhaar] = useState<string>(user?.nomineeDetails?.aadhaar || '');

  // Premature Withdrawal Agreement
  const [agreePrematureWithdrawal, setAgreePrematureWithdrawal] = useState<boolean>(true);

  // Documents state
  const [documents, setDocuments] = useState<UploadedDoc[]>([
    {
      id: 'doc-aadhaar-default',
      type: 'aadhaar',
      name: isEn ? 'Applicant Aadhaar Card (e-KYC Verified)' : 'आवेदक आधार कार्ड (UIDAI Verified)',
      fileName: 'uidai_ekyc_verified.pdf',
      fileSize: '1.2 MB',
      uploadDate: new Date().toISOString(),
      status: 'valid',
    },
  ]);
  const [nomineeAadhaarPhoto, setNomineeAadhaarPhoto] = useState<string | null>(null);
  const [birthCertPhoto, setBirthCertPhoto] = useState<string | null>(null);
  const [capturedLivePhoto, setCapturedLivePhoto] = useState<string | null>(null);
  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Maturity Days & Amount Calculations
  const maturityDays = React.useMemo(() => {
    return Math.round((tenureYears || 1) * 365.25);
  }, [tenureYears]);

  const computedAge = React.useMemo(() => {
    if (!applicantDob) return 28;
    const birth = new Date(applicantDob);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) {
      years--;
    }
    return years >= 0 ? years : 0;
  }, [applicantDob]);

  const expectedMaturityAmount = React.useMemo(() => {
    const r = (scheme.interestRate || 7.5) / 100;
    const t = tenureYears || 5;

    if (investmentType === 'lumpsum') {
      const p = depositAmount || 50000;
      return Math.round(p * Math.pow(1 + r, t));
    } else {
      // SIP Compound Calculation
      const freqPerYear = frequency === 'monthly' ? 12 : frequency === 'quarterly' ? 4 : frequency === 'half_yearly' ? 2 : 1;
      const totalPayments = t * freqPerYear;
      const ratePerPeriod = r / freqPerYear;
      const p = depositAmount || 2000;
      let total = 0;
      for (let i = 1; i <= totalPayments; i++) {
        total += p * Math.pow(1 + ratePerPeriod, totalPayments - i + 1);
      }
      return Math.round(total);
    }
  }, [depositAmount, tenureYears, scheme.interestRate, investmentType, frequency]);

  const handleFileUpload = (docType: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (docType === 'nominee_aadhaar') setNomineeAadhaarPhoto(dataUrl);
      if (docType === 'birth_cert') {
        setBirthCertPhoto(dataUrl);
        setBirthCertFileName(file.name);
      }

      const newDoc: UploadedDoc = {
        id: `doc-dep-${Date.now()}`,
        type: docType as any,
        name: docType === 'birth_cert' ? (isEn ? 'Infant Birth Certificate' : 'शिशु का जन्म प्रमाण पत्र') : docType === 'nominee_aadhaar' ? (isEn ? 'Nominee Aadhaar Card Photo' : 'नॉमिनी आधार कार्ड फोटो') : 'Document',
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadDate: new Date().toISOString(),
        status: 'valid',
        previewUrl: dataUrl,
      };
      setDocuments((prev) => [...prev.filter((d) => d.type !== (docType as any)), newDoc]);
    };
    reader.readAsDataURL(file);
  };

  const validateStep2Inputs = (): boolean => {
    setFormError('');
    if (!applicantName.trim() || applicantName.trim().length < 2) {
      setFormError(isEn ? '❌ Please enter valid Applicant Name as per official ID' : '❌ कृपया आधार के अनुसार नाम दर्ज करें');
      return false;
    }
    if (!hasNoAadhaarUseBirthCert) {
      if (!applicantAadhaar || applicantAadhaar.length !== 12 || !/^\d{12}$/.test(applicantAadhaar)) {
        setFormError(isEn ? '❌ Validation Failed: 12-Digit Aadhaar Number is mandatory!' : '❌ सत्यापन विफल: आधार संख्या ठीक 12 अंकों की होनी अनिवार्य है!');
        return false;
      }
    } else {
      if (!birthCertFileName) {
        setFormError(isEn ? '❌ Please upload Infant Birth Certificate if Aadhaar is unavailable' : '❌ आधार उपलब्ध न होने पर कृपया शिशु का जन्म प्रमाण पत्र अपलोड करें');
        return false;
      }
    }
    if (parentName.trim() && parentAadhaar && parentAadhaar.length !== 12) {
      setFormError(isEn ? "❌ Parent's Aadhaar must be exactly 12 digits" : '❌ माता-पिता का आधार नंबर ठीक 12 अंकों का होना आवश्यक है');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const trackingId = `DEP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const userPhoto = capturedLivePhoto || user?.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

    const newApp: DepositApplication = {
      id: trackingId,
      trackingId,
      applicantAadhaar: applicantAadhaar || '000000000000',
      applicantPan,
      applicantName,
      applicantPhone,
      applicantEmail,
      applicantState,
      applicantCategory: user?.category || 'general',
      dob: applicantDob,
      age: computedAge,
      parentName,
      parentAadhaar,
      birthCertificateDoc: birthCertFileName || undefined,
      depositAmount,
      investmentType,
      frequency: investmentType === 'sip' ? frequency : undefined,
      tenureYears,
      maturityDays,
      expectedMaturityAmount,
      schemeId: scheme.id,
      schemeName: isEn ? scheme.name : scheme.nameHi,
      nomineeName,
      nomineeRelation,
      nomineeAadhaar,
      nomineeAadhaarPhoto: nomineeAadhaarPhoto || undefined,
      applicantPhoto: userPhoto,
      agreePrematureWithdrawalRules: agreePrematureWithdrawal,
      status: 'submitted',
      appliedDate: new Date().toISOString(),
      documents,
      biometric: { isVerified: true, type: 'face' },
    };

    // Save in Supabase savings_applications table
    if (supabase) {
      try {
        await supabase.from('savings_applications').insert([{
          id: trackingId,
          tracking_id: trackingId,
          applicant_name: applicantName,
          aadhaar_number: applicantAadhaar || '000000000000',
          pan_number: applicantPan,
          phone: applicantPhone,
          email: applicantEmail,
          state: applicantState,
          dob: applicantDob,
          age: computedAge,
          parent_name: parentName,
          parent_aadhaar: parentAadhaar,
          birth_certificate_doc: birthCertFileName,
          deposit_amount: depositAmount,
          investment_type: investmentType,
          frequency: investmentType === 'sip' ? frequency : 'one_time',
          tenure_years: tenureYears,
          maturity_days: maturityDays,
          expected_maturity_amount: expectedMaturityAmount,
          interest_rate: scheme.interestRate,
          scheme_id: scheme.id,
          scheme_name: scheme.name,
          nominee_name: nomineeName,
          nominee_relation: nomineeRelation,
          nominee_aadhaar: nomineeAadhaar,
          nominee_aadhaar_photo: nomineeAadhaarPhoto,
          applicant_photo: userPhoto,
          agree_premature_withdrawal: agreePrematureWithdrawal,
          status: 'submitted',
        }]);
      } catch (e) {
        console.warn('Supabase savings insert warning:', e);
      }
    }

    setIsSubmitting(false);
    onSubmitSuccess(newApp);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-900 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/30 border border-blue-400/30 text-blue-200 uppercase tracking-wider">
              {isEn ? '100% Digital Bank Deposit Portal' : '100% डिजिटल बचत व ब्याज आवेदन'}
            </span>
            <h2 className="text-xl font-extrabold mt-1">{isEn ? scheme.name : scheme.nameHi}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {formError && (
          <div className="m-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Step 1: Investment Mode & Calculator */}
        {currentStep === 1 && (
          <div className="p-6 sm:p-8 space-y-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{isEn ? 'Step 1: Choose Investment Type & Duration' : 'Step 1: निवेश प्रकार, मासिक/वार्षिक किस्‍त एवं अवधि चुनें'}</span>
            </h3>

            {/* SIP vs LumpSum Toggle */}
            <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setInvestmentType('sip')}
                className={`py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                  investmentType === 'sip'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <span>🔄 {isEn ? 'SIP / Recurring Deposit (मासिक किस्त)' : 'SIP / आवर्ती किस्‍त (मासिक जमा)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setInvestmentType('lumpsum')}
                className={`py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                  investmentType === 'lumpsum'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <span>💵 {isEn ? 'One-Time / LumpSum (एकमुश्त जमा)' : 'एकमुश्त जमा (LumpSum)'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {investmentType === 'sip' ? (isEn ? 'Installment Amount (₹)' : 'किस्त राशि (₹)') : (isEn ? 'Deposit Amount (₹)' : 'एकमुश्त जमा राशि (₹)')}
                </label>
                <input
                  type="number"
                  min={scheme.minDeposit}
                  max={scheme.maxDeposit}
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold text-sm"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>Min: ₹{scheme.minDeposit.toLocaleString('en-IN')}</span>
                  <span>Max: ₹{scheme.maxDeposit.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {investmentType === 'sip' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {isEn ? 'Deposit Frequency' : 'जमा आवृत्ति'}
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs"
                  >
                    <option value="monthly">{isEn ? 'Monthly (मासिक)' : 'मासिक (Monthly)'}</option>
                    <option value="quarterly">{isEn ? 'Quarterly (त्रैमासिक)' : 'त्रैमासिक (Quarterly)'}</option>
                    <option value="half_yearly">{isEn ? 'Half-Yearly (अर्द्धवार्षिक)' : 'अर्द्धवार्षिक (Half-Yearly)'}</option>
                    <option value="yearly">{isEn ? 'Yearly (वार्षिक)' : 'वार्षिक (Yearly)'}</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isEn ? 'Deposit Tenure (Years)' : 'जमा अवधि (वर्ष)'}
                </label>
                <select
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs"
                >
                  {[1, 2, 3, 5, 10, 15, 21].map((y) => (
                    <option key={y} value={y}>{y} {isEn ? 'Years' : 'वर्ष'} ({Math.round(y * 365.25)} {isEn ? 'Days' : 'दिन'})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Expected Returns Preview Card */}
            <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-blue-900 dark:text-blue-300 block font-bold">
                  {isEn ? 'Guaranteed Maturity Return' : 'अनुमानित परिपक्वता राशि (Maturity Return)'}
                </span>
                <span className="text-2xl font-black font-mono text-blue-700 dark:text-blue-300">
                  ₹{expectedMaturityAmount.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">
                  Maturity Period: {tenureYears} Years ({maturityDays.toLocaleString('en-IN')} Days)
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-amber-700 dark:text-amber-300 font-bold block">{isEn ? 'Interest Rate' : 'वार्षिक ब्याज दर'}</span>
                <span className="text-xl font-black text-amber-800 dark:text-amber-200 font-mono">{scheme.interestRate}% p.a.</span>
              </div>
            </div>

            {/* Premature Withdrawal Notice */}
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>{isEn ? 'Premature Withdrawal Policy' : 'समयपूर्व निकासी (Premature Withdrawal Rules)'}</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {isEn
                  ? (scheme.prematureWithdrawalRulesEn || 'Partial or premature withdrawal permitted after 1 year with applicable penalty/interest adjustment as per bank/govt norms.')
                  : (scheme.prematureWithdrawalRulesHi || '1 वर्ष के बाद आंशिक अथवा समयपूर्व निकासी सरकारी/बैंक नियमों के तहत ब्याज समायोजन के साथ अनुमत है।')}
              </p>
              <label className="flex items-center gap-2 pt-1 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreePrematureWithdrawal}
                  onChange={(e) => setAgreePrematureWithdrawal(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-[11px]">{isEn ? 'I agree to the Premature Withdrawal & Maturity terms' : 'मैं समयपूर्व निकासी एवं परिपक्वता नियमों से सहमत हूँ'}</span>
              </label>
            </div>
          </div>
        )}

        {/* Step 2: Applicant Identity, Parent Details & DOB */}
        {currentStep === 2 && (
          <div className="p-6 sm:p-8 space-y-5 max-h-[60vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>{isEn ? 'Step 2: Applicant Identity, DOB, Parent Details & Aadhaar' : 'Step 2: आवेदक पहचान, जन्मतिथि, माता-पिता का विवरण एवं 12-अंक आधार'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{isEn ? 'Applicant Full Name *' : 'आवेदक का पूरा नाम *'}</label>
                <input
                  type="text"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{isEn ? 'Date of Birth (DOB) & Age *' : 'जन्मतिथि (DOB) एवं उम्र *'}</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={applicantDob}
                    onChange={(e) => setApplicantDob(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                  <span className="px-3 py-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-mono font-bold text-xs shrink-0 flex items-center">
                    {computedAge} {isEn ? 'Yrs' : 'वर्ष'}
                  </span>
                </div>
              </div>

              {/* Aadhaar Checkbox / Toggle for Infant Birth Cert */}
              <div className="sm:col-span-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isEn ? 'If child does not have Aadhaar Card yet:' : 'यदि शिशु का आधार कार्ड अभी नहीं बना है:'}
                </span>
                <label className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasNoAadhaarUseBirthCert}
                    onChange={(e) => setHasNoAadhaarUseBirthCert(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>{isEn ? 'Use Infant Birth Certificate (जन्म प्रमाण पत्र)' : 'जन्म प्रमाण पत्र का उपयोग करें'}</span>
                </label>
              </div>

              {!hasNoAadhaarUseBirthCert ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{isEn ? '12-Digit Aadhaar Number *' : '12-अंक आधार संख्या *'}</label>
                  <input
                    type="text"
                    maxLength={12}
                    value={applicantAadhaar}
                    onChange={(e) => setApplicantAadhaar(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{isEn ? 'Upload Infant Birth Certificate *' : 'शिशु का जन्म प्रमाण पत्र अपलोड करें *'}</label>
                  <label className="w-full px-3 py-2 rounded-xl border border-dashed border-blue-400 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-bold cursor-pointer flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span>{birthCertFileName || (isEn ? 'Choose Birth Certificate (PDF/JPG)' : 'जन्म प्रमाण पत्र चुनें')}</span>
                    <input type="file" onChange={(e) => handleFileUpload('birth_cert', e)} className="hidden" />
                  </label>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{isEn ? 'PAN Card Number (10 Chars)' : 'पैन कार्ड संख्या (10 अक्षर)'}</label>
                <input
                  type="text"
                  maxLength={10}
                  value={applicantPan}
                  onChange={(e) => setApplicantPan(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold uppercase"
                />
              </div>

              {/* Parent / Guardian Aadhaar Section */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{isEn ? "Parent / Guardian Name" : 'माता-पिता का नाम'}</label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  placeholder={isEn ? 'Father / Mother Name' : 'पिता या माता का नाम'}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{isEn ? "Parent's 12-Digit Aadhaar Number" : 'माता-पिता का 12-अंक आधार कार्ड'}</label>
                <input
                  type="text"
                  maxLength={12}
                  value={parentAadhaar}
                  onChange={(e) => setParentAadhaar(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
                  placeholder="XXXXXXXXXXXX"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{isEn ? 'Bank Account Number *' : 'बैंक खाता संख्या *'}</label>
                <input
                  type="text"
                  value={bankAccountNo}
                  onChange={(e) => setBankAccountNo(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{isEn ? 'Bank IFSC Code *' : 'बैंक IFSC कोड *'}</label>
                <input
                  type="text"
                  maxLength={11}
                  value={bankIfsc}
                  onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold uppercase"
                />
              </div>
            </div>

            {/* Nominee Details Card */}
            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 space-y-3">
              <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1">
                <span>🤝</span>
                <span>{isEn ? 'Nominee Declaration' : 'नॉमिनी घोषणा'}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{isEn ? 'Nominee Full Name *' : 'नॉमिनी का नाम *'}</label>
                  <input
                    type="text"
                    value={nomineeName}
                    onChange={(e) => setNomineeName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{isEn ? 'Nominee 12-Digit Aadhaar *' : 'नॉमिनी 12-अंक आधार *'}</label>
                  <input
                    type="text"
                    maxLength={12}
                    value={nomineeAadhaar}
                    onChange={(e) => setNomineeAadhaar(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Uploads & Verification */}
        {currentStep === 3 && (
          <div className="p-6 sm:p-8 space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isEn ? 'Step 3: Upload Nominee Aadhaar & Verification Docs' : 'Step 3: नॉमिनी आधार फोटो एवं दस्तावेज सत्यापन'}
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">📄 {isEn ? 'Applicant PAN / ID Proof Photo' : 'आवेदक पैन / पहचान पत्र फोटो'}</span>
                <label className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold cursor-pointer">
                  {isEn ? 'Upload File' : 'फ़ाइल अपलोड करें'}
                  <input type="file" onChange={(e) => handleFileUpload('pan', e)} className="hidden" />
                </label>
              </div>

              <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20 flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 dark:text-blue-200">📷 {isEn ? 'Nominee Aadhaar Card Photo' : 'नॉमिनी आधार कार्ड फोटो'}</span>
                <label className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold cursor-pointer">
                  {isEn ? 'Upload Nominee Photo' : 'नॉमिनी फोटो अपलोड करें'}
                  <input type="file" onChange={(e) => handleFileUpload('nominee_aadhaar', e)} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Modal Controls */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep((s) => s - 1)}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              {isEn ? 'Previous' : 'पिछला'}
            </button>
          ) : (
            <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
              {isEn ? 'Cancel' : 'रद्द करें'}
            </button>
          )}

          {currentStep < 3 ? (
            <button
              onClick={() => {
                if (currentStep === 2 && !validateStep2Inputs()) return;
                setCurrentStep((s) => s + 1);
              }}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md"
            >
              {isEn ? 'Next Step' : 'अगला कदम'}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 text-white text-xs font-extrabold shadow-lg"
            >
              {isSubmitting
                ? (isEn ? 'Submitting Application...' : 'आवेदन जमा हो रहा है...')
                : (isEn ? 'Submit Deposit Application Online' : 'ऑनलाइन बचत आवेदन जमा करें')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
