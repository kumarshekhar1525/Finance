export type LoanCategory = 
  | 'all'
  | 'bada_loan'
  | 'chota_loan'
  | 'sarkari_loan'
  | 'home_loan'
  | 'business_loan'
  | 'study_loan'
  | 'agriculture_loan'
  | 'finance_loan';

export type BeneficiaryFilter = 'all' | 'obc' | 'sc_st' | 'women' | 'senior_citizen' | 'general';

export type ApplicationStatus = 
  | 'submitted'
  | 'doc_verification'
  | 'biometric_verified'
  | 'bank_review'
  | 'sanctioned'
  | 'rejected'
  | 'disbursed';

export interface Scheme {
  id: string;
  name: string;
  nameHi: string;
  category: LoanCategory;
  department: string;
  maxAmount: number; // in INR
  minAmount: number;
  interestRate: number; // percentage p.a.
  subsidyPercentage?: number; // government subsidy
  tenureMonths: number;
  beneficiaryTypes: BeneficiaryFilter[];
  applicableStates: string[]; // ['All India', 'Uttar Pradesh', 'Bihar', ...]
  iconName: string;
  tagline: string;
  taglineHi: string;
  features: string[];
  featuresHi: string[];
  requiredDocs: string[];
  officialPortalUrl: string;
  imageUrl?: string;
  isPopular?: boolean;
}

export interface NomineeDetails {
  name: string;
  relation: string;
  phone?: string;
  aadhaar?: string;
  age?: number;
}

export interface ParentDetails {
  fatherName?: string;
  fatherAadhaar?: string;
  motherName?: string;
  motherAadhaar?: string;
}

export interface UploadedDoc {
  id: string;
  type: 'aadhaar' | 'pan' | 'income_proof' | 'bank_statement' | 'applicant_photo' | 'caste_cert' | 'business_proof' | 'father_aadhaar' | 'father_photo' | 'mother_aadhaar' | 'mother_photo' | 'important_doc' | 'student_proof';
  name: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  status: 'valid' | 'invalid' | 'reviewing';
  rejectionReason?: string;
  previewUrl?: string;
  extractedData?: Record<string, string>;
}

export interface BiometricRecord {
  isVerified: boolean;
  type: 'face' | 'fingerprint';
  verifiedAt?: string;
  token?: string;
  faceMatchScore?: number;
  deviceInfo?: string;
}

export interface ApplicationTimelineItem {
  stage: string;
  timestamp: string;
  remarks: string;
}

export interface DispatchLog {
  id: string;
  type: 'sms' | 'email';
  recipient: string;
  subjectOrTitle: string;
  content: string;
  status: 'delivered' | 'sent' | 'pending';
  sentAt: string;
  operatorRef?: string;
}

export interface LoanApplication {
  id: string;
  trackingId: string;
  applicantAadhaar: string;
  applicantPan?: string;
  applicantName: string;
  applicantDob?: string;
  applicantPhone: string;
  applicantEmail: string;
  applicantState: string;
  applicantCategory: BeneficiaryFilter;
  bankDetails?: {
    accountNo: string;
    ifsc: string;
    bankName: string;
  };
  isMinor?: boolean;
  parentDetails?: ParentDetails;
  nomineeDetails?: NomineeDetails;
  schemeId: string;
  schemeName: string;
  category: LoanCategory;
  requestedAmount: number;
  tenureMonths: number;
  monthlyEmi: number;
  interestRate: number;
  purpose: string;
  createdAt?: string;
  appliedDate?: string;
  status: ApplicationStatus;
  timeline?: ApplicationTimelineItem[];
  statusTimeline?: any[];
  documents: UploadedDoc[];
  biometric: BiometricRecord;
  rejectionReason?: string;
  sanctionLetterUrl?: string;
  sanctionedAmount?: number;
  assignedBankOfficer?: string;
  isEncrypted?: boolean;
  encryptionHash?: string;
  isFeePaid?: boolean;
  feePaid?: boolean;
  paymentRef?: string;
  feeTxId?: string;
  dispatchLogs?: DispatchLog[];
}

export interface UserProfile {
  aadhaarNumber: string;
  panNumber?: string;
  bankDetails?: {
    accountNo: string;
    ifsc: string;
    bankName: string;
  };
  fullName: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  password?: string;
  address: string;
  state: string;
  pincode: string;
  category: BeneficiaryFilter;
  photoUrl: string;
  creditScore: number;
  isAadhaarVerified: boolean;
  biometricVerified: boolean;
  kycTier: 'Tier-1' | 'Tier-2' | 'Tier-3';
  savedDocuments?: UploadedDoc[];
  nomineeDetails?: NomineeDetails;
  parentDetails?: ParentDetails;
}

export interface SearchQueryLog {
  id: string;
  query: string;
  userId?: string;
  userCategory?: string;
  timestamp: string;
  resultsCount: number;
  isBlocked: boolean;
  flagReason?: string;
  matchedSchemes?: string[];
}

export type SearchLog = SearchQueryLog;

export interface HelpdeskChatMessage {
  id: string;
  sender: 'user' | 'admin';
  text: string;
  timestamp: string;
  citizenName: string;
  citizenAadhaar?: string;
  applicationId?: string;
}

export interface HelpdeskChatTicket {
  ticketId: string;
  citizenName: string;
  citizenPhone: string;
  citizenAadhaar: string;
  applicationId?: string;
  lastMessage: string;
  lastUpdated: string;
  status: 'open' | 'resolved' | 'replied';
  messages: HelpdeskChatMessage[];
}

export interface PushNotification {
  id: string;
  title: string;
  titleHi?: string;
  message: string;
  messageHi?: string;
  timestamp: string;
  type: 'status_update' | 'sanction' | 'alert' | 'scheme_update' | 'reject' | 'payment' | 'biometric' | 'system';
  read: boolean;
  applicationId?: string;
  linkId?: string;
}

export type SupportedLanguage = 'en' | 'hi' | 'mr' | 'bn' | 'ta' | 'te' | 'gu' | 'pa';

export interface CustomerExtractedProfile {
  name: string;
  aadhaarNumberMasked: string;
  panNumberMasked: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  category: BeneficiaryFilter;
  residenceArea: 'Rural' | 'Urban';
  state: string;
  occupation: 'Salaried' | 'Business Owner' | 'Artisan / Traditional Craftsman' | 'Farmer / Agriculture' | 'Street Vendor / Micro-Enterprise' | 'Student';
  monthlyIncome: number;
  annualIncome: number;
  landHoldingAcres?: number;
  cibilScoreEstimate: number;
  documentsVerified: string[];
}

export interface MatchedLoanScheme {
  schemeId: string;
  schemeName: string;
  schemeNameHi: string;
  category: LoanCategory;
  department: string;
  matchScore: number; // 0-100%
  eligibilityStatus: 'eligible' | 'conditionally_eligible' | 'not_eligible';
  maxEligibleAmount: number;
  subsidyPercentage: number;
  subsidyAmount: number;
  interestRate: number;
  tenureMonths: number;
  monthlyEmi: number;
  reasonsForEligibility: string[];
  reasonsForEligibilityHi: string[];
  missingDocsForHigherLimit?: string[];
  officialPortalUrl: string;
  iconName: string;
}

export interface DocumentEligibilityResult {
  extractedProfile: CustomerExtractedProfile;
  totalEligibleSchemes: number;
  highestLoanLimit: number;
  totalSubsidyUnlocked: number;
  matchedSchemes: MatchedLoanScheme[];
  aiAnalysisSummary: string;
  aiAnalysisSummaryHi: string;
  evaluationDate: string;
  certificateRefNumber: string;
}
