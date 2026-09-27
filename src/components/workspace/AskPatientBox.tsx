import React, { useState } from 'react';
import { Search, Sparkles, Send, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Patient, RefillRequest, PatientAnswer } from '../../types';

interface AskPatientBoxProps {
  patient: Patient;
  currentCase?: RefillRequest;
}

export const AskPatientBox: React.FC<AskPatientBoxProps> = ({ patient, currentCase }) => {
  const [query, setQuery] = useState('');
  const [activeAnswer, setActiveAnswer] = useState<PatientAnswer | null>(null);

  const suggestedQueries = [
    'Why is the current refill blocked?',
    'When was the last relevant visit?',
    'What refill problems occurred previously?',
    'What information is missing?',
  ];

  const handleQuery = (q: string) => {
    setQuery(q);
    const lower = q.toLowerCase();

    let ans: PatientAnswer;

    if (lower.includes('blocked') || lower.includes('why')) {
      ans = {
        query: q,
        answer: currentCase
          ? `The current refill for ${currentCase.medication.name} ${currentCase.medication.dosage} is blocked because the original prescription has zero refills remaining and requires explicit physician renewal authorization.`
          : `The current refill is blocked due to depleted authorized refills on the active prescription.`,
        evidence: [
          'Prescription registry indicates 0 remaining refills on active maintenance order.',
          'Practice policy requires physician electronic re-authorization after all refills are exhausted.',
          `Last refill filled on ${currentCase?.prescription.lastFilledDate || 'February 2026'}.`,
        ],
        confidence: 96,
      };
    } else if (lower.includes('visit') || lower.includes('encounter') || lower.includes('when')) {
      ans = {
        query: q,
        answer: `The patient's last relevant encounter was an In-Person Annual visit on ${patient.lastEncounterDate} (approximately 5 months ago) with ${patient.primaryCareProviderId === 'prov-carter' ? 'Dr. Emily Carter' : 'Primary Care'}.`,
        evidence: [
          `Encounter Date: ${patient.lastEncounterDate} at MetroHealth Cardiology Suite.`,
          'Encounter Summary: Comprehensive cardiovascular & hyperlipidemia review. Blood pressure controlled at 122/78 mmHg.',
          'Clinical Decision: Continuation of Atorvastatin 20 mg oral daily without dosage change.',
        ],
        confidence: 98,
      };
    } else if (lower.includes('problem') || lower.includes('previously') || lower.includes('intervention')) {
      ans = {
        query: q,
        answer: `Patient has had 3 previous refill interventions recorded in the past 6 months, primarily for zero refills remaining and periodic lab recertification.`,
        evidence: [
          'RX-10021 (Atorvastatin 20mg): Resolved after 2 days following physician renewal.',
          'RX-10191 (Lisinopril 10mg): Resolved in 3h via standing nurse triage protocol.',
          'No adverse drug events or allergic reactions reported in prior refill cycles.',
        ],
        confidence: 94,
      };
    } else if (lower.includes('missing') || lower.includes('information')) {
      ans = {
        query: q,
        answer: currentCase && currentCase.whatInformationIsMissing.length > 0
          ? `The missing items needed to close the loop are: ${currentCase.whatInformationIsMissing.join(' and ')}.`
          : 'All core diagnostic labs are on file within the acceptable interval; only the prescriber digital signature token is pending.',
        evidence: [
          'Diagnostic Lipid Profile verified on file dated 2025-09-02 (LDL 68 mg/dL).',
          'Hepatic Panel verified within normal limits (ALT 24 U/L).',
          'Prescriber signature token required per state electronic prescribing mandate.',
        ],
        confidence: 92,
      };
    } else {
      ans = {
        query: q,
        answer: `Based on synthetic clinical chart data for ${patient.firstName} ${patient.lastName} (MRN: ${patient.mrn}): Patient is on stable maintenance therapy with documented compliance and no active contraindications.`,
        evidence: [
          `Active therapies: ${patient.activeMedications.map((m) => m.name).join(', ')}.`,
          `Insurance status: ${patient.insurance.payerName} (Verified).`,
          `Recent labs on record: ${patient.lastLabsDate || '2025-09-02'}.`,
        ],
        confidence: 90,
      };
    }

    setActiveAnswer(ans);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Ask About This Patient</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">Grounded in EHR Record</span>
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (query.trim()) handleQuery(query.trim());
        }}
        className="relative"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about this patient's refills, visits, or blockers..."
          className="w-full pl-3 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-teal-500 text-slate-900 placeholder:text-slate-400"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 text-slate-400 hover:text-teal-700 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Suggested Query Buttons */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {suggestedQueries.map((sq) => (
          <button
            key={sq}
            onClick={() => handleQuery(sq)}
            className="text-[11px] text-left px-2 py-1 rounded bg-slate-100 hover:bg-teal-50 hover:text-teal-900 text-slate-700 transition-colors border border-slate-200/70"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Answer Container */}
      {activeAnswer && (
        <div className="mt-3 p-3.5 rounded-lg bg-teal-50/60 border border-teal-200 text-xs space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="font-bold text-teal-950 uppercase tracking-wider text-[10px]">
              Grounded Response
            </span>
            <span className="text-[10px] font-mono font-semibold bg-white border border-teal-200 text-teal-800 px-1.5 py-0.2 rounded">
              {activeAnswer.confidence}% Confidence
            </span>
          </div>

          <p className="text-slate-800 leading-relaxed font-medium">
            {activeAnswer.answer}
          </p>

          <div className="pt-2 border-t border-teal-200/60">
            <span className="text-[10px] font-bold text-teal-900 uppercase tracking-wider block mb-1">
              Clinical Evidence:
            </span>
            <ul className="space-y-1 text-[11px] text-slate-700">
              {activeAnswer.evidence.map((ev, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>{ev}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
