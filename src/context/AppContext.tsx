import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  Organization,
  RefillRequest,
  Patient,
  Provider,
  Pharmacy,
  NotificationItem,
  WorkflowStage,
  RefillStatus,
  Task,
  WorkflowEvent,
  AuditEvent,
  Message,
} from '../types';
import {
  mockCurrentUser,
  mockOrganizations,
  mockPatients,
  mockProviders,
  mockPharmacies,
  mockRefillRequests,
  mockNotifications,
} from '../data/mockData';
import { refillService, auditService } from '../services';

export type AppView =
  | 'dashboard'
  | 'queue'
  | 'patient-360'
  | 'copilot'
  | 'tasks'
  | 'messages'
  | 'analytics'
  | 'audit'
  | 'settings'
  | 'help'
  | 'demo-center'
  | 'architecture'
  | 'go-to-market';

interface AppContextType {
  // Navigation & Shell
  mode: 'landing' | 'app';
  setMode: (mode: 'landing' | 'app') => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;

  // Guided Demo Mode for Judges
  isGuidedDemoOpen: boolean;
  setIsGuidedDemoOpen: (open: boolean) => void;

  // Identity & Tenancy
  currentUser: UserProfile;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentOrg: Organization;
  setCurrentOrg: (org: Organization) => void;
  organizations: Organization[];

  // Domain Data
  refills: RefillRequest[];
  patients: Patient[];
  providers: Provider[];
  pharmacies: Pharmacy[];
  
  // Selected Detail Views
  selectedRefill: RefillRequest | null;
  openRefillDetail: (caseOrId: RefillRequest | string) => void;
  closeRefillDetail: () => void;
  
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;
  viewPatient360: (patientId: string) => void;

  // Refill Queue Filtering
  filterStage: WorkflowStage | 'ALL';
  setFilterStage: (stage: WorkflowStage | 'ALL') => void;
  filterStatus: RefillStatus | 'ALL';
  setFilterStatus: (status: RefillStatus | 'ALL') => void;
  filterPriority: string;
  setFilterPriority: (priority: string) => void;
  filterBlocker: string;
  setFilterBlocker: (blocker: string) => void;
  filterProvider: string;
  setFilterProvider: (providerId: string) => void;
  filterPharmacy: string;
  setFilterPharmacy: (pharmacyId: string) => void;
  filterAge: string;
  setFilterAge: (age: string) => void;
  queueSearchQuery: string;
  setQueueSearchQuery: (query: string) => void;
  resetQueueFilters: () => void;

  // Global Search Modal
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Actions
  resolveRefill: (refillId: string) => Promise<void>;
  updateRefillStage: (
    refillId: string,
    newStage: WorkflowStage,
    newStatus: RefillStatus
  ) => Promise<void>;
  
  // Stage 2 Smart Workflow Actions
  toastMessage: string | null;
  showToast: (message: string) => void;
  requestProviderReview: (refillId: string, customNote?: string) => Promise<void>;
  sendPatientUpdate: (refillId: string, messageText: string) => Promise<void>;
  contactPharmacy: (refillId: string, inquiryText: string) => Promise<void>;
  assignStaff: (refillId: string, staffName: string, role: UserRole) => Promise<void>;
  addCaseNote: (refillId: string, noteContent: string) => Promise<void>;
  escalateCase: (refillId: string, reason: string) => Promise<void>;
  // Stage 3 Human-in-the-loop and Clinical Authorization
  approveRecommendation: (
    refillId: string,
    rec: import('../types').AICopilotResponseFormat['recommendedAction'],
    customNote?: string
  ) => Promise<boolean>;
  editAndApproveRecommendation: (
    refillId: string,
    rec: import('../types').AICopilotResponseFormat['recommendedAction'],
    editedText: string
  ) => Promise<boolean>;
  rejectRecommendation: (refillId: string, reason: string) => Promise<void>;
  authorizePrescriptionRenewal: (
    refillId: string,
    details?: { refillsCount?: number; daysSupply?: number; notes?: string }
  ) => Promise<{ success: boolean; error?: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start on landing or app? Default to 'landing' so reviewer sees the landing page first, but easily enters demo.
  // Persist state in localStorage if exists
  const [mode, setModeState] = useState<'landing' | 'app'>(() => {
    return (localStorage.getItem('rxresolve_mode') as 'landing' | 'app') || 'landing';
  });

  const [currentView, setCurrentViewState] = useState<AppView>(() => {
    return (localStorage.getItem('rxresolve_view') as AppView) || 'dashboard';
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  const [currentUser, setCurrentUser] = useState<UserProfile>(mockCurrentUser);
  const [currentRole, setCurrentRoleState] = useState<UserRole>(mockCurrentUser.role);
  const [organizations] = useState<Organization[]>(mockOrganizations);
  const [currentOrg, setCurrentOrg] = useState<Organization>(mockOrganizations[0]);

  const [refills, setRefills] = useState<RefillRequest[]>(mockRefillRequests);
  const [patients] = useState<Patient[]>(mockPatients);
  const [providers] = useState<Provider[]>(mockProviders);
  const [pharmacies] = useState<Pharmacy[]>(mockPharmacies);

  const [selectedRefill, setSelectedRefill] = useState<RefillRequest | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(mockPatients[0].id);

  // Filters for Refill Queue
  const [filterStage, setFilterStage] = useState<WorkflowStage | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<RefillStatus | 'ALL'>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterBlocker, setFilterBlocker] = useState<string>('ALL');
  const [filterProvider, setFilterProvider] = useState<string>('ALL');
  const [filterPharmacy, setFilterPharmacy] = useState<string>('ALL');
  const [filterAge, setFilterAge] = useState<string>('ALL');
  const [queueSearchQuery, setQueueSearchQuery] = useState<string>('');

  // Global search modal
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);

  // Guided Demo Modal for Hackathon Judges
  const [isGuidedDemoOpen, setIsGuidedDemoOpen] = useState<boolean>(false);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);

  const setMode = (m: 'landing' | 'app') => {
    setModeState(m);
    localStorage.setItem('rxresolve_mode', m);
  };

  const setCurrentView = (v: AppView) => {
    setCurrentViewState(v);
    localStorage.setItem('rxresolve_view', v);
  };

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    // Dynamic persona matching
    let personaName = 'Elena Rostova, MA';
    let personaEmail = 'elena.rostova@metrohealth.org';
    if (role === 'Provider' || role === 'Physician / Prescriber') {
      personaName = 'Dr. Emily Carter, MD';
      personaEmail = 'emily.carter@metrohealth.org';
    } else if (role === 'Pharmacy Staff' || role === 'Pharmacy Liaison') {
      personaName = 'Marcus Vance, PharmD';
      personaEmail = 'marcus.vance@metrohealth.org';
    } else if (role === 'Operations Manager' || role === 'Practice Manager') {
      personaName = 'Sarah Jenkins, Operations Lead';
      personaEmail = 'sarah.jenkins@metrohealth.org';
    } else if (role === 'Admin') {
      personaName = 'Alex Thorne, IT & Compliance Officer';
      personaEmail = 'alex.thorne@metrohealth.org';
    }
    setCurrentUser((prev) => ({
      ...prev,
      name: personaName,
      email: personaEmail,
      role,
    }));
    showToast(`Switched operational role to: ${role} (${personaName})`);
  };

  const openRefillDetail = (caseOrId: RefillRequest | string) => {
    if (typeof caseOrId === 'string') {
      const found = refills.find((r) => r.id === caseOrId);
      if (found) {
        setSelectedRefill(found);
      }
    } else {
      setSelectedRefill(caseOrId);
    }
  };

  const closeRefillDetail = () => {
    setSelectedRefill(null);
  };

  const viewPatient360 = (patientId: string) => {
    setSelectedPatientId(patientId);
    setCurrentView('patient-360');
    setMode('app');
  };

  const resetQueueFilters = () => {
    setFilterStage('ALL');
    setFilterStatus('ALL');
    setFilterPriority('ALL');
    setFilterBlocker('ALL');
    setFilterProvider('ALL');
    setFilterPharmacy('ALL');
    setFilterAge('ALL');
    setQueueSearchQuery('');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 4000);
  };

  const resolveRefill = async (refillId: string) => {
    const updated = await refillService.resolveRefill(refillId, currentUser.name);
    if (updated) {
      setRefills((prev) => prev.map((r) => (r.id === refillId ? updated : r)));
      if (selectedRefill?.id === refillId) {
        setSelectedRefill(updated);
      }
      showToast('Refill case marked as resolved and verified with pharmacy.');
    }
  };

  const updateRefillStage = async (
    refillId: string,
    newStage: WorkflowStage,
    newStatus: RefillStatus
  ) => {
    const updated = await refillService.updateStatus(
      refillId,
      newStatus,
      newStage,
      currentUser.name
    );
    if (updated) {
      setRefills((prev) => prev.map((r) => (r.id === refillId ? updated : r)));
      if (selectedRefill?.id === refillId) {
        setSelectedRefill(updated);
      }
    }
  };

  const requestProviderReview = async (refillId: string, customNote?: string) => {
    const targetCase = refills.find((r) => r.id === refillId);
    if (!targetCase) return;

    const now = new Date();
    const timestampFormatted = now.toISOString().replace('T', ' ').substring(0, 16);

    const newTask: Task = {
      id: `tsk-${Date.now()}`,
      refillId,
      title: `Physician Review & Sign-Off: ${targetCase.medication.name} ${targetCase.medication.dosage}`,
      description: customNote || 'Review patient chart and authorize 1-year maintenance renewal (90-day supply x 3 refills).',
      assignedTo: `Dr. ${targetCase.provider.lastName}`,
      assignedRole: 'Physician / Prescriber',
      dueDate: 'Today, 17:00',
      priority: 'HIGH',
      completed: false,
    };

    const newWfEvent: WorkflowEvent = {
      id: `wf-${Date.now()}`,
      timestamp: timestampFormatted,
      stage: 'PROVIDER REVIEW',
      title: 'Provider Review Requested',
      description: `Dispatched to Dr. ${targetCase.provider.lastName}'s priority sign-off inbox by ${currentUser.name}.`,
      actor: currentUser.name,
    };

    const newAuditEvent: AuditEvent = {
      id: `aud-${Date.now()}`,
      refillId,
      patientId: targetCase.patientId,
      timestamp: timestampFormatted + ':00',
      actorName: currentUser.name,
      actorRole: currentUser.role,
      ipAddress: '192.168.1.104',
      action: 'Request Provider Review',
      category: 'CLINICAL_REVIEW',
      outcome: 'SUCCESS',
      details: `Generated priority provider review task for Dr. ${targetCase.provider.lastName}.`,
    };

    const updatedRefill: RefillRequest = {
      ...targetCase,
      status: 'WAITING FOR PROVIDER',
      workflowStage: 'PROVIDER REVIEW',
      owner: `Dr. ${targetCase.provider.lastName}`,
      ownerRole: 'Physician / Prescriber',
      nextAction: 'Physician electronic sign-off on e-Prescription',
      tasks: [newTask, ...targetCase.tasks],
      workflowTimeline: [...targetCase.workflowTimeline, newWfEvent],
      auditHistory: [newAuditEvent, ...targetCase.auditHistory],
      didActionActuallyHappen: {
        status: 'IN_PROGRESS',
        details: `Provider review task queued in Dr. ${targetCase.provider.lastName}'s inbox at ${timestampFormatted}.`,
      },
    };

    // Update blocker graph if present
    if (updatedRefill.blockerGraph) {
      updatedRefill.blockerGraph = updatedRefill.blockerGraph.map((node) => {
        if (node.id === 'node-4') {
          return { ...node, status: 'COMPLETED', timestamp: timestampFormatted };
        }
        if (node.id === 'node-5') {
          return { ...node, status: 'ACTIVE_BLOCKED', timestamp: timestampFormatted };
        }
        return node;
      });
    }

    setRefills((prev) => prev.map((r) => (r.id === refillId ? updatedRefill : r)));
    if (selectedRefill?.id === refillId) {
      setSelectedRefill(updatedRefill);
    }

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Provider Review Requested: ${refillId}`,
      description: `Dispatched to Dr. ${targetCase.provider.lastName} for ${targetCase.patient.firstName} ${targetCase.patient.lastName}.`,
      timestamp: 'Just now',
      read: false,
      refillId,
      priority: 'HIGH',
      category: 'PROVIDER_ALERT',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast('Provider review request created.');
  };

  const sendPatientUpdate = async (refillId: string, messageText: string) => {
    const targetCase = refills.find((r) => r.id === refillId);
    if (!targetCase) return;

    const timestampFormatted = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      refillId,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderOrg: currentUser.organization,
      timestamp: timestampFormatted,
      content: `[Patient SMS Update]: ${messageText}`,
      isPharmacyStaff: false,
      channel: 'Internal Note',
    };

    const newWfEvent: WorkflowEvent = {
      id: `wf-${Date.now()}`,
      timestamp: timestampFormatted,
      stage: targetCase.workflowStage,
      title: 'Patient SMS Update Sent',
      description: `Dispatched status notification to patient mobile: "${messageText}"`,
      actor: currentUser.name,
    };

    const updatedRefill: RefillRequest = {
      ...targetCase,
      messages: [...targetCase.messages, newMsg],
      workflowTimeline: [...targetCase.workflowTimeline, newWfEvent],
    };

    setRefills((prev) => prev.map((r) => (r.id === refillId ? updatedRefill : r)));
    if (selectedRefill?.id === refillId) {
      setSelectedRefill(updatedRefill);
    }
    showToast('Patient status update SMS dispatched.');
  };

  const contactPharmacy = async (refillId: string, inquiryText: string) => {
    const targetCase = refills.find((r) => r.id === refillId);
    if (!targetCase) return;

    const timestampFormatted = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      refillId,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderOrg: currentUser.organization,
      timestamp: timestampFormatted,
      content: inquiryText,
      isPharmacyStaff: false,
      channel: 'Direct Secure Messaging',
    };

    const newWfEvent: WorkflowEvent = {
      id: `wf-${Date.now()}`,
      timestamp: timestampFormatted,
      stage: targetCase.workflowStage,
      title: 'Pharmacy Inquiry Transmitted',
      description: `Sent clarification query to ${targetCase.pharmacy.name}.`,
      actor: currentUser.name,
    };

    const updatedRefill: RefillRequest = {
      ...targetCase,
      status: 'WAITING FOR PHARMACY',
      messages: [...targetCase.messages, newMsg],
      workflowTimeline: [...targetCase.workflowTimeline, newWfEvent],
    };

    setRefills((prev) => prev.map((r) => (r.id === refillId ? updatedRefill : r)));
    if (selectedRefill?.id === refillId) {
      setSelectedRefill(updatedRefill);
    }
    showToast(`Clarification transmitted to ${targetCase.pharmacy.name} via Surescripts.`);
  };

  const assignStaff = async (refillId: string, staffName: string, role: UserRole) => {
    const targetCase = refills.find((r) => r.id === refillId);
    if (!targetCase) return;

    const timestampFormatted = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newWfEvent: WorkflowEvent = {
      id: `wf-${Date.now()}`,
      timestamp: timestampFormatted,
      stage: targetCase.workflowStage,
      title: 'Case Ownership Reassigned',
      description: `Reassigned from ${targetCase.owner} to ${staffName} (${role}).`,
      actor: currentUser.name,
    };

    const updatedRefill: RefillRequest = {
      ...targetCase,
      owner: staffName,
      ownerRole: role,
      workflowTimeline: [...targetCase.workflowTimeline, newWfEvent],
    };

    setRefills((prev) => prev.map((r) => (r.id === refillId ? updatedRefill : r)));
    if (selectedRefill?.id === refillId) {
      setSelectedRefill(updatedRefill);
    }
    showToast(`Case ownership assigned to ${staffName}.`);
  };

  const addCaseNote = async (refillId: string, noteContent: string) => {
    const targetCase = refills.find((r) => r.id === refillId);
    if (!targetCase) return;

    const timestampFormatted = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      refillId,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderOrg: currentUser.organization,
      timestamp: timestampFormatted,
      content: `[Internal Note]: ${noteContent}`,
      isPharmacyStaff: false,
      channel: 'Internal Note',
    };

    const newAuditEvent: AuditEvent = {
      id: `aud-${Date.now()}`,
      refillId,
      patientId: targetCase.patientId,
      timestamp: timestampFormatted + ':00',
      actorName: currentUser.name,
      actorRole: currentUser.role,
      ipAddress: '192.168.1.104',
      action: 'Add Clinical Case Note',
      category: 'CLINICAL_REVIEW',
      outcome: 'SUCCESS',
      details: noteContent,
    };

    const updatedRefill: RefillRequest = {
      ...targetCase,
      messages: [...targetCase.messages, newMsg],
      auditHistory: [newAuditEvent, ...targetCase.auditHistory],
    };

    setRefills((prev) => prev.map((r) => (r.id === refillId ? updatedRefill : r)));
    if (selectedRefill?.id === refillId) {
      setSelectedRefill(updatedRefill);
    }
    showToast('Internal clinical note appended to case history.');
  };

  const escalateCase = async (refillId: string, reason: string) => {
    const targetCase = refills.find((r) => r.id === refillId);
    if (!targetCase) return;

    const timestampFormatted = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newWfEvent: WorkflowEvent = {
      id: `wf-${Date.now()}`,
      timestamp: timestampFormatted,
      stage: 'ACTION REQUIRED',
      title: 'Case Escalated to CRITICAL',
      description: `Escalated by ${currentUser.name}. Reason: ${reason}`,
      actor: currentUser.name,
    };

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `URGENT SLA ESCALATION: ${refillId}`,
      description: `${targetCase.patient.firstName} ${targetCase.patient.lastName}: ${reason}`,
      timestamp: 'Just now',
      read: false,
      refillId,
      priority: 'CRITICAL',
      category: 'SLA_RISK',
    };

    const updatedRefill: RefillRequest = {
      ...targetCase,
      priority: 'CRITICAL',
      workflowTimeline: [...targetCase.workflowTimeline, newWfEvent],
    };

    setRefills((prev) => prev.map((r) => (r.id === refillId ? updatedRefill : r)));
    if (selectedRefill?.id === refillId) {
      setSelectedRefill(updatedRefill);
    }
    setNotifications((prev) => [newNotif, ...prev]);
    showToast('Case escalated to CRITICAL priority. Medical Director notified.');
  };

  // Stage 3 Human-In-The-Loop AI Recommendation Actions
  const approveRecommendation = async (
    refillId: string,
    rec: import('../types').AICopilotResponseFormat['recommendedAction'],
    customNote?: string
  ): Promise<boolean> => {
    const targetCase = refills.find((r) => r.id === refillId);
    if (!targetCase) return false;

    // Clinical safeguard check: AI cannot prescribe/authorize.
    if (rec.isClinicalAuthorization || rec.actionType === 'AUTHORIZE_RENEWAL') {
      const isProvider = currentRole === 'Provider' || currentRole === 'Physician / Prescriber';
      if (!isProvider) {
        showToast('Clinical Safeguard: Only licensed Prescribers/Providers can authorize prescription renewal.');
        return false;
      }
      const authRes = await authorizePrescriptionRenewal(refillId, { notes: customNote || rec.draftMessage });
      return authRes.success;
    }

    const timestampFormatted = new Date().toISOString().replace('T', ' ').substring(0, 16);

    if (rec.actionType === 'REQUEST_PROVIDER_REVIEW') {
      await requestProviderReview(refillId, customNote || rec.draftMessage);
    } else if (rec.actionType === 'SEND_PATIENT_UPDATE') {
      await sendPatientUpdate(refillId, customNote || rec.draftMessage || 'Your refill request is currently under review by your physician.');
    } else if (rec.actionType === 'CONTACT_PHARMACY') {
      await contactPharmacy(refillId, customNote || rec.draftMessage || 'Prescription renewal authorization is in progress with prescriber.');
    } else {
      const newTask: Task = {
        id: `tsk-${Date.now()}`,
        refillId,
        title: rec.title,
        description: customNote || rec.description,
        assignedTo: rec.suggestedAssignee || currentUser.name,
        assignedRole: currentRole,
        dueDate: 'Today, 18:00',
        priority: targetCase.priority,
        completed: false,
      };

      const newAuditEvent: AuditEvent = {
        id: `aud-${Date.now()}`,
        refillId,
        patientId: targetCase.patientId,
        timestamp: timestampFormatted + ':00',
        actorName: currentUser.name,
        actorRole: currentRole,
        ipAddress: '192.168.1.104',
        action: `AI Recommendation Approved: ${rec.title}`,
        category: 'AI_REASONING',
        outcome: 'SUCCESS',
        details: `Approved by human operator ${currentUser.name}. Applied action: ${rec.description}`,
      };

      const updatedRefill: RefillRequest = {
        ...targetCase,
        tasks: [newTask, ...targetCase.tasks],
        auditHistory: [newAuditEvent, ...targetCase.auditHistory],
      };

      setRefills((prev) => prev.map((r) => (r.id === refillId ? updatedRefill : r)));
      if (selectedRefill?.id === refillId) setSelectedRefill(updatedRefill);
      showToast(`AI Recommendation "${rec.title}" approved and dispatched.`);
    }

    return true;
  };

  const editAndApproveRecommendation = async (
    refillId: string,
    rec: import('../types').AICopilotResponseFormat['recommendedAction'],
    editedText: string
  ): Promise<boolean> => {
    const targetCase = refills.find((r) => r.id === refillId);
    if (!targetCase) return false;

    const timestampFormatted = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const editAuditEvent: AuditEvent = {
      id: `aud-${Date.now()}`,
      refillId,
      patientId: targetCase.patientId,
      timestamp: timestampFormatted + ':00',
      actorName: currentUser.name,
      actorRole: currentRole,
      ipAddress: '192.168.1.104',
      action: `AI Recommendation Edited & Approved: ${rec.title}`,
      category: 'AI_REASONING',
      outcome: 'SUCCESS',
      details: `Human clinician modified drafted action. Revised content: "${editedText}"`,
    };

    targetCase.auditHistory = [editAuditEvent, ...targetCase.auditHistory];
    return approveRecommendation(refillId, { ...rec, draftMessage: editedText }, editedText);
  };

  const rejectRecommendation = async (refillId: string, reason: string): Promise<void> => {
    const targetCase = refills.find((r) => r.id === refillId);
    if (!targetCase) return;

    const timestampFormatted = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const rejectAuditEvent: AuditEvent = {
      id: `aud-${Date.now()}`,
      refillId,
      patientId: targetCase.patientId,
      timestamp: timestampFormatted + ':00',
      actorName: currentUser.name,
      actorRole: currentRole,
      ipAddress: '192.168.1.104',
      action: `AI Recommendation Overruled / Rejected`,
      category: 'AI_REASONING',
      outcome: 'WARNING',
      details: `Clinician rejected recommendation. Stated clinical rationale: "${reason}"`,
    };

    const newWfEvent: WorkflowEvent = {
      id: `wf-${Date.now()}`,
      timestamp: timestampFormatted,
      stage: targetCase.workflowStage,
      title: 'AI Recommendation Overruled',
      description: `Clinician ${currentUser.name} rejected advisory proposal: ${reason}`,
      actor: currentUser.name,
    };

    const updatedRefill: RefillRequest = {
      ...targetCase,
      auditHistory: [rejectAuditEvent, ...targetCase.auditHistory],
      workflowTimeline: [...targetCase.workflowTimeline, newWfEvent],
    };

    setRefills((prev) => prev.map((r) => (r.id === refillId ? updatedRefill : r)));
    if (selectedRefill?.id === refillId) setSelectedRefill(updatedRefill);
    showToast(`AI Recommendation rejected. Human override recorded in audit log.`);
  };

  const authorizePrescriptionRenewal = async (
    refillId: string,
    details?: { refillsCount?: number; daysSupply?: number; notes?: string }
  ): Promise<{ success: boolean; error?: string }> => {
    const targetCase = refills.find((r) => r.id === refillId);
    if (!targetCase) return { success: false, error: 'Case not found' };

    const isProvider = currentRole === 'Provider' || currentRole === 'Physician / Prescriber';
    if (!isProvider) {
      showToast('CLINICAL SAFEGUARD: Only authorized Physicians/Prescribers can sign prescription renewals.');
      return {
        success: false,
        error: 'Clinical privilege restriction: Prescriber sign-off required.',
      };
    }

    const timestampFormatted = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const refillsAuthorized = details?.refillsCount ?? 3;
    const daysSupply = details?.daysSupply ?? 90;

    const newAuditEvent: AuditEvent = {
      id: `aud-${Date.now()}`,
      refillId,
      patientId: targetCase.patientId,
      timestamp: timestampFormatted + ':00',
      actorName: currentUser.name,
      actorRole: currentRole,
      ipAddress: '192.168.1.104',
      action: 'Authorized e-Prescription Renewal',
      category: 'CLINICAL_REVIEW',
      outcome: 'SUCCESS',
      details: `Dr. ${targetCase.provider.lastName} (NPI: ${targetCase.provider.npi}) electronically signed 1-year maintenance renewal: ${daysSupply}-day supply with ${refillsAuthorized} refills. Transmitted to ${targetCase.pharmacy.name} via Surescripts.`,
    };

    const newWfEvent: WorkflowEvent = {
      id: `wf-${Date.now()}`,
      timestamp: timestampFormatted,
      stage: 'RESOLVED',
      title: 'Physician Authorized & Transmitted to Pharmacy',
      description: `Digitally signed by ${currentUser.name}. 90-day maintenance renewal dispatched via Surescripts e-Prescribing.`,
      actor: currentUser.name,
    };

    const completedTasks = targetCase.tasks.map((t) => ({
      ...t,
      completed: true,
      completedAt: timestampFormatted,
      completedBy: currentUser.name,
    }));

    const pharmacyNotif: NotificationItem = {
      id: `notif-pharm-${Date.now()}`,
      title: `Pharmacy e-ACK Received: ${refillId}`,
      description: `${targetCase.pharmacy.name} acknowledged electronic dispensing renewal for ${targetCase.patient.firstName} ${targetCase.patient.lastName}.`,
      timestamp: 'Just now',
      read: false,
      refillId,
      priority: 'MEDIUM',
      category: 'PHARMACY_UPDATE',
    };

    const patientNotif: NotificationItem = {
      id: `notif-pat-${Date.now()}`,
      title: `Patient SMS Dispatched: ${refillId}`,
      description: `Pickup notification sent to ${targetCase.patient.firstName}'s mobile phone: Medication ready for pickup.`,
      timestamp: 'Just now',
      read: false,
      refillId,
      priority: 'LOW',
      category: 'RESOLVED',
    };

    const updatedRefill: RefillRequest = {
      ...targetCase,
      status: 'RESOLVED',
      workflowStage: 'RESOLVED',
      nextAction: 'Refill completed. Patient notified for pharmacy pickup.',
      tasks: completedTasks,
      didActionActuallyHappen: {
        status: 'VERIFIED_WITH_PHARMACY',
        details: `Surescripts ACK Received from ${targetCase.pharmacy.name} at ${timestampFormatted}. Rx #${targetCase.prescription.rxNumber} renewed for 90 days x ${refillsAuthorized} refills.`,
        verifiedTimestamp: timestampFormatted,
      },
      prescription: {
        ...targetCase.prescription,
        status: 'ACTIVE',
        remainingRefills: refillsAuthorized,
        originalRefills: refillsAuthorized,
        daysSupply,
      },
      workflowTimeline: [...targetCase.workflowTimeline, newWfEvent],
      auditHistory: [newAuditEvent, ...targetCase.auditHistory],
    };

    if (updatedRefill.blockerGraph) {
      updatedRefill.blockerGraph = updatedRefill.blockerGraph.map((node) => ({
        ...node,
        status: 'COMPLETED',
        timestamp: timestampFormatted,
      }));
    }

    setRefills((prev) => prev.map((r) => (r.id === refillId ? updatedRefill : r)));
    if (selectedRefill?.id === refillId) setSelectedRefill(updatedRefill);
    setNotifications((prev) => [pharmacyNotif, patientNotif, ...prev]);
    showToast(`Prescription renewed and verified with ${targetCase.pharmacy.name}.`);
    return { success: true };
  };

  // Keyboard shortcut cmd+k / ctrl+k for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AppContext.Provider
      value={{
        mode,
        setMode,
        currentView,
        setCurrentView,
        sidebarCollapsed,
        setSidebarCollapsed,
        isGuidedDemoOpen,
        setIsGuidedDemoOpen,
        currentUser,
        currentRole,
        setCurrentRole,
        currentOrg,
        setCurrentOrg,
        organizations,
        refills,
        patients,
        providers,
        pharmacies,
        selectedRefill,
        openRefillDetail,
        closeRefillDetail,
        selectedPatientId,
        setSelectedPatientId,
        viewPatient360,
        filterStage,
        setFilterStage,
        filterStatus,
        setFilterStatus,
        filterPriority,
        setFilterPriority,
        filterBlocker,
        setFilterBlocker,
        filterProvider,
        setFilterProvider,
        filterPharmacy,
        setFilterPharmacy,
        filterAge,
        setFilterAge,
        queueSearchQuery,
        setQueueSearchQuery,
        resetQueueFilters,
        isSearchModalOpen,
        setIsSearchModalOpen,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsRead,
        resolveRefill,
        updateRefillStage,
        toastMessage,
        showToast,
        requestProviderReview,
        sendPatientUpdate,
        contactPharmacy,
        assignStaff,
        addCaseNote,
        escalateCase,
        approveRecommendation,
        editAndApproveRecommendation,
        rejectRecommendation,
        authorizePrescriptionRenewal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
