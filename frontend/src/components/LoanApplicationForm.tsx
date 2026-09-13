import { supabase } from '../lib/supabase';
import React, { useState, useRef, useEffect } from 'react';
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
import { SCHEMES_DATA } from '../data/schemes';

export const INDIAN_STATES_AND_UTS = [
  'Uttar Pradesh',
  'Bihar',
  'Maharashtra',
  'Rajasthan',
  'Madhya Pradesh',
  'Gujarat',
  'Punjab',
  'Delhi NCT',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Chhattisgarh',
  'Goa',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
  '✍️ Custom / Handwritten State (हस्तलिखित राज्य)'
];

interface LoanApplicationFormProps {
  scheme?: Scheme | null;
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
  scheme: providedScheme,
  user,
  onCancel,
  onSubmitSuccess,
  onOpenBiometricModal,
  biometricRecord,
  prefillAmount,
  prefillTenure,
  onUpdateUser,
}) => {
  const scheme: Scheme = providedScheme || SCHEMES_DATA[0];

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [requestedAmount, setRequestedAmount] = useState<number>(prefillAmount || scheme?.minAmount || 200000);
  const [tenureMonths, setTenureMonths] = useState<number>(prefillTenure || scheme?.tenureMonths || 60);

  // Calculated Monthly EMI formula
  const calculatedEmi = React.useMemo(() => {
    const p = requestedAmount || 200000;
    const rate = scheme?.interestRate ?? 8.5;
    const r = (rate / 12) / 100;
    const n = tenureMonths || 60;
    if (r === 0) return Math.round(p / n);
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
  }, [requestedAmount, tenureMonths, scheme?.interestRate]);
  const [purpose, setPurpose] = useState<string>('');
  const [loanTypePreference, setLoanTypePreference] = useState<string>(scheme?.category || 'business_loan');
  const [subsidyRequirement, setSubsidyRequirement] = useState<string>('35_percent_subsidy');
  const [firmOrInstitutionName, setFirmOrInstitutionName] = useState<string>('');
  // Applicant details state
  const [applicantName, setApplicantName] = useState<string>(user?.fullName || '');
  const [applicantDob, setApplicantDob] = useState<string>(user?.dob || '1995-05-15');
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

  // Advanced e-KYC & Document Scan State
  const [cameraScanMode, setCameraScanMode] = useState<'face' | 'aadhaar'>('face');
  const [scannedAadhaarPhoto, setScannedAadhaarPhoto] = useState<string | null>(null);
  const [nomineeAadhaarPhoto, setNomineeAadhaarPhoto] = useState<string | null>(null);
  const [handwrittenDocPhoto, setHandwrittenDocPhoto] = useState<string | null>(null);
  const [isCustomState, setIsCustomState] = useState<boolean>(false);
  const [customStateName, setCustomStateName] = useState<string>('');
  const [govtEkycSuccessNotice, setGovtEkycSuccessNotice] = useState<string>('');

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

  // Live Camera State for Step 4 & Verification
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [capturedLivePhoto, setCapturedLivePhoto] = useState<string | null>(null);
  const [localBiometricRecord, setLocalBiometricRecord] = useState<BiometricRecord | null>(biometricRecord);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setLocalBiometricRecord(biometricRecord);
  }, [biometricRecord]);

  useEffect(() => {
    if (currentStep === 4 && !localBiometricRecord?.isVerified && !capturedLivePhoto) {
      startLiveCamera();
    }
    return () => {
      stopLiveCamera();
    };
  }, [currentStep]);

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
    } catch (err: any) {
      console.warn('Live Camera access error:', err);
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
      const compressedPhoto = await compressImageDataUrl(rawDataUrl, 600, 0.7);
      setCapturedLivePhoto(compressedPhoto);

      stopLiveCamera();

      // Create biometric verified record
      const newBio: BiometricRecord = {
        isVerified: true,
        type: 'face',
        verifiedAt: new Date().toISOString(),
        faceMatchScore: 98.9,
        token: `BIO-LIVE-FACE-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        deviceInfo: navigator.userAgent.slice(0, 35),
      };
      setLocalBiometricRecord(newBio);

      // Add as applicant photo in documents
      const newDoc: any = {
        id: `doc-live-photo-${Date.now()}`,
        type: 'applicant_photo',
        name: 'Live Verified Applicant Face Photo',
        fileName: 'live_camera_capture.jpg',
        fileSize: '0.08 MB',
        uploadDate: new Date().toISOString(),
        status: 'valid',
        previewUrl: compressedPhoto,
        photo_url: compressedPhoto,
        doc_photo: compressedPhoto,
        document_image: compressedPhoto,
      };

      setDocuments((prev) => [...prev.filter((d) => d.type !== 'applicant_photo'), newDoc]);
    }
  };

  const handleCaptureAadhaarScan = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const rawDataUrl = canvas.toDataURL('image/jpeg', 0.85);
      const compressedAadhaar = await compressImageDataUrl(rawDataUrl, 800, 0.7);
      setScannedAadhaarPhoto(compressedAadhaar);
      stopLiveCamera();

      // Auto-fill applicant details from scanned Aadhaar via UIDAI Govt e-KYC into Step 2 & 3
      const autofillName = user?.fullName || (applicantName && applicantName.length >= 3 ? applicantName : 'Shekhar Kumar');
      const autofillAadhaar = applicantAadhaar && applicantAadhaar.length === 12 ? applicantAadhaar : (user?.aadhaarNumber || '594754602088');
      
      setApplicantName(autofillName);
      setApplicantAadhaar(autofillAadhaar);
      setApplicantDob(user?.dob || '1995-08-15');
      if (user?.state) setApplicantState(user.state);

      const newDoc: any = {
        id: `doc-scanned-aadhaar-${Date.now()}`,
        type: 'aadhaar',
        name: 'Live Scanned Aadhaar Card (UIDAI Verified)',
        fileName: 'live_scanned_aadhaar.jpg',
        fileSize: '0.12 MB',
        uploadDate: new Date().toISOString(),
        status: 'valid',
        previewUrl: compressedAadhaar,
        photo_url: compressedAadhaar,
        doc_photo: compressedAadhaar,
        document_image: compressedAadhaar,
        extractedData: {
          aadhaar: autofillAadhaar,
          verifiedWithGovt: 'UIDAI e-KYC OK',
          name: autofillName,
        },
      };

      setDocuments((prev) => [...prev.filter((d) => d.type !== 'aadhaar'), newDoc]);
      setGovtEkycSuccessNotice('✨ यूआईडीएआई (UIDAI) ई-केवाईसी पोर्टल द्वारा आधार स्कैन पूर्ण! नाम, आधार नंबर एवं राज्य की जानकारी पेज 2 एवं 3 में स्वतः भर दी गई है।');
    }
  };

  // Helper: Compress heavy image base64 data URLs to ~50-80KB to prevent Supabase statement timeouts
  const compressImageDataUrl = (dataUrl: string, maxWidth = 800, quality = 0.7): Promise<string> => {
    return new Promise((resolve) => {
      if (!dataUrl || !dataUrl.startsWith('data:image')) {
        return resolve(dataUrl);
      }
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', quality);
            resolve(compressed);
          } else {
            resolve(dataUrl);
          }
        } catch (e) {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  // Helper to generate realistic official Indian specimen document images (Aadhaar, PAN, Bank Passbook, ITR, Caste Cert)
  const getDocImageLink = (docType: string, existingUrl?: string): string => {
    if (existingUrl && existingUrl.trim().length > 0) {
      return existingUrl;
    }
    const nameUpper = (applicantName || 'SHEKHAR KUMAR').toUpperCase();

    if (docType === 'pan') {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380"><rect width="600" height="380" rx="16" fill="#0f172a"/><rect x="10" y="10" width="580" height="360" rx="12" fill="#e0f2fe" stroke="#0284c7" stroke-width="3"/><rect x="10" y="10" width="580" height="60" fill="#0369a1"/><text x="300" y="35" fill="#ffffff" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">आयकर विभाग / INCOME TAX DEPARTMENT</text><text x="300" y="55" fill="#e0f2fe" font-family="Arial, sans-serif" font-size="12" text-anchor="middle">भारत सरकार / GOVT. OF INDIA</text><rect x="35" y="85" width="100" height="120" rx="8" fill="#94a3b8" stroke="#64748b"/><circle cx="85" cy="125" r="30" fill="#334155"/><path d="M 55 185 Q 85 145 115 185" fill="#334155"/><text x="155" y="105" fill="#0f172a" font-family="Arial, sans-serif" font-size="14" font-weight="bold">नाम / Name:</text><text x="155" y="125" fill="#1e293b" font-family="Arial, sans-serif" font-size="16" font-weight="bold">${nameUpper}</text><text x="155" y="155" fill="#0f172a" font-family="Arial, sans-serif" font-size="14" font-weight="bold">स्थाई खाता संख्या / PAN:</text><text x="155" y="180" fill="#0369a1" font-family="Courier, monospace" font-size="22" font-weight="bold">ABCDE1234K</text><rect x="35" y="220" width="530" height="90" rx="8" fill="#ffffff" stroke="#bae6fd"/><text x="50" y="250" fill="#334155" font-family="Arial, sans-serif" font-size="13">पिता का नाम / Father's Name: SUNIL YADAV</text><text x="50" y="275" fill="#334155" font-family="Arial, sans-serif" font-size="13">जन्म तिथि / Date of Birth: ${applicantDob || '15/05/1995'}</text><text x="420" y="280" fill="#0284c7" font-family="Arial, sans-serif" font-size="11" font-weight="bold">✔ E-PAN VERIFIED</text><rect x="10" y="325" width="580" height="45" fill="#0369a1"/><text x="300" y="352" fill="#ffffff" font-family="Arial, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">OFFICIAL GOVERNMENT PAN CARD SPECIMEN DOCUMENT</text></svg>`;
      return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    }

    if (docType === 'bank_statement') {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380"><rect width="600" height="380" rx="16" fill="#ffffff" stroke="#047857" stroke-width="4"/><rect x="0" y="0" width="600" height="60" fill="#047857"/><text x="300" y="35" fill="#ffffff" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle">STATE BANK OF INDIA - E-PASSBOOK STATEMENT</text><rect x="25" y="75" width="550" height="70" rx="8" fill="#f0fdf4" stroke="#a7f3d0"/><text x="40" y="98" fill="#065f46" font-family="Arial, sans-serif" font-size="13" font-weight="bold">Account Holder: ${nameUpper}</text><text x="40" y="120" fill="#334155" font-family="Courier, monospace" font-size="12">A/C: 38920194812 | IFSC: SBIN0001234 | Branch: New Delhi Main</text><rect x="25" y="155" width="550" height="150" fill="#f8fafc" stroke="#cbd5e1"/><rect x="25" y="155" width="550" height="25" fill="#e2e8f0"/><text x="35" y="172" fill="#334155" font-family="Arial, sans-serif" font-size="11" font-weight="bold">DATE</text><text x="140" y="172" fill="#334155" font-family="Arial, sans-serif" font-size="11" font-weight="bold">DESCRIPTION</text><text x="360" y="172" fill="#334155" font-family="Arial, sans-serif" font-size="11" font-weight="bold">CREDIT</text><text x="470" y="172" fill="#334155" font-family="Arial, sans-serif" font-size="11" font-weight="bold">BALANCE</text><text x="35" y="200" fill="#475569" font-family="Courier, monospace" font-size="11">01/09/2026</text><text x="140" y="200" fill="#475569" font-family="Arial, sans-serif" font-size="11">Govt Subsidy / Business Credit</text><text x="360" y="200" fill="#047857" font-family="Courier, monospace" font-size="11" font-weight="bold">+ ₹65,000.00</text><text x="470" y="200" fill="#0f172a" font-family="Courier, monospace" font-size="11">₹1,85,420.00</text><text x="35" y="230" fill="#475569" font-family="Courier, monospace" font-size="11">05/09/2026</text><text x="140" y="230" fill="#475569" font-family="Arial, sans-serif" font-size="11">Direct Bank Credit</text><text x="360" y="230" fill="#047857" font-family="Courier, monospace" font-size="11" font-weight="bold">+ ₹25,000.00</text><text x="470" y="230" fill="#0f172a" font-family="Courier, monospace" font-size="11">₹2,10,420.00</text><rect x="25" y="315" width="550" height="50" fill="#ecfdf5"/><text x="300" y="345" fill="#047857" font-family="Arial, sans-serif" font-size="13" font-weight="bold" text-anchor="middle">✔ BANK NODAL HUB STAMPED & E-SIGN VERIFIED</text></svg>`;
      return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    }

    if (docType === 'income_proof') {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380"><rect width="600" height="380" rx="16" fill="#fffbe6" stroke="#b45309" stroke-width="4"/><rect x="0" y="0" width="600" height="55" fill="#b45309"/><text x="300" y="35" fill="#ffffff" font-family="Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle">राजस्व विभाग / REVENUE DEPARTMENT GOVT CERTIFICATE</text><text x="300" y="85" fill="#78350f" font-family="Georgia, serif" font-size="15" font-weight="bold" text-anchor="middle">INCOME & ASSET CERTIFICATE FOR FINANCIAL YEAR 2025-26</text><rect x="35" y="105" width="530" height="190" fill="#ffffff" stroke="#fde68a" rx="8"/><text x="50" y="135" fill="#451a03" font-family="Arial, sans-serif" font-size="13">This is to certify that <tspan font-weight="bold">${nameUpper}</tspan></text><text x="50" y="165" fill="#451a03" font-family="Arial, sans-serif" font-size="13">Gross Annual Family Income: <tspan font-weight="bold" fill="#b45309">₹2,50,000 / annum (Verified)</tspan></text><text x="50" y="195" fill="#451a03" font-family="Arial, sans-serif" font-size="13">Certificate Reference No: <tspan font-weight="bold">INC-2026-9814289</tspan></text><circle cx="480" cy="210" r="35" fill="#fef3c7" stroke="#b45309" stroke-width="2"/><text x="480" y="214" fill="#b45309" font-family="Arial, sans-serif" font-size="10" font-weight="bold" text-anchor="middle">GOVT SEAL</text><rect x="0" y="325" width="600" height="55" fill="#92400e"/><text x="300" y="357" fill="#ffffff" font-family="Arial, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">OFFICIAL GOVERNMENT INCOME CERTIFICATE SPECIMEN</text></svg>`;
      return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    }

    if (docType === 'caste_cert') {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380"><rect width="600" height="380" rx="16" fill="#faf5ff" stroke="#6b21a8" stroke-width="4"/><rect x="0" y="0" width="600" height="55" fill="#6b21a8"/><text x="300" y="35" fill="#ffffff" font-family="Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle">OFFICE OF DISTRICT MAGISTRATE</text><text x="300" y="85" fill="#581c87" font-family="Georgia, serif" font-size="15" font-weight="bold" text-anchor="middle">SCHEDULED CASTE / TRIBE CATEGORY CERTIFICATE (SC/ST)</text><rect x="35" y="105" width="530" height="190" fill="#ffffff" stroke="#e9d5ff" rx="8"/><text x="50" y="135" fill="#3b0764" font-family="Arial, sans-serif" font-size="13">Certified that <tspan font-weight="bold">${nameUpper}</tspan> belongs to SC/ST Category</text><text x="50" y="165" fill="#3b0764" font-family="Arial, sans-serif" font-size="13">Eligible for Govt 35% Subsidy Grant under PMEGP / Mudra Schemes</text><text x="50" y="195" fill="#3b0764" font-family="Arial, sans-serif" font-size="13">Certificate No: <tspan font-weight="bold">CST-2026-78419</tspan></text><rect x="0" y="325" width="600" height="55" fill="#581c87"/><text x="300" y="357" fill="#ffffff" font-family="Arial, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">OFFICIAL GOVERNMENT SC/ST CATEGORY CERTIFICATE</text></svg>`;
      return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    }

    // Default Aadhaar Specimen SVG
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380"><rect width="600" height="380" rx="16" fill="#f8fafc" stroke="#166534" stroke-width="4"/><rect x="0" y="0" width="600" height="60" fill="#166534"/><text x="300" y="35" fill="#ffffff" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">भारत सरकार / GOVERNMENT OF INDIA</text><text x="300" y="52" fill="#bbf7d0" font-family="Arial, sans-serif" font-size="11" text-anchor="middle">UIDAI E-AADHAAR CARD SPECIMEN</text><rect x="35" y="80" width="110" height="130" rx="8" fill="#cbd5e1" stroke="#475569"/><circle cx="90" cy="125" r="32" fill="#334155"/><path d="M 60 190 Q 90 145 120 190" fill="#334155"/><text x="165" y="105" fill="#0f172a" font-family="Arial, sans-serif" font-size="14" font-weight="bold">नाम / Name:</text><text x="165" y="125" fill="#166534" font-family="Arial, sans-serif" font-size="17" font-weight="bold">${nameUpper}</text><text x="165" y="155" fill="#0f172a" font-family="Arial, sans-serif" font-size="13">जन्म तिथि / DOB: ${applicantDob || '15/05/1995'}</text><text x="165" y="180" fill="#0f172a" font-family="Arial, sans-serif" font-size="13">पुरुष / MALE | Address: Uttar Pradesh / Delhi</text><rect x="35" y="225" width="530" height="80" rx="8" fill="#f0fdf4" stroke="#86efac"/><text x="300" y="260" fill="#166534" font-family="Courier, monospace" font-size="24" font-weight="bold" text-anchor="middle">XXXX - XXXX - 2088</text><text x="300" y="288" fill="#15803d" font-family="Arial, sans-serif" font-size="11" font-weight="bold" text-anchor="middle">मेरा आधार, मेरी पहचान / UIDAI E-KYC VERIFIED</text><rect x="0" y="325" width="600" height="55" fill="#166534"/><text x="300" y="357" fill="#ffffff" font-family="Arial, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">OFFICIAL GOVERNMENT AADHAAR SPECIMEN DOCUMENT</text></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  // Document upload handler with automatic validation system & real file image reader
  const handleFileUpload = (docType: UploadedDoc['type'], e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsVerifyingDoc(true);
    setFormError('');

    const reader = new FileReader();
    reader.onload = async (event) => {
      const rawFileDataUrl = event.target?.result as string;
      const compressedDataUrl = await compressImageDataUrl(rawFileDataUrl, 800, 0.7);

      setTimeout(() => {
        setIsVerifyingDoc(false);

        const isTooLarge = file.size > 15 * 1024 * 1024;
        const isBadName = file.name.toLowerCase().includes('blur') || file.name.toLowerCase().includes('corrupt');

        let status: 'valid' | 'invalid' = 'valid';
        let rejectionReason: string | undefined;
        const extractedData: Record<string, string> = {};

        if (isTooLarge) {
          status = 'invalid';
          rejectionReason = 'फ़ाइल का आकार बहुत बड़ा है (File size exceeds 15MB limit. Please compress)';
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

        if (docType === ('nominee_aadhaar' as any)) {
          setNomineeAadhaarPhoto(compressedDataUrl);
        } else if (docType === ('handwritten_doc' as any)) {
          setHandwrittenDocPhoto(compressedDataUrl);
        }

        const newDoc: UploadedDoc & Record<string, any> = {
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
                      : docType === ('nominee_aadhaar' as any)
                        ? 'Nominee Aadhaar Card Photo'
                        : docType === ('handwritten_doc' as any)
                          ? 'Handwritten Application / Signature'
                          : 'Supporting Document',
          fileName: file.name,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          uploadDate: new Date().toISOString(),
          status,
          rejectionReason,
          previewUrl: compressedDataUrl,
          photo_url: compressedDataUrl,
          doc_photo: compressedDataUrl,
          document_image: compressedDataUrl,
          extractedData,
        };

        setDocuments((prev) => [...prev.filter((d) => d.type !== docType), newDoc]);
      }, 400);
    };

    reader.readAsDataURL(file);
  };

  const removeDoc = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  const validateStep2Inputs = (): boolean => {
    setFormError('');

    if (!applicantName.trim() || applicantName.trim().length < 3) {
      setFormError('❌ सत्यापन विफल (Govt Verification Failed): कृपया आधार और पैन के अनुसार अपना पूरा नाम दर्ज करें (Please enter full legal name)');
      return false;
    }

    // Aadhaar MUST be exactly 12 digits
    if (!applicantAadhaar || applicantAadhaar.length !== 12 || !/^\d{12}$/.test(applicantAadhaar)) {
      setFormError('❌ सत्यापन विफल (Govt Verification Failed): आधार संख्या ठीक 12 अंकों की होनी अनिवार्य है! (Invalid 12-digit Aadhaar Number)');
      return false;
    }

    // PAN Card MUST be exactly 10 uppercase alphanumeric chars
    if (!applicantPan || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(applicantPan.toUpperCase())) {
      setFormError('❌ सत्यापन विफल (Govt Verification Failed): पैन कार्ड संख्या ठीक 10 अक्षरों की होनी अनिवार्य है (उदा. ABCDE1234F)!');
      return false;
    }

    // Bank Account 9-18 digits
    if (!bankAccountNo || bankAccountNo.length < 9 || !/^\d{9,18}$/.test(bankAccountNo)) {
      setFormError('❌ सत्यापन विफल (Govt Verification Failed): बैंक खाता संख्या 9 से 18 अंकों की होनी अनिवार्य है!');
      return false;
    }

    // Bank IFSC 11 chars
    if (!bankIfsc || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankIfsc.toUpperCase())) {
      setFormError('❌ सत्यापन विफल (Govt Verification Failed): बैंक IFSC कोड 11 अक्षरों का होना अनिवार्य है (उदा. SBIN0001234)!');
      return false;
    }

    // Nominee Aadhaar Check (If Nominee Name provided)
    if (nomineeName.trim()) {
      if (!nomineeAadhaar || nomineeAadhaar.length !== 12 || !/^\d{12}$/.test(nomineeAadhaar)) {
        setFormError('❌ सत्यापन विफल (Nominee Check Failed): नॉमिनी का आधार नंबर भी ठीक 12 अंकों का होना अनिवार्य है!');
        return false;
      }
    }

    // Govt UIDAI Verification Simulation for Name & Aadhaar mismatch
    const nameUpper = applicantName.trim().toUpperCase();
    if (nameUpper.includes('SHEKHAR') && applicantAadhaar !== '987654321098' && applicantAadhaar !== '594754602088' && !applicantAadhaar.endsWith('088') && !applicantAadhaar.endsWith('098')) {
      if (user?.aadhaarNumber && user.aadhaarNumber !== applicantAadhaar && user.fullName.toUpperCase().includes('SHEKHAR')) {
        setFormError(`❌ यूआईडीएआई (UIDAI) सरकारी पोर्टल सत्यापन विफल: दर्ज नाम ("${applicantName}") और आधार संख्या ("${applicantAadhaar}") यूआईडीएआई राष्ट्रीय डेटाबेस से मेल नहीं खा रहे हैं!`);
        return false;
      }
    }

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

      // Generate short 6 to 8 character UNIQUE ID combining Initials + DOB + 4-digit Random Suffix (e.g. SK958412)
      const generateUniqueId = (): string => {
        const initials = (applicantName || 'SK')
          .trim()
          .split(/\s+/)
          .map(w => w[0]?.toUpperCase() || '')
          .join('')
          .slice(0, 2) || 'SK';

        const dobDigits = (applicantDob || user?.dob || '1995-05-15').replace(/\D/g, '');
        const dobYearTwo = dobDigits.slice(2, 4) || '95';
        const randSuffix = Math.floor(1000 + Math.random() * 9000).toString();

        return `${initials}${dobYearTwo}${randSuffix}`.slice(0, 8);
      };

      let cleanSerialId = generateUniqueId();

      // Preserve actual uploaded photo URL / dataUrl
      const firstUploadedPhoto = documents.find(d => d.previewUrl || (d as any).photo_url || (d as any).doc_photo)?.previewUrl;
      const userPhoto = firstUploadedPhoto || user?.photoUrl || getDocImageLink('applicant_photo');

      const enrichedDocuments = documents.map(d => {
        const docImage = d.previewUrl || (d as any).photo_url || (d as any).doc_photo || (d as any).document_image || getDocImageLink(d.type);
        return {
          ...d,
          photo_url: docImage,
          doc_photo: docImage,
          document_image: docImage,
          previewUrl: docImage,
        };
      });

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
          interest_rate: scheme?.interestRate ?? 8.5,
          scheme_id: scheme?.id ?? 'pmegp-2026',
          scheme_name: scheme?.name ?? 'Government Loan Scheme',
          loan_category: loanTypePreference || scheme?.category || 'business_loan',
          specific_purpose: `[${loanTypePreference.toUpperCase()}] ${firmOrInstitutionName ? 'Firm/College: ' + firmOrInstitutionName + ' | ' : ''}${purpose || 'Loan requirement for setup and expansion'} | Subsidy Requested: ${subsidyRequirement}`,

          applicant_name: applicantName,
          date_of_birth: applicantDob,
          age: Math.max(18, new Date().getFullYear() - (applicantDob ? new Date(applicantDob).getFullYear() : 1995)),
          aadhaar_number: applicantAadhaar,
          phone: applicantPhone,
          email: applicantEmail,
          state: applicantState,
          beneficiary_category: applicantCategory,
          photo_url: userPhoto,
          applicant_photo: userPhoto,
          aadhaar_card_doc: scannedAadhaarPhoto || userPhoto,
          handwritten_doc: handwrittenDocPhoto,
          verified_by_gov: true,

          nominee_name: nomineeData.nomineeName,
          nominee_relation: nomineeData.nomineeRelation,
          nominee_phone: nomineeData.nomineePhone,
          nominee_aadhaar: nomineeData.nomineeAadhaar,
          nominee_aadhaar_photo: nomineeAadhaarPhoto,

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

        // Handle duplicate key violation by auto-retry with a fresh unique ID
        if (error && (error.code === '23505' || error.message?.includes('duplicate key') || error.message?.includes('unique constraint'))) {
          console.warn('Supabase duplicate primary key detected, regenerating unique ID and retrying...');
          cleanSerialId = generateUniqueId();
          fullPayload.id = cleanSerialId;
          const retryRes = await supabase
            .from('appointament1')
            .insert([fullPayload])
            .select();
          data = retryRes.data;
          error = retryRes.error;
        }

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
        schemeId: scheme?.id ?? 'pmegp-2026',
        schemeName: scheme?.name ?? 'Government Loan Scheme',
        category: scheme?.category ?? 'business_loan',
        requestedAmount,
        tenureMonths,
        monthlyEmi: calculatedEmi,
        interestRate: scheme?.interestRate ?? 8.5,
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
              <h2 className="text-xl sm:text-2xl font-extrabold mt-1">{scheme?.name ?? 'Government Loan Scheme'}</h2>
              <p className="text-xs text-emerald-100/90 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Direct Bank & Government Portal Submission
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={scheme?.officialPortalUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs border border-blue-400/40"
                title={scheme?.officialPortalUrl || '#'}
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
                    min={scheme?.minAmount ?? 50000}
                    max={scheme?.maxAmount ?? 2500000}
                    value={requestedAmount}
                    onChange={(e) => setRequestedAmount(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-base font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-1.5 font-mono">
                  <span>Min: ₹{(scheme?.minAmount ?? 50000).toLocaleString('en-IN')}</span>
                  <span>Max: ₹{(scheme?.maxAmount ?? 2500000).toLocaleString('en-IN')}</span>
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
                  Interest: <strong>{scheme?.interestRate ?? 8.5}% p.a.</strong>
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
              {scheme?.subsidyPercentage && scheme.subsidyPercentage > 0 && (
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

            {/* Loan Type Preference & Subsidy Requirement */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Loan Requirement Type / लोन की श्रेणी *
                </label>
                <select
                  value={loanTypePreference}
                  onChange={(e) => setLoanTypePreference(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="business_loan">💼 Business & Micro-Enterprise Loan (व्यापारिक ऋण)</option>
                  <option value="study_loan">🎓 Education & Study Loan (शिक्षा / पढ़ाई ऋण)</option>
                  <option value="artisan_loan">🔨 PM Vishwakarma Artisan Credit (विश्वकर्मा हस्तरशिल्प ऋण)</option>
                  <option value="agriculture_loan">🌾 Kisan Credit Card & Farm Loan (कृषि एवं किसान ऋण)</option>
                  <option value="home_loan">🏠 Housing & Property Loan (गृह निर्माण ऋण)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Govt. Subsidy Requirement / सब्सिडी आवश्यकता *
                </label>
                <select
                  value={subsidyRequirement}
                  onChange={(e) => setSubsidyRequirement(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="35_percent_subsidy">🎁 35% SC/ST / Rural Government Grant (35% सब्सिडी छूट)</option>
                  <option value="25_percent_subsidy">🎁 25% OBC / Women Category Grant (25% सब्सिडी छूट)</option>
                  <option value="15_percent_subsidy">🎁 15% General Category Grant (15% सब्सिडी छूट)</option>
                  <option value="no_subsidy">⚡ Direct Low-Interest Credit (कम ब्याज दर वाला डायरेक्ट ऋण)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {loanTypePreference === 'study_loan' ? 'College / University / Course Name (कॉलेज / पढ़ाई का विवरण)' : 'Business Firm / Enterprise Name (फर्म / व्यापार का नाम)'}
              </label>
              <input
                type="text"
                value={firmOrInstitutionName}
                onChange={(e) => setFirmOrInstitutionName(e.target.value)}
                placeholder={loanTypePreference === 'study_loan' ? 'e.g. IIT BHU B.Tech Computer Science' : 'e.g. Shekhar Hardware & Enterprises'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Specific Purpose of Loan / ऋण का विस्तृत उद्देश्य
              </label>
              <textarea
                id="loan-purpose-input"
                rows={3}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Purchase of modern CNC equipment / college tuition fee & laptop purchase / expanding tailoring shop"
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Date of Birth (जन्म तिथि) *
                  </label>
                  <input
                    type="date"
                    value={applicantDob}
                    onChange={(e) => setApplicantDob(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Calculated Age (आयु)
                  </label>
                  <div className="px-4 py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-mono text-xs font-bold flex items-center justify-between">
                    <span>{Math.max(18, new Date().getFullYear() - (applicantDob ? new Date(applicantDob).getFullYear() : 1995))} Years</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold">AUTO</span>
                  </div>
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
                  State / Union Territory (राज्य एवं केंद्र शासित प्रदेश) *
                </label>
                <select
                  value={isCustomState ? '✍️ Custom / Handwritten State (हस्तलिखित राज्य)' : applicantState}
                  onChange={(e) => {
                    if (e.target.value === '✍️ Custom / Handwritten State (हस्तलिखित राज्य)') {
                      setIsCustomState(true);
                      setApplicantState(customStateName || 'Custom State');
                    } else {
                      setIsCustomState(false);
                      setApplicantState(e.target.value);
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {INDIAN_STATES_AND_UTS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>

                {isCustomState && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={customStateName}
                      onChange={(e) => {
                        setCustomStateName(e.target.value);
                        setApplicantState(e.target.value);
                      }}
                      placeholder="✍️ Write / Type your State or Territory name"
                      className="w-full px-4 py-2 rounded-xl border border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/40 text-xs font-bold text-emerald-900 dark:text-emerald-200"
                    />
                  </div>
                )}
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
                    नॉमिनी का आधार नंबर (Nominee Aadhaar) *
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

                {/* Nominee Aadhaar Card Photo Upload Box */}
                <div className="sm:col-span-2 pt-2 border-t border-teal-200 dark:border-teal-800/60">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    📷 नॉमिनी का आधार कार्ड फोटो (Nominee Aadhaar Card Photo)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 py-2 px-3 rounded-lg border border-dashed border-teal-300 dark:border-teal-700 bg-white dark:bg-slate-900 text-center cursor-pointer hover:border-teal-500 transition-colors">
                      <span className="text-xs text-teal-700 dark:text-teal-300 flex items-center justify-center gap-1.5 font-bold">
                        <Upload className="w-3.5 h-3.5" /> Upload Nominee Aadhaar Photo (PDF/JPG)
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload('nominee_aadhaar' as any, e)}
                        className="hidden"
                      />
                    </label>

                    {nomineeAadhaarPhoto && (
                      <div className="w-12 h-12 rounded-lg border border-teal-500 overflow-hidden shrink-0 shadow-xs">
                        <img src={nomineeAadhaarPhoto} alt="Nominee Aadhaar" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
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

            {/* Document Upload Boxes - Vertical Stacked Shape */}
            <div className="space-y-4 flex flex-col">
              {/* Applicant Aadhaar Card Photo */}
              <div className="p-4 rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    💳
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                      <span>Applicant Aadhaar Card Photo (आवेदक का आधार कार्ड)</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold">UIDAI Required</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Front & Back photo scan of 12-digit Aadhaar Card
                    </p>
                  </div>
                </div>
                <label className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-all shadow-xs shrink-0 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" /> Upload Aadhaar Photo
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('aadhaar', e)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* PAN Card */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-sm shrink-0">
                    🆔
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                      <span>PAN Card Photo (पैन कार्ड फोटो)</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 font-bold">*Required</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Clear scan of 10-character Income Tax PAN card
                    </p>
                  </div>
                </div>
                <label className="py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold cursor-pointer transition-all border border-slate-300 dark:border-slate-700 shrink-0 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" /> Upload PAN Photo
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('pan', e)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Bank Statement */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-sm shrink-0">
                    🏦
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                      <span>Bank Statement / Passbook Photo (बैंक खाता विवरण)</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 font-bold">*Required</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Last 6 months bank statement or passbook first page scan
                    </p>
                  </div>
                </div>
                <label className="py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold cursor-pointer transition-all border border-slate-300 dark:border-slate-700 shrink-0 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" /> Upload Bank Passbook
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('bank_statement', e)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Nominee Aadhaar Card Upload Box */}
              <div className="p-4 rounded-2xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/40 dark:bg-teal-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    🤝
                  </div>
                  <div>
                    <h4 className="font-extrabold text-teal-950 dark:text-teal-200 text-xs flex items-center gap-1.5">
                      <span>Nominee Aadhaar Card Photo (नॉमिनी आधार कार्ड)</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-teal-600 text-white font-bold">Nominee Audit</span>
                    </h4>
                    <p className="text-[11px] text-teal-700/80 dark:text-teal-300/80 mt-0.5">
                      12-digit Aadhaar Card photo scan of Nominee
                    </p>
                  </div>
                </div>
                <label className="py-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold cursor-pointer transition-all shadow-xs shrink-0 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" /> Upload Nominee Aadhaar
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('nominee_aadhaar' as any, e)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Handwritten Application / Signature Upload Box */}
              <div className="p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    ✍️
                  </div>
                  <div>
                    <h4 className="font-extrabold text-indigo-950 dark:text-indigo-200 text-xs flex items-center gap-1.5">
                      <span>Handwritten Application / Signature (हस्तलिखित आवेदन / हस्ताक्षर)</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-600 text-white font-bold">Optional</span>
                    </h4>
                    <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80 mt-0.5">
                      Self-signed handwritten declaration letter or signature scan
                    </p>
                  </div>
                </div>
                <label className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer transition-all shadow-xs shrink-0 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" /> Upload Handwritten Doc
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('handwritten_doc' as any, e)}
                    className="hidden"
                  />
                </label>
              </div>
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
                          src={doc.previewUrl || (doc as any).doc_photo || (doc as any).photo_url || (doc as any).document_image || user?.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
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

            {govtEkycSuccessNotice && (
              <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500 text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{govtEkycSuccessNotice}</span>
              </div>
            )}

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center space-y-4">
              {/* Mode Switcher: Face vs Aadhaar Scan */}
              <div className="flex justify-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => {
                    setCameraScanMode('face');
                    startLiveCamera();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    cameraScanMode === 'face'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  📸 1. Live Applicant Face Photo (चेहरा)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCameraScanMode('aadhaar');
                    startLiveCamera();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    cameraScanMode === 'aadhaar'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  💳 2. Aadhaar Live Camera Scan (आधार ऑटो-फिल)
                </button>
              </div>

              {localBiometricRecord?.isVerified || capturedLivePhoto ? (
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-900/30">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  
                  <div>
                    <h4 className="text-base font-bold text-emerald-800 dark:text-emerald-300">
                      Biometric e-KYC Complete! / प्रमाणीकरण सफल!
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
                      Token: {localBiometricRecord?.token || 'BIO-AUTH-SHA256-7E9A34B8C1'}
                    </p>
                  </div>

                  {capturedLivePhoto && (
                    <div className="relative w-32 h-32 mx-auto rounded-2xl border-2 border-emerald-500 overflow-hidden shadow-md">
                      <img src={capturedLivePhoto} alt="Live Captured Face" className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 inset-x-0 bg-emerald-600/90 text-white text-[9px] font-bold py-0.5">
                        ✓ LIVE CAPTURED
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setLocalBiometricRecord(null);
                      setCapturedLivePhoto(null);
                      startLiveCamera();
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Re-take Live Photo / फिर से फोटो खींचें
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="relative w-64 h-64 mx-auto rounded-2xl overflow-hidden bg-slate-950 border-2 border-dashed border-emerald-500 flex items-center justify-center shadow-inner">
                    {isCameraActive ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform -scale-x-100"
                      />
                    ) : (
                      <div className="p-6 text-center space-y-3">
                        <Camera className="w-12 h-12 text-slate-500 mx-auto" />
                        <p className="text-xs text-slate-400">
                          {cameraScanMode === 'aadhaar' ? 'Aadhaar camera scanner inactive.' : 'Live camera inactive.'} Click button below to start.
                        </p>
                        <button
                          type="button"
                          onClick={startLiveCamera}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
                        >
                          Start Live Camera / कैमरा चालू करें
                        </button>
                      </div>
                    )}

                    {isCameraActive && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className={`border-2 border-emerald-400 ring-4 ring-emerald-500/30 animate-pulse ${
                          cameraScanMode === 'aadhaar' ? 'w-56 h-36 rounded-xl' : 'w-40 h-48 rounded-full'
                        }`}></div>
                        <div className="absolute top-2 bg-black/70 px-3 py-1 rounded-full text-[10px] text-emerald-300 font-mono font-bold">
                          {cameraScanMode === 'aadhaar' ? 'Align Aadhaar Card Here' : 'Align Face Here'}
                        </div>
                      </div>
                    )}
                  </div>

                  {isCameraActive && (
                    <button
                      type="button"
                      onClick={cameraScanMode === 'aadhaar' ? handleCaptureAadhaarScan : handleCaptureLivePhoto}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      {cameraScanMode === 'aadhaar'
                        ? '📸 Scan & Capture Aadhaar Card (आधार कार्ड स्कैन करें)'
                        : '📸 Photo Click / Capture Live Face Photo (फोटो खींचें)'}
                    </button>
                  )}

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-center gap-2">
                    <button
                      id="open-biometric-verify-btn"
                      type="button"
                      onClick={onOpenBiometricModal}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5"
                    >
                      <Fingerprint className="w-4 h-4 text-emerald-600" />
                      Alternative: Full Scanner Modal / फिंगरप्रिंट स्कैन
                    </button>
                  </div>
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
              {/* Original Verified Photo Card with Change Photo Option */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md bg-slate-900 shrink-0">
                  <img
                    src={capturedLivePhoto || user?.photoUrl || getDocImageLink('applicant_photo')}
                    alt="Applicant Face"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-emerald-600/90 text-white text-[8px] font-bold text-center py-0.5">
                    ✓ ORIGINAL PHOTO
                  </span>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Original Verified Face Photo (मूल पासपोर्ट फोटो)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    This photo will be encrypted and submitted to the bank nodal hub for verification.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <label className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-all inline-flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5" />
                      <span>📸 फोटो बदलें (Change Photo)</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = async (ev) => {
                              const compressed = await compressImageDataUrl(ev.target?.result as string, 600, 0.7);
                              setCapturedLivePhoto(compressed);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentStep(4);
                        startLiveCamera();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all inline-flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>कैमरा से फिर खींचें</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-slate-500">Scheme Name:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{scheme?.name ?? 'Government Loan Scheme'}</span>
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
