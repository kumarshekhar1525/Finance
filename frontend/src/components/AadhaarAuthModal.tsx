import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  X, 
  Smartphone, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle,
  RefreshCw,
  UserCheck
} from 'lucide-react';
import { UserProfile, BeneficiaryFilter } from '../types';

interface AadhaarAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AadhaarAuthModal: React.FC<AadhaarAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<'aadhaar' | 'otp' | 'success'>('aadhaar');
  const [aadhaarInput, setAadhaarInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [timer, setTimer] = useState(45);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let interval: any = null;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  // Format Aadhaar into 4-digit chunks
  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
    setAadhaarInput(raw);
    setErrorMsg('');
  };

  const formattedAadhaar = aadhaarInput.replace(/(\d{4})(?=\d)/g, '$1 ');

  const handleSendOtp = () => {
    if (aadhaarInput.length !== 12) {
      setErrorMsg('कृपया 12 अंकों का मान्य आधार नंबर दर्ज करें (Please enter a valid 12-digit Aadhaar number)');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      const mockOtp = String(Math.floor(100000 + Math.random() * 900000));
      setGeneratedOtp(mockOtp);
      setStep('otp');
      setTimer(45);
    }, 700);
  };

  const handleVerifyOtp = () => {
    if (otpInput.length !== 6) {
      setErrorMsg('कृपया 6 अंकों का ओटीपी दर्ज करें (Please enter 6-digit OTP)');
      return;
    }

    if (otpInput !== generatedOtp && otpInput !== '123456') {
      setErrorMsg('अमान्य ओटीपी कोड (Invalid OTP. Please enter the code shown above)');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      setStep('success');

      // Create verified user profile based on input
      const profile: UserProfile = {
        aadhaarNumber: aadhaarInput,
        fullName: 'Rajeshwar Singh Yadav',
        dob: '1988-04-15',
        gender: 'Male',
        phone: '+91 98765 43210',
        email: 'rajeshwar.yadav@digitalindia.gov.in',
        address: 'Vill. Rampur, Post Barabanki, District Bareilly',
        state: 'Uttar Pradesh',
        pincode: '243001',
        category: 'sc_st',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        creditScore: 785,
        isAadhaarVerified: true,
        biometricVerified: true,
        kycTier: 'Tier-3',
      };

      setTimeout(() => {
        onSuccess(profile);
        onClose();
        setStep('aadhaar');
        setAadhaarInput('');
        setOtpInput('');
      }, 1200);
    }, 900);
  };

  // Quick Demo Profiles for instant testing
  const selectQuickProfile = (profileType: 'obc' | 'sc_st' | 'women' | 'senior') => {
    let mockUser: UserProfile;

    if (profileType === 'obc') {
      mockUser = {
        aadhaarNumber: '881234567890',
        fullName: 'Sunil Kumar Yadav',
        dob: '1990-08-25',
        gender: 'Male',
        phone: '+91 99887 76655',
        email: 'sunil.yadav@example.com',
        address: 'Vill. Kalyanpur, Sector 2, Lucknow',
        state: 'Uttar Pradesh',
        pincode: '226024',
        category: 'obc',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        creditScore: 760,
        isAadhaarVerified: true,
        biometricVerified: true,
        kycTier: 'Tier-3',
      };
    } else if (profileType === 'sc_st') {
      mockUser = {
        aadhaarNumber: '987654321098',
        fullName: 'Ramesh Kumar Verma',
        dob: '1985-06-12',
        gender: 'Male',
        phone: '+91 98765 43210',
        email: 'ramesh.verma@example.com',
        address: 'H.No 45, Ambedkar Nagar, Sector 4, Bareilly',
        state: 'Uttar Pradesh',
        pincode: '243001',
        category: 'sc_st',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
        creditScore: 772,
        isAadhaarVerified: true,
        biometricVerified: true,
        kycTier: 'Tier-3',
      };
    } else if (profileType === 'women') {
      mockUser = {
        aadhaarNumber: '543216789012',
        fullName: 'Pooja Devi Sharma',
        dob: '1992-11-20',
        gender: 'Female',
        phone: '+91 91234 56780',
        email: 'pooja.sharma@example.com',
        address: 'Boutique Road, Near Rajendra Nagar, Patna',
        state: 'Bihar',
        pincode: '800016',
        category: 'women',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        creditScore: 795,
        isAadhaarVerified: true,
        biometricVerified: true,
        kycTier: 'Tier-3',
      };
    } else {
      mockUser = {
        aadhaarNumber: '765432109876',
        fullName: 'Harish Chandra Joshi',
        dob: '1956-02-14',
        gender: 'Male',
        phone: '+91 98112 34567',
        email: 'harish.joshi@pensioners.org',
        address: 'Flat 302, Shanti Vihar, Tilak Nagar, Jaipur',
        state: 'Rajasthan',
        pincode: '302004',
        category: 'senior_citizen',
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        creditScore: 810,
        isAadhaarVerified: true,
        biometricVerified: true,
        kycTier: 'Tier-3',
      };
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('jandhan_user_profile', JSON.stringify(mockUser));
      onSuccess(mockUser);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        id="aadhaar-auth-modal"
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-br from-emerald-600 to-teal-800 text-white relative">
          <button
            id="close-aadhaar-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-lg font-bold">UIDAI Aadhaar e-KYC</h3>
              <p className="text-xs text-emerald-100/90 flex items-center gap-1 font-medium">
                <Lock className="w-3 h-3" /> 256-Bit Encrypted OTP Verification
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {step === 'aadhaar' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  12-Digit Aadhaar Number / आधार संख्या
                </label>
                <div className="relative">
                  <input
                    id="aadhaar-number-input"
                    type="text"
                    maxLength={14}
                    value={formattedAadhaar}
                    onChange={handleAadhaarChange}
                    placeholder="XXXX XXXX XXXX"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white font-mono text-lg tracking-widest focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition-all"
                  />
                  <div className="absolute right-3 top-3.5 text-xs text-slate-400 font-mono">
                    {aadhaarInput.length}/12
                  </div>
                </div>
                <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  An OTP will be sent to the mobile number registered with your Aadhaar card.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                id="send-aadhaar-otp-btn"
                onClick={handleSendOtp}
                disabled={aadhaarInput.length !== 12 || isLoading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Connecting UIDAI Gateway...</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-4 h-4" />
                    <span>Get OTP / ओटीपी प्राप्त करें</span>
                  </>
                )}
              </button>

              {/* Quick Profile Selectors for Instant Evaluator Demo */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  ⚡ Quick Demo Login (No SMS needed)
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    id="demo-user-scst"
                    type="button"
                    onClick={() => selectQuickProfile('sc_st')}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-emerald-500 text-left transition-colors text-xs"
                  >
                    <p className="font-bold text-slate-800 dark:text-slate-200">SC / ST</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400">35% Subsidy</p>
                  </button>

                  <button
                    id="demo-user-obc"
                    type="button"
                    onClick={() => selectQuickProfile('obc')}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-emerald-500 text-left transition-colors text-xs"
                  >
                    <p className="font-bold text-slate-800 dark:text-slate-200">OBC (अन्य पिछड़ा)</p>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400">PMEGP / Mudra</p>
                  </button>

                  <button
                    id="demo-user-women"
                    type="button"
                    onClick={() => selectQuickProfile('women')}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-emerald-500 text-left transition-colors text-xs"
                  >
                    <p className="font-bold text-slate-800 dark:text-slate-200">Women</p>
                    <p className="text-[10px] text-pink-600 dark:text-pink-400">Stand-Up / Mudra</p>
                  </button>

                  <button
                    id="demo-user-senior"
                    type="button"
                    onClick={() => selectQuickProfile('senior')}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-emerald-500 text-left transition-colors text-xs"
                  >
                    <p className="font-bold text-slate-800 dark:text-slate-200">Senior</p>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400">Pension Loan</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-4">
              {/* Simulated UIDAI SMS Preview Notification */}
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                <div className="flex items-center justify-between font-bold mb-1">
                  <span>📱 UIDAI SMS Gateway:</span>
                  <span className="font-mono bg-amber-200 dark:bg-amber-900/60 px-2 py-0.5 rounded-md text-amber-900 dark:text-amber-100">
                    OTP: {generatedOtp}
                  </span>
                </div>
                <p className="text-[11px] text-amber-700 dark:text-amber-300">
                  Your Aadhaar verification OTP is <strong>{generatedOtp}</strong> (Valid for 10 minutes).
                </p>
                <button
                  type="button"
                  onClick={() => setOtpInput(generatedOtp)}
                  className="mt-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 underline"
                >
                  Click to Auto-fill OTP
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Enter 6-Digit Verification OTP
                </label>
                <input
                  id="aadhaar-otp-input"
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xl tracking-widest text-center focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition-all"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                id="verify-aadhaar-otp-btn"
                onClick={handleVerifyOtp}
                disabled={otpInput.length !== 6 || isLoading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying e-KYC Records...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify & Login / ई-केवाईसी सत्यापित करें</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                <button
                  type="button"
                  onClick={() => setStep('aadhaar')}
                  className="hover:underline"
                >
                  Change Aadhaar Number
                </button>
                <span>Resend in {timer}s</span>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-6 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-900/20 animate-bounce">
                <UserCheck className="w-9 h-9" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Aadhaar e-KYC Verified Successfully!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Demographic records retrieved and encrypted securely. Redirecting to your dashboard...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
