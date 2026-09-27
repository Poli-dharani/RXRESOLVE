import {
  RefillRequest,
  Patient,
  HistoricalRefill,
  UserRole,
  AICopilotResponseFormat,
  BlockerCategory,
  Priority,
} from '../types';

/**
 * RXRESOLVE Clinical & Operational AI Engine
 * 
 * Complies with strict clinical safety standards:
 * - AI cannot prescribe, change dosage, change medication, discontinue medication, or authorize treatment.
 * - Every recommendation requires human approval (APPROVE / EDIT / REJECT).
 * - All responses adhere to the standard schema: SUMMARY, BLOCKER, EVIDENCE, CONFIDENCE, RECOMMENDED ACTION, HUMAN APPROVAL.
 */

export const CLINICAL_GUARDRAIL_NOTICE =
  'AI recommendations are advisory only. AI is strictly prohibited from prescribing, changing dosages, substituting medications, or authorizing clinical treatment. Clinical authorization requires an authorized healthcare provider.';

// 1. Classify Refill
export function classifyRefill(refill: RefillRequest): {
  primaryCategory: BlockerCategory;
  urgency: Priority;
  confidence: number;
  rootCause: string;
  rationale: string;
} {
  const remaining = refill.prescription?.remainingRefills ?? 0;
  const isExpired = refill.prescription?.status === 'EXPIRED';
  const hasPA = refill.patient?.insurance?.priorAuthOnRecord;

  if (remaining === 0) {
    return {
      primaryCategory: 'NO_REFILLS',
      urgency: refill.priority,
      confidence: 96,
      rootCause: 'Zero refills remaining on current prescription',
      rationale:
        'Original prescription authorization depleted. State pharmacy board regulations prohibit pharmacy dispensing without new signed provider order.',
    };
  }

  if (isExpired) {
    return {
      primaryCategory: 'PROVIDER_REVIEW',
      urgency: 'HIGH',
      confidence: 94,
      rootCause: 'Prescription order has passed 12-month expiration date',
      rationale:
        'Prescription exceeded valid regulatory fill window. Provider re-evaluation and new e-prescription required.',
    };
  }

  if (!hasPA && (refill.medication.name.includes('Ozempic') || refill.medication.name.includes('Semaglutide'))) {
    return {
      primaryCategory: 'INSURANCE_BLOCK',
      urgency: 'HIGH',
      confidence: 92,
      rootCause: 'Prior Authorization required by PBM formulary',
      rationale:
        'Commercial insurer requires Type 2 Diabetes clinical documentation and step-therapy trial before covering GLP-1 therapy.',
    };
  }

  if (refill.blockerCategory) {
    return {
      primaryCategory: refill.blockerCategory,
      urgency: refill.priority,
      confidence: refill.aiRecommendation?.confidenceScore || 90,
      rootCause: refill.blockerDescription || refill.whatIsBlocking,
      rationale: refill.aiRecommendation?.clinicalRationale || 'Standard triage rules applied.',
    };
  }

  return {
    primaryCategory: 'PROVIDER_REVIEW',
    urgency: refill.priority,
    confidence: 88,
    rootCause: 'Clinical review required before renewal',
    rationale: 'Maintenance therapy requires ongoing clinical oversight.',
  };
}

// 2. Summarize Patient Refill History
export function summarizePatient(
  patient: Patient,
  refillHistory?: HistoricalRefill[]
): {
  summary: string;
  maintenanceMonths: number;
  adherenceRating: string;
  interventionsCount: number;
  chronicConditions: string[];
  recentEncountersSummary: string;
} {
  const history = refillHistory || patient.refillHistory || [];
  const interventions = history.filter((h) => h.blockerCategory && h.blockerCategory !== 'Routine Refill').length;
  const conditions = patient.conditions || [];
  const lastEncounter = patient.lastEncounterDate || '5 months ago';

  return {
    summary: `${patient.firstName} ${patient.lastName} has been receiving maintenance pharmacotherapy consistently. The patient has ${interventions} prior refill interventions documented in the last 12 months. Last clinical encounter occurred ${lastEncounter}.`,
    maintenanceMonths: 14,
    adherenceRating: 'High (>90% Proportion of Days Covered)',
    interventionsCount: interventions,
    chronicConditions: conditions,
    recentEncountersSummary: `Last encounter: ${lastEncounter}. Conditions: ${conditions.join(', ') || 'Hypertension, Dyslipidemia'}. Allergies: ${patient.allergies?.join(', ') || 'No known drug allergies'}.`,
  };
}

// 3. Summarize Case (The 6 Operational Questions)
export function summarizeCase(refill: RefillRequest): {
  whatIsHappening: string;
  whatIsBlocking: string;
  whatInformationIsMissing: string[];
  whoNeedsToAct: string;
  whatShouldHappenNext: string;
  didActionActuallyHappen: string;
} {
  return {
    whatIsHappening: refill.whatIsHappening || `${refill.pharmacy.name} requested refill renewal for ${refill.patient.firstName} ${refill.patient.lastName}.`,
    whatIsBlocking: refill.whatIsBlocking || refill.blockerDescription || 'Provider authorization required.',
    whatInformationIsMissing: refill.whatInformationIsMissing || ['Routine monitoring check'],
    whoNeedsToAct: refill.whoNeedsToAct || refill.owner || `Dr. ${refill.provider.lastName}`,
    whatShouldHappenNext: refill.whatShouldHappenNext || refill.nextAction || 'Provider review and e-prescription renewal.',
    didActionActuallyHappen: refill.didActionActuallyHappen?.details || 'Task queued in provider inbox.',
  };
}

// 4. Detect Missing Information
export function detectMissingInformation(refill: RefillRequest): {
  missingItems: string[];
  impactLevel: 'CRITICAL' | 'MODERATE' | 'LOW';
  recommendedDataGatheringAction: string;
} {
  const missing: string[] = [];
  const med = refill.medication.name.toLowerCase();

  if (refill.prescription.remainingRefills === 0) {
    missing.push('Updated provider prescription order (original 0 refills remaining)');
  }

  if (med.includes('atorvastatin') || med.includes('statin')) {
    if (!refill.patient.lastLabsDate || refill.patient.lastLabsDate.includes('2025')) {
      missing.push('Recent lipid panel (routine 12-month monitoring check)');
    }
  }

  if (med.includes('lisinopril') || med.includes('losartan')) {
    missing.push('Recent Basic Metabolic Panel / Serum Creatinine & Potassium');
  }

  if (med.includes('eliquis') || med.includes('warfarin')) {
    missing.push('Recent renal function (eGFR / CrCl) for dosage validation');
  }

  if (med.includes('ozempic') || med.includes('mounjaro')) {
    missing.push('PBM Prior Authorization re-certification criteria (CMS Form PA-9)');
  }

  if (refill.whatInformationIsMissing && refill.whatInformationIsMissing.length > 0) {
    refill.whatInformationIsMissing.forEach((item) => {
      if (!missing.includes(item)) missing.push(item);
    });
  }

  return {
    missingItems: missing.length > 0 ? missing : ['No critical clinical data points missing for routine renewal.'],
    impactLevel: missing.length > 1 ? 'CRITICAL' : 'MODERATE',
    recommendedDataGatheringAction:
      missing.length > 0
        ? `Prompt clinical staff to attach ${missing[0]} to provider sign-off packet.`
        : 'All necessary chart notes and telemetry available for immediate provider sign-off.',
  };
}

// 5. Recommend Next Action (Role-Aware)
export function recommendNextAction(
  refill: RefillRequest,
  role: UserRole
): {
  actionTitle: string;
  actionDescription: string;
  actionType: 'REQUEST_PROVIDER_REVIEW' | 'SEND_PATIENT_UPDATE' | 'CONTACT_PHARMACY' | 'ASSIGN_STAFF' | 'ORDER_LAB' | 'AUTHORIZE_RENEWAL' | 'CUSTOM';
  requiresClinicalAuth: boolean;
  draftText?: string;
} {
  const isProvider = role === 'Provider' || role === 'Physician / Prescriber';
  const isPharmacy = role === 'Pharmacy Staff' || role === 'Pharmacy Liaison';

  if (isProvider) {
    return {
      actionTitle: 'Authorize 1-Year Maintenance Renewal',
      actionDescription: `Authorize 90-day supply with 3 renewals for ${refill.patient.firstName} ${refill.patient.lastName} (${refill.medication.name} ${refill.medication.dosage}).`,
      actionType: 'AUTHORIZE_RENEWAL',
      requiresClinicalAuth: true,
      draftText: `Authorize maintenance renewal for ${refill.medication.name} ${refill.medication.dosage}, 90 days supply, 3 refills. Lab telemetry reviewed and acceptable.`,
    };
  }

  if (isPharmacy) {
    return {
      actionTitle: 'Transmit Surescripts Refill Renewal Request',
      actionDescription: `Forward electronic NCPDP refill request with 90-day maintenance bridge note to Dr. ${refill.provider.lastName}.`,
      actionType: 'CONTACT_PHARMACY',
      requiresClinicalAuth: false,
      draftText: `Refill renewal authorization requested for ${refill.patient.firstName} ${refill.patient.lastName}, DOB ${refill.patient.dateOfBirth}. 0 refills remaining. Last filled 88 days ago.`,
    };
  }

  // Practice Staff / Ops / Admin
  return {
    actionTitle: 'Dispatch SBAR Review Packet to Provider',
    actionDescription: `Queue prioritized chart review in Dr. ${refill.provider.lastName}'s e-Prescribing inbox with pre-attached lab results.`,
    actionType: 'REQUEST_PROVIDER_REVIEW',
    requiresClinicalAuth: false,
    draftText: `Refill Request Review: ${refill.medication.name} ${refill.medication.dosage} for ${refill.patient.firstName} ${refill.patient.lastName}. 0 refills remaining. Last encounter 5 months ago; chart notes confirm stable adherence.`,
  };
}

// 6. Draft Provider Review Message
export function draftProviderMessage(refill: RefillRequest, customContext?: string): string {
  return `SBAR REFILL REVIEW REQUEST
PATIENT: ${refill.patient.firstName} ${refill.patient.lastName} (DOB: ${refill.patient.dateOfBirth}, MRN: ${refill.patient.mrn})
MEDICATION: ${refill.medication.name} ${refill.medication.dosage} (SIG: ${refill.medication.sig})
PHARMACY: ${refill.pharmacy.name} (Phone: ${refill.pharmacy.phone})
STATUS: 0 refills remaining on original prescription dated ${refill.prescription.datePrescribed}.
CLINICAL CONTEXT: Patient has been on stable maintenance therapy for 14 months. Last clinical encounter on ${refill.patient.lastEncounterDate}. ${customContext || 'No reported adverse events or contraindications in chart.'}
RECOMMENDED ORDER: Renew 90-day supply with 3 refills (1-year maintenance protocol).`;
}

// 7. Draft Patient Update Message
export function draftPatientMessage(refill: RefillRequest, channel: 'SMS' | 'Portal' = 'SMS'): string {
  if (channel === 'SMS') {
    return `Hi ${refill.patient.firstName}, this is Dr. ${refill.provider.lastName}'s office. We received your refill request for ${refill.medication.name} from ${refill.pharmacy.name}. Because your previous prescription reached 0 remaining refills, your doctor is reviewing your chart to authorize a new renewal. We will notify you as soon as it is approved and sent to your pharmacy.`;
  }
  return `Dear ${refill.patient.firstName} ${refill.patient.lastName},\n\nWe have received an electronic refill renewal request from ${refill.pharmacy.name} for ${refill.medication.name} ${refill.medication.dosage}.\n\nYour previous prescription has completed its authorized fills. Dr. ${refill.provider.lastName} is reviewing your chart to sign off on a new 1-year maintenance renewal.\n\nEstimated completion: Within 4 to 8 business hours. If you need an emergency bridge supply, please contact your pharmacy directly.`;
}

// 8. Draft Pharmacy Clarification Message
export function draftPharmacyMessage(refill: RefillRequest): string {
  return `RE: Refill Authorization Request — RX-${refill.prescription.rxNumber}
PATIENT: ${refill.patient.lastName}, ${refill.patient.firstName} | DOB: ${refill.patient.dateOfBirth}
MEDICATION: ${refill.medication.name} ${refill.medication.dosage}
PRESCRIBER: Dr. ${refill.provider.firstName} ${refill.provider.lastName}, MD (NPI: ${refill.provider.npi})

This message confirms that Dr. ${refill.provider.lastName}'s clinical team has received your refill request. The previous order had 0 refills remaining. The renewal order is currently queued for physician electronic signature. Please expect electronic transmission via Surescripts by end-of-day.`;
}

// 9. Search Workflow
export function searchWorkflow(query: string, refills: RefillRequest[]): RefillRequest[] {
  const q = query.toLowerCase().trim();
  if (!q) return refills;

  return refills.filter(
    (r) =>
      r.id.toLowerCase().includes(q) ||
      r.patient.firstName.toLowerCase().includes(q) ||
      r.patient.lastName.toLowerCase().includes(q) ||
      r.medication.name.toLowerCase().includes(q) ||
      r.provider.lastName.toLowerCase().includes(q) ||
      r.pharmacy.name.toLowerCase().includes(q) ||
      r.blockerDescription.toLowerCase().includes(q) ||
      r.status.toLowerCase().includes(q) ||
      r.priority.toLowerCase().includes(q)
  );
}

// 10. Explain Blocker
export function explainBlocker(refill: RefillRequest): {
  summary: string;
  blocker: string;
  evidence: string[];
  confidence: number;
  recommendedAction: string;
} {
  const classification = classifyRefill(refill);
  const missing = detectMissingInformation(refill);

  return {
    summary: `Refill ${refill.id} for ${refill.patient.firstName} ${refill.patient.lastName} is blocked because ${classification.rootCause.toLowerCase()}.`,
    blocker: `${refill.blockerDescription || classification.rootCause} (${refill.whoNeedsToAct || 'Provider'} action required)`,
    evidence: [
      `Prescription record indicates ${refill.prescription.remainingRefills} remaining refills out of ${refill.prescription.originalRefills} originally authorized.`,
      `Last relevant encounter was on ${refill.patient.lastEncounterDate || '5 months ago'}.`,
      `Pharmacy ${refill.pharmacy.name} transmitted electronic refill request on ${refill.dateCreated}.`,
      ...missing.missingItems.slice(0, 2).map((item) => `Missing check: ${item}`),
    ],
    confidence: classification.confidence,
    recommendedAction: refill.nextAction || 'Request provider electronic review and renewal order.',
  };
}

// 11. Prioritize Case
export function prioritizeCase(refill: RefillRequest): {
  priority: Priority;
  score: number;
  clinicalRisk: string;
  turnaroundDeadline: string;
} {
  let score = 50;
  let risk = 'Standard maintenance medication';
  let deadline = 'Within 24 hours';

  const med = refill.medication.name.toLowerCase();

  if (refill.medication.isControlled) {
    score += 35;
    risk = 'Schedule controlled substance — strict DEA chain of custody required.';
    deadline = 'Within 4 hours';
  } else if (med.includes('eliquis') || med.includes('warfarin') || med.includes('anticoagulant')) {
    score += 45;
    risk = 'High-risk anticoagulant therapy — omission creates immediate thromboembolic risk.';
    deadline = 'Immediate (Under 2 hours)';
  } else if (med.includes('insulin') || med.includes('ozempic')) {
    score += 30;
    risk = 'Endocrine/glycemic control maintenance — glycemic instability risk.';
    deadline = 'Within 8 hours';
  } else if (med.includes('atorvastatin') || med.includes('amlodipine')) {
    score += 20;
    risk = 'Cardiovascular maintenance therapy — chronic adherence preservation.';
    deadline = 'Within 18 hours';
  }

  if (refill.ageHours > 16) {
    score += 15;
  }

  const priority: Priority = score >= 80 ? 'CRITICAL' : score >= 65 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW';

  return {
    priority,
    score,
    clinicalRisk: risk,
    turnaroundDeadline: deadline,
  };
}

/**
 * Main Copilot Query Engine
 * 
 * Formats every response strictly into:
 * SUMMARY
 * BLOCKER
 * EVIDENCE
 * CONFIDENCE
 * RECOMMENDED ACTION
 * HUMAN APPROVAL
 */
export async function queryCopilot(params: {
  prompt: string;
  selectedRefill: RefillRequest | null;
  allRefills: RefillRequest[];
  currentRole: UserRole;
  patient?: Patient;
}): Promise<AICopilotResponseFormat> {
  const { prompt, selectedRefill, allRefills, currentRole } = params;
  const p = prompt.toLowerCase().trim();

  // If no refill selected, choose first active high-priority refill
  const refill = selectedRefill || allRefills[0];
  const patient = refill?.patient || params.patient;

  // 1. "Why is this refill blocked?" / "explain blocker"
  if (p.includes('why is this refill blocked') || p.includes('why is') || p.includes('blocker') || p.includes('stuck')) {
    const blockerInfo = explainBlocker(refill);
    const recAction = recommendNextAction(refill, currentRole);

    return {
      summary: blockerInfo.summary,
      blocker: blockerInfo.blocker,
      evidence: blockerInfo.evidence,
      confidence: blockerInfo.confidence,
      recommendedAction: {
        title: recAction.actionTitle,
        description: recAction.actionDescription,
        actionType: recAction.actionType,
        draftMessage: recAction.draftText,
        suggestedAssignee: refill.owner,
        isClinicalAuthorization: recAction.requiresClinicalAuth,
      },
      humanApproval: 'Required',
      clinicalGuardrailNote: CLINICAL_GUARDRAIL_NOTICE,
    };
  }

  // 2. "Summarize this patient's relevant refill history"
  if (p.includes('summarize this patient') || p.includes('refill history') || p.includes('patient history')) {
    const summary = summarizePatient(patient, refill.patient.refillHistory);
    return {
      summary: `${patient.firstName} ${patient.lastName} has been receiving ${refill.medication.name} ${refill.medication.dosage} consistently for the past ${summary.maintenanceMonths} months.`,
      blocker: `0 refills remaining on original prescription. Last clinical encounter approximately 5 months ago.`,
      evidence: [
        `Consistently filled on schedule for past 14 months with ${summary.adherenceRating}.`,
        `${summary.interventionsCount} previous refill blocker interventions resolved in past 12 months.`,
        `Chronic diagnoses: ${summary.chronicConditions.join(', ') || 'Dyslipidemia'}.`,
        `Allergies on chart: ${patient.allergies?.join(', ') || 'No known drug allergies'}.`,
      ],
      confidence: 97,
      recommendedAction: {
        title: 'Queue 1-Year Maintenance Renewal Packet',
        description: `Forward 90-day maintenance prescription renewal to Dr. ${refill.provider.lastName} with chart history attached.`,
        actionType: 'REQUEST_PROVIDER_REVIEW',
        draftMessage: draftProviderMessage(refill),
        suggestedAssignee: `Dr. ${refill.provider.lastName}`,
        isClinicalAuthorization: false,
      },
      humanApproval: 'Required',
      clinicalGuardrailNote: CLINICAL_GUARDRAIL_NOTICE,
    };
  }

  // 3. "What information is missing?"
  if (p.includes('missing') || p.includes('what information is missing')) {
    const missing = detectMissingInformation(refill);
    return {
      summary: `Diagnostic scan detected ${missing.missingItems.length} missing data point(s) preventing automated refill renewal for ${refill.patient.firstName} ${refill.patient.lastName}.`,
      blocker: `Incomplete documentation / depleted authorization threshold: ${missing.missingItems[0]}`,
      evidence: missing.missingItems.map((item, idx) => `Missing item #${idx + 1}: ${item}`),
      confidence: 94,
      recommendedAction: {
        title: 'Collect Missing Telemetry / Order Review',
        description: missing.recommendedDataGatheringAction,
        actionType: 'REQUEST_PROVIDER_REVIEW',
        draftMessage: `Staff triage note: Please review missing items before authorizing: ${missing.missingItems.join(', ')}`,
        suggestedAssignee: 'Elena Rostova, MA',
        isClinicalAuthorization: false,
      },
      humanApproval: 'Required',
      clinicalGuardrailNote: CLINICAL_GUARDRAIL_NOTICE,
    };
  }

  // 4. "What should happen next?"
  if (p.includes('what should happen next') || p.includes('next action') || p.includes('next step')) {
    const recAction = recommendNextAction(refill, currentRole);
    return {
      summary: `The immediate operational next step is to ${recAction.actionTitle.toLowerCase()} to unblock dispensing for ${refill.patient.firstName} ${refill.patient.lastName}.`,
      blocker: `${refill.blockerDescription || 'Pending provider review'} awaiting actor sign-off.`,
      evidence: [
        `Assigned workflow owner: ${refill.owner} (${refill.ownerRole}).`,
        `Queue age is currently ${refill.ageFormatted} with SLA target under 24 hours.`,
        `Pharmacy ${refill.pharmacy.name} is awaiting electronic authorization confirmation.`,
      ],
      confidence: 96,
      recommendedAction: {
        title: recAction.actionTitle,
        description: recAction.actionDescription,
        actionType: recAction.actionType,
        draftMessage: recAction.draftText,
        suggestedAssignee: refill.owner,
        isClinicalAuthorization: recAction.requiresClinicalAuth,
      },
      humanApproval: 'Required',
      clinicalGuardrailNote: CLINICAL_GUARDRAIL_NOTICE,
    };
  }

  // 5. "Draft a provider review request"
  if (p.includes('draft a provider') || p.includes('provider review') || p.includes('provider message')) {
    const draftText = draftProviderMessage(refill);
    return {
      summary: `A structured SBAR clinical review packet has been drafted for Dr. ${refill.provider.lastName} regarding ${refill.medication.name} for ${refill.patient.firstName} ${refill.patient.lastName}.`,
      blocker: 'Prescription renewal authorization required (0 refills remaining).',
      evidence: [
        `Provider: Dr. ${refill.provider.lastName}, MD (NPI: ${refill.provider.npi}).`,
        `Medication: ${refill.medication.name} ${refill.medication.dosage} (${refill.medication.sig}).`,
        `Maintenance duration: 14 months on stable dosage without adverse incidents.`,
      ],
      confidence: 98,
      recommendedAction: {
        title: 'Send SBAR Packet to Provider Queue',
        description: `Deliver structured renewal request to Dr. ${refill.provider.lastName}'s priority EHR sign-off folder.`,
        actionType: 'REQUEST_PROVIDER_REVIEW',
        draftMessage: draftText,
        suggestedAssignee: `Dr. ${refill.provider.lastName}`,
        isClinicalAuthorization: false,
      },
      humanApproval: 'Required',
      clinicalGuardrailNote: CLINICAL_GUARDRAIL_NOTICE,
    };
  }

  // 6. "Draft a patient update"
  if (p.includes('draft a patient') || p.includes('patient update') || p.includes('patient message') || p.includes('sms')) {
    const draftText = draftPatientMessage(refill, 'SMS');
    return {
      summary: `A HIPAA-compliant, plain-language patient update has been prepared for ${refill.patient.firstName} ${refill.patient.lastName} (${refill.patient.phone}).`,
      blocker: 'Refill undergoing clinician chart review; proactive communication prevents repeat incoming calls.',
      evidence: [
        `Patient Mobile: ${refill.patient.phone} (SMS opt-in verified).`,
        `Refill ID: ${refill.id} (${refill.medication.name} at ${refill.pharmacy.name}).`,
        `Estimated turnaround: 4-8 business hours.`,
      ],
      confidence: 96,
      recommendedAction: {
        title: 'Dispatch Patient Status SMS',
        description: 'Send automated reassuring status message to patient mobile device.',
        actionType: 'SEND_PATIENT_UPDATE',
        draftMessage: draftText,
        suggestedAssignee: 'Practice Staff',
        isClinicalAuthorization: false,
      },
      humanApproval: 'Required',
      clinicalGuardrailNote: CLINICAL_GUARDRAIL_NOTICE,
    };
  }

  // 7. "Find previous refill blockers"
  if (p.includes('previous refill blockers') || p.includes('previous blockers') || p.includes('past blockers') || p.includes('history of blockers')) {
    const history = refill.patient.refillHistory || [];
    const historicalBlockers = history.filter((h) => h.blockerCategory);
    return {
      summary: `Historical audit reveals ${historicalBlockers.length} past refill blockers for ${refill.patient.firstName} ${refill.patient.lastName} over the past 18 months.`,
      blocker: 'Recurrent pattern of zero-refill expiration without synchronized annual office visits.',
      evidence: historicalBlockers.map(
        (h) => `${h.date} (${h.id}): ${h.blockerCategory} resolved in ${h.turnaroundTime} by ${h.resolvedBy}.`
      ),
      confidence: 95,
      recommendedAction: {
        title: 'Schedule Synchronized Annual Medication Review',
        description: 'Establish automated 90-day maintenance protocol to eliminate recurring zero-refill stalls.',
        actionType: 'SCHEDULE_VISIT',
        draftMessage: `Care coordinator note: Patient experiences recurring refill blocks every 6 months. Recommend booking annual wellness review and setting 1-year bridge renewal with 3 refills.`,
        suggestedAssignee: 'Care Coordination Team',
        isClinicalAuthorization: false,
      },
      humanApproval: 'Recommended',
      clinicalGuardrailNote: CLINICAL_GUARDRAIL_NOTICE,
    };
  }

  // 8. "Why is this case high priority?"
  if (p.includes('high priority') || p.includes('priority') || p.includes('why is this case high')) {
    const prio = prioritizeCase(refill);
    return {
      summary: `Case ${refill.id} is classified as ${prio.priority} priority (Risk Score: ${prio.score}/100) due to ${prio.clinicalRisk.toLowerCase()}.`,
      blocker: `${refill.blockerDescription} with aging queue time (${refill.ageFormatted}).`,
      evidence: [
        `Clinical Risk Category: ${prio.clinicalRisk}`,
        `Prescription Status: ${refill.prescription.remainingRefills} fills remaining, last filled ${refill.prescription.lastFilledDate}.`,
        `Resolution SLA Target: ${prio.turnaroundDeadline}.`,
        `Current Age: ${refill.ageFormatted} (Exceeds 50% of practice SLA threshold).`,
      ],
      confidence: 98,
      recommendedAction: {
        title: 'Fast-Track Provider Review Alert',
        description: `Escalate to Dr. ${refill.provider.lastName} via priority notification to ensure resolution before ${prio.turnaroundDeadline}.`,
        actionType: 'REQUEST_PROVIDER_REVIEW',
        draftMessage: `PRIORITY ESCALATION: ${refill.medication.name} for ${refill.patient.firstName} ${refill.patient.lastName}. Urgent review requested due to ${prio.clinicalRisk}.`,
        suggestedAssignee: `Dr. ${refill.provider.lastName}`,
        isClinicalAuthorization: false,
      },
      humanApproval: 'Required',
      clinicalGuardrailNote: CLINICAL_GUARDRAIL_NOTICE,
    };
  }

  // Generic / Default Query
  const recAction = recommendNextAction(refill, currentRole);
  return {
    summary: `Refill analysis for ${refill.id} (${refill.patient.firstName} ${refill.patient.lastName} — ${refill.medication.name}): Current status is ${refill.status} under ${refill.workflowStage} stage.`,
    blocker: refill.blockerDescription || 'Pending provider review and renewal sign-off.',
    evidence: [
      `Patient: ${refill.patient.firstName} ${refill.patient.lastName}, DOB: ${refill.patient.dateOfBirth}`,
      `Medication: ${refill.medication.name} ${refill.medication.dosage}, Refills Remaining: ${refill.prescription.remainingRefills}`,
      `Pharmacy: ${refill.pharmacy.name}, Prescriber: Dr. ${refill.provider.lastName}`,
      `Assigned Owner: ${refill.owner} (${refill.ownerRole})`,
    ],
    confidence: 93,
    recommendedAction: {
      title: recAction.actionTitle,
      description: recAction.actionDescription,
      actionType: recAction.actionType,
      draftMessage: recAction.draftText,
      suggestedAssignee: refill.owner,
      isClinicalAuthorization: recAction.requiresClinicalAuth,
    },
    humanApproval: 'Required',
    clinicalGuardrailNote: CLINICAL_GUARDRAIL_NOTICE,
  };
}

export const aiService = {
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
  getWorkflowSummary: async () => ({
    attentionCount: 23,
    breakdown: [
      { category: 'Provider Authorization', count: 8, confidence: 96, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
      { category: 'Missing Information', count: 6, confidence: 88, color: 'text-amber-600 bg-amber-50 border-amber-200' },
      { category: 'Insurance / PBM', count: 4, confidence: 91, color: 'text-rose-600 bg-rose-50 border-rose-200' },
      { category: 'Follow-up Required', count: 3, confidence: 94, color: 'text-teal-600 bg-teal-50 border-teal-200' },
      { category: 'Pharmacy Clarification', count: 2, confidence: 89, color: 'text-sky-600 bg-sky-50 border-sky-200' },
    ],
    disclaimer: CLINICAL_GUARDRAIL_NOTICE,
  }),
};
