import React, { useState, useEffect } from 'react';
import { 
  Navbar 
} from './components/Navbar';
import { 
  SchemeCatalog 
} from './components/SchemeCatalog';
import { 
  LoanCalculator 
} from './components/LoanCalculator';
import { 
  LoanApplicationForm 
} from './components/LoanApplicationForm';
import { 
  ApplicationTracker 
} from './components/ApplicationTracker';
import { 
  AdminDashboard 
} from './components/AdminDashboard';
import { 
  AadhaarAuthModal 
} from './components/AadhaarAuthModal';
import { 
  AuthModal 
} from './components/AuthModal';
import { 
  BiometricVerificationModal 
} from './components/BiometricVerificationModal';
import { 
  PaymentModal 
} from './components/PaymentModal';
import { 
  UserProfileModal 
} from './components/UserProfileModal';
import { 
  NotificationDrawer 
} from './components/NotificationDrawer';
import { 
  AIChatbot 
} from './components/AIChatbot';
import { 
  DocumentEligibilityChecker 
} from './components/DocumentEligibilityChecker';
import { 
  SupportedLanguage, 
  UserProfile, 
  Scheme, 
  LoanApplication, 
  PushNotification, 
  BiometricRecord,
  ApplicationStatus
} from './types';
import { SCHEMES_DATA } from './data/schemes';
import { ShieldCheck, Lock, PhoneCall, HelpCircle, ArrowRight, ExternalLink } from 'lucide-react';

export default function App() {
  // State: Language & Theme
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('hi');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // State: Navigation Tabs & Admin Toggle
  const [activeTab, setActiveTab] = useState<'schemes' | 'applications' | 'calculator' | 'eligibility' | 'admin'>('schemes');
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('jandhan_is_admin') === 'true' || sessionStorage.getItem('jandhan_admin_auth') === 'true';
  });

  // Keep admin status synced in localStorage
  useEffect(() => {
    localStorage.setItem('jandhan_is_admin', isAdmin ? 'true' : 'false');
  }, [isAdmin]);

  // State: User Profile (Aadhaar based)
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const savedStr = localStorage.getItem('jandhan_user_profile');
      if (savedStr) {
        const saved = JSON.parse(savedStr);
        if (saved.fullName) {
          return {
            aadhaarNumber: saved.aadhaarNumber || '987654321098',
            fullName: saved.fullName,
            dob: saved.dob || '1988-04-15',
            gender: saved.gender || 'Male',
            phone: saved.phone || '+91 98765 43210',
            email: saved.email || 'user@example.com',
            address: saved.address || 'Verified Address',
            state: saved.state || 'Uttar Pradesh',
            pincode: saved.pincode || '243001',
            category: saved.category || 'general',
            photoUrl: saved.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            creditScore: saved.creditScore || 785,
            isAadhaarVerified: true,
            biometricVerified: true,
            kycTier: 'Tier-3',
          };
        }
      }
    } catch (e) {
      console.warn('Could not restore user from localStorage:', e);
    }
    return {
      aadhaarNumber: '987654321098',
      fullName: 'Ramesh Kumar Verma',
      dob: '1985-06-12',
      gender: 'Male',
      phone: '+91 98765 43210',
      email: 'ramesh.verma@example.com',
      address: 'H.No 45, Ambedkar Nagar, Bareilly',
      state: 'Uttar Pradesh',
      pincode: '243001',
      category: 'sc_st',
      photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      creditScore: 775,
      isAadhaarVerified: true,
      biometricVerified: true,
      kycTier: 'Tier-3',
    };
  });

  const DEFAULT_APPLICATIONS: LoanApplication[] = [
    {
      id: 'app-demo-1',
      trackingId: 'APP-2026-89421',
      applicantAadhaar: '987654321098',
      applicantPan: 'ABCDE1234F',
      applicantName: 'Ramesh Kumar Verma',
      applicantPhone: '+91 98765 43210',
      applicantEmail: 'ramesh.verma@example.com',
      applicantState: 'Uttar Pradesh',
      applicantCategory: 'sc_st',
      bankDetails: {
        accountNo: '987654321098',
        ifsc: 'SBIN0001234',
        bankName: 'State Bank of India',
      },
      schemeId: 'pmegp-2026',
      schemeName: 'Prime Minister Employment Generation Programme (PMEGP)',
      category: 'sarkari_loan',
      requestedAmount: 1750000,
      tenureMonths: 84,
      monthlyEmi: 27500,
      interestRate: 8.5,
      purpose: 'Setting up rural handloom & textile manufacturing unit',
      appliedDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: 'submitted',
      documents: [
        {
          id: 'doc-1-1',
          type: 'aadhaar',
          name: 'Aadhaar Card (UIDAI Verified)',
          fileName: 'aadhaar_ramesh_verma.pdf',
          fileSize: '1.2 MB',
          uploadDate: new Date().toISOString(),
          status: 'valid',
        },
        {
          id: 'doc-1-2',
          type: 'pan',
          name: 'PAN Card (NSDL Verified)',
          fileName: 'pan_ramesh_verma.jpg',
          fileSize: '850 KB',
          uploadDate: new Date().toISOString(),
          status: 'valid',
        },
        {
          id: 'doc-1-3',
          type: 'caste_cert',
          name: 'SC/ST Caste Certificate (35% Subsidy)',
          fileName: 'caste_cert_sc.pdf',
          fileSize: '1.4 MB',
          uploadDate: new Date().toISOString(),
          status: 'valid',
        },
        {
          id: 'doc-1-4',
          type: 'bank_statement',
          name: 'Bank Statement (6 Months)',
          fileName: 'bank_statement_sbi.pdf',
          fileSize: '2.8 MB',
          uploadDate: new Date().toISOString(),
          status: 'valid',
        },
      ],
      biometric: {
        isVerified: true,
        type: 'face',
        faceMatchScore: 98.7,
        token: 'BIO-FACE-SHA256-7E9A34B8C1',
      },
    },
    {
      id: 'app-demo-2',
      trackingId: 'APP-2026-64192',
      applicantAadhaar: '876543210987',
      applicantPan: 'BKPVR9931K',
      applicantName: 'Sunita Devi',
      applicantPhone: '+91 98123 45678',
      applicantEmail: 'sunita.devi@example.com',
      applicantState: 'Bihar',
      applicantCategory: 'women',
      bankDetails: {
        accountNo: '876543210987',
        ifsc: 'PUNB0012300',
        bankName: 'Punjab National Bank',
      },
      schemeId: 'pm-vishwakarma-2026',
      schemeName: 'PM Vishwakarma Artisan Credit',
      category: 'chota_loan',
      requestedAmount: 200000,
      tenureMonths: 30,
      monthlyEmi: 7100,
      interestRate: 5.0,
      purpose: 'Modern tailoring & embroidery machinery expansion',
      appliedDate: new Date(Date.now() - 3600000).toISOString(),
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      status: 'under_review',
      documents: [
        {
          id: 'doc-2-1',
          type: 'aadhaar',
          name: 'Aadhaar Card (UIDAI Verified)',
          fileName: 'aadhaar_sunita_devi.pdf',
          fileSize: '1.1 MB',
          uploadDate: new Date().toISOString(),
          status: 'valid',
        },
        {
          id: 'doc-2-2',
          type: 'pan',
          name: 'PAN Card',
          fileName: 'pan_sunita_devi.jpg',
          fileSize: '790 KB',
          uploadDate: new Date().toISOString(),
          status: 'valid',
        },
        {
          id: 'doc-2-3',
          type: 'business_proof',
          name: 'PM Vishwakarma Artisan Certificate',
          fileName: 'artisan_cert.pdf',
          fileSize: '950 KB',
          uploadDate: new Date().toISOString(),
          status: 'valid',
        },
      ],
      biometric: {
        isVerified: true,
        type: 'face',
        faceMatchScore: 99.2,
        token: 'BIO-FACE-SHA256-8A1192',
      },
    },
    {
      id: 'app-demo-3',
      trackingId: 'APP-2026-31057',
      applicantAadhaar: '765432109876',
      applicantPan: 'CPWPA4321M',
      applicantName: 'Harish Chandra Patel',
      applicantPhone: '+91 97234 56789',
      applicantEmail: 'harish.patel@example.com',
      applicantState: 'Uttar Pradesh',
      applicantCategory: 'general',
      bankDetails: {
        accountNo: '765432109876',
        ifsc: 'BARB0VARANA',
        bankName: 'Bank of Baroda',
      },
      schemeId: 'kcc-2026',
      schemeName: 'Kisan Credit Card (KCC 4% Interest)',
      category: 'agriculture_loan',
      requestedAmount: 300000,
      tenureMonths: 12,
      monthlyEmi: 25500,
      interestRate: 4.0,
      purpose: 'Subsidized crop production & drip irrigation setup',
      appliedDate: new Date(Date.now() - 7200000).toISOString(),
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      status: 'sanctioned',
      documents: [
        {
          id: 'doc-3-1',
          type: 'aadhaar',
          name: 'Aadhaar Card',
          fileName: 'aadhaar_harish_patel.pdf',
          fileSize: '1.3 MB',
          uploadDate: new Date().toISOString(),
          status: 'valid',
        },
        {
          id: 'doc-3-2',
          type: 'income_proof',
          name: 'Land Khatiyan / Khasra-Khatauni Record',
          fileName: 'land_khasra_khatauni.pdf',
          fileSize: '3.1 MB',
          uploadDate: new Date().toISOString(),
          status: 'valid',
        },
      ],
      biometric: {
        isVerified: true,
        type: 'face',
        faceMatchScore: 97.9,
        token: 'BIO-FACE-SHA256-4B9910',
      },
    },
  ];

  // State: Schemes & Applications
  const [schemes, setSchemes] = useState<Scheme[]>(SCHEMES_DATA);
  const [applications, setApplications] = useState<LoanApplication[]>(() => {
    try {
      const savedStr = localStorage.getItem('jandhan_applications_store');
      if (savedStr) {
        const parsed = JSON.parse(savedStr);
        if (parsed.length > 0) return parsed;
      }
    } catch (e) {}
    localStorage.setItem('jandhan_applications_store', JSON.stringify(DEFAULT_APPLICATIONS));
    return DEFAULT_APPLICATIONS;
  });
  const [selectedSchemeForApply, setSelectedSchemeForApply] = useState<Scheme | null>(null);
  const [prefillCalcAmount, setPrefillCalcAmount] = useState<number | undefined>();
  const [prefillCalcTenure, setPrefillCalcTenure] = useState<number | undefined>();

  // State: Biometrics Record
  const [biometricRecord, setBiometricRecord] = useState<BiometricRecord | null>({
    isVerified: true,
    type: 'face',
    verifiedAt: new Date().toISOString(),
    faceMatchScore: 98.7,
    token: 'BIO-FACE-SHA256-7E9A34B8C1',
  });

  // State: Modals
  const [isAadhaarModalOpen, setIsAadhaarModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot' | 'aadhaar'>('login');
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [appForPayment, setAppForPayment] = useState<LoanApplication | null>(null);

  // State: Push Notifications
  const [notifications, setNotifications] = useState<PushNotification[]>([
    {
      id: 'notif-1',
      title: 'Aadhaar e-KYC Active',
      message: 'Your demographic and biometric records are linked securely with 256-bit encryption.',
      timestamp: new Date().toISOString(),
      read: false,
      type: 'biometric',
    },
    {
      id: 'notif-2',
      title: '35% Subsidy Eligible',
      message: 'Under SC/ST category, you are eligible for up to ₹17.5 Lakh subsidy under PMEGP scheme.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
      type: 'system',
    },
  ]);

  // Synchronize Dark Mode on HTML document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Dynamic Browser Tab Title Update (Shekhar Finance Portal)
  useEffect(() => {
    if (isAdmin) {
      document.title = 'Nodal Credit Governance Dashboard | Shekhar Finance';
    } else if (activeTab === 'applications') {
      document.title = 'Loan Application Status & DBT Tracking | Shekhar Finance';
    } else if (activeTab === 'calculator') {
      document.title = 'Smart EMI & Capital Subsidy Calculator | Shekhar Finance';
    } else if (activeTab === 'eligibility') {
      document.title = 'AI Document & Credit Subsidy Eligibility Checker | Shekhar Finance';
    } else if (activeTab === 'admin') {
      document.title = 'Nodal Credit Governance Dashboard | Shekhar Finance';
    } else {
      document.title = 'Shekhar Finance | National Digital Banking & Credit Portal (shekharfinance.com)';
    }
  }, [activeTab, isAdmin]);

  // Load backend data (Schemes & Applications)
  const fetchBackendData = async () => {
    try {
      // Load Schemes
      const schemesRes = await fetch('/api/schemes');
      const schemesData = await schemesRes.json();
      if (schemesData.success && schemesData.data?.length > 0) {
        setSchemes(schemesData.data);
      }

      // Load Applications
      const appsRes = await fetch('/api/applications');
      const appsData = await appsRes.json();
      if (appsData.success && appsData.data) {
        setApplications(appsData.data);
      }
    } catch (err) {
      console.warn('Backend fetch note:', err);
    }
  };

  useEffect(() => {
    fetchBackendData();
  }, []);

  // Search log dispatcher (communicates with backend to log and check moderation)
  const handleSearchLog = async (query: string, resultsCount: number) => {
    if (query.trim()) {
      try {
        const newSearchLog = {
          id: `search-log-${Date.now()}`,
          query: query.trim(),
          timestamp: new Date().toISOString(),
          resultsCount,
          isBlocked: false,
          userIp: '106.210.45.12 (User Active Session)',
        };
        const existingStr = localStorage.getItem('jandhan_search_logs');
        const existing = existingStr ? JSON.parse(existingStr) : [];
        localStorage.setItem('jandhan_search_logs', JSON.stringify([newSearchLog, ...existing]));
      } catch (e) {}
    }

    try {
      const res = await fetch('/api/searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, resultsCount }),
      });
      const data = await res.json();
      return data;
    } catch (err) {
      return { isBlocked: false };
    }
  };

  // Update application status (Admin handler)
  const handleUpdateAppStatus = async (
    appId: string,
    status: ApplicationStatus,
    remarks?: string,
    rejectionReason?: string
  ) => {
    setApplications((prev) => {
      const updated = prev.map((a) =>
        a.id === appId
          ? {
              ...a,
              status,
              rejectionReason: rejectionReason || a.rejectionReason,
              statusTimeline: [
                ...(a.statusTimeline || []),
                { stage: status, timestamp: new Date().toISOString(), remarks: remarks || `Status changed to ${status}` },
              ],
            }
          : a
      );
      try {
        localStorage.setItem('jandhan_applications_store', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    const newNotif: PushNotification = {
      id: `notif-${Date.now()}`,
      title: `Application Status: ${status.toUpperCase()}`,
      message: rejectionReason
        ? `Application update: Rejected - ${rejectionReason}`
        : remarks || `Status changed to ${status}`,
      timestamp: new Date().toISOString(),
      read: false,
      type: status === 'sanctioned' ? 'sanction' : status === 'rejected' ? 'reject' : 'system',
      applicationId: appId,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    try {
      await fetch(`/api/applications/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, remarks, rejectionReason }),
      });
    } catch (err) {
      console.warn('Backend API status patch unavailable, updated locally:', err);
    }
  };

  // On successful loan application submission
  const handleApplicationSubmitSuccess = (newApp: LoanApplication) => {
    setApplications((prev) => {
      const updated = [newApp, ...prev];
      try {
        localStorage.setItem('jandhan_applications_store', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setSelectedSchemeForApply(null);
    setActiveTab('applications');
    setActiveTab('applications');

    // Update active user profile and localStorage with applicant details
    if (newApp.applicantName) {
      const updatedUser: UserProfile = {
        aadhaarNumber: newApp.applicantAadhaar || '987654321098',
        fullName: newApp.applicantName,
        dob: '1988-04-15',
        gender: 'Male',
        phone: newApp.applicantPhone || '+91 98765 43210',
        email: newApp.applicantEmail || 'user@example.com',
        address: 'Verified Address',
        state: newApp.applicantState || 'Uttar Pradesh',
        pincode: '243001',
        category: newApp.applicantCategory || 'general',
        photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        creditScore: 785,
        isAadhaarVerified: true,
        biometricVerified: true,
        kycTier: 'Tier-3',
      };
      setUser(updatedUser);
      localStorage.setItem('jandhan_user_profile', JSON.stringify(updatedUser));
    }

    // Add push notification
    const newNotif: PushNotification = {
      id: `notif-${Date.now()}`,
      title: 'Loan Application Submitted!',
      message: `Your application (${newApp.trackingId}) has entered automated document validation.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'system',
      applicationId: newApp.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Handle payment completion
  const handlePaymentSuccess = (appId: string, txId: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? {
              ...app,
              isFeePaid: true,
              feeTxId: txId,
              timeline: [
                ...(app.timeline || []),
                {
                  stage: 'Stamp Duty Cleared',
                  timestamp: new Date().toISOString(),
                  remarks: `Stamp duty & processing fee cleared via UPI: ${txId}`,
                },
              ],
            }
          : app
      )
    );
    setIsPaymentModalOpen(false);

    // Push notification
    const newNotif: PushNotification = {
      id: `notif-${Date.now()}`,
      title: 'Stamp Duty Paid Successfully',
      message: `Receipt generated for ref ${txId}. Disbursal scheduling initiated.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'payment',
      applicationId: appId,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Add new scheme (Admin feature)
  const handleAddNewScheme = (newScheme: Scheme) => {
    setSchemes((prev) => [newScheme, ...prev]);
    // Broadcast notification to all citizens
    const schemeNotif: PushNotification = {
      id: `notif-${Date.now()}`,
      title: `📢 New Scheme: ${newScheme.name}`,
      message: `Up to ₹${(newScheme.maxAmount / 100000).toFixed(1)} Lakh credit with ${newScheme.subsidyPercentage}% DBT Subsidy launched! Apply online.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'scheme_update',
    };
    setNotifications((prev) => [schemeNotif, ...prev]);
  };

  // Delete scheme (Admin feature)
  const handleDeleteScheme = (schemeId: string) => {
    const targetScheme = schemes.find((s) => s.id === schemeId);
    setSchemes((prev) => prev.filter((s) => s.id !== schemeId));

    // Delete request to backend API
    fetch(`/api/schemes/${schemeId}`, { method: 'DELETE' }).catch(() => {});

    // Broadcast notification to all citizens
    const schemeNotif: PushNotification = {
      id: `notif-${Date.now()}`,
      title: `🚫 Scheme Notice: ${targetScheme?.name || 'Scheme'} Discontinued`,
      message: `The government portal has archived/discontinued this loan scheme.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'scheme_update',
    };
    setNotifications((prev) => [schemeNotif, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-150">
      {/* Navbar Header */}
      <Navbar
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        user={user}
        onOpenLogin={() => {
          setAuthModalMode('login');
          setIsAuthModalOpen(true);
        }}
        onLogout={() => setUser(null)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'admin') setIsAdmin(true);
          else setIsAdmin(false);
        }}
        isAdmin={isAdmin}
        onToggleAdmin={() => {
          const next = !isAdmin;
          setIsAdmin(next);
          setActiveTab(next ? 'admin' : 'schemes');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Wizard Form View (If a scheme is currently being applied for) */}
        {selectedSchemeForApply ? (
          <LoanApplicationForm
            scheme={selectedSchemeForApply}
            user={user}
            onCancel={() => setSelectedSchemeForApply(null)}
            onSubmitSuccess={handleApplicationSubmitSuccess}
            onOpenBiometricModal={() => setIsBiometricModalOpen(true)}
            biometricRecord={biometricRecord}
            prefillAmount={prefillCalcAmount}
            prefillTenure={prefillCalcTenure}
            onUpdateUser={setUser}
          />
        ) : activeTab === 'admin' ? (
          <AdminDashboard
            applications={applications}
            schemes={schemes}
            onUpdateAppStatus={handleUpdateAppStatus}
            onRefresh={fetchBackendData}
            onAddNewScheme={handleAddNewScheme}
            onDeleteScheme={handleDeleteScheme}
            onOpenAuthModal={(m) => {
              setAuthModalMode(m);
              setIsAuthModalOpen(true);
            }}
          />
        ) : activeTab === 'applications' ? (
          <ApplicationTracker
            applications={applications}
            onOpenPayment={(app) => {
              setAppForPayment(app);
              setIsPaymentModalOpen(true);
            }}
            onRefresh={fetchBackendData}
          />
        ) : activeTab === 'eligibility' ? (
          <DocumentEligibilityChecker
            currentLang={currentLang}
            user={user}
            onSelectSchemeToApply={(schemeId) => {
              const matched = schemes.find((s) => s.id === schemeId) || schemes[0];
              setSelectedSchemeForApply(matched);
            }}
            onNavigateToSchemes={() => setActiveTab('schemes')}
          />
        ) : activeTab === 'calculator' ? (
          <LoanCalculator
            currentLang={currentLang}
            onApplyWithConfig={(amt, tenure) => {
              setPrefillCalcAmount(amt);
              setPrefillCalcTenure(tenure);
              // Pick first relevant scheme
              setSelectedSchemeForApply(schemes[0]);
            }}
          />
        ) : (
          <SchemeCatalog
            schemes={schemes}
            currentLang={currentLang}
            onSelectSchemeToApply={(scheme) => setSelectedSchemeForApply(scheme)}
            onSearchLog={handleSearchLog}
            onNavigateToEligibility={() => setActiveTab('eligibility')}
          />
        )}
      </main>

      {/* AI Chatbot Floating Assistant */}
      <AIChatbot currentLang={currentLang} />

      {/* Comprehensive Login / Signup / Forgot Password via OTP Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onAdminSuccess={() => {
          setIsAdmin(true);
          setActiveTab('admin');
          sessionStorage.setItem('jandhan_admin_auth', 'true');
        }}
        onSuccess={(loggedUser) => {
          setIsAdmin(false);
          setUser(loggedUser);
          localStorage.setItem('jandhan_user_profile', JSON.stringify(loggedUser));
          setNotifications((prev) => [
            {
              id: `notif-${Date.now()}`,
              title: 'Login Successful',
              message: `Welcome ${loggedUser.fullName}! You are signed in securely to JanDhan Setu.`,
              timestamp: new Date().toISOString(),
              read: false,
              type: 'system',
            },
            ...prev,
          ]);
        }}
      />

      {/* Aadhaar OTP Auth Modal */}
      <AadhaarAuthModal
        isOpen={isAadhaarModalOpen}
        onClose={() => setIsAadhaarModalOpen(false)}
        onSuccess={(profile) => {
          setUser(profile);
          // Add login notification
          setNotifications((prev) => [
            {
              id: `notif-${Date.now()}`,
              title: 'Aadhaar e-KYC Verified',
              message: `Welcome ${profile.fullName}! You are logged in with biometric authorization.`,
              timestamp: new Date().toISOString(),
              read: false,
              type: 'biometric',
            },
            ...prev,
          ]);
        }}
      />

      {/* Biometric Verification Modal */}
      <BiometricVerificationModal
        isOpen={isBiometricModalOpen}
        onClose={() => setIsBiometricModalOpen(false)}
        onVerified={(bioRec) => {
          setBiometricRecord(bioRec);
          if (user) {
            setUser({ ...user, biometricVerified: true });
          }
        }}
      />

      {/* User Profile & KYC Inspection Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onOpenBiometric={() => setIsBiometricModalOpen(true)}
        onUpdateUser={setUser}
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={(id) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          );
        }}
        onClearAll={() => setNotifications([])}
        onSelectApplication={(appId) => {
          setActiveTab('applications');
        }}
      />

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        application={appForPayment}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Banking & Government Compliance Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-10 px-4 sm:px-6 lg:px-8 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-base font-serif text-slate-900 dark:text-white">
                  JanDhan<span className="text-emerald-600">Setu</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                National Unified Digital Lending Platform enabling Indian citizens to access government loan schemes, capital subsidies, and collateral-free bank credit 100% online from home.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                Government Schemes
              </h4>
              <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                <li>PMEGP 35% Capital Subsidy</li>
                <li>Pradhan Mantri Mudra Yojana (PMMY)</li>
                <li>PM Vishwakarma Artisan Credit</li>
                <li>Kisan Credit Card (KCC 4% Interest)</li>
                <li>Stand-Up India for SC/ST & Women</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                Security & Compliance
              </h4>
              <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                <li className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" /> 256-Bit TLS End-to-End Encryption
                </li>
                <li>UIDAI Aadhaar e-KYC Licensed Gateway</li>
                <li>RBI Digital Lending Guidelines (2022) Compliant</li>
                <li>DPDP Act 2023 Data Privacy Protection</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                Toll-Free Helpline / सहायता
              </h4>
              <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                <p className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600" /> 1800-180-1111 (Toll-Free)
                </p>
                <p>National Portal: support@jandhanloan.gov.in</p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  24x7 AI Sahayak Chatbot available on screen
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>© {new Date().getFullYear()} JanDhan Setu - Digital India Public Infrastructure. All Rights Reserved.</p>
            <div className="flex items-center gap-4">
              <span>Direct Benefit Transfer (DBT)</span>
              <span>•</span>
              <span>National Automated Clearing House</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
