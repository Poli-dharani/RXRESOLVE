import React from 'react';
import {
  Sparkles,
  Play,
  Layers,
  Users,
  Bot,
  UserCheck,
  Building,
  BarChart3,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Clock,
  Compass,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DemoCenterViewProps {
  onStartGuidedDemo: () => void;
}

export const DemoCenterView: React.FC<DemoCenterViewProps> = ({ onStartGuidedDemo }) => {
  const {
    setCurrentView,
    openRefillDetail,
    setCurrentRole,
    refills,
    showToast,
  } = useApp();

  const stuckCase = refills.find((r) => r.id === 'RX-10482') || refills[0];

  const handleRunCompleteDemo = () => {
    onStartGuidedDemo();
  };

  const handleOpenStuckRefill = () => {
    openRefillDetail(stuckCase);
    showToast('Opened primary stuck case: RX-10482 (Sarah Mitchell — Atorvastatin)');
  };

  const handleOpenPatient360 = () => {
    setCurrentView('patient-360');
    showToast('Opened Patient 360 profile for Sarah Mitchell');
  };

  const handleOpenAICopilot = () => {
    setCurrentView('copilot');
    showToast('Opened RXRESOLVE AI Copilot');
  };

  const handleOpenProviderView = () => {
    setCurrentRole('Provider');
    setCurrentView('dashboard');
    showToast('Switched to Provider persona: Dr. Emily Carter, MD');
  };

  const handleOpenPharmacyView = () => {
    setCurrentRole('Pharmacy Staff');
    setCurrentView('queue');
    showToast('Switched to Pharmacy Staff persona: Marcus Vance, PharmD');
  };

  const handleOpenAnalytics = () => {
    setCurrentView('analytics');
    showToast('Opened Operational Throughput & Bottleneck Analytics');
  };

  const handleOpenAuditTrail = () => {
    setCurrentView('audit');
    showToast('Opened Cryptographic Audit Trail & Security View');
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            Hackathon Judge & Evaluation Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            DEMO CENTER
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Quick-launch shortcuts and an interactive 10-step guided walkthrough to evaluate RXRESOLVE's full clinical refill orchestration pipeline in under 3 minutes.
          </p>
        </div>

        {/* Primary CTA */}
        <div className="mt-6 flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={handleRunCompleteDemo}
            className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>RUN COMPLETE GUIDED DEMO</span>
          </button>
        </div>
      </div>

      {/* 2. Hackathon 10-Second Judge Brief */}
      <div className="p-4 bg-teal-50/70 rounded-xl border border-teal-200 grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
        <div>
          <span className="font-bold text-teal-900 block text-[10px] uppercase">WHAT</span>
          <span className="text-slate-700">Prescription refill orchestration.</span>
        </div>
        <div>
          <span className="font-bold text-teal-900 block text-[10px] uppercase">WHO</span>
          <span className="text-slate-700">Pharmacies & physician practices.</span>
        </div>
        <div>
          <span className="font-bold text-teal-900 block text-[10px] uppercase">WHY</span>
          <span className="text-slate-700">Refills stall across fragmented EHR silos.</span>
        </div>
        <div>
          <span className="font-bold text-teal-900 block text-[10px] uppercase">HOW</span>
          <span className="text-slate-700">AI uncovers root causes; routes next action.</span>
        </div>
        <div>
          <span className="font-bold text-teal-900 block text-[10px] uppercase">SAFETY</span>
          <span className="text-slate-700">Humans retain clinical prescription authority.</span>
        </div>
      </div>

      {/* 3. The 8 Quick Demo Jump Buttons (Requirement 11) */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-400 text-[11px]">
          Direct Evaluation Shortcuts
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. RUN COMPLETE DEMO */}
          <button
            onClick={handleRunCompleteDemo}
            className="p-4 rounded-xl border border-teal-300 bg-teal-50/40 hover:bg-teal-100/50 text-left transition-all group cursor-pointer shadow-2xs space-y-1.5"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
              <Play className="w-4 h-4 fill-white" />
            </div>
            <span className="font-bold text-xs text-slate-900 block group-hover:text-teal-900">
              RUN COMPLETE DEMO
            </span>
            <p className="text-[11px] text-slate-500">
              10-step scripted interactive walkthrough
            </p>
          </button>

          {/* 2. OPEN STUCK REFILL */}
          <button
            onClick={handleOpenStuckRefill}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-left transition-all group cursor-pointer shadow-2xs space-y-1.5"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs text-slate-900 block group-hover:text-rose-900">
              OPEN STUCK REFILL
            </span>
            <p className="text-[11px] text-slate-500">
              Inspect RX-10482 (0 refills remaining)
            </p>
          </button>

          {/* 3. OPEN PATIENT 360 */}
          <button
            onClick={handleOpenPatient360}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-left transition-all group cursor-pointer shadow-2xs space-y-1.5"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs text-slate-900 block group-hover:text-indigo-900">
              OPEN PATIENT 360
            </span>
            <p className="text-[11px] text-slate-500">
              Full medication history & encounter timeline
            </p>
          </button>

          {/* 4. OPEN AI COPILOT */}
          <button
            onClick={handleOpenAICopilot}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-left transition-all group cursor-pointer shadow-2xs space-y-1.5"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs text-slate-900 block group-hover:text-purple-900">
              OPEN AI COPILOT
            </span>
            <p className="text-[11px] text-slate-500">
              Standard clinical response & human-in-the-loop
            </p>
          </button>

          {/* 5. OPEN PROVIDER VIEW */}
          <button
            onClick={handleOpenProviderView}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-left transition-all group cursor-pointer shadow-2xs space-y-1.5"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs text-slate-900 block group-hover:text-teal-900">
              OPEN PROVIDER VIEW
            </span>
            <p className="text-[11px] text-slate-500">
              Physician e-Prescribing authorization sign-off
            </p>
          </button>

          {/* 6. OPEN PHARMACY VIEW */}
          <button
            onClick={handleOpenPharmacyView}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-left transition-all group cursor-pointer shadow-2xs space-y-1.5"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs text-slate-900 block group-hover:text-sky-900">
              OPEN PHARMACY VIEW
            </span>
            <p className="text-[11px] text-slate-500">
              Surescripts dispensing status & communications
            </p>
          </button>

          {/* 7. OPEN ANALYTICS */}
          <button
            onClick={handleOpenAnalytics}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-left transition-all group cursor-pointer shadow-2xs space-y-1.5"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs text-slate-900 block group-hover:text-amber-900">
              OPEN ANALYTICS
            </span>
            <p className="text-[11px] text-slate-500">
              Bottleneck distribution & resolution cycle times
            </p>
          </button>

          {/* 8. OPEN AUDIT TRAIL */}
          <button
            onClick={handleOpenAuditTrail}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-left transition-all group cursor-pointer shadow-2xs space-y-1.5"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs text-slate-900 block group-hover:text-slate-900">
              OPEN AUDIT TRAIL
            </span>
            <p className="text-[11px] text-slate-500">
              Cryptographic ledger & RBAC access control
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
