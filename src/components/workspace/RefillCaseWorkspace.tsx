import React from 'react';
import {
  ArrowLeft,
  Pill,
  Building,
  User,
  Clock,
  Shield,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RefillRequest } from '../../types';
import { PriorityIndicator } from '../common/PriorityIndicator';
import { StatusBadge } from '../common/StatusBadge';
import { Patient360Column } from './Patient360Column';
import { RefillIntelligenceColumn } from './RefillIntelligenceColumn';
import { CaseActionsColumn } from './CaseActionsColumn';

interface RefillCaseWorkspaceProps {
  currentCase: RefillRequest;
  onClose?: () => void;
}

export const RefillCaseWorkspace: React.FC<RefillCaseWorkspaceProps> = ({ currentCase, onClose }) => {
  const { closeRefillDetail, setCurrentView } = useApp();

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      closeRefillDetail();
    }
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Top Workspace Command Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors border border-slate-200"
              title="Return to Refill Queue"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-teal-800">
                  {currentCase.id}
                </span>
                <span className="text-slate-300">·</span>
                <PriorityIndicator priority={currentCase.priority} />
                <span className="text-slate-300">·</span>
                <StatusBadge status={currentCase.status} size="sm" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
                {currentCase.medication.name} {currentCase.medication.dosage}
              </h1>
            </div>
          </div>

          {/* Quick Context Summary Badges */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Patient</span>
              <span className="font-bold text-slate-900">{currentCase.patient.firstName} {currentCase.patient.lastName}</span>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Provider</span>
              <span className="font-bold text-slate-900">Dr. {currentCase.provider.lastName}, {currentCase.provider.title.split(',')[0]}</span>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Pharmacy</span>
              <span className="font-bold text-slate-900 truncate max-w-[150px]">{currentCase.pharmacy.name}</span>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-mono">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Queue Age</span>
              <span className="font-bold text-slate-900">{currentCase.ageFormatted}</span>
            </div>
          </div>
        </div>

        {/* Operational Status Sub-Banner */}
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Operational Status:</span>
            <span className="font-bold text-rose-700 uppercase tracking-tight">
              {currentCase.status === 'WAITING FOR PROVIDER'
                ? 'BLOCKED — PROVIDER ACTION REQUIRED'
                : currentCase.status}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span>Surescripts Transaction #TX-948201</span>
            <span>·</span>
            <span>EHR Protocol Standard 2026</span>
          </div>
        </div>
      </div>

      {/* 3-Column Enterprise Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: PATIENT 360 (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Patient360Column
            patient={currentCase.patient}
            currentCase={currentCase}
          />
        </div>

        {/* CENTER COLUMN: REFILL INTELLIGENCE (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <RefillIntelligenceColumn currentCase={currentCase} />
        </div>

        {/* RIGHT COLUMN: CASE ACTIONS (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <CaseActionsColumn currentCase={currentCase} />
        </div>
      </div>
    </div>
  );
};
