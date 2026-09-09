import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Landmark, 
  Coins, 
  Building2, 
  Home, 
  Briefcase, 
  GraduationCap, 
  Sprout, 
  HeartHandshake, 
  ShieldCheck,
  MapPin,
  Users,
  AlertTriangle,
  BadgePercent,
  CheckCircle2,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  Quote,
  Award,
  CreditCard,
  Store,
  Bot
} from 'lucide-react';
import { Scheme, LoanCategory, BeneficiaryFilter, SupportedLanguage } from '../types';
import { INDIAN_STATES, LOAN_CATEGORIES_METADATA } from '../data/schemes';
import { translations } from '../lib/i18n';

interface SchemeCatalogProps {
  schemes: Scheme[];
  currentLang: SupportedLanguage;
  onSelectSchemeToApply: (scheme: Scheme) => void;
  onSearchLog: (query: string, resultsCount: number) => Promise<{ isBlocked?: boolean; flagReason?: string }>;
  onNavigateToEligibility?: () => void;
}

export const SchemeCatalog: React.FC<SchemeCatalogProps> = ({
  schemes,
  currentLang,
  onSelectSchemeToApply,
  onSearchLog,
  onNavigateToEligibility,
}) => {
  const t = translations[currentLang] || translations.en;

  const [selectedCategory, setSelectedCategory] = useState<LoanCategory>('all');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<BeneficiaryFilter>('all');
  const [selectedState, setSelectedState] = useState<string>('All India');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBlockedNotice, setSearchBlockedNotice] = useState<string | null>(null);

  // Carousel State
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const HERO_SLIDES = [
    {
      id: 1,
      title: 'PM Street Vendor\'s AtmaNirbhar Nidhi (PM SVANidhi)',
      titleHi: 'पीएम स्ट्रीट वेंडर्स आत्मनिर्भर निधि (PM SVANidhi)',
      subtitle: 'A SPECIAL MICRO-CREDIT FACILITY FOR STREET VENDORS, KIRANA STORES & SMALL SHOPS',
      subtitleHi: 'रेहड़ी-पटरी, रेस्तरां, दुकानदारों और छोटे कारोबारियों के लिए विशेष सूक्ष्म ऋण सुविधा',
      quote: 'Direct working capital loans up to ₹50,000 with 7% interest subsidy and cashback incentives for digital transactions.',
      quoteHi: 'डिजिटल लेनदेन पर 7% ब्याज सब्सिडी और कैश बैक प्रोत्साहन के साथ ₹50,000 तक का सीधा कार्यशील पूंजी ऋण।',
      bgImage: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1600&auto=format&fit=crop&q=80',
      badgeText: '₹50,000 Collateral-Free Loan',
      badgeTextHi: '₹50,000 बिना गारंटी ऋण',
      categoryTag: 'Urban & Rural Small Vendors',
      categoryTagHi: 'शहरी व ग्रामीण छोटे व्यापारी',
    },
    {
      id: 2,
      title: 'PM Vishwakarma & PMEGP Enterprise Portal',
      titleHi: 'पीएम विश्वकर्मा एवं पीएमईजीपी स्वरोजगार पोर्टल',
      subtitle: 'HOLISTIC SKILL & FINANCIAL SUPPORT FOR TRADITIONAL ARTISANS & CRAFTSMEN',
      subtitleHi: 'पारंपरिक कारीगरों, हस्तशिल्पकारों और छोटे उद्यमों के लिए वित्तीय एवं कौशल सहायता',
      quote: '“Traditionally, crores of \'Vishwakarmas\' who create something by working hard with their hands are the real builders of the country.”',
      quoteHi: '“सदियों से अपने हाथों और हुनर से सृजन करने वाले देश के करोड़ों \'विश्वकर्मा\' ही इस राष्ट्र के सच्चे निर्माता हैं।”',
      author: '— Hon\'ble Prime Minister Shri Narendra Modi',
      authorHi: '— माननीय प्रधानमंत्री श्री नरेंद्र मोदी',
      bgImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1600&auto=format&fit=crop&q=80',
      badgeText: '₹3 Lakh Loan @ 5% Interest + 35% Subsidy',
      badgeTextHi: '₹3 लाख ऋण @ 5% ब्याज + 35% सब्सिडी',
      categoryTag: 'Artisans, Carpenters & Craftsmen',
      categoryTagHi: 'विश्वकर्मा, बढ़ई, बुनकर व कारीगर',
    },
    {
      id: 3,
      title: 'Pradhan Mantri MUDRA & Stand-Up India',
      titleHi: 'प्रधानमंत्री मुद्रा एवं स्टैंड-अप इंडिया ऋण योजना',
      subtitle: 'FUNDING THE UNFUNDED FOR SC/ST, WOMEN & RURAL ENTERPRISES',
      subtitleHi: 'अनुसूचित जाति/जनजाति, महिला व ग्रामीण उद्यमियों के लिए ₹10 लाख से ₹1 करोड़ तक का ऋण',
      quote: 'Turn your small business vision into reality with collateral-free Shishu, Kishor & Tarun loans directly deposited in your JanDhan account.',
      quoteHi: 'अपने छोटे उद्योग के सपने को साकार करें—शिशु, किशोर और तरुण मुद्रा लोन बिना किसी गारंटी के सीधे अपने खाते में पाएं।',
      bgImage: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=1600&auto=format&fit=crop&q=80',
      badgeText: 'Up to ₹1 Crore Business Credit',
      badgeTextHi: '₹1 करोड़ तक व्यापार ऋण',
      categoryTag: 'Farmers, Dairy & Manufacturers',
      categoryTagHi: 'किसान, डेयरी, होटल व उद्योगपति',
    }
  ];

  // Auto slide interval
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, HERO_SLIDES.length]);

  // Category Icon mapper
  const renderCategoryIcon = (catId: string, className = 'w-4 h-4') => {
    switch (catId) {
      case 'sarkari_loan':
        return <Landmark className={className} />;
      case 'chota_loan':
        return <Coins className={className} />;
      case 'bada_loan':
        return <Building2 className={className} />;
      case 'home_loan':
        return <Home className={className} />;
      case 'business_loan':
        return <Briefcase className={className} />;
      case 'study_loan':
        return <GraduationCap className={className} />;
      case 'agriculture_loan':
        return <Sprout className={className} />;
      case 'finance_loan':
        return <HeartHandshake className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchBlockedNotice(null);
      return;
    }

    const filtered = schemes.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nameHi.includes(searchQuery) ||
        s.tagline.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const res = await onSearchLog(searchQuery, filtered.length);
    if (res?.isBlocked) {
      setSearchBlockedNotice(res.flagReason || 'Search query prohibited by Banking Compliance Moderation.');
    } else {
      setSearchBlockedNotice(null);
    }
  };

  // Filter schemes
  const filteredSchemes = schemes.filter((scheme) => {
    // Category match
    if (selectedCategory !== 'all' && scheme.category !== selectedCategory) {
      return false;
    }
    // Beneficiary match
    if (selectedBeneficiary !== 'all') {
      if (!scheme.beneficiaryTypes.includes('all') && !scheme.beneficiaryTypes.includes(selectedBeneficiary)) {
        return false;
      }
    }
    // State match
    if (selectedState !== 'All India') {
      if (!scheme.applicableStates.includes('All India') && !scheme.applicableStates.includes(selectedState)) {
        return false;
      }
    }
    // Search match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        scheme.name.toLowerCase().includes(q) ||
        scheme.nameHi.includes(q) ||
        scheme.tagline.toLowerCase().includes(q) ||
        scheme.department.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const formatINR = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Crore`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakh`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div id="schemes-catalog" className="w-full space-y-8">
      {/* 1. Official Top Marquee Announcement Ticker */}
      <div className="w-full bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white text-xs font-semibold py-2 px-4 flex items-center justify-between shadow-xs">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-3 overflow-hidden">
          <span className="shrink-0 px-2 py-0.5 rounded-md bg-white text-orange-700 font-extrabold text-[10px] uppercase tracking-wider animate-pulse">
            Live Govt Update
          </span>
          <div className="truncate text-xs font-medium">
            {currentLang === 'hi'
              ? 'अद्यतन: पीएम स्वनिधि, पीएम विश्वकर्मा एवं पीएमईजीपी योजना के तहत ₹10 लाख तक के ऋण और 35% डीबीटी सब्सिडी के लिए आधार e-KYC के साथ डायरेक्ट सरकारी पोर्टल पर आवेदन करें।'
              : 'Update: Direct government portal online application live for PM SVANidhi, PM Vishwakarma & PMEGP with instant Aadhaar e-KYC & up to 35% DBT Subsidy credit.'}
          </div>
        </div>
      </div>

      {/* 2. Official Ministry Header Strip (Inspired by PM Vishwakarma & PM SVANidhi) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
          {/* Emblem & Ministry Info */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold shrink-0">
              <Landmark className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold tracking-wider uppercase text-amber-700 dark:text-amber-400 block">
                {currentLang === 'hi' ? 'सूक्ष्म, लघु और मध्यम उद्यम मंत्रालय' : 'MINISTRY OF MICRO, SMALL & MEDIUM ENTERPRISES'}
              </span>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white font-serif">
                {currentLang === 'hi' ? 'जनधन सेतु - राष्ट्रीय डिजिटल ऋण व सब्सिडी पोर्टल' : 'JanDhanSetu - National Digital Loan & Subsidy Portal'}
              </h2>
            </div>
          </div>

          {/* National Badges */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs font-bold text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <Award className="w-4 h-4 text-amber-500" />
              <span>G20 Bharat 2026</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Azadi Ka Amrit Mahotsav</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Full-Screen Background Hero Carousel Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="relative w-full rounded-3xl overflow-hidden shadow-2xl min-h-[520px] sm:min-h-[580px] lg:min-h-[620px] flex flex-col justify-between transition-all duration-700"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Background Image Carousel Layer */}
          {HERO_SLIDES.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={slide.bgImage}
                alt={slide.title}
                className="w-full h-full object-cover object-center scale-105 transition-transform duration-10000 ease-linear"
              />
              {/* Dark Gradient Overlay for Maximum Text Contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/60" />
            </div>
          ))}

          {/* Floating Action Badges (Top Right - PM SVANidhi Portal Style) */}
          <div className="relative z-20 pt-6 px-6 sm:px-10 flex items-center justify-between flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Online • Direct Bank DBT Credit</span>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setSelectedCategory('chota_loan');
                }}
                className="px-3.5 py-1.5 rounded-full bg-orange-600/90 hover:bg-orange-500 text-white text-xs font-bold shadow-lg backdrop-blur-md flex items-center gap-1.5 transition-all hover:scale-105"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Credit Card / Mudra</span>
              </button>

              <button 
                onClick={() => {
                  setSelectedCategory('business_loan');
                }}
                className="px-3.5 py-1.5 rounded-full bg-amber-600/90 hover:bg-amber-500 text-white text-xs font-bold shadow-lg backdrop-blur-md flex items-center gap-1.5 transition-all hover:scale-105"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Street Food & Shops</span>
              </button>

              {onNavigateToEligibility && (
                <button 
                  onClick={onNavigateToEligibility}
                  className="px-3.5 py-1.5 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg backdrop-blur-md flex items-center gap-1.5 transition-all hover:scale-105"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>AI Sahayak</span>
                </button>
              )}
            </div>
          </div>

          {/* Main Hero Slider Content */}
          <div className="relative z-20 px-6 sm:px-12 py-8 my-auto space-y-6 max-w-4xl">
            {/* Category Tag & Badge */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-md">
                {currentLang === 'hi' ? HERO_SLIDES[activeSlide].categoryTagHi : HERO_SLIDES[activeSlide].categoryTag}
              </span>
              <span className="px-3 py-1 rounded-lg bg-amber-500/90 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-md font-mono">
                {currentLang === 'hi' ? HERO_SLIDES[activeSlide].badgeTextHi : HERO_SLIDES[activeSlide].badgeText}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-serif tracking-tight leading-tight drop-shadow-md">
              {currentLang === 'hi' ? HERO_SLIDES[activeSlide].titleHi : HERO_SLIDES[activeSlide].title}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-300 font-semibold tracking-wide uppercase">
              {currentLang === 'hi' ? HERO_SLIDES[activeSlide].subtitleHi : HERO_SLIDES[activeSlide].subtitle}
            </p>

            {/* Quote Card (PM Vishwakarma Portal Style) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white space-y-2 max-w-3xl shadow-xl">
              <div className="flex items-start gap-3">
                <Quote className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
                <div>
                  <p className="text-xs sm:text-sm text-slate-100 italic leading-relaxed">
                    {currentLang === 'hi' ? HERO_SLIDES[activeSlide].quoteHi : HERO_SLIDES[activeSlide].quote}
                  </p>
                  {HERO_SLIDES[activeSlide].author && (
                    <span className="text-xs font-bold text-amber-300 mt-1.5 block">
                      {currentLang === 'hi' ? HERO_SLIDES[activeSlide].authorHi : HERO_SLIDES[activeSlide].author}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Global Search Bar inside Hero Container */}
            <div className="space-y-3 pt-2">
              <form onSubmit={handleSearchSubmit} className="relative max-w-2xl">
                {/* Glowing Gradient Border Ring */}
                <div className="p-[2px] rounded-2xl bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 shadow-xl shadow-emerald-500/20">
                  <div className="relative flex items-center bg-slate-950/90 backdrop-blur-xl rounded-[14px] overflow-hidden">
                    <Search className="absolute left-4 w-5 h-5 text-emerald-400 animate-pulse" />
                    <input
                      id="hero-global-scheme-search"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t.searchPlaceholder}
                      className="w-full pl-12 pr-36 py-4 bg-transparent text-white placeholder-slate-400 focus:outline-hidden text-sm sm:text-base font-medium"
                    />
                    <button
                      id="hero-search-submit-btn"
                      type="submit"
                      className="absolute right-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-500/30 active:scale-95 transition-all flex items-center gap-1.5 border border-emerald-300/40"
                    >
                      <Sparkles className="w-4 h-4 text-slate-950 animate-spin" style={{ animationDuration: '4s' }} />
                      <span>{currentLang === 'hi' ? 'खोजें (Search)' : 'Search'}</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Quick Search Tag Pills */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Quick Tag Search:</span>
                {[
                  { tag: 'PM Vishwakarma', tagHi: 'पीएम विश्वकर्मा' },
                  { tag: '35% Subsidy', tagHi: '35% सब्सिडी' },
                  { tag: 'Kirana & Shops', tagHi: 'किराना व दुकान' },
                  { tag: 'Kisan KCC', tagHi: 'किसान क्रेडिट' },
                  { tag: 'Mudra Loan', tagHi: 'मुद्रा लोन' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSearchQuery(item.tag)}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-white/15 text-[11px] font-bold transition-all backdrop-blur-xs"
                  >
                    ⚡ {currentLang === 'hi' ? item.tagHi : item.tag}
                  </button>
                ))}
              </div>
            </div>

            {searchBlockedNotice && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-xs text-red-200 flex items-center gap-2 max-w-xl">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{searchBlockedNotice}</span>
              </div>
            )}
          </div>

          {/* Hero Bottom Overlay: 4 Quick Action Cards Grid (PM SVANidhi Portal Style) */}
          <div className="relative z-20 p-4 sm:p-6 bg-slate-950/80 backdrop-blur-lg border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Action Card 1: Apply for Loan */}
            <button
              onClick={() => {
                if (schemes.length > 0) onSelectSchemeToApply(schemes[0]);
              }}
              className="p-4 rounded-2xl bg-gradient-to-br from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-left shadow-lg border border-orange-400/30 group transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <FileCheck className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-orange-200 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base">
                {currentLang === 'hi' ? 'ऋण हेतु डायरेक्ट आवेदन करें' : 'Apply for Loan / LoR'}
              </h3>
              <p className="text-[11px] text-orange-100 mt-0.5 line-clamp-1">
                {currentLang === 'hi' ? 'डिजिटल फॉर्म & आधार e-KYC' : 'Collateral-free digital loan application'}
              </p>
            </button>

            {/* Action Card 2: AI Document Eligibility Check */}
            <button
              onClick={() => {
                if (onNavigateToEligibility) onNavigateToEligibility();
              }}
              className="p-4 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 hover:from-emerald-600 hover:to-teal-700 text-white text-left shadow-lg border border-emerald-400/30 group transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <Sparkles className="w-5 h-5 text-emerald-300" />
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base">
                {currentLang === 'hi' ? 'पात्रता की स्थिति जांचें' : 'Check Loan Eligibility'}
              </h3>
              <p className="text-[11px] text-emerald-100 mt-0.5 line-clamp-1">
                {currentLang === 'hi' ? 'दस्तावेज़ अपलोड करें व सब्सिडी जानें' : 'Upload document & get instant match'}
              </p>
            </button>

            {/* Action Card 3: Track Application Status */}
            <button
              onClick={() => {
                const el = document.getElementById('nav-tab-track');
                if (el) el.click();
              }}
              className="p-4 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-white text-left shadow-lg border border-blue-400/30 group transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <Coins className="w-5 h-5 text-blue-200" />
                </div>
                <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base">
                {currentLang === 'hi' ? 'आवेदन स्थिति देखें' : 'Track Application Status'}
              </h3>
              <p className="text-[11px] text-blue-100 mt-0.5 line-clamp-1">
                {currentLang === 'hi' ? 'डीबीटी & बैंक संस्वीकृति अपडेट' : 'Real-time sanction status & DBT track'}
              </p>
            </button>

            {/* Action Card 4: Official Govt Portal Links */}
            <button
              onClick={() => {
                setSelectedCategory('sarkari_loan');
              }}
              className="p-4 rounded-2xl bg-gradient-to-br from-purple-800 to-slate-900 hover:from-purple-700 hover:to-slate-800 text-white text-left shadow-lg border border-purple-400/30 group transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <ExternalLink className="w-5 h-5 text-purple-200" />
                </div>
                <ArrowRight className="w-4 h-4 text-purple-200 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base">
                {currentLang === 'hi' ? 'सरकारी पोर्टल पर आवेदन' : 'Govt Official Portals'}
              </h3>
              <p className="text-[11px] text-purple-100 mt-0.5 line-clamp-1">
                {currentLang === 'hi' ? 'पीएम विश्वकर्मा, स्वनिधि व जन समर्थ' : 'Direct official site links & guidance'}
              </p>
            </button>
          </div>

          {/* Carousel Slider Controls (Left / Right Arrows & Slide Indicators) */}
          <button
            onClick={() => setActiveSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg transition-all"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg transition-all"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slide Indicator Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === activeSlide ? 'w-8 bg-amber-400' : 'w-2 bg-white/50 hover:bg-white'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 4. National Impact Statistics Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 rounded-2xl p-6 text-white border border-emerald-500/20 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">
              ₹1,25,000+ Cr.
            </span>
            <p className="text-xs text-slate-300 font-semibold">
              {currentLang === 'hi' ? 'कुल संस्वीकृत एवं वितरित ऋण' : 'Total Loans Sanctioned & Credit'}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400">
              45 Lakh+
            </span>
            <p className="text-xs text-slate-300 font-semibold">
              {currentLang === 'hi' ? 'लाभान्वित रेहड़ी-पटरी व कारीगर' : 'Beneficiary Craftsmen & Vendors'}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-300">
              100% Digital
            </span>
            <p className="text-xs text-slate-300 font-semibold">
              {currentLang === 'hi' ? 'बिना बैंक विजिट & आधार e-KYC' : 'Zero Collateral & Online e-KYC'}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-orange-400">
              35% Max
            </span>
            <p className="text-xs text-slate-300 font-semibold">
              {currentLang === 'hi' ? 'डायरेक्ट सब्सिडी क्रेडिट (DBT)' : 'Direct Benefit Transfer (DBT) Subsidy'}
            </p>
          </div>
        </div>
      </div>

      {/* 5. Main Catalog Content Area: Categories, Beneficiary Filters & Scheme Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Category Icon-Based Menu */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
            <span>Categories / ऋण श्रेणियां</span>
            <span>{filteredSchemes.length} Schemes Available</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {LOAN_CATEGORIES_METADATA.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`cat-btn-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id as LoanCategory)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-2 ring-emerald-600/30'
                      : 'bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                  }`}
                >
                  {renderCategoryIcon(cat.id, 'w-4 h-4')}
                  <span>{currentLang === 'hi' ? cat.labelHi : cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Special Beneficiary & State Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Beneficiary Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> Filter:
          </span>

          <button
            id="beneficiary-all"
            onClick={() => setSelectedBeneficiary('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedBeneficiary === 'all'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {t.allBeneficiaries}
          </button>

          <button
            id="beneficiary-scst"
            onClick={() => setSelectedBeneficiary('sc_st')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              selectedBeneficiary === 'sc_st'
                ? 'bg-amber-600 text-white font-bold shadow-xs'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100'
            }`}
          >
            <BadgePercent className="w-3.5 h-3.5" />
            SC / ST (35% Subsidy)
          </button>

          <button
            id="beneficiary-obc"
            onClick={() => setSelectedBeneficiary('obc')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              selectedBeneficiary === 'obc'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100'
            }`}
          >
            <BadgePercent className="w-3.5 h-3.5" />
            OBC (अन्य पिछड़ा)
          </button>

          <button
            id="beneficiary-women"
            onClick={() => setSelectedBeneficiary('women')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              selectedBeneficiary === 'women'
                ? 'bg-pink-600 text-white font-bold shadow-xs'
                : 'bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-pink-300 border border-pink-200 dark:border-pink-800 hover:bg-pink-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Women Entrepreneurs
          </button>

          <button
            id="beneficiary-senior"
            onClick={() => setSelectedBeneficiary('senior_citizen')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              selectedBeneficiary === 'senior_citizen'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            Senior Citizens
          </button>
        </div>

        {/* State Selector Dropdown */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
          <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">State:</label>
          <select
            id="state-filter-select"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          >
            {INDIAN_STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Schemes Grid */}
      {filteredSchemes.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <Coins className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No matching loan schemes found
          </h3>
          <p className="text-xs text-slate-500">
            Try resetting your state or beneficiary filters to view all India national schemes.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedBeneficiary('all');
              setSelectedState('All India');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              id={`scheme-card-${scheme.id}`}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/80 dark:hover:border-emerald-500/80 transition-all shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Top Business Image Cover */}
              {scheme.imageUrl && (
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={scheme.imageUrl}
                    alt={scheme.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end justify-between p-3.5">
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md text-white border border-white/20 uppercase tracking-wider truncate max-w-[180px]">
                      {scheme.department}
                    </span>

                    {scheme.subsidyPercentage && scheme.subsidyPercentage > 0 ? (
                      <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 shadow-md font-mono">
                        {scheme.subsidyPercentage}% Subsidy
                      </span>
                    ) : (
                      <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 shadow-md">
                        Collateral-Free
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="p-5 sm:p-6 space-y-4">
                {/* Title */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {currentLang === 'hi' ? scheme.nameHi : scheme.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {currentLang === 'hi' ? scheme.taglineHi : scheme.tagline}
                  </p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">
                      {t.loanAmount}
                    </span>
                    <span className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">
                      {formatINR(scheme.maxAmount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">
                      {t.interestRate}
                    </span>
                    <span className="text-sm font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                      {scheme.interestRate}% p.a.
                    </span>
                  </div>
                </div>

                {/* Features list preview */}
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {(currentLang === 'hi' ? scheme.featuresHi : scheme.features)
                    .slice(0, 2)
                    .map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{feat}</span>
                      </li>
                    ))}
                </ul>

                {/* Required Documents Tags */}
                <div className="pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Documents Needed:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {scheme.requiredDocs.slice(0, 3).map((doc, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        {doc}
                      </span>
                    ))}
                    {scheme.requiredDocs.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400">
                        +{scheme.requiredDocs.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <a
                  href={scheme.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 text-[11px] font-bold flex items-center justify-center gap-1 border border-blue-200 dark:border-blue-800 transition-all hover:scale-102"
                  title={scheme.officialPortalUrl}
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>{currentLang === 'hi' ? '🏛️ डायरेक्ट सरकारी पोर्टल' : '🏛️ Official Govt Site'}</span>
                </a>

                <button
                  id={`apply-scheme-btn-${scheme.id}`}
                  onClick={() => onSelectSchemeToApply(scheme)}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-extrabold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all hover:scale-102"
                >
                  <span>{currentLang === 'hi' ? '🟢 वेबसाइट पर आवेदन' : '🟢 Apply Here'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
