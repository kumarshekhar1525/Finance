import React from 'react';
import { 
  X, 
  UserCheck, 
  ShieldCheck, 
  CreditCard, 
  MapPin, 
  Calendar, 
  Phone, 
  Mail, 
  Lock, 
  Camera, 
  CheckCircle2, 
  Sparkles,
  Fingerprint
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onOpenBiometric: () => void;
  onUpdateUser?: (updatedUser: UserProfile) => void;
}

export const UserProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenBiometric,
  onUpdateUser,
}) => {
  if (!isOpen || !user) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const updated = { ...user, photoUrl: reader.result };
        localStorage.setItem('jandhan_user_profile', JSON.stringify(updated));
        if (onUpdateUser) onUpdateUser(updated);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        id="user-profile-modal"
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer">
              <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/40 overflow-hidden flex items-center justify-center shadow-md relative">
                {user.photoUrl ? (
                  <img src={user.photoUrl} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold">{user.fullName.charAt(0)}</span>
                )}
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity cursor-pointer text-center p-1">
                  <Camera className="w-4 h-4" />
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </label>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white" title="e-KYC Verified">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold leading-snug">{user.fullName}</h3>
              <p className="text-xs text-emerald-100 font-mono">
                Aadhaar: XXXX-XXXX-{user.aadhaarNumber.slice(-4)}
              </p>
              <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-semibold">
                <ShieldCheck className="w-3 h-3" /> UIDAI Tier-3 Verified
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6 space-y-4 text-xs">
          {/* Credit Score Gauge Preview */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                CIBIL / Experian Credit Score
              </span>
              <span className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                {user.creditScore || 785} / 900
              </span>
              <span className="text-[10px] text-emerald-600 block font-semibold">
                Excellent • Fast Loan Approval Eligible
              </span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500 flex items-center justify-center font-bold text-emerald-600">
              A+
            </div>
          </div>

          {/* Demographic Data */}
          <div className="space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800">
            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Date of Birth:
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{user.dob}</span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Phone:
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{user.phone}</span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email:
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{user.email}</span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Verified State:
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{user.state}</span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Beneficiary Category:
              </span>
              <span className="font-bold uppercase text-amber-600 dark:text-amber-400">
                {user.category === 'obc' ? 'OBC (अन्य पिछड़ा वर्ग)' : user.category === 'sc_st' ? 'SC/ST' : user.category}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Fingerprint className="w-3.5 h-3.5" /> Biometric Token:
              </span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                {user.biometricVerified ? 'ACTIVE & LINKED' : 'NOT LINKED'}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenBiometric();
            }}
            className="w-full mt-2 py-2.5 px-4 rounded-xl border border-emerald-500 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Camera className="w-4 h-4" />
            Re-Verify Biometric Face / Fingerprint
          </button>
        </div>
      </div>
    </div>
  );
};
