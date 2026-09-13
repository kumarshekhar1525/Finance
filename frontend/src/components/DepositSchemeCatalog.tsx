import React, { useState } from 'react';
import { 
  Building, 
  Building2, 
  Landmark, 
  ShieldCheck, 
  ExternalLink, 
  Sparkles, 
  HeartHandshake, 
  IndianRupee, 
  PiggyBank, 
  Users, 
  ArrowRight, 
  FileText, 
  CheckCircle2, 
  Award,
  Wallet,
  TrendingUp
} from 'lucide-react';
import { DepositScheme, SupportedLanguage } from '../types';
import { DEPOSIT_SCHEMES_DATA } from '../data/depositSchemes';

interface DepositSchemeCatalogProps {
  currentLang: SupportedLanguage;
  onSelectSchemeToApply: (scheme: DepositScheme) => void;
}

export const DepositSchemeCatalog: React.FC<DepositSchemeCatalogProps> = ({
  currentLang,
  onSelectSchemeToApply,
}) => {
  const isEn = currentLang === 'en';
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredSchemes = DEPOSIT_SCHEMES_DATA.filter((scheme) => {
    const matchesCategory =
      activeCategory === 'all' ||
      (activeCategory === 'girls' && scheme.category === 'girls') ||
      (activeCategory === 'women' && (scheme.category === 'women' || scheme.category === 'girls')) ||
      (activeCategory === 'senior_citizens' && scheme.category === 'senior_citizens') ||
      (activeCategory === 'post_office' && scheme.provider === 'post_office') ||
      (activeCategory === 'public_bank' && (scheme.provider === 'sbi' || scheme.provider === 'pnb' || scheme.provider === 'bob' || scheme.provider === 'canara')) ||
      (activeCategory === 'private_bank' && (scheme.provider === 'hdfc' || scheme.provider === 'icici' || scheme.provider === 'axis')) ||
      (activeCategory === 'pension' && scheme.category === 'pension');

    const matchesSearch =
      scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.nameHi.includes(searchQuery) ||
      scheme.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.targetAudience.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div id="savings-scheme-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 p-6 sm:p-10 text-white overflow-hidden shadow-2xl border border-blue-500/20">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isEn ? 'Govt & National Bank Deposit Directory 2026' : 'भारत सरकार एवं राष्ट्रीय बैंक जमा निर्देशिका 2026'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-serif">
            🏦 {isEn ? 'Small Savings & Bank Deposit Interest Schemes' : 'बैंक बचत एवं उच्च ब्याज योजनाएं (Fixed Deposits & SIP)'}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {isEn
              ? 'Apply directly for Sukanya Samriddhi, Post Office Monthly Income, Senior Citizen 8.2% Interest, PPF, LIC Pension & Nationalized Bank (SBI, PNB, HDFC, ICICI) High Return Fixed Deposits.'
              : 'सुकन्या समृद्धि, पोस्ट ऑफिस मंथली इनकम, सीनियर सिटीजन 8.2% ब्याज, पीपीएफ, एलआईसी वय वंदना एवं सरकारी/निजी बैंकों (SBI, PNB, HDFC, ICICI) की 20+ सर्वश्रेष्ठ ब्याज योजनाओं में सीधा आवेदन करें।'}
          </p>
        </div>

        {/* Quick Category Tabs */}
        <div className="mt-8 flex flex-wrap gap-2 pt-4 border-t border-white/10">
          {[
            { id: 'all', label: isEn ? '🌟 All 20+ Deposit Schemes' : '🌟 All Schemes (सभी 20+ योजनाएं)' },
            { id: 'girls', label: isEn ? '👧 Sukanya & Girl Child (8.2%)' : '👧 Sukanya & Girl Child (बालिकाएं)' },
            { id: 'women', label: isEn ? '👩 Women Special (7.5%)' : '👩 Women Special (महिला सम्मान)' },
            { id: 'senior_citizens', label: isEn ? '👴 Senior Citizens (8.2%)' : '👴 Senior Citizens (वरिष्ठ नागरिक 8.2%)' },
            { id: 'post_office', label: isEn ? '📮 Post Office Schemes' : '📮 Post Office Schemes (डाकघर योजनाएं)' },
            { id: 'public_bank', label: isEn ? '🏛️ Public Banks (SBI/PNB/BOB)' : '🏛️ Public Banks (SBI / PNB / BOB)' },
            { id: 'private_bank', label: isEn ? '🏦 Private Banks (HDFC/ICICI/Axis)' : '🏦 Private Banks (HDFC / ICICI / Axis)' },
            { id: 'pension', label: isEn ? '🎖️ Guaranteed Pensions (APY/PMSYM)' : '🎖️ Guaranteed Pensions (अटल पेंशन / मानधन)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-extrabold scale-105'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isEn ? 'Search scheme, SBI, Post Office, Sukanya...' : 'योजना का नाम, बैंक या डाकघर खोजें...'}
            className="w-full pl-4 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden shadow-xs"
          />
        </div>
        <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
          Showing <span className="text-blue-600 dark:text-blue-400 font-mono text-sm">{filteredSchemes.length}</span> {isEn ? 'Verified Deposit Schemes' : 'सत्यापित ब्याज योजनाएं'}
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.map((scheme) => {
          const featuresList = (isEn && scheme.featuresEn) ? scheme.featuresEn : scheme.featuresHi;
          return (
            <div
              key={scheme.id}
              className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-md hover:shadow-2xl hover:border-blue-500/50 transition-all duration-200 relative overflow-hidden"
            >
              {/* Top Badges */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 text-[10px] font-extrabold uppercase border border-blue-300 dark:border-blue-800">
                      {scheme.provider.replace('_', ' ').toUpperCase()}
                    </span>
                    {scheme.guaranteedByGovt && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[9px] font-bold border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                        <ShieldCheck className="w-2.5 h-2.5" /> 100% Govt Guaranteed
                      </span>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
                      {scheme.interestRate}%
                    </span>
                    <span className="text-[10px] text-slate-400 block font-bold">p.a. Interest</span>
                  </div>
                </div>

                {/* Title & Audience */}
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {isEn ? scheme.name : scheme.nameHi}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{isEn ? scheme.targetAudience : scheme.targetAudienceHi}</span>
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  {featuresList.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <button
                  onClick={() => onSelectSchemeToApply(scheme)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all group-hover:scale-[1.02]"
                >
                  <span>📝 {isEn ? 'Apply Direct Online Portal' : 'Apply Online Direct (जनधन सेतु पर आवेदन)'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <a
                  href={scheme.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
                >
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                  <span>🌐 {isEn ? 'Official Bank/Govt Site' : 'Apply on Official Bank/Govt Site (सरकारी साइट पर जाएं)'}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
