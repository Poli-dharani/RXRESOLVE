import React from 'react';
import { ArrowRight, ChevronRight, AlertCircle, Clock, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PriorityIndicator } from '../common/PriorityIndicator';
import { StatusBadge } from '../common/StatusBadge';

export const PriorityWorklist: React.FC = () => {
  const { refills, openRefillDetail, setCurrentView } = useApp();

  // Show top priority non-resolved cases needing urgent triage
  const priorityCases = refills
    .filter((r) => r.status !== 'RESOLVED')
    .slice(0, 6);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <span>PRIORITY WORKLIST</span>
            <span className="text-xs font-normal text-slate-500">
              (High & Critical Blocker Cases Awaiting Human-in-the-Loop Action)
            </span>
          </h2>
        </div>
        <button
          onClick={() => setCurrentView('queue')}
          className="text-xs font-medium text-teal-700 hover:text-teal-900 flex items-center gap-1 transition-colors"
        >
          <span>View All Cases</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Patient</th>
              <th className="py-3 px-4">Medication</th>
              <th className="py-3 px-4">Pharmacy</th>
              <th className="py-3 px-4">Provider</th>
              <th className="py-3 px-4">Blocker</th>
              <th className="py-3 px-4 text-center">Age</th>
              <th className="py-3 px-4">Owner</th>
              <th className="py-3 px-4 text-right">Next Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {priorityCases.map((refill) => (
              <tr
                key={refill.id}
                onClick={() => openRefillDetail(refill)}
                className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
              >
                {/* Priority */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <PriorityIndicator priority={refill.priority} />
                </td>

                {/* Patient */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {refill.patient.firstName} {refill.patient.lastName}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {refill.patient.mrn} · DOB {refill.patient.dateOfBirth}
                  </div>
                </td>

                {/* Medication */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="font-medium text-slate-800">
                    {refill.medication.name}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {refill.medication.dosage} · {refill.prescription.daysSupply}d supply
                  </div>
                </td>

                {/* Pharmacy */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="text-slate-700 truncate max-w-[140px]">
                    {refill.pharmacy.name}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                    {refill.pharmacy.preferredCommunicationChannel}
                  </div>
                </td>

                {/* Provider */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="text-slate-800 font-medium">
                    Dr. {refill.provider.lastName}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {refill.provider.specialty.split(' ')[0]}
                  </div>
                </td>

                {/* Blocker */}
                <td className="py-3.5 px-4 max-w-xs">
                  <div className="text-rose-700 font-medium truncate flex items-center gap-1.5" title={refill.blockerDescription}>
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                    <span className="truncate">{refill.blockerDescription}</span>
                  </div>
                </td>

                {/* Age */}
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <span className="font-mono text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {refill.ageFormatted}
                  </span>
                </td>

                {/* Owner */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="text-slate-700 font-medium">
                    {refill.owner}
                  </span>
                  <div className="text-[10px] text-slate-400">
                    {refill.ownerRole.split('/')[0]}
                  </div>
                </td>

                {/* Next Action Button */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openRefillDetail(refill);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-teal-700 rounded-lg shadow-2xs transition-colors"
                  >
                    <span>Review</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Showing 6 most urgent cases · Click any row to inspect clinical intelligence & audit trail</span>
        <button
          onClick={() => setCurrentView('queue')}
          className="text-teal-700 hover:text-teal-900 font-semibold"
        >
          View all 23 attention items →
        </button>
      </div>
    </div>
  );
};
