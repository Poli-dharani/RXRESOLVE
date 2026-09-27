export type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type RefillStatus =
  | 'NEW'
  | 'ANALYZING'
  | 'WAITING FOR PROVIDER'
  | 'WAITING FOR PHARMACY'
  | 'MISSING INFORMATION'
  | 'INSURANCE BLOCKED'
  | 'FOLLOW-UP REQUIRED'
  | 'READY'
  | 'RESOLVED';

export type WorkflowStage =
  | 'NEW'
  | 'ANALYZING'
  | 'BLOCKED'
  | 'ACTION REQUIRED'
  | 'PROVIDER REVIEW'
  | 'PHARMACY READY'
  | 'RESOLVED';

export type BlockerCategory =
  | 'NO_REFILLS'
  | 'PROVIDER_REVIEW'
  | 'FOLLOW_UP_REQUIRED'
  | 'MISSING_INFORMATION'
  | 'PHARMACY_CLARIFICATION'
  | 'INSURANCE_BLOCK'
  | 'PATIENT_ACTION'
  | 'DUPLICATE_REQUEST'
  | 'DATA_MISMATCH'
  | 'UNKNOWN'
  // Backward compatibility aliases
  | 'NO_REFILLS_REMAINING'
  | 'PROVIDER_AUTHORIZATION'
  | 'MISSING_LAB_WORK'
  | 'PA_REQUIRED'
  | 'FORMULARY_CHANGE'
  | 'DOSAGE_CLARIFICATION'
  | 'OVERDUE_OFFICE_VISIT'
  | 'DUPLICATE_THERAPY';

export interface RefillHealth {
  score: number; // 0 - 100
  tier: 'OPTIMAL' | 'MODERATE' | 'AT_RISK' | 'CRITICAL';
  factors: {
    category: string;
    description: string;
    pointsDeducted: number;
  }[];
  disclaimer: string; // "Operational workflow score — not a medical score."
}

export interface ContinuitySignal {
  headline: string; // e.g., "3 refill interventions in the last 6 months."
  patternType:
    | 'Repeated refill intervention'
    | 'Repeated missing information'
    | 'Repeated pharmacy clarification'
    | 'Repeated provider review';
  frequencyCount: number;
  timeframe: string;
  notes: string;
  disclaimer: string; // "Operational pattern only — not a medical prediction."
}

export interface BlockerNode {
  id: string;
  label: string;
  owner: string;
  status: 'COMPLETED' | 'ACTIVE_BLOCKED' | 'PENDING';
  timestamp?: string;
  dependency: string;
  nextAction: string;
}

export interface HistoricalRefill {
  id: string; // e.g. "RX-10021"
  medicationName: string;
  date: string;
  status: 'Resolved' | 'Current Blocked' | 'Cancelled';
  turnaroundTime: string; // "2 days", "3h"
  blockerCategory: string;
  resolvedBy: string;
}

export interface ClinicalDocument {
  id: string;
  title: string;
  category: 'Clinic Progress Note' | 'Prior Auth Approval' | 'Lab Report' | 'Pharmacy e-Receipt';
  date: string;
  author: string;
  fileSize: string;
}

export interface LabResult {
  id: string;
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  date: string;
  flag: 'Normal' | 'Abnormal' | 'Critical';
}

export interface PatientAnswer {
  query: string;
  answer: string;
  evidence: string[];
  confidence: number;
}

export interface Insurance {
  payerId: string;
  payerName: string;
  planType: 'Commercial' | 'Medicare Advantage' | 'Medicaid' | 'Part D';
  memberId: string;
  rxBin: string;
  rxPcn: string;
  rxGroup: string;
  priorAuthOnRecord: boolean;
  formularyTier?: number;
}

export interface Medication {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  form: string;
  route: string;
  ndc: string;
  sig: string; // Instructions
  isControlled: boolean;
  schedule?: 'II' | 'III' | 'IV' | 'V';
  dailyDoseRequirement?: string;
  monitoringLabRequired?: string;
}

export interface Prescription {
  id: string;
  rxNumber: string;
  medication: Medication;
  datePrescribed: string;
  originalRefills: number;
  remainingRefills: number;
  lastFilledDate: string;
  daysSupply: number;
  prescribingProviderId: string;
  status: 'ACTIVE' | 'EXPIRED' | 'DEPLETED' | 'DISCONTINUED';
}

export interface Patient {
  id: string;
  mrn: string; // Medical Record Number
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Female' | 'Male' | 'Other';
  phone: string;
  email: string;
  address: string;
  preferredPharmacyId: string;
  primaryCareProviderId: string;
  insurance: Insurance;
  activeMedications: Medication[];
  allergies: string[];
  lastEncounterDate: string;
  lastLabsDate?: string;
  conditions: string[];
  // Stage 2 Extended Profiles
  patientContextSummary?: string;
  medicationHistory?: Array<{
    medication: string;
    dose: string;
    rxDate: string;
    refillDates: string[];
    provider: string;
    pharmacy: string;
    status: 'Active' | 'Historical' | 'Discontinued';
  }>;
  refillHistory?: HistoricalRefill[];
  encounters?: Encounter[];
  documents?: ClinicalDocument[];
  labs?: LabResult[];
}

export interface Provider {
  id: string;
  npi: string;
  firstName: string;
  lastName: string;
  title: string;
  specialty: string;
  department: string;
  email: string;
  phone: string;
  pager?: string;
  delegatedStaffIds: string[];
  averageResponseTimeHours: number;
}

export interface Pharmacy {
  id: string;
  ncpdpId: string;
  name: string;
  chain: string;
  address: string;
  phone: string;
  fax: string;
  pharmacistInCharge: string;
  preferredCommunicationChannel: 'Surescripts e-Prescribing' | 'Direct Secure Messaging' | 'Fax' | 'Phone';
}

export interface Encounter {
  id: string;
  patientId: string;
  providerId: string;
  date: string;
  type: 'In-Person Annual' | 'Telehealth Follow-up' | 'Medication Review' | 'Urgent Care';
  summary: string;
  labsReviewed?: string[];
  vitalSigns?: {
    bp?: string;
    pulse?: number;
    weightLbs?: number;
  };
}

export interface Task {
  id: string;
  refillId: string;
  title: string;
  description: string;
  assignedTo: string; // Role or User Name
  assignedRole: UserRole;
  dueDate: string;
  priority: Priority;
  completed: boolean;
  completedAt?: string;
  completedBy?: string;
}

export interface Message {
  id: string;
  refillId: string;
  senderName: string;
  senderRole: string;
  senderOrg: string;
  timestamp: string;
  content: string;
  isPharmacyStaff: boolean;
  channel:
    | 'Direct EHR Link'
    | 'Pharmacy Portal'
    | 'Internal Note'
    | 'Surescripts e-Prescribing'
    | 'Direct Secure Messaging'
    | 'Fax';
}

export interface AuditEvent {
  id: string;
  refillId?: string;
  patientId?: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  ipAddress: string;
  action: string;
  category: 'REFILL_MODIFICATION' | 'CLINICAL_REVIEW' | 'ACCESS' | 'AI_REASONING' | 'EXPORT';
  outcome: 'SUCCESS' | 'WARNING' | 'FAILED';
  details: string;
}

export interface WorkflowEvent {
  id: string;
  timestamp: string;
  stage: WorkflowStage;
  title: string;
  description: string;
  actor: string;
}

export interface AIRecommendation {
  confidenceScore: number; // 0 - 100
  blockerCategory: BlockerCategory;
  primaryBlockerSummary: string;
  missingInformation: string[];
  requiredActionSummary: string;
  suggestedActionRole: UserRole;
  suggestedAction: string;
  alternativeOptions?: string[];
  clinicalRationale: string;
  requiresPhysicianSignoff: boolean;
  priorAuthLikelihood?: number;
  complianceChecked: boolean;
}

export interface RefillRequest {
  id: string; // e.g. "RX-10482"
  patientId: string;
  patient: Patient;
  medication: Medication;
  prescription: Prescription;
  pharmacy: Pharmacy;
  provider: Provider;
  
  status: RefillStatus;
  workflowStage: WorkflowStage;
  priority: Priority;
  
  blockerDescription: string;
  blockerCategory: BlockerCategory;
  
  dateCreated: string;
  ageFormatted: string; // e.g., "18h", "9h", "2d"
  ageHours: number;
  
  owner: string; // e.g., "Dr. Carter", "Practice Staff", "Pharmacy Liaison"
  ownerRole: UserRole;
  nextAction: string;
  
  // The 6 Operational Questions:
  whatIsHappening: string;
  whatIsBlocking: string;
  whatInformationIsMissing: string[];
  whoNeedsToAct: string;
  whatShouldHappenNext: string;
  didActionActuallyHappen: {
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED_WITH_PHARMACY';
    details: string;
    verifiedTimestamp?: string;
  };
  
  aiRecommendation: AIRecommendation;
  workflowTimeline: WorkflowEvent[];
  tasks: Task[];
  messages: Message[];
  auditHistory: AuditEvent[];

  // Stage 2 Core Intelligence Fields
  refillHealth?: RefillHealth;
  continuitySignal?: ContinuitySignal;
  blockerGraph?: BlockerNode[];
}

export type UserRole = 
  | 'Practice Staff'
  | 'Provider'
  | 'Pharmacy Staff'
  | 'Operations Manager'
  | 'Admin'
  | 'Clinical Staff / MA'
  | 'Physician / Prescriber'
  | 'Practice Manager'
  | 'Pharmacy Liaison';

export type CopilotActionType =
  | 'REQUEST_PROVIDER_REVIEW'
  | 'SEND_PATIENT_UPDATE'
  | 'CONTACT_PHARMACY'
  | 'ASSIGN_STAFF'
  | 'ORDER_LAB'
  | 'AUTHORIZE_RENEWAL'
  | 'SCHEDULE_VISIT'
  | 'CUSTOM';

export interface AICopilotResponseFormat {
  summary: string;
  blocker: string;
  evidence: string[];
  confidence: number; // e.g. 96
  recommendedAction: {
    title: string;
    description: string;
    actionType: CopilotActionType;
    draftMessage?: string;
    suggestedAssignee?: string;
    isClinicalAuthorization?: boolean;
  };
  humanApproval: 'Required' | 'Recommended';
  clinicalGuardrailNote?: string;
}

export type DecisionStatus = 'PENDING' | 'APPROVED' | 'EDITED' | 'REJECTED';

export interface AICopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  queryText?: string;
  structuredResponse?: AICopilotResponseFormat;
  caseContextId?: string;
  decisionStatus?: DecisionStatus;
  decisionNote?: string;
  decisionTimestamp?: string;
  decisionActor?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  organization: string;
}

export interface Organization {
  id: string;
  name: string;
  type: 'Physician Group' | 'Health System' | 'Independent Practice' | 'Retail Pharmacy Partner';
  activeCasesCount: number;
  npiOrg: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  refillId?: string;
  priority: Priority;
  category: 'PROVIDER_ALERT' | 'PHARMACY_UPDATE' | 'SLA_RISK' | 'RESOLVED';
}
