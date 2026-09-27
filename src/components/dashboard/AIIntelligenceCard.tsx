import React from 'react';
import {
  Sparkles,
  ShieldAlert,
  FileQuestion,
  Receipt,
  CalendarClock,
  Building2,
  CheckCircle2,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AIIntelligenceCard: React.FC = () => {
  const { setFilterBlocker, setCurrentView } = useApp();

  const handleBreakdownClick = (categoryCode: string) => {
    setFilterBlocker(categoryCode);
    setCurrentView('queue');
  };

  const categories = [
    {
      code: 'PROVIDER_AUTHORIZATION',
      label: 'Provider Authorization',
      count: 8,
      confidence: 96,
      icon: ShieldAlert,
      color: 'text-indigo-700',
      barColor: 'bg-indigo-600',
      badgeBg: 'bg-indigo-50 border-indigo-200 text-indigo-800',
      desc: 'Depleted refills & renewal approvals',
    },
    {
      code: 'MISSING_LAB_WORK',
      label: 'Missing Information / Labs',
      count: 6,
      confidence: 88,
      icon: FileQuestion,
      color: 'text-amber-700',
      barColor: 'bg-amber-500',
      badgeBg: 'bg-amber-50 border-amber-200 text-amber-800',
      desc: 'Renal, hepatic & A1c surveillance gaps',
    },
    {
      code: 'PA_REQUIRED',
      label: 'Insurance / PBM Blockers',
      count: 4,
      confidence: 91,
      icon: Receipt,
      color: 'text-rose-700',
      barColor: 'bg-rose-500',
      badgeBg: 'bg-rose-50 border-rose-200 text-rose-800',
      desc: 'Prior Authorization & formulary rules',
    },
    {
      code: 'OVERDUE_OFFICE_VISIT',
      label: 'Follow-up Required',
      count: 3,
      confidence: 94,
      icon: CalendarClock,
      color: 'text-teal-700',
      barColor: 'bg-teal-600',
      badgeBg: 'bg-teal-50 border-teal-200 text-teal-800',
      desc: 'Overdue clinic visit & step-up consults',
    },
    {
      code: 'PHARMACY_CLARIFICATION',
      label: 'Pharmacy Clarification',
      count: 2,
      confidence: 89,
      icon: Building2,
      color: 'text-sky-700',
      barColor: 'bg-sky-600',
      badgeBg: 'bg-sky-50 border-sky-200 text-sky-800',
      desc: 'Stock-out substitutions & sig questions',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                <span>AI WORKFLOW INTELLIGENCE</span>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-md">
                  Active Real-time Scan
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Automated triage and bottleneck classification across inbound refills
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-bold font-mono text-slate-900">23</span>
            <span className="text-xs font-medium text-slate-500 ml-1.5">
              cases require attention
            </span>
          </div>
        </div>

        {/* Breakdown Items */}
        <div className="mt-4 space-y-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.code}
                onClick={() => handleBreakdownClick(cat.code)}
                className="group p-3 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50/70 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${cat.color}`} />
                    <span className="text-xs font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">
                      {cat.label}
                    </span>
                    <span className="text-[11px] text-slate-400 hidden sm:inline">
                      ({cat.desc})
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold font-mono text-slate-900">
                      {cat.count} cases
                    </span>
                    <span
                      className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border ${cat.badgeBg}`}
                      title="AI classification confidence score"
                    >
                      {cat.confidence}% confidence
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition-colors" />
                  </div>
                </div>

                {/* Progress bar visual */}
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full ${cat.barColor}`}
                    style={{ width: `${(cat.count / 23) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Advisory Regulatory Disclaimer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 bg-slate-50/80 p-3 rounded-lg border border-slate-200/60">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-600 leading-relaxed">
          <strong className="font-semibold text-slate-700">Clinical Governance Notice:</strong>{' '}
          AI recommendations are advisory. Clinical decisions require authorized healthcare professionals.
        </p>
      </div>
    </div>
  );
};
