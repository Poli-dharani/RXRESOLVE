import React, { useState } from 'react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  User,
  Building,
  AlertCircle,
  FileText,
  UserCheck,
  Send,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface GuidedDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DemoStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  details: string;
  actionText: string;
  icon: React.ElementType;
}

const DEMO_STEPS: DemoStep[] = [
  {
    stepNumber: 1,
    title: 'Meet Sarah Mitchell.',
    subtitle: '58-year-old patient on maintenance therapy for Hyperlipidemia & Hypertension.',
    details: 'Sarah has taken Atorvastatin 20 mg daily for 14 consecutive months with high medication adherence. Her previous prescription has exhausted its authorized refills.',
    actionText: 'Inspect Sarah Mitchell in Refill Queue',
    icon: User,
  },
  {
    stepNumber: 2,
    title: 'Her pharmacy submitted a refill request.',
    subtitle: 'CVS Pharmacy #4821 transmitted electronic NCPDP refill request via Surescripts.',
    details: 'Because remaining refills = 0, the pharmacy management system cannot dispense medication without fresh physician authorization. Request enters RXRESOLVE intake queue.',
    actionText: 'View Electronic Ingest Payload',
    icon: Building,
  },
  {
    stepNumber: 3,
    title: 'RXRESOLVE identifies the blocker.',
    subtitle: 'Diagnostic engine isolates root cause in 120ms with 96% confidence.',
    details: 'Blocker: 0 refills remaining on original prescription. Secondary check: Most recent clinical visit was 5 months ago; routine annual lipid panel is recommended.',
    actionText: 'Examine Diagnostic Blocker Card',
    icon: AlertCircle,
  },
  {
    stepNumber: 4,
    title: 'AI summarizes relevant patient context.',
    subtitle: 'Prepares structured SBAR clinical briefing with zero hidden reasoning.',
    details: 'Synthesizes 14 months of fill dates, recent encounters, vital signs, and allergy telemetry so the clinical team doesn’t waste time digging through 80-page chart notes.',
    actionText: 'Read Synthesized Patient Context',
    icon: FileText,
  },
  {
    stepNumber: 5,
    title: 'The system routes the case to the provider.',
    subtitle: 'Dispatches prioritized task into Dr. Emily Carter’s EHR sign-off queue.',
    details: 'Practice staff Elena Rostova, MA approves routing with 1-click. Priority is set to HIGH. Pre-drafted provider SBAR review packet is attached.',
    actionText: 'Route Case to Dr. Carter',
    icon: Send,
  },
  {
    stepNumber: 6,
    title: 'The provider reviews the case.',
    subtitle: 'Dr. Emily Carter, MD logs in and reviews chart telemetry.',
    details: 'Dr. Carter checks the SBAR packet: Sarah is stable on 20 mg, BP is 124/80, adherence is >90%. Clinician decides to renew 90-day maintenance supply x 3 refills.',
    actionText: 'Open Provider Sign-Off View',
    icon: UserCheck,
  },
  {
    stepNumber: 7,
    title: 'Provider authorizes the refill.',
    subtitle: 'Physician electronically signs renewal order (DEA-EPCS validated).',
    details: 'Human-in-the-loop clinical governance enforced: AI cannot prescribe. Dr. Carter enters authorization pin. Order is digitally stamped with Prescriber NPI 1982736410.',
    actionText: 'Execute Electronic Authorization',
    icon: ShieldCheck,
  },
  {
    stepNumber: 8,
    title: 'Pharmacy is notified.',
    subtitle: 'Surescripts e-Prescribing Script transmission confirmed with CVS.',
    details: 'Bi-directional e-ACK received from CVS Pharmacy #4821 within 48 seconds. Pharmacist Marcus Vance clears the prescription for dispensing.',
    actionText: 'Verify Surescripts e-ACK',
    icon: Building,
  },
  {
    stepNumber: 9,
    title: 'Patient receives an update.',
    subtitle: 'HIPAA-compliant SMS update dispatched to Sarah Mitchell’s mobile phone.',
    details: '"Hi Sarah, Dr. Carter has approved your Atorvastatin 20 mg renewal and sent it to CVS Pharmacy #4821. It will be ready for pickup shortly."',
    actionText: 'View Dispatched SMS Notification',
    icon: Send,
  },
  {
    stepNumber: 10,
    title: 'The workflow is resolved.',
    subtitle: 'Complete loop closed: Case marked RESOLVED in under 2 hours.',
    details: 'Cryptographic SHA-256 audit ledger entry registered. Practice turnaround metrics updated. Uninterrupted patient medication adherence preserved.',
    actionText: 'View Completed Audit Ledger & Analytics',
    icon: CheckCircle2,
  },
];

export const GuidedDemoModal: React.FC<GuidedDemoModalProps> = ({ isOpen, onClose }) => {
  const {
    openRefillDetail,
    refills,
    setCurrentRole,
    setCurrentView,
    requestProviderReview,
    authorizePrescriptionRenewal,
    sendPatientUpdate,
    showToast,
  } = useApp();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = DEMO_STEPS[currentStepIndex];
  const Icon = currentStep.icon;
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === DEMO_STEPS.length - 1;
  const targetCase = refills.find((r) => r.id === 'RX-10482') || refills[0];

  const applyStepAction = async (stepIdx: number) => {
    switch (stepIdx) {
      case 0: // Step 1: Meet Sarah
        setCurrentView('patient-360');
        showToast('Demo Step 1: Patient 360 loaded for Sarah Mitchell');
        break;
      case 1: // Step 2: Pharmacy submitted
        setCurrentView('queue');
        showToast('Demo Step 2: Inbound electronic queue displayed');
        break;
      case 2: // Step 3: RXRESOLVE blocker
      case 3: // Step 4: AI summarizes
        openRefillDetail(targetCase);
        showToast('Demo Step 3 & 4: Diagnostic Blocker & Patient Context viewed');
        break;
      case 4: // Step 5: Route to provider
        openRefillDetail(targetCase);
        await requestProviderReview(targetCase.id);
        break;
      case 5: // Step 6: Provider reviews
        setCurrentRole('Provider');
        openRefillDetail(targetCase);
        showToast('Demo Step 6: Switched to Dr. Emily Carter persona');
        break;
      case 6: // Step 7: Provider authorizes
        setCurrentRole('Provider');
        await authorizePrescriptionRenewal(targetCase.id, { refillsCount: 3, daysSupply: 90 });
        break;
      case 7: // Step 8: Pharmacy notified
        setCurrentRole('Pharmacy Staff');
        setCurrentView('messages');
        showToast('Demo Step 8: Pharmacy Surescripts transmission verified');
        break;
      case 8: // Step 9: Patient SMS
        await sendPatientUpdate(
          targetCase.id,
          `Hi Sarah, Dr. Carter has approved your Atorvastatin 20 mg renewal and sent it to ${targetCase.pharmacy.name}. It will be ready for pickup shortly.`
        );
        break;
      case 9: // Step 10: Resolved
        setCurrentView('analytics');
        showToast('Demo Step 10: Full loop resolved and verified in Analytics');
        break;
    }
  };

  const handleNext = () => {
    if (!isLast) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      applyStepAction(nextIdx);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (!isFirst) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      applyStepAction(prevIdx);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-lg w-full px-4 animate-in slide-in-from-bottom-5">
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 p-5 space-y-4">
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center font-bold text-xs">
              {currentStep.stepNumber}
            </span>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              GUIDED DEMO · STEP {currentStep.stepNumber} OF 10
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
            title="Skip Demo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Content */}
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">{currentStep.title}</h3>
              <p className="text-xs text-teal-400 font-medium">{currentStep.subtitle}</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            {currentStep.details}
          </p>
        </div>

        {/* Navigation Controls: NEXT, BACK, SKIP DEMO */}
        <div className="pt-2 flex items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white font-medium px-2 py-1"
          >
            SKIP DEMO
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBack}
              disabled={isFirst}
              className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>BACK</span>
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1 shadow-md"
            >
              <span>{isLast ? 'COMPLETE DEMO' : 'NEXT'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
