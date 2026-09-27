import React from 'react';
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Layers,
  Sparkles,
  Bot,
  BarChart3,
  Lock,
  ChevronDown,
  Building2,
  Pill,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EnvironmentBadge } from '../common/EnvironmentBadge';

export const LandingPage: React.FC = () => {
  const { setMode, setCurrentView } = useApp();

  const handleEnterDemo = () => {
    setCurrentView('dashboard');
    setMode('app');
  };

  const handleExploreWorkflow = () => {
    setCurrentView('queue');
    setMode('app');
  };

  const workflowSteps = [
    { label: 'Pharmacy', desc: 'Inbound Surescripts request', tag: '01' },
    { label: 'RXRESOLVE', desc: 'Ingestion & verification', tag: '02' },
    { label: 'AI ANALYSIS', desc: 'Bottleneck & rule parsing', tag: '03' },
    { label: 'Practice', desc: 'Clinical staff triage & pre-check', tag: '04' },
    { label: 'Provider', desc: 'Prescriber review & digital sign-off', tag: '05' },
    { label: 'Pharmacy', desc: 'Claim adjudication & packaging', tag: '06' },
    { label: 'Patient', desc: 'Medication delivered on time', tag: '07' },
    { label: 'RESOLVED', desc: 'Automated closed-loop audit', tag: '08' },
  ];

  const features = [
    {
      title: 'REFILL INTELLIGENCE',
      desc: 'Pinpoints exact reasons refills stall—from depleted count to prior auth expirations and missing safety labs.',
      icon: Sparkles,
      color: 'text-teal-600 bg-teal-50 border-teal-200',
    },
    {
      title: 'PATIENT 360',
      desc: 'Holistic clinical profile consolidating active medications, lab dates, allergies, and refill history in one view.',
      icon: Users,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      title: 'WORKFLOW ORCHESTRATION',
      desc: 'Automatically creates actionable tasks, routes prescriber sign-offs, and coordinates secure pharmacy clarifications.',
      icon: Layers,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      title: 'HUMAN-IN-THE-LOOP',
      desc: 'Physician and clinical nurse authority is preserved with clear recommendations, pre-populated scripts, and zero black-box risk.',
      icon: ShieldCheck,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      title: 'AUDITABILITY',
      desc: 'Immutable, timestamped audit events documenting every recommendation, prescriber sign-off, and pharmacy transmission.',
      icon: Lock,
      color: 'text-slate-700 bg-slate-100 border-slate-200',
    },
    {
      title: 'OPERATIONAL ANALYTICS',
      desc: 'Comprehensive real-time tracking of resolution cycle times, bottleneck distributions, and SLA performance metrics.',
      icon: BarChart3,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="h-18 bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-sm">
            <Activity className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900">
              RXRESOLVE
            </span>
            <span className="text-[10px] text-teal-700 font-semibold tracking-wider uppercase">
              Prescription Refill Orchestration
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#workflow" className="hover:text-slate-900 transition-colors">
            Workflow Architecture
          </a>
          <a href="#features" className="hover:text-slate-900 transition-colors">
            Core Modules
          </a>
          <a href="#governance" className="hover:text-slate-900 transition-colors">
            Clinical Governance
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <EnvironmentBadge compact />
          <button
            onClick={handleEnterDemo}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-teal-700 rounded-lg shadow-sm transition-all"
          >
            ENTER DEMO
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 lg:px-12 pt-16 pb-20 max-w-7xl mx-auto w-full text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-6 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Enterprise Healthcare SaaS · Intelligent Refill Orchestration</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.12]">
          Every stuck refill has a reason.
        </h1>

        <p className="mt-3 text-2xl sm:text-3xl text-teal-800 font-bold max-w-3xl mx-auto">
          RXRESOLVE finds it.
        </p>

        <p className="mt-4 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-medium tracking-wide">
          Understand. Coordinate. Resolve.
        </p>

        {/* Hero CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleEnterDemo}
            className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold text-white bg-slate-900 hover:bg-teal-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Enter Demo Workspace</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={handleExploreWorkflow}
            className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Explore Refill Queue</span>
          </button>
        </div>

        {/* Visualized Workflow Pipeline */}
        <div id="workflow" className="mt-16 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                End-to-End Orchestration Loop
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                From Pharmacy Friction to Verified Dispense
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Eliminating phone tag, unread portal faxes, and delayed renewals
            </span>
          </div>

          {/* Workflow Chain */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {workflowSteps.map((step, idx) => (
              <div
                key={`${step.label}-${step.tag}`}
                className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                  step.label === 'RXRESOLVE' || step.label === 'AI ANALYSIS'
                    ? 'bg-teal-50/70 border-teal-200'
                    : step.label === 'RESOLVED'
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 font-medium mb-1">
                    <span>{step.tag}</span>
                    {idx < workflowSteps.length - 1 && (
                      <span className="hidden lg:inline text-teal-600 font-bold">→</span>
                    )}
                  </div>
                  <div
                    className={`font-bold text-xs uppercase tracking-tight ${
                      step.label === 'RXRESOLVE'
                        ? 'text-teal-900'
                        : step.label === 'RESOLVED'
                        ? 'text-emerald-800'
                        : 'text-slate-900'
                    }`}
                  >
                    {step.label}
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 mt-2 leading-tight">
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section id="features" className="px-6 lg:px-12 py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Engineered For Complex Clinical Operations
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-1">
              Purpose-Built Refill Architecture
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Everything required to diagnose, triage, and close the loop on stuck prescriptions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="p-6 rounded-xl border border-slate-200 bg-white hover:border-teal-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 border ${feat.color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-teal-700">
                    <span>Explore module in demo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Clinical Governance Section */}
      <section id="governance" className="px-6 lg:px-12 py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Advisory Clinical Governance & Human Authority
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            RXRESOLVE acts strictly as an intelligent orchestration layer. Every prescription renewal,
            dosage change, and medication authorization is routed to licensed healthcare practitioners with
            full clinical oversight and HIPAA compliant traceability.
          </p>
          <div className="pt-4">
            <button
              onClick={handleEnterDemo}
              className="px-6 py-3 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-xl shadow-xs transition-colors"
            >
              Launch Live Operational Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto px-6 lg:px-12 py-8 bg-white border-t border-slate-200 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
          <span className="font-bold text-slate-900 tracking-tight">RXRESOLVE</span>
          <span className="hidden sm:inline text-slate-300">·</span>
          <span className="font-medium text-slate-700">Intelligent Prescription Refill Operations</span>
          <span className="hidden sm:inline text-slate-300">·</span>
          <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-mono border border-amber-200 text-[10px]">
            Demo environment — synthetic data only.
          </span>
        </div>
        <div className="text-[11px] text-slate-400 text-center md:text-right max-w-md">
          AI assists workflow operations. Clinical decisions remain with authorized healthcare professionals.
        </div>
      </footer>
    </div>
  );
};
