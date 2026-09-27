import React from 'react';
import {
  TrendingUp,
  Target,
  ArrowRight,
  CheckCircle2,
  Users,
  Building,
  Activity,
  Layers,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GoToMarketView: React.FC = () => {
  const { setCurrentView } = useApp();

  const customerJourney = [
    {
      stage: '1. AWARENESS',
      problem: 'High manual refill workload. Staff spend 4+ hours daily chasing missing lab tests, expired scripts, and phone calls.',
      signal: 'Operations leader engages with webinar, whitepaper, or industry benchmark report.',
      action: 'Offer complimentary Refill Bottleneck & Cycle Time Assessment.',
      metric: 'Qualified Enterprise Accounts (MQL → SQL).',
      color: 'bg-indigo-50 border-indigo-200 text-indigo-900',
    },
    {
      stage: '2. PROSPECT',
      problem: 'Disconnect between clinical EHR systems (Epic/Athena) and retail/outpatient pharmacies causes patient complaints and SLA breaches.',
      signal: 'Clinic Executive requests EHR integration architecture review and security audit brief.',
      action: 'Conduct 45-minute workflow simulation showing RXRESOLVE real-time SBAR triage.',
      metric: 'Stage 2 Demo Conversion Rate (>65%).',
      color: 'bg-teal-50 border-teal-200 text-teal-900',
    },
    {
      stage: '3. WORKFLOW ASSESSMENT',
      problem: 'Practice lacks visibility into why refills get stuck (0 refills vs missing lab vs prior auth).',
      signal: 'Clinic provides historical 90-day anonymized refill transaction log.',
      action: 'Run diagnostic audit highlighting top 5 bottleneck root causes and estimated cycle time savings.',
      metric: 'Identified Cost Reduction Potential ($180k+ annual savings/group).',
      color: 'bg-sky-50 border-sky-200 text-sky-900',
    },
    {
      stage: '4. PILOT',
      problem: 'Physicians resist new clinical inboxes; skepticism around autonomous AI safety.',
      signal: 'Workflow bottleneck confirmed across 10-15 pilot providers in high-volume specialty (Cardio/Endo).',
      action: 'Run controlled 60-day pilot with human-in-the-loop governance and zero autonomous prescribing.',
      metric: 'Resolution time improvement (-75% turnaround, 94%+ provider satisfaction).',
      color: 'bg-purple-50 border-purple-200 text-purple-900',
    },
    {
      stage: '5. ADOPTION',
      problem: 'Care coordinators overwhelmed by multi-portal logging and manual pharmacy call queues.',
      signal: 'Pilot group reaches 95%+ daily active usage; medical director advocates for system-wide rollout.',
      action: 'Full EHR integration deployment across all practice sites and partner pharmacy networks.',
      metric: 'Net Enterprise Annual Recurring Revenue (ARR) Contract Execution.',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    },
    {
      stage: '6. EXPANSION',
      problem: 'Adjacent specialty clinics (Rheumatology, Oncology) suffer from complex Specialty Pharmacy Prior Auth stalls.',
      signal: 'Operations VP requests expansion to additional outpatient surgical centers and specialty branches.',
      action: 'Deploy Specialty Refill Module and PBM Real-Time Benefit Check (RTPB) tier.',
      metric: 'Net Dollar Retention (>135% NDR) and expanded provider licenses.',
      color: 'bg-amber-50 border-amber-200 text-amber-900',
    },
    {
      stage: '7. CUSTOMER SUCCESS',
      problem: 'Staff turnover threatens operational continuity and adherence to standardized triage protocols.',
      signal: 'Consistent high-volume usage with zero regulatory or HIPAA security incidents.',
      action: 'Quarterly Executive Business Reviews (QBRs) showcasing saved physician hours and pharmacy SLA compliance.',
      metric: 'Gross Retention (>98%) and national reference account participation.',
      color: 'bg-slate-100 border-slate-200 text-slate-900',
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider">
            Commercial Strategy & Enterprise Vision
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
            WHY RXRESOLVE? & GO-TO-MARKET STRATEGY
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transforming prescription refill bottlenecks into high-margin recurring healthcare SaaS
          </p>
        </div>

        <button
          onClick={() => setCurrentView('dashboard')}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-2xs transition-colors self-start md:self-auto"
        >
          Open App Workspace
        </button>
      </div>

      {/* 2. Section 10: Value Proposition - Three Large Cards */}
      <div className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <h2 className="text-lg font-bold text-slate-900">
            "RXRESOLVE is not another inbox."
          </h2>
          <p className="text-sm font-semibold text-teal-700">
            "RXRESOLVE is a refill orchestration layer."
          </p>
          <p className="text-xs text-slate-500">
            Connecting fragmented stakeholders across disconnected systems into one coherent, closed-loop resolution stream.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: UNDERSTAND */}
          <div className="p-6 rounded-xl border border-teal-200 bg-white shadow-xs space-y-3 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold text-sm">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900">UNDERSTAND</h3>
            <p className="text-sm font-semibold text-teal-800">
              "Know exactly why a refill is stuck."
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instant diagnostic intelligence reveals the precise root cause within seconds: zero refills remaining, missing monitoring lab work, formulary exclusion, or pending provider re-evaluation. No guesswork or phone tag.
            </p>
          </div>

          {/* Card 2: COORDINATE */}
          <div className="p-6 rounded-xl border border-indigo-200 bg-white shadow-xs space-y-3 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900">COORDINATE</h3>
            <p className="text-sm font-semibold text-indigo-800">
              "Route the right action to the right person."
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dynamically prepares SBAR clinical review packets for doctors, plain-language reassurance SMS updates for patients, and electronic NCPDP confirmations for pharmacies. Tasks route automatically according to role capabilities.
            </p>
          </div>

          {/* Card 3: RESOLVE */}
          <div className="p-6 rounded-xl border border-emerald-200 bg-white shadow-xs space-y-3 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-sm">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900">RESOLVE</h3>
            <p className="text-sm font-semibold text-emerald-800">
              "Close the loop and verify completion."
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Confirms electronic dispensing transmission via Surescripts, registers immutable cryptographic audit trails, updates operational throughput metrics, and notifies the patient when the medication is ready for pickup.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Interconnected Ecosystem Hub (Connected through RXRESOLVE) */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md space-y-6">
        <div className="text-center max-w-lg mx-auto">
          <span className="text-[10px] uppercase font-bold tracking-wider text-teal-400">
            Ecosystem Interoperability
          </span>
          <h3 className="text-base font-bold text-white mt-1">
            Connected Through RXRESOLVE
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Eliminating silos by synchronizing all 6 critical healthcare stakeholders:
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center text-xs">
          {[
            { title: 'Patient', desc: 'SMS status & pickup alerts', icon: '👤' },
            { title: 'Pharmacy', desc: 'Surescripts e-ACK & 90-day sync', icon: '💊' },
            { title: 'Practice Staff', desc: 'Pre-vetted SBAR worklists', icon: '📋' },
            { title: 'Provider', desc: '1-click sign-off & renewals', icon: '🩺' },
            { title: 'EHR', desc: 'Bi-directional FHIR R4 sync', icon: '🏥' },
            { title: 'PBM / Insurance', desc: 'Real-time Prior Auth check', icon: '🛡️' },
          ].map((item) => (
            <div
              key={item.title}
              className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5"
            >
              <div className="text-2xl">{item.icon}</div>
              <span className="font-bold text-white block">{item.title}</span>
              <span className="text-[10px] text-slate-400 block leading-tight">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Section 9: Customer Journey (7 Stages) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-teal-600" />
              <span>Target Customers & Go-To-Market Lifecycle</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ideal Customer Profile: Mid-sized physician groups (15-250 prescribers) and regional independent pharmacy networks.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded">
            SaaS B2B Model
          </span>
        </div>

        <div className="space-y-3">
          {customerJourney.map((step) => (
            <div
              key={step.stage}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className={`font-bold font-mono text-[11px] px-2.5 py-0.5 rounded border ${step.color}`}>
                  {step.stage}
                </span>
                <span className="font-semibold text-slate-500 font-mono text-[11px]">
                  KPI: {step.metric}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Customer Problem</span>
                  <p className="text-slate-800 font-medium leading-relaxed">{step.problem}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">Engagement Signal</span>
                  <p className="text-slate-700 leading-relaxed">{step.signal}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">RXRESOLVE Action</span>
                  <p className="text-slate-700 leading-relaxed">{step.action}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
