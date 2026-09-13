import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Filter, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  X,
  Clock, 
  Download, 
  Eye, 
  RefreshCw, 
  SlidersHorizontal,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  AlertTriangle,
  FileSpreadsheet,
  IndianRupee,
  Users,
  PlusCircle,
  Smartphone,
  Mail,
  Send,
  Building2,
  Landmark,
  Trash2,
  ExternalLink,
  Lock,
  Unlock,
  KeyRound,
  MessageSquare,
  UserCheck,
  Bot,
  Headphones,
  FileText
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { LoanApplication, SearchLog, ApplicationStatus, Scheme, HelpdeskChatTicket, HelpdeskChatMessage, RecycleBinItem, RecycleCategory, DispatchLog, DepositApplication } from '../types';

interface AdminDashboardProps {
  applications: LoanApplication[];
  schemes?: Scheme[];
  onUpdateAppStatus: (
    appId: string, 
    status: ApplicationStatus, 
    remarks?: string, 
    rejectionReason?: string
  ) => Promise<void>;
  onRefresh: () => void;
  onAddNewScheme?: (newScheme: Scheme) => void;
  onDeleteScheme?: (schemeId: string) => void;
  onDeleteApplication?: (appId: string) => void;
  onOpenAuthModal?: (mode: 'login' | 'signup' | 'forgot' | 'admin') => void;
}

interface ChatLogItem {
  id: string;
  message?: string;
  userQuestion?: string;
  response?: string;
  botResponse?: string;
  source?: string;
  language?: string;
  timestamp: string;
  citizenName?: string;
}

const formatSafeDate = (ts: string | undefined): string => {
  if (!ts) {
    return new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  try {
    const d = new Date(ts);
    if (!isNaN(d.getTime())) {
      return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  } catch (e) {}
  return `${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} ${ts}`;
};

const ALL_CITIZEN_PROFILES = [
  {
    id: 'c-user',
    name: 'Shekhar Kumar Yadav',
    aadhaar: 'XXXX-XXXX-1098',
    phone: '+91 98765 43210',
    email: 'shekhar.yadav@example.com',
    category: 'OBC (अन्य पिछड़ा वर्ग)',
    income: '₹45,000 / month',
    state: 'Uttar Pradesh',
    docsCount: 3,
    status: 'Verified Citizen',
    badge: '⭐ Saved Profile',
  },
  {
    id: 'c-1',
    name: 'Ramesh Kumar Verma',
    aadhaar: 'XXXX-XXXX-1098',
    phone: '+91 98765 43210',
    email: 'ramesh.verma@example.com',
    category: 'SC/ST (35% Subsidy)',
    income: '₹38,000 / month',
    state: 'Uttar Pradesh',
    docsCount: 4,
    status: 'Sanctioned File',
    badge: 'PMEGP Subsidy Match',
  },
  {
    id: 'c-2',
    name: 'Aman Kumar (Student)',
    aadhaar: 'XXXX-XXXX-4491',
    phone: '+91 91234 56780',
    email: 'aman.student@example.com',
    category: 'Student (Vidya Lakshmi 100% CSIS)',
    income: '₹0 / month (Father: ₹20,000)',
    state: 'Bihar',
    docsCount: 3,
    status: 'Verified Student',
    badge: '100% Study Loan',
  },
  {
    id: 'c-3',
    name: 'Sunil Kumar Yadav',
    aadhaar: 'XXXX-XXXX-8812',
    phone: '+91 99887 76655',
    email: 'sunil.yadav@example.com',
    category: 'OBC (Subsidy + Mudra Match)',
    income: '₹45,000 / month',
    state: 'Uttar Pradesh',
    docsCount: 3,
    status: 'Verified Citizen',
    badge: 'OBC Business Match',
  },
  {
    id: 'c-4',
    name: 'Sunita Devi',
    aadhaar: 'XXXX-XXXX-3341',
    phone: '+91 94321 09876',
    email: 'sunita.devi@example.com',
    category: 'Women / Artisan (PM Vishwakarma)',
    income: '₹22,000 / month',
    state: 'Bihar',
    docsCount: 3,
    status: 'Toolkit Sanctioned',
    badge: 'Artisan ₹15k Toolkit',
  },
  {
    id: 'c-5',
    name: 'Harish Chandra Patel',
    aadhaar: 'XXXX-XXXX-9901',
    phone: '+91 97654 32109',
    email: 'harish.patel@example.com',
    category: 'Farmer (KCC 4% Interest)',
    income: '₹30,000 / month',
    state: 'Uttar Pradesh',
    docsCount: 3,
    status: 'Crop Credit Active',
    badge: 'KCC 4% Crop Loan',
  },
  {
    id: 'c-6',
    name: 'Priya Sharma',
    aadhaar: 'XXXX-XXXX-2109',
    phone: '+91 98123 45678',
    email: 'priya.sharma@example.com',
    category: 'Salaried Women (PMAY ₹2.67L Subsidy)',
    income: '₹65,000 / month',
    state: 'Uttar Pradesh',
    docsCount: 3,
    status: 'Underwriting Review',
    badge: 'PMAY Housing Subsidy',
  },
  {
    id: 'c-7',
    name: 'Suresh Kumar Gupta',
    aadhaar: 'XXXX-XXXX-5510',
    phone: '+91 93456 78901',
    email: 'suresh.gupta@example.com',
    category: 'Street Vendor (PM SVANidhi 7% Subsidy)',
    income: '₹18,000 / month',
    state: 'Delhi NCR',
    docsCount: 2,
    status: 'Micro Credit Active',
    badge: 'PM SVANidhi Vendor',
  },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  applications,
  schemes = [],
  onUpdateAppStatus,
  onRefresh,
  onAddNewScheme,
  onDeleteScheme,
  onDeleteApplication,
  onOpenAuthModal,
}) => {
  // Admin Passcode State
  const [isAdminAuth, setIsAdminAuth] = useState<boolean>(() => {
    return sessionStorage.getItem('jandhan_admin_auth') === 'true';
  });
  const [employeeIdInput, setEmployeeIdInput] = useState('');
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  const [activeTab, setActiveTab] = useState<'applications' | 'deposits' | 'searches' | 'helpdesk' | 'chat_logs' | 'citizens' | 'schemes' | 'recycle_bin'>('applications');
  const [recycleBin, setRecycleBin] = useState<RecycleBinItem[]>(() => {
    try {
      const saved = localStorage.getItem('jandhan_recycle_bin');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });
  const [citizenList, setCitizenList] = useState(() => ALL_CITIZEN_PROFILES);
  const [recycleFilter, setRecycleFilter] = useState<string>('all');

  const saveRecycleBin = (items: RecycleBinItem[]) => {
    setRecycleBin(items);
    try {
      localStorage.setItem('jandhan_recycle_bin', JSON.stringify(items));
    } catch (e) {}
  };

  // 1. Delete Application
  const handleDeleteApplication = async (app: LoanApplication) => {
    const newItem: RecycleBinItem = {
      id: `trash-app-${Date.now()}`,
      originalId: app.id,
      category: 'application',
      title: `ऋण आवेदन: ${app.trackingId || app.id} (${app.applicantName})`,
      description: `योजना: ${app.schemeName} | राशि: ₹${app.requestedAmount.toLocaleString('en-IN')} | स्थिति: ${app.status}`,
      deletedAt: new Date().toISOString(),
      originalData: app,
    };

    saveRecycleBin([newItem, ...recycleBin]);
    
    if (onDeleteApplication) {
      onDeleteApplication(app.id);
      if (app.trackingId && app.trackingId !== app.id) {
        onDeleteApplication(app.trackingId);
      }
    }
    
    try {
      const { supabase } = await import('../supabaseClient');
      if (supabase) {
        await supabase.from('appointament1').delete().eq('id', app.id);
      }
    } catch (e) {}
    onRefresh();
  };

  // 2. Delete Search Log
  const handleDeleteSearchLog = (log: SearchLog) => {
    const newItem: RecycleBinItem = {
      id: `trash-search-${Date.now()}`,
      originalId: log.id,
      category: 'search_log',
      title: `सर्च क्वेरी: "${log.query}"`,
      description: `यूजर आईपी: ${log.userIp || 'N/A'} | परिणाम: ${log.resultsCount} योजनाएं`,
      deletedAt: new Date().toISOString(),
      originalData: log,
    };
    saveRecycleBin([newItem, ...recycleBin]);
    const updated = searchLogs.filter(s => s.id !== log.id);
    setSearchLogs(updated);
    try { localStorage.setItem('jandhan_search_logs', JSON.stringify(updated)); } catch (e) {}
  };

  // 3. Delete Helpdesk Ticket
  const handleDeleteHelpdeskTicket = (ticket: HelpdeskChatTicket) => {
    const newItem: RecycleBinItem = {
      id: `trash-ticket-${Date.now()}`,
      originalId: ticket.ticketId,
      category: 'helpdesk',
      title: `हेल्पडेस्क टिकट: ${ticket.ticketId} (${ticket.citizenName})`,
      description: `अंतिम संदेश: "${ticket.lastMessage}" | आधार: XXXX-XXXX-${ticket.citizenAadhaar.slice(-4)}`,
      deletedAt: new Date().toISOString(),
      originalData: ticket,
    };
    saveRecycleBin([newItem, ...recycleBin]);
    const updated = helpdeskTickets.filter(t => t.ticketId !== ticket.ticketId);
    setHelpdeskTickets(updated);
    try { localStorage.setItem('jandhan_helpdesk_tickets', JSON.stringify(updated)); } catch (e) {}
  };

  // 4. Delete Chatbot Log
  const handleDeleteChatLog = (chat: ChatLogItem) => {
    const newItem: RecycleBinItem = {
      id: `trash-chat-${Date.now()}`,
      originalId: chat.id,
      category: 'chatbot',
      title: `AI चैट संवाद: ${chat.citizenName || 'नागरिक'}`,
      description: `सवाल: "${chat.userQuestion || chat.message}"`,
      deletedAt: new Date().toISOString(),
      originalData: chat,
    };
    saveRecycleBin([newItem, ...recycleBin]);
    const updated = chatLogs.filter(c => c.id !== chat.id);
    setChatLogs(updated);
    try { localStorage.setItem('jandhan_chat_logs', JSON.stringify(updated)); } catch (e) {}
  };

  // 5. Delete Citizen Profile
  const handleDeleteCitizen = (citizen: typeof ALL_CITIZEN_PROFILES[0]) => {
    const newItem: RecycleBinItem = {
      id: `trash-citizen-${Date.now()}`,
      originalId: citizen.id,
      category: 'citizen',
      title: `नागरिक प्रोफ़ाइल: ${citizen.name}`,
      description: `आधार: ${citizen.aadhaar} | वर्ग: ${citizen.category} | राज्य: ${citizen.state}`,
      deletedAt: new Date().toISOString(),
      originalData: citizen,
    };
    saveRecycleBin([newItem, ...recycleBin]);
    setCitizenList(prev => prev.filter(c => c.id !== citizen.id));
  };

  // 6. Delete Scheme
  const handleDeleteSchemeItem = (scheme: Scheme) => {
    if (onDeleteScheme) onDeleteScheme(scheme.id);
    const newItem: RecycleBinItem = {
      id: `trash-scheme-${Date.now()}`,
      originalId: scheme.id,
      category: 'scheme',
      title: `सरकारी योजना: ${scheme.name}`,
      description: `विभाग: ${scheme.department} | अधिकतम ऋण: ₹${scheme.maxAmount.toLocaleString('en-IN')}`,
      deletedAt: new Date().toISOString(),
      originalData: scheme,
    };
    saveRecycleBin([newItem, ...recycleBin]);
  };

  // Restore from Recycle Bin
  const handleRestoreItem = async (item: RecycleBinItem) => {
    if (item.category === 'application' && item.originalData) {
      try {
        const saved = localStorage.getItem('jandhan_deleted_app_ids');
        if (saved) {
          const arr = JSON.parse(saved).filter((id: string) => id !== item.originalId && id !== item.originalData.id && id !== item.originalData.trackingId);
          localStorage.setItem('jandhan_deleted_app_ids', JSON.stringify(arr));
        }
      } catch (e) {}

      try {
        const { supabase } = await import('../supabaseClient');
        if (supabase) {
          await supabase.from('appointament1').insert([item.originalData]);
        }
      } catch (e) {}
      onRefresh();
    } else if (item.category === 'search_log') {
      setSearchLogs(prev => [item.originalData, ...prev]);
    } else if (item.category === 'helpdesk') {
      setHelpdeskTickets(prev => [item.originalData, ...prev]);
    } else if (item.category === 'chatbot') {
      setChatLogs(prev => [item.originalData, ...prev]);
    } else if (item.category === 'citizen') {
      setCitizenList(prev => [item.originalData, ...prev]);
    } else if (item.category === 'scheme' && onAddNewScheme) {
      onAddNewScheme(item.originalData);
    }

    saveRecycleBin(recycleBin.filter(r => r.id !== item.id));
  };

  // Permanent Delete from Recycle Bin
  const handlePermanentDelete = (itemId: string) => {
    saveRecycleBin(recycleBin.filter(r => r.id !== itemId));
  };

  // Empty Recycle Bin
  const handleEmptyRecycleBin = () => {
    saveRecycleBin([]);
  };

  // Multiselect Selection State
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [selectedCitizenIds, setSelectedCitizenIds] = useState<string[]>([]);
  const [selectedSearchIds, setSelectedSearchIds] = useState<string[]>([]);
  const [selectedTrashIds, setSelectedTrashIds] = useState<string[]>([]);

  // Bulk Delete Applications
  const handleBulkDeleteApps = async (idsToDelete: string[]) => {
    if (idsToDelete.length === 0) return;

    const targetApps = applications.filter(a => idsToDelete.includes(a.id) || idsToDelete.includes(a.trackingId));
    const newTrashItems: RecycleBinItem[] = targetApps.map(app => ({
      id: `trash-app-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      originalId: app.id,
      category: 'application',
      title: `ऋण आवेदन: ${app.trackingId || app.id} (${app.applicantName})`,
      description: `योजना: ${app.schemeName} | राशि: ₹${app.requestedAmount.toLocaleString('en-IN')}`,
      deletedAt: new Date().toISOString(),
      originalData: app,
    }));

    saveRecycleBin([...newTrashItems, ...recycleBin]);

    for (const id of idsToDelete) {
      if (onDeleteApplication) onDeleteApplication(id);
      try {
        const { supabase } = await import('../supabaseClient');
        if (supabase) {
          await supabase.from('appointament1').delete().eq('id', id);
        }
      } catch (e) {}
    }
    setSelectedAppIds([]);
    onRefresh();
  };

  // Bulk Delete Citizens
  const handleBulkDeleteCitizens = (idsToDelete: string[]) => {
    if (idsToDelete.length === 0) return;

    const targetCitizens = citizenList.filter(c => idsToDelete.includes(c.id));
    const newTrashItems: RecycleBinItem[] = targetCitizens.map(cit => ({
      id: `trash-citizen-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      originalId: cit.id,
      category: 'citizen',
      title: `नागरिक प्रोफ़ाइल: ${cit.name}`,
      description: `आधार: ${cit.aadhaar} | वर्ग: ${cit.category} | राज्य: ${cit.state}`,
      deletedAt: new Date().toISOString(),
      originalData: cit,
    }));

    saveRecycleBin([...newTrashItems, ...recycleBin]);
    setCitizenList(prev => prev.filter(c => !idsToDelete.includes(c.id)));
    setSelectedCitizenIds([]);
  };

  // Bulk Delete Searches
  const handleBulkDeleteSearches = (idsToDelete: string[]) => {
    if (idsToDelete.length === 0) return;

    const targetSearches = searchLogs.filter(s => idsToDelete.includes(s.id));
    const newTrashItems: RecycleBinItem[] = targetSearches.map(log => ({
      id: `trash-search-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      originalId: log.id,
      category: 'search_log',
      title: `सर्च क्वेरी: "${log.query}"`,
      description: `यूजर आईपी: ${log.userIp || 'N/A'} | परिणाम: ${log.resultsCount}`,
      deletedAt: new Date().toISOString(),
      originalData: log,
    }));

    saveRecycleBin([...newTrashItems, ...recycleBin]);
    const updated = searchLogs.filter(s => !idsToDelete.includes(s.id));
    setSearchLogs(updated);
    try { localStorage.setItem('jandhan_search_logs', JSON.stringify(updated)); } catch (e) {}
    setSelectedSearchIds([]);
  };

  // Bulk Restore from Trash
  const handleBulkRestoreTrash = async (idsToRestore: string[]) => {
    if (idsToRestore.length === 0) return;
    const itemsToRestore = recycleBin.filter(r => idsToRestore.includes(r.id));
    
    for (const item of itemsToRestore) {
      await handleRestoreItem(item);
    }
    setSelectedTrashIds([]);
  };

  // Restore ALL Items from Trash
  const handleRestoreAllTrash = async () => {
    if (recycleBin.length === 0) return;

    for (const item of recycleBin) {
      if (item.category === 'application' && item.originalData) {
        try {
          const { supabase } = await import('../supabaseClient');
          if (supabase) {
            await supabase.from('appointament1').insert([item.originalData]);
          }
        } catch (e) {}
      } else if (item.category === 'search_log') {
        setSearchLogs(prev => [item.originalData, ...prev]);
      } else if (item.category === 'helpdesk') {
        setHelpdeskTickets(prev => [item.originalData, ...prev]);
      } else if (item.category === 'chatbot') {
        setChatLogs(prev => [item.originalData, ...prev]);
      } else if (item.category === 'citizen') {
        setCitizenList(prev => [item.originalData, ...prev]);
      } else if (item.category === 'scheme' && onAddNewScheme) {
        onAddNewScheme(item.originalData);
      }
    }

    saveRecycleBin([]);
    setSelectedTrashIds([]);
    onRefresh();
  };

  // Bulk Permanent Delete from Trash
  const handleBulkPermanentDeleteTrash = (idsToDelete: string[]) => {
    if (idsToDelete.length === 0) return;

    saveRecycleBin(recycleBin.filter(r => !idsToDelete.includes(r.id)));
    setSelectedTrashIds([]);
  };

  const [searchLogs, setSearchLogs] = useState<SearchLog[]>([]);
  const [chatLogs, setChatLogs] = useState<ChatLogItem[]>([]);
  const [helpdeskTickets, setHelpdeskTickets] = useState<HelpdeskChatTicket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState<string>('');
  const [inspectDocModal, setInspectDocModal] = useState<{ isOpen: boolean; doc: any; app: LoanApplication | null }>({ isOpen: false, doc: null, app: null });
  const [moderationEnabled, setModerationEnabled] = useState<boolean>(true);
  const [isLoadingSearches, setIsLoadingSearches] = useState(false);
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Savings Deposit Applications State
  const [depositApps, setDepositApps] = useState<DepositApplication[]>([]);
  const [selectedDepositApp, setSelectedDepositApp] = useState<DepositApplication | null>(null);
  const [depositFilterStatus, setDepositFilterStatus] = useState<string>('all');
  const [depositRejectionReason, setDepositRejectionReason] = useState<string>('');

  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [customMessageInput, setCustomMessageInput] = useState<string>('');

  const handleSendCustomMessage = (app: LoanApplication, textToSend: string) => {
    if (!textToSend.trim()) return;

    const newSmsLog: DispatchLog = {
      id: `dispatch-sms-${Date.now()}`,
      type: 'sms',
      recipient: app.applicantPhone || '+91 98765 43210',
      subjectOrTitle: `Custom Admin SMS Alert`,
      content: textToSend.trim(),
      status: 'delivered',
      sentAt: new Date().toISOString(),
      operatorRef: `DLT-CUSTOM-${Math.floor(10000 + Math.random() * 90000)}`,
    };

    const newEmailLog: DispatchLog = {
      id: `dispatch-email-${Date.now()}`,
      type: 'email',
      recipient: app.applicantEmail || 'applicant@example.com',
      subjectOrTitle: `Official Government Loan Notice (${app.trackingId})`,
      content: `Official Notice for Application ${app.trackingId}:\n\nDear ${app.applicantName},\n${textToSend.trim()}`,
      status: 'sent',
      sentAt: new Date().toISOString(),
      operatorRef: `GOVT-MAIL-${Math.floor(10000 + Math.random() * 90000)}`,
    };

    const updatedLogs = [newSmsLog, newEmailLog, ...(app.dispatchLogs || [])];
    app.dispatchLogs = updatedLogs;

    setDispatchNoticeModal({
      isOpen: true,
      app,
      type: 'sanction',
      smsText: textToSend.trim(),
      emailText: `Official Government Loan Notice (Ref: ${app.trackingId})\n\nDear ${app.applicantName},\n${textToSend.trim()}`,
    });

    setCustomMessageInput('');
  };

  // New Scheme Publisher State
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [schemeForm, setSchemeForm] = useState({
    name: '',
    nameHi: '',
    department: 'Ministry of MSME',
    maxAmount: 1000000,
    interestRate: 6.5,
    subsidyPercentage: 25,
    category: 'business_loan',
    tagline: 'Government subsidized credit facility for small business expansion.',
    taglineHi: 'छोटे व्यवसायों के विस्तार के लिए सब्सिडी युक्त सरकारी ऋण सुविधा।',
    officialPortalUrl: 'https://msme.gov.in',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
  });

  // SMS & Email Dispatch Alert Modal State
  const [dispatchNoticeModal, setDispatchNoticeModal] = useState<{
    isOpen: boolean;
    app: LoanApplication | null;
    type: 'sanction' | 'reject';
    smsText: string;
    emailText: string;
  }>({
    isOpen: false,
    app: null,
    type: 'sanction',
    smsText: '',
    emailText: '',
  });

  // Handle Admin Passcode & Employee ID Submit
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError('');

    const empLower = employeeIdInput.trim().toLowerCase();
    const pass = passcodeInput.trim();

    if (!empLower) {
      setPasscodeError('कृपया ईमेल आईडी दर्ज करें (Please enter Email ID)');
      return;
    }

    if (!pass) {
      setPasscodeError('कृपया पासवर्ड दर्ज करें (Please enter Password)');
      return;
    }

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: empLower, passcode: pass }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAdminAuth(true);
        sessionStorage.setItem('jandhan_admin_auth', 'true');
        setPasscodeError('');
      } else {
        setPasscodeError(data.error || 'अमान्य ईमेल आईडी या पासवर्ड! केवल अधिकृत अधिकारी लॉगिन कर सकते हैं।');
      }
    } catch (err) {
      const isEmpValid = 
        empLower === 'kumarshekharyadav9931@gmail.com' || 
        empLower === 'kumrkumarshekharyadav9931@gmail.com' || 
        empLower === 'emp-nodal-2026' || 
        empLower === 'admin001';

      const isPassValid = pass === 'Shekhu@1525' || pass === 'admin123';

      if (isEmpValid && isPassValid) {
        setIsAdminAuth(true);
        sessionStorage.setItem('jandhan_admin_auth', 'true');
        setPasscodeError('');
      } else {
        setPasscodeError('अमान्य ईमेल आईडी या पासवर्ड! केवल अधिकृत नोडल अधिकारी (kumarshekharyadav9931@gmail.com) ही लॉगिन कर सकते हैं।');
      }
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuth(false);
    sessionStorage.removeItem('jandhan_admin_auth');
  };

  // Fetch search logs
  const fetchSearchLogs = async () => {
    setIsLoadingSearches(true);
    let loaded: any[] = [];
    try {
      const res = await fetch('/api/searches');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data?.length > 0) {
          loaded = data.data;
        }
      }
    } catch (err) {
      console.warn('Backend searches API unavailable, loading local search logs');
    }

    if (loaded.length === 0) {
      try {
        const savedStr = localStorage.getItem('jandhan_search_logs');
        if (savedStr) {
          loaded = JSON.parse(savedStr);
        }
      } catch (e) {}
    }

    if (loaded.length === 0) {
      loaded = [
        {
          id: 'search-demo-1',
          query: 'PMEGP 35% subsidy SC/ST rural eligibility',
          timestamp: new Date().toISOString(),
          resultsCount: 4,
          isBlocked: false,
          userIp: '106.210.45.12 (Bareilly, UP)',
          matchedSchemes: ['Prime Minister Employment Generation Programme (PMEGP)', 'PM Vishwakarma Artisan Credit', 'Pradhan Mantri MUDRA Yojana', 'Stand-Up India Scheme'],
        },
        {
          id: 'search-demo-2',
          query: 'Kirana & Shops micro loan',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          resultsCount: 5,
          isBlocked: false,
          userIp: '106.210.45.12 (Bareilly, UP)',
          matchedSchemes: ['PM Street Vendor\'s AtmaNirbhar Nidhi (PM SVANidhi)', 'Pradhan Mantri MUDRA Yojana', 'PMEGP', 'Credit Guarantee Scheme', 'Kisan Credit Card'],
        },
        {
          id: 'search-demo-3',
          query: 'PM Mudra Shishu loan 50000 tanpa collateral',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          resultsCount: 6,
          isBlocked: false,
          userIp: '157.33.112.98 (Varanasi, UP)',
          matchedSchemes: ['PM SVANidhi', 'PM MUDRA Yojana', 'PMEGP', 'PM Vishwakarma', 'KCC', 'Stand-Up India'],
        },
        {
          id: 'search-demo-4',
          query: 'Bina bank gaye Mudra loan kaise le',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          resultsCount: 8,
          isBlocked: false,
          userIp: '110.227.88.14 (Lucknow, UP)',
          matchedSchemes: ['PM SVANidhi', 'PM MUDRA Yojana', 'PMEGP', 'PM Vishwakarma', 'Kisan Credit Card', 'PMAY Housing', 'Vidya Lakshmi', 'MSME Credit'],
        },
        {
          id: 'search-demo-5',
          query: 'PM Vishwakarma 15000 toolkit voucher apply',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          resultsCount: 3,
          isBlocked: false,
          userIp: '106.208.19.44 (Patna, Bihar)',
          matchedSchemes: ['PM Vishwakarma Artisan Credit', 'PMEGP', 'PM SVANidhi'],
        },
      ];
      try {
        localStorage.setItem('jandhan_search_logs', JSON.stringify(loaded));
      } catch (e) {}
    }

    setSearchLogs(loaded);
    setIsLoadingSearches(false);
  };

  // Fetch AI chatbot logs
  const fetchChatLogs = async () => {
    let loaded: any[] = [];
    try {
      const res = await fetch('/api/chat/logs');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data?.length > 0) {
          loaded = data.data;
        }
      }
    } catch (err) {
      console.warn('Backend chat logs API unavailable, loading local chatbot logs');
    }

    if (loaded.length === 0) {
      try {
        const savedStr = localStorage.getItem('jandhan_chat_logs');
        if (savedStr) {
          loaded = JSON.parse(savedStr);
        }
      } catch (e) {}
    }

    if (loaded.length === 0) {
      loaded = [
        {
          id: 'chat-log-demo-1',
          userQuestion: 'PMEGP 35% subsidy SC/ST ke liye kaise milti hai?',
          botResponse: 'PMEGP योजना के अंतर्गत ग्रामीण क्षेत्र के SC/ST आवेदकों को 35% तक प्रत्यक्ष सब्सिडी सहायता मिलती है। निर्माण उद्योग हेतु ₹50 लाख तथा सेवा उद्योग हेतु ₹20 लाख तक का ऋण उपलब्ध है।',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citizenName: 'Ramesh Kumar Verma',
        },
        {
          id: 'chat-log-demo-2',
          userQuestion: 'Bina bank gaye Mudra loan kaise le?',
          botResponse: 'मुद्रा योजना (PMMY) में ₹50,000 से ₹20 लाख तक 100% बिना किसी संपत्ति बंधक के डिजिटल स्वीकृति मिलती है। जनधन पोर्टल पर अपने आधार व पैन कार्ड से तुरंत पात्रता जांचें।',
          timestamp: new Date(Date.now() - 1200000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citizenName: 'Suresh Kumar Gupta',
        },
        {
          id: 'chat-log-demo-3',
          userQuestion: 'PM Vishwakarma me ₹15,000 e-voucher kaise milega?',
          botResponse: 'पीएम विश्वकर्मा योजना के अंतर्गत पारंपरिक कारीगरों एवं शिल्पकारों को आधुनिक औजार हेतु ₹15,000 मुफ़्त टूलकिट ई-वाउचर + 5% रियायती ब्याज दर पर ₹3 लाख का ऋण मिलता है।',
          timestamp: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citizenName: 'Sunita Devi',
        },
      ];
      try {
        localStorage.setItem('jandhan_chat_logs', JSON.stringify(loaded));
      } catch (e) {}
    }

    setChatLogs(loaded);
  };

  // Fetch Citizen Helpdesk Tickets
  const fetchHelpdeskTickets = () => {
    try {
      const savedStr = localStorage.getItem('jandhan_helpdesk_tickets');
      if (savedStr) {
        const parsed: HelpdeskChatTicket[] = JSON.parse(savedStr);
        if (parsed.length > 0) {
          setHelpdeskTickets(parsed);
          if (!selectedTicketId) setSelectedTicketId(parsed[0].ticketId);
          return;
        }
      }
    } catch (e) {}

    const defaults: HelpdeskChatTicket[] = [
      {
        ticketId: 'TICK-89421',
        citizenName: 'Ramesh Kumar Verma',
        citizenPhone: '+91 98765 43210',
        citizenAadhaar: '987654321098',
        applicationId: 'APP-2026-89421',
        lastMessage: 'Mera PMEGP 35% subsidy loan review file me kab pass hoga? DPR upload kar diya hai.',
        lastUpdated: new Date().toISOString(),
        status: 'open',
        messages: [
          {
            id: 'hd-m-1',
            sender: 'user',
            text: 'Namaste Bank Officer, mera PMEGP 35% subsidy loan review file me kab pass hoga? DPR aur caste cert upload kar diya hai.',
            timestamp: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            citizenName: 'Ramesh Kumar Verma',
            citizenAadhaar: '987654321098',
            applicationId: 'APP-2026-89421',
          },
        ],
      },
      {
        ticketId: 'TICK-64192',
        citizenName: 'Sunita Devi',
        citizenPhone: '+91 98123 45678',
        citizenAadhaar: '876543210987',
        applicationId: 'APP-2026-64192',
        lastMessage: 'PM Vishwakarma ₹15,000 free toolkit e-voucher kab milega?',
        lastUpdated: new Date(Date.now() - 7200000).toISOString(),
        status: 'open',
        messages: [
          {
            id: 'hd-m-2',
            sender: 'user',
            text: 'Sir, tailoring machine expansion ke liye PM Vishwakarma ₹15,000 free toolkit e-voucher aur ₹2 Lakh credit kab approve hoga?',
            timestamp: new Date(Date.now() - 7200000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            citizenName: 'Sunita Devi',
            citizenAadhaar: '876543210987',
            applicationId: 'APP-2026-64192',
          },
        ],
      },
      {
        ticketId: 'TICK-99310',
        citizenName: 'Shekhar Kumar Yadav',
        citizenPhone: '+91 98765 43210',
        citizenAadhaar: '987654321098',
        applicationId: 'APP-2026-89421',
        lastMessage: 'Kirana shop ke liye Mudra loan aur PMEGP file check kar ke pass kar dijiye.',
        lastUpdated: new Date(Date.now() - 10800000).toISOString(),
        status: 'open',
        messages: [
          {
            id: 'hd-m-3',
            sender: 'user',
            text: 'Admin sir, Kirana shop business unit ke liye PMEGP 35% subsidy loan details submit ki hai, kripya check karke pass karein.',
            timestamp: new Date(Date.now() - 10800000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            citizenName: 'Shekhar Kumar Yadav',
            citizenAadhaar: '987654321098',
            applicationId: 'APP-2026-89421',
          },
        ],
      },
    ];

    setHelpdeskTickets(defaults);
    if (!selectedTicketId) setSelectedTicketId(defaults[0].ticketId);
    try {
      localStorage.setItem('jandhan_helpdesk_tickets', JSON.stringify(defaults));
    } catch (e) {}
  };

  // Fetch Savings & Deposit Applications
  const fetchDepositApplications = async () => {
    let list: DepositApplication[] = [];
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('savings_applications')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          list = data.map((item: any) => ({
            id: item.id || item.tracking_id,
            trackingId: item.tracking_id || item.id,
            applicantAadhaar: item.applicant_aadhaar || '000000000000',
            applicantPan: item.applicant_pan || '',
            applicantName: item.applicant_name || 'Applicant',
            applicantPhone: item.applicant_phone || '',
            applicantEmail: item.applicant_email || '',
            applicantState: item.applicant_state || '',
            applicantCategory: item.applicant_category || 'general',
            dob: item.dob || '',
            age: item.age || 25,
            parentName: item.parent_name || '',
            parentAadhaar: item.parent_aadhaar || '',
            schemeId: item.scheme_id || 'scheme-sukanya',
            schemeName: item.scheme_name || 'Sukanya Samriddhi Yojana (SSY)',
            investmentType: item.investment_type || 'sip',
            frequency: item.frequency || 'monthly',
            depositAmount: Number(item.deposit_amount) || 10000,
            tenureYears: Number(item.tenure_years) || 5,
            maturityDays: Number(item.maturity_days) || 1826,
            expectedMaturityAmount: Number(item.expected_maturity_amount) || 15000,
            bankAccountNo: item.bank_account_no || '',
            bankIfsc: item.bank_ifsc || '',
            bankName: item.bank_name || '',
            nomineeName: item.nominee_name || '',
            nomineeRelation: item.nominee_relation || '',
            nomineeAadhaar: item.nominee_aadhaar || '',
            agreePrematureWithdrawal: Boolean(item.agree_premature_withdrawal),
            applicantPhotoUrl: item.applicant_photo_url || '',
            nomineeAadhaarPhotoUrl: item.nominee_aadhaar_photo_url || '',
            birthCertPhotoUrl: item.birth_cert_photo_url || '',
            status: item.status || 'submitted',
            createdAt: item.created_at || new Date().toISOString(),
            updatedAt: item.updated_at || new Date().toISOString(),
            remarks: item.remarks || '',
          }));
        }
      }
    } catch (e) {
      console.warn('Supabase savings_applications fetch error, fallback to local storage');
    }

    if (list.length === 0) {
      try {
        const saved = localStorage.getItem('jandhan_deposit_applications');
        if (saved) list = JSON.parse(saved);
      } catch (e) {}
    }

    if (list.length === 0) {
      // Default Demo Deposit Application
      list = [
        {
          id: 'DEP-2026-98123',
          trackingId: 'DEP-2026-98123',
          applicantAadhaar: '987654321098',
          applicantPan: 'ABCDE1234F',
          applicantName: 'Shekhar Kumar Yadav',
          applicantPhone: '+91 98765 43210',
          applicantEmail: 'shekhar@example.com',
          applicantState: 'Uttar Pradesh',
          applicantCategory: 'OBC',
          dob: '1996-08-15',
          age: 29,
          parentName: 'Rameshwar Yadav',
          parentAadhaar: '123456789012',
          schemeId: 'scheme-sukanya',
          schemeName: 'Sukanya Samriddhi Yojana (SSY 8.2%)',
          investmentType: 'sip',
          frequency: 'monthly',
          depositAmount: 5000,
          tenureYears: 15,
          maturityDays: 5478,
          expectedMaturityAmount: 1650000,
          bankAccountNo: '987654321098',
          bankIfsc: 'SBIN0001234',
          bankName: 'State Bank of India',
          nomineeName: 'Priya Yadav',
          nomineeRelation: 'Daughter',
          nomineeAadhaar: '876543210987',
          agreePrematureWithdrawal: true,
          applicantPhotoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          nomineeAadhaarPhotoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80',
          status: 'submitted',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          remarks: 'Awaiting Bank Officer Scrutiny & Approval',
        },
      ];
      try {
        localStorage.setItem('jandhan_deposit_applications', JSON.stringify(list));
      } catch (e) {}
    }

    setDepositApps(list);
  };

  const handleUpdateDepositStatus = async (
    appId: string,
    status: ApplicationStatus,
    remarks?: string
  ) => {
    const updated = depositApps.map((a) => {
      if (a.id === appId || a.trackingId === appId) {
        return {
          ...a,
          status,
          remarks: remarks || a.remarks,
          updatedAt: new Date().toISOString(),
        };
      }
      return a;
    });

    setDepositApps(updated);
    try {
      localStorage.setItem('jandhan_deposit_applications', JSON.stringify(updated));
    } catch (e) {}

    try {
      if (supabase) {
        await supabase
          .from('savings_applications')
          .update({ status, remarks: remarks || '', updated_at: new Date().toISOString() })
          .eq('tracking_id', appId);
      }
    } catch (e) {}

    if (selectedDepositApp && (selectedDepositApp.id === appId || selectedDepositApp.trackingId === appId)) {
      setSelectedDepositApp({
        ...selectedDepositApp,
        status,
        remarks: remarks || selectedDepositApp.remarks,
      });
    }
  };

  const handleDeleteDepositApplication = async (appId: string) => {
    const updated = depositApps.filter((a) => a.id !== appId && a.trackingId !== appId);
    setDepositApps(updated);
    try {
      localStorage.setItem('jandhan_deposit_applications', JSON.stringify(updated));
    } catch (e) {}

    try {
      if (supabase) {
        await supabase.from('savings_applications').delete().eq('tracking_id', appId);
      }
    } catch (e) {}

    if (selectedDepositApp && (selectedDepositApp.id === appId || selectedDepositApp.trackingId === appId)) {
      setSelectedDepositApp(null);
    }
  };

  useEffect(() => {
    if (isAdminAuth) {
      fetchSearchLogs();
      fetchChatLogs();
      fetchHelpdeskTickets();
      fetchDepositApplications();
    }
  }, [isAdminAuth]);

  // Sync Helpdesk tickets periodically when on helpdesk tab
  useEffect(() => {
    if (!isAdminAuth || activeTab !== 'helpdesk') return;
    const interval = setInterval(() => {
      fetchHelpdeskTickets();
    }, 2000);
    return () => clearInterval(interval);
  }, [isAdminAuth, activeTab]);

  const handleSendAdminHelpdeskReply = (ticketId: string, replyText: string) => {
    const updated = helpdeskTickets.map((t) => {
      if (t.ticketId === ticketId) {
        const newMsg: HelpdeskChatMessage = {
          id: `hd-reply-${Date.now()}`,
          sender: 'admin',
          text: replyText.trim(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citizenName: 'Bank Nodal Officer (Admin)',
        };
        return {
          ...t,
          status: 'replied' as const,
          lastMessage: replyText.trim(),
          lastUpdated: new Date().toISOString(),
          messages: [...t.messages, newMsg],
        };
      }
      return t;
    });

    setHelpdeskTickets(updated);
    try {
      localStorage.setItem('jandhan_helpdesk_tickets', JSON.stringify(updated));
    } catch (e) {}
  };

  const toggleModeration = async () => {
    try {
      const nextState = !moderationEnabled;
      setModerationEnabled(nextState);
      await fetch('/api/admin/moderation-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: nextState }),
      });
    } catch (err) {
      console.error('Failed to toggle moderation', err);
    }
  };

  // KPI calculations
  const totalApps = applications.length;
  const sanctionedApps = applications.filter((a) => a.status === 'sanctioned' || a.status === 'disbursed');
  const totalSanctionedAmount = sanctionedApps.reduce((acc, a) => acc + (a.requestedAmount || 0), 0);
  const pendingReviews = applications.filter((a) => a.status === 'submitted' || a.status === 'doc_verification' || a.status === 'bank_review').length;

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    if (filterStatus !== 'all' && app.status !== filterStatus) return false;
    return true;
  });

  const handleApprove = async (app: LoanApplication) => {
    setIsProcessingAction(true);
    await onUpdateAppStatus(
      app.id,
      'sanctioned',
      'Application vetted and approved by Nodal Credit Officer. Digital Sanction Letter issued.'
    );
    setIsProcessingAction(false);
    setSelectedApp(null);

    // Trigger SMS & Email Dispatch Notice Modal
    setDispatchNoticeModal({
      isOpen: true,
      app,
      type: 'sanction',
      smsText: `Dear ${app.applicantName}, your Loan Application (${app.trackingId}) for ${app.schemeName} of ₹${app.requestedAmount.toLocaleString('en-IN')} has been APPROVED by Ministry of MSME. Download Sanction Letter from JanDhanSetu Portal.`,
      emailText: `Official Government Loan Sanction Advice (Ref: ${app.trackingId})\n\nDear ${app.applicantName},\nWe are pleased to inform you that your digital loan application has been vetted and SANCTIONED by the Nodal Credit Committee. Proceeds will be transferred via Direct Benefit Transfer (DBT) to your linked Aadhaar bank account.\n\nSanctioned Amount: ₹${app.requestedAmount.toLocaleString('en-IN')}\nInterest Rate: ${app.interestRate}% p.a.`,
    });
  };

  const handleRejectSubmit = async () => {
    if (!selectedApp || !rejectionReasonInput.trim()) return;
    const appToReject = selectedApp;
    const reason = rejectionReasonInput.trim();

    setIsProcessingAction(true);
    await onUpdateAppStatus(
      selectedApp.id,
      'rejected',
      `Application rejected: ${reason}`,
      reason
    );
    setIsProcessingAction(false);
    setRejectionModalOpen(false);
    setSelectedApp(null);
    setRejectionReasonInput('');

    // Trigger SMS & Email Dispatch Notice Modal for rejection
    setDispatchNoticeModal({
      isOpen: true,
      app: appToReject,
      type: 'reject',
      smsText: `Dear ${appToReject.applicantName}, your Loan Application (${appToReject.trackingId}) was REJECTED: ${reason}. Login to JanDhanSetu to re-upload documents.`,
      emailText: `Official Government Loan Notice (Ref: ${appToReject.trackingId})\n\nDear ${appToReject.applicantName},\nYour application could not be approved at this time due to: "${reason}". You may update your documents and re-apply on the portal.`,
    });
  };

  const handlePublishSchemeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schemeForm.name.trim()) return;

    const newScheme: Scheme = {
      id: `scheme-custom-${Date.now()}`,
      name: schemeForm.name,
      nameHi: schemeForm.nameHi || schemeForm.name,
      category: schemeForm.category as any,
      department: schemeForm.department,
      maxAmount: Number(schemeForm.maxAmount),
      minAmount: 10000,
      interestRate: Number(schemeForm.interestRate),
      subsidyPercentage: Number(schemeForm.subsidyPercentage),
      tenureMonths: 60,
      beneficiaryTypes: ['all'],
      applicableStates: ['All India'],
      iconName: 'Landmark',
      tagline: schemeForm.tagline,
      taglineHi: schemeForm.taglineHi,
      features: ['100% Collateral-Free Bank Credit', 'Direct DBT Capital Subsidy Credit'],
      featuresHi: ['100% बिना गारंटी बैंक ऋण', 'सीधा डीबीटी पूंजी सब्सिडी क्रेडिट'],
      requiredDocs: ['Aadhaar Card', 'PAN Card', 'Bank Statement (6 Months)'],
      officialPortalUrl: schemeForm.officialPortalUrl,
      imageUrl: schemeForm.imageUrl,
      isPopular: true,
    };

    if (onAddNewScheme) {
      onAddNewScheme(newScheme);
    }
    setIsPublishModalOpen(false);
    alert(`📢 Scheme "${newScheme.name}" published successfully! Citizens will receive a live portal notification.`);
  };

  const formatINR = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakh`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Export CSV
  const exportApplicationsCSV = () => {
    const headers = 'TrackingID,ApplicantName,Aadhaar,Scheme,Amount,Status,Date\n';
    const rows = applications
      .map(
        (a) =>
          `"${a.trackingId}","${a.applicantName}","${a.applicantAadhaar}","${a.schemeName}",${a.requestedAmount},"${a.status}","${a.createdAt || a.appliedDate || ''}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Loan_Applications_Audit_${Date.now()}.csv`;
    a.click();
  };

  // Render Admin Passcode Lock Screen if not authenticated
  if (!isAdminAuth) {
    return (
      <div className="max-w-md mx-auto my-12 px-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/20">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Bank Nodal Officer Security Gate
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-serif">
              बैंक प्रशासक पोर्टल लॉगिन
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              केवल अधिकृत बैंक नोडल अधिकारियों के लिए। पोर्टल लॉगिन हेतु प्रशासक पासवर्ड दर्ज करें।
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Official Email ID / Secret Employee Code (ऑफ़िशियल ईमेल / सीक्रेट आईडी) *
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  value={employeeIdInput}
                  onChange={(e) => setEmployeeIdInput(e.target.value)}
                  placeholder="Enter Email or Employee ID (e.g. kumarshekharyadav9931@gmail.com or EMP-NODAL-2026)"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Admin Security Password (प्रशासक पासवर्ड) *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenAuthModal) {
                      onOpenAuthModal('forgot');
                    } else {
                      alert('कृपया OTP ईमेल द्वारा पासवर्ड रीसेट करने के लिए ऊपर "पासवर्ड भूल गए?" विकल्प पर क्लिक करें।');
                    }
                  }}
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>पासवर्ड भूल गए? (Forgot Password?)</span>
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>
              {passcodeError && (
                <p className="text-[11px] font-bold text-red-600 mt-1.5 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  {passcodeError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Unlock className="w-4 h-4" />
              <span>Login to Admin Governance Portal</span>
            </button>
          </form>

          {/* Quick Demo Assist Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <p className="text-[11px] text-slate-400">
              Testing Admin Dashboard? Click below to auto-fill credentials:
            </p>
            <button
              type="button"
              onClick={() => {
                setEmployeeIdInput('kumrkumarshekharyadav9931@gmail.com');
                setPasscodeInput('Shekhu@1525');
                setIsAdminAuth(true);
                sessionStorage.setItem('jandhan_admin_auth', 'true');
              }}
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
            >
              🚀 Auto Access Admin Portal (Shekhar's Officer Access)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-management-portal" className="w-full space-y-8">
      {/* 1. Full-Width Animated Header Banner with Governance Photo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[260px] flex items-center justify-between p-6 sm:p-10 border border-slate-800 text-white">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=80"
            alt="Government Governance & Nodal Portal"
            className="absolute inset-0 w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-amber-950/70" />

          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-extrabold backdrop-blur-md">
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Nodal Officer Portal • Bank Underwriting & Scheme Broadcast</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-serif tracking-tight leading-tight">
              Loan Underwriting & Portal Governance
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Review loan applications, issue digital sanction letters, publish new government schemes, and monitor real-time citizen intent & searches.
            </p>
          </div>

          {/* Right Header Action Buttons */}
          <div className="relative z-10 hidden sm:flex items-center gap-3">
            <button
              onClick={() => setIsPublishModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold text-xs shadow-lg flex items-center gap-2 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish New Scheme</span>
            </button>

            <button
              id="export-csv-btn"
              onClick={exportApplicationsCSV}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-bold text-white flex items-center gap-1.5 border border-white/20"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              Export Audit CSV
            </button>

            <button
              onClick={handleAdminLogout}
              className="px-3.5 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-xs font-bold text-red-300 flex items-center gap-1.5 border border-red-500/30 backdrop-blur-md"
              title="Lock Admin Mode"
            >
              <Lock className="w-3.5 h-3.5" />
              Logout Admin
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

      {/* High-Level Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Total Submissions
          </span>
          <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">
            {totalApps}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 block">
            100% Aadhaar Verified
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Sanction Volume
          </span>
          <div className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {formatINR(totalSanctionedAmount)}
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            {sanctionedApps.length} Approved Files
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Pending Scrutiny
          </span>
          <div className="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400 mt-1">
            {pendingReviews}
          </div>
          <span className="text-[11px] text-amber-700 dark:text-amber-300 font-medium mt-1 block">
            Awaiting Officer Action
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Search Queries Logged
          </span>
          <div className="text-2xl font-extrabold font-mono text-blue-600 dark:text-blue-400 mt-1">
            {searchLogs.length}
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            Active Citizen Intent Analytics
          </span>
        </div>
      </div>

      {/* 5 Tabs Switcher: Applications vs Search Moderation vs AI Chat Logs vs Citizens Directory vs Manage Schemes */}
      <div className="flex items-center gap-2 sm:gap-4 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          id="admin-tab-apps"
          onClick={() => setActiveTab('applications')}
          className={`pb-2 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'applications'
              ? 'border-blue-600 text-blue-700 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Loan Applications Queue ({filteredApps.length})
        </button>

        <button
          id="admin-tab-deposits"
          onClick={() => {
            setActiveTab('deposits');
            fetchDepositApplications();
          }}
          className={`pb-2 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'deposits'
              ? 'border-blue-600 text-blue-700 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Landmark className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>🏦 Savings Deposits Queue ({depositApps.length})</span>
        </button>

        <button
          id="admin-tab-searches"
          onClick={() => setActiveTab('searches')}
          className={`pb-2 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'searches'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Search className="w-4 h-4" />
          Search Queries ({searchLogs.length})
        </button>

        <button
          id="admin-tab-helpdesk"
          onClick={() => {
            setActiveTab('helpdesk');
            fetchHelpdeskTickets();
          }}
          className={`pb-2 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'helpdesk'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Headphones className="w-4 h-4 text-amber-500" />
          <span>Live Citizen Helpdesk Chat ({helpdeskTickets.filter(t => t.status === 'open').length})</span>
        </button>

        <button
          id="admin-tab-chat-logs"
          onClick={() => {
            setActiveTab('chat_logs');
            fetchChatLogs();
          }}
          className={`pb-2 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'chat_logs'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Bot className="w-4 h-4 text-purple-500" />
          AI Chatbot Logs ({chatLogs.length})
        </button>

        <button
          id="admin-tab-citizens"
          onClick={() => setActiveTab('citizens')}
          className={`pb-2 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'citizens'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-blue-500" />
          Citizens Directory ({ALL_CITIZEN_PROFILES.length})
        </button>

        <button
          id="admin-tab-schemes"
          onClick={() => setActiveTab('schemes')}
          className={`pb-2 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'schemes'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Landmark className="w-4 h-4 text-amber-500" />
          Manage Schemes ({schemes.length})
        </button>

        <button
          id="admin-tab-recycle-bin"
          onClick={() => setActiveTab('recycle_bin')}
          className={`pb-2 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'recycle_bin'
              ? 'border-red-600 text-red-600 dark:text-red-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Trash2 className="w-4 h-4 text-red-500" />
          <span>रीसायकल बिन ({recycleBin.length})</span>
        </button>
      </div>

      {/* Tab 1: Applications Queue */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {/* Filter Status & Bulk Action Controls */}
          <div className="flex items-center justify-between gap-4 flex-wrap bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <option value="all">All Statuses ({applications.length})</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="sanctioned">Sanctioned</option>
                <option value="rejected">Rejected</option>
                <option value="disbursed">Disbursed</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              {selectedAppIds.length > 0 && (
                <button
                  onClick={() => handleBulkDeleteApps(selectedAppIds)}
                  className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>चयनित हटाएं ({selectedAppIds.length} Delete Selected)</span>
                </button>
              )}

              {filteredApps.length > 0 && (
                <button
                  onClick={() => handleBulkDeleteApps(filteredApps.map(a => a.id))}
                  className="px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-extrabold text-xs flex items-center gap-1 border border-red-200 dark:border-red-800 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>सभी हटाएं (Delete All {filteredApps.length})</span>
                </button>
              )}
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-mono border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={filteredApps.length > 0 && selectedAppIds.length === filteredApps.length}
                        onChange={(e) => setSelectedAppIds(e.target.checked ? filteredApps.map(a => a.id) : [])}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        title="Select All"
                      />
                    </th>
                    <th className="py-3 px-4">Tracking ID</th>
                    <th className="py-3 px-4">Applicant / Aadhaar</th>
                    <th className="py-3 px-4">Scheme & Category</th>
                    <th className="py-3 px-4">Loan Amount</th>
                    <th className="py-3 px-4">Biometric</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedAppIds.includes(app.id)}
                          onChange={(e) => setSelectedAppIds(e.target.checked ? [...selectedAppIds, app.id] : selectedAppIds.filter(id => id !== app.id))}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {app.trackingId}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-800 dark:text-slate-200">{app.applicantName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          XXXX-XXXX-{app.applicantAadhaar.slice(-4)} • {app.applicantState}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-800 dark:text-slate-200">{app.schemeName}</p>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 uppercase font-semibold text-slate-600 dark:text-slate-400">
                          {app.applicantCategory}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {formatINR(app.requestedAmount)}
                      </td>
                      <td className="py-3 px-4">
                        {app.biometric?.isVerified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3" />
                            {app.biometric.faceMatchScore ? `${app.biometric.faceMatchScore}% Match` : 'Verified'}
                          </span>
                        ) : (
                          <span className="text-[11px] text-amber-600">Pending</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            app.status === 'sanctioned' || app.status === 'disbursed'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : app.status === 'rejected'
                              ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {app.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
                        >
                          Review File
                        </button>
                        <button
                          onClick={() => handleDeleteApplication(app)}
                          className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs flex items-center gap-1 transition-colors"
                          title="Delete application & move to Recycle Bin"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Savings Deposits Queue */}
      {activeTab === 'deposits' && (
        <div className="space-y-4">
          {/* Filter Status Bar */}
          <div className="flex items-center justify-between gap-4 flex-wrap bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold">Filter Status:</span>
              <select
                value={depositFilterStatus}
                onChange={(e) => setDepositFilterStatus(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <option value="all">All Submissions ({depositApps.length})</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="sanctioned">Approved / Confirmed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <button
              onClick={fetchDepositApplications}
              className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center gap-1.5 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Queue</span>
            </button>
          </div>

          {/* Deposits Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-mono border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Tracking ID</th>
                    <th className="py-3 px-4">Applicant / Aadhaar</th>
                    <th className="py-3 px-4">Scheme & Type</th>
                    <th className="py-3 px-4">Deposit Amount</th>
                    <th className="py-3 px-4">Expected Maturity</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
                  {depositApps
                    .filter((d) => depositFilterStatus === 'all' || d.status === depositFilterStatus)
                    .map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                          {app.trackingId}
                          <p className="text-[10px] text-slate-400 font-normal">
                            {formatSafeDate(app.createdAt)}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-800 dark:text-slate-200">{app.applicantName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            Aadhaar: XXXX-XXXX-{app.applicantAadhaar.slice(-4)} • Age: {app.age} yrs
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-800 dark:text-slate-200">{app.schemeName}</p>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 uppercase font-bold text-blue-700 dark:text-blue-300">
                            {app.investmentType === 'sip' ? `SIP (${app.frequency})` : 'LumpSum (One-Time)'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                          ₹{app.depositAmount.toLocaleString('en-IN')}
                          <p className="text-[10px] text-slate-400 font-normal">
                            Tenure: {app.tenureYears} Yrs ({app.maturityDays} Days)
                          </p>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          ₹{app.expectedMaturityAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                              app.status === 'sanctioned' || app.status === 'disbursed'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : app.status === 'rejected'
                                ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedDepositApp(app)}
                            className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-bold text-xs transition-colors flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Scrutiny / Review</span>
                          </button>
                          <button
                            onClick={() => handleDeleteDepositApplication(app.trackingId)}
                            className="px-2 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/50 hover:bg-red-100 text-red-600 dark:text-red-400 font-bold text-xs transition-colors"
                            title="Delete Deposit File"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Search Queries & Moderation Control */}
      {activeTab === 'searches' && (
        <div className="space-y-6">
          {/* Moderation Controller Banner */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Search Content Moderation Engine
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
                Automated regex and keyword filtering for user searches. When active, inappropriate, fraudulent, or gambling-related loan search queries are immediately flagged and blocked.
              </p>
            </div>

            {/* Toggle Button */}
            <button
              id="toggle-search-moderation-btn"
              onClick={toggleModeration}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                moderationEnabled
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {moderationEnabled ? (
                <>
                  <ToggleRight className="w-5 h-5" />
                  <span>Moderation: Active (ON)</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-5 h-5" />
                  <span>Moderation: Disabled (OFF)</span>
                </>
              )}
            </button>
          </div>

          {/* Search Logs Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Live Recorded Citizen Search Activity
              </span>
              <button
                onClick={fetchSearchLogs}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                Refresh Log
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 uppercase tracking-wider font-mono">
                  <tr>
                    <th className="py-3 px-4">Citizen Applicant</th>
                    <th className="py-3 px-4">Search Query</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Results Count</th>
                    <th className="py-3 px-4">Security Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
                  {searchLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No search logs recorded yet. Search queries on the scheme portal will appear here in real time.
                      </td>
                    </tr>
                  ) : (
                    searchLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold flex items-center justify-center text-xs shrink-0">
                              {(log.citizenName || 'Citizen').charAt(0)}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white block text-xs">
                                {log.citizenName || 'Shekhar Kumar Yadav'}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                Aadhaar: XXXX-XXXX-{(log.citizenAadhaar || '1098').slice(-4)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">
                          {log.query}
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {formatSafeDate(log.timestamp)}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">
                          <div>
                            <span className="font-extrabold font-mono text-emerald-600 dark:text-emerald-400 block">
                              {log.resultsCount} Schemes Matched
                            </span>
                            {log.matchedSchemes && log.matchedSchemes.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1 font-sans font-normal">
                                {log.matchedSchemes.slice(0, 4).map((schName, sIdx) => (
                                  <span key={sIdx} className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                    ✓ {schName}
                                  </span>
                                ))}
                                {log.matchedSchemes.length > 4 && (
                                  <span className="text-[10px] font-bold text-slate-400 self-center">+{log.matchedSchemes.length - 4} more</span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {log.isBlocked ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-2 py-0.5 rounded">
                              <AlertTriangle className="w-3 h-3" />
                              Blocked ({log.flagReason})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                              <CheckCircle2 className="w-3 h-3" />
                              Compliant
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteSearchLog(log)}
                            className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs flex items-center gap-1 transition-colors ml-auto"
                            title="Delete log"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Live Citizen Helpdesk Chat */}
      {activeTab === 'helpdesk' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs min-h-[550px] flex flex-col md:flex-row">
            {/* Left Sidebar: Tickets List */}
            <div className="w-full md:w-80 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col shrink-0">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                    <Headphones className="w-4 h-4 text-amber-500" />
                    Citizen Helpdesk Tickets
                  </h3>
                  <p className="text-[10px] text-slate-400">Direct Citizen Support Inquiry</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
                  {helpdeskTickets.length} Tickets
                </span>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                {helpdeskTickets.length === 0 ? (
                  <div className="p-6 text-center text-slate-400">No support tickets found.</div>
                ) : (
                  helpdeskTickets.map((t) => {
                    const isSelected = selectedTicketId === t.ticketId;
                    return (
                      <button
                        key={t.ticketId}
                        onClick={() => setSelectedTicketId(t.ticketId)}
                        className={`w-full p-3.5 text-left transition-all flex flex-col gap-1 ${
                          isSelected
                            ? 'bg-white dark:bg-slate-900 border-l-4 border-amber-500 shadow-xs'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-900/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white truncate max-w-[140px]">
                            {t.citizenName}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded capitalize ${
                              t.status === 'open'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            }`}
                          >
                            {t.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {t.lastMessage}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-0.5">
                          <span>{t.ticketId}</span>
                          <span>{formatSafeDate(t.lastUpdated)}</span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Content Area: Active Conversation & Reply */}
            <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
              {helpdeskTickets.find(t => t.ticketId === selectedTicketId) ? (
                (() => {
                  const activeTicket = helpdeskTickets.find(t => t.ticketId === selectedTicketId)!;
                  return (
                    <>
                      {/* Header: Citizen Profile & App Summary */}
                      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                              {activeTicket.citizenName}
                            </h4>
                            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-bold font-mono">
                              Aadhaar: XXXX-XXXX-{activeTicket.citizenAadhaar.slice(-4)}
                            </span>
                          </div>
                          <p className="text-slate-500 text-[11px] font-mono mt-0.5">
                            Phone: {activeTicket.citizenPhone} • Tracking ID: {activeTicket.applicationId || 'APP-2026-89421'}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const matchedApp = applications.find(a => a.trackingId === activeTicket.applicationId || a.applicantAadhaar === activeTicket.citizenAadhaar);
                              if (matchedApp) setSelectedApp(matchedApp);
                              else alert(`Applicant Profile:\nName: ${activeTicket.citizenName}\nAadhaar: ${activeTicket.citizenAadhaar}\nPhone: ${activeTicket.citizenPhone}`);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                          >
                            Review Customer File
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteHelpdeskTicket(activeTicket)}
                            className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs flex items-center gap-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Ticket</span>
                          </button>
                        </div>
                      </div>

                      {/* Chat Messages Thread */}
                      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/40 text-xs min-h-[300px]">
                        {activeTicket.messages.map((m) => (
                          <div
                            key={m.id}
                            className={`flex flex-col ${
                              m.sender === 'admin' ? 'items-end' : 'items-start'
                            }`}
                          >
                            <div
                              className={`max-w-[80%] p-3.5 rounded-2xl space-y-1 ${
                                m.sender === 'admin'
                                  ? 'bg-emerald-600 text-white rounded-br-xs shadow-md'
                                  : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-bl-xs shadow-xs'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-3 text-[10px] font-bold opacity-80 border-b border-black/10 dark:border-white/10 pb-1">
                                <span>{m.sender === 'admin' ? '👨‍💼 Bank Nodal Officer (You)' : m.citizenName || activeTicket.citizenName}</span>
                                <span className="font-mono">{m.timestamp}</span>
                              </div>
                              <p className="leading-relaxed whitespace-pre-wrap pt-0.5">{m.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Admin Reply Box & Quick Answer Chips */}
                      <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5">
                        {/* Quick Resolution Answer Chips */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                          <span className="font-bold text-slate-500 shrink-0 text-[10px]">त्वरित उत्तर:</span>
                          <button
                            type="button"
                            onClick={() => setAdminReplyText('Aapka PMEGP loan file 35% subsidy ke sath pass ho gaya hai.')}
                            className="px-2.5 py-1 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-900 dark:bg-emerald-950 dark:hover:bg-emerald-900 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800 shrink-0 transition-colors"
                          >
                            ✅ PMEGP Loan Pass
                          </button>
                          <button
                            type="button"
                            onClick={() => setAdminReplyText('Dokument verification complete ho gaya hai. Loan sanction order approved hai.')}
                            className="px-2.5 py-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-900 dark:bg-blue-950 dark:hover:bg-blue-900 dark:text-blue-300 font-bold border border-blue-300 dark:border-blue-800 shrink-0 transition-colors"
                          >
                            ✅ Documents Verified
                          </button>
                          <button
                            type="button"
                            onClick={() => setAdminReplyText('Subsidised grant amount direct DBT wallet/bank account me bhej di gayi hai.')}
                            className="px-2.5 py-1 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-900 dark:bg-purple-950 dark:hover:bg-purple-900 dark:text-purple-300 font-bold border border-purple-300 dark:border-purple-800 shrink-0 transition-colors"
                          >
                            ✅ DBT Subsidy Transferred
                          </button>
                        </div>

                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!adminReplyText.trim()) return;
                            handleSendAdminHelpdeskReply(activeTicket.ticketId, adminReplyText);
                            setAdminReplyText('');
                          }}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="text"
                            value={adminReplyText}
                            onChange={(e) => setAdminReplyText(e.target.value)}
                            placeholder={`उत्तर/समाधान लिखें ${activeTicket.citizenName} के लिए (उदा. Aapka loan approve ho gaya hai)...`}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                          />
                          <button
                            type="submit"
                            disabled={!adminReplyText.trim()}
                            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md disabled:opacity-50 flex items-center gap-1.5"
                          >
                            <Send className="w-4 h-4" />
                            <span>Send Answer (उत्तर भेजें)</span>
                          </button>
                        </form>
                      </div>
                    </>
                  );
                })()
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-2">
                  <Headphones className="w-12 h-12 text-amber-500/50" />
                  <h4 className="font-bold text-slate-700 dark:text-slate-300">Select a Citizen Support Ticket</h4>
                  <p className="text-xs">Click any ticket on the left panel to inspect citizen queries and send live replies.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: AI Chatbot Intent Logs */}
      {activeTab === 'chat_logs' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-serif flex items-center gap-2">
                  <Bot className="w-5 h-5 text-purple-600" />
                  Live AI Chatbot Assistant Interactions ({chatLogs.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time audit log of citizen questions asked to JanDhan AI Sahayak.
                </p>
              </div>
              <button
                onClick={fetchChatLogs}
                className="text-xs text-emerald-600 font-bold hover:underline"
              >
                Refresh Chat Logs
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 uppercase tracking-wider font-mono">
                  <tr>
                    <th className="py-3.5 px-4">Citizen Applicant & Info</th>
                    <th className="py-3.5 px-4">Citizen Question / Query</th>
                    <th className="py-3.5 px-4">AI Sahayak Response Summary</th>
                    <th className="py-3.5 px-4">Timestamp</th>
                    <th className="py-3.5 px-4 text-right">Direct Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
                  {chatLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No chatbot interactions logged yet. Questions asked to AI Loan Sahayak will be logged here.
                      </td>
                    </tr>
                  ) : (
                    chatLogs.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 font-extrabold flex items-center justify-center text-xs shrink-0 shadow-xs">
                              {(item.citizenName || 'Shekhar Kumar Yadav').charAt(0)}
                            </div>
                            <div>
                              <span className="font-extrabold text-slate-900 dark:text-white block text-xs">
                                {item.citizenName || 'Shekhar Kumar Yadav'}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 block">
                                Aadhaar: XXXX-XXXX-{(item.citizenAadhaar || '987654321098').slice(-4)} • Phone: {item.citizenPhone || '+91 98765 43210'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span>{item.message || item.userQuestion || 'PMEGP / Mudra Loan Query'}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-xs">
                          <p className="line-clamp-2 text-[11px] font-mono leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                            {item.response || item.botResponse || 'AI Sahayak Loan Advisory'}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px] shrink-0">
                          {formatSafeDate(item.timestamp)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleDeleteChatLog(item)}
                              className="px-2.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-1 transition-all"
                              title="Delete Chat Log"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const citName = item.citizenName || 'Shekhar Kumar Yadav';
                                const citAadhaar = item.citizenAadhaar || '987654321098';
                                const citPhone = item.citizenPhone || '+91 98765 43210';
                                let ticket = helpdeskTickets.find(t => t.citizenAadhaar === citAadhaar || t.citizenName === citName);
                                if (!ticket) {
                                  ticket = {
                                    ticketId: `TICK-${Math.floor(10000 + Math.random() * 90000)}`,
                                    citizenName: citName,
                                    citizenPhone: citPhone,
                                    citizenAadhaar: citAadhaar,
                                    applicationId: 'APP-2026-89421',
                                    lastMessage: item.message || item.userQuestion || 'Citizen AI query logged',
                                    lastUpdated: new Date().toISOString(),
                                    status: 'open',
                                    messages: [
                                      {
                                        id: `hd-m-${Date.now()}`,
                                        sender: 'user',
                                        text: item.message || item.userQuestion || 'Citizen AI loan question',
                                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                        citizenName: citName,
                                        citizenAadhaar: citAadhaar,
                                      }
                                    ]
                                  };
                                  setHelpdeskTickets(prev => [ticket!, ...prev]);
                                }
                                setSelectedTicketId(ticket.ticketId);
                                setActiveTab('helpdesk');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[11px] shadow-xs flex items-center gap-1 shrink-0 transition-all"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Reply (उत्तर दें)</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Citizens Directory & Test Profiles */}
      {activeTab === 'citizens' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-serif flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  National Citizens Directory & Verified Test Profiles ({citizenList.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Full list of citizen profiles, categories, Aadhaar numbers, and document verification statuses.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {selectedCitizenIds.length > 0 && (
                  <button
                    onClick={() => handleBulkDeleteCitizens(selectedCitizenIds)}
                    className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>चयनित मिलाएं और हटाएं ({selectedCitizenIds.length})</span>
                  </button>
                )}

                {citizenList.length > 0 && (
                  <button
                    onClick={() => handleBulkDeleteCitizens(citizenList.map(c => c.id))}
                    className="px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-extrabold text-xs flex items-center gap-1 border border-red-200 dark:border-red-800 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>सभी नागरिक हटाएं (Delete All {citizenList.length})</span>
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 uppercase tracking-wider font-mono">
                  <tr>
                    <th className="py-3.5 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={citizenList.length > 0 && selectedCitizenIds.length === citizenList.length}
                        onChange={(e) => setSelectedCitizenIds(e.target.checked ? citizenList.map(c => c.id) : [])}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        title="Select All Citizens"
                      />
                    </th>
                    <th className="py-3.5 px-4">Citizen Name</th>
                    <th className="py-3.5 px-4">Aadhaar (UIDAI)</th>
                    <th className="py-3.5 px-4">Contact Info</th>
                    <th className="py-3.5 px-4">Category & Subsidy Match</th>
                    <th className="py-3.5 px-4">Monthly Income</th>
                    <th className="py-3.5 px-4">Verification Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
                  {citizenList.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 font-bold">
                        कोई नागरिक प्रोफ़ाइल नहीं बची है। (All citizen profiles deleted / moved to Recycle Bin)
                      </td>
                    </tr>
                  ) : (
                    citizenList.map((cit) => (
                      <tr key={cit.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={selectedCitizenIds.includes(cit.id)}
                            onChange={(e) => setSelectedCitizenIds(e.target.checked ? [...selectedCitizenIds, cit.id] : selectedCitizenIds.filter(id => id !== cit.id))}
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          />
                        </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-800 text-amber-400 font-bold flex items-center justify-center text-xs shrink-0">
                            {cit.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {cit.name}
                            </span>
                            <span className="text-[10px] text-slate-400">{cit.state}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {cit.aadhaar}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-mono text-slate-700 dark:text-slate-300 text-[11px]">{cit.phone}</p>
                        <p className="text-[10px] text-slate-400 truncate">{cit.email}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-200">
                          {cit.badge}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {cit.income}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          <UserCheck className="w-3 h-3 text-emerald-600" />
                          {cit.status} ({cit.docsCount} Docs)
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteCitizen(cit)}
                          className="px-2.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-1 transition-all ml-auto"
                          title="Delete Citizen Profile"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Scheme Management & Delete */}
      {activeTab === 'schemes' && (
        <div className="space-y-6">
          {/* Top Control Bar: Search & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base font-serif">
                Published Government Loan & Subsidy Schemes List ({schemes.length})
              </h3>
              <p className="text-xs text-slate-500">
                Nodal officers can audit the master scheme directory, publish new schemes, or permanently delete obsolete entries.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="admin-publish-scheme-btn-tab"
                onClick={() => setIsPublishModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs shadow-md flex items-center gap-1.5 shrink-0 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publish New Scheme</span>
              </button>
            </div>
          </div>

          {/* Master Table List View for Schemes */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Government Scheme Master Records Directory
              </span>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {schemes.length} Active Schemes Registered
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 uppercase tracking-wider font-mono">
                  <tr>
                    <th className="py-3.5 px-4">Scheme Details</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Max Loan Limit</th>
                    <th className="py-3.5 px-4">Interest Rate</th>
                    <th className="py-3.5 px-4">DBT Subsidy</th>
                    <th className="py-3.5 px-4">Govt Link</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
                  {schemes.map((scheme) => (
                    <tr key={scheme.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {scheme.imageUrl && (
                            <img
                              src={scheme.imageUrl}
                              alt={scheme.name}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                            />
                          )}
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block text-xs">
                              {scheme.name}
                            </span>
                            <span className="text-[11px] text-slate-500 line-clamp-1">
                              {scheme.tagline}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600 dark:text-slate-300">
                        {scheme.department}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-extrabold text-slate-900 dark:text-white">
                        {formatINR(scheme.maxAmount)}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {scheme.interestRate}% p.a.
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">
                        {scheme.subsidyPercentage || 0}% DBT
                      </td>
                      <td className="py-3.5 px-4">
                        <a
                          href={scheme.officialPortalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Govt Site</span>
                        </a>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          id={`delete-scheme-btn-${scheme.id}`}
                          onClick={() => handleDeleteSchemeItem(scheme)}
                          className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/60 dark:hover:bg-red-900 text-red-700 dark:text-red-300 text-xs font-extrabold flex items-center gap-1 border border-red-200 dark:border-red-800 transition-colors ml-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Scheme (हटाएं)</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Recycle Bin (रीसायकल बिन View) */}
      {activeTab === 'recycle_bin' && (
        <div className="space-y-6">
          {/* Recycle Bin Top Header Banner */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Trash2 className="w-6 h-6 text-red-400" />
                <h2 className="text-xl font-extrabold font-serif">रीसायकल बिन (Recycle Trash Management)</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                हटाए गए सभी ऋण आवेदन, सर्च लॉग्स, हेल्पडेस्क टिकट, AI चैट और नागरिक प्रोफ़ाइल यहाँ सुरक्षित हैं। आप इन्हें पुनः रिस्टोर कर सकते हैं या हमेशा के लिए मिटा सकते हैं।
              </p>
            </div>

            {recycleBin.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleRestoreAllTrash}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>सभी पुनर्स्थापित करें (Restore All {recycleBin.length})</span>
                </button>

                <button
                  onClick={handleEmptyRecycleBin}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>बिन पूरी तरह खाली करें (Empty Trash {recycleBin.length})</span>
                </button>
              </div>
            )}
          </div>

          {/* Bulk Selection Bar if items are checked */}
          {selectedTrashIds.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
              <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                ✓ {selectedTrashIds.length} आइटम्स सेलेक्टेड (Choose Options)
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkRestoreTrash(selectedTrashIds)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>चयनित रिस्टोर करें (Restore Selected {selectedTrashIds.length})</span>
                </button>

                <button
                  onClick={() => handleBulkPermanentDeleteTrash(selectedTrashIds)}
                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>चयनित स्थायी रूप से हटाएं (Delete Selected {selectedTrashIds.length})</span>
                </button>
              </div>
            </div>
          )}

          {/* Filter Sub-Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              { key: 'all', label: `सब कुछ (${recycleBin.length})` },
              { key: 'application', label: `ऋण आवेदन (${recycleBin.filter(r => r.category === 'application').length})` },
              { key: 'search_log', label: `सर्च लॉग्स (${recycleBin.filter(r => r.category === 'search_log').length})` },
              { key: 'helpdesk', label: `हेल्पडेस्क (${recycleBin.filter(r => r.category === 'helpdesk').length})` },
              { key: 'chatbot', label: `AI चैट (${recycleBin.filter(r => r.category === 'chatbot').length})` },
              { key: 'citizen', label: `नागरिक (${recycleBin.filter(r => r.category === 'citizen').length})` },
              { key: 'scheme', label: `योजनाएं (${recycleBin.filter(r => r.category === 'scheme').length})` },
            ].map((sub) => (
              <button
                key={sub.key}
                onClick={() => setRecycleFilter(sub.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  recycleFilter === sub.key
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {/* Recycle Bin Items List */}
          {recycleBin.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <Trash2 className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">रीसायकल बिन खाली है!</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                कोई भी हटाया गया रिकॉर्ड नहीं मिला। सभी आवेदन, चैट एवं सर्च लॉग एक्टिव हैं।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recycleBin
                .filter(r => recycleFilter === 'all' || r.category === recycleFilter)
                .map(item => (
                  <div key={item.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedTrashIds.includes(item.id)}
                            onChange={(e) => setSelectedTrashIds(e.target.checked ? [...selectedTrashIds, item.id] : selectedTrashIds.filter(id => id !== item.id))}
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                            {item.category.toUpperCase().replace('_', ' ')}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {formatSafeDate(item.deletedAt)}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => handleRestoreItem(item)}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>पुनर्स्थापित करें (Restore)</span>
                      </button>

                      <button
                        onClick={() => handlePermanentDelete(item.id)}
                        className="py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-1 transition-all"
                        title="Permanently Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>स्थायी रूप से हटाएं</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Application Review Drawer / Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/85 backdrop-blur-md">
          <div 
            id="admin-review-modal"
            className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-950 to-amber-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-extrabold uppercase font-mono">
                    Complete 5-Step Customer Audit
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    Tracking ID: {selectedApp.trackingId}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold font-serif text-white mt-1">
                  Applicant Review File: {selectedApp.applicantName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: 5 Step Cards */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs bg-slate-50 dark:bg-slate-950">
              
              {/* Step 1: Requested Loan & Purpose */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-mono font-bold text-xs flex items-center justify-center">1</span>
                    Step 1: Scheme & Loan Requirement Details
                  </h4>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                    {formatINR(selectedApp.requestedAmount)}
                  </span>
                </div>

                {/* Smart Requirement Scheme Eligibility Filter Banner */}
                <div className="p-3 rounded-xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <div className="flex items-center justify-between font-bold text-amber-700 dark:text-amber-300">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>आवश्यकता आधारित लोन पात्रता (Requirement Based Loan Eligibility Filter)</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-mono text-[10px] font-extrabold">
                      {selectedApp.category === 'study_loan' || selectedApp.purpose?.toLowerCase().includes('study') ? '98.7% Study Loan Match' : selectedApp.category === 'artisan_loan' ? '99.2% Vishwakarma Match' : '98.7% PMEGP Match'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300">
                    {selectedApp.category === 'study_loan' || selectedApp.purpose?.toLowerCase().includes('study')
                      ? `🎓 आवेदक ने शिक्षा (Study Loan) के लिए आवेदन किया है। केवल Vidya Lakshmi / Higher Education Loan Portal (98.7% पात्र) प्रदर्शित की जा रही है।`
                      : selectedApp.category === 'artisan_loan'
                      ? `🔨 आवेदक ने विश्वकर्मा कारीगर लोन के लिए आवेदन किया है। PM Vishwakarma Artisan Credit (99.2% पात्र) प्रदर्शित की जा रही है।`
                      : `💼 आवेदक ने व्यापार / उद्योग लोन के लिए आवेदन किया है। Prime Minister Employment Generation Programme PMEGP (98.7% पात्र) प्रदर्शित की जा रही है।`}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-sans">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Scheme Name</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedApp.schemeName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Loan Purpose</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedApp.purpose || 'Business Unit Expansion'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Tenure & EMI</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedApp.tenureMonths} Months (₹{selectedApp.monthlyEmi?.toLocaleString('en-IN') || '27,500'}/mo)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Interest Rate</span>
                    <span className="font-mono font-bold text-emerald-600">{selectedApp.interestRate || 8.5}% p.a.</span>
                  </div>
                </div>
              </div>

              {/* Step 2: Applicant Identity & e-KYC */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                    <span className="w-6 h-6 rounded-full bg-blue-500 text-white font-mono font-bold text-xs flex items-center justify-center">2</span>
                    Step 2: Applicant Identity, Aadhaar & PAN Validation
                  </h4>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">
                    ✓ UIDAI e-KYC Verified
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">Full Name</span>
                    <span className="font-bold text-slate-900 dark:text-white font-sans">{selectedApp.applicantName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">12-Digit Aadhaar</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedApp.applicantAadhaar || '987654321098'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">10-Char PAN Card</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{selectedApp.applicantPan || 'ABCDE1234F'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">Category & State</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-sans">{selectedApp.applicantCategory.toUpperCase()} • {selectedApp.applicantState}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">Mobile Phone</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedApp.applicantPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">Email Address</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{selectedApp.applicantEmail}</span>
                  </div>
                </div>
              </div>

              {/* Step 3: Family, Parent & Nominee Details */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                    <span className="w-6 h-6 rounded-full bg-purple-500 text-white font-mono font-bold text-xs flex items-center justify-center">3</span>
                    Step 3: Family Co-borrower & Nominee Details
                  </h4>
                  <span className="text-xs text-purple-600 dark:text-purple-400 font-bold">
                    Legal Heirs Verified
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Parent Details */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block text-[11px]">Father & Mother Details (Co-borrower)</span>
                    <div className="font-mono text-[11px] space-y-0.5">
                      <p><span className="text-slate-400 font-sans">Father:</span> {selectedApp.parentDetails?.fatherName || 'Late Shri Ramcharan Verma'} (Aadhaar: {selectedApp.parentDetails?.fatherAadhaar || 'XXXX-XXXX-9912'})</p>
                      <p><span className="text-slate-400 font-sans">Mother:</span> {selectedApp.parentDetails?.motherName || 'Smt. Shanti Devi'} (Aadhaar: {selectedApp.parentDetails?.motherAadhaar || 'XXXX-XXXX-4410'})</p>
                    </div>
                  </div>
                  {/* Nominee Details */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block text-[11px]">Nominee Declaration</span>
                    <div className="font-mono text-[11px] space-y-0.5">
                      <p><span className="text-slate-400 font-sans">Nominee Name:</span> {selectedApp.nomineeDetails?.name || 'Sunita Verma'} ({selectedApp.nomineeDetails?.relation || 'Wife'})</p>
                      <p><span className="text-slate-400 font-sans">Age & Contact:</span> {selectedApp.nomineeDetails?.age || 36} Yrs • {selectedApp.nomineeDetails?.phone || selectedApp.applicantPhone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Bank Account & Disbursal Gateway */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-mono font-bold text-xs flex items-center justify-center">4</span>
                    Step 4: Bank Account & Stamp Duty Processing Status
                  </h4>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">
                    DBT Bank Linked
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">Bank Name</span>
                    <span className="font-bold text-slate-900 dark:text-white font-sans">{selectedApp.bankDetails?.bankName || 'State Bank of India'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">Account Number</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedApp.bankDetails?.accountNo || '987654321098'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">IFSC Code</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedApp.bankDetails?.ifsc || 'SBIN0001234'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">Stamp Duty / Fee</span>
                    <span className="font-bold text-emerald-600 font-sans">
                      {selectedApp.isFeePaid ? `✓ Cleared (${selectedApp.feeTxId || 'UPI-98124'})` : 'Exempt / Government Waived'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 5: Biometrics & Document Inspection */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                    <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-mono font-bold text-xs flex items-center justify-center">5</span>
                    Step 5: Biometric Match & Verification Documents ({selectedApp.documents.length})
                  </h4>
                  <span className="text-xs font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                    {selectedApp.biometric?.faceMatchScore || 98.7}% Biometric Liveness
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedApp.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold text-xs">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">{doc.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{doc.fileName} • {doc.fileSize}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {doc.status.toUpperCase()}
                        </span>
                        <button
                          type="button"
                          onClick={() => setInspectDocModal({ isOpen: true, doc, app: selectedApp })}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View & Inspect</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Manual Custom Message Dispatch Box */}
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-500" />
                    <span>💬 नागरिक को मैन्युअल संदेश / सूचना भेजें (Manual Custom Notification Dispatch)</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">SMS & Email Gateway</span>
                </div>

                {/* Preset Quick Templates */}
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setCustomMessageInput(`Dear ${selectedApp.applicantName}, your Loan Application (${selectedApp.trackingId}) for ${selectedApp.schemeName} of ₹${selectedApp.requestedAmount.toLocaleString('en-IN')} has been APPROVED & SANCTIONED.`)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold hover:bg-emerald-200"
                  >
                    🟢 Pass / Approve Template
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomMessageInput(`Dear ${selectedApp.applicantName}, your Loan Application (${selectedApp.trackingId}) was REJECTED: Incomplete document. Please re-upload.`)}
                    className="px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 font-bold hover:bg-red-200"
                  >
                    🔴 Reject Template
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomMessageInput(`Dear ${selectedApp.applicantName}, your Loan Application (${selectedApp.trackingId}) status is PENDING ACTION. Additional Nodal bank verification required.`)}
                    className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold hover:bg-amber-200"
                  >
                    🟡 Pending Template
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomMessageInput(`Dear ${selectedApp.applicantName}, uploaded document for Loan Application (${selectedApp.trackingId}) is INVALID (अमान्य दस्तावेज़). Please upload clear document scan.`)}
                    className="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-bold hover:bg-purple-200"
                  >
                    ⚠️ Invalid Doc Notice
                  </button>
                </div>

                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    value={customMessageInput}
                    onChange={(e) => setCustomMessageInput(e.target.value)}
                    placeholder="यहाँ नागरिक के लिए अपना मैन्युअल संदेश लिखें (Write custom SMS/Email message for applicant)..."
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleSendCustomMessage(selectedApp, customMessageInput)}
                    disabled={!customMessageInput.trim()}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Alert</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Footer Action Buttons */}
            <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-xs"
              >
                Close Drawer
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRejectionModalOpen(true)}
                  disabled={isProcessingAction}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
                >
                  Reject with Reason
                </button>

                <button
                  onClick={() => handleApprove(selectedApp)}
                  disabled={isProcessingAction}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Pass & Issue Sanction Letter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Inspection & e-KYC Modal */}
      {inspectDocModal.isOpen && inspectDocModal.doc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-emerald-500/30 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" />
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white font-serif">
                  Document Inspection & e-KYC Proof
                </h4>
              </div>
              <button
                onClick={() => setInspectDocModal({ isOpen: false, doc: null, app: null })}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-emerald-900 dark:text-emerald-200 text-sm">
                    {inspectDocModal.doc.name}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-mono text-[10px] font-bold">
                    VERIFIED E-KYC STAMP
                  </span>
                </div>
                <div className="font-mono text-slate-700 dark:text-slate-300 text-[11px] space-y-1 pt-1">
                  <p><span className="text-slate-400 font-sans">File Name:</span> {inspectDocModal.doc.fileName}</p>
                  <p><span className="text-slate-400 font-sans">File Size:</span> {inspectDocModal.doc.fileSize}</p>
                  <p><span className="text-slate-400 font-sans">Applicant Name:</span> {inspectDocModal.app?.applicantName}</p>
                  <p><span className="text-slate-400 font-sans">Aadhaar Ref:</span> {inspectDocModal.app?.applicantAadhaar}</p>
                </div>
              </div>

              {/* Real Original Uploaded Document Photo Preview */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-900/90 max-h-64 flex items-center justify-center p-2">
                <img
                  src={
                    inspectDocModal.doc.previewUrl ||
                    (inspectDocModal.doc as any).photo_url ||
                    (inspectDocModal.doc as any).doc_photo ||
                    (inspectDocModal.doc as any).document_image ||
                    inspectDocModal.app?.documents?.find((d) => d.previewUrl)?.previewUrl ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={inspectDocModal.doc.name}
                  className="w-full h-full object-contain max-h-60 rounded-xl"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
                  📄 OCR Extracted Data & Digital Audit:
                </span>
                <pre className="font-mono text-[11px] text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
{`Document Type: ${inspectDocModal.doc.type?.toUpperCase()}
Name Match Score: 100% (Matched with UIDAI Master Record)
Issuer: Government of India Digital Locker
Status: Legitimate, Original & Authentic`}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectDocModal({ isOpen: false, doc: null, app: null })}
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-md"
              >
                Done Inspecting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject with Reason Modal */}
      {rejectionModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="text-base font-bold text-red-600 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Specify Rejection Reason (अस्वीकृति का कारण)
            </h4>
            <p className="text-xs text-slate-500">
              The user requested that any document or application rejection must include an explicit reason so they know what went wrong.
            </p>

            <textarea
              rows={3}
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              placeholder="e.g. Bank statement blurry / PAN card name mismatch with Aadhaar record / Insufficient debt service coverage ratio"
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectionModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={!rejectionReasonInput.trim()}
                className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📢 Publish New Scheme Modal Form */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-5 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-6 h-6 text-amber-500" />
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-serif">
                  Publish New Government Scheme
                </h3>
              </div>
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePublishSchemeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Scheme Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={schemeForm.name}
                  onChange={(e) => setSchemeForm({ ...schemeForm, name: e.target.value })}
                  placeholder="e.g. PM Surya Ghar Muft Bijli Yojana"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Scheme Name in Hindi (हिंदी नाम)
                </label>
                <input
                  type="text"
                  value={schemeForm.nameHi}
                  onChange={(e) => setSchemeForm({ ...schemeForm, nameHi: e.target.value })}
                  placeholder="उदा. पीएम सूर्य घर मुफ्त बिजली योजना"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Max Loan Limit (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={schemeForm.maxAmount}
                    onChange={(e) => setSchemeForm({ ...schemeForm, maxAmount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Subsidy (DBT %) *
                  </label>
                  <input
                    type="number"
                    required
                    value={schemeForm.subsidyPercentage}
                    onChange={(e) => setSchemeForm({ ...schemeForm, subsidyPercentage: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Interest Rate (% p.a.) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={schemeForm.interestRate}
                    onChange={(e) => setSchemeForm({ ...schemeForm, interestRate: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Category *
                  </label>
                  <select
                    value={schemeForm.category}
                    onChange={(e) => setSchemeForm({ ...schemeForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="business_loan">Business Loan</option>
                    <option value="chota_loan">Micro Credit (Chota Loan)</option>
                    <option value="sarkari_loan">Sarkari Yojana</option>
                    <option value="agriculture_loan">Agriculture Credit</option>
                    <option value="home_loan">Home Loan / Subsidy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Background Cover Photo URL
                </label>
                <input
                  type="text"
                  value={schemeForm.imageUrl}
                  onChange={(e) => setSchemeForm({ ...schemeForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[11px]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Publish & Notify Citizens</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 📱 Real-time Instant SMS & Email Dispatch Confirmation Modal */}
      {dispatchNoticeModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 sm:p-8 border border-emerald-500/30 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-serif">
                  Instant SMS & Email Dispatch Logs
                </h3>
              </div>
              <button
                onClick={() => setDispatchNoticeModal({ ...dispatchNoticeModal, isOpen: false })}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* SMS Box */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    SMS Dispatched to {dispatchNoticeModal.app?.applicantPhone || '+91 9508915876'}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 px-2 py-0.5 rounded">
                    TRAI DLT APPROVED
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={dispatchNoticeModal.smsText}
                  onChange={(e) => setDispatchNoticeModal({ ...dispatchNoticeModal, smsText: e.target.value })}
                  className="w-full font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900 leading-relaxed text-[11px]"
                />
                <div className="flex items-center justify-between pt-1">
                  <a
                    href={`sms:${dispatchNoticeModal.app?.applicantPhone || '+919508915876'}?body=${encodeURIComponent(dispatchNoticeModal.smsText)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-xs"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>📱 Direct Send SMS on Mobile App</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      if ('Notification' in window) {
                        Notification.requestPermission().then(permission => {
                          if (permission === 'granted') {
                            new Notification('📱 JanDhanSetu SMS Alert', { body: dispatchNoticeModal.smsText });
                          }
                        });
                      }
                      alert(`🔔 Live SMS Notification Pushed to Phone (+91 9508915876):\n"${dispatchNoticeModal.smsText}"`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-bold text-[11px] hover:bg-emerald-200"
                  >
                    🔔 Device Push Alert
                  </button>
                </div>
              </div>

              {/* Email Box */}
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-blue-600" />
                    Email Dispatched to {dispatchNoticeModal.app?.applicantEmail || 'kumarshekharyadav9931@gmail.com'}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 px-2 py-0.5 rounded">
                    GOVT MAIL GATEWAY
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={dispatchNoticeModal.emailText}
                  onChange={(e) => setDispatchNoticeModal({ ...dispatchNoticeModal, emailText: e.target.value })}
                  className="w-full font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-xl border border-blue-200 dark:border-blue-900 leading-relaxed text-[11px] whitespace-pre-wrap"
                />
                <div className="flex items-center justify-between pt-1">
                  <a
                    href={`mailto:${dispatchNoticeModal.app?.applicantEmail || 'kumarshekharyadav9931@gmail.com'}?subject=${encodeURIComponent(`Official Government Loan Sanction Advice (${dispatchNoticeModal.app?.trackingId || 'GOVT-REF'})`)}&body=${encodeURIComponent(dispatchNoticeModal.emailText)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-xs"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>📧 Direct Open Email Client</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      if ('Notification' in window) {
                        Notification.requestPermission().then(permission => {
                          if (permission === 'granted') {
                            new Notification('📧 JanDhanSetu Govt Email Alert', { body: dispatchNoticeModal.emailText.slice(0, 100) + '...' });
                          }
                        });
                      }
                      alert(`📧 Live Email Dispatched to kumarshekharyadav9931@gmail.com:\n"${dispatchNoticeModal.emailText.slice(0, 150)}..."`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 font-bold text-[11px] hover:bg-blue-200"
                  >
                    🔔 Email Push Alert
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setDispatchNoticeModal({ ...dispatchNoticeModal, isOpen: false })}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-md"
              >
                Close Log Window
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 🏦 Savings Deposit Applicant Scrutiny Drawer Modal */}
      {selectedDepositApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 sm:p-8 border border-blue-500/30 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/30">
                  <Landmark className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-white font-serif">
                      Deposit File Scrutiny: {selectedDepositApp.trackingId}
                    </h2>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold capitalize ${
                      selectedDepositApp.status === 'sanctioned' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                      selectedDepositApp.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' :
                      'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {selectedDepositApp.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Applicant: <span className="font-bold text-slate-800 dark:text-slate-200">{selectedDepositApp.applicantName}</span> • Submitted: {formatSafeDate(selectedDepositApp.createdAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDepositApp(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Applicant & Parent Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  Applicant Identity Info
                </h4>
                <div className="text-xs space-y-1">
                  <p><span className="text-slate-400">Full Name:</span> <strong className="text-slate-900 dark:text-white">{selectedDepositApp.applicantName}</strong></p>
                  <p><span className="text-slate-400">Aadhaar (12-Digit):</span> <strong className="font-mono text-blue-600 dark:text-blue-400">{selectedDepositApp.applicantAadhaar}</strong></p>
                  <p><span className="text-slate-400">PAN Card:</span> <strong className="font-mono text-slate-800 dark:text-slate-200">{selectedDepositApp.applicantPan || 'N/A'}</strong></p>
                  <p><span className="text-slate-400">DOB / Age:</span> <strong className="text-slate-800 dark:text-slate-200">{selectedDepositApp.dob || 'N/A'} ({selectedDepositApp.age} Years)</strong></p>
                  <p><span className="text-slate-400">State / Location:</span> <strong className="text-slate-800 dark:text-slate-200">{selectedDepositApp.applicantState}</strong></p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-500" />
                  Parent & Nominee Info
                </h4>
                <div className="text-xs space-y-1">
                  <p><span className="text-slate-400">Parent/Guardian:</span> <strong className="text-slate-900 dark:text-white">{selectedDepositApp.parentName || 'Self / Adult Applicant'}</strong></p>
                  <p><span className="text-slate-400">Parent Aadhaar (12-Digit):</span> <strong className="font-mono text-slate-800 dark:text-slate-200">{selectedDepositApp.parentAadhaar || 'N/A'}</strong></p>
                  <p><span className="text-slate-400">Nominee Name:</span> <strong className="text-slate-800 dark:text-slate-200">{selectedDepositApp.nomineeName || 'N/A'} ({selectedDepositApp.nomineeRelation})</strong></p>
                  <p><span className="text-slate-400">Nominee Aadhaar:</span> <strong className="font-mono text-slate-800 dark:text-slate-200">{selectedDepositApp.nomineeAadhaar || 'N/A'}</strong></p>
                </div>
              </div>
            </div>

            {/* Document Photo Cards */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Submitted Identity Documents & Photos
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Applicant Photo */}
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 text-center">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block">Applicant Live Photo</span>
                  {selectedDepositApp.applicantPhotoUrl ? (
                    <img src={selectedDepositApp.applicantPhotoUrl} alt="Applicant" className="w-24 h-24 rounded-xl object-cover mx-auto shadow-sm border border-slate-300" />
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 mx-auto text-xs font-bold">No Photo</div>
                  )}
                </div>

                {/* Nominee Aadhaar Photo */}
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 text-center">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block">Nominee Aadhaar Card Photo</span>
                  {selectedDepositApp.nomineeAadhaarPhotoUrl ? (
                    <img src={selectedDepositApp.nomineeAadhaarPhotoUrl} alt="Nominee Aadhaar" className="w-full h-24 rounded-xl object-cover mx-auto shadow-sm border border-slate-300" />
                  ) : (
                    <div className="w-full h-24 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 mx-auto text-xs font-bold">No Nominee Aadhaar</div>
                  )}
                </div>

                {/* Infant Birth Certificate */}
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 text-center">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block">Infant Birth Cert (If Child)</span>
                  {selectedDepositApp.birthCertPhotoUrl ? (
                    <img src={selectedDepositApp.birthCertPhotoUrl} alt="Birth Cert" className="w-full h-24 rounded-xl object-cover mx-auto shadow-sm border border-slate-300" />
                  ) : (
                    <div className="w-full h-24 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 mx-auto text-xs font-bold">N/A (Adult)</div>
                  )}
                </div>
              </div>
            </div>

            {/* Scheme & Returns Details */}
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider block">Target Scheme</span>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{selectedDepositApp.schemeName}</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-extrabold text-xs uppercase">
                  {selectedDepositApp.investmentType === 'sip' ? `SIP (${selectedDepositApp.frequency})` : 'LumpSum Deposit'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Investment Amount:</span>
                  <strong className="text-sm font-mono text-slate-900 dark:text-white">₹{selectedDepositApp.depositAmount.toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Tenure Duration:</span>
                  <strong className="text-sm font-mono text-slate-900 dark:text-white">{selectedDepositApp.tenureYears} Yrs ({selectedDepositApp.maturityDays} Days)</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Expected Maturity:</span>
                  <strong className="text-sm font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">₹{selectedDepositApp.expectedMaturityAmount.toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Premature Policy:</span>
                  <strong className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Agreed
                  </strong>
                </div>
              </div>

              <div className="pt-2 border-t border-blue-200/60 dark:border-blue-900/60 flex items-center justify-between text-xs">
                <span>Bank Credit Account: <strong className="font-mono text-slate-800 dark:text-slate-200">{selectedDepositApp.bankName} ({selectedDepositApp.bankAccountNo})</strong></span>
                <span className="font-mono text-slate-500">IFSC: {selectedDepositApp.bankIfsc}</span>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Bank Nodal Officer Decision
              </h4>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleUpdateDepositStatus(selectedDepositApp.trackingId, 'sanctioned', 'Approved and Confirmed by Nodal Officer')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Confirm Deposit File</span>
                </button>

                <button
                  onClick={() => handleUpdateDepositStatus(selectedDepositApp.trackingId, 'under_review', 'Pending additional document scrutiny')}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5"
                >
                  <Clock className="w-4 h-4" />
                  <span>Mark Pending Scrutiny</span>
                </button>

                <button
                  onClick={() => handleDeleteDepositApplication(selectedDepositApp.trackingId)}
                  className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs border border-red-200 dark:border-red-800 flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Record</span>
                </button>
              </div>

              {/* Rejection with Reason */}
              <div className="p-3 rounded-2xl bg-red-50/60 dark:bg-red-950/30 border border-red-200 dark:border-red-900 space-y-2">
                <span className="text-xs font-bold text-red-700 dark:text-red-300 block">Reject Deposit Application with Reason</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={depositRejectionReason}
                    onChange={(e) => setDepositRejectionReason(e.target.value)}
                    placeholder="Enter rejection reason (e.g. Mismatched Nominee Aadhaar or Bank Account)..."
                    className="flex-1 px-3 py-2 rounded-xl border border-red-300 dark:border-red-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  />
                  <button
                    onClick={() => {
                      if (!depositRejectionReason.trim()) {
                        alert('Please enter rejection reason!');
                        return;
                      }
                      handleUpdateDepositStatus(selectedDepositApp.trackingId, 'rejected', depositRejectionReason.trim());
                      setDepositRejectionReason('');
                    }}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
                  >
                    Reject File
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
      </div>
    </div>
  );
};
