import React from 'react';
import {
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  Download,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KpiCards } from './KpiCards';
import { WorkflowPipeline } from './WorkflowPipeline';
import { AIIntelligenceCard } from './AIIntelligenceCard';
import { PriorityWorklist } from './PriorityWorklist';

export const DashboardView: React.FC = () => {
  const { currentOrg, currentRole, refills, setCurrentView, setFilterPriority } = useApp();

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar - Clay Design */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-[inset_2px_2px_5px_rgba(255,255,255,0.9),inset_-2px_-2px_5px_rgba(190,200,215,0.35),0_10px_25px_rgba(80,100,130,0.08)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#77CFC1]">
            <span>{currentOrg.name}</span>
            <span>·</span>
            <span>Refill Operations Hub</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F2937] mt-1">
            Good morning, Operations Team
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Here is what needs attention across your refill workflow.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setFilterPriority('CRITICAL');
              setCurrentView('queue');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#FFD4D4] hover:bg-[#FFB5B5] border-0 rounded-full transition-all duration-300 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(200,100,100,0.3)]"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>8 At-Risk Cases</span>
          </button>

          <button
            onClick={() => setCurrentView('queue')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#6B9EFF] hover:shadow-[inset_2px_2px_5px_rgba(255,255,255,0.3),inset_-2px_-2px_5px_rgba(107,158,255,0.5),0_15px_35px_rgba(107,158,255,0.3)] rounded-full transition-all duration-300 shadow-[inset_2px_2px_5px_rgba(255,255,255,0.3),inset_-2px_-2px_5px_rgba(107,158,255,0.5),0_10px_25px_rgba(107,158,255,0.2)]"
          >
            <span>Open Refill Queue</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <section aria-label="Key Performance Indicators">
        <KpiCards />
      </section>

      {/* Refill Workflow Pipeline */}
      <section aria-label="Refill Workflow Pipeline">
        <WorkflowPipeline />
      </section>

      {/* AI Intelligence & Operational Summary Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AIIntelligenceCard />
        </div>

        {/* Operational SLA & Compliance Snapshot */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-semibold text-slate-900">SLA & Turnaround Health</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                98.4% On-Track
              </span>
            </div>

            <div className="mt-4 space-y-3.5">
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Provider Sign-off (Goal: &lt; 6h)</span>
                  <span className="font-mono font-semibold text-slate-900">3.4h avg</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '65%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Prior Auth Clearance (Goal: &lt; 24h)</span>
                  <span className="font-mono font-semibold text-slate-900">14.2h avg</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: '82%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Pharmacy Clarifications (Goal: &lt; 2h)</span>
                  <span className="font-mono font-semibold text-slate-900">1.1h avg</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>
            </div>

            <div className="mt-5 p-3 rounded-lg bg-teal-50/60 border border-teal-100">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-900">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                <span>Zero Regulatory Delays</span>
              </div>
              <p className="text-[11px] text-teal-800/80 mt-1 leading-relaxed">
                Automated chart audit validation active for all high-risk anticoagulants and diabetic therapies.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Surescripts 2026 EHR Standard</span>
            <button
              onClick={() => setCurrentView('analytics')}
              className="text-teal-700 hover:text-teal-900 font-semibold"
            >
              Full Analytics →
            </button>
          </div>
        </div>
      </section>

      {/* Priority Worklist */}
      <section aria-label="Priority Refill Worklist">
        <PriorityWorklist />
      </section>
    </div>
  );
};
