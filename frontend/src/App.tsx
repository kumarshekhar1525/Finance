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
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

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

  // State: Schemes & Applications
  const [schemes, setSchemes] = useState<Scheme[]>(SCHEMES_DATA);
  const [applications, setApplications] = useState<LoanApplication[]>([]);
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
    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, remarks, rejectionReason }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setApplications((prev) => prev.map((a) => (a.id === appId ? data.data : a)));

        // Push notification
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
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  // On successful loan application submission
  const handleApplicationSubmitSuccess = (newApp: LoanApplication) => {
    setApplications((prev) => [newApp, ...prev]);
    setSelectedSchemeForApply(null);
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
