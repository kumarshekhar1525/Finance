import React, { useState } from 'react';
import { 
  Sliders, 
  IndianRupee, 
  Calendar, 
  Percent, 
  ArrowRight, 
  PieChart, 
  CheckCircle,
  Sparkles,
  TrendingUp,
  Landmark,
  ShieldCheck,
  Award,
  RefreshCw,
  PiggyBank,
  DollarSign,
  UserCheck,
  Lock,
  Clock
} from 'lucide-react';
import { SupportedLanguage } from '../types';
import { translations } from '../lib/i18n';

interface LoanCalculatorProps {
  currentLang: SupportedLanguage;
  onApplyWithConfig: (amount: number, tenureMonths: number, interestRate: number) => void;
  onApplyDepositScheme?: (schemeName: string, depositAmt: number, tenureYears: number) => void;
}

export const LoanCalculator: React.FC<LoanCalculatorProps> = ({
  currentLang,
  onApplyWithConfig,
  onApplyDepositScheme,
}) => {
  const isEn = currentLang === 'en';
  const t = translations[currentLang] || translations.en;

  // Active Main Tab: 'loan' vs 'sip' vs 'lumpsum'
  const [activeCalcTab, setActiveCalcTab] = useState<'loan' | 'sip' | 'lumpsum'>('loan');

  // --- LOAN EMI STATE ---
  const [loanAmount, setLoanAmount] = useState<number>(1000000); // 10 Lakhs default
  const [interestRate, setInterestRate] = useState<number>(8.5); // 8.5% default
  const [tenureYears, setTenureYears] = useState<number>(5); // 5 years default
  const [showAmortization, setShowAmortization] = useState(false);

  // --- SAVINGS & SIP STATE ---
  const [savingsFrequency, setSavingsFrequency] = useState<'monthly' | 'quarterly' | 'half_yearly' | 'yearly'>('monthly');
  const [depositAmount, setDepositAmount] = useState<number>(5000); // ₹5,000 default
  const [savingsInterestRate, setSavingsInterestRate] = useState<number>(8.2); // 8.2% Sukanya / SCSS default
  const [savingsTenureYears, setSavingsTenureYears] = useState<number>(5);
  const [applicantDob, setApplicantDob] = useState<string>('2018-06-15');
  const [parentAadhaarInput, setParentAadhaarInput] = useState<string>('987654321098');

  // EMI Calculation
  const tenureMonths = tenureYears * 12;
  const monthlyRate = interestRate / 12 / 100;
  const emi =
    monthlyRate > 0
      ? Math.round(
          (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
            (Math.pow(1 + monthlyRate, tenureMonths) - 1)
        )
      : Math.round(loanAmount / tenureMonths);

  const totalPayable = emi * tenureMonths;
  const totalInterest = Math.max(0, totalPayable - loanAmount);
  const interestPercentage = Math.round((totalInterest / totalPayable) * 100) || 0;
  const principalPercentage = 100 - interestPercentage;

  // Savings Maturity & SIP Calculation
  const savingsMaturityDays = Math.round(savingsTenureYears * 365.25);
  
  const computedAge = React.useMemo(() => {
    if (!applicantDob) return 6;
    const birth = new Date(applicantDob);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) {
      years--;
    }
    return years >= 0 ? years : 0;
  }, [applicantDob]);

  const savingsCalculated = React.useMemo(() => {
    const r = savingsInterestRate / 100;
    const tYears = savingsTenureYears;

    if (activeCalcTab === 'lumpsum') {
      const principal = depositAmount || 50000;
      const maturity = principal * Math.pow(1 + r, tYears);
      const interestEarned = Math.max(0, maturity - principal);
      return {
        totalInvested: Math.round(principal),
        maturityAmount: Math.round(maturity),
        interestEarned: Math.round(interestEarned),
      };
    } else {
      const freqPerYear = savingsFrequency === 'monthly' ? 12 : savingsFrequency === 'quarterly' ? 4 : savingsFrequency === 'half_yearly' ? 2 : 1;
      const totalPayments = tYears * freqPerYear;
      const ratePerPeriod = r / freqPerYear;
      const p = depositAmount || 2000;
      let total = 0;
      for (let i = 1; i <= totalPayments; i++) {
        total += p * Math.pow(1 + ratePerPeriod, totalPayments - i + 1);
      }
      const invested = p * totalPayments;
      const interestEarned = Math.max(0, total - invested);
      return {
        totalInvested: Math.round(invested),
        maturityAmount: Math.round(total),
        interestEarned: Math.round(interestEarned),
      };
    }
  }, [depositAmount, savingsInterestRate, savingsTenureYears, activeCalcTab, savingsFrequency]);

  // Format INR currency
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Generate 5-year Amortization preview
  const amortizationSchedule = [];
  let currentBalance = loanAmount;
  for (let year = 1; year <= Math.min(tenureYears, 10); year++) {
    let yearInterest = 0;
    let yearPrincipal = 0;
    for (let m = 1; m <= 12; m++) {
      const mInterest = currentBalance * monthlyRate;
      const mPrincipal = emi - mInterest;
      yearInterest += mInterest;
      yearPrincipal += mPrincipal;
      currentBalance = Math.max(0, currentBalance - mPrincipal);
    }
    amortizationSchedule.push({
      year,
      principalPaid: Math.round(yearPrincipal),
      interestPaid: Math.round(yearInterest),
      closingBalance: Math.round(currentBalance),
    });
  }

  return (
    <div id="loan-calculator-section" className="w-full space-y-8">
      {/* Full-Width Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[220px] flex items-center justify-between p-6 sm:p-10 border border-blue-900/30 text-white bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-extrabold backdrop-blur-md">
              <Sliders className="w-3.5 h-3.5" />
              <span>{isEn ? 'National Financial Calculator Portal 2026' : 'राष्ट्रीय डिजिटल ब्याज व किस्‍त कैलकुलेटर 2026'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-serif tracking-tight leading-tight">
              {isEn ? 'Loan EMI, SIP & Savings Interest Calculator' : 'ऋण ईएमआई, SIP एवं बचत ब्याज कैलकुलेटर'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              {isEn
                ? 'Calculate real-time loan EMIs, SIP monthly compounding returns, LumpSum FD returns, and guaranteed Sukanya / Post Office savings interest.'
                : 'ऋण किस्‍त (EMI), एसआईपी (SIP), एकमुश्त एफडी (LumpSum Deposit) एवं सुकन्या व पोस्ट ऑफिस बचत ब्याज का रीयल-टाइम हिसाब लगाएं।'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* 🌟 Main 3-Tab Selector: Loan EMI vs SIP Savings vs LumpSum Deposit */}
        <div className="flex items-center gap-2 sm:gap-4 p-2 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner">
          <button
            onClick={() => setActiveCalcTab('loan')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
              activeCalcTab === 'loan'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-102'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{isEn ? '💳 Loan EMI Calculator' : '💳 ऋण ईएमआई (Loan EMI) कैलकुलेटर'}</span>
          </button>

          <button
            onClick={() => setActiveCalcTab('sip')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
              activeCalcTab === 'sip'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-102'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>{isEn ? '📈 SIP & Monthly Savings' : '📈 एसआईपी (SIP) एवं मंथली बचत'}</span>
          </button>

          <button
            onClick={() => setActiveCalcTab('lumpsum')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
              activeCalcTab === 'lumpsum'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-102'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50'
            }`}
          >
            <PiggyBank className="w-4 h-4 text-amber-400" />
            <span>{isEn ? '💰 LumpSum Fixed Deposit' : '💰 एकमुश्त (LumpSum FD) फिक्स बचत'}</span>
          </button>
        </div>

        {/* ----------------- TAB 1: LOAN EMI CALCULATOR ----------------- */}
        {activeCalcTab === 'loan' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-7">
              {/* Loan Amount Slider */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <IndianRupee className="w-4 h-4 text-blue-600" />
                    {t.principalAmount}
                  </label>
                  <span className="text-base sm:text-xl font-mono font-extrabold text-blue-600 dark:text-blue-400">
                    {formatINR(loanAmount)}
                  </span>
                </div>
                <input
                  id="slider-loan-amount"
                  type="range"
                  min={25000}
                  max={10000000}
                  step={25000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                {/* Quick Presets */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {[50000, 300000, 1000000, 2500000, 5000000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setLoanAmount(amt)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                        loanAmount === amt
                          ? 'bg-blue-600 text-white border-blue-600 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-500'
                      }`}
                    >
                      {formatINR(amt)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interest Rate Slider */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Percent className="w-4 h-4 text-blue-600" />
                    {t.interestRate}
                  </label>
                  <span className="text-base sm:text-xl font-mono font-extrabold text-blue-600 dark:text-blue-400">
                    {interestRate}% p.a.
                  </span>
                </div>
                <input
                  id="slider-interest-rate"
                  type="range"
                  min={1.0}
                  max={18.0}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                {/* Scheme Rate Presets */}
                <div className="flex flex-wrap gap-2 mt-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setInterestRate(4.0)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  >
                    4.0% (Kisan KCC)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInterestRate(5.0)}
                    className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800"
                  >
                    5.0% (Vishwakarma)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInterestRate(7.9)}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                  >
                    7.9% (Mudra)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInterestRate(8.5)}
                    className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                  >
                    8.5% (PMEGP)
                  </button>
                </div>
              </div>

              {/* Tenure Slider */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    {t.tenure} (Tenure)
                  </label>
                  <span className="text-base sm:text-xl font-mono font-extrabold text-blue-600 dark:text-blue-400">
                    {tenureYears} Years ({tenureMonths} Months)
                  </span>
                </div>
                <input
                  id="slider-tenure-years"
                  type="range"
                  min={1}
                  max={25}
                  step={1}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                  <span>1 Year</span>
                  <span>5 Years</span>
                  <span>10 Years</span>
                  <span>20 Years</span>
                  <span>25 Years</span>
                </div>
              </div>
            </div>

            {/* Right Summary Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">
                  Monthly Repayment / मासिक किस्त
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white mb-6">
                  {formatINR(emi)}
                  <span className="text-xs text-slate-400 font-sans font-normal ml-2">/ month</span>
                </div>

                <div className="space-y-3.5 border-t border-slate-800 pt-5 text-sm">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>{t.principalAmount}:</span>
                    <span className="font-mono font-bold text-white">{formatINR(loanAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>{t.totalInterest}:</span>
                    <span className="font-mono font-bold text-amber-400">+{formatINR(totalInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300 border-t border-slate-800/80 pt-3">
                    <span className="font-bold text-white">{t.totalPayable}:</span>
                    <span className="font-mono font-extrabold text-blue-400 text-base">
                      {formatINR(totalPayable)}
                    </span>
                  </div>
                </div>

                {/* Visual Breakdown Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <span>Principal ({principalPercentage}%)</span>
                    <span>Interest ({interestPercentage}%)</span>
                  </div>
                  <div className="h-3 w-full bg-amber-500 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${principalPercentage}%` }}
                      className="h-full bg-blue-500"
                    />
                  </div>
                </div>

                {/* Apply with this configuration */}
                <button
                  id="apply-calc-config-btn"
                  onClick={() => onApplyWithConfig(loanAmount, tenureMonths, interestRate)}
                  className="mt-6 w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-600/30 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <span>{t.applyNow} With This Amount</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <button
                id="toggle-amortization-btn"
                type="button"
                onClick={() => setShowAmortization(!showAmortization)}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <PieChart className="w-4 h-4 text-blue-600" />
                {showAmortization ? 'Hide Amortization Schedule' : 'View Year-by-Year Amortization Schedule'}
              </button>
            </div>
          </div>
        )}

        {/* ----------------- TAB 2 & TAB 3: SIP & LUMPSUM CALCULATOR ----------------- */}
        {(activeCalcTab === 'sip' || activeCalcTab === 'lumpsum') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-7">
              
              {/* Frequency Options for SIP */}
              {activeCalcTab === 'sip' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2 uppercase tracking-wider">
                    {isEn ? 'SIP Investment Frequency (एसआईपी आवृत्ति)' : 'एसआईपी किस्त आवृत्ति'}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'monthly', label: isEn ? 'Monthly' : 'मासिक' },
                      { id: 'quarterly', label: isEn ? 'Quarterly' : 'तिमाही' },
                      { id: 'half_yearly', label: isEn ? 'Half-Yearly' : 'छमाही' },
                      { id: 'yearly', label: isEn ? 'Yearly' : 'वार्षिक' },
                    ].map((freq) => (
                      <button
                        key={freq.id}
                        type="button"
                        onClick={() => setSavingsFrequency(freq.id as any)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all ${
                          savingsFrequency === freq.id
                            ? 'bg-blue-600 text-white font-extrabold shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {freq.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Deposit / Installment Amount Slider */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <IndianRupee className="w-4 h-4 text-emerald-600" />
                    {activeCalcTab === 'lumpsum' ? (isEn ? 'LumpSum Deposit Amount (एकमुश्त जमा राशि)' : 'एकमुश्त जमा राशि') : (isEn ? 'SIP Installment Amount (मासिक एसआईपी किश्त)' : 'एसआईपी किश्त राशि')}
                  </label>
                  <span className="text-base sm:text-xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                    {formatINR(depositAmount)}
                  </span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={500000}
                  step={500}
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                {/* Presets */}
                <div className="flex flex-wrap gap-2 mt-3 text-xs">
                  {[1000, 2500, 5000, 10000, 25000, 50000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepositAmount(amt)}
                      className={`px-2.5 py-1 rounded-lg border transition-all ${
                        depositAmount === amt
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-500'
                      }`}
                    >
                      {formatINR(amt)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Expected Return Rate Slider */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Percent className="w-4 h-4 text-emerald-600" />
                    {isEn ? 'Expected Interest Rate (वार्षिक ब्याज दर)' : 'वार्षिक ब्याज दर'}
                  </label>
                  <span className="text-base sm:text-xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                    {savingsInterestRate}% p.a.
                  </span>
                </div>
                <input
                  type="range"
                  min={4.0}
                  max={15.0}
                  step={0.1}
                  value={savingsInterestRate}
                  onChange={(e) => setSavingsInterestRate(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                {/* Govt Scheme Presets */}
                <div className="flex flex-wrap gap-2 mt-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setSavingsInterestRate(7.1)}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200"
                  >
                    7.1% (Post Office PPF)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSavingsInterestRate(7.5)}
                    className="px-2.5 py-1 rounded-lg bg-pink-50 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 border border-pink-200"
                  >
                    7.5% (Mahila Samman)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSavingsInterestRate(8.2)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 font-bold"
                  >
                    8.2% (Sukanya SSY / SCSS)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSavingsInterestRate(12.0)}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200"
                  >
                    12.0% (NPS / Mutual SIP)
                  </button>
                </div>
              </div>

              {/* Investment Tenure */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    {isEn ? 'Investment Duration (अवधि)' : 'जमा अवधि'}
                  </label>
                  <span className="text-base sm:text-xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                    {savingsTenureYears} Years ({savingsMaturityDays} Days)
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={25}
                  step={1}
                  value={savingsTenureYears}
                  onChange={(e) => setSavingsTenureYears(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                  <span>1 Year</span>
                  <span>5 Years</span>
                  <span>10 Years</span>
                  <span>15 Years</span>
                  <span>25 Years</span>
                </div>
              </div>

              {/* Additional Details: DOB & Parent Aadhaar */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  {isEn ? 'Applicant & Parent Details (पात्रता सत्यापन)' : 'आवेदक व अभिभावक विवरण'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Date of Birth (जन्म तिथि):
                    </label>
                    <input
                      type="date"
                      value={applicantDob}
                      onChange={(e) => setApplicantDob(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono font-bold"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Computed Age: {computedAge} Years</span>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Parent's Aadhaar (माता-पिता का आधार):
                    </label>
                    <input
                      type="text"
                      maxLength={12}
                      value={parentAadhaarInput}
                      onChange={(e) => setParentAadhaarInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="12-digit Aadhaar Number"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-mono font-bold"
                    />
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 block font-bold">✓ Mandatory for Minor Accounts</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Summary Column for SIP / LumpSum */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                  Expected Maturity Returns / कुल मैच्योरिटी राशि
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400 mb-6">
                  {formatINR(savingsCalculated.maturityAmount)}
                  <span className="text-xs text-slate-300 font-sans font-normal ml-2">at {savingsInterestRate}% p.a.</span>
                </div>

                <div className="space-y-3.5 border-t border-slate-800 pt-5 text-sm">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>{isEn ? 'Total Invested Amount:' : 'कुल निवेश राशि:'}</span>
                    <span className="font-mono font-bold text-white">{formatINR(savingsCalculated.totalInvested)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>{isEn ? 'Estimated Compound Interest:' : 'अनुमानित ब्याज लाभ:'}</span>
                    <span className="font-mono font-bold text-emerald-400">+{formatINR(savingsCalculated.interestEarned)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300 border-t border-slate-800/80 pt-3">
                    <span className="font-bold text-white">{isEn ? 'Total Maturity Value:' : 'कुल परिपक्वता मूल्य:'}</span>
                    <span className="font-mono font-extrabold text-emerald-400 text-base">
                      {formatINR(savingsCalculated.maturityAmount)}
                    </span>
                  </div>
                </div>

                {/* Visual Return Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <span>Invested ({Math.round((savingsCalculated.totalInvested / savingsCalculated.maturityAmount) * 100)}%)</span>
                    <span>Interest Gain ({Math.round((savingsCalculated.interestEarned / savingsCalculated.maturityAmount) * 100)}%)</span>
                  </div>
                  <div className="h-3 w-full bg-emerald-500 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${Math.round((savingsCalculated.totalInvested / savingsCalculated.maturityAmount) * 100)}%` }}
                      className="h-full bg-blue-500"
                    />
                  </div>
                </div>

                {/* Direct Apply Button */}
                <button
                  onClick={() => {
                    if (onApplyDepositScheme) {
                      onApplyDepositScheme(
                        activeCalcTab === 'sip' ? 'Sukanya Samriddhi / Post Office SIP' : 'Bank High Return Fixed Deposit',
                        depositAmount,
                        savingsTenureYears
                      );
                    } else {
                      alert(`Applying for Savings Deposit Scheme: ₹${depositAmount.toLocaleString('en-IN')} for ${savingsTenureYears} Years.`);
                    }
                  }}
                  className="mt-6 w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <PiggyBank className="w-5 h-5 text-slate-950" />
                  <span>{isEn ? 'Apply For Deposit Scheme Now' : 'बचत योजना में तुरंत आवेदन करें'}</span>
                </button>
              </div>

              {/* Premature Withdrawal Terms Summary */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {isEn ? 'Premature Withdrawal Policy' : 'समय पूर्व निकासी नियम:'}
                </span>
                <p className="text-[11px] text-amber-200/80">
                  {isEn
                    ? '1-year mandatory lock-in period. Premature exit allowed with 1% interest deduction penalty as per RBI guidelines.'
                    : '1 वर्ष की अनिवार्य लॉक-इन अवधि। RBI दिशानिर्देशों के अनुसार 1% ब्याज कटौती पेनल्टी के साथ समय पूर्व निकासी मान्य है।'}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
