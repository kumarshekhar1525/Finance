import React, { useState } from 'react';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Download, 
  CreditCard, 
  ChevronRight, 
  ShieldCheck, 
  ArrowUpRight,
  ExternalLink,
  Printer,
  Sparkles,
  QrCode,
  MessageSquare,
  Mail,
  Smartphone,
  Send,
  Trash2
} from 'lucide-react';
import { LoanApplication, ApplicationStatus, UserProfile } from '../types';

interface TrackerProps {
  applications: LoanApplication[];
  user?: UserProfile | null;
  onOpenPayment: (app: LoanApplication) => void;
  onRefresh: () => void;
  onSelectTab?: (tab: 'schemes' | 'applications' | 'calculator' | 'eligibility' | 'admin') => void;
  onDeleteApplication?: (appId: string) => void;
}

export const ApplicationTracker: React.FC<TrackerProps> = ({
  applications,
  user,
  onOpenPayment,
  onRefresh,
  onSelectTab,
  onDeleteApplication,
}) => {
  const [searchId, setSearchId] = useState('');

  // User Data Privacy: Filter applications so logged-in users ONLY see their own applications
  const displayApps = applications.filter((app) => {
    // Search override if explicitly queried
    if (searchId.trim() && (app.trackingId.toLowerCase() === searchId.trim().toLowerCase() || app.id.toLowerCase() === searchId.trim().toLowerCase())) {
      return true;
    }

    const cleanUserAadhaar = user?.aadhaarNumber?.replace(/\D/g, '') || '';
    const cleanAppAadhaar = app.applicantAadhaar?.replace(/\D/g, '') || '';
    const userEmail = user?.email?.toLowerCase().trim() || '';
    const appEmail = app.applicantEmail?.toLowerCase().trim() || '';
    const userPhone = user?.phone?.replace(/\D/g, '') || '';
    const appPhone = app.applicantPhone?.replace(/\D/g, '') || '';
    const userName = user?.fullName?.toLowerCase().trim() || '';
    const appName = app.applicantName?.toLowerCase().trim() || '';

    // If user is logged in, strictly match their identity
    if (user && (cleanUserAadhaar || userEmail || userPhone || userName)) {
      return (
        (cleanUserAadhaar && cleanAppAadhaar && cleanUserAadhaar === cleanAppAadhaar) ||
        (userEmail && appEmail && userEmail === appEmail) ||
        (userPhone && appPhone && userPhone === appPhone) ||
        (userName && appName && userName === appName)
      );
    }

    // Default: match active demo user (Shekhar / Ramesh) to prevent showing everyone's apps
    return cleanAppAadhaar === '987654321098' || cleanAppPhone === '9876543210';
  });

  const [selectedAppId, setSelectedAppId] = useState<string>(
    displayApps[0]?.trackingId || displayApps[0]?.id || ''
  );
  const [showSanctionLetter, setShowSanctionLetter] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'timeline' | 'dispatch_logs' | 'docs'>('timeline');

  // Keep selected app synced with displayApps if selectedAppId changes or on initial render
  const selectedApp = displayApps.find(
    (a) => a.trackingId === selectedAppId || a.id === selectedAppId
  ) || displayApps[0];

  const STAGES: { key: ApplicationStatus; label: string; desc: string }[] = [
    { key: 'submitted', label: 'Submitted', desc: 'Application received online' },
    { key: 'doc_verification', label: 'Docs Verified', desc: 'Automated document scan passed' },
    { key: 'biometric_verified', label: 'Biometrics', desc: 'Face/Fingerprint e-KYC linked' },
    { key: 'bank_review', label: 'Bank Review', desc: 'Nodal officer credit check' },
    { key: 'sanctioned', label: 'Sanctioned', desc: 'Loan approved & letter issued' },
    { key: 'disbursed', label: 'Disbursed', desc: 'Funds credited to bank account' },
  ];

  const getStageIndex = (status: ApplicationStatus) => {
    switch (status) {
      case 'submitted':
        return 0;
      case 'doc_verification':
        return 1;
      case 'biometric_verified':
        return 2;
      case 'bank_review':
        return 3;
      case 'sanctioned':
        return 4;
      case 'disbursed':
        return 5;
      case 'rejected':
        return -1;
      default:
        return 0;
    }
  };

  const currentStageIndex = selectedApp ? getStageIndex(selectedApp.status) : 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    const found = applications.find(
      (a) =>
        a.trackingId.toLowerCase() === searchId.trim().toLowerCase() ||
        a.applicantAadhaar.includes(searchId.trim())
    );
    if (found) {
      setSelectedAppId(found.trackingId);
    }
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div id="application-tracking-section" className="w-full space-y-8">
      {/* 1. Full-Width Animated Header Banner with Banking & Status Photo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[260px] sm:min-h-[300px] flex items-center justify-between p-6 sm:p-10 border border-slate-800">
          {/* Unsplash Background Photo */}
          <img
            src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1600&auto=format&fit=crop&q=80"
            alt="Digital Application Tracking"
            className="absolute inset-0 w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/60" />

          {/* Header Content */}
          <div className="relative z-10 space-y-3 max-w-2xl text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-extrabold backdrop-blur-md">
              <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Real-time DBT Application Tracker • 24/7 Status Sync</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-serif tracking-tight text-white leading-tight">
              Loan Application Status & DBT Tracking
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Track live approval stages, nodal officer review logs, digital sanction letters, and SMS/Email notification delivery in real time.
            </p>
          </div>

          {/* Search Box on Header */}
          <div className="relative z-10 hidden md:block w-80">
            <form onSubmit={handleSearchSubmit} className="p-[2px] rounded-2xl bg-gradient-to-r from-emerald-400 to-amber-400 shadow-xl">
              <div className="relative bg-slate-950/90 backdrop-blur-md rounded-[14px]">
                <input
                  id="tracker-search-input-hero"
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Tracking ID (JD-2026-...)"
                  className="w-full pl-9 pr-20 py-3 text-xs font-mono text-white placeholder-slate-400 focus:outline-hidden bg-transparent"
                />
                <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-3.5" />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-md"
                >
                  Find
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">

      {/* Applications Selector Horizontal Bar */}
      {displayApps.length > 0 ? (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {displayApps.map((app) => (
            <button
              key={app.id}
              onClick={() => setSelectedAppId(app.trackingId)}
              className={`shrink-0 p-3 rounded-2xl border text-left transition-all ${
                selectedApp?.trackingId === app.trackingId
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                  {app.trackingId}
                </span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      app.status === 'sanctioned' || app.status === 'disbursed'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200'
                        : app.status === 'rejected'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
                    }`}
                  >
                    {app.status.replace('_', ' ')}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onDeleteApplication) onDeleteApplication(app.id || app.trackingId);
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    title="Delete Application (आवेदन रद्द/हटाएं)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate max-w-[200px]">
                {app.schemeName}
              </p>
              <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {formatINR(app.requestedAmount)}
              </p>
            </button>
          ))}
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              गोपनीयता सुरक्षा (Personal Data Privacy Enabled)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
              आपकी आईडी ({user?.fullName || 'Active User'}) के नाम पर अभी कोई लोन अर्जी दर्ज नहीं है। अन्य नागरिकों का डेटा सुरक्षा के कारण केवल उनकी अपनी प्रोफाइल पर ही दिखाई देता है।
            </p>
          </div>
          {onSelectTab && (
            <button
              onClick={() => onSelectTab('schemes')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
            >
              योजनाएं देखें और नया आवेदन करें (Explore Schemes & Apply)
            </button>
          )}
        </div>
      )}

      {selectedApp ? (
        <div className="space-y-6">
          {/* Main Status Stepper Card */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Active Application
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-mono">
                  {selectedApp.trackingId}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedApp.schemeName} • Applied on{' '}
                  {new Date(selectedApp.createdAt || selectedApp.appliedDate || Date.now()).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>

              {/* Action Buttons: Sanction Letter, Payment & Delete */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {(selectedApp.status === 'sanctioned' || selectedApp.status === 'disbursed') && (
                  <button
                    id="download-sanction-letter-btn"
                    onClick={() => setShowSanctionLetter(true)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Official Sanction Letter
                  </button>
                )}

                {selectedApp.status === 'sanctioned' && (
                  <button
                    id="pay-processing-fee-btn"
                    onClick={() => onOpenPayment(selectedApp)}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <CreditCard className="w-4 h-4" />
                    Pay Stamp Duty (₹500)
                  </button>
                )}

                <button
                  onClick={() => {
                    if (onDeleteApplication) onDeleteApplication(selectedApp.id || selectedApp.trackingId);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-red-50 dark:bg-red-950/50 hover:bg-red-100 text-red-600 dark:text-red-400 text-xs font-bold border border-red-200 dark:border-red-800 flex items-center gap-1.5 transition-all"
                  title="Delete Application"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>आवेदन हटाएं (Delete)</span>
                </button>
              </div>
            </div>

            {/* Stepper Display */}
            {selectedApp.status === 'rejected' ? (
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 text-xs flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Application Rejected</h4>
                  <p className="mt-1">
                    <strong>Reason for Rejection:</strong>{' '}
                    {selectedApp.rejectionReason || 'Document verification mismatch or credit criteria not met.'}
                  </p>
                  <p className="mt-1 text-[11px] text-red-600 dark:text-red-400">
                    You may update your verified documents and re-apply without penalty.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-4">
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                  {STAGES.map((stage, idx) => {
                    const isDone = currentStageIndex >= idx;
                    const isCurrent = currentStageIndex === idx;

                    return (
                      <div
                        key={stage.key}
                        className={`p-3 rounded-2xl border text-center relative transition-all ${
                          isCurrent
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-xs ring-2 ring-emerald-500/20'
                            : isDone
                            ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                            : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-50'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto text-xs font-bold mb-2 ${
                            isDone
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {stage.label}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{stage.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Financial Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Sanction Amount</span>
                <p className="text-sm sm:text-base font-bold font-mono text-slate-900 dark:text-white">
                  {formatINR(selectedApp.requestedAmount)}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Interest Rate</span>
                <p className="text-sm sm:text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {selectedApp.interestRate}% p.a.
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Monthly EMI</span>
                <p className="text-sm sm:text-base font-bold font-mono text-slate-900 dark:text-white">
                  {formatINR(selectedApp.monthlyEmi)}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Biometric Auth</span>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Linked (UIDAI e-KYC)
                </p>
              </div>
            </div>

            {/* Tab Navigation: Timeline vs SMS/Email Logs vs Documents */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveDetailTab('timeline')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeDetailTab === 'timeline'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Activity Timeline</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDetailTab('dispatch_logs')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeDetailTab === 'dispatch_logs'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>SMS & Email Alerts ({selectedApp.dispatchLogs?.length || 2})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDetailTab('docs')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeDetailTab === 'docs'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Docs ({selectedApp.documents.length})</span>
                </button>
              </div>

              {/* View 1: Timeline Audit Logs */}
              {activeDetailTab === 'timeline' && (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                  {(selectedApp.timeline || []).map((item, idx) => (
                    <div key={idx} className="p-3.5 flex items-start gap-3 text-xs">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {item.stage}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(item.timestamp).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <p className="text-slate-500 mt-0.5">{item.remarks}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* View 2: SMS & Email Dispatch Logs */}
              {activeDetailTab === 'dispatch_logs' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-200 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Real-time SMS dispatched to <strong>{selectedApp.applicantPhone || '+91 98765 43210'}</strong> and Email sent to <strong>{selectedApp.applicantEmail || 'applicant@gmail.com'}</strong>.</span>
                  </div>

                  {/* Invalid Document Warning Alert */}
                  {selectedApp.documents.some(d => d.status === 'invalid') && (
                    <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 text-xs space-y-1">
                      <div className="flex items-center gap-2 font-bold text-red-700 dark:text-red-400">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>⚠️ ध्यान दें: अमान्य दस्तावेज़ (Invalid Document Detected)</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        आपके द्वारा अपलोड किए गए दस्तावेज़ों में: <strong>{selectedApp.documents.filter(d => d.status === 'invalid').map(d => d.name).join(', ')}</strong> अमान्य (Invalid) पाया गया है। कृपया साफ़ दस्तावेज़ पुनः अपलोड करें।
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* Custom Admin Logs if available */}
                    {selectedApp.dispatchLogs && selectedApp.dispatchLogs.length > 0 ? (
                      selectedApp.dispatchLogs.map((log) => (
                        <div key={log.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                              log.type === 'sms' 
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            }`}>
                              {log.type === 'sms' ? <Smartphone className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
                              {log.type === 'sms' ? 'SMS Dispatched (TRAI DLT)' : 'Email Dispatched'}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">Ref: {log.operatorRef || 'DLT-MSG-98124'}</span>
                          </div>
                          <p className="text-xs font-mono text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 whitespace-pre-wrap">
                            {log.content}
                          </p>
                        </div>
                      ))
                    ) : (
                      <>
                        {/* Dynamic SMS Log based on Status */}
                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-extrabold uppercase">
                              <Smartphone className="w-3 h-3" /> SMS Delivered (TRAI DLT)
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">Ref: DLT-SMS-98721</span>
                          </div>
                          <p className="text-xs font-mono text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                            {selectedApp.status === 'sanctioned'
                              ? `"Dear ${selectedApp.applicantName}, your Loan Application (${selectedApp.trackingId}) for ${selectedApp.schemeName} of ${formatINR(selectedApp.requestedAmount)} has been APPROVED & SANCTIONED by Ministry of MSME. Download Sanction Letter from JanDhanSetu Portal."`
                              : selectedApp.status === 'rejected'
                              ? `"Dear ${selectedApp.applicantName}, your Loan Application (${selectedApp.trackingId}) for ${selectedApp.schemeName} was REJECTED: ${selectedApp.rejectionReason || 'Document validation failed'}. Login to JanDhanSetu to re-upload."`
                              : selectedApp.status === 'disbursed'
                              ? `"Dear ${selectedApp.applicantName}, your Loan Application (${selectedApp.trackingId}) amount ${formatINR(selectedApp.requestedAmount)} has been DISBURSED via Direct Benefit Transfer (DBT) to your linked bank account."`
                              : `"Dear ${selectedApp.applicantName}, your Loan Application (${selectedApp.trackingId}) for ${selectedApp.schemeName} of ${formatINR(selectedApp.requestedAmount)} status updated to ${selectedApp.status.toUpperCase()}. Ministry of MSME / JanDhan Portal."`}
                          </p>
                          <div className="flex items-center justify-between pt-1 text-[11px]">
                            <a
                              href={`sms:${selectedApp.applicantPhone || '+919508915876'}?body=${encodeURIComponent(`Dear ${selectedApp.applicantName}, your Loan Application (${selectedApp.trackingId}) status is ${selectedApp.status.toUpperCase()}. JanDhanSetu Portal.`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 shadow-xs"
                            >
                              <Smartphone className="w-3.5 h-3.5" />
                              <span>📱 Direct Open SMS App on Phone</span>
                            </a>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">✓ TRAI DLT Active</span>
                          </div>
                        </div>

                        {/* Dynamic Email Log based on Status */}
                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-extrabold uppercase">
                              <Mail className="w-3 h-3" /> Email Dispatched
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">Ref: MSG-EMAIL-55410</span>
                          </div>
                          <p className="text-xs font-mono text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                            {selectedApp.status === 'sanctioned'
                              ? `Subject: Official Government Loan Sanction Advice (${selectedApp.trackingId})\n"Dear ${selectedApp.applicantName}, We are pleased to inform you that your digital loan application has been vetted and SANCTIONED by the Nodal Credit Committee. Proceeds will be transferred via Direct Benefit Transfer (DBT) to your linked Aadhaar bank account.\nSanctioned Amount: ${formatINR(selectedApp.requestedAmount)}\nInterest Rate: ${selectedApp.interestRate || 8.5}% p.a."`
                              : selectedApp.status === 'rejected'
                              ? `Subject: Official Government Loan Rejection Notice (${selectedApp.trackingId})\n"Dear ${selectedApp.applicantName}, Your application could not be approved at this time due to: '${selectedApp.rejectionReason || 'Document validation failed'}'. You may update your documents and re-apply on the portal."`
                              : `Subject: Official Government Loan Status Advice (${selectedApp.trackingId})\n"Dear ${selectedApp.applicantName}, We are pleased to inform you that your application for ${selectedApp.schemeName} has been processed with status '${selectedApp.status}'. Track your status on JanDhanSetu portal."`}
                          </p>
                          <div className="flex items-center justify-between pt-1 text-[11px]">
                            <a
                              href={`mailto:${selectedApp.applicantEmail || 'kumarshekharyadav9931@gmail.com'}?subject=${encodeURIComponent(`Official Government Loan Notice (${selectedApp.trackingId})`)}&body=${encodeURIComponent(`Dear ${selectedApp.applicantName},\n\nYour application status for ${selectedApp.schemeName} is currently: ${selectedApp.status.toUpperCase()}.\n\nJanDhanSetu Portal.`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1 shadow-xs"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>📧 Direct Open Email Client</span>
                            </a>
                            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">✓ Govt Mail Gateway Active</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* View 3: Documents List */}
              {activeDetailTab === 'docs' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedApp.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{doc.name}</p>
                          <p className="text-[10px] text-slate-400">{doc.fileSize}</p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          doc.status === 'valid'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Official Sanction Letter Modal / Printable Certificate */}
          {showSanctionLetter && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
              <div 
                id="sanction-letter-modal"
                className="relative w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-10 border border-slate-200 overflow-y-auto max-h-[90vh]"
              >
                {/* Close & Print Buttons */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-6">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                    <span className="text-xs font-extrabold uppercase text-slate-500">
                      Government of India • Ministry of Finance / DBT
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold hover:bg-slate-100 flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Print
                    </button>
                    <button
                      onClick={() => setShowSanctionLetter(false)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold"
                    >
                      Close
                    </button>
                  </div>
                </div>

                {/* Certificate Content */}
                <div className="space-y-6 text-slate-800">
                  <div className="text-center space-y-1">
                    <h3 className="text-xl sm:text-2xl font-black font-serif uppercase tracking-tight text-slate-900">
                      Official Loan Sanction Certificate
                    </h3>
                    <p className="text-xs text-slate-600">
                      JanDhan National Digital Lending Facilitation Framework
                    </p>
                    <p className="text-[11px] font-mono font-bold text-emerald-800">
                      Sanction Reference ID: {selectedApp.trackingId}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Beneficiary Name:</span>
                      <span className="font-bold">{selectedApp.applicantName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Aadhaar (Masked):</span>
                      <span className="font-bold">XXXX-XXXX-{selectedApp.applicantAadhaar.slice(-4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Sanctioned Amount:</span>
                      <span className="font-bold text-emerald-700 text-sm">
                        {formatINR(selectedApp.requestedAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Interest Rate:</span>
                      <span className="font-bold">{selectedApp.interestRate}% per annum</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tenure:</span>
                      <span className="font-bold">{selectedApp.tenureMonths} Months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Scheme:</span>
                      <span className="font-bold">{selectedApp.schemeName}</span>
                    </div>
                    {selectedApp.applicantCategory === 'sc_st' && (
                      <div className="flex justify-between text-amber-800 font-bold">
                        <span>Govt. Subsidy Grant Credit:</span>
                        <span>35% Capital Subsidy Sanctioned</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    This is to certify that the digital loan proposal submitted by the applicant has met all statutory compliance, credit risk assessments, and Aadhaar biometric e-KYC norms. The sanctioned proceeds are routed directly to the designated DBT-linked bank account.
                  </p>

                  <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-slate-100 border border-slate-300 rounded-lg flex items-center justify-center">
                        <QrCode className="w-12 h-12 text-slate-800" />
                      </div>
                      <span className="text-[10px] text-slate-500 max-w-[130px]">
                        Scan QR code to verify digital digital signature on National Portal.
                      </span>
                    </div>

                    <div className="text-right space-y-1">
                      <div className="font-serif italic font-bold text-slate-800 text-sm">
                        K. Venkatraman
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Authorized Banking Nodal Officer
                      </p>
                      <span className="inline-block text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">
                        DIGITALLY SIGNED (e-Sign)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <FileText className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No Active Loan Applications Found
          </h3>
          <p className="text-xs text-slate-500">
            Apply for any government loan scheme or enter your Tracking ID in the search box above.
          </p>
        </div>
      )}
      </div>
    </div>
  );
};
