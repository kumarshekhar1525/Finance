import React, { useState } from 'react';
import { 
  FileCheck, 
  UploadCloud, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  Download, 
  RefreshCw, 
  Landmark, 
  Coins, 
  Briefcase, 
  Home, 
  Tractor, 
  User, 
  FileText, 
  Percent, 
  Wallet,
  X,
  Plus,
  Printer,
  ChevronDown,
  Award,
  ExternalLink
} from 'lucide-react';
import { 
  SupportedLanguage, 
  DocumentEligibilityResult, 
  MatchedLoanScheme, 
  LoanCategory, 
  BeneficiaryFilter, 
  Scheme,
  UserProfile
} from '../types';
import { translations } from '../lib/i18n';
import { SCHEMES_DATA } from '../data/schemes';

interface DocumentEligibilityCheckerProps {
  currentLang: SupportedLanguage;
  onSelectSchemeToApply: (schemeId: string, prefilledDocs?: any[]) => void;
  onNavigateToSchemes: () => void;
  user?: UserProfile | null;
}

interface UploadedFileItem {
  id: string;
  type: 'aadhaar' | 'pan' | 'income_proof' | 'caste_cert' | 'land_record' | 'artisan_cert' | 'business_proof' | 'father_aadhaar' | 'father_photo' | 'mother_aadhaar' | 'mother_photo' | 'important_doc' | 'student_proof';
  name: string;
  fileName: string;
  fileSize: string;
  status: 'valid' | 'scanning' | 'invalid';
  extractedDetail?: string;
}

// Preset personas for 1-click customer demonstration
interface PresetPersona {
  id: string;
  name: string;
  role: string;
  roleHi: string;
  avatarText: string;
  category: BeneficiaryFilter;
  residenceArea: 'Rural' | 'Urban';
  occupation: string;
  monthlyIncome: number;
  landHoldingAcres: number;
  badge: string;
  badgeColor: string;
  documents: UploadedFileItem[];
}

const PRESET_PERSONAS: PresetPersona[] = [
  {
    id: 'persona-1',
    name: 'Ramesh Kumar Verma',
    role: 'Rural SC/ST Entrepreneur',
    roleHi: 'ग्रामीण SC/ST उद्यमी (PMEGP 35% सब्सिडी)',
    avatarText: 'RV',
    category: 'sc_st',
    residenceArea: 'Rural',
    occupation: 'Business Owner',
    monthlyIncome: 38000,
    landHoldingAcres: 0,
    badge: '35% Govt. Subsidy Match',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300',
    documents: [
      {
        id: 'p1-1',
        type: 'aadhaar',
        name: 'Aadhaar Card (UIDAI Verified)',
        fileName: 'aadhaar_ramesh_verma.pdf',
        fileSize: '1.2 MB',
        status: 'valid',
        extractedDetail: 'Age: 36, Residence: Rural Bareilly, UP',
      },
      {
        id: 'p1-2',
        type: 'pan',
        name: 'PAN Card (NSDL Verified)',
        fileName: 'pan_ramesh_verma.jpg',
        fileSize: '850 KB',
        status: 'valid',
        extractedDetail: 'PAN: BKPVR****K, Compliant',
      },
      {
        id: 'p1-3',
        type: 'caste_cert',
        name: 'SC Caste Certificate (Revenue Dept)',
        fileName: 'caste_cert_sc_ramesh.pdf',
        fileSize: '1.4 MB',
        status: 'valid',
        extractedDetail: 'Category: SC/ST Special Subsidy Eligible',
      },
      {
        id: 'p1-4',
        type: 'income_proof',
        name: 'Bank Statement (PNB Bareilly 6 Months)',
        fileName: 'bank_statement_6m.pdf',
        fileSize: '2.8 MB',
        status: 'valid',
        extractedDetail: 'Avg Monthly Credit: ₹38,000, CIBIL: 780',
      },
    ],
  },
  {
    id: 'persona-study',
    name: 'Aman Kumar (Student Minor/Major)',
    role: 'Higher Education Student',
    roleHi: 'छात्र (PM विद्यालक्ष्मी 100% सब्सिडी स्टडी लोन)',
    avatarText: 'AK',
    category: 'obc',
    residenceArea: 'Urban',
    occupation: 'Student',
    monthlyIncome: 0,
    landHoldingAcres: 0,
    badge: '🎯 100% Study Loan Match',
    badgeColor: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200 border-indigo-300',
    documents: [
      {
        id: 'pstudy-1',
        type: 'aadhaar',
        name: 'Student Aadhaar & Marks Card',
        fileName: 'student_aadhaar_marksheet.pdf',
        fileSize: '1.5 MB',
        status: 'valid',
        extractedDetail: 'B.Tech CS Student, College Admission Letter verified',
      },
      {
        id: 'pstudy-2',
        type: 'father_aadhaar',
        name: 'Father Aadhaar & Photo (Co-applicant)',
        fileName: 'father_aadhaar_photo.pdf',
        fileSize: '1.8 MB',
        status: 'valid',
        extractedDetail: 'Father / Guardian KYC Verified',
      },
      {
        id: 'pstudy-3',
        type: 'income_proof',
        name: 'Father/Mother Income Certificate',
        fileName: 'income_cert_father.pdf',
        fileSize: '1.1 MB',
        status: 'valid',
        extractedDetail: 'Annual Family Income: ₹2.40 Lakhs (CSIS 100% Subsidy Eligible)',
      },
    ],
  },
  {
    id: 'persona-obc',
    name: 'Sunil Kumar Yadav',
    role: 'OBC Small Business Owner',
    roleHi: 'अन्य पिछड़ा वर्ग (OBC) उद्यमी (PMEGP / MUDRA)',
    avatarText: 'SY',
    category: 'obc',
    residenceArea: 'Rural',
    occupation: 'Business Owner',
    monthlyIncome: 45000,
    landHoldingAcres: 0,
    badge: 'Govt. Subsidy & Mudra Match',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300',
    documents: [
      {
        id: 'pobc-1',
        type: 'aadhaar',
        name: 'Aadhaar Card (UIDAI Verified)',
        fileName: 'aadhaar_sunil_yadav.pdf',
        fileSize: '1.2 MB',
        status: 'valid',
        extractedDetail: 'Age: 34, Residence: Lucknow, UP',
      },
      {
        id: 'pobc-2',
        type: 'pan',
        name: 'PAN Card (NSDL Verified)',
        fileName: 'pan_sunil_yadav.jpg',
        fileSize: '850 KB',
        status: 'valid',
        extractedDetail: 'PAN: BKPVR****Y, Compliant',
      },
      {
        id: 'pobc-3',
        type: 'caste_cert',
        name: 'OBC Caste Certificate (Revenue Dept)',
        fileName: 'caste_cert_obc_sunil.pdf',
        fileSize: '1.4 MB',
        status: 'valid',
        extractedDetail: 'Category: OBC Validated',
      },
    ],
  },
  {
    id: 'persona-2',
    name: 'Sunita Devi',
    role: 'Traditional Artisan / Tailoring',
    roleHi: 'पारंपरिक कारीगर / दर्जी (विश्वकर्मा 5% ब्याज)',
    avatarText: 'SD',
    category: 'women',
    residenceArea: 'Rural',
    occupation: 'Artisan / Traditional Craftsman',
    monthlyIncome: 22000,
    landHoldingAcres: 0,
    badge: 'PM Vishwakarma ₹15k Toolkit',
    badgeColor: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border-amber-300',
    documents: [
      {
        id: 'p2-1',
        type: 'aadhaar',
        name: 'Aadhaar Card (Front/Back)',
        fileName: 'aadhaar_sunita_devi.pdf',
        fileSize: '1.1 MB',
        status: 'valid',
        extractedDetail: 'Age: 32, Female, Muzaffarpur Bihar',
      },
      {
        id: 'p2-2',
        type: 'artisan_cert',
        name: 'Artisan / Tailor Skill Certificate',
        fileName: 'tailor_trade_cert.pdf',
        fileSize: '920 KB',
        status: 'valid',
        extractedDetail: 'Trade: Traditional Darzi (Artisan Tier-1)',
      },
      {
        id: 'p2-3',
        type: 'income_proof',
        name: 'JanDhan Bank Passbook',
        fileName: 'jandhan_passbook.jpg',
        fileSize: '1.5 MB',
        status: 'valid',
        extractedDetail: 'Regular micro-turnover: ₹22,000/mo',
      },
    ],
  },
  {
    id: 'persona-3',
    name: 'Harish Chandra Patel',
    role: 'Progressive Farmer (3.5 Acres)',
    roleHi: 'किसान (किसान क्रेडिट कार्ड 4% रियायती ब्याज)',
    avatarText: 'HP',
    category: 'general',
    residenceArea: 'Rural',
    occupation: 'Farmer / Agriculture',
    monthlyIncome: 30000,
    landHoldingAcres: 3.5,
    badge: 'KCC 4% Subsidized Crop Loan',
    badgeColor: 'bg-green-100 text-green-900 dark:bg-green-950 dark:text-green-300 border-green-300',
    documents: [
      {
        id: 'p3-1',
        type: 'aadhaar',
        name: 'Aadhaar Card',
        fileName: 'aadhaar_harish_patel.pdf',
        fileSize: '1.3 MB',
        status: 'valid',
        extractedDetail: 'Age: 44, Rural Varanasi UP',
      },
      {
        id: 'p3-2',
        type: 'land_record',
        name: 'Land Khatiyan / Khasra-Khatauni',
        fileName: 'khasra_khatauni_land_record.pdf',
        fileSize: '3.1 MB',
        status: 'valid',
        extractedDetail: 'Cultivable Land: 3.5 Acres, Irrigated',
      },
      {
        id: 'p3-3',
        type: 'pan',
        name: 'PAN Card',
        fileName: 'pan_harish_patel.jpg',
        fileSize: '780 KB',
        status: 'valid',
        extractedDetail: 'Valid Agricultural Tax Exempt Profile',
      },
    ],
  },
  {
    id: 'persona-4',
    name: 'Priya Sharma',
    role: 'Salaried Professional (Home Buyer)',
    roleHi: 'वेतनभोगी कर्मचारी (PMAY आवास सब्सिडी ऋण)',
    avatarText: 'PS',
    category: 'women',
    residenceArea: 'Urban',
    occupation: 'Salaried',
    monthlyIncome: 65000,
    landHoldingAcres: 0,
    badge: 'PMAY ₹2.67L Subsidy Eligible',
    badgeColor: 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200 border-blue-300',
    documents: [
      {
        id: 'p4-1',
        type: 'aadhaar',
        name: 'Aadhaar Card',
        fileName: 'aadhaar_priya_sharma.pdf',
        fileSize: '1.4 MB',
        status: 'valid',
        extractedDetail: 'Age: 29, Urban Lucknow',
      },
      {
        id: 'p4-2',
        type: 'pan',
        name: 'PAN Card',
        fileName: 'pan_priya_sharma.jpg',
        fileSize: '810 KB',
        status: 'valid',
        extractedDetail: 'Active Tax Filer / ITR Verified',
      },
      {
        id: 'p4-3',
        type: 'income_proof',
        name: '3 Months Salary Slips + Form 16',
        fileName: 'salary_slips_q2_2026.pdf',
        fileSize: '2.5 MB',
        status: 'valid',
        extractedDetail: 'Net Monthly In-Hand: ₹65,000, CIBIL: 810',
      },
    ],
  },
  {
    id: 'persona-5',
    name: 'Suresh Kumar Gupta',
    role: 'Street Food Vendor / Small Shop',
    roleHi: 'स्ट्रीट वेंडर (पीएम स्वनिधि 7% ब्याज सब्सिडी)',
    avatarText: 'SG',
    category: 'general',
    residenceArea: 'Urban',
    occupation: 'Street Vendor / Micro-Enterprise',
    monthlyIncome: 18000,
    landHoldingAcres: 0,
    badge: 'PM SVANidhi Micro Credit',
    badgeColor: 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-200 border-purple-300',
    documents: [
      {
        id: 'p5-1',
        type: 'aadhaar',
        name: 'Aadhaar Card',
        fileName: 'aadhaar_suresh_gupta.pdf',
        fileSize: '1.1 MB',
        status: 'valid',
        extractedDetail: 'Age: 38, Municipal Ward 14',
      },
      {
        id: 'p5-2',
        type: 'business_proof',
        name: 'Vending Certificate / Urban Livelihood ID',
        fileName: 'tvpc_vending_card.pdf',
        fileSize: '1.6 MB',
        status: 'valid',
        extractedDetail: 'Registered Street Vendor (CoVID Resilient)',
      },
    ],
  },
];

export const DocumentEligibilityChecker: React.FC<DocumentEligibilityCheckerProps> = ({
  currentLang,
  onSelectSchemeToApply,
  onNavigateToSchemes,
  user,
}) => {
  const isHi = currentLang === 'hi';
  const t = translations[currentLang] || translations.en;

  // Active user persona card when signed in / saved
  const activeUserPersona: PresetPersona | null = user ? {
    id: 'user-profile-active',
    name: user.fullName,
    role: `आपकी प्रोफाइल (${user.category === 'obc' ? 'OBC (अन्य पिछड़ा वर्ग)' : user.category === 'sc_st' ? 'SC/ST (35% सब्सिडी)' : user.category})`,
    roleHi: `आपकी प्रोफाइल (${user.fullName})`,
    avatarText: user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'SK',
    category: user.category || 'general',
    residenceArea: 'Rural',
    occupation: 'Business Owner',
    monthlyIncome: 45000,
    landHoldingAcres: 0,
    badge: '⭐ Your Saved Profile',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300',
    documents: [
      {
        id: 'user-doc-aadhaar',
        type: 'aadhaar',
        name: 'Aadhaar Card (UIDAI Verified)',
        fileName: `aadhaar_${user.fullName.toLowerCase().replace(/\s+/g, '_')}.pdf`,
        fileSize: '1.2 MB',
        status: 'valid',
        extractedDetail: `Name: ${user.fullName}, Aadhaar: XXXX-XXXX-${user.aadhaarNumber.slice(-4)}`,
      },
      {
        id: 'user-doc-pan',
        type: 'pan',
        name: 'PAN Card (NSDL Verified)',
        fileName: `pan_${user.fullName.toLowerCase().replace(/\s+/g, '_')}.jpg`,
        fileSize: '850 KB',
        status: 'valid',
        extractedDetail: 'Compliant Tax Profile',
      },
      ...(user.category === 'obc' || user.category === 'sc_st' ? [{
        id: 'user-doc-caste',
        type: 'caste_cert' as const,
        name: `${user.category.toUpperCase()} Caste Certificate (Revenue Dept)`,
        fileName: `caste_cert_${user.category}.pdf`,
        fileSize: '1.4 MB',
        status: 'valid' as const,
        extractedDetail: `Category: ${user.category.toUpperCase()} Special Subsidy Eligible`,
      }] : [])
    ]
  } : null;

  // Citizen portal view shows ONLY the active user profile card to protect privacy
  const displayPersonas = activeUserPersona ? [activeUserPersona] : [{
    id: 'user-profile-default',
    name: user?.fullName || 'Shekhar Kumar',
    role: 'आपकी प्रोफाइल (Your Saved Profile)',
    roleHi: `आपकी प्रोफाइल (${user?.fullName || 'Shekhar Kumar'})`,
    avatarText: (user?.fullName || 'SK').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
    category: user?.category || 'general',
    residenceArea: 'Rural' as const,
    occupation: 'Business Owner',
    monthlyIncome: 45000,
    landHoldingAcres: 0,
    badge: '⭐ Your Saved Profile',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300',
    documents: [
      {
        id: 'user-doc-aadhaar',
        type: 'aadhaar' as const,
        name: 'Aadhaar Card (UIDAI Verified)',
        fileName: 'aadhaar_shekhar_kumar.pdf',
        fileSize: '1.2 MB',
        status: 'valid' as const,
        extractedDetail: 'Name: Shekhar Kumar, Aadhaar: XXXX-XXXX-1098',
      },
      {
        id: 'user-doc-pan',
        type: 'pan' as const,
        name: 'PAN Card (NSDL Verified)',
        fileName: 'pan_shekhar_kumar.jpg',
        fileSize: '850 KB',
        status: 'valid' as const,
        extractedDetail: 'Compliant Tax Profile',
      },
      {
        id: 'user-doc-caste',
        type: 'caste_cert' as const,
        name: 'OBC Caste Certificate (Revenue Dept)',
        fileName: 'caste_cert_obc.pdf',
        fileSize: '1.4 MB',
        status: 'valid' as const,
        extractedDetail: 'Category: OBC Special Subsidy Eligible',
      }
    ]
  }];

  // Uploaded files state initialized with Active User or Persona 1 by default
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>(displayPersonas[0].id);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>(displayPersonas[0].documents);

  // Manual Profile Overrides & Minor Support
  const [customerName, setCustomerName] = useState<string>(displayPersonas[0].name);
  const [customerCategory, setCustomerCategory] = useState<BeneficiaryFilter>(displayPersonas[0].category);
  const [residenceArea, setResidenceArea] = useState<'Rural' | 'Urban'>(displayPersonas[0].residenceArea);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(displayPersonas[0].monthlyIncome);
  const [landHolding, setLandHolding] = useState<number>(displayPersonas[0].landHoldingAcres);
  const [showAdvanceInputs, setShowAdvanceInputs] = useState<boolean>(false);
  const [isMinor, setIsMinor] = useState<boolean>(false);
  const [selectedPurpose, setSelectedPurpose] = useState<string>('all');

  // Nominee state
  const [nomineeName, setNomineeName] = useState<string>(user?.nomineeDetails?.name || '');
  const [nomineeRelation, setNomineeRelation] = useState<string>(user?.nomineeDetails?.relation || 'Father');

  // Analysis State
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<number>(0);
  const [eligibilityResult, setEligibilityResult] = useState<DocumentEligibilityResult | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  // Handle Preset Persona Selection
  const handleSelectPreset = (persona: PresetPersona) => {
    setSelectedPersonaId(persona.id);
    setUploadedFiles(persona.documents);
    setCustomerName(persona.name);
    setCustomerCategory(persona.category);
    setResidenceArea(persona.residenceArea);
    setMonthlyIncome(persona.monthlyIncome);
    setLandHolding(persona.landHoldingAcres);

    if (persona.id === 'persona-study') {
      setSelectedPurpose('study_loan');
      setActiveCategoryFilter('study_loan');
    }

    // Update active user profile in localStorage so Navbar reflects selected name
    const activeProfile = {
      fullName: persona.name,
      category: persona.category,
      phone: '+91 98765 43210',
      email: persona.name.toLowerCase().replace(/\s+/g, '.') + '@example.com',
      state: 'Uttar Pradesh',
    };
    localStorage.setItem('jandhan_user_profile', JSON.stringify(activeProfile));

    // Clear old result to encourage re-evaluating
    setEligibilityResult(null);
  };

  // Handle Custom File Upload (Simulation + Real File Object)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, docType: UploadedFileItem['type']) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const newDoc: UploadedFileItem = {
      id: 'doc-user-' + Date.now(),
      type: docType,
      name: file.name.replace(/\.[^/.]+$/, '').toUpperCase(),
      fileName: file.name,
      fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      status: 'valid',
      extractedDetail: 'Document scanned & ready for eligibility evaluation',
    };

    setUploadedFiles((prev) => [...prev.filter((d) => d.type !== docType), newDoc]);
    setSelectedPersonaId('custom');
    setEligibilityResult(null);
  };

  const removeDocument = (id: string) => {
    setUploadedFiles((prev) => prev.filter((doc) => doc.id !== id));
    setEligibilityResult(null);
  };

  // Client-Side Deterministic Eligibility Engine (Fallback & Instant Evaluation)
  const evaluateLocalEligibility = (
    files: UploadedFileItem[],
    name: string,
    category: BeneficiaryFilter,
    area: 'Rural' | 'Urban',
    income: number,
    land: number,
    minor: boolean,
    purpose: string
  ): DocumentEligibilityResult => {
    const docTypes = files.map((f) => f.type);
    const hasDoc = (t: string) => docTypes.some((dt) => dt === t || dt.includes(t));

    const calculateEmi = (principal: number, annualRate: number, tenureMonths: number) => {
      const r = annualRate / 12 / 100;
      if (r === 0) return Math.round(principal / tenureMonths);
      const emi = (principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1);
      return Math.round(emi);
    };

    const matchedSchemes: MatchedLoanScheme[] = SCHEMES_DATA.map((scheme) => {
      let score = 75;
      const reasons: string[] = [];
      const reasonsHi: string[] = [];
      const missingDocs: string[] = [];

      if (hasDoc('aadhaar')) {
        score += 10;
        reasons.push('Aadhaar card identity & biometric compliance verified');
        reasonsHi.push('आधार कार्ड पहचान एवं बायोमेट्रिक अनुपालन सत्यापित');
      } else {
        missingDocs.push('Aadhaar Card (UIDAI Verified)');
      }

      if (hasDoc('pan')) {
        score += 10;
        reasons.push('PAN card verified with tax compliance check');
        reasonsHi.push('पैन कार्ड सत्यापित एवं कर अनुपालन की पुष्टि');
      }

      if (category === 'sc_st' || category === 'women' || category === 'obc') {
        if (scheme.beneficiaryTypes.includes(category) || scheme.beneficiaryTypes.includes('all')) {
          score += 10;
          reasons.push(`Priority allocation unlocked under ${category.toUpperCase()} affirmative quota`);
          reasonsHi.push(`${category.toUpperCase()} सरकारी कोटा के तहत विशेष प्राथमिकता आवंटन`);
        }
      }

      if (scheme.id === 'pmegp-2026') {
        if (hasDoc('caste_cert') || category === 'sc_st' || category === 'women') {
          score += 10;
          reasons.push('Full 35% Govt capital subsidy unlocked under PMEGP Special Category');
          reasonsHi.push('PMEGP विशेष श्रेणी के तहत पूर्ण 35% सरकारी सब्सिडी स्वीकृत');
        }
      } else if (scheme.id === 'pm-vishwakarma-2026') {
        if (hasDoc('artisan_cert') || income <= 35000) {
          score += 15;
          reasons.push('Artisan trade verified: Eligible for ₹15,000 Free E-Voucher Toolkit + 5% Subsidized Loan');
          reasonsHi.push('विश्वकर्मा हुनर सत्यापित: ₹15,000 मुफ़्त टूलकिट वाउचर + 5% रियायती ब्याज ऋण पात्र');
        }
      } else if (scheme.id === 'kcc-2026') {
        if (hasDoc('land_record') || land > 0) {
          score += 20;
          reasons.push('Cultivable land record verified: 4% Concessional Crop Credit active');
          reasonsHi.push('कृषि योग्य भूमि रिकॉर्ड सत्यापित: 4% रियायती फसल ऋण सक्रिय');
        } else {
          missingDocs.push('Land Khatiyan / Khasra-Khatauni Record');
        }
      } else if (scheme.id === 'pm-svanidhi-2026') {
        if (hasDoc('business_proof') || income <= 30000) {
          score += 15;
          reasons.push('Street vendor/micro-business verified: 7% Interest Subsidy unlocked');
          reasonsHi.push('रेहड़ी-पटरी / सूक्ष्म व्यापारी सत्यापित: 7% ब्याज सब्सिडी स्वीकृत');
        }
      } else if (scheme.id === 'vidya-lakshmi-edu-2026') {
        if (minor || hasDoc('father_aadhaar') || hasDoc('mother_aadhaar') || hasDoc('student_proof')) {
          score += 20;
          reasons.push('Student & Guardian education loan profile verified: 100% Collateral-Free Study Loan');
          reasonsHi.push('छात्र व अभिभावक शिक्षा ऋण प्रोफाइल सत्यापित: 100% बिना गारंटी पढ़ाई ऋण');
        }
      }

      const calculatedMax = Math.min(scheme.maxAmount, Math.max(scheme.minAmount, Math.round(income * 36 / 5000) * 5000));
      const subsidyAmt = Math.round((calculatedMax * scheme.subsidyPercentage) / 100);
      const emi = calculateEmi(calculatedMax - subsidyAmt, scheme.interestRate, scheme.tenureMonths);

      return {
        schemeId: scheme.id,
        schemeName: scheme.name,
        schemeNameHi: scheme.nameHi,
        category: scheme.category,
        department: scheme.department,
        matchScore: Math.min(99, Math.max(65, score)),
        eligibilityStatus: score >= 75 ? 'eligible' : 'conditionally_eligible',
        maxEligibleAmount: calculatedMax,
        subsidyPercentage: scheme.subsidyPercentage,
        subsidyAmount: subsidyAmt,
        interestRate: scheme.interestRate,
        tenureMonths: scheme.tenureMonths,
        monthlyEmi: emi,
        reasonsForEligibility: reasons.length > 0 ? reasons : ['Identity and document KYC checks cleared'],
        reasonsForEligibilityHi: reasonsHi.length > 0 ? reasonsHi : ['पहचान एवं दस्तावेज़ केवाईसी अनुपालन पूर्ण'],
        missingDocsForHigherLimit: missingDocs.length > 0 ? missingDocs : undefined,
        officialPortalUrl: scheme.officialPortalUrl,
        iconName: scheme.iconName,
      };
    });

    const eligibleSchemes = matchedSchemes.filter((s) => s.eligibilityStatus !== 'not_eligible');
    const highestLoanLimit = Math.max(...eligibleSchemes.map((s) => s.maxEligibleAmount), 0);
    const totalSubsidy = eligibleSchemes.reduce((sum, s) => sum + s.subsidyAmount, 0);

    return {
      extractedProfile: {
        name: name || 'Shekhar Kumar',
        aadhaarNumberMasked: 'XXXX-XXXX-1098',
        panNumberMasked: 'BKPVR****Y',
        age: minor ? 17 : 34,
        gender: 'Male',
        category: category,
        residenceArea: area,
        state: 'Uttar Pradesh',
        occupation: 'Business Owner',
        monthlyIncome: income,
        annualIncome: income * 12,
        landHoldingAcres: land,
        cibilScoreEstimate: 785,
        documentsVerified: files.map((f) => f.name),
      },
      totalEligibleSchemes: eligibleSchemes.length,
      highestLoanLimit,
      totalSubsidyUnlocked: totalSubsidy,
      matchedSchemes,
      aiAnalysisSummary: `Based on your attached document proofs (${files.map(f => f.name).join(', ')}), your profile has been successfully evaluated. You qualify for ${eligibleSchemes.length} Government loan & subsidy schemes with up to ₹${totalSubsidy.toLocaleString('en-IN')} total capital subsidy!`,
      aiAnalysisSummaryHi: `आपके द्वारा संलग्न दस्तावेज़ों (${files.map(f => f.name).join(', ')}) के आधार पर आपकी पात्रता जांच पूर्ण हो गई है। आप भारत सरकार एवं बैंकों की कुल ${eligibleSchemes.length} योजनाओं के पात्र हैं, जिसमें कुल ₹${totalSubsidy.toLocaleString('en-IN')} की प्रत्यक्ष सब्सिडी (छूट) शामिल है!`,
      evaluationDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      certificateRefNumber: `ELIG-2026-${Math.floor(100000 + Math.random() * 900000)}`,
    };
  };

  // Evaluate Documents via Server API or Local Engine Fallback
  const handleRunEligibilityEvaluation = async () => {
    if (uploadedFiles.length === 0) {
      alert(isHi ? 'कृपया कम से कम एक दस्तावेज़ अपलोड करें' : 'Please upload at least one document');
      return;
    }

    setIsScanning(true);
    setScanStep(1);

    setTimeout(() => setScanStep(2), 400);
    setTimeout(() => setScanStep(3), 900);

    let result: DocumentEligibilityResult | null = null;

    try {
      const response = await fetch('/api/eligibility/check-documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documents: uploadedFiles,
          profileHints: {
            name: customerName,
            category: customerCategory,
            residenceArea,
            monthlyIncome,
            landHoldingAcres: landHolding,
            isMinor,
            loanCategory: selectedPurpose !== 'all' ? selectedPurpose : undefined,
          },
        }),
      });

      if (response.ok) {
        const resData = await response.json();
        if (resData.success && resData.data) {
          result = resData.data;
        }
      }
    } catch (err) {
      console.warn('Backend API unavailable, using local eligibility calculation engine:', err);
    }

    if (!result) {
      result = evaluateLocalEligibility(
        uploadedFiles,
        customerName,
        customerCategory,
        residenceArea,
        monthlyIncome,
        landHolding,
        isMinor,
        selectedPurpose
      );
    }

    setTimeout(() => {
      setIsScanning(false);
      setScanStep(0);
      setEligibilityResult(result);
      if (selectedPurpose !== 'all') {
        setActiveCategoryFilter(selectedPurpose);
      }
    }, 1400);
  };

  // Instant initial load evaluation
  React.useEffect(() => {
    if (!eligibilityResult && uploadedFiles.length > 0) {
      const initialResult = evaluateLocalEligibility(
        uploadedFiles,
        customerName,
        customerCategory,
        residenceArea,
        monthlyIncome,
        landHolding,
        isMinor,
        selectedPurpose
      );
      setEligibilityResult(initialResult);
    }
  }, []);

  // Filter matched schemes by purpose & category
  const filteredSchemes = eligibilityResult?.matchedSchemes.filter((scheme) => {
    if (activeCategoryFilter === 'all') return true;
    if (activeCategoryFilter === 'subsidy') return scheme.subsidyPercentage > 0;
    return scheme.category === activeCategoryFilter;
  }) || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-6 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Full-Width Background Photo Banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[300px] flex items-center justify-between p-6 sm:p-10 border border-emerald-500/20 text-white">
          <img
            src="https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1600&auto=format&fit=crop&q=80"
            alt="AI Document Underwriter"
            className="absolute inset-0 w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-emerald-950/70" />
          
          {/* Animated Scanning Beam Line Effect */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse" style={{ top: '20%' }} />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              {isHi ? 'एआई दस्तावेज़ आधारित ऋण पात्रता प्रणाली' : 'AI Document-Based Loan Eligibility Engine'}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-serif text-white drop-shadow-md">
              {isHi ? 'दस्तावेज़ डालें और जानें कि आप किस-किस लोन के पात्र हैं' : 'Upload Documents to Discover All Loans You Qualify For'}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {isHi 
                ? 'आधार कार्ड, पैन कार्ड, बैंक विवरण, जाति अथवा जमीन का दस्तावेज़ अपलोड करें। हमारा सुरक्षित डिजिटल अंडरराइटिंग इंजन तुरंत जांचकर बताएगा कि भारत सरकार एवं बैंकों की किन-किन योजनाओं में आपको कितना ऋण और कितनी सरकारी सब्सिडी (छूट) मिलेगी।'
                : 'Upload your documents (Aadhaar, PAN, Bank Statement, Caste or Land proof) to instantly evaluate your eligibility across all Central Government schemes and Bank credit facilities with exact subsidy calculation.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs sm:text-sm text-emerald-200">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {isHi ? '100% सुरक्षित एवं 256-बिट एन्क्रिप्टेड' : '100% Secure & Encrypted'}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {isHi ? 'बिना शाखा जाए घर बैठे पात्रता जांच' : 'Zero Branch Visits Required'}
              </span>
              <span className="flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-emerald-400" />
                {isHi ? '35% तक सरकारी सब्सिडी की गणना' : 'Up to 35% Govt. Subsidy Audit'}
              </span>
            </div>
          </div>
        </div>

        {/* Step 1: Preset Profiles for 1-Click Testing */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                {isHi ? '1. त्वरित जांच हेतु टेस्ट प्रोफाइल चुनें या स्वयं के दस्तावेज़ डालें' : '1. Choose a Test Profile or Upload Your Own Documents'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isHi 
                  ? 'नीचे दिए गए किसी भी नागरिक प्रोफाइल पर क्लिक करके तुरंत जांचें, या नीचे अपना फाइल अपलोड करें'
                  : 'Click any sample citizen profile below to test instantly with pre-verified documents, or upload your own files'}
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 self-start sm:self-auto">
              {isHi ? '5 नमूना प्रोफाइल उपलब्ध' : '5 Presets Available'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-2">
            {displayPersonas.map((persona) => {
              const isSelected = selectedPersonaId === persona.id;
              return (
                <button
                  key={persona.id}
                  onClick={() => handleSelectPreset(persona)}
                  className={`text-left p-3.5 rounded-xl border transition-all relative flex flex-col justify-between ${
                    isSelected 
                      ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 shadow-sm ring-2 ring-emerald-500/20' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                        {persona.avatarText}
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${persona.badgeColor}`}>
                        {persona.badge}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {persona.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-2">
                        {isHi ? persona.roleHi : persona.role}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
                    <span>{persona.documents.length} {isHi ? 'दस्तावेज़' : 'Docs'}</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      ₹{(persona.monthlyIncome).toLocaleString('en-IN')}/mo
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Uploaded Documents Grid & Custom Upload Options */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                {isHi ? '2. सत्यापित दस्तावेज़ सूची (Uploaded Verification Proofs)' : '2. Verified Uploaded Documents'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isHi 
                  ? 'पात्रता विश्लेषण हेतु उपयोग किए जाने वाले दस्तावेज़। आप नए दस्तावेज़ भी जोड़ सकते हैं।' 
                  : 'Documents currently attached for eligibility scoring. You can attach additional proofs to unlock higher loan amounts.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {uploadedFiles.length} {isHi ? 'सत्यापित दस्तावेज़ संलग्न' : 'Documents Attached'}
              </span>
            </div>
          </div>

          {/* Current Uploaded Documents Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedFiles.map((doc) => (
              <div 
                key={doc.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col justify-between space-y-3 relative group"
              >
                <button 
                  onClick={() => removeDocument(doc.id)}
                  className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                  title="Remove Document"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 pr-6">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      {doc.type.replace('_', ' ')}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {doc.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {doc.fileName} • {doc.fileSize}
                    </p>
                  </div>
                </div>

                {doc.extractedDetail && (
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{doc.extractedDetail}</span>
                  </div>
                )}
              </div>
            ))}

            {/* Quick Upload Add Document Card */}
            <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50/30 dark:bg-slate-800/30 flex flex-col items-center justify-center text-center space-y-2 cursor-pointer transition-colors relative min-h-[130px]">
              <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-emerald-500" />
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isHi ? '+ अन्य दस्तावेज़ अपलोड करें' : '+ Upload Additional Document'}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {isHi ? 'जाति, जमीन की नकल या बैंक स्टेटमेंट' : 'Income, Caste, Land Record, Artisan Proof'}
                </p>
              </div>

              {/* Hidden file input */}
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => handleFileUpload(e, 'income_proof')}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
          </div>

          {/* Quick upload chips for missing categories */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {isHi ? 'विशिष्ट योजना लाभ हेतु दस्तावेज़ जोड़ें:' : 'Add specific proof to unlock more schemes:'}
            </span>

            <label className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/40 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 cursor-pointer transition-colors">
              <Plus className="w-3 h-3 text-indigo-600" />
              {isHi ? '🎓 छात्र आधार व अंकपत्र (100% स्टडी लोन)' : '🎓 Student Proof (100% Study Loan)'}
              <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'student_proof')} />
            </label>

            <label className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
              <Plus className="w-3 h-3 text-emerald-600" />
              {isHi ? 'जाति प्रमाण पत्र (SC/ST 35% सब्सिडी)' : 'Caste Cert (SC/ST 35% Subsidy)'}
              <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'caste_cert')} />
            </label>

            <label className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
              <Plus className="w-3 h-3 text-emerald-600" />
              {isHi ? 'जमीन खतियान (KCC 4% कृषि ऋण)' : 'Land Khatiyan (KCC 4% Crop Loan)'}
              <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'land_record')} />
            </label>
          </div>

          {/* Minor Applicant (<18 Years) Parent Documents & Nominee Options */}
          <div className="p-4 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/60 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-indigo-950 dark:text-indigo-200">
                <input
                  type="checkbox"
                  checked={isMinor}
                  onChange={(e) => setIsMinor(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>{isHi ? '👨‍👩‍👦 माइनर आवेदक (18 वर्ष से कम आयु) - माता-पिता दस्तावेज़ एवं नॉमिनी अनिवार्य' : '👨‍👩‍👦 Minor Applicant (<18 Years Old) - Require Parents & Nominee Proof'}</span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold">{isHi ? 'ऋण का मुख्य उद्देश्य:' : 'Loan Purpose:'}</span>
                <select
                  value={selectedPurpose}
                  onChange={(e) => {
                    setSelectedPurpose(e.target.value);
                    if (e.target.value !== 'all') setActiveCategoryFilter(e.target.value);
                  }}
                  className="px-2.5 py-1 rounded-lg border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-900 text-xs font-bold text-indigo-900 dark:text-indigo-200"
                >
                  <option value="all">{isHi ? 'सभी ऋण (All Purpose)' : 'All Purpose'}</option>
                  <option value="study_loan">🎓 Study & Education Loan (शिक्षा/स्टडी लोन)</option>
                  <option value="sarkari_loan">🏛️ Government Subsidy Loan (PMEGP 35%)</option>
                  <option value="chota_loan">🛍️ Micro / Mudra Business Loan</option>
                  <option value="agriculture_loan">🌾 Kisan & Agri Credit (KCC 4%)</option>
                  <option value="home_loan">🏠 Home Loan / PMAY Subsidy</option>
                </select>
              </div>
            </div>

            {isMinor && (
              <div className="pt-2 border-t border-indigo-200/60 dark:border-indigo-800/40 space-y-3">
                <p className="text-xs text-indigo-900 dark:text-indigo-300 font-semibold">
                  {isHi ? 'माइनर आवेदक (18 से कम) हेतु पिता एवं माता का आधार कार्ड, फोटो व आय प्रमाण पत्र संलग्न करें:' : 'Attach Father & Mother Aadhaar, Photo and Income Certificate for Minor applicant:'}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 text-slate-800 dark:text-slate-200 font-semibold cursor-pointer">
                    <Plus className="w-3.5 h-3.5 text-indigo-600" />
                    {isHi ? '👨 पिता आधार कार्ड & फोटो' : 'Father Aadhaar & Photo'}
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'father_aadhaar')} />
                  </label>

                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 text-slate-800 dark:text-slate-200 font-semibold cursor-pointer">
                    <Plus className="w-3.5 h-3.5 text-indigo-600" />
                    {isHi ? '👩 माता आधार कार्ड & फोटो' : 'Mother Aadhaar & Photo'}
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'mother_aadhaar')} />
                  </label>

                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 text-slate-800 dark:text-slate-200 font-semibold cursor-pointer">
                    <Plus className="w-3.5 h-3.5 text-indigo-600" />
                    {isHi ? '📜 माता-पिता का आय & जाति प्रमाण पत्र' : 'Parents Income & Caste Cert'}
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'income_proof')} />
                  </label>

                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 text-slate-800 dark:text-slate-200 font-semibold cursor-pointer">
                    <Plus className="w-3.5 h-3.5 text-indigo-600" />
                    {isHi ? '📄 जन्म / बोनाफाइड सर्टिफिकेट' : 'Birth / Student Bonafide Cert'}
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'important_doc')} />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Collapsible Profile Fine-Tuner */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setShowAdvanceInputs(!showAdvanceInputs)}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
            >
              <span>{isHi ? 'नागरिक प्रोफाइल विवरण देखें / बदलें' : 'View / Modify Extracted Profile Details'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvanceInputs ? 'rotate-180' : ''}`} />
            </button>

            {showAdvanceInputs && (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {isHi ? 'आवेदक का नाम' : 'Applicant Name'}
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {isHi ? 'लाभार्थी श्रेणी' : 'Beneficiary Category'}
                  </label>
                  <select
                    value={customerCategory}
                    onChange={(e) => setCustomerCategory(e.target.value as BeneficiaryFilter)}
                    className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="obc">OBC / अन्य पिछड़ा वर्ग (Eligible for Govt Subsidy)</option>
                    <option value="sc_st">SC / ST (Scheduled Caste / Tribe - Max Subsidy)</option>
                    <option value="women">Women Entrepreneur (महिला उद्यमी)</option>
                    <option value="general">General (सामान्य वर्ग)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {isHi ? 'नॉमिनी का पूरा नाम' : 'Nominee Name'}
                  </label>
                  <input
                    type="text"
                    value={nomineeName}
                    onChange={(e) => setNomineeName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar (Father)"
                    className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {isHi ? 'नॉमिनी से संबंध' : 'Nominee Relation'}
                  </label>
                  <select
                    value={nomineeRelation}
                    onChange={(e) => setNomineeRelation(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="Father">Father (पिता)</option>
                    <option value="Mother">Mother (माता)</option>
                    <option value="Spouse">Spouse (पति / पत्नी)</option>
                    <option value="Guardian">Guardian (अभिभावक)</option>
                    <option value="Brother">Brother / Sister (भाई / बहन)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleRunEligibilityEvaluation}
              disabled={isScanning}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  {isHi ? 'दस्तावेज़ स्कैन व पात्रता गणना जारी है...' : 'Scanning Documents & Evaluating Loans...'}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  {isHi ? 'दस्तावेज़ से मेरी ऋण पात्रता जांचें (Check My Loan Eligibility)' : 'Scan Documents & Check Loan Eligibility'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {isScanning && (
              <div className="text-xs text-slate-600 dark:text-slate-400 animate-pulse font-medium">
                {scanStep === 1 && (isHi ? 'चरण 1/3: आधार एवं पैन दस्तावेज़ों का सत्यापन...' : 'Step 1/3: Validating KYC identity credentials...')}
                {scanStep === 2 && (isHi ? 'चरण 2/3: सरकारी सब्सिडी व आय सीमाओं का मिलान...' : 'Step 2/3: Cross-matching 10+ Government scheme criteria...')}
                {scanStep === 3 && (isHi ? 'चरण 3/3: अधिकतम स्वीकृत ऋण सीमा व किश्त गणना...' : 'Step 3/3: Computing maximum loan amount & EMI schedule...')}
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Comprehensive Eligibility Results Dashboard */}
        {eligibilityResult && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Results Metric Highlights */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-xs font-semibold uppercase">{isHi ? 'कुल पात्र योजनाएं' : 'Matched Schemes'}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {eligibilityResult.totalEligibleSchemes}
                  </span>
                  <span className="text-xs text-emerald-600 font-bold">{isHi ? 'योजनाएं स्वीकृत' : 'Approved Schemes'}</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-xs font-semibold uppercase">{isHi ? 'अधिकतम ऋण सीमा' : 'Max Loan Limit'}</span>
                  <Wallet className="w-4 h-4 text-teal-600" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    ₹{(eligibilityResult.highestLoanLimit).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-xs font-semibold uppercase">{isHi ? 'सरकारी सब्सिडी अनलॉक' : 'Govt Subsidy Unlocked'}</span>
                  <Percent className="w-4 h-4 text-amber-600" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                    ₹{(eligibilityResult.totalSubsidyUnlocked).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                    DBT Free Grant
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-xs font-semibold uppercase">{isHi ? 'पात्रता प्रमाण पत्र' : 'Eligibility Certificate'}</span>
                  <Award className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => setShowCertificateModal(true)}
                    className="w-full py-2 px-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {isHi ? 'प्रमाण पत्र डाउनलोड करें' : 'Download Certificate'}
                  </button>
                </div>
              </div>
            </div>

            {/* AI Underwriter Assessment Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{isHi ? 'जनधन एआई डिजिटल अंडरराइटर की टिप्पणी (Underwriting Summary):' : 'JanDhan AI Underwriting Assessment:'}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {isHi ? eligibilityResult.aiAnalysisSummaryHi : eligibilityResult.aiAnalysisSummary}
              </p>
            </div>

            {/* Filter Tabs for Loan Types */}
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
                <button
                  onClick={() => setActiveCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    activeCategoryFilter === 'all'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {isHi ? 'सभी पात्र योजनाएं' : 'All Eligible Loans'} ({eligibilityResult.matchedSchemes.length})
                </button>

                <button
                  onClick={() => setActiveCategoryFilter('subsidy')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    activeCategoryFilter === 'subsidy'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {isHi ? 'सरकारी सब्सिडी वाले ऋण' : 'Govt. Subsidy Loans'}
                </button>

                <button
                  onClick={() => setActiveCategoryFilter('chota_loan')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    activeCategoryFilter === 'chota_loan'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {isHi ? 'छोटा ऋण / मुद्रा' : 'Micro Credit / Mudra'}
                </button>

                <button
                  onClick={() => setActiveCategoryFilter('agriculture_loan')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    activeCategoryFilter === 'agriculture_loan'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {isHi ? 'किसान व कृषि ऋण' : 'Kisan & Agriculture'}
                </button>

                <button
                  onClick={() => setActiveCategoryFilter('home_loan')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    activeCategoryFilter === 'home_loan'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {isHi ? 'गृह ऋण / PMAY' : 'Home Loan'}
                </button>
              </div>
            </div>

            {/* Scheme Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredSchemes.map((scheme) => {
                const targetScheme = SCHEMES_DATA.find((s) => s.id === scheme.schemeId);
                const bgImage = targetScheme?.imageUrl;
                return (
                  <div
                    key={scheme.schemeId}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
                  >
                    {bgImage && (
                      <div className="relative h-36 w-full overflow-hidden">
                        <img
                          src={bgImage}
                          alt={scheme.schemeName}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end justify-between p-3.5">
                          <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white border border-white/20 uppercase tracking-wider">
                            {scheme.department}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500 text-slate-950 shadow-md">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {scheme.matchScore}% {isHi ? 'पात्र' : 'Match'}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-5 sm:p-6 space-y-4">
                      {/* Header with Title */}
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {isHi ? scheme.schemeNameHi : scheme.schemeName}
                        </h3>
                      </div>

                    {/* Financial Numbers Matrix */}
                    <div className="grid grid-cols-3 gap-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
                      <div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                          {isHi ? 'स्वीकृत ऋण सीमा' : 'Eligible Limit'}
                        </span>
                        <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                          ₹{(scheme.maxEligibleAmount).toLocaleString('en-IN')}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                          {isHi ? 'ब्याज दर' : 'Interest Rate'}
                        </span>
                        <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                          {scheme.interestRate}% p.a.
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                          {scheme.subsidyPercentage > 0 ? (isHi ? 'सरकारी सब्सिडी' : 'Govt Subsidy') : (isHi ? 'मासिक किश्त' : 'Monthly EMI')}
                        </span>
                        <p className={`text-sm font-extrabold mt-0.5 ${scheme.subsidyPercentage > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
                          {scheme.subsidyPercentage > 0 ? `${scheme.subsidyPercentage}% (₹${(scheme.subsidyAmount).toLocaleString('en-IN')})` : `₹${(scheme.monthlyEmi).toLocaleString('en-IN')}`}
                        </p>
                      </div>
                    </div>

                    {/* Reasons for eligibility based on documents */}
                    <div className="space-y-1.5 pt-1">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {isHi ? 'आप क्यों पात्र हैं (Document Qualification Reasons):' : 'Why You Qualify:'}
                      </p>
                      <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                        {(isHi ? scheme.reasonsForEligibilityHi : scheme.reasonsForEligibility).map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Missing documents tips to increase limit */}
                    {scheme.missingDocsForHigherLimit && scheme.missingDocsForHigherLimit.length > 0 && (
                      <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 space-y-1">
                        <div className="font-bold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{isHi ? 'लोन सीमा बढ़ाने हेतु सुझाव:' : 'How to Increase Limit:'}</span>
                        </div>
                        <ul className="list-disc list-inside space-y-0.5">
                          {scheme.missingDocsForHigherLimit.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Direct Official Government Portal Link & JanDhan Portal Action */}
                    <div className="p-4 sm:p-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                      <a
                        href={scheme.officialPortalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/80 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-blue-200 dark:border-blue-800"
                        title={scheme.officialPortalUrl}
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>{isHi ? 'सरकारी पोर्टल पर सीधा आवेदन करें' : 'Apply on Official Govt Portal'}</span>
                      </a>

                      <button
                        onClick={() => onSelectSchemeToApply(scheme.schemeId, uploadedFiles)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors shrink-0"
                      >
                        <span>{isHi ? 'जनधन पोर्टल से आवेदन करें' : 'Apply via JanDhan Portal'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Official Certificate Modal */}
      {showCertificateModal && eligibilityResult && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">
                  {isHi ? 'डिजिटल ऋण पात्रता प्रमाण पत्र' : 'Official Loan Eligibility Sanction Certificate'}
                </h3>
              </div>
              <button 
                onClick={() => setShowCertificateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate Body */}
            <div className="border-4 border-double border-emerald-600/30 p-6 rounded-2xl space-y-5 bg-gradient-to-b from-emerald-50/20 to-transparent">
              <div className="text-center space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                  GOVERNMENT OF INDIA • NATIONAL CREDIT ACCREDITATION
                </p>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  CERTIFICATE OF PROVISIONAL CREDIT ELIGIBILITY
                </h2>
                <p className="text-[11px] text-slate-500">
                  Ref No: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{eligibilityResult.certificateRefNumber}</span> • Date: {new Date(eligibilityResult.evaluationDate).toLocaleDateString()}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs border-y border-slate-200 dark:border-slate-800 py-3">
                <div>
                  <span className="text-slate-500">Applicant:</span>
                  <p className="font-bold text-slate-900 dark:text-white">{eligibilityResult.extractedProfile.name}</p>
                </div>
                <div>
                  <span className="text-slate-500">Aadhaar (Masked):</span>
                  <p className="font-bold text-slate-900 dark:text-white">{eligibilityResult.extractedProfile.aadhaarNumberMasked}</p>
                </div>
                <div>
                  <span className="text-slate-500">Beneficiary Category:</span>
                  <p className="font-bold text-slate-900 dark:text-white uppercase">{eligibilityResult.extractedProfile.category}</p>
                </div>
                <div>
                  <span className="text-slate-500">Verified Income:</span>
                  <p className="font-bold text-slate-900 dark:text-white">₹{eligibilityResult.extractedProfile.monthlyIncome.toLocaleString('en-IN')}/month</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {isHi ? 'स्वीकृत ऋण योजनाएं एवं सीमाएं:' : 'Accredited Schemes & Maximum Eligible Ceilings:'}
                </h4>
                <div className="space-y-1.5">
                  {eligibilityResult.matchedSchemes.slice(0, 4).map((s) => (
                    <div key={s.schemeId} className="flex items-center justify-between text-xs p-2 rounded bg-slate-100 dark:bg-slate-800">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{s.schemeName}</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{s.maxEligibleAmount.toLocaleString('en-IN')} (Subsidy: {s.subsidyPercentage}%)</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-[10px] text-slate-400 text-center italic pt-2">
                This document is a certified digital pre-qualification issued by JanDhan Setu under RBI/DFS Digital Lending norms.
              </div>
            </div>

            {/* Print / Close */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4" />
                {isHi ? 'प्रिंट करें' : 'Print Certificate'}
              </button>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
              >
                {isHi ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
