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
  Fingerprint,
  FileSignature,
  Trash2,
  Upload
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

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const updated = { ...user, signatureUrl: reader.result };
        localStorage.setItem('jandhan_user_profile', JSON.stringify(updated));
        if (onUpdateUser) onUpdateUser(updated);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    const updated = { ...user, photoUrl: '' };
    localStorage.setItem('jandhan_user_profile', JSON.stringify(updated));
    if (onUpdateUser) onUpdateUser(updated);
  };

  const handleRemoveSignature = () => {
    const updated = { ...user, signatureUrl: '' };
    localStorage.setItem('jandhan_user_profile', JSON.stringify(updated));
    if (onUpdateUser) onUpdateUser(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        id="user-profile-modal"
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
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
              <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/40 overflow-hidden flex items-center justify-center shadow-md relative">
                {user.photoUrl ? (
                  <img src={user.photoUrl} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold">{user.fullName.charAt(0)}</span>
                )}
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity cursor-pointer text-center p-1">
                  <Camera className="w-4 h-4 mr-1" /> Change
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
        <div className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
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

          {/* Persistent Photo & Signature Storage Box */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5 text-xs">
                <FileSignature className="w-4 h-4 text-emerald-600" />
                <span>स्थाई फ़ोटो व डिजिटल हस्ताक्षर (Persistent Photo & Signature)</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 font-bold">Auto-Saved</span>
            </div>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-300/80 leading-snug">
              🔒 एक बार अपलोड की गई फोटो और डिजिटल हस्ताक्षर तब तक सुरक्षित रहेंगी जब तक आप स्वयं 'हटाएं' (Remove) बटन नहीं दबाते।
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Photo Box */}
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Applicant Photo</span>
                {user.photoUrl ? (
                  <div className="relative group">
                    <img src={user.photoUrl} alt="Photo" className="w-16 h-16 rounded-lg object-cover mx-auto border border-slate-300" />
                    <button
                      onClick={handleRemovePhoto}
                      className="mt-2 text-[10px] font-bold text-red-600 hover:text-red-700 flex items-center justify-center gap-1 mx-auto"
                      title="फ़ोटो हटाएँ (Remove Photo)"
                    >
                      <Trash2 className="w-3 h-3" /> Photo हटाएँ
                    </button>
                  </div>
                ) : (
                  <div>
                    <label className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold cursor-pointer inline-flex items-center gap-1">
                      <Upload className="w-3 h-3" /> Photo अपलोड
                      <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                    </label>
                  </div>
                )}
              </div>

              {/* Signature Box */}
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Digital Signature</span>
                {user.signatureUrl ? (
                  <div className="relative group">
                    <img src={user.signatureUrl} alt="Signature" className="h-12 w-auto max-w-full object-contain mx-auto border border-slate-200 p-1 bg-white" />
                    <button
                      onClick={handleRemoveSignature}
                      className="mt-2 text-[10px] font-bold text-red-600 hover:text-red-700 flex items-center justify-center gap-1 mx-auto"
                      title="हस्ताक्षर हटाएँ (Remove Signature)"
                    >
                      <Trash2 className="w-3 h-3" /> Sign हटाएँ
                    </button>
                  </div>
                ) : (
                  <div>
                    <label className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold cursor-pointer inline-flex items-center gap-1">
                      <Upload className="w-3 h-3" /> Sign अपलोड
                      <input type="file" accept="image/*" className="hidden" onChange={handleSignatureUpload} />
                    </label>
                  </div>
                )}
              </div>
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

