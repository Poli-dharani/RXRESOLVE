import React, { useState } from 'react';
import {
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Send,
  UserCheck,
  TrendingDown,
  Activity,
  HelpCircle,
  FileCheck,
  AlertTriangle,
  History,
} from 'lucide-react';
import { RefillRequest } from '../../types';
import { useApp } from '../../context/AppContext';
import { BlockerGraph } from './BlockerGraph';

interface RefillIntelligenceColumnProps {
  currentCase: RefillRequest;
  onOpenActionsTab?: (tabName: string) => void;
}

export const RefillIntelligenceColumn: React.FC<RefillIntelligenceColumnProps> = ({
  currentCase,
  onOpenActionsTab,
}) => {
  const { requestProviderReview, currentRole, setCurrentView } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRequestReview = async () => {
    setIsProcessing(true);
    await requestProviderReview(currentCase.id);
    setIsProcessing(false);
  };

  const refillHealth = currentCase.refillHealth || {
    score: 72,
    tier: 'AT_RISK',
    factors: [
      { category: 'Prescription Expiration', description: '0 refills remaining on original order', pointsDeducted: 15 },
      { category: 'Queue Age', description: 'Pending provider action for > 16 hours', pointsDeducted: 8 },
      { category: 'Dependency Chain', description: 'Physician digital signature token required before transmission', pointsDeducted: 5 },
    ],
    disclaimer: 'Operational workflow score — not a medical score.',
  };

  const continuitySignal = currentCase.continuitySignal || {
    headline: '3 refill interventions in the last 6 months.',
    patternType: 'Repeated provider review',
    frequencyCount: 3,
    timeframe: 'Last 6 months',
    notes: 'Patient consistently exhausts 90-day supplies without automatic bridge renewals. Requires manual provider review every cycle.',
    disclaimer: 'Operational pattern only — not a medical prediction.',
  };

  // Full timeline steps according to requirement 4
  const standardTimeline = [
    {
      step: 'Patient requested refill',
      actor: `${currentCase.patient.firstName} ${currentCase.patient.lastName}`,
      source: `${currentCase.pharmacy.name} Mobile App`,
      status: 'Completed',
      timestamp: '2026-09-26 14:15',
    },
    {
      step: 'Pharmacy submitted request',
      actor: currentCase.pharmacy.pharmacistInCharge,
      source: 'Surescripts e-Prescribing Hub',
      status: 'Completed',
      timestamp: '2026-09-26 14:30',
    },
    {
      step: 'RXRESOLVE analyzed request',
      actor: 'RXRESOLVE Engine',
      source: 'Automated Pipeline',
      status: 'Completed',
      timestamp: '2026-09-26 14:32',
    },
    {
      step: 'AI detected blocker',
      actor: 'Rules & Clinical Guard Engine',
      source: 'Refill Classification Matrix',
      status: 'Completed',
      timestamp: '2026-09-26 14:35',
    },
    {
      step: 'Case routed to staff',
      actor: 'Elena Rostova, RN',
      source: 'Practice Triage Inbox',
      status: 'Completed',
      timestamp: '2026-09-26 16:15',
    },
    {
      step: 'Provider review requested',
      actor: currentCase.owner,
      source: 'Clinical Electronic Order Entry',
      status: currentCase.workflowStage === 'PROVIDER REVIEW' || currentCase.status === 'WAITING FOR PROVIDER' ? 'In Progress' : 'Pending',
      timestamp: currentCase.workflowStage === 'PROVIDER REVIEW' ? '2026-09-26 16:20' : 'Pending',
    },
    {
      step: 'Awaiting provider action',
      actor: `Dr. ${currentCase.provider.lastName}`,
      source: 'Provider Mobile & Desktop Queue',
      status: currentCase.status === 'RESOLVED' ? 'Completed' : 'Awaiting Action',
      timestamp: currentCase.status === 'RESOLVED' ? 'Verified' : 'Active Wait',
    },
  ];

  return (
    <div className="space-y-5">
      {/* 1. WHY IS THIS REFILL STUCK? Card */}
      <div className="bg-white rounded-xl border border-rose-200/90 shadow-xs p-6 bg-gradient-to-b from-white to-rose-50/20">
        <div className="flex items-center justify-between pb-3 border-b border-rose-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
                PRIMARY BOTTLENECK DIAGNOSIS
              </span>
              <h2 className="text-base font-bold text-slate-900">
                WHY IS THIS REFILL STUCK?
              </h2>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Classification Confidence
            </span>
            <span className="font-mono text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
              {currentCase.aiRecommendation.confidenceScore}%
            </span>
          </div>
        </div>

        {/* Structured Grid: BLOCKER, ROOT CAUSE, EVIDENCE, NEXT BEST ACTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
          <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              BLOCKER
            </span>
            <p className="font-bold text-slate-900 text-sm">
              {currentCase.prescription.remainingRefills === 0 ? 'No refills remaining' : currentCase.blockerDescription}
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              ROOT CAUSE
            </span>
            <p className="font-bold text-slate-900 text-sm">
              Provider authorization required
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              EVIDENCE
            </span>
            <div className="space-y-1 text-slate-700">
              <div className="flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>Current prescription: <strong>0 refills remaining</strong></span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>Last relevant encounter: <strong>5 months ago (2025-10-14)</strong></span>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-teal-50/70 rounded-lg border border-teal-200 shadow-2xs">
            <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block mb-1">
              NEXT BEST ACTION
            </span>
            <p className="font-bold text-teal-950 text-sm">
              Request provider review.
            </p>
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div className="mt-5 pt-4 border-t border-rose-100 flex flex-wrap items-center gap-3">
          <button
            disabled={isProcessing}
            onClick={handleRequestReview}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-teal-700 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
            <span>REQUEST PROVIDER REVIEW</span>
          </button>

          <button
            onClick={() => onOpenActionsTab?.('message')}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5 text-slate-500" />
            <span>SEND MESSAGE</span>
          </button>

          <button
            onClick={() => setCurrentView('copilot')}
            className="px-4 py-2 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>OPEN IN AI COPILOT</span>
          </button>
        </div>

        {/* Advisory disclaimer */}
        <div className="mt-3 text-[11px] text-slate-500 italic">
          AI recommendations are advisory. Clinical decisions require authorized healthcare professionals.
        </div>
      </div>

      {/* 2. REFILL HEALTH & CONTINUITY SIGNAL GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* REFILL HEALTH Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                OPERATIONAL SCORE
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                {refillHealth.tier.replace('_', ' ')}
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-slate-900">
                {refillHealth.score}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ 100</span>
              <span className="text-xs font-bold text-amber-600 uppercase ml-2">
                AT RISK
              </span>
            </div>

            <div className="mt-3 space-y-1.5 text-xs">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Risk Factor Deductions:
              </span>
              {refillHealth.factors.map((f, i) => (
                <div key={i} className="flex justify-between text-slate-600 text-[11px]">
                  <span>• {f.description}</span>
                  <span className="font-mono font-bold text-rose-600">-{f.pointsDeducted} pts</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-500 font-medium">
            {refillHealth.disclaimer}
          </div>
        </div>

        {/* CONTINUITY SIGNAL Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                HISTORICAL PATTERN DETECTION
              </span>
              <span className="text-[10px] font-mono font-bold text-indigo-800 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                Operational Pattern
              </span>
            </div>

            <div className="mt-3">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                CONTINUITY SIGNAL
              </div>
              <p className="text-base font-bold text-indigo-900 mt-1">
                "{continuitySignal.headline}"
              </p>
              <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                {continuitySignal.notes}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-500 italic">
            {continuitySignal.disclaimer}
          </div>
        </div>
      </div>

      {/* 3. BLOCKER GRAPH (Visual Dependency Diagram) */}
      <BlockerGraph nodes={currentCase.blockerGraph} />

      {/* 4. REFILL TIMELINE (Interactive step-by-step) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Prescription Refill Lifecycle Timeline
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {standardTimeline.length} recorded events
          </span>
        </div>

        <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {standardTimeline.map((item, idx) => {
            const isCompleted = item.status === 'Completed';
            const isInProgress = item.status === 'In Progress' || item.status === 'Awaiting Action';
            return (
              <div key={idx} className="relative pl-7 group">
                <span
                  className={`absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full ring-4 ring-white ${
                    isCompleted
                      ? 'bg-emerald-500'
                      : isInProgress
                      ? 'bg-amber-500 animate-pulse'
                      : 'bg-slate-300'
                  }`}
                />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="text-xs font-bold text-slate-900">
                    {item.step}
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500">
                    <span>{item.timestamp}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded font-semibold ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-800'
                          : isInProgress
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
                  <span>Actor: <strong>{item.actor}</strong></span>
                  <span>·</span>
                  <span>Source: {item.source}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
