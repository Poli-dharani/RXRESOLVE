import React, { useState } from 'react';
import {
  User,
  Calendar,
  Pill,
  Clock,
  Shield,
  FileText,
  AlertTriangle,
  Heart,
  ChevronDown,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Patient, RefillRequest } from '../../types';
import { useApp } from '../../context/AppContext';
import { AskPatientBox } from './AskPatientBox';

interface Patient360ColumnProps {
  patient: Patient;
  currentCase: RefillRequest;
}

export const Patient360Column: React.FC<Patient360ColumnProps> = ({ patient, currentCase }) => {
  const { viewPatient360 } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'summary' | 'meds' | 'refills' | 'encounters'>('summary');

  // Age calculation
  const birthYear = parseInt(patient.dateOfBirth.split('-')[0], 10);
  const calculatedAge = 2026 - birthYear;

  return (
    <div className="space-y-4">
      {/* Patient Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="text-[10px] font-bold tracking-wider uppercase text-teal-700">
            PATIENT 360
          </span>
          <button
            onClick={() => viewPatient360(patient.id)}
            className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 transition-colors"
          >
            <span>View Full 360</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-start gap-3.5 mt-3">
          <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 font-bold text-sm shrink-0">
            {patient.firstName[0]}
            {patient.lastName[0]}
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              {patient.firstName} {patient.lastName}
            </h3>
            <div className="text-xs text-slate-500 font-medium mt-0.5">
              Age {calculatedAge} · DOB: {patient.dateOfBirth} ({patient.gender})
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-0.5">
              MRN: {patient.mrn}
            </div>
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Primary Care Provider:</span>
            <span className="font-semibold text-slate-900">
              Dr. Emily Carter, MD
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Coverage:</span>
            <span className="font-semibold text-slate-900 truncate max-w-[170px]">
              {patient.insurance.payerName}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Preferred Pharmacy:</span>
            <span className="font-semibold text-slate-900 truncate max-w-[170px]">
              {currentCase.pharmacy.name}
            </span>
          </div>
        </div>
      </div>

      {/* PATIENT CONTEXT SUMMARY (AI Synthesized) */}
      <div className="bg-teal-50/60 rounded-xl border border-teal-200 p-4 shadow-xs space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Patient Context Summary</span>
        </div>

        <p className="text-xs text-slate-800 leading-relaxed font-medium">
          {patient.patientContextSummary ||
            `${patient.firstName} has been receiving ${currentCase.medication.name} ${currentCase.medication.dosage} consistently for the past 14 months. The current refill request has 0 refills remaining. The available record shows the last relevant encounter approximately 5 months ago.`}
        </p>

        {/* Quick Jump Buttons */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-teal-200/60">
          <button
            onClick={() => viewPatient360(patient.id)}
            className="text-[11px] font-semibold px-2 py-1 rounded bg-white border border-teal-200 hover:bg-teal-50 text-teal-800 transition-colors"
          >
            View Full History
          </button>
          <button
            onClick={() => setActiveSubTab('meds')}
            className={`text-[11px] font-semibold px-2 py-1 rounded border transition-colors ${
              activeSubTab === 'meds'
                ? 'bg-teal-700 text-white border-teal-700'
                : 'bg-white border-teal-200 text-teal-800 hover:bg-teal-50'
            }`}
          >
            Medication History
          </button>
          <button
            onClick={() => setActiveSubTab('encounters')}
            className={`text-[11px] font-semibold px-2 py-1 rounded border transition-colors ${
              activeSubTab === 'encounters'
                ? 'bg-teal-700 text-white border-teal-700'
                : 'bg-white border-teal-200 text-teal-800 hover:bg-teal-50'
            }`}
          >
            Encounters
          </button>
          <button
            onClick={() => setActiveSubTab('refills')}
            className={`text-[11px] font-semibold px-2 py-1 rounded border transition-colors ${
              activeSubTab === 'refills'
                ? 'bg-teal-700 text-white border-teal-700'
                : 'bg-white border-teal-200 text-teal-800 hover:bg-teal-50'
            }`}
          >
            Refill History
          </button>
        </div>
      </div>

      {/* Sub-view switcher card */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        {activeSubTab === 'summary' && (
          <div className="space-y-3.5 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Documented Conditions
              </span>
              <div className="flex flex-wrap gap-1.5">
                {patient.conditions.map((cond, idx) => (
                  <span
                    key={`${cond}-${idx}`}
                    className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium"
                  >
                    {cond}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Allergies & Reactions
              </span>
              <div className="flex flex-wrap gap-1.5">
                {patient.allergies.map((all, idx) => (
                  <span
                    key={`${all}-${idx}`}
                    className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 font-semibold"
                  >
                    {all}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Active Medications ({patient.activeMedications.length})
              </span>
              <div className="space-y-1.5">
                {patient.activeMedications.map((m) => (
                  <div key={m.id} className="p-2 rounded bg-slate-50 border border-slate-100">
                    <div className="font-semibold text-slate-900">{m.name} {m.dosage}</div>
                    <div className="text-[11px] text-slate-500">{m.sig}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'meds' && (
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="font-bold text-slate-900">Medication History</span>
              <button
                onClick={() => setActiveSubTab('summary')}
                className="text-[10px] text-teal-700 font-semibold"
              >
                Close Tab
              </button>
            </div>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {(patient.medicationHistory || []).map((mh, idx) => (
                <div key={idx} className="p-2 rounded bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{mh.medication}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        mh.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {mh.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">{mh.dose}</div>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">
                    Prescribed: {mh.rxDate} · Refills: {mh.refillDates.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'refills' && (
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="font-bold text-slate-900">Refill History</span>
              <button
                onClick={() => setActiveSubTab('summary')}
                className="text-[10px] text-teal-700 font-semibold"
              >
                Close Tab
              </button>
            </div>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {(patient.refillHistory || []).map((rh) => (
                <div key={rh.id} className="p-2 rounded bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-teal-800">{rh.id}</span>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                        rh.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {rh.status}
                    </span>
                  </div>
                  <div className="font-medium text-slate-900 mt-0.5">{rh.medicationName}</div>
                  <div className="text-[10px] text-slate-500 flex justify-between mt-1">
                    <span>Turnaround: {rh.turnaroundTime}</span>
                    <span>{rh.resolvedBy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'encounters' && (
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="font-bold text-slate-900">Recent Encounters</span>
              <button
                onClick={() => setActiveSubTab('summary')}
                className="text-[10px] text-teal-700 font-semibold"
              >
                Close Tab
              </button>
            </div>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {(patient.encounters || []).map((enc) => (
                <div key={enc.id} className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between font-semibold text-slate-900">
                    <span>{enc.type}</span>
                    <span className="font-mono text-slate-400 text-[10px]">{enc.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-3">{enc.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Ask About This Patient Query Box */}
      <AskPatientBox patient={patient} currentCase={currentCase} />
    </div>
  );
};
