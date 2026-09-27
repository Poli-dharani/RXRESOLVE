import React, { useMemo } from 'react';
import {
  Search,
  Filter,
  RotateCcw,
  ArrowRight,
  Download,
  AlertCircle,
  Clock,
  Layers,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RefillStatus, Priority, WorkflowStage } from '../../types';
import { PriorityIndicator } from '../common/PriorityIndicator';
import { StatusBadge } from '../common/StatusBadge';

export const RefillQueueView: React.FC = () => {
  const {
    refills,
    openRefillDetail,
    providers,
    pharmacies,
    filterStage,
    setFilterStage,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    filterBlocker,
    setFilterBlocker,
    filterProvider,
    setFilterProvider,
    filterPharmacy,
    setFilterPharmacy,
    filterAge,
    setFilterAge,
    queueSearchQuery,
    setQueueSearchQuery,
    resetQueueFilters,
  } = useApp();

  const statuses: (RefillStatus | 'ALL')[] = [
    'ALL',
    'NEW',
    'ANALYZING',
    'WAITING FOR PROVIDER',
    'WAITING FOR PHARMACY',
    'MISSING INFORMATION',
    'INSURANCE BLOCKED',
    'FOLLOW-UP REQUIRED',
    'READY',
    'RESOLVED',
  ];

  const blockers = [
    { label: 'All Blockers', value: 'ALL' },
    { label: 'Provider Authorization', value: 'PROVIDER_AUTHORIZATION' },
    { label: 'Missing Lab Work', value: 'MISSING_LAB_WORK' },
    { label: 'Prior Auth / Insurance', value: 'PA_REQUIRED' },
    { label: 'Overdue Office Visit', value: 'OVERDUE_OFFICE_VISIT' },
    { label: 'Pharmacy Clarification', value: 'PHARMACY_CLARIFICATION' },
    { label: 'Dosage Clarification', value: 'DOSAGE_CLARIFICATION' },
    { label: 'No Refills Remaining', value: 'NO_REFILLS_REMAINING' },
  ];

  // Filtering engine
  const filteredRefills = useMemo(() => {
    return refills.filter((refill) => {
      // Stage filter
      if (filterStage !== 'ALL' && refill.workflowStage !== filterStage) {
        return false;
      }
      // Status filter
      if (filterStatus !== 'ALL' && refill.status !== filterStatus) {
        return false;
      }
      // Priority filter
      if (filterPriority !== 'ALL' && refill.priority !== filterPriority) {
        return false;
      }
      // Blocker filter
      if (filterBlocker !== 'ALL' && refill.blockerCategory !== filterBlocker) {
        return false;
      }
      // Provider filter
      if (filterProvider !== 'ALL' && refill.provider.id !== filterProvider) {
        return false;
      }
      // Pharmacy filter
      if (filterPharmacy !== 'ALL' && refill.pharmacy.id !== filterPharmacy) {
        return false;
      }
      // Age filter
      if (filterAge === '<12h' && refill.ageHours >= 12) return false;
      if (filterAge === '12-24h' && (refill.ageHours < 12 || refill.ageHours > 24)) return false;
      if (filterAge === '>24h' && refill.ageHours <= 24) return false;

      // Text query
      if (queueSearchQuery) {
        const q = queueSearchQuery.toLowerCase().trim();
        const matchId = refill.id.toLowerCase().includes(q);
        const matchPatient =
          refill.patient.firstName.toLowerCase().includes(q) ||
          refill.patient.lastName.toLowerCase().includes(q) ||
          refill.patient.mrn.toLowerCase().includes(q);
        const matchMed =
          refill.medication.name.toLowerCase().includes(q) ||
          refill.medication.genericName.toLowerCase().includes(q);
        const matchProvider = refill.provider.lastName.toLowerCase().includes(q);
        const matchPharmacy = refill.pharmacy.name.toLowerCase().includes(q);
        if (!matchId && !matchPatient && !matchMed && !matchProvider && !matchPharmacy) {
          return false;
        }
      }

      return true;
    });
  }, [
    refills,
    filterStage,
    filterStatus,
    filterPriority,
    filterBlocker,
    filterProvider,
    filterPharmacy,
    filterAge,
    queueSearchQuery,
  ]);

  const activeFiltersCount = [
    filterStage !== 'ALL',
    filterStatus !== 'ALL',
    filterPriority !== 'ALL',
    filterBlocker !== 'ALL',
    filterProvider !== 'ALL',
    filterPharmacy !== 'ALL',
    filterAge !== 'ALL',
    Boolean(queueSearchQuery),
  ].filter(Boolean).length;

  return (
    <div className="space-y-4 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Refill Queue
            </h1>
            <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {filteredRefills.length} of {refills.length} cases
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise prescription refill orchestration directory and active intervention queue
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={resetQueueFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters ({activeFiltersCount})</span>
            </button>
          )}

          <button
            onClick={() => {
              alert('Exporting Refill Queue Summary report (CSV formatted). In demo mode.');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        {/* Row 1: Search & Core Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Live Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={queueSearchQuery}
              onChange={(e) => setQueueSearchQuery(e.target.value)}
              placeholder="Search ID, patient, drug, doctor..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-teal-500 focus:bg-white text-slate-900 placeholder:text-slate-400 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as RefillStatus | 'ALL')}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-teal-500 text-slate-800"
            >
              <option value="ALL">Status: All Statuses</option>
              {statuses.filter((s) => s !== 'ALL').map((s) => (
                <option key={s} value={s}>
                  Status: {s}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-teal-500 text-slate-800"
            >
              <option value="ALL">Priority: All Levels</option>
              <option value="CRITICAL">Priority: Critical</option>
              <option value="HIGH">Priority: High</option>
              <option value="MEDIUM">Priority: Medium</option>
              <option value="LOW">Priority: Low</option>
            </select>
          </div>

          {/* Blocker Category Filter */}
          <div>
            <select
              value={filterBlocker}
              onChange={(e) => setFilterBlocker(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-teal-500 text-slate-800"
            >
              {blockers.map((b) => (
                <option key={b.value} value={b.value}>
                  Blocker: {b.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Secondary Attributes (Provider, Pharmacy, Age) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 border-t border-slate-100">
          {/* Provider Filter */}
          <div>
            <select
              value={filterProvider}
              onChange={(e) => setFilterProvider(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-teal-500 text-slate-800"
            >
              <option value="ALL">Provider: All Prescribers</option>
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  Dr. {p.firstName} {p.lastName} ({p.department})
                </option>
              ))}
            </select>
          </div>

          {/* Pharmacy Filter */}
          <div>
            <select
              value={filterPharmacy}
              onChange={(e) => setFilterPharmacy(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-teal-500 text-slate-800"
            >
              <option value="ALL">Pharmacy: All Pharmacies</option>
              {pharmacies.map((ph) => (
                <option key={ph.id} value={ph.id}>
                  {ph.name}
                </option>
              ))}
            </select>
          </div>

          {/* Age Filter */}
          <div>
            <select
              value={filterAge}
              onChange={(e) => setFilterAge(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-teal-500 text-slate-800"
            >
              <option value="ALL">Age: Any Duration</option>
              <option value="<12h">&lt; 12 hours</option>
              <option value="12-24h">12 to 24 hours</option>
              <option value=">24h">&gt; 24 hours (SLA Risk)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Refill Queue Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Case / Patient</th>
                <th className="py-3 px-4">Medication</th>
                <th className="py-3 px-4">Pharmacy</th>
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Blocker Description</th>
                <th className="py-3 px-4 text-center">Age</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredRefills.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-700">No refill cases match current filter criteria</p>
                    <button
                      onClick={resetQueueFilters}
                      className="mt-2 text-xs font-semibold text-teal-700 hover:underline"
                    >
                      Clear all active filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredRefills.map((refill) => (
                  <tr
                    key={refill.id}
                    onClick={() => openRefillDetail(refill)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    {/* Priority */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <PriorityIndicator priority={refill.priority} />
                    </td>

                    {/* Patient & ID */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-semibold text-teal-700 text-xs">
                          {refill.id}
                        </span>
                      </div>
                      <div className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">
                        {refill.patient.firstName} {refill.patient.lastName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {refill.patient.mrn} · DOB {refill.patient.dateOfBirth}
                      </div>
                    </td>

                    {/* Medication */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">
                        {refill.medication.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {refill.medication.dosage} · {refill.prescription.daysSupply}d supply
                      </div>
                    </td>

                    {/* Pharmacy */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-slate-800 truncate max-w-[130px]">
                        {refill.pharmacy.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {refill.pharmacy.preferredCommunicationChannel}
                      </div>
                    </td>

                    {/* Provider */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-slate-800 font-medium">
                        Dr. {refill.provider.lastName}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {refill.provider.specialty.split(' ')[0]}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={refill.status} size="sm" />
                    </td>

                    {/* Blocker Description */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="text-slate-700 truncate text-xs flex items-center gap-1.5" title={refill.blockerDescription}>
                        {refill.status !== 'RESOLVED' ? (
                          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                        ) : (
                          <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                        )}
                        <span className="truncate">{refill.blockerDescription}</span>
                      </div>
                    </td>

                    {/* Age */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap font-mono tabular-nums text-slate-600 font-medium">
                      {refill.ageFormatted}
                    </td>

                    {/* Owner */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-slate-700 font-medium">
                        {refill.owner}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openRefillDetail(refill);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Displaying <strong className="font-semibold text-slate-700">{filteredRefills.length}</strong> refill records
          </span>
          <span className="text-[11px] text-slate-400">
            Real-time synchronization enabled with Surescripts & Pharmacy PBM network
          </span>
        </div>
      </div>
    </div>
  );
};
