import React, { useState } from 'react';
import {
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Shield,
  Pill,
  Clock,
  AlertTriangle,
  ArrowRight,
  FileText,
  Heart,
  Activity,
  CheckCircle2,
  Sparkles,
  Layers,
  MessageSquare,
  FileCheck,
  History,
  Lock,
  Stethoscope,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityIndicator } from '../common/PriorityIndicator';
import { AskPatientBox } from '../workspace/AskPatientBox';

export type PatientTab =
  | 'overview'
  | 'medications'
  | 'refills'
  | 'encounters'
  | 'labs'
  | 'documents'
  | 'messages'
  | 'insurance'
  | 'audit';

export const Patient360View: React.FC = () => {
  const {
    patients,
    selectedPatientId,
    setSelectedPatientId,
    refills,
    openRefillDetail,
  } = useApp();

  const [activeTab, setActiveTab] = useState<PatientTab>('overview');

  const currentPatient =
    patients.find((p) => p.id === selectedPatientId) || patients[0];

  const patientRefills = refills.filter((r) => r.patientId === currentPatient.id);
  const currentActiveRefill = patientRefills[0];

  const birthYear = parseInt(currentPatient.dateOfBirth.split('-')[0], 10);
  const calculatedAge = 2026 - birthYear;

  const tabs: { id: PatientTab; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'medications', label: 'Medications', count: (currentPatient.medicationHistory || []).length || currentPatient.activeMedications.length },
    { id: 'refills', label: 'Refills', count: (currentPatient.refillHistory || []).length || patientRefills.length },
    { id: 'encounters', label: 'Encounters', count: (currentPatient.encounters || []).length },
    { id: 'labs', label: 'Labs', count: (currentPatient.labs || []).length },
    { id: 'documents', label: 'Documents', count: (currentPatient.documents || []).length },
    { id: 'messages', label: 'Messages' },
    { id: 'insurance', label: 'Insurance' },
    { id: 'audit', label: 'Audit' },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Longitudinal Health Record
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-mono text-slate-500">Patient 360</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            {currentPatient.firstName} {currentPatient.lastName}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            MRN: {currentPatient.mrn} · DOB: {currentPatient.dateOfBirth} ({calculatedAge} years old) · {currentPatient.gender}
          </p>
        </div>

        {/* Patient Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Switch Patient:</span>
          <select
            value={currentPatient.id}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-hidden focus:border-teal-500"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName} ({p.mrn})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 9 Tabs Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 gap-2 overflow-x-auto shadow-xs text-xs font-semibold">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3.5 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'border-teal-600 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-teal-100 text-teal-900' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT VIEWS */}
      <div className="space-y-6">
        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* AI Patient Context Summary */}
            <div className="bg-teal-50/60 rounded-xl border border-teal-200 p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-900 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>AI PATIENT CONTEXT SUMMARY</span>
                </div>
                <span className="text-[10px] font-mono text-teal-800 bg-white px-2 py-0.5 rounded border border-teal-200 font-semibold">
                  Synthesized from Available Record
                </span>
              </div>

              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {currentPatient.patientContextSummary ||
                  `${currentPatient.firstName} has been receiving atorvastatin 20 mg consistently for the past 14 months. The current refill request has 0 refills remaining. The available record shows the last relevant encounter approximately 5 months ago.`}
              </p>

              <div className="pt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-teal-900 font-medium">
                <span>• Relevant Medications: Atorvastatin Calcium 20 mg, Lisinopril 10 mg</span>
                <span>• Last Encounter: {currentPatient.lastEncounterDate}</span>
                <span>• Current Blocker: Depleted Refills / Provider Authorization Required</span>
              </div>
            </div>

            {/* Quick Grid: Demographics, Care Team, Conditions & Allergies */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Care Team */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs text-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-teal-600" />
                  <span>Assigned Care Team</span>
                </h3>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-900 block">Dr. Emily Carter, MD, FACC</span>
                    <span className="text-slate-500 text-[11px]">Primary Prescriber · Cardiology</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-900 block">Elena Rostova, RN</span>
                    <span className="text-slate-500 text-[11px]">Clinical Staff / Nurse Triage</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-900 block">Julian Alvarez, PharmD</span>
                    <span className="text-slate-500 text-[11px]">Retail Pharmacy Liaison</span>
                  </div>
                </div>
              </div>

              {/* Conditions & Diagnoses */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs text-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Active Diagnoses & Conditions</span>
                </h3>

                <div className="space-y-2">
                  {currentPatient.conditions.map((c, idx) => (
                    <div key={`${c}-${idx}`} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 font-medium text-slate-800">
                      {c}
                    </div>
                  ))}
                </div>
              </div>

              {/* Allergies & Alerts */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs text-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Allergies & Sensitivities</span>
                </h3>

                <div className="space-y-2">
                  {currentPatient.allergies.map((a, idx) => (
                    <div key={`${a}-${idx}`} className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 font-semibold text-rose-900">
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Open Refills & Recent Events */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Open Refills for this patient */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Open Refill Cases
                  </h3>
                  <span className="font-mono text-xs text-slate-500">
                    {patientRefills.length} requests
                  </span>
                </div>

                <div className="space-y-2">
                  {patientRefills.map((refill) => (
                    <div
                      key={refill.id}
                      onClick={() => openRefillDetail(refill)}
                      className="p-3 rounded-lg border border-slate-200 hover:border-teal-500 hover:bg-slate-50/70 cursor-pointer transition-all flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-teal-800">{refill.id}</span>
                          <span className="font-bold text-slate-900">{refill.medication.name}</span>
                        </div>
                        <span className="text-slate-500 text-[11px] block mt-0.5 truncate max-w-sm">
                          {refill.blockerDescription}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <StatusBadge status={refill.status} size="sm" />
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Natural language query box */}
              <AskPatientBox patient={currentPatient} currentCase={currentActiveRefill} />
            </div>
          </div>
        )}

        {/* 2. MEDICATIONS TAB (Full History Timeline - Requirement 7) */}
        {activeTab === 'medications' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">
                Longitudinal Medication History Timeline
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Prescription dates, dose strengths, refill fill history, and ordering providers
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                    <th className="py-3 px-4">Medication</th>
                    <th className="py-3 px-4">Dose & Sig</th>
                    <th className="py-3 px-4">Prescription Date</th>
                    <th className="py-3 px-4">Refill Dates On File</th>
                    <th className="py-3 px-4">Provider</th>
                    <th className="py-3 px-4">Pharmacy</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {((currentPatient.medicationHistory && currentPatient.medicationHistory.length > 0)
                    ? currentPatient.medicationHistory
                    : currentPatient.activeMedications.map((m) => ({
                        medication: m.name,
                        dose: `${m.dosage} — ${m.sig}`,
                        rxDate: '2025-03-10',
                        refillDates: ['2025-06-12', '2025-09-18', '2025-12-15', '2026-02-14'],
                        provider: 'Dr. Emily Carter',
                        pharmacy: 'CVS Pharmacy #4120',
                        status: 'Active' as const,
                      }))
                  ).map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{item.medication}</td>
                      <td className="py-3 px-4 text-slate-700">{item.dose}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{item.rxDate}</td>
                      <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">
                        {item.refillDates.join(' · ')}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">{item.provider}</td>
                      <td className="py-3 px-4 text-slate-600">{item.pharmacy}</td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. REFILLS TAB (Historical Refill Cases - Requirement 8) */}
        {activeTab === 'refills' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Historical Refill Cases & Intervention Outcomes
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Resolution cycle times, blocker categories, and authorizing clinical agents
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                    <th className="py-3 px-4">Case ID</th>
                    <th className="py-3 px-4">Medication</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Turnaround Time</th>
                    <th className="py-3 px-4">Blocker Category</th>
                    <th className="py-3 px-4 text-right">Authorizing Agent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {((currentPatient.refillHistory && currentPatient.refillHistory.length > 0)
                    ? currentPatient.refillHistory
                    : [
                        {
                          id: 'RX-10021',
                          medicationName: 'Atorvastatin 20 mg',
                          date: '2025-09-18',
                          status: 'Resolved' as const,
                          turnaroundTime: '2 days',
                          blockerCategory: 'NO_REFILLS',
                          resolvedBy: 'Dr. Emily Carter',
                        },
                        {
                          id: 'RX-10191',
                          medicationName: 'Lisinopril 10 mg',
                          date: '2025-10-10',
                          status: 'Resolved' as const,
                          turnaroundTime: '3h',
                          blockerCategory: 'PROVIDER_REVIEW',
                          resolvedBy: 'Elena Rostova, RN',
                        },
                        {
                          id: 'RX-10482',
                          medicationName: 'Atorvastatin 20 mg',
                          date: '2026-09-26',
                          status: 'Current Blocked' as const,
                          turnaroundTime: '18h (Active)',
                          blockerCategory: 'NO_REFILLS',
                          resolvedBy: 'Pending Dr. Carter',
                        },
                      ]
                  ).map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => openRefillDetail(r.id)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-teal-800">{r.id}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-900">{r.medicationName}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">{r.date}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            r.status === 'Resolved'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">{r.turnaroundTime}</td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">{r.blockerCategory}</td>
                      <td className="py-3.5 px-4 text-right font-medium text-slate-800">{r.resolvedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. ENCOUNTERS TAB */}
        {activeTab === 'encounters' && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Clinical Encounters & Progress Visits
            </h3>

            <div className="space-y-3">
              {(currentPatient.encounters || []).map((enc) => (
                <div key={enc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 gap-1">
                    <span className="font-bold text-slate-900 text-sm">{enc.type}</span>
                    <span className="font-mono text-slate-500 text-[11px]">Date: {enc.date}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{enc.summary}</p>
                  {enc.vitalSigns && (
                    <div className="pt-2 text-[11px] font-mono text-slate-600 flex gap-4">
                      <span>BP: <strong>{enc.vitalSigns.bp}</strong></span>
                      <span>Pulse: <strong>{enc.vitalSigns.pulse} bpm</strong></span>
                      <span>Weight: <strong>{enc.vitalSigns.weightLbs} lbs</strong></span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. LABS TAB */}
        {activeTab === 'labs' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">
                Diagnostic Laboratory Results
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Surveillance panel results supporting medication safety protocols
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                    <th className="py-3 px-4">Test Name</th>
                    <th className="py-3 px-4">Value</th>
                    <th className="py-3 px-4">Reference Range</th>
                    <th className="py-3 px-4">Specimen Date</th>
                    <th className="py-3 px-4 text-right">Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(currentPatient.labs || []).map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{l.testName}</td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                        {l.value} {l.unit}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">{l.referenceRange}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{l.date}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {l.flag}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Clinical Documents & Authorizations
            </h3>

            <div className="space-y-2">
              {(currentPatient.documents || []).map((doc) => (
                <div key={doc.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-teal-600" />
                    <div>
                      <span className="font-bold text-slate-900 block">{doc.title}</span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {doc.category} · Author: {doc.author} · {doc.date}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Opening ${doc.title}`)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-[11px]"
                  >
                    View Document ({doc.fileSize})
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. MESSAGES TAB */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Communication History for {currentPatient.firstName} {currentPatient.lastName}
            </h3>
            <p className="text-xs text-slate-500">
              Direct communications between pharmacy staff, clinical nurses, and prescribing physicians.
            </p>

            <div className="space-y-3 pt-2">
              {patientRefills.flatMap((r) => r.messages).map((m) => (
                <div key={m.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/40 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{m.senderName} ({m.senderRole})</span>
                    <span className="font-mono text-[10px] text-slate-400">{m.timestamp}</span>
                  </div>
                  <p className="text-slate-700">{m.content}</p>
                  <div className="text-[10px] text-slate-400">
                    {m.senderOrg} · via {m.channel}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. INSURANCE TAB */}
        {activeTab === 'insurance' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4 max-w-3xl">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-600" />
              <span>Pharmacy Benefit & Coverage Details</span>
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Payer Name</span>
                <span className="font-bold text-slate-900">{currentPatient.insurance.payerName}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Plan Type</span>
                <span className="font-bold text-slate-900">{currentPatient.insurance.planType}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Member ID</span>
                <span className="font-mono font-bold text-slate-900">{currentPatient.insurance.memberId}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Rx BIN / PCN</span>
                <span className="font-mono font-bold text-slate-900">{currentPatient.insurance.rxBin} / {currentPatient.insurance.rxPcn}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Rx Group</span>
                <span className="font-mono font-bold text-slate-900">{currentPatient.insurance.rxGroup}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Prior Auth on Record</span>
                <span className="font-bold text-emerald-700">
                  {currentPatient.insurance.priorAuthOnRecord ? 'Active PA Verified' : 'None Active'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 9. AUDIT TAB */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              HIPAA Access & Modification Audit Ledger
            </h3>

            <div className="divide-y divide-slate-100 text-xs">
              {patientRefills.flatMap((r) => r.auditHistory).map((aud) => (
                <div key={aud.id} className="py-3 space-y-0.5">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{aud.action}</span>
                    <span className="font-mono text-[10px] text-slate-400">{aud.timestamp}</span>
                  </div>
                  <p className="text-slate-600">{aud.details}</p>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Actor: {aud.actorName} ({aud.actorRole}) · IP: {aud.ipAddress}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
