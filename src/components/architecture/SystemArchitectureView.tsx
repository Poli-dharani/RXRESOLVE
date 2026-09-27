import React from 'react';
import {
  Layers,
  Server,
  Cpu,
  Database,
  Shield,
  Activity,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Bell,
  Building,
  CheckCircle2,
  Workflow,
  Sparkles,
} from 'lucide-react';
import { SystemStatusCard } from '../common/SystemStatusCard';

export const SystemArchitectureView: React.FC = () => {
  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider">
          Enterprise Healthcare Architecture
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
          RXRESOLVE System Architecture & Interoperability
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Fault-tolerant orchestration layer bridging disconnected physician EHRs, pharmacy management systems, and PBM real-time gateways
        </p>
      </div>

      {/* Main Core Stack Diagram */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
          <Workflow className="w-4 h-4 text-teal-600" />
          <span>Core Platform Architecture</span>
        </h2>

        {/* Vertical Stack with Connectors */}
        <div className="max-w-2xl mx-auto space-y-3">
          {/* Layer 1: React Frontend */}
          <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                  UI
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900">React Frontend (Vite / TypeScript / Tailwind CSS)</h3>
                  <p className="text-[11px] text-slate-500">Refill Workspace, AI Copilot HUD, Real-time 360 Patient View, Operational Worklists</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-teal-800 bg-teal-100/60 px-2 py-0.5 rounded font-bold">Client Tier</span>
            </div>
          </div>

          <div className="flex justify-center text-slate-400 font-bold text-sm">↓ REST / WebSocket / mTLS</div>

          {/* Layer 2: API Gateway Layer */}
          <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  API
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900">API Layer & Reverse Proxy</h3>
                  <p className="text-[11px] text-slate-500">JWT Token Validation, Rate Limiting, RBAC Enforcement, Audit Header Injection</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-indigo-800 bg-indigo-100/60 px-2 py-0.5 rounded font-bold">Gateway Tier</span>
            </div>
          </div>

          <div className="flex justify-center text-slate-400 font-bold text-sm">↓ Event Bus & Workflow Router</div>

          {/* Layer 3: Workflow Engine */}
          <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/50 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                  WF
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900">Workflow Engine & State Machine</h3>
                  <p className="text-[11px] text-slate-500">Deterministic state transitions (New → Analyzing → Blocked → In Review → Resolved), SLA timers</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-sky-800 bg-sky-100/60 px-2 py-0.5 rounded font-bold">Orchestration Tier</span>
            </div>
          </div>

          <div className="flex justify-center text-slate-400 font-bold text-sm">↓ Advisory Inference Pipeline</div>

          {/* Layer 4: AI Service */}
          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                  AI
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900">AI Service (Clinical Reasoning & Abstraction Layer)</h3>
                  <p className="text-[11px] text-slate-500">Blocker classification, SBAR note drafting, Missing lab detection, Gemini API fallback</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-purple-800 bg-purple-100/60 px-2 py-0.5 rounded font-bold">Intelligence Tier</span>
            </div>
          </div>

          <div className="flex justify-center text-slate-400 font-bold text-sm">↓ Connection Pool & Data Persistence</div>

          {/* Layer 5: Database */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  DB
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900">Database & Cryptographic Audit Ledger</h3>
                  <p className="text-[11px] text-slate-500">Relational schema, AES-256 field encryption, immutable SHA-256 event audit log</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded font-bold">Persistence Tier</span>
            </div>
          </div>
        </div>

        {/* External Systems Interoperability Grid */}
        <div className="pt-6 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            External Interoperability Connectors
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            {[
              {
                name: 'EHR Connector',
                desc: 'Fast Health Interoperability Resources (FHIR R4) & HL7 v2 bi-directional bridge to Epic, Cerner, and Athenahealth.',
                protocol: 'FHIR / REST',
                status: 'Connected',
              },
              {
                name: 'Pharmacy System',
                desc: 'Surescripts e-Prescribing Script standard 2017071 for refill renewal requests and change requests.',
                protocol: 'NCPDP SCRIPT',
                status: 'Connected',
              },
              {
                name: 'PBM / Insurance',
                desc: 'Real-Time Prescription Benefit (RTPB) & CoverMyMeds electronic Prior Authorization (ePA).',
                protocol: 'NCPDP / EDI 278',
                status: 'Connected',
              },
              {
                name: 'Messaging Gateway',
                desc: 'Direct Secure Messaging (DirectTrust) & HIPAA-compliant automated patient SMS routing.',
                protocol: 'SMTP / Twilio HIPAA',
                status: 'Connected',
              },
              {
                name: 'Notification Service',
                desc: 'Push notifications to mobile workstations, provider paging queues, and email alerts.',
                protocol: 'WebPush / APNS',
                status: 'Connected',
              },
            ].map((ext) => (
              <div key={ext.name} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2">
                <div>
                  <span className="font-bold text-slate-900 block">{ext.name}</span>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-1">{ext.desc}</p>
                </div>
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-400">{ext.protocol}</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    {ext.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Status Card */}
      <SystemStatusCard />
    </div>
  );
};
