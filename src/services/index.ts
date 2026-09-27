import {
  Patient,
  Provider,
  Pharmacy,
  RefillRequest,
  Task,
  Message,
  AuditEvent,
  WorkflowStage,
  RefillStatus,
  AIRecommendation,
} from '../types';
import {
  mockPatients,
  mockProviders,
  mockPharmacies,
  mockRefillRequests,
} from '../data/mockData';

// In-memory store initialized from synthetic data (supports mutations in demo session)
let patientsStore: Patient[] = [...mockPatients];
let refillsStore: RefillRequest[] = [...mockRefillRequests];
let providersStore: Provider[] = [...mockProviders];
let pharmaciesStore: Pharmacy[] = [...mockPharmacies];

export const patientService = {
  getAll: async (): Promise<Patient[]> => {
    return [...patientsStore];
  },
  getById: async (id: string): Promise<Patient | undefined> => {
    return patientsStore.find((p) => p.id === id);
  },
  search: async (query: string): Promise<Patient[]> => {
    const q = query.toLowerCase().trim();
    return patientsStore.filter(
      (p) =>
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        p.mrn.toLowerCase().includes(q)
    );
  },
};

export const providerService = {
  getAll: async (): Promise<Provider[]> => {
    return [...providersStore];
  },
  getById: async (id: string): Promise<Provider | undefined> => {
    return providersStore.find((p) => p.id === id);
  },
};

export const pharmacyService = {
  getAll: async (): Promise<Pharmacy[]> => {
    return [...pharmaciesStore];
  },
  getById: async (id: string): Promise<Pharmacy | undefined> => {
    return pharmaciesStore.find((p) => p.id === id);
  },
};

export const refillService = {
  getAll: async (): Promise<RefillRequest[]> => {
    return [...refillsStore];
  },
  getById: async (id: string): Promise<RefillRequest | undefined> => {
    return refillsStore.find((r) => r.id === id);
  },
  getByStage: async (stage: WorkflowStage): Promise<RefillRequest[]> => {
    return refillsStore.filter((r) => r.workflowStage === stage);
  },
  getByStatus: async (status: RefillStatus): Promise<RefillRequest[]> => {
    return refillsStore.filter((r) => r.status === status);
  },
  updateStatus: async (
    id: string,
    status: RefillStatus,
    stage: WorkflowStage,
    actorName: string
  ): Promise<RefillRequest | null> => {
    const index = refillsStore.findIndex((r) => r.id === id);
    if (index === -1) return null;

    const existing = refillsStore[index];
    const updated: RefillRequest = {
      ...existing,
      status,
      workflowStage: stage,
      workflowTimeline: [
        ...existing.workflowTimeline,
        {
          id: `wf-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          stage,
          title: `Status changed to ${status}`,
          description: `Updated by ${actorName}`,
          actor: actorName,
        },
      ],
      auditHistory: [
        ...existing.auditHistory,
        {
          id: `aud-${Date.now()}`,
          refillId: id,
          patientId: existing.patientId,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          actorName,
          actorRole: 'User Action',
          ipAddress: '127.0.0.1',
          action: `Change Status to ${status}`,
          category: 'REFILL_MODIFICATION',
          outcome: 'SUCCESS',
          details: `Workflow stage updated to ${stage}`,
        },
      ],
    };
    refillsStore[index] = updated;
    return updated;
  },
  resolveRefill: async (id: string, actorName: string): Promise<RefillRequest | null> => {
    return refillService.updateStatus(id, 'RESOLVED', 'RESOLVED', actorName);
  },
};

export const taskService = {
  getTasksForRefill: async (refillId: string): Promise<Task[]> => {
    const refill = refillsStore.find((r) => r.id === refillId);
    return refill ? refill.tasks : [];
  },
  getAllTasks: async (): Promise<Task[]> => {
    return refillsStore.flatMap((r) => r.tasks);
  },
  toggleTaskCompleted: async (refillId: string, taskId: string, completedBy: string): Promise<boolean> => {
    const refill = refillsStore.find((r) => r.id === refillId);
    if (!refill) return false;
    const task = refill.tasks.find((t) => t.id === taskId);
    if (!task) return false;
    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toISOString() : undefined;
    task.completedBy = task.completed ? completedBy : undefined;
    return true;
  },
  createTask: async (refillId: string, task: Omit<Task, 'id' | 'completed'>): Promise<Task | null> => {
    const refill = refillsStore.find((r) => r.id === refillId);
    if (!refill) return null;
    const newTask: Task = {
      ...task,
      id: `tsk-${Date.now()}`,
      completed: false,
    };
    refill.tasks.push(newTask);
    return newTask;
  },
};

export const messageService = {
  getMessagesForRefill: async (refillId: string): Promise<Message[]> => {
    const refill = refillsStore.find((r) => r.id === refillId);
    return refill ? refill.messages : [];
  },
  sendMessage: async (
    refillId: string,
    content: string,
    senderName: string,
    senderRole: string,
    senderOrg: string,
    isPharmacyStaff: boolean
  ): Promise<Message | null> => {
    const refill = refillsStore.find((r) => r.id === refillId);
    if (!refill) return null;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      refillId,
      senderName,
      senderRole,
      senderOrg,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      content,
      isPharmacyStaff,
      channel: isPharmacyStaff ? 'Pharmacy Portal' : 'Direct EHR Link',
    };
    refill.messages.push(newMsg);
    return newMsg;
  },
};

export const auditService = {
  getAllEvents: async (): Promise<AuditEvent[]> => {
    return refillsStore.flatMap((r) => r.auditHistory).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  },
  logEvent: (event: Omit<AuditEvent, 'id' | 'timestamp'>): AuditEvent => {
    const newEvent: AuditEvent = {
      ...event,
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    return newEvent;
  },
};

export {
  aiService,
  classifyRefill,
  summarizePatient,
  summarizeCase,
  detectMissingInformation,
  recommendNextAction,
  draftProviderMessage,
  draftPatientMessage,
  draftPharmacyMessage,
  searchWorkflow,
  explainBlocker,
  prioritizeCase,
  queryCopilot,
  CLINICAL_GUARDRAIL_NOTICE,
} from './aiService';

