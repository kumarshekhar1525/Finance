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
  ExternalLink
} from 'lucide-react';
import { DepositScheme, UploadedDoc, UserProfile, DepositApplication } from '../types';
import { INDIAN_STATES_AND_UTS } from './LoanApplicationForm';

interface DepositApplicationModalProps {
  scheme: DepositScheme;
  user: UserProfile | null;
  onClose: () => void;
  onSubmitSuccess: (app: DepositApplication) => void;
}

export const DepositApplicationModal: React.FC<DepositApplicationModalProps> = ({
  scheme,
  user,
  onClose,
  onSubmitSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [depositAmount, setDepositAmount] = useState<number>(scheme.minDeposit > 10000 ? scheme.minDeposit : 50000);
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

  // Nominee Details
  const [nomineeName, setNomineeName] = useState<string>(user?.nomineeDetails?.name || '');
  const [nomineeRelation, setNomineeRelation] = useState<string>(user?.nomineeDetails?.relation || 'Father');
  const [nomineeAadhaar, setNomineeAadhaar] = useState<string>(user?.nomineeDetails?.aadhaar || '');

  // Documents & Camera state
  const [documents, setDocuments] = useState<UploadedDoc[]>([
    {
      id: 'doc-aadhaar-default',
      type: 'aadhaar',
      name: 'Aadhaar Card (UIDAI Verified)',
      fileName: 'uidai_ekyc_verified.pdf',
      fileSize: '1.2 MB',
      uploadDate: new Date().toISOString(),
      status: 'valid',
    },
  ]);
  const [nomineeAadhaarPhoto, setNomineeAadhaarPhoto] = useState<string | null>(null);
  const [handwrittenDocPhoto, setHandwrittenDocPhoto] = useState<string | null>(null);
  const [capturedLivePhoto, setCapturedLivePhoto] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraScanMode, setCameraScanMode] = useState<'face' | 'aadhaar'>('face');
  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Expected Maturity Calculator
  const expectedMaturityAmount = React.useMemo(() => {
    const p = depositAmount || 50000;
    const r = (scheme.interestRate || 7.5) / 100;
    const t = tenureYears || 5;
    const maturity = p * Math.pow(1 + r, t);
    return Math.round(maturity);
  }, [depositAmount, tenureYears, scheme.interestRate]);

  const startLiveCamera = async () => {
    try {
      setFormError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      setIsCameraActive(false);
    }
  };

  const stopLiveCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleCaptureLivePhoto = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const rawDataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedLivePhoto(rawDataUrl);
      stopLiveCamera();
    }
  };

  const handleFileUpload = (docType: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (docType === 'nominee_aadhaar') setNomineeAadhaarPhoto(dataUrl);
      if (docType === 'handwritten_doc') setHandwrittenDocPhoto(dataUrl);

      const newDoc: UploadedDoc = {
        id: `doc-dep-${Date.now()}`,
        type: docType as any,
        name: docType === 'pan' ? 'PAN Card' : docType === 'nominee_aadhaar' ? 'Nominee Aadhaar Photo' : 'Document',
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
    if (!applicantName.trim() || applicantName.trim().length < 3) {
      setFormError('❌ कृपया आधार के अनुसार नाम दर्ज करें');
      return false;
    }
    if (!applicantAadhaar || applicantAadhaar.length !== 12 || !/^\d{12}$/.test(applicantAadhaar)) {
      setFormError('❌ सत्यापन विफल: आधार संख्या ठीक 12 अंकों की होनी अनिवार्य है!');
      return false;
    }
    if (!applicantPan || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(applicantPan.toUpperCase())) {
      setFormError('❌ सत्यापन विफल: पैन कार्ड संख्या ठीक 10 अक्षरों की होनी अनिवार्य है!');
      return false;
    }
    if (nomineeName.trim() && (!nomineeAadhaar || nomineeAadhaar.length !== 12)) {
      setFormError('❌ सत्यापन विफल: नॉमिनी का आधार नंबर ठीक 12 अंकों का होना अनिवार्य है!');
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
      applicantAadhaar,
      applicantPan,
      applicantName,
      applicantPhone,
      applicantEmail,
      applicantState,
      applicantCategory: user?.category || 'general',
      depositAmount,
      tenureYears,
      expectedMaturityAmount,
      schemeId: scheme.id,
      schemeName: scheme.name,
      nomineeName,
      nomineeRelation,
      nomineeAadhaar,
      nomineeAadhaarPhoto: nomineeAadhaarPhoto || undefined,
      applicantPhoto: userPhoto,
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
          aadhaar_number: applicantAadhaar,
          pan_number: applicantPan,
          phone: applicantPhone,
          email: applicantEmail,
          state: applicantState,
          deposit_amount: depositAmount,
          tenure_years: tenureYears,
          expected_maturity_amount: expectedMaturityAmount,
          interest_rate: scheme.interestRate,
          scheme_id: scheme.id,
          scheme_name: scheme.name,
          nominee_name: nomineeName,
          nominee_relation: nomineeRelation,
          nominee_aadhaar: nomineeAadhaar,
          nominee_aadhaar_photo: nomineeAadhaarPhoto,
          applicant_photo: userPhoto,
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
        <div className="p-6 bg-gradient-to-r from-teal-800 to-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-teal-100 uppercase tracking-wider">
              100% Digital Savings Application
            </span>
            <h2 className="text-xl font-extrabold mt-1">{scheme.nameHi}</h2>
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

        {/* Step 1: Deposit Amount */}
        {currentStep === 1 && (
          <div className="p-6 sm:p-8 space-y-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Step 1: Configure Deposit Amount & Tenure / जमा राशि एवं अवधि
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Deposit Amount (₹) / जमा राशि
                </label>
                <input
                  type="number"
                  min={scheme.minDeposit}
                  max={scheme.maxDeposit}
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold text-sm"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                  <span>Min: ₹{scheme.minDeposit.toLocaleString('en-IN')}</span>
                  <span>Max: ₹{scheme.maxDeposit.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Deposit Tenure (Years) / अवधि
                </label>
                <select
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-sm"
                >
                  {[1, 2, 3, 5, 10, 15, 21].map((y) => (
                    <option key={y} value={y}>{y} Years (वर्ष)</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Expected Returns Preview */}
            <div className="p-5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-teal-800 dark:text-teal-300 block font-medium">
                  Guaranteed Expected Maturity Amount (अनुमानित परिपक्वता राशि)
                </span>
                <span className="text-2xl font-black font-mono text-teal-700 dark:text-teal-300">
                  ₹{expectedMaturityAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-amber-700 dark:text-amber-300 font-bold block">Interest Rate</span>
                <span className="text-lg font-bold text-amber-800 dark:text-amber-200">{scheme.interestRate}% p.a.</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Applicant Identity & Nominee */}
        {currentStep === 2 && (
          <div className="p-6 sm:p-8 space-y-5 max-h-[60vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Step 2: Applicant Identity, 12-Digit Aadhaar & Nominee Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Applicant Name *</label>
                <input
                  type="text"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Aadhaar Number (12 Digits) *</label>
                <input
                  type="text"
                  maxLength={12}
                  value={applicantAadhaar}
                  onChange={(e) => setApplicantAadhaar(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">PAN Card Number (10 Chars) *</label>
                <input
                  type="text"
                  maxLength={10}
                  value={applicantPan}
                  onChange={(e) => setApplicantPan(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">State / Union Territory *</label>
                <select
                  value={applicantState}
                  onChange={(e) => setApplicantState(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                >
                  {INDIAN_STATES_AND_UTS.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Bank Account Number *</label>
                <input
                  type="text"
                  value={bankAccountNo}
                  onChange={(e) => setBankAccountNo(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Bank IFSC Code *</label>
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
            <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 space-y-3">
              <h4 className="text-xs font-bold text-teal-900 dark:text-teal-200">🤝 Nominee Declaration</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nominee Full Name *</label>
                  <input
                    type="text"
                    value={nomineeName}
                    onChange={(e) => setNomineeName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nominee 12-Digit Aadhaar *</label>
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

        {/* Step 3: Documents & Live Photo */}
        {currentStep === 3 && (
          <div className="p-6 sm:p-8 space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Step 3: Document Proofs & Live Photo Verification
            </h3>

            <div className="space-y-3">
              {/* Document upload fields */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">📄 Aadhaar Card & PAN Photo</span>
                <label className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold cursor-pointer">
                  Upload File
                  <input type="file" onChange={(e) => handleFileUpload('pan', e)} className="hidden" />
                </label>
              </div>

              <div className="p-4 rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50/40 dark:bg-teal-950/20 flex items-center justify-between">
                <span className="text-xs font-bold text-teal-900 dark:text-teal-200">📷 Nominee Aadhaar Card Photo</span>
                <label className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-bold cursor-pointer">
                  Upload Nominee Photo
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
              Previous
            </button>
          ) : (
            <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
              Cancel
            </button>
          )}

          {currentStep < 3 ? (
            <button
              onClick={() => {
                if (currentStep === 2 && !validateStep2Inputs()) return;
                setCurrentStep((s) => s + 1);
              }}
              className="px-6 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md"
            >
              Next Step
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-extrabold shadow-lg"
            >
              {isSubmitting ? 'Submitting Application...' : 'Submit Savings Application Online'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
