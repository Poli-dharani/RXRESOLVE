import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  Search,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Key,
  ShieldCheck,
  Server,
  ArrowRight,
  Database,
  Cpu,
  Layers,
  XCircle,
  Eye,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

type AuditTab =
  | 'AUDIT_LOG'
  | 'ACCESS_CONTROL'
  | 'ROLE_PERMISSIONS'
  | 'SESSION_ACTIVITY'
  | 'API_ACTIVITY'
  | 'SECURITY_EVENTS'
  | 'ARCHITECTURE'
  | 'RESPONSIBLE_AI';

export const AuditView: React.FC = () => {
  const { refills, currentOrg, currentRole, currentUser, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<AuditTab>('AUDIT_LOG');
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  // Standard Audit Log rows per requirement 3: User, Action, Object, Previous State, New State, Timestamp, Source
  const standardAuditRows = [
    {
      id: 'aud-1',
      user: 'Dr. Emily Carter',
      role: 'Physician / Prescriber',
      action: 'Approved refill',
      object: 'RX-10482',
      prevState: 'Provider Review',
      newState: 'Approved / Resolved',
      timestamp: '10:42 AM',
      source: 'Manual approval (DEA EPCS token)',
      outcome: 'SUCCESS',
    },
    {
      id: 'aud-2',
      user: 'Elena Rostova, MA',
      role: 'Clinical Staff / MA',
      action: 'Attached lab telemetry',
      object: 'RX-10482',
      prevState: 'Missing Information',
      newState: 'Provider Review',
      timestamp: '10:15 AM',
      source: 'EHR Lab Ingest (Lipid Panel)',
      outcome: 'SUCCESS',
    },
    {
      id: 'aud-3',
      user: 'RXRESOLVE AI Engine',
      role: 'System / Model Inference',
      action: 'Classified refill bottleneck',
      object: 'RX-10485',
      prevState: 'New Ingest',
      newState: 'Analyzing (PA Required)',
      timestamp: '09:58 AM',
      source: 'Surescripts Formulary Matrix',
      outcome: 'SUCCESS',
    },
    {
      id: 'aud-4',
      user: 'Marcus Vance, PharmD',
      role: 'Pharmacy Liaison',
      action: 'Submitted refill request',
      object: 'RX-10483',
      prevState: 'Patient Inquiry',
      newState: 'Awaiting Provider Action',
      timestamp: '09:30 AM',
      source: 'Surescripts e-Prescribing Hub',
      outcome: 'SUCCESS',
    },
    {
      id: 'aud-5',
      user: 'Sarah Jenkins',
      role: 'Practice Manager',
      action: 'Escalated priority to CRITICAL',
      object: 'RX-10484',
      prevState: 'HIGH',
      newState: 'CRITICAL',
      timestamp: '09:12 AM',
      source: 'SLA Risk Monitor (Anticoagulant)',
      outcome: 'SUCCESS',
    },
    {
      id: 'aud-6',
      user: 'Alex Thorne',
      role: 'Admin',
      action: 'Rotated API cryptographic key',
      object: 'Surescripts Gateway #9',
      prevState: 'Active Key v4',
      newState: 'Active Key v5',
      timestamp: '08:45 AM',
      source: 'Automated 90-Day Key Management',
      outcome: 'SUCCESS',
    },
    {
      id: 'aud-7',
      user: 'Guest / IP 192.0.2.14',
      role: 'Unauthenticated Request',
      action: 'Attempted clinical endpoint access',
      object: '/api/v1/prescriptions/sign',
      prevState: 'Blocked',
      newState: 'Blocked (401 Unauthorized)',
      timestamp: '08:22 AM',
      source: 'API Gateway WAF Rule #204',
      outcome: 'BLOCKED',
    },
  ];

  // RBAC Matrix per requirement 4
  const rbacRoles = [
    {
      role: 'ADMIN',
      name: 'System Administrator',
      scope: 'Everything: System configuration, security audits, key rotation, user provisioning, all clinical & operational views.',
      canAuthorize: true,
      canEditPatient: true,
      canConfigureSystem: true,
      canTriageQueue: true,
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      role: 'PROVIDER',
      name: 'Physician / Prescriber (MD, DO, NP, PA)',
      scope: 'Clinical authorization, e-Prescribing renewal sign-off, patient context, clinical orders, chart evaluation.',
      canAuthorize: true,
      canEditPatient: true,
      canConfigureSystem: false,
      canTriageQueue: true,
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    },
    {
      role: 'PRACTICE_STAFF',
      name: 'Clinical Staff / Medical Assistant',
      scope: 'Workflow management, tasks, messages, patient operational information, lab gathering. (Prohibited from prescribing).',
      canAuthorize: false,
      canEditPatient: true,
      canConfigureSystem: false,
      canTriageQueue: true,
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      role: 'PHARMACY_STAFF',
      name: 'Pharmacy Liaison / Staff',
      scope: 'Pharmacy requests, clarifications, dispensing status, formulary tier review, NDC substitutions.',
      canAuthorize: false,
      canEditPatient: false,
      canConfigureSystem: false,
      canTriageQueue: true,
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    {
      role: 'OPERATIONS',
      name: 'Operations Manager / Clinic Lead',
      scope: 'Analytics, bottleneck diagnostics, SLA monitoring, staff workload rebalancing, practice turnaround metrics.',
      canAuthorize: false,
      canEditPatient: false,
      canConfigureSystem: false,
      canTriageQueue: true,
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
  ];

  // Session Activity data
  const sessionList = [
    { id: 'sess-1', user: 'Dr. Emily Carter', ip: '10.240.12.44', location: 'Clinic Ward 3A (Internal LAN)', device: 'Epic Hyperspace Workstation #4', mfa: 'FIDO2 WebAuthn Hardware Token', status: 'Active (Now)' },
    { id: 'sess-2', user: 'Elena Rostova, MA', ip: '10.240.12.89', location: 'Triage Desk 2 (Internal LAN)', device: 'Chrome 128 / macOS', mfa: 'Duo Push Push Verified', status: 'Active (5m ago)' },
    { id: 'sess-3', user: 'Marcus Vance, PharmD', ip: '198.51.100.22', location: 'Outpatient Pharmacy Desk #1', device: 'Firefox ESR / Linux ThinClient', mfa: 'TOTP Verified', status: 'Active (18m ago)' },
    { id: 'sess-4', user: 'Sarah Jenkins', ip: '10.240.10.12', location: 'Practice Admin Suite', device: 'Safari 18 / iPad Pro', mfa: 'Biometric TouchID', status: 'Active (1h ago)' },
  ];

  // API Activity data
  const apiActivityList = [
    { endpoint: 'POST /api/v1/surescripts/refill-request', caller: 'Surescripts Hub v6.1', latency: '42ms', status: '200 OK', payload: 'RX-10482 NCPDP Script 2017071' },
    { endpoint: 'GET /fhir/r4/Patient/10482/Observation', caller: 'Epic Systems Interconnect', latency: '38ms', status: '200 OK', payload: 'Lipid Panel LOINC 57698-3' },
    { endpoint: 'POST /api/v1/covermymeds/pa-status', caller: 'CoverMyMeds Gateway', latency: '110ms', status: '200 OK', payload: 'PA Key #PA-99214 Approved' },
    { endpoint: 'POST /api/v1/prescriptions/authorize', caller: 'Provider Electronic Signer', latency: '65ms', status: '200 OK', payload: 'Prescriber NPI 1982736410' },
  ];

  // Security Events data
  const securityEventsList = [
    { type: 'Zero-Trust Verification', details: 'Continuous mTLS connection re-authenticated between API gateway and EHR connector.', timestamp: 'Just now', severity: 'INFO' },
    { type: 'Role Capability Validation', details: 'Medical Assistant attempted prescription signature endpoint; denied with "Permission required".', timestamp: '12m ago', severity: 'WARNING' },
    { type: 'Key Rotation', details: 'Surescripts transmission token HMAC-SHA256 successfully refreshed.', timestamp: '1h ago', severity: 'INFO' },
    { type: 'Rate Limit Enforced', details: 'External bot query throttled at edge reverse proxy.', timestamp: '2h ago', severity: 'LOW' },
  ];

  const filteredRows = standardAuditRows.filter((r) => {
    if (filterAction !== 'ALL' && !r.action.toLowerCase().includes(filterAction.toLowerCase())) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.user.toLowerCase().includes(q) ||
        r.action.toLowerCase().includes(q) ||
        r.object.toLowerCase().includes(q) ||
        r.source.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              AUDIT & SECURITY
            </h1>
            <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              Enterprise Trust & RBAC
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable clinical event logs, granular role permissions, cryptographic auditability, and zero-trust security architecture
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast('Full cryptographic audit certificate exported with SHA-256 ledger hash.')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Certificate</span>
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs">
        {[
          { id: 'AUDIT_LOG', label: 'Audit Log' },
          { id: 'ACCESS_CONTROL', label: 'Access Control (RBAC)' },
          { id: 'ROLE_PERMISSIONS', label: 'Role Permissions' },
          { id: 'SESSION_ACTIVITY', label: 'Session Activity' },
          { id: 'API_ACTIVITY', label: 'API Activity' },
          { id: 'SECURITY_EVENTS', label: 'Security Events' },
          { id: 'ARCHITECTURE', label: 'Security Architecture' },
          { id: 'RESPONSIBLE_AI', label: 'Responsible AI' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as AuditTab)}
            className={`px-3 py-1.5 font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: AUDIT LOG (Standard 7-column schema) */}
      {activeTab === 'AUDIT_LOG' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search user, action, object (e.g. RX-10482), source..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-teal-500 text-slate-900"
              />
            </div>

            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-teal-500 cursor-pointer"
            >
              <option value="ALL">All Actions</option>
              <option value="Approved">Approved</option>
              <option value="Attached">Attached</option>
              <option value="Classified">Classified</option>
              <option value="Submitted">Submitted</option>
              <option value="Escalated">Escalated</option>
            </select>
          </div>

          {/* Standard 7-Column Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Object</th>
                    <th className="py-3 px-4">Previous State</th>
                    <th className="py-3 px-4">New State</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-900 block">{row.user}</span>
                        <span className="text-[10px] text-slate-400">{row.role}</span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-medium text-slate-800">{row.action}</span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono font-bold text-teal-800">
                        {row.object}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {row.prevState}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                            row.outcome === 'BLOCKED'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {row.newState}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-500">
                        {row.timestamp}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                        {row.source}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2 & 3: ACCESS CONTROL & ROLE PERMISSIONS */}
      {(activeTab === 'ACCESS_CONTROL' || activeTab === 'ROLE_PERMISSIONS') && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-1">
              Role-Based Access Control (RBAC) Specification
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Enforces least-privilege principle across clinical, administrative, and pharmacy domains.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rbacRoles.map((role) => (
                <div
                  key={role.role}
                  className={`p-4 rounded-xl border space-y-3 bg-white ${
                    currentRole.toUpperCase().includes(role.role)
                      ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${role.badgeColor}`}>
                      {role.role}
                    </span>
                    {currentRole.toUpperCase().includes(role.role) && (
                      <span className="text-[10px] bg-indigo-600 text-white font-bold px-1.5 py-0.5 rounded">
                        Active Role
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-xs text-slate-900">{role.name}</h3>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{role.scope}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Clinical Authorization:</span>
                      <span className={`font-bold ${role.canAuthorize ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {role.canAuthorize ? 'Permitted (MD/DO/NP)' : 'Restricted'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Patient Chart Context:</span>
                      <span className={`font-bold ${role.canEditPatient ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {role.canEditPatient ? 'Permitted' : 'Read-only / Restricted'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Refill Worklist Triage:</span>
                      <span className="font-bold text-emerald-700">Permitted</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SESSION ACTIVITY */}
      {activeTab === 'SESSION_ACTIVITY' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Active Identity & Session Activity</h3>
              <p className="text-xs text-slate-400">Real-time authenticated clinical staff sessions with hardware MFA verification.</p>
            </div>
            <span className="font-mono text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              4 Active Tokens
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {sessionList.map((s) => (
              <div key={s.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{s.user}</span>
                    <span className="font-mono text-[10px] text-slate-400">({s.ip})</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block">{s.location} · {s.device}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {s.mfa}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700">
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: API ACTIVITY */}
      {activeTab === 'API_ACTIVITY' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Healthcare API Ingest & Outbound Gateway</h3>
              <p className="text-xs text-slate-400">Real-time transactions over Surescripts e-Prescribing, Epic FHIR, and PBM clearinghouses.</p>
            </div>
            <span className="font-mono text-xs text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Avg Latency 52ms
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {apiActivityList.map((api, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-mono font-bold text-slate-900 block">{api.endpoint}</span>
                  <span className="text-[11px] text-slate-500">Caller: {api.caller} · Payload: {api.payload}</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span className="text-slate-400">{api.latency}</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {api.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SECURITY EVENTS */}
      {activeTab === 'SECURITY_EVENTS' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Security Telemetry & Intercept Logs</h3>
              <p className="text-xs text-slate-400">Zero-trust rule checks, privilege verification, and anomaly monitoring.</p>
            </div>
            <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              Zero active breaches
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {securityEventsList.map((ev, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">{ev.type}</span>
                    <span className="text-[11px] text-slate-600">{ev.details}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    ev.severity === 'WARNING'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {ev.severity}
                  </span>
                  <span className="block text-[10px] text-slate-400 font-mono mt-0.5">{ev.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: SECURITY ARCHITECTURE (Requirement 5) */}
      {activeTab === 'ARCHITECTURE' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Security Architecture Pipeline</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-tiered security boundary isolating untrusted user input from core e-Prescribing operations.
            </p>
          </div>

          {/* Pipeline flow */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs">
            {[
              { label: 'USER', sub: 'Clinical & Staff', color: 'bg-slate-900 text-white' },
              { label: 'AUTHENTICATION', sub: 'FIDO2 / MFA', color: 'bg-teal-50 border-teal-200 text-teal-900' },
              { label: 'RBAC', sub: 'Least Privilege', color: 'bg-indigo-50 border-indigo-200 text-indigo-900' },
              { label: 'API GATEWAY', sub: 'mTLS & WAF', color: 'bg-cyan-50 border-cyan-200 text-cyan-900' },
              { label: 'WORKFLOW ENGINE', sub: 'State Machine', color: 'bg-sky-50 border-sky-200 text-sky-900' },
              { label: 'AI SERVICE', sub: 'Advisory Only', color: 'bg-purple-50 border-purple-200 text-purple-900' },
              { label: 'AUDIT LOG', sub: 'SHA-256 Ledger', color: 'bg-emerald-50 border-emerald-200 text-emerald-900' },
              { label: 'INTEGRATED SYSTEMS', sub: 'EHR / Pharmacy', color: 'bg-slate-100 border-slate-200 text-slate-800' },
            ].map((node, idx) => (
              <div key={node.label} className="flex flex-col items-center">
                <div className={`w-full p-2.5 rounded-lg border font-bold text-[11px] ${node.color} shadow-2xs`}>
                  {node.label}
                  <span className="block text-[9px] font-normal opacity-80 mt-0.5">{node.sub}</span>
                </div>
                {idx < 7 && (
                  <span className="hidden lg:block text-slate-400 text-xs my-1 font-bold">↓</span>
                )}
              </div>
            ))}
          </div>

          {/* 9 Security Principles */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Core Security & Integrity Principles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {[
                { title: 'Least Privilege', desc: 'Every user persona and system process operates with minimum permissions necessary.' },
                { title: 'RBAC', desc: 'Clinical authorization strictly isolated to licensed prescribers (MD/DO/NP/PA).' },
                { title: 'Encryption', desc: 'AES-256 at rest, TLS 1.3 in transit with strict certificate pinning.' },
                { title: 'Input Validation', desc: 'Strict JSON schema sanitization on all inbound NCPDP and HL7 payloads.' },
                { title: 'API Authorization', desc: 'Cryptographically signed ephemeral JWTs with rapid token rotation.' },
                { title: 'Auditability', desc: 'Append-only ledger recording all actor interactions and status shifts.' },
                { title: 'Data Minimization', desc: 'Only telemetry strictly required to resolve the refill blocker is ingested.' },
                { title: 'Human Approval', desc: 'Clinical sign-off mandatory before any prescription order can be transmitted.' },
                { title: 'Fail-Safe Behavior', desc: 'Graceful degradation to deterministic safety checks if AI inference is offline.' },
              ].map((p) => (
                <div key={p.title} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    {p.title}
                  </span>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mandatory compliance disclaimer */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 font-medium">
            Demo security architecture. Production deployment requires formal compliance validation.
          </div>
        </div>
      )}

      {/* TAB 8: RESPONSIBLE AI (Requirement 8) */}
      {activeTab === 'RESPONSIBLE_AI' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>RESPONSIBLE AI GOVERNANCE</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ethical, clinically grounded, and human-in-the-loop operational intelligence principles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {[
              { title: 'Human-in-the-Loop', desc: 'Every recommendation requires explicit human provider verification (APPROVE / EDIT / REJECT).' },
              { title: 'Evidence-Backed Summaries', desc: 'Every blocker diagnosis cites concrete EHR encounter records, fill dates, and laboratory telemetry.' },
              { title: 'Calibrated Confidence Indicators', desc: 'Model confidence scores explicitly presented to operators before decision-making.' },
              { title: 'Explainable Recommendations', desc: 'No hidden chain-of-thought; plain-language clinical rationale exposed for clinician review.' },
              { title: 'No Autonomous Prescribing', desc: 'AI is architecturally prevented from generating or signing new prescription orders.' },
              { title: 'No Autonomous Medication Changes', desc: 'AI cannot alter dosage, substitute medications, or discontinue therapies.' },
              { title: 'Role-Based Access Enforcement', desc: 'Only licensed prescribers can view clinical sign-off tokens.' },
              { title: 'Auditability & Model Lineage', desc: 'Every inference query, prompt, and recommendation is permanently logged in the audit ledger.' },
              { title: 'Data Minimization', desc: 'Zero patient data is used for model training; session-only inference processing.' },
              { title: 'Fail-Safe Behavior', desc: 'Graceful fallback to deterministic clinical rules engine if model inference fails.' },
            ].map((principle) => (
              <div key={principle.title} className="p-3.5 rounded-lg bg-teal-50/40 border border-teal-200 space-y-1">
                <span className="font-bold text-teal-950 block flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-700" />
                  {principle.title}
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">{principle.desc}</p>
              </div>
            ))}
          </div>

          {/* Prominent Safety Banner */}
          <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" />
            <p className="text-xs font-medium leading-relaxed">
              "AI assists workflow operations. Authorized healthcare professionals remain responsible for clinical decisions."
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
