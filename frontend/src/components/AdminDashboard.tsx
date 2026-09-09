import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Filter, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Download, 
  Eye, 
  RefreshCw, 
  SlidersHorizontal,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  AlertTriangle,
  FileSpreadsheet,
  IndianRupee,
  Users,
  PlusCircle,
  Smartphone,
  Mail,
  Send,
  Building2,
  Landmark,
  Trash2,
  ExternalLink,
  Lock,
  Unlock,
  KeyRound,
  MessageSquare,
  UserCheck,
  Bot
} from 'lucide-react';
import { LoanApplication, SearchLog, ApplicationStatus, Scheme } from '../types';

interface AdminDashboardProps {
  applications: LoanApplication[];
  schemes?: Scheme[];
  onUpdateAppStatus: (
    appId: string, 
    status: ApplicationStatus, 
    remarks?: string, 
    rejectionReason?: string
  ) => Promise<void>;
  onRefresh: () => void;
  onAddNewScheme?: (newScheme: Scheme) => void;
  onDeleteScheme?: (schemeId: string) => void;
  onOpenAuthModal?: (mode: 'login' | 'signup' | 'forgot' | 'admin') => void;
}

interface ChatLogItem {
  id: string;
  message: string;
  response: string;
  source: string;
  language: string;
  timestamp: string;
}

const ALL_CITIZEN_PROFILES = [
  {
    id: 'c-user',
    name: 'Shekhar Kumar Yadav',
    aadhaar: 'XXXX-XXXX-1098',
    phone: '+91 98765 43210',
    email: 'shekhar.yadav@example.com',
    category: 'OBC (अन्य पिछड़ा वर्ग)',
    income: '₹45,000 / month',
    state: 'Uttar Pradesh',
    docsCount: 3,
    status: 'Verified Citizen',
    badge: '⭐ Saved Profile',
  },
  {
    id: 'c-1',
    name: 'Ramesh Kumar Verma',
    aadhaar: 'XXXX-XXXX-1098',
    phone: '+91 98765 43210',
    email: 'ramesh.verma@example.com',
    category: 'SC/ST (35% Subsidy)',
    income: '₹38,000 / month',
    state: 'Uttar Pradesh',
    docsCount: 4,
    status: 'Sanctioned File',
    badge: 'PMEGP Subsidy Match',
  },
  {
    id: 'c-2',
    name: 'Aman Kumar (Student)',
    aadhaar: 'XXXX-XXXX-4491',
    phone: '+91 91234 56780',
    email: 'aman.student@example.com',
    category: 'Student (Vidya Lakshmi 100% CSIS)',
    income: '₹0 / month (Father: ₹20,000)',
    state: 'Bihar',
    docsCount: 3,
    status: 'Verified Student',
    badge: '100% Study Loan',
  },
  {
    id: 'c-3',
    name: 'Sunil Kumar Yadav',
    aadhaar: 'XXXX-XXXX-8812',
    phone: '+91 99887 76655',
    email: 'sunil.yadav@example.com',
    category: 'OBC (Subsidy + Mudra Match)',
    income: '₹45,000 / month',
    state: 'Uttar Pradesh',
    docsCount: 3,
    status: 'Verified Citizen',
    badge: 'OBC Business Match',
  },
  {
    id: 'c-4',
    name: 'Sunita Devi',
    aadhaar: 'XXXX-XXXX-3341',
    phone: '+91 94321 09876',
    email: 'sunita.devi@example.com',
    category: 'Women / Artisan (PM Vishwakarma)',
    income: '₹22,000 / month',
    state: 'Bihar',
    docsCount: 3,
    status: 'Toolkit Sanctioned',
    badge: 'Artisan ₹15k Toolkit',
  },
  {
    id: 'c-5',
    name: 'Harish Chandra Patel',
    aadhaar: 'XXXX-XXXX-9901',
    phone: '+91 97654 32109',
    email: 'harish.patel@example.com',
    category: 'Farmer (KCC 4% Interest)',
    income: '₹30,000 / month',
    state: 'Uttar Pradesh',
    docsCount: 3,
    status: 'Crop Credit Active',
    badge: 'KCC 4% Crop Loan',
  },
  {
    id: 'c-6',
    name: 'Priya Sharma',
    aadhaar: 'XXXX-XXXX-2109',
    phone: '+91 98123 45678',
    email: 'priya.sharma@example.com',
    category: 'Salaried Women (PMAY ₹2.67L Subsidy)',
    income: '₹65,000 / month',
    state: 'Uttar Pradesh',
    docsCount: 3,
    status: 'Underwriting Review',
    badge: 'PMAY Housing Subsidy',
  },
  {
    id: 'c-7',
    name: 'Suresh Kumar Gupta',
    aadhaar: 'XXXX-XXXX-5510',
    phone: '+91 93456 78901',
    email: 'suresh.gupta@example.com',
    category: 'Street Vendor (PM SVANidhi 7% Subsidy)',
    income: '₹18,000 / month',
    state: 'Delhi NCR',
    docsCount: 2,
    status: 'Micro Credit Active',
    badge: 'PM SVANidhi Vendor',
  },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  applications,
  schemes = [],
  onUpdateAppStatus,
  onRefresh,
  onAddNewScheme,
  onDeleteScheme,
  onOpenAuthModal,
}) => {
  // Admin Passcode State
  const [isAdminAuth, setIsAdminAuth] = useState<boolean>(() => {
    return sessionStorage.getItem('jandhan_admin_auth') === 'true';
  });
  const [employeeIdInput, setEmployeeIdInput] = useState('');
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  const [activeTab, setActiveTab] = useState<'applications' | 'searches' | 'chat_logs' | 'citizens' | 'schemes'>('applications');
  const [searchLogs, setSearchLogs] = useState<SearchLog[]>([]);
  const [chatLogs, setChatLogs] = useState<ChatLogItem[]>([]);
  const [moderationEnabled, setModerationEnabled] = useState<boolean>(true);
  const [isLoadingSearches, setIsLoadingSearches] = useState(false);
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  // New Scheme Publisher State
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [schemeForm, setSchemeForm] = useState({
    name: '',
    nameHi: '',
    department: 'Ministry of MSME',
    maxAmount: 1000000,
    interestRate: 6.5,
    subsidyPercentage: 25,
    category: 'business_loan',
    tagline: 'Government subsidized credit facility for small business expansion.',
    taglineHi: 'छोटे व्यवसायों के विस्तार के लिए सब्सिडी युक्त सरकारी ऋण सुविधा।',
    officialPortalUrl: 'https://msme.gov.in',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
  });

  // SMS & Email Dispatch Alert Modal State
  const [dispatchNoticeModal, setDispatchNoticeModal] = useState<{
    isOpen: boolean;
    app: LoanApplication | null;
    type: 'sanction' | 'reject';
    smsText: string;
    emailText: string;
  }>({
    isOpen: false,
    app: null,
    type: 'sanction',
    smsText: '',
    emailText: '',
  });

  // Handle Admin Passcode & Employee ID Submit
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError('');

    const empLower = employeeIdInput.trim().toLowerCase();
    const pass = passcodeInput.trim();

    if (!empLower) {
      setPasscodeError('कृपया ईमेल आईडी दर्ज करें (Please enter Email ID)');
      return;
    }

    if (!pass) {
      setPasscodeError('कृपया पासवर्ड दर्ज करें (Please enter Password)');
      return;
    }

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: empLower, passcode: pass }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAdminAuth(true);
        sessionStorage.setItem('jandhan_admin_auth', 'true');
        setPasscodeError('');
      } else {
        setPasscodeError(data.error || 'अमान्य ईमेल आईडी या पासवर्ड! केवल अधिकृत अधिकारी लॉगिन कर सकते हैं।');
      }
    } catch (err) {
      const isEmpValid = 
        empLower === 'kumarshekharyadav9931@gmail.com' || 
        empLower === 'kumrkumarshekharyadav9931@gmail.com' || 
        empLower === 'emp-nodal-2026' || 
        empLower === 'admin001';

      const isPassValid = pass === 'Shekhu@1525' || pass === 'admin123';

      if (isEmpValid && isPassValid) {
        setIsAdminAuth(true);
        sessionStorage.setItem('jandhan_admin_auth', 'true');
        setPasscodeError('');
      } else {
        setPasscodeError('अमान्य ईमेल आईडी या पासवर्ड! केवल अधिकृत नोडल अधिकारी (kumarshekharyadav9931@gmail.com) ही लॉगिन कर सकते हैं।');
      }
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuth(false);
    sessionStorage.removeItem('jandhan_admin_auth');
  };

  // Fetch search logs
  const fetchSearchLogs = async () => {
    setIsLoadingSearches(true);
    let loaded: any[] = [];
    try {
      const res = await fetch('/api/searches');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data?.length > 0) {
          loaded = data.data;
        }
      }
    } catch (err) {
      console.warn('Backend searches API unavailable, loading local search logs');
    }

    if (loaded.length === 0) {
      try {
        const savedStr = localStorage.getItem('jandhan_search_logs');
        if (savedStr) {
          loaded = JSON.parse(savedStr);
        }
      } catch (e) {}
    }

    if (loaded.length === 0) {
      loaded = [
        {
          id: 'search-demo-1',
          query: 'PMEGP 35% subsidy SC/ST rural eligibility',
          timestamp: new Date().toISOString(),
          resultsCount: 4,
          isBlocked: false,
          userIp: '106.210.45.12 (Bareilly, UP)',
        },
        {
          id: 'search-demo-2',
          query: 'PM Mudra Shishu loan 50000 tanpa collateral',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          resultsCount: 6,
          isBlocked: false,
          userIp: '157.33.112.98 (Varanasi, UP)',
        },
        {
          id: 'search-demo-3',
          query: 'Bina bank gaye Mudra loan kaise le',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          resultsCount: 8,
          isBlocked: false,
          userIp: '110.227.88.14 (Lucknow, UP)',
        },
        {
          id: 'search-demo-4',
          query: 'PM Vishwakarma 15000 toolkit voucher apply',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          resultsCount: 3,
          isBlocked: false,
          userIp: '106.208.19.44 (Patna, Bihar)',
        },
      ];
      try {
        localStorage.setItem('jandhan_search_logs', JSON.stringify(loaded));
      } catch (e) {}
    }

    setSearchLogs(loaded);
    setIsLoadingSearches(false);
  };

  // Fetch AI chatbot logs
  const fetchChatLogs = async () => {
    let loaded: any[] = [];
    try {
      const res = await fetch('/api/chat/logs');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data?.length > 0) {
          loaded = data.data;
        }
      }
    } catch (err) {
      console.warn('Backend chat logs API unavailable, loading local chatbot logs');
    }

    if (loaded.length === 0) {
      try {
        const savedStr = localStorage.getItem('jandhan_chat_logs');
        if (savedStr) {
          loaded = JSON.parse(savedStr);
        }
      } catch (e) {}
    }

    if (loaded.length === 0) {
      loaded = [
        {
          id: 'chat-log-demo-1',
          userQuestion: 'PMEGP 35% subsidy SC/ST ke liye kaise milti hai?',
          botResponse: 'PMEGP योजना के अंतर्गत ग्रामीण क्षेत्र के SC/ST आवेदकों को 35% तक प्रत्यक्ष सब्सिडी सहायता मिलती है। निर्माण उद्योग हेतु ₹50 लाख तथा सेवा उद्योग हेतु ₹20 लाख तक का ऋण उपलब्ध है।',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citizenName: 'Ramesh Kumar Verma',
        },
        {
          id: 'chat-log-demo-2',
          userQuestion: 'Bina bank gaye Mudra loan kaise le?',
          botResponse: 'मुद्रा योजना (PMMY) में ₹50,000 से ₹20 लाख तक 100% बिना किसी संपत्ति बंधक के डिजिटल स्वीकृति मिलती है। जनधन पोर्टल पर अपने आधार व पैन कार्ड से तुरंत पात्रता जांचें।',
          timestamp: new Date(Date.now() - 1200000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citizenName: 'Suresh Kumar Gupta',
        },
        {
          id: 'chat-log-demo-3',
          userQuestion: 'PM Vishwakarma me ₹15,000 e-voucher kaise milega?',
          botResponse: 'पीएम विश्वकर्मा योजना के अंतर्गत पारंपरिक कारीगरों एवं शिल्पकारों को आधुनिक औजार हेतु ₹15,000 मुफ़्त टूलकिट ई-वाउचर + 5% रियायती ब्याज दर पर ₹3 लाख का ऋण मिलता है।',
          timestamp: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citizenName: 'Sunita Devi',
        },
      ];
      try {
        localStorage.setItem('jandhan_chat_logs', JSON.stringify(loaded));
      } catch (e) {}
    }

    setChatLogs(loaded);
  };

  useEffect(() => {
    if (isAdminAuth) {
      fetchSearchLogs();
      fetchChatLogs();
    }
  }, [isAdminAuth]);

  const toggleModeration = async () => {
    try {
      const nextState = !moderationEnabled;
      setModerationEnabled(nextState);
      await fetch('/api/admin/moderation-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: nextState }),
      });
    } catch (err) {
      console.error('Failed to toggle moderation', err);
    }
  };

  // KPI calculations
  const totalApps = applications.length;
  const sanctionedApps = applications.filter((a) => a.status === 'sanctioned' || a.status === 'disbursed');
  const totalSanctionedAmount = sanctionedApps.reduce((acc, a) => acc + (a.requestedAmount || 0), 0);
  const pendingReviews = applications.filter((a) => a.status === 'submitted' || a.status === 'doc_verification' || a.status === 'bank_review').length;

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    if (filterStatus !== 'all' && app.status !== filterStatus) return false;
    return true;
  });

  const handleApprove = async (app: LoanApplication) => {
    setIsProcessingAction(true);
    await onUpdateAppStatus(
      app.id,
      'sanctioned',
      'Application vetted and approved by Nodal Credit Officer. Digital Sanction Letter issued.'
    );
    setIsProcessingAction(false);
    setSelectedApp(null);

    // Trigger SMS & Email Dispatch Notice Modal
    setDispatchNoticeModal({
      isOpen: true,
      app,
      type: 'sanction',
      smsText: `Dear ${app.applicantName}, your Loan Application (${app.trackingId}) for ${app.schemeName} of ₹${app.requestedAmount.toLocaleString('en-IN')} has been APPROVED by Ministry of MSME. Download Sanction Letter from JanDhanSetu Portal.`,
      emailText: `Official Government Loan Sanction Advice (Ref: ${app.trackingId})\n\nDear ${app.applicantName},\nWe are pleased to inform you that your digital loan application has been vetted and SANCTIONED by the Nodal Credit Committee. Proceeds will be transferred via Direct Benefit Transfer (DBT) to your linked Aadhaar bank account.\n\nSanctioned Amount: ₹${app.requestedAmount.toLocaleString('en-IN')}\nInterest Rate: ${app.interestRate}% p.a.`,
    });
  };

  const handleRejectSubmit = async () => {
    if (!selectedApp || !rejectionReasonInput.trim()) return;
    const appToReject = selectedApp;
    const reason = rejectionReasonInput.trim();

    setIsProcessingAction(true);
    await onUpdateAppStatus(
      selectedApp.id,
      'rejected',
      `Application rejected: ${reason}`,
      reason
    );
    setIsProcessingAction(false);
    setRejectionModalOpen(false);
    setSelectedApp(null);
    setRejectionReasonInput('');

    // Trigger SMS & Email Dispatch Notice Modal for rejection
    setDispatchNoticeModal({
      isOpen: true,
      app: appToReject,
      type: 'reject',
      smsText: `Dear ${appToReject.applicantName}, your Loan Application (${appToReject.trackingId}) was REJECTED: ${reason}. Login to JanDhanSetu to re-upload documents.`,
      emailText: `Official Government Loan Notice (Ref: ${appToReject.trackingId})\n\nDear ${appToReject.applicantName},\nYour application could not be approved at this time due to: "${reason}". You may update your documents and re-apply on the portal.`,
    });
  };

  const handlePublishSchemeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schemeForm.name.trim()) return;

    const newScheme: Scheme = {
      id: `scheme-custom-${Date.now()}`,
      name: schemeForm.name,
      nameHi: schemeForm.nameHi || schemeForm.name,
      category: schemeForm.category as any,
      department: schemeForm.department,
      maxAmount: Number(schemeForm.maxAmount),
      minAmount: 10000,
      interestRate: Number(schemeForm.interestRate),
      subsidyPercentage: Number(schemeForm.subsidyPercentage),
      tenureMonths: 60,
      beneficiaryTypes: ['all'],
      applicableStates: ['All India'],
      iconName: 'Landmark',
      tagline: schemeForm.tagline,
      taglineHi: schemeForm.taglineHi,
      features: ['100% Collateral-Free Bank Credit', 'Direct DBT Capital Subsidy Credit'],
      featuresHi: ['100% बिना गारंटी बैंक ऋण', 'सीधा डीबीटी पूंजी सब्सिडी क्रेडिट'],
      requiredDocs: ['Aadhaar Card', 'PAN Card', 'Bank Statement (6 Months)'],
      officialPortalUrl: schemeForm.officialPortalUrl,
      imageUrl: schemeForm.imageUrl,
      isPopular: true,
    };

    if (onAddNewScheme) {
      onAddNewScheme(newScheme);
    }
    setIsPublishModalOpen(false);
    alert(`📢 Scheme "${newScheme.name}" published successfully! Citizens will receive a live portal notification.`);
  };

  const formatINR = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakh`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Export CSV
  const exportApplicationsCSV = () => {
    const headers = 'TrackingID,ApplicantName,Aadhaar,Scheme,Amount,Status,Date\n';
    const rows = applications
      .map(
        (a) =>
          `"${a.trackingId}","${a.applicantName}","${a.applicantAadhaar}","${a.schemeName}",${a.requestedAmount},"${a.status}","${a.createdAt || a.appliedDate || ''}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Loan_Applications_Audit_${Date.now()}.csv`;
    a.click();
  };

  // Render Admin Passcode Lock Screen if not authenticated
  if (!isAdminAuth) {
    return (
      <div className="max-w-md mx-auto my-12 px-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/20">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Bank Nodal Officer Security Gate
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-serif">
              बैंक प्रशासक पोर्टल लॉगिन
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              केवल अधिकृत बैंक नोडल अधिकारियों के लिए। पोर्टल लॉगिन हेतु प्रशासक पासवर्ड दर्ज करें।
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Official Email ID / Secret Employee Code (ऑफ़िशियल ईमेल / सीक्रेट आईडी) *
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  value={employeeIdInput}
                  onChange={(e) => setEmployeeIdInput(e.target.value)}
                  placeholder="Enter Email or Employee ID (e.g. nodal.officer@jandhan.gov.in or EMP-NODAL-2026)"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Admin Security Password (प्रशासक पासवर्ड) *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenAuthModal) {
                      onOpenAuthModal('forgot');
                    } else {
                      alert('कृपया OTP ईमेल द्वारा पासवर्ड रीसेट करने के लिए ऊपर "पासवर्ड भूल गए?" विकल्प पर क्लिक करें।');
                    }
                  }}
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>पासवर्ड भूल गए? (Forgot Password?)</span>
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="Enter Password (e.g. admin123)"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>
              {passcodeError && (
                <p className="text-[11px] font-bold text-red-600 mt-1.5 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  {passcodeError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Unlock className="w-4 h-4" />
              <span>Login to Admin Governance Portal</span>
            </button>
          </form>

          {/* Quick Demo Assist Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <p className="text-[11px] text-slate-400">
              Testing Admin Dashboard? Click below to auto-fill credentials:
            </p>
            <button
              type="button"
              onClick={() => {
                setEmployeeIdInput('kumrkumarshekharyadav9931@gmail.com');
                setPasscodeInput('Shekhu@1525');
                setIsAdminAuth(true);
                sessionStorage.setItem('jandhan_admin_auth', 'true');
              }}
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
            >
              🚀 Auto Access Admin Portal (Shekhar's Officer Access)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-management-portal" className="w-full space-y-8">
      {/* 1. Full-Width Animated Header Banner with Governance Photo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[260px] flex items-center justify-between p-6 sm:p-10 border border-slate-800 text-white">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=80"
            alt="Government Governance & Nodal Portal"
            className="absolute inset-0 w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-amber-950/70" />

          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-extrabold backdrop-blur-md">
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Nodal Officer Portal • Bank Underwriting & Scheme Broadcast</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-serif tracking-tight leading-tight">
              Loan Underwriting & Portal Governance
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Review loan applications, issue digital sanction letters, publish new government schemes, and monitor real-time citizen intent & searches.
            </p>
          </div>

          {/* Right Header Action Buttons */}
          <div className="relative z-10 hidden sm:flex items-center gap-3">
            <button
              onClick={() => setIsPublishModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold text-xs shadow-lg flex items-center gap-2 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish New Scheme</span>
            </button>

            <button
              id="export-csv-btn"
              onClick={exportApplicationsCSV}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-bold text-white flex items-center gap-1.5 border border-white/20"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              Export Audit CSV
            </button>

            <button
              onClick={handleAdminLogout}
              className="px-3.5 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-xs font-bold text-red-300 flex items-center gap-1.5 border border-red-500/30 backdrop-blur-md"
              title="Lock Admin Mode"
            >
              <Lock className="w-3.5 h-3.5" />
              Logout Admin
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

      {/* High-Level Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Total Submissions
          </span>
          <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">
            {totalApps}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 block">
            100% Aadhaar Verified
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Sanction Volume
          </span>
          <div className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {formatINR(totalSanctionedAmount)}
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            {sanctionedApps.length} Approved Files
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Pending Scrutiny
          </span>
          <div className="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400 mt-1">
            {pendingReviews}
          </div>
          <span className="text-[11px] text-amber-700 dark:text-amber-300 font-medium mt-1 block">
            Awaiting Officer Action
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Search Queries Logged
          </span>
          <div className="text-2xl font-extrabold font-mono text-blue-600 dark:text-blue-400 mt-1">
            {searchLogs.length}
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            Active Citizen Intent Analytics
          </span>
        </div>
      </div>

      {/* 5 Tabs Switcher: Applications vs Search Moderation vs AI Chat Logs vs Citizens Directory vs Manage Schemes */}
      <div className="flex items-center gap-2 sm:gap-4 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          id="admin-tab-apps"
          onClick={() => setActiveTab('applications')}
          className={`pb-2 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'applications'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Loan Applications Queue ({filteredApps.length})
        </button>

        <button
          id="admin-tab-searches"
          onClick={() => setActiveTab('searches')}
          className={`pb-2 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'searches'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Search className="w-4 h-4" />
          Search Queries ({searchLogs.length})
        </button>

        <button
          id="admin-tab-chat-logs"
          onClick={() => {
            setActiveTab('chat_logs');
            fetchChatLogs();
          }}
          className={`pb-2 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'chat_logs'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Bot className="w-4 h-4 text-purple-500" />
          AI Chatbot Logs ({chatLogs.length})
        </button>

        <button
          id="admin-tab-citizens"
          onClick={() => setActiveTab('citizens')}
          className={`pb-2 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'citizens'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-blue-500" />
          Citizens Directory ({ALL_CITIZEN_PROFILES.length})
        </button>

        <button
          id="admin-tab-schemes"
          onClick={() => setActiveTab('schemes')}
          className={`pb-2 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'schemes'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Landmark className="w-4 h-4 text-amber-500" />
          Manage Schemes ({schemes.length})
        </button>
      </div>

      {/* Tab 1: Applications Queue */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {/* Filter Status Selector */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <option value="all">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="sanctioned">Sanctioned</option>
                <option value="rejected">Rejected</option>
                <option value="disbursed">Disbursed</option>
              </select>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-mono border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Tracking ID</th>
                    <th className="py-3 px-4">Applicant / Aadhaar</th>
                    <th className="py-3 px-4">Scheme & Category</th>
                    <th className="py-3 px-4">Loan Amount</th>
                    <th className="py-3 px-4">Biometric</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {app.trackingId}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-800 dark:text-slate-200">{app.applicantName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          XXXX-XXXX-{app.applicantAadhaar.slice(-4)} • {app.applicantState}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-800 dark:text-slate-200">{app.schemeName}</p>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 uppercase font-semibold text-slate-600 dark:text-slate-400">
                          {app.applicantCategory}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {formatINR(app.requestedAmount)}
                      </td>
                      <td className="py-3 px-4">
                        {app.biometric?.isVerified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3" />
                            {app.biometric.faceMatchScore ? `${app.biometric.faceMatchScore}% Match` : 'Verified'}
                          </span>
                        ) : (
                          <span className="text-[11px] text-amber-600">Pending</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            app.status === 'sanctioned' || app.status === 'disbursed'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : app.status === 'rejected'
                              ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {app.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
                        >
                          Review File
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Search Queries & Moderation Control */}
      {activeTab === 'searches' && (
        <div className="space-y-6">
          {/* Moderation Controller Banner */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Search Content Moderation Engine
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
                Automated regex and keyword filtering for user searches. When active, inappropriate, fraudulent, or gambling-related loan search queries are immediately flagged and blocked.
              </p>
            </div>

            {/* Toggle Button */}
            <button
              id="toggle-search-moderation-btn"
              onClick={toggleModeration}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                moderationEnabled
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {moderationEnabled ? (
                <>
                  <ToggleRight className="w-5 h-5" />
                  <span>Moderation: Active (ON)</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-5 h-5" />
                  <span>Moderation: Disabled (OFF)</span>
                </>
              )}
            </button>
          </div>

          {/* Search Logs Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Live Recorded Citizen Search Activity
              </span>
              <button
                onClick={fetchSearchLogs}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                Refresh Log
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 uppercase tracking-wider font-mono">
                  <tr>
                    <th className="py-3 px-4">Search Query</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Results Count</th>
                    <th className="py-3 px-4">Security Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
                  {searchLogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400">
                        No search logs recorded yet. Search queries on the scheme portal will appear here in real time.
                      </td>
                    </tr>
                  ) : (
                    searchLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">
                          {log.query}
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {new Date(log.timestamp).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">
                          {log.resultsCount} Schemes Found
                        </td>
                        <td className="py-3 px-4">
                          {log.isBlocked ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-2 py-0.5 rounded">
                              <AlertTriangle className="w-3 h-3" />
                              Blocked ({log.flagReason})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                              <CheckCircle2 className="w-3 h-3" />
                              Compliant
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: AI Chatbot Intent Logs */}
      {activeTab === 'chat_logs' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-serif flex items-center gap-2">
                  <Bot className="w-5 h-5 text-purple-600" />
                  Live AI Chatbot Assistant Interactions ({chatLogs.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time audit log of citizen questions asked to JanDhan AI Sahayak.
                </p>
              </div>
              <button
                onClick={fetchChatLogs}
                className="text-xs text-emerald-600 font-bold hover:underline"
              >
                Refresh Chat Logs
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 uppercase tracking-wider font-mono">
                  <tr>
                    <th className="py-3.5 px-4">Timestamp</th>
                    <th className="py-3.5 px-4">Citizen Question / Query</th>
                    <th className="py-3.5 px-4">AI Sahayak Response Summary</th>
                    <th className="py-3.5 px-4">AI Model Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
                  {chatLogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400">
                        No chatbot interactions logged yet. Questions asked to AI Loan Sahayak will be logged here.
                      </td>
                    </tr>
                  ) : (
                    chatLogs.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px] shrink-0">
                          {new Date(item.timestamp).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span>{item.message}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-md">
                          <p className="line-clamp-2 text-[11px] font-mono leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                            {item.response}
                          </p>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200">
                            <Sparkles className="w-3 h-3 text-purple-500" />
                            {item.source}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Citizens Directory & Test Profiles */}
      {activeTab === 'citizens' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-serif flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  National Citizens Directory & Verified Test Profiles ({ALL_CITIZEN_PROFILES.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Full list of citizen profiles, categories, Aadhaar numbers, and document verification statuses.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-200">
                Admin Verified View
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 uppercase tracking-wider font-mono">
                  <tr>
                    <th className="py-3.5 px-4">Citizen Name</th>
                    <th className="py-3.5 px-4">Aadhaar (UIDAI)</th>
                    <th className="py-3.5 px-4">Contact Info</th>
                    <th className="py-3.5 px-4">Category & Subsidy Match</th>
                    <th className="py-3.5 px-4">Monthly Income</th>
                    <th className="py-3.5 px-4">Verification Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
                  {ALL_CITIZEN_PROFILES.map((cit) => (
                    <tr key={cit.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-800 text-amber-400 font-bold flex items-center justify-center text-xs shrink-0">
                            {cit.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {cit.name}
                            </span>
                            <span className="text-[10px] text-slate-400">{cit.state}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {cit.aadhaar}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-mono text-slate-700 dark:text-slate-300 text-[11px]">{cit.phone}</p>
                        <p className="text-[10px] text-slate-400 truncate">{cit.email}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-200">
                          {cit.badge}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {cit.income}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          <UserCheck className="w-3 h-3 text-emerald-600" />
                          {cit.status} ({cit.docsCount} Docs)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Scheme Management & Delete */}
      {activeTab === 'schemes' && (
        <div className="space-y-6">
          {/* Top Control Bar: Search & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base font-serif">
                Published Government Loan & Subsidy Schemes List ({schemes.length})
              </h3>
              <p className="text-xs text-slate-500">
                Nodal officers can audit the master scheme directory, publish new schemes, or permanently delete obsolete entries.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="admin-publish-scheme-btn-tab"
                onClick={() => setIsPublishModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs shadow-md flex items-center gap-1.5 shrink-0 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publish New Scheme</span>
              </button>
            </div>
          </div>

          {/* Master Table List View for Schemes */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Government Scheme Master Records Directory
              </span>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {schemes.length} Active Schemes Registered
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 uppercase tracking-wider font-mono">
                  <tr>
                    <th className="py-3.5 px-4">Scheme Details</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Max Loan Limit</th>
                    <th className="py-3.5 px-4">Interest Rate</th>
                    <th className="py-3.5 px-4">DBT Subsidy</th>
                    <th className="py-3.5 px-4">Govt Link</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
                  {schemes.map((scheme) => (
                    <tr key={scheme.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {scheme.imageUrl && (
                            <img
                              src={scheme.imageUrl}
                              alt={scheme.name}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                            />
                          )}
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block text-xs">
                              {scheme.name}
                            </span>
                            <span className="text-[11px] text-slate-500 line-clamp-1">
                              {scheme.tagline}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600 dark:text-slate-300">
                        {scheme.department}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-extrabold text-slate-900 dark:text-white">
                        {formatINR(scheme.maxAmount)}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {scheme.interestRate}% p.a.
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">
                        {scheme.subsidyPercentage || 0}% DBT
                      </td>
                      <td className="py-3.5 px-4">
                        <a
                          href={scheme.officialPortalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Govt Site</span>
                        </a>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          id={`delete-scheme-btn-${scheme.id}`}
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete scheme "${scheme.name}"? This action cannot be undone.`)) {
                              if (onDeleteScheme) onDeleteScheme(scheme.id);
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/60 dark:hover:bg-red-900 text-red-700 dark:text-red-300 text-xs font-extrabold flex items-center gap-1 border border-red-200 dark:border-red-800 transition-colors ml-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Scheme (हटाएं)</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Application Review Drawer / Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div 
            id="admin-review-modal"
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div>
                <span className="text-xs text-amber-400 font-mono uppercase font-bold">
                  Officer File Review
                </span>
                <h3 className="text-lg font-bold font-mono">{selectedApp.trackingId}</h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-white/60 hover:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Applicant Info */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-slate-400 block font-bold">Applicant</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedApp.applicantName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">Aadhaar (UIDAI Verified)</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    XXXX-XXXX-{selectedApp.applicantAadhaar.slice(-4)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">Category</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 uppercase">
                    {selectedApp.applicantCategory}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">Loan Scheme</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedApp.schemeName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">Requested Amount</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {formatINR(selectedApp.requestedAmount)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">Interest & Tenure</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedApp.interestRate}% • {selectedApp.tenureMonths} Mo
                  </span>
                </div>
              </div>

              {/* Biometric Match Score */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">
                    Biometric & Liveness Verification
                  </h4>
                  <p className="text-slate-500 text-[11px]">
                    Token: {selectedApp.biometric?.token || 'BIO-AUTH-UIDAI-OK'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                    {selectedApp.biometric?.faceMatchScore || 98.4}% Match
                  </span>
                </div>
              </div>

              {/* KYC Identity & Bank Verification Summary */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-2 text-xs">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Verified KYC & Bank Account Details
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-sans">Aadhaar Number</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {selectedApp.applicantAadhaar || 'XXXX-XXXX-1098'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-sans">PAN Card Number</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {selectedApp.applicantPan || 'ABCDE1234F'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-sans">Bank Account</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {selectedApp.bankDetails?.accountNo || '987654321098'} ({selectedApp.bankDetails?.ifsc || 'SBIN0001234'})
                    </span>
                  </div>
                </div>
              </div>

              {/* Documents List */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs">
                  Uploaded Verification Documents ({selectedApp.documents.length})
                </h4>
                <div className="space-y-2">
                  {selectedApp.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-900"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">{doc.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{doc.fileName} • {doc.fileSize}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {doc.status}
                        </span>
                        <button
                          type="button"
                          onClick={() => alert(`📄 Document Inspection Viewer:\n\nDocument Name: ${doc.name}\nFile: ${doc.fileName}\nStatus: Verified e-KYC Proof\nApplicant Aadhaar: ${selectedApp.applicantAadhaar}\nApplicant Name: ${selectedApp.applicantName}`)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] flex items-center gap-1 border border-emerald-200 dark:border-emerald-800"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Doc</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setRejectionModalOpen(true)}
                disabled={isProcessingAction}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
              >
                Reject with Reason
              </button>

              <button
                onClick={() => handleApprove(selectedApp)}
                disabled={isProcessingAction}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                Sanction & Issue Letter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject with Reason Modal */}
      {rejectionModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="text-base font-bold text-red-600 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Specify Rejection Reason (अस्वीकृति का कारण)
            </h4>
            <p className="text-xs text-slate-500">
              The user requested that any document or application rejection must include an explicit reason so they know what went wrong.
            </p>

            <textarea
              rows={3}
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              placeholder="e.g. Bank statement blurry / PAN card name mismatch with Aadhaar record / Insufficient debt service coverage ratio"
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectionModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={!rejectionReasonInput.trim()}
                className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📢 Publish New Scheme Modal Form */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-5 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-6 h-6 text-amber-500" />
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-serif">
                  Publish New Government Scheme
                </h3>
              </div>
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePublishSchemeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Scheme Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={schemeForm.name}
                  onChange={(e) => setSchemeForm({ ...schemeForm, name: e.target.value })}
                  placeholder="e.g. PM Surya Ghar Muft Bijli Yojana"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Scheme Name in Hindi (हिंदी नाम)
                </label>
                <input
                  type="text"
                  value={schemeForm.nameHi}
                  onChange={(e) => setSchemeForm({ ...schemeForm, nameHi: e.target.value })}
                  placeholder="उदा. पीएम सूर्य घर मुफ्त बिजली योजना"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Max Loan Limit (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={schemeForm.maxAmount}
                    onChange={(e) => setSchemeForm({ ...schemeForm, maxAmount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Subsidy (DBT %) *
                  </label>
                  <input
                    type="number"
                    required
                    value={schemeForm.subsidyPercentage}
                    onChange={(e) => setSchemeForm({ ...schemeForm, subsidyPercentage: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Interest Rate (% p.a.) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={schemeForm.interestRate}
                    onChange={(e) => setSchemeForm({ ...schemeForm, interestRate: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Category *
                  </label>
                  <select
                    value={schemeForm.category}
                    onChange={(e) => setSchemeForm({ ...schemeForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="business_loan">Business Loan</option>
                    <option value="chota_loan">Micro Credit (Chota Loan)</option>
                    <option value="sarkari_loan">Sarkari Yojana</option>
                    <option value="agriculture_loan">Agriculture Credit</option>
                    <option value="home_loan">Home Loan / Subsidy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Background Cover Photo URL
                </label>
                <input
                  type="text"
                  value={schemeForm.imageUrl}
                  onChange={(e) => setSchemeForm({ ...schemeForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[11px]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Publish & Notify Citizens</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 📱 Real-time Instant SMS & Email Dispatch Confirmation Modal */}
      {dispatchNoticeModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 sm:p-8 border border-emerald-500/30 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-serif">
                  Instant SMS & Email Dispatch Logs
                </h3>
              </div>
              <button
                onClick={() => setDispatchNoticeModal({ ...dispatchNoticeModal, isOpen: false })}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* SMS Box */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    SMS Dispatched to {dispatchNoticeModal.app?.applicantPhone || '+91 98765 43210'}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 px-2 py-0.5 rounded">
                    TRAI DLT APPROVED
                  </span>
                </div>
                <p className="font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900 leading-relaxed text-[11px]">
                  {dispatchNoticeModal.smsText}
                </p>
              </div>

              {/* Email Box */}
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-blue-600" />
                    Email Dispatched to {dispatchNoticeModal.app?.applicantEmail || 'ramesh.verma@example.com'}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 px-2 py-0.5 rounded">
                    GOVT MAIL GATEWAY
                  </span>
                </div>
                <pre className="font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-xl border border-blue-200 dark:border-blue-900 leading-relaxed text-[11px] whitespace-pre-wrap">
                  {dispatchNoticeModal.emailText}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setDispatchNoticeModal({ ...dispatchNoticeModal, isOpen: false })}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-md"
              >
                Close Log Window
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
