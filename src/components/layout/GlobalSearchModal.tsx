import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Pill, User, Building2, Stethoscope, Hash } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    refills,
    openRefillDetail,
    viewPatient360,
    setCurrentView,
    setMode,
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const matchedRefills = cleanQuery
    ? refills.filter(
        (r) =>
          r.id.toLowerCase().includes(cleanQuery) ||
          r.medication.name.toLowerCase().includes(cleanQuery) ||
          r.medication.genericName.toLowerCase().includes(cleanQuery) ||
          r.patient.firstName.toLowerCase().includes(cleanQuery) ||
          r.patient.lastName.toLowerCase().includes(cleanQuery) ||
          r.patient.mrn.toLowerCase().includes(cleanQuery) ||
          r.provider.lastName.toLowerCase().includes(cleanQuery) ||
          r.pharmacy.name.toLowerCase().includes(cleanQuery)
      )
    : refills.slice(0, 5); // default recent/top cases

  const handleSelectCase = (caseId: string) => {
    setIsSearchModalOpen(false);
    setMode('app');
    openRefillDetail(caseId);
  };

  const handleSelectPatient = (patientId: string) => {
    setIsSearchModalOpen(false);
    viewPatient360(patientId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/40 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 bg-white">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Patient, Medication, Refill ID (e.g. RX-10482), Provider, or Pharmacy..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-slate-100 border border-slate-200 rounded">
            ESC
          </kbd>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border-b border-slate-100 text-xs text-slate-500 overflow-x-auto">
          <span className="font-medium shrink-0">Try searching:</span>
          {['RX-10482', 'Sarah Mitchell', 'Atorvastatin', 'Dr. Carter', 'Eliquis', 'Walgreens'].map(
            (term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 hover:border-teal-500 hover:text-teal-700 transition-colors whitespace-nowrap text-xs"
              >
                {term}
              </button>
            )
          )}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto divide-y divide-slate-100 p-2 max-h-[55vh]">
          {matchedRefills.length === 0 ? (
            <div className="text-center py-10 px-4">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">No matching refill records found</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching by case ID like <span className="font-mono text-slate-600">RX-10482</span>, patient name, medication name, or provider.
              </p>
            </div>
          ) : (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                {query ? `Refill Cases (${matchedRefills.length})` : 'Recent Priority Cases'}
              </div>
              {matchedRefills.map((refill) => (
                <div
                  key={refill.id}
                  onClick={() => handleSelectCase(refill.id)}
                  className="group flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shrink-0 mt-0.5">
                      <Pill className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-xs text-teal-700">
                          {refill.id}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-sm font-semibold text-slate-900 truncate">
                          {refill.medication.name} {refill.medication.dosage}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <User className="w-3 h-3 text-slate-400" />
                          {refill.patient.firstName} {refill.patient.lastName} ({refill.patient.mrn})
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Stethoscope className="w-3 h-3 text-slate-400" />
                          {refill.provider.lastName}, {refill.provider.title.split(',')[0]}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 truncate max-w-[140px]">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {refill.pharmacy.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <StatusBadge status={refill.status} size="sm" />
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Press <kbd className="px-1.5 py-0.5 text-[10px] bg-white border border-slate-200 rounded font-mono">ESC</kbd> to close
          </span>
          <span className="text-slate-400">
            Real-time multi-attribute registry index
          </span>
        </div>
      </div>
    </div>
  );
};
