import { Scheme } from '../types';

export const INDIAN_STATES = [
  'All India',
  'Uttar Pradesh',
  'Bihar',
  'Maharashtra',
  'Rajasthan',
  'Madhya Pradesh',
  'Gujarat',
  'West Bengal',
  'Tamil Nadu',
  'Karnataka',
  'Punjab',
  'Delhi NCT',
  'Haryana',
  'Odisha',
  'Jharkhand',
  'Telangana',
  'Andhra Pradesh',
  'Kerala',
  'Assam',
  'Uttarakhand',
];

export const SCHEMES_DATA: Scheme[] = [
  // 1. Sarkari Loan - PMEGP
  {
    id: 'pmegp-2026',
    name: 'Prime Minister Employment Generation Programme (PMEGP)',
    nameHi: 'प्रधानमंत्री रोजगार सृजन कार्यक्रम (PMEGP 35% सब्सिडी)',
    category: 'sarkari_loan',
    department: 'Ministry of MSME & KVIC',
    minAmount: 100000,
    maxAmount: 5000000, // Up to 50 Lakhs for manufacturing
    interestRate: 8.5,
    subsidyPercentage: 35, // 35% for SC/ST/Women/Rural
    tenureMonths: 84,
    beneficiaryTypes: ['all', 'obc', 'sc_st', 'women'],
    applicableStates: ['All India', 'Uttar Pradesh', 'Bihar', 'Rajasthan', 'Madhya Pradesh', 'Maharashtra'],
    iconName: 'Landmark',
    tagline: 'Get up to 35% Government Subsidy for setting up micro enterprises & manufacturing units without branch visits.',
    taglineHi: 'सूक्ष्म उद्यम और उद्योग स्थापना हेतु सरकार से 35% तक प्रत्यक्ष सब्सिडी सहायता।',
    features: [
      'Up to 35% Govt. capital subsidy for SC/ST, Women and Rural applicants',
      'No collateral security required for loans up to ₹10 Lakhs under CGTMSE',
      'Manufacturing projects up to ₹50 Lakhs, Service sector up to ₹20 Lakhs',
      'Direct DBT credit into escrow bank account after online approval'
    ],
    featuresHi: [
      'SC/ST, महिलाओं और ग्रामीण उद्यमियों के लिए 35% तक सरकारी सब्सिडी',
      '₹10 लाख तक के ऋण पर किसी गारंटी/कोलैटरल की आवश्यकता नहीं',
      'विनिर्माण परियोजना हेतु ₹50 लाख और सेवा क्षेत्र हेतु ₹20 लाख तक',
      'ऑनलाइन अनुमोदन के बाद सीधे बैंक खाते में सब्सिडी जमा'
    ],
    requiredDocs: ['Aadhaar Card', 'PAN Card', 'Project Report (DPR)', 'Caste Certificate (for SC/ST)', 'Education Certificate (8th Pass+)'],
    officialPortalUrl: 'https://www.kviconline.gov.in/pmegpeportal/',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
    isPopular: true
  },

  // 2. Chota Loan - PM MUDRA Shishu / Kishor / Tarun
  {
    id: 'pm-mudra-yojana',
    name: 'Pradhan Mantri MUDRA Yojana (PMMY)',
    nameHi: 'प्रधानमंत्री मुद्रा योजना (शिशु, किशोर व तरुण ऋण)',
    category: 'chota_loan',
    department: 'Department of Financial Services (DFS)',
    minAmount: 10000,
    maxAmount: 2000000, // Up to 20 Lakhs under revised guidelines
    interestRate: 7.9,
    subsidyPercentage: 0,
    tenureMonths: 60,
    beneficiaryTypes: ['all', 'obc', 'women', 'sc_st', 'general'],
    applicableStates: ['All India'],
    iconName: 'Coins',
    tagline: 'Collateral-free instant micro credit for street vendors, shopkeepers, small artisans & start-ups.',
    taglineHi: 'छोटे व्यापारियों, कारीगरों और दुकानदारों के लिए बिना किसी गारंटी के तत्काल मुद्रा ऋण।',
    features: [
      'Shishu (up to ₹50,000), Kishor (₹50,001 to ₹5 Lakhs), Tarun (₹5L to ₹20L)',
      '100% Collateral-Free guarantee backed by National Credit Guarantee Trustee',
      'Zero processing fee for Shishu and Kishor loans',
      'Special 0.25% interest concession for women entrepreneurs'
    ],
    featuresHi: [
      'शिशु (₹50,000 तक), किशोर (₹5 लाख तक) व तरुण (₹20 लाख तक)',
      'बिना किसी संपत्ति गारंटी के 100% सुरक्षित ऋण',
      'शिशु और किशोर ऋणों पर शून्य प्रोसेसिंग फीस',
      'महिला उद्यमियों को ब्याज में 0.25% की विशेष छूट'
    ],
    requiredDocs: ['Aadhaar Card', 'PAN Card', 'Business Address Proof', 'Bank Statement (6 Months)', 'Passport Photo'],
    officialPortalUrl: 'https://www.mudra.org.in/',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
    isPopular: true
  },

  // 3. Sarkari Loan - PM Vishwakarma Kaushal Samman
  {
    id: 'pm-vishwakarma',
    name: 'PM Vishwakarma Scheme for Traditional Artisans',
    nameHi: 'पीएम विश्वकर्मा योजना (कारीगरों व शिल्पकारों हेतु 5% ब्याज)',
    category: 'sarkari_loan',
    department: 'Ministry of MSME',
    minAmount: 50000,
    maxAmount: 300000, // ₹1 Lakh first tranche, ₹2 Lakh second tranche
    interestRate: 5.0, // Highly subsidized flat 5%
    subsidyPercentage: 8, // Subsidized interest support
    tenureMonths: 36,
    beneficiaryTypes: ['all', 'sc_st', 'women', 'general'],
    applicableStates: ['All India'],
    iconName: 'Hammer',
    tagline: 'Loans at an ultra-low interest rate of 5% with ₹15,000 modern toolkit grant and skill stipend.',
    taglineHi: 'पारंपरिक कारीगरों के लिए 5% रियायती ब्याज दर पर ऋण तथा ₹15,000 टूलकिट अनुदान।',
    features: [
      'Flat 5% concessional interest rate (subsidized by Govt of India)',
      'First tranche: ₹1,00,000 (18 months), Second tranche: ₹2,00,000 (30 months)',
      '₹15,000 free e-voucher grant for modern toolkits',
      'Collateral-free with free PM Vishwakarma Digital Certificate & ID'
    ],
    featuresHi: [
      'मात्र 5% की बेहद कम ब्याज दर (शेष ब्याज सरकार वहन करेगी)',
      'प्रथम चरण में ₹1 लाख तथा दूसरे चरण में ₹2 लाख का ऋण',
      'आधुनिक टूलकिट हेतु ₹15,000 का निःशुल्क ई-वाउचर अनुदान',
      'बिना किसी गारंटी के डिजिटल प्रमाण पत्र एवं पहचान पत्र'
    ],
    requiredDocs: ['Aadhaar Card with Biometric', 'Ration Card', 'Bank Passbook', 'Artisan Trade Declaration'],
    officialPortalUrl: 'https://pmvishwakarma.gov.in/',
    imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80',
    isPopular: true
  },

  // 4. Chota Loan - PM SVANidhi (Street Vendor AtmaNirbhar Nidhi)
  {
    id: 'pm-svanidhi',
    name: 'PM SVANidhi Micro Credit Scheme',
    nameHi: 'पीएम स्वनिधि योजना (रेहड़ी-पटरी व छोटे विक्रेताओं हेतु)',
    category: 'chota_loan',
    department: 'Ministry of Housing and Urban Affairs (MoHUA)',
    minAmount: 10000,
    maxAmount: 50000, // 10k -> 20k -> 50k
    interestRate: 7.0,
    subsidyPercentage: 7, // 7% interest subsidy on timely repayment
    tenureMonths: 12,
    beneficiaryTypes: ['all', 'sc_st', 'women'],
    applicableStates: ['All India'],
    iconName: 'ShoppingBag',
    tagline: 'Instant working capital loan for street vendors with 7% interest subsidy and cashback on digital transactions.',
    taglineHi: 'रेहड़ी-पटरी विक्रेताओं के लिए तत्काल कार्यशील पूंजी ऋण व 7% ब्याज सब्सिडी।',
    features: [
      'Initial loan of ₹10,000, followed by ₹20,000 and ₹50,000 on timely repayments',
      '7% interest subsidy credited directly to bank account quarterly',
      'Monthly cashback up to ₹100 on digital payments acceptance',
      'No collateral needed, approved within 24 hours online'
    ],
    featuresHi: [
      'समय पर भुगतान पर ₹10,000 से लेकर ₹50,000 तक की वृद्धि',
      '7% ब्याज अनुदान सीधे बैंक खाते में जमा',
      'डिजिटल भुगतान पर प्रतिमाह ₹100 तक का कैशबैक',
      '24 घंटे में डिजिटल अनुमोदन बिना किसी गारंटी के'
    ],
    requiredDocs: ['Aadhaar Card', 'Vending Certificate / Urban Local Body LOR', 'Bank Account Details'],
    officialPortalUrl: 'https://pmsvanidhi.mohua.gov.in/',
    imageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80',
    isPopular: false
  },

  // 5. Bada Loan - Stand-Up India (SC/ST & Women Green-field Projects)
  {
    id: 'stand-up-india',
    name: 'Stand-Up India Scheme (SC/ST & Women Entrepreneurs)',
    nameHi: 'स्टैंड-अप इंडिया योजना (SC/ST व महिला उद्यमियों हेतु ₹1 करोड़ तक)',
    category: 'bada_loan',
    department: 'Small Industries Development Bank of India (SIDBI)',
    minAmount: 1000000, // 10 Lakhs
    maxAmount: 10000000, // 1 Crore
    interestRate: 8.15,
    subsidyPercentage: 15,
    tenureMonths: 84,
    beneficiaryTypes: ['sc_st', 'women'],
    applicableStates: ['All India'],
    iconName: 'Building2',
    tagline: 'Big ticket funding from ₹10 Lakh to ₹1 Crore for greenfield projects set up by SC, ST, or Women entrepreneurs.',
    taglineHi: 'SC, ST तथा महिला उद्यमियों के नए उद्योग एवं उद्यम हेतु ₹10 लाख से ₹1 करोड़ तक बड़ा ऋण।',
    features: [
      'Mandatory loan of ₹10 Lakh to ₹1 Crore per bank branch for SC/ST or Women',
      'Margin money requirement reduced to only 15% with state convergence',
      'Covers manufacturing, services, agri-allied activities, and trading sectors',
      'Handholding support via SIDBI and Stand-Up Mitra portal'
    ],
    featuresHi: [
      'प्रत्येक बैंक शाखा द्वारा कम से कम एक SC/ST और एक महिला को ऋण अनिवार्य',
      'मार्जिन मनी केवल 15% तक सीमित',
      'विनिर्माण, सेवा, व्यापार व कृषि सहायक क्षेत्रों हेतु उपलब्ध',
      'सिडबी द्वारा हैंडहोल्डिंग व तकनीकी सहायता'
    ],
    requiredDocs: ['Aadhaar Card', 'PAN Card', 'Caste Certificate (for SC/ST)', 'Detailed Project Report', 'Pollution Clearance (if required)', 'Company Incorporation / Partnership Deed'],
    officialPortalUrl: 'https://www.standupmitra.in/',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
    isPopular: true
  },

  // 6. Home Loan - Pradhan Mantri Awas Yojana (PMAY-Urban/Gramin)
  {
    id: 'pmay-housing-loan',
    name: 'Pradhan Mantri Awas Yojana (PMAY Credit Linked Subsidy)',
    nameHi: 'प्रधानमंत्री आवास योजना (गृह ऋण व ₹2.67 लाख ब्याज सब्सिडी)',
    category: 'home_loan',
    department: 'Ministry of Housing and Urban Affairs (MoHUA)',
    minAmount: 500000,
    maxAmount: 7500000,
    interestRate: 7.5,
    subsidyPercentage: 6.5, // 6.5% interest subsidy
    tenureMonths: 240, // 20 years
    beneficiaryTypes: ['all', 'women', 'sc_st', 'senior_citizen', 'general'],
    applicableStates: ['All India'],
    iconName: 'Home',
    tagline: 'Affordable home purchase and construction loan with upfront interest subsidy up to ₹2.67 Lakhs.',
    taglineHi: 'सस्ता घर खरीदने अथवा निर्माण हेतु ₹2.67 लाख तक की सीधी सरकारी ब्याज सब्सिडी।',
    features: [
      'Up to ₹2.67 Lakh upfront interest subsidy directly credited to reduce principal',
      'Subsidized interest rate starting from 7.50% per annum',
      'Mandatory female co-ownership for EWS/LIG categories to empower women',
      'Tenure available up to 20 years for comfortable low EMIs'
    ],
    featuresHi: [
      'मूलधन घटाने हेतु ₹2.67 लाख तक की सीधी ब्याज सब्सिडी',
      '7.50% प्रति वर्ष से शुरू होने वाली रियायती ब्याज दरें',
      'महिला सशक्तीकरण हेतु सह-स्वामित्व में विशेष वरीयता',
      'आसान किस्तों के लिए 20 वर्ष तक की लंबी पुनर्भुगतान अवधि'
    ],
    requiredDocs: ['Aadhaar Card of Applicant & Co-applicant', 'Income Certificate / Salary Slips', 'Property Agreement / Construction Estimate', 'Bank Statement (6 Months)'],
    officialPortalUrl: 'https://pmaymis.gov.in/',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    isPopular: true
  },

  // 7. Study Loan - PM Vidya Lakshmi Education Loan
  {
    id: 'pm-vidya-lakshmi',
    name: 'PM Vidya Lakshmi Higher Education Loan Scheme',
    nameHi: 'प्रधानमंत्री विद्यालक्ष्मी उच्च शिक्षा एवं स्टडी लोन (100% सब्सिडी)',
    category: 'study_loan',
    department: 'Ministry of Education & Department of Higher Education',
    minAmount: 100000,
    maxAmount: 2000000,
    interestRate: 7.5,
    subsidyPercentage: 100,
    tenureMonths: 180,
    beneficiaryTypes: ['all', 'obc', 'sc_st', 'women', 'general'],
    applicableStates: ['All India'],
    iconName: 'GraduationCap',
    tagline: '100% Interest Subsidized collateral-free higher education loan for college, engineering, medical & professional degrees.',
    taglineHi: 'उच्च शिक्षा, कॉलेज, इंजीनियरिंग व मेडिकल हेतु बिना गारंटी के 100% ब्याज सब्सिडी वाला स्टडी लोन।',
    features: [
      'Collateral-free loan up to ₹7.5 Lakhs backed by NCEGTT Government Guarantee',
      '100% Full Interest Subsidy during course duration + 1 year moratorium period (CSIS Scheme)',
      'Covers 100% Tuition Fees, Hostel, Books, Exam Fees, Computer/Laptop & Travel',
      'Flexible repayment tenure up to 15 years after graduation & moratorium'
    ],
    featuresHi: [
      '₹7.50 लाख तक बिना किसी संपत्ति गारंटी या बंधक के सरकारी सुरक्षा',
      'पढ़ाई की पूरी अवधि + 1 वर्ष मोराटोरियम तक 100% सरकारी ब्याज सब्सिडी',
      'ट्यूशन फीस, हॉस्टल, पुस्तकें, लैपटॉप एवं परीक्षा शुल्क 100% कवर्ड',
      'डिग्री पूरी होने के 1 साल बाद से 15 वर्ष की आसान पुनर्भुगतान अवधि'
    ],
    requiredDocs: [
      'Applicant Aadhaar & Student ID / Admission Offer Letter',
      'Marksheets of 10th, 12th & Graduation',
      'Father / Mother Aadhaar, PAN & Passport Photo (for Minors / Co-borrowers)',
      'Father / Mother Income Certificate (Iay Praman Patra)',
      'Nominee Aadhaar Details & Relationship Proof'
    ],
    officialPortalUrl: 'https://www.vidyalakshmi.co.in/',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    isPopular: true
  },

  // 8. Study Loan - Central Sector Interest Subsidy (CSIS)
  {
    id: 'csis-education-loan',
    name: 'Central Sector Interest Subsidy (CSIS) Study Loan',
    nameHi: 'केन्द्रीय क्षेत्र ब्याज सब्सिडी शिक्षा ऋण (CSIS योजना)',
    category: 'study_loan',
    department: 'Ministry of Education (Government of India)',
    minAmount: 50000,
    maxAmount: 1500000,
    interestRate: 6.8,
    subsidyPercentage: 100,
    tenureMonths: 120,
    beneficiaryTypes: ['all', 'obc', 'sc_st', 'women', 'general'],
    applicableStates: ['All India'],
    iconName: 'BookOpen',
    tagline: 'Full interest waiver for students from Economically Weaker Sections & OBC/SC/ST categories during technical/professional studies.',
    taglineHi: 'तकनीकी एवं व्यावसायिक पढ़ाई हेतु आर्थिक रूप से कमजोर, OBC, SC/ST छात्रों के लिए पूर्ण ब्याज माफी।',
    features: [
      'Zero interest cost to student during course duration for EWS, OBC, SC & ST applicants',
      'Covers recognized technical, medical, management and professional courses in India',
      'Parental Income Certificate required (Annual income up to ₹4.50 Lakhs)',
      'Direct Benefit Transfer (DBT) of interest subsidy into education loan account'
    ],
    featuresHi: [
      'EWS, OBC, SC एवं ST श्रेणी के विद्यार्थियों को अध्ययन काल में शून्य ब्याज दर',
      'भारत में मान्यता प्राप्त तकनीकी, मेडिकल एवं प्रबंधन पाठ्यक्रमों हेतु मान्य',
      'अभिभावक का आय प्रमाण पत्र (वार्षिक आय ₹4.50 लाख तक) अनिवार्य',
      'ब्याज सब्सिडी सीधे बैंक लोन खाते में ट्रांसफर'
    ],
    requiredDocs: [
      'Student Aadhaar & College Fee Structure',
      'Father / Mother Income Proof (Tehsildar Certified)',
      'Parent Aadhaar, PAN & Passport Photo',
      'Nominee Details Form'
    ],
    officialPortalUrl: 'https://education.gov.in/',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
    isPopular: true
  },

  // 7. Business Loan - PSB Loans in 59 Minutes (MSME CGTMSE)
  {
    id: 'psb-59-min-msme',
    name: 'Online In-Principle MSME Business Loan (PSB 59 Minutes)',
    nameHi: 'पीएसबी 59 मिनट एमएसएमई व्यापार ऋण (संपत्ति-मुक्त)',
    category: 'business_loan',
    department: 'SIDBI & Public Sector Consortium',
    minAmount: 500000,
    maxAmount: 50000000, // Up to 5 Crores
    interestRate: 8.25,
    subsidyPercentage: 0,
    tenureMonths: 84,
    beneficiaryTypes: ['all', 'women', 'sc_st', 'general'],
    applicableStates: ['All India'],
    iconName: 'Briefcase',
    tagline: 'Get automated in-principle approval letter in 59 minutes using digital GST, ITR, and Bank Statement verification.',
    taglineHi: 'डिजिटल जीएसटी व आईटीआर सत्यापन के जरिए मात्र 59 मिनट में सैद्धांतिक ऋण स्वीकृति।',
    features: [
      'Digital approval within 59 minutes backed by algorithmic credit scoring',
      'Loans up to ₹5 Crore with CGTMSE coverage (no third party guarantee needed)',
      'Multiple public sector and private partner banks bidding for your loan',
      'End-to-end transparent real-time tracking from sanction to disbursement'
    ],
    featuresHi: [
      'कंप्यूटरीकृत क्रेडिट स्कोरिंग से मात्र 59 मिनट में डिजिटल स्वीकृति',
      '₹5 करोड़ तक का संपार्श्विक-मुक्त (Collateral-free) व्यापार ऋण',
      'भारत के 21+ राष्ट्रीयकृत बैंकों से सर्वश्रेष्ठ ब्याज दरों का चयन',
      'पारदर्शी ऑनलाइन स्टेटस ट्रैकिंग'
    ],
    requiredDocs: ['GST Identification Number (GSTIN)', 'Income Tax Returns (ITR-V, last 3 years)', 'Net Banking / Bank Statement (PDF)', 'Aadhaar & PAN of Directors/Partners'],
    officialPortalUrl: 'https://www.psbloansin59minutes.com/',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    isPopular: true
  },

  // 8. Study Loan - Vidya Lakshmi Portal (Higher & Foreign Education)
  {
    id: 'vidya-lakshmi-edu',
    name: 'Vidya Lakshmi National Education Loan Portal',
    nameHi: 'विद्या लक्ष्मी राष्ट्रीय शिक्षा ऋण (उच्च अध्ययन एवं विदेश पढ़ाई)',
    category: 'study_loan',
    department: 'Ministry of Education & NSDL',
    minAmount: 100000,
    maxAmount: 10000000, // Up to 1 Crore for premium institutions / abroad
    interestRate: 7.75,
    subsidyPercentage: 100, // 100% Interest subsidy during moratorium (CSIS)
    tenureMonths: 180, // 15 years
    beneficiaryTypes: ['all', 'sc_st', 'women', 'general'],
    applicableStates: ['All India'],
    iconName: 'GraduationCap',
    tagline: 'Single window portal for applying to 40+ banks for education loans with Central Sector Interest Subsidy (CSIS).',
    taglineHi: '40+ बैंकों में एक साथ आवेदन, पढ़ाई अवधि में पूर्ण ब्याज छूट (CSIS) की सुविधा।',
    features: [
      'No collateral needed for loans up to ₹7.5 Lakhs under Credit Guarantee Fund (CGFSEL)',
      '100% interest waiver during study moratorium period for EWS students (< ₹4.5 Lakhs family income)',
      'Covers tuition fees, hostel, books, laptop, and travel expenses abroad',
      'Repayment holiday: Course duration plus 1 year grace period before EMI starts'
    ],
    featuresHi: [
      '₹7.5 लाख तक के शिक्षा ऋण पर बिना किसी संपत्ति बंधक के गारंटी',
      'अध्ययन अवधि के दौरान आर्थिक रूप से कमजोर छात्रों को 100% ब्याज छूट',
      'कॉलेज फीस, हॉस्टल, पुस्तकें व लैपटॉप तथा विदेश यात्रा खर्च शामिल',
      'पढ़ाई पूरी होने के 1 साल बाद से आसान मासिक किस्तों में भुगतान'
    ],
    requiredDocs: ['Admission Offer Letter from University', 'Fee Structure Breakdown', '10th, 12th & Graduation Marksheets', 'Aadhaar & PAN of Student and Parent', 'Parent Income Proof / ITR'],
    officialPortalUrl: 'https://www.vidyalakshmi.co.in/',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    isPopular: true
  },

  // 9. Agriculture Loan - Kisan Credit Card (KCC Subsidized 4%)
  {
    id: 'kisan-credit-card',
    name: 'Kisan Credit Card (KCC) Crop & Agri Allied Loan',
    nameHi: 'किसान क्रेडिट कार्ड (KCC 4% रियायती ब्याज कृषि ऋण)',
    category: 'agriculture_loan',
    department: 'Ministry of Agriculture & NABARD',
    minAmount: 50000,
    maxAmount: 3000000,
    interestRate: 4.0, // Subsidized from 7% to 4% with prompt repayment
    subsidyPercentage: 3, // 3% subvention for prompt repayment
    tenureMonths: 60,
    beneficiaryTypes: ['all', 'sc_st', 'women', 'senior_citizen'],
    applicableStates: ['All India', 'Uttar Pradesh', 'Bihar', 'Madhya Pradesh', 'Punjab', 'Haryana', 'Rajasthan'],
    iconName: 'Sprout',
    tagline: 'Subsidized 4% interest crop, seeds, machinery, and animal husbandry credit for farmers.',
    taglineHi: 'किसानों के लिए खाद, बीज, मशीनरी व पशुपालन हेतु मात्र 4% ब्याज पर रियायती कृषि ऋण।',
    features: [
      'Effective 4% interest rate on timely repayment (Govt 3% prompt repayment subvention)',
      'Collateral-free limit up to ₹1.60 Lakhs (extendable to ₹3 Lakhs without stamp duty)',
      'Also covers Animal Husbandry, Dairy, Poultry, and Fisheries activities',
      'ATM enabled Rupay Kisan Card for easy cash withdrawal from any bank ATM'
    ],
    featuresHi: [
      'समय पर अदायगी करने पर मात्र 4% की अत्यंत कम ब्याज दर',
      '₹1.60 लाख तक बिना किसी भूमि बंधक (Collateral-Free) के तत्काल स्वीकृति',
      'पशुपालन, डेयरी, मत्स्य पालन तथा बकरी पालन के लिए भी उपलब्ध',
      'एटीएम से सीधी निकासी हेतु रूपे किसान कार्ड की निःशुल्क सुविधा'
    ],
    requiredDocs: ['Aadhaar Card', 'Land Record (Khatauni / Bhu-Naksha / Khasra)', 'Cropping Pattern Certificate', 'Passport Photo'],
    officialPortalUrl: 'https://agricoop.nic.in/',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
    isPopular: true
  },

  // 10. Senior Citizen Loan - Varishtha Pensioner Personal & Medical Loan
  {
    id: 'senior-pension-loan',
    name: 'Senior Citizen Pensioner & Healthcare Personal Loan',
    nameHi: 'वरिष्ठ नागरिक पेंशनर व स्वास्थ्य ऋण (न्यूनतम कागजी कार्रवाई)',
    category: 'finance_loan',
    department: 'National Banking Consortium & EPFO',
    minAmount: 25000,
    maxAmount: 1500000,
    interestRate: 9.0,
    subsidyPercentage: 0,
    tenureMonths: 60,
    beneficiaryTypes: ['senior_citizen'],
    applicableStates: ['All India'],
    iconName: 'HeartHandshake',
    tagline: 'Dignified emergency personal and medical treatment credit for retired senior citizens and family pensioners.',
    taglineHi: 'सेवानिवृत्त वरिष्ठ नागरिकों और पेंशनभोगियों के लिए आकस्मिक स्वास्थ्य व निजी खर्च हेतु सुगम ऋण।',
    features: [
      'Age limit relaxed up to 76 years for central/state and defense pensioners',
      'Nominal processing fees and instant disbursal linked to pension account',
      'No guarantor required for family pensioners with spouse nomination',
      'Doorstep biometric verification assistance for elderly applicants'
    ],
    featuresHi: [
      '76 वर्ष की आयु तक के पेंशनभोगियों के लिए विशेष छूट',
      'पेंशन खाते से सीधे लिंक व 24 घंटे में बिना शाखा जाए डिस्बर्सल',
      'आकस्मिक स्वास्थ्य व पारिवारिक कार्यों हेतु लचीली भुगतान शर्तें',
      'वरिष्ठ नागरिकों हेतु घर बैठे डिजिटल बायोमेट्रिक प्रमाणीकरण'
    ],
    requiredDocs: ['Aadhaar Card', 'Pension Payment Order (PPO Copy)', 'Pension Passbook / 6-Month Statement', 'Life Certificate (Jeevan Pramaan)'],
    officialPortalUrl: 'https://jeevanpramaan.gov.in/',
    imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80',
    isPopular: false
  },

  // 11. Women Entrepreneur Loan - Mahila Udyam Nidhi & Dena Shakti
  {
    id: 'mahila-udyam-nidhi',
    name: 'Mahila Udyam Nidhi & Stree Shakti Scheme',
    nameHi: 'महिला उद्यम निधि व स्त्री शक्ति विशेष योजना (0.50% ब्याज छूट)',
    category: 'business_loan',
    department: 'Ministry of Women and Child Development & SIDBI',
    minAmount: 100000,
    maxAmount: 2500000,
    interestRate: 7.65,
    subsidyPercentage: 15,
    tenureMonths: 120, // 10 years
    beneficiaryTypes: ['women'],
    applicableStates: ['All India'],
    iconName: 'Sparkles',
    tagline: 'Exclusive credit window for female proprietors with 0.50% interest concession and soft seed capital.',
    taglineHi: 'महिला उद्यमियों के लिए ब्याज में 0.50% की विशेष छूट व आसान सॉफ्ट लोन सहायता।',
    features: [
      '0.50% lower interest rate compared to regular business loans',
      'Soft seed capital assistance up to 25% of the project cost at 1% service fee',
      'Flexible moratorium period up to 24 months before repayment commences',
      'Open to manufacturing, tailoring, beauty clinics, food processing, and IT'
    ],
    featuresHi: [
      'सामान्य व्यावसायिक ऋणों की तुलना में 0.50% कम ब्याज दर',
      'परियोजना लागत का 25% तक सॉफ्ट सीड कैपिटल मात्र 1% सेवा शुल्क पर',
      'पुनर्भुगतान शुरू होने से पहले 24 महीने तक की छूट (Moratorium)',
      'सिलाई, ब्यूटी क्लिनिक, खाद्य प्रसंस्करण, बुटीक व सेवा उद्यमों हेतु'
    ],
    requiredDocs: ['Aadhaar Card of Female Applicant', 'PAN Card', 'Udyam Registration Certificate', 'Business Plan Proposal', 'Bank Statement'],
    officialPortalUrl: 'https://wcd.nic.in/',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80',
    isPopular: true
  },

  // 12. State Specific: Uttar Pradesh Mukhyamantri Yuva Swarojgar Yojana
  {
    id: 'up-yuva-swarojgar',
    name: 'UP Mukhyamantri Yuva Swarojgar Yojana (MMYSY)',
    nameHi: 'उत्तर प्रदेश मुख्यमंत्री युवा स्वरोजगार योजना (25% मार्जिन मनी सब्सिडी)',
    category: 'sarkari_loan',
    department: 'Directorate of Industries, Govt. of Uttar Pradesh',
    minAmount: 200000,
    maxAmount: 2500000,
    interestRate: 8.0,
    subsidyPercentage: 25, // 25% margin money grant
    tenureMonths: 84,
    beneficiaryTypes: ['all', 'sc_st', 'women', 'general'],
    applicableStates: ['Uttar Pradesh'],
    iconName: 'Award',
    tagline: 'State-sponsored employment loan for UP educated youth with 25% government margin money grant.',
    taglineHi: 'उत्तर प्रदेश के शिक्षित युवाओं के लिए 25% सरकारी अनुदान के साथ स्वरोजगार ऋण।',
    features: [
      '25% margin money grant (up to ₹6.25 Lakhs for industry, ₹2.5 Lakhs for service)',
      'Convertible to capital grant after 2 years of successful business operations',
      'Available exclusively for permanent residents of Uttar Pradesh',
      'Online application through Nivesh Mitra and DIUP portal'
    ],
    featuresHi: [
      '25% मार्जिन मनी अनुदान (उद्योग हेतु ₹6.25 लाख तक, सेवा क्षेत्र हेतु ₹2.5 लाख तक)',
      '2 वर्ष सफल संचालन के बाद मार्जिन मनी स्थायी अनुदान में परिवर्तित',
      'केवल उत्तर प्रदेश के स्थायी मूल निवासियों हेतु उपलब्ध',
      'निवेश मित्र पोर्टल के माध्यम से सीधा डिजिटल निस्तारण'
    ],
    requiredDocs: ['UP Domicile Certificate (निवास प्रमाण पत्र)', 'High School Certificate', 'Aadhaar Card', 'Detailed Project Profile', 'Caste Certificate (if applicable)'],
    officialPortalUrl: 'https://diupmsme.upsdc.gov.in/',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    isPopular: false
  },

  // 13. State Specific: Bihar Mukhyamantri Udyami Yojana (SC/ST/EBC/Women/Youth)
  {
    id: 'bihar-udyami-yojana',
    name: 'Bihar Mukhyamantri Udyami Yojana (50% Subsidy / ₹5 Lakh Grant)',
    nameHi: 'बिहार मुख्यमंत्री उद्यमी योजना (₹5 लाख मुफ्त अनुदान + ₹5 लाख ब्याजमुक्त ऋण)',
    category: 'sarkari_loan',
    department: 'Department of Industries, Govt. of Bihar',
    minAmount: 500000,
    maxAmount: 1000000,
    interestRate: 0.0, // 0% for SC/ST and Women, 1% for General youth
    subsidyPercentage: 50, // 50% flat grant
    tenureMonths: 84,
    beneficiaryTypes: ['sc_st', 'women', 'all'],
    applicableStates: ['Bihar'],
    iconName: 'Zap',
    tagline: 'Flagship Bihar scheme offering ₹5 Lakh direct grant plus ₹5 Lakh interest-free loan for starting new enterprises.',
    taglineHi: 'बिहार के उद्यमियों हेतु ₹5 लाख का पूर्ण अनुदान तथा ₹5 लाख का ब्याजमुक्त ऋण।',
    features: [
      'Total ₹10 Lakhs assistance: ₹5 Lakhs is a direct non-repayable grant (subsidy)',
      'Remaining ₹5 Lakhs is completely interest-free (0% interest) for SC/ST and Women',
      'Repayable in 84 easy monthly installments after 1-year moratorium',
      'Direct state DBT disbursement in 3 tranches upon project milestone verification'
    ],
    featuresHi: [
      'कुल ₹10 लाख: ₹5 लाख पूर्ण सरकारी अनुदान (माफ़) + ₹5 लाख ऋण',
      'SC/ST और महिलाओं के लिए ऋण पूर्णतः 0% ब्याजमुक्त',
      '1 वर्ष की छूट के बाद 84 आसान मासिक किस्तों में भुगतान',
      'बिहार उद्योग विभाग द्वारा प्रत्यक्ष डीबीटी सत्यापन'
    ],
    requiredDocs: ['Bihar Residential Certificate', 'Intermediate / ITI / Polytechnic Marksheet', 'Caste Certificate', 'Aadhaar Card', 'Cancelled Cheque of Current Account'],
    officialPortalUrl: 'https://udyami.bihar.gov.in/',
    imageUrl: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=800&auto=format&fit=crop&q=80',
    isPopular: true
  },

  // 14. Bada Loan - Corporate & Commercial Industry Loan (Green & Heavy Capex)
  {
    id: 'heavy-commercial-capex',
    name: 'National Industrial Capex & Heavy Expansion Loan',
    nameHi: 'राष्ट्रीय औद्योगिक व वाणिज्यिक विस्तार बड़ा ऋण (₹10 करोड़ तक)',
    category: 'bada_loan',
    department: 'State Bank of India & Consortium of Public Banks',
    minAmount: 5000000,
    maxAmount: 100000000, // Up to 10 Crores
    interestRate: 8.4,
    subsidyPercentage: 0,
    tenureMonths: 144, // 12 years
    beneficiaryTypes: ['all', 'general', 'sc_st', 'women'],
    applicableStates: ['All India'],
    iconName: 'Factory',
    tagline: 'Large-scale financing for manufacturing plants, solar installations, warehousing, and commercial fleets.',
    taglineHi: 'औद्योगिक संयंत्रों, सोलर पावर, वेयरहाउसिंग व बड़े कारखानों हेतु ₹10 करोड़ तक का मेगा ऋण।',
    features: [
      'High quantum funding up to ₹10 Crore with competitive floating interest linked to EBLR',
      'Flexible structuring including term loan, working capital limits, and Letter of Credit (LC)',
      'Subsidized green capex rebates for solar rooftop and effluent treatment installations',
      'Dedicated relationship banking officer assigned directly on digital portal'
    ],
    featuresHi: [
      'ईबीएलआर से जुड़े प्रतिस्पर्धी ब्याज दरों पर ₹10 करोड़ तक की विशाल फंडिंग',
      'टर्म लोन, वर्किंग कैपिटल लिमिट और बैंक गारंटी (LC) की संयुक्त सुविधा',
      'सौर ऊर्जा व हरित उद्योग लगाने पर विशेष सरकारी ब्याज छूट',
      'पोर्टल से सीधे समर्पित बैंक अधिकारी द्वारा त्वरित फाइल प्रोसेसिंग'
    ],
    requiredDocs: ['Audited Financials (Last 3 Years)', 'CMA Data & Projected Cash Flows', 'Property / Industrial Land Documents', 'GST Returns & Statutory Audit Reports', 'Board Resolution'],
    officialPortalUrl: 'https://sbi.co.in/web/business/sme',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
    isPopular: false
  }
];

export const LOAN_CATEGORIES_METADATA = [
  { id: 'all', label: 'All Schemes', labelHi: 'सभी योजनाएं', icon: 'LayoutGrid' },
  { id: 'sarkari_loan', label: 'Sarkari Loan', labelHi: 'सरकारी योजना (PMEGP)', icon: 'Landmark' },
  { id: 'chota_loan', label: 'Chota Loan (Mudra)', labelHi: 'छोटा ऋण (मुद्रा/स्वनिधि)', icon: 'Coins' },
  { id: 'bada_loan', label: 'Bada Loan (Commercial)', labelHi: 'बड़ा ऋण (उद्योग/व्यापार)', icon: 'Building2' },
  { id: 'home_loan', label: 'Home Loan', labelHi: 'गृह ऋण (आवास योजना)', icon: 'Home' },
  { id: 'business_loan', label: 'Business & MSME', labelHi: 'व्यापार एवं एमएसएमई', icon: 'Briefcase' },
  { id: 'study_loan', label: 'Study & Education', labelHi: 'शिक्षा व उच्च अध्ययन', icon: 'GraduationCap' },
  { id: 'agriculture_loan', label: 'Agri & KCC', labelHi: 'कृषि ऋण (KCC)', icon: 'Sprout' },
  { id: 'finance_loan', label: 'Personal & Senior', labelHi: 'पर्सनल व पेंशनर ऋण', icon: 'HeartHandshake' },
];
