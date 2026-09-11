import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Mic,
  MicOff,
  User, 
  ShieldCheck,
  Minimize2,
  Maximize2,
  Headphones,
  UserCheck,
  Clock,
  CheckCircle2
} from 'lucide-react';
import DOMPurify from 'dompurify';
import { SupportedLanguage, UserProfile, LoanApplication, HelpdeskChatTicket, HelpdeskChatMessage } from '../types';

interface AIChatbotProps {
  currentLang: SupportedLanguage;
  user?: UserProfile | null;
  applications?: LoanApplication[];
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({ currentLang, user, applications = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatMode, setChatMode] = useState<'ai' | 'helpdesk'>('ai');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Helpdesk Ticket State
  const [helpdeskTicket, setHelpdeskTicket] = useState<HelpdeskChatTicket | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      sender: 'bot',
      text:
        currentLang === 'hi'
          ? 'नमस्ते! मैं आपका जनधन डिजिटल ऋण सहायक (AI Loan Sahayak) हूँ। आप मुझसे PMEGP 35% सब्सिडी, मुद्रा लोन, विश्वकर्मा योजना, किसान क्रेडिट कार्ड, शिक्षा ऋण या दस्तावेज़ सत्यापन के बारे में हिंदी या इंग्लिश में कुछ भी पूछ सकते हैं।'
          : 'Namaste! I am your JanDhan AI Loan Sahayak. Ask me about Central Govt Loan Schemes, 35% Capital Subsidies, MUDRA, KCC 4%, or Document Eligibility in English, Hindi or Hinglish.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, helpdeskTicket, isOpen, chatMode]);

  // Load Helpdesk Tickets from localStorage
  const loadHelpdeskTicket = () => {
    try {
      const savedStr = localStorage.getItem('jandhan_helpdesk_tickets');
      const tickets: HelpdeskChatTicket[] = savedStr ? JSON.parse(savedStr) : [];
      
      const citizenAadhaar = user?.aadhaarNumber || '987654321098';
      let userTicket = tickets.find((t) => t.citizenAadhaar === citizenAadhaar);
      
      if (!userTicket && tickets.length > 0) {
        userTicket = tickets[0];
      }

      if (!userTicket) {
        userTicket = {
          ticketId: `TICK-${Math.floor(10000 + Math.random() * 90000)}`,
          citizenName: user?.fullName || 'Shekhar Kumar Yadav',
          citizenPhone: user?.phone || '+91 98765 43210',
          citizenAadhaar: citizenAadhaar,
          applicationId: applications.length > 0 ? applications[0].trackingId : 'APP-2026-89421',
          lastMessage: 'Portal support helpdesk initialized.',
          lastUpdated: new Date().toISOString(),
          status: 'open',
          messages: [
            {
              id: 'hd-init-1',
              sender: 'admin',
              text: 'नमस्ते! मैं बैंक नोडल अधिकारी सपोर्ट डेस्क हूँ। आप अपना कोई भी सवाल या ऋण संबंधी समस्या यहाँ लिखकर पूछ सकते हैं। जब भी नोडल अधिकारी पोर्टल खोलेंगे, आपका जवाब सीधे यहाँ दिखाई देगा।',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              citizenName: 'Bank Nodal Officer',
            },
          ],
        };
      }

      setHelpdeskTicket(userTicket);
    } catch (e) {}
  };

  useEffect(() => {
    loadHelpdeskTicket();
  }, [user]);

  // Sync Helpdesk Ticket periodically when open
  useEffect(() => {
    if (!isOpen || chatMode !== 'helpdesk') return;
    const interval = setInterval(() => {
      loadHelpdeskTicket();
    }, 2000);
    return () => clearInterval(interval);
  }, [isOpen, chatMode, user]);

  // Expert Banking Knowledge Helper for Fallback Answers
  const getLocalBankingResponse = (query: string, lang: string): string => {
    const q = query.toLowerCase();

    if (q.includes('pmegp') || q.includes('subsidy') || q.includes('सब्सिडी') || q.includes('35%')) {
      return lang === 'hi'
        ? `**PMEGP (प्रधानमंत्री रोजगार सृजन कार्यक्रम) 35% सब्सिडी की संपूर्ण जानकारी:**\n\n• **सब्सिडी दर:** ग्रामीण क्षेत्रों में SC/ST, ओबीसी (OBC), महिलाओं, दिव्यांगों व भूतपूर्व सैनिकों को **35% तक सब्सिडी** मिलती है (शहरी क्षेत्रों में 25%)। सामान्य श्रेणी हेतु ग्रामीण में 25% व शहरी में 15%।\n• **अधिकतम ऋण सीमा:** मैन्युफैक्चरिंग (निर्माण) उद्योग हेतु **₹50 लाख** तक तथा सर्विस (सेवा) उद्योग हेतु **₹20 लाख** तक।\n• **बिना गारंटी (No Collateral):** ₹10 लाख तक किसी भी संपत्ति बंधक या तीसरे पक्ष की गारंटी की आवश्यकता नहीं है (CGTMSE गारंटी)।\n• **जरूरी कागजात:** 1. आधार कार्ड 2. पैन कार्ड 3. जाति प्रमाण पत्र (SC/ST/OBC) 4. 8वीं पास मार्कशीट 5. प्रोजेक्ट रिपोर्ट (DPR)।\n\nआप इस पोर्टल पर "पात्रता चेकर" टैब में अपने कागजात जांचकर सीधे ऑनलाइन आवेदन कर सकते हैं!`
        : `**PMEGP 35% Capital Subsidy Scheme Details:**\n\n• **Subsidy Percentage:** Up to **35% Capital Subsidy** for SC/ST, OBC, Women, and Rural applicants (25% for urban). General category gets 25% rural / 15% urban.\n• **Loan Quantum:** Up to **₹50 Lakhs** for Manufacturing projects & **₹20 Lakhs** for Service sector.\n• **Zero Security:** No collateral required for loans up to ₹10 Lakhs (Covered under CGTMSE).\n• **Documents Needed:** Aadhaar Card, PAN Card, Caste Certificate, 8th Marksheet, and Project Report (DPR).\n\nYou can verify your documents and apply online directly on this portal!`;
    }

    if (q.includes('mudra') || q.includes('मुद्रा') || q.includes('chota loan') || q.includes('छोटा')) {
      return lang === 'hi'
        ? `**प्रधानमंत्री मुद्रा योजना (PMMY) की मुख्य विशेषताएं:**\n\n1. **शिशु लोन (Shishu):** ₹50,000 तक (बिना किसी प्रोसेसिंग शुल्क के तत्काल ऋण)।\n2. **किशोर लोन (Kishor):** ₹50,001 से ₹5,00,000 तक।\n3. **तरुण लोन (Tarun):** ₹5,00,001 से ₹20,00,000 तक।\n\n• **ब्याज दर:** 7.9% से 9.5% प्रति वर्ष।\n• **गारंटी:** 100% संपार्श्विक-मुक्त (NCGTC सुरक्षा)।\n• **आवश्यक कागजात:** आधार कार्ड, पैन कार्ड, बिजनेस का प्रमाण और 6 महीने की बैंक पासबुक।`
        : `**Pradhan Mantri MUDRA Yojana (PMMY) Summary:**\n\n1. **Shishu:** Up to ₹50,000 (Zero processing fees for micro enterprises).\n2. **Kishor:** ₹50,001 to ₹5,00,000.\n3. **Tarun:** ₹5,00,001 to ₹20,00,000.\n\n• **Interest Rate:** 7.9% to 9.5% p.a.\n• **Collateral:** 100% Collateral-Free (backed by NCGTC).\n• **Required Documents:** Aadhaar, PAN, Business proof, and 6-month Bank Statement.`;
    }

    if (q.includes('vishwakarma') || q.includes('विश्वकर्मा') || q.includes('artisan') || q.includes('कारीगर')) {
      return lang === 'hi'
        ? `**पीएम विश्वकर्मा योजना (PM Vishwakarma) की जानकारी:**\n\n• **रियायती ब्याज दर:** मात्र **5% निश्चित ब्याज दर** (8% सब्सिडी सरकार वहन करती है)।\n• **ऋण राशि:** 1st चरण में ₹1,00,000 (18 महीने) एवं 2nd चरण में ₹2,00,000 (30 महीने)।\n• **टूलकिट वाउचर:** आधुनिक औजार हेतु **₹15,000 निःशुल्क ई-वाउचर** अनुदान।\n• **दैनिक स्टाइपेंड:** 5 दिवसीय प्रशिक्षण अवधि में ₹500 प्रतिदिन सहायता भत्ता।`
        : `**PM Vishwakarma Scheme Highlights:**\n\n• **Subsidized Interest:** Flat **5% interest rate** (Govt provides 8% interest subvention).\n• **Loan Credit:** Tranche 1: ₹1 Lakh (18 Mo), Tranche 2: ₹2 Lakhs (30 Mo).\n• **Toolkit Voucher:** **₹15,000 Free E-Voucher** for modern toolkits.\n• **Stipend:** ₹500/day during 5-day skill training.`;
    }

    if (q.includes('kcc') || q.includes('kisan') || q.includes('किसान') || q.includes('crop') || q.includes('खेती')) {
      return lang === 'hi'
        ? `**किसान क्रेडिट कार्ड (KCC) 4% ब्याज योजना:**\n\n• **ब्याज छूट:** सामान्य ब्याज 7% है, परंतु समय पर भुगतान करने पर **3% अतिरिक्त छूट** मिलती है, जिससे प्रभावी ब्याज केवल **4% प्रति वर्ष** रह जाता है।\n• **ऋण सीमा:** ₹1.60 लाख तक बिना किसी जमीन बंधक के, तथा भूमि खतौनी पर ₹3.00 लाख तक।\n• **दस्तावेज़:** आधार कार्ड, पैन कार्ड, और जमीन की खसरा-खतौनी / खतियान की नकल।`
        : `**Kisan Credit Card (KCC) 4% Interest Scheme:**\n\n• **Effective Interest:** Base 7% p.a. - 3% prompt repayment incentive = **4% Effective Interest**.\n• **Collateral Limit:** Up to ₹1.60 Lakhs collateral-free (Up to ₹3.00 Lakhs on land records).\n• **Required Documents:** Aadhaar, PAN, and Land Record (Khasra/Khatauni).`;
    }

    if (q.includes('vidya') || q.includes('study') || q.includes('education') || q.includes('विद्या') || q.includes('पढ़ाई')) {
      return lang === 'hi'
        ? `**पीएम विद्यालक्ष्मी एवं CSIS शिक्षा ऋण योजना:**\n\n• **100% ब्याज छूट (CSIS):** कोर्स अवधि तथा 1 वर्ष के मोराटोरियम समय तक पूरा ब्याज केंद्र सरकार वहन करती है (वार्षिक आय ₹4.50 लाख तक)।\n• **ऋण सीमा:** देश में पढ़ाई हेतु ₹7.50 लाख तक (बिना किसी संपत्ति गारंटी के) एवं विदेश में पढ़ाई हेतु ₹1 करोड़ तक।\n• **माइनर छात्र:** 18 वर्ष से कम आयु के छात्र हेतु माता/पिता सह-आवेदक (Co-applicant) के रूप में आधार व आय प्रमाण पत्र संलग्न करेंगे।`
        : `**PM Vidya Lakshmi & CSIS Education Loan Scheme:**\n\n• **100% Full Interest Subsidy (CSIS):** Govt pays 100% interest during course + 1 year moratorium for families with income up to ₹4.5 Lakhs.\n• **No Guarantee Limit:** Up to ₹7.50 Lakhs collateral-free with NCEGTT guarantee.\n• **Minor Applicants:** Parents act as co-borrowers with Aadhaar and Income Proof.`;
    }

    if (q.includes('queue') || q.includes('application') || q.includes('search query') || q.includes('track') || q.includes('status') || q.includes('आवेदन') || q.includes('ट्रैक') || q.includes('स्टेटस') || q.includes('कतार') || q.includes('dbt')) {
      return lang === 'hi'
        ? `📋 **ऋण आवेदन ट्रैकिंग एवं कतार (Loan Application Queue & Tracking) स्थिति:**\n\n• **आवेदन कतार (Queue):** आपके द्वारा सबमिट किए गए सभी लोन आवेदन नोडल बैंक अधिकारी एवं एआई क्रेडिट कमेटी की कतार (Queue) में सुरक्षा जांच हेतु रजिस्टर्ड हैं।\n• **अपना आवेदन ट्रैक कैसे करें:**\n  1. ऊपर नेविगेशन बार में **"मेरा आवेदन ट्रैक करें" (My Applications)** बटन पर क्लिक करें।\n  2. अपना ट्रैकिंग आईडी (जैसे \`APP-2026-89421\`) या पंजीकृत मोबाइल नंबर दर्ज करें।\n  3. आपको अपने आवेदन की वर्तमान स्थिति (**समीक्षाधीन / Sanctioned स्वीकृत / DBT बैंक ट्रांसफर**) तथा स्वीकृति पत्र डाउनलोड लिंक दिखाई देगा।\n• **सब्सिडी क्रेडिट:** स्वीकृत राशि आधार लिंक्ड बैंक खाते में सीधे DBT (Direct Benefit Transfer) द्वारा भेजी जाती है।`
        : `📋 **Loan Application Queue & Real-Time Tracking Status:**\n\n• **Application Queue:** All submitted loan applications are registered in the National Nodal Credit Governance Queue for AI document audit and bank vetting.\n• **How to Track Your Loan:**\n  1. Click on **"My Applications" (मेरा आवेदन ट्रैक करें)** in the top navigation bar.\n  2. Enter your Tracking Reference Number (e.g. \`APP-2026-89421\`) or Aadhaar/Mobile Number.\n  3. You will view live timeline updates (**Under Review / Sanctioned / Disbursed via DBT**) and your Official Digital Sanction Letter.\n• **Direct Benefit Transfer:** Sanctioned capital subsidies are transferred directly to your Aadhaar-seeded bank account.`;
    }

    return lang === 'hi'
      ? `**जनधन एआई ऋण सहायक सलाह:**\n\n• आप भारत सरकार की मुख्य योजनाओं (PMEGP 35% सब्सिडी, मुद्रा ₹20 लाख, पीएम विश्वकर्मा 5% ब्याज, किसान क्रेडिट कार्ड 4%, पीएम विद्यालक्ष्मी शिक्षा ऋण) हेतु 100% डिजिटल ऑनलाइन आवेदन कर सकते हैं।\n• **आवेदन प्रक्रिया:** "दस्तावेज़ पात्रता चेकर" पर जाकर अपने आधार व पैन कार्ड से तुरंत पात्रता जांचें तथा बिना बैंक चक्कर लगाए आवेदन जमा करें।`
      : `**JanDhan AI Advisory:**\n\n• You can apply 100% online for all Central Govt Loan Schemes (PMEGP 35% Subsidy, MUDRA ₹20L, PM Vishwakarma 5%, KCC 4%, Vidya Lakshmi Education Loans).\n• **How to Apply:** Click "Check Eligibility", scan your Aadhaar & PAN card to receive instant digital approval!`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isLoading) return;

    if (chatMode === 'helpdesk') {
      // Direct Admin Helpdesk Chat Mode
      const citizenName = user?.fullName || 'Shekhar Kumar Yadav';
      const citizenAadhaar = user?.aadhaarNumber || '987654321098';
      const citizenPhone = user?.phone || '+91 98765 43210';
      const activeAppId = applications.length > 0 ? applications[0].trackingId : 'APP-2026-89421';

      const newMsg: HelpdeskChatMessage = {
        id: `hd-msg-${Date.now()}`,
        sender: 'user',
        text: query.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citizenName,
        citizenAadhaar,
        applicationId: activeAppId,
      };

      try {
        const savedStr = localStorage.getItem('jandhan_helpdesk_tickets');
        const tickets: HelpdeskChatTicket[] = savedStr ? JSON.parse(savedStr) : [];
        let userTicket = tickets.find((t) => t.citizenAadhaar === citizenAadhaar);

        if (userTicket) {
          userTicket.messages.push(newMsg);
          userTicket.lastMessage = query.trim();
          userTicket.lastUpdated = new Date().toISOString();
          userTicket.status = 'open';
        } else {
          userTicket = {
            ticketId: `TICK-${Math.floor(10000 + Math.random() * 90000)}`,
            citizenName,
            citizenPhone,
            citizenAadhaar,
            applicationId: activeAppId,
            lastMessage: query.trim(),
            lastUpdated: new Date().toISOString(),
            status: 'open',
            messages: [newMsg],
          };
          tickets.unshift(userTicket);
        }

        localStorage.setItem('jandhan_helpdesk_tickets', JSON.stringify(tickets));
        setHelpdeskTicket({ ...userTicket });
        setInputMessage('');

        // Provide auto acknowledgment after short delay if ticket is open
        setTimeout(() => {
          setHelpdeskTicket((prev) => {
            if (!prev) return null;
            const ackMsg: HelpdeskChatMessage = {
              id: `hd-ack-${Date.now()}`,
              sender: 'admin',
              text: '✅ आपका सवाल बैंक नोडल अधिकारी के हेल्पडेस्क पोर्टल पर दर्ज कर लिया गया है। नोडल अधिकारी आपका पूरा प्रोफाइल व लोन फ़ाइल देखकर जवाब देंगे।',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              citizenName: 'Bank Nodal Officer (System)',
            };
            return {
              ...prev,
              messages: [...prev.messages, ackMsg],
            };
          });
        }, 1200);

      } catch (e) {
        console.error('Failed to save helpdesk chat message:', e);
      }
      return;
    }

    // Standard AI Sahayak Chat Mode
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language: currentLang,
        }),
      });

      const data = await res.json();
      setIsLoading(false);

      const botReply = data.response || data.reply || getLocalBankingResponse(query, currentLang);

      const botMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      try {
        const newLog = {
          id: `chat-log-${Date.now()}`,
          message: query,
          userQuestion: query,
          response: botReply,
          botResponse: botReply,
          source: 'JanDhan AI Sahayak',
          timestamp: new Date().toISOString(),
          citizenName: user?.fullName || 'Citizen User',
        };
        const savedStr = localStorage.getItem('jandhan_chat_logs');
        const saved = savedStr ? JSON.parse(savedStr) : [];
        localStorage.setItem('jandhan_chat_logs', JSON.stringify([newLog, ...saved]));
      } catch (e) {}

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.warn('Chat API fetch issue, using trained local banking engine:', err);
      setIsLoading(false);
      const botReply = getLocalBankingResponse(query, currentLang);

      const botMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      try {
        const newLog = {
          id: `chat-log-${Date.now()}`,
          message: query,
          userQuestion: query,
          response: botReply,
          botResponse: botReply,
          source: 'JanDhan AI Sahayak',
          timestamp: new Date().toISOString(),
          citizenName: user?.fullName || 'Citizen User',
        };
        const savedStr = localStorage.getItem('jandhan_chat_logs');
        const saved = savedStr ? JSON.parse(savedStr) : [];
        localStorage.setItem('jandhan_chat_logs', JSON.stringify([newLog, ...saved]));
      } catch (e) {}

      setMessages((prev) => [
        ...prev,
        botMsg
      ]);
    }
  };

  // Voice Input (Speech Recognition)
  const handleStartVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(currentLang === 'hi' ? 'आपका ब्राउज़र वॉयस इनपुट का समर्थन नहीं करता है' : 'Voice recognition is not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = currentLang === 'hi' ? 'hi-IN' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setIsListening(false);
      handleSendMessage(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  // Text to Speech
  const handleReadAloud = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*#]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = currentLang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const quickPrompts = [
    'PMEGP 35% subsidy SC/ST ke liye kaise milti hai?',
    'Bina bank gaye Mudra loan kaise le?',
    'PM Vishwakarma 5% artisan loan ke liye kya chahiye?',
    'Study loan Vidya Lakshmi interest subsidy rules?',
  ];

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          id="ai-chatbot-floating-btn"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 p-3.5 sm:px-5 sm:py-3.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white shadow-xl shadow-emerald-700/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group ring-4 ring-emerald-500/20"
        >
          <div className="relative">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-100" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold leading-none">AI Loan & Admin Helpdesk</p>
            <p className="text-[10px] text-emerald-200 leading-tight">Instant 24/7 Answers & Admin Chat</p>
          </div>
        </button>
      )}

      {/* Click-Outside Backdrop */}
      {isOpen && !isMinimized && (
        <div
          onClick={() => {
            setIsOpen(false);
            if (isSpeaking) window.speechSynthesis.cancel();
          }}
          className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-[1px] transition-opacity cursor-pointer"
        />
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          id="ai-chatbot-window"
          className={`fixed bottom-5 right-5 z-50 w-full sm:w-96 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col transition-all duration-200 ${
            isMinimized ? 'h-16' : 'h-[600px] max-h-[85vh]'
          }`}
        >
          {/* Chat Header */}
          <div className="p-3.5 bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
                {chatMode === 'ai' ? (
                  <Bot className="w-5 h-5 text-emerald-200" />
                ) : (
                  <Headphones className="w-5 h-5 text-amber-300" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-bold flex items-center gap-1.5">
                  {chatMode === 'ai' ? 'JanDhan AI Sahayak' : 'Direct Bank Admin Helpdesk'}
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h4>
                <p className="text-[10px] text-emerald-100/90">
                  {chatMode === 'ai' ? 'Govt Scheme & Credit Intelligence' : 'Live Communication with Bank Officer'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 transition-colors"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                id="close-chat-btn"
                onClick={() => {
                  setIsOpen(false);
                  if (isSpeaking) window.speechSynthesis.cancel();
                }}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Chat Mode Switcher Tabs */}
              <div className="grid grid-cols-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs font-bold p-1">
                <button
                  type="button"
                  onClick={() => setChatMode('ai')}
                  className={`py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    chatMode === 'ai'
                      ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>AI Sahayak (एआई सहायक)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setChatMode('helpdesk');
                    loadHelpdeskTicket();
                  }}
                  className={`py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    chatMode === 'helpdesk'
                      ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Headphones className="w-3.5 h-3.5 text-amber-500" />
                  <span>Admin Helpdesk (प्रशासक चैट)</span>
                </button>
              </div>

              {/* Mode 1: Standard AI Sahayak Chat */}
              {chatMode === 'ai' && (
                <div className="relative flex-1 flex flex-col overflow-hidden">
                  {/* Stylish Chat Window Background Image */}
                  <img
                    src="https://images.unsplash.com/photo-1557683316-973673baf926?w=800&auto=format&fit=crop&q=80"
                    alt="Chatbot Background"
                    className="absolute inset-0 w-full h-full object-cover opacity-15 dark:opacity-25 pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-slate-50/85 dark:bg-slate-950/85 backdrop-blur-xs pointer-events-none" />

                  <div className="relative z-10 flex-1 p-4 overflow-y-auto space-y-3.5 text-xs font-sans">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex items-start gap-2.5 ${
                          msg.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {msg.sender === 'bot' && (
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center shrink-0 text-xs mt-0.5 shadow-md border border-emerald-400/30">
                            <Bot className="w-4 h-4" />
                          </div>
                        )}

                        <div
                          className={`max-w-[85%] p-3.5 rounded-2xl relative space-y-1.5 shadow-sm transition-all ${
                            msg.sender === 'user'
                              ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-br-xs'
                              : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200 dark:border-slate-800 shadow-md'
                          }`}
                        >
                          {/* Sender Identity Badge */}
                          <div className="flex items-center justify-between gap-2 text-[10px] font-extrabold pb-1 border-b border-black/10 dark:border-white/10">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider ${
                              msg.sender === 'user'
                                ? 'bg-white/20 text-white'
                                : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                            }`}>
                              {msg.sender === 'user' ? `👤 Citizen: ${user?.fullName?.split(' ')[0] || 'Online User'}` : '🤖 AI Sahayak (जनधन सहायक)'}
                            </span>
                            <span className="opacity-75 font-mono">{msg.timestamp}</span>
                          </div>

                          <p className="leading-relaxed whitespace-pre-wrap font-sans text-xs tracking-normal">{DOMPurify.sanitize(msg.text)}</p>
                          
                          {msg.sender === 'bot' && (
                            <div className="flex justify-end pt-1">
                              <button
                                onClick={() => handleReadAloud(msg.text)}
                                className="p-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-slate-500 hover:text-emerald-600 transition-colors flex items-center gap-1 text-[10px] font-bold"
                                title="Read Aloud"
                              >
                                {isSpeaking ? (
                                  <>
                                    <VolumeX className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                                    <span>Stop Voice</span>
                                  </>
                                ) : (
                                  <>
                                    <Volume2 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                                    <span>Listen</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        </div>
                        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 shadow-md">
                          AI Sahayak is formulating banking advisory...
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Quick Prompt Chips */}
                  <div className="relative z-10 p-2 border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs overflow-x-auto flex gap-1.5 scrollbar-none">
                    {quickPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(prompt)}
                        className="shrink-0 text-[10px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 transition-colors whitespace-nowrap font-medium"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mode 2: Direct Admin Helpdesk Two-Way Communication */}
              {chatMode === 'helpdesk' && (
                <div className="relative flex-1 flex flex-col overflow-hidden">
                  {/* Stylish Chat Window Background Image */}
                  <img
                    src="https://images.unsplash.com/photo-1557683316-973673baf926?w=800&auto=format&fit=crop&q=80"
                    alt="Helpdesk Background"
                    className="absolute inset-0 w-full h-full object-cover opacity-15 dark:opacity-25 pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-slate-50/85 dark:bg-slate-950/85 backdrop-blur-xs pointer-events-none" />

                  {/* Citizen Info Strip */}
                  <div className="relative z-10 px-3.5 py-2.5 bg-amber-500/10 dark:bg-amber-950/50 border-b border-amber-300/30 dark:border-amber-900/50 text-xs flex items-center justify-between shrink-0 backdrop-blur-xs">
                    <div className="truncate">
                      <span className="font-extrabold text-amber-900 dark:text-amber-300 block text-xs">
                        Citizen Ticket: {helpdeskTicket?.ticketId || 'TICK-NEW'}
                      </span>
                      <span className="text-slate-600 dark:text-slate-400 text-[10px] font-mono">
                        Aadhaar: XXXX-XXXX-{(helpdeskTicket?.citizenAadhaar || user?.aadhaarNumber || '1098').slice(-4)} • App: {helpdeskTicket?.applicationId || 'APP-2026-89421'}
                      </span>
                    </div>
                    <span className="shrink-0 px-2.5 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] shadow-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      Live Admin Link
                    </span>
                  </div>

                  {/* Helpdesk Message History */}
                  <div className="relative z-10 flex-1 p-3.5 overflow-y-auto space-y-3.5 text-xs font-sans">
                    {helpdeskTicket?.messages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex flex-col ${
                          m.sender === 'user' ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div
                          className={`max-w-[88%] p-3.5 rounded-2xl space-y-1.5 shadow-md ${
                            m.sender === 'user'
                              ? 'bg-gradient-to-r from-amber-600 to-orange-700 text-white rounded-br-xs'
                              : 'bg-gradient-to-r from-slate-900 to-emerald-950 text-emerald-100 rounded-bl-xs border border-emerald-700/60'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3 text-[10px] font-extrabold pb-1 border-b border-white/20">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider ${
                              m.sender === 'user' ? 'bg-white/20 text-white' : 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/30'
                            }`}>
                              {m.sender === 'user' ? `👤 Citizen: ${user?.fullName || m.citizenName || 'Applicant'}` : '🏛️ Bank Nodal Officer (Admin)'}
                            </span>
                            <span className="opacity-75 font-mono text-[10px]">{m.timestamp}</span>
                          </div>
                          <p className="leading-relaxed whitespace-pre-wrap pt-0.5 text-xs font-sans">{m.text}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              )}

              {/* Input Box */}
              <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={handleStartVoiceInput}
                    className={`p-2.5 rounded-xl border transition-colors shrink-0 ${
                      isListening
                        ? 'bg-red-500 text-white border-red-600 animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-emerald-50 hover:text-emerald-600'
                    }`}
                    title={isListening ? 'Listening...' : 'Voice Input (बोलकर पूछें)'}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <input
                    id="chat-message-input"
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={
                      chatMode === 'helpdesk'
                        ? 'बैंक नोडल अधिकारी को सवाल भेजें (Write message for Admin)...'
                        : isListening
                        ? 'बोलिए, सुन रहे हैं...'
                        : 'Type or speak loan question...'
                    }
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  <button
                    id="send-chat-msg-btn"
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className={`p-2.5 rounded-xl text-white transition-all shrink-0 ${
                      chatMode === 'helpdesk' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
                    } disabled:opacity-50`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
