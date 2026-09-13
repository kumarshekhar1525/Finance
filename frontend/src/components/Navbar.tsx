import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Moon, 
  Sun, 
  Globe, 
  Bell, 
  UserCheck, 
  Lock, 
  Sliders, 
  LayoutDashboard, 
  User, 
  FileText,
  LogOut,
  Sparkles,
  ChevronDown,
  Landmark
} from 'lucide-react';
import { SupportedLanguage, UserProfile, PushNotification } from '../types';
import { languageNames, translations } from '../lib/i18n';

interface NavbarProps {
  currentLang: SupportedLanguage;
  onSelectLang: (lang: SupportedLanguage) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  user: UserProfile | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenProfile: () => void;
  notifications: PushNotification[];
  onOpenNotifications: () => void;
  activeTab: 'schemes' | 'applications' | 'calculator' | 'eligibility' | 'deposits' | 'admin';
  onSelectTab: (tab: 'schemes' | 'applications' | 'calculator' | 'eligibility' | 'deposits' | 'admin') => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  onOpenApplyForm?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onSelectLang,
  isDarkMode,
  onToggleDarkMode,
  user,
  onOpenLogin,
  onLogout,
  onOpenProfile,
  notifications,
  onOpenNotifications,
  activeTab,
  onSelectTab,
  isAdmin,
  onToggleAdmin,
  onOpenApplyForm,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const t = translations[currentLang] || translations.en;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      {/* Tri-color Govt Accent Stripe */}
      <div className="h-1 w-full flex">
        <div className="h-full w-1/3 bg-amber-500"></div>
        <div className="h-full w-1/3 bg-slate-100 dark:bg-slate-800"></div>
        <div className="h-full w-1/3 bg-emerald-600"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & National Brand */}
          <div 
            id="nav-logo-btn"
            onClick={() => onSelectTab('schemes')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 ring-2 ring-emerald-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 dark:text-white font-serif">
                  JanDhan<span className="text-emerald-600 dark:text-emerald-400">Setu</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <Lock className="w-2.5 h-2.5" /> 256-Bit Encrypted
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px] sm:max-w-xs font-medium">
                {t.govSubtitle}
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              id="nav-tab-schemes"
              onClick={() => onSelectTab('schemes')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'schemes' && !isAdmin
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {t.home}
            </button>

            <button
              id="nav-tab-track"
              onClick={() => onSelectTab('applications')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'applications'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              {t.myApplications}
            </button>

            <button
              id="nav-tab-eligibility"
              onClick={() => onSelectTab('eligibility')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'eligibility'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{currentLang === 'hi' ? 'दस्तावेज़ पात्रता चेकर' : 'Check Eligibility'}</span>
            </button>

            <button
              id="nav-tab-deposits"
              onClick={() => onSelectTab('deposits')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'deposits'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Landmark className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{currentLang === 'hi' ? 'बचत व ब्याज योजनाएं' : 'Savings & Deposits'}</span>
            </button>

            <button
              id="nav-tab-calculator"
              onClick={() => onSelectTab('calculator')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'calculator'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Sliders className="w-4 h-4" />
              {t.calculator}
            </button>

            {/* Direct Apply Loan Action Button */}
            <button
              id="nav-apply-loan-btn"
              onClick={() => {
                if (onOpenApplyForm) onOpenApplyForm();
              }}
              className="ml-2 px-3.5 py-2 rounded-lg text-xs font-extrabold bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{currentLang === 'hi' ? '🔵 ऋण आवेदन करें' : '🔵 Apply Loan'}</span>
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                id="language-switcher-btn"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">{languageNames[currentLang]?.native}</span>
                <span className="sm:hidden uppercase">{currentLang}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langMenuOpen && (
                <div 
                  id="language-dropdown-menu"
                  className="absolute right-0 mt-2 w-44 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                >
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Select Language / भाषा
                  </div>
                  {Object.entries(languageNames).map(([key, item]) => (
                    <button
                      key={key}
                      id={`lang-opt-${key}`}
                      onClick={() => {
                        onSelectLang(key as SupportedLanguage);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                        currentLang === key
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <span>{item.native}</span>
                      <span className="text-[11px] text-slate-400">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Push Notifications Bell */}
            <button
              id="notifications-bell-btn"
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {/* User Auth Section */}
            {user ? (
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/40 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    {user.fullName.charAt(0)}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[100px]">
                      {user.fullName.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                      <UserCheck className="w-2.5 h-2.5" /> e-KYC Verified
                    </p>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div 
                    id="user-dropdown-menu"
                    className="absolute right-0 mt-2 w-60 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                  >
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700/60">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.fullName}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Aadhaar: XXXX-XXXX-{user.aadhaarNumber.slice(-4)}
                      </p>
                    </div>

                    <button
                      id="view-profile-btn"
                      onClick={() => {
                        onOpenProfile();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      View KYC Profile & Biometrics
                    </button>

                    <button
                      id="view-my-apps-btn"
                      onClick={() => {
                        onSelectTab('applications');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      My Loan Applications
                    </button>

                    <button
                      id="user-menu-admin-toggle-btn"
                      onClick={() => {
                        onToggleAdmin();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-2 font-bold border-t border-slate-100 dark:border-slate-700/60 mt-1 pt-2"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-amber-500" />
                      <span>{isAdmin ? 'नागरिक पोर्टल पर जाएं' : 'बैंक प्रशासक / एडमिन पोर्टल'}</span>
                    </button>

                    <div className="my-1 border-t border-slate-100 dark:border-slate-700/60" />

                    <button
                      id="logout-btn"
                      onClick={() => {
                        onLogout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      {t.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="navbar-login-btn"
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs sm:text-sm shadow-sm shadow-emerald-700/20 active:scale-98 transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-200" />
                <span>{currentLang === 'hi' ? 'लॉग इन / साइन अप' : 'Login / Sign Up'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 px-4 py-2 flex items-center justify-around text-xs font-semibold">
        <button
          onClick={() => onSelectTab('schemes')}
          className={`px-3 py-1 rounded-md ${
            activeTab === 'schemes' && !isAdmin ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          {t.home}
        </button>
        <button
          onClick={() => onSelectTab('eligibility')}
          className={`px-3 py-1 rounded-md ${
            activeTab === 'eligibility' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          {currentLang === 'hi' ? 'पात्रता' : 'Eligibility'}
        </button>
        <button
          onClick={() => onSelectTab('applications')}
          className={`px-3 py-1 rounded-md ${
            activeTab === 'applications' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          {t.myApplications}
        </button>
        <button
          onClick={() => onSelectTab('calculator')}
          className={`px-3 py-1 rounded-md ${
            activeTab === 'calculator' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          {t.calculator}
        </button>
      </div>
    </header>
  );
};
