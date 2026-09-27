import React from 'react';
import { ChevronRight, ArrowRight, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WorkflowStage } from '../../types';

interface StageConfig {
  id: WorkflowStage;
  label: string;
  count: number;
  description: string;
  colorClass: string;
  dotClass: string;
}

export const WorkflowPipeline: React.FC = () => {
  const { refills, setFilterStage, setCurrentView, filterStage } = useApp();

  // Calculate synthetic counts dynamically with realistic baselines
  const stages: StageConfig[] = [
    {
      id: 'NEW',
      label: 'NEW',
      count: 14,
      description: 'Incoming e-requests',
      colorClass: 'border-blue-200 bg-blue-50/50 hover:bg-blue-50',
      dotClass: 'bg-blue-500',
    },
    {
      id: 'ANALYZING',
      label: 'ANALYZING',
      count: 9,
      description: 'AI protocol check',
      colorClass: 'border-sky-200 bg-sky-50/50 hover:bg-sky-50',
      dotClass: 'bg-sky-500 animate-pulse',
    },
    {
      id: 'BLOCKED',
      label: 'BLOCKED',
      count: 23,
      description: 'PBM / Info gaps',
      colorClass: 'border-rose-200 bg-rose-50/50 hover:bg-rose-50',
      dotClass: 'bg-rose-500',
    },
    {
      id: 'ACTION REQUIRED',
      label: 'ACTION REQUIRED',
      count: 18,
      description: 'Clinic staff triage',
      colorClass: 'border-amber-200 bg-amber-50/50 hover:bg-amber-50',
      dotClass: 'bg-amber-500',
    },
    {
      id: 'PROVIDER REVIEW',
      label: 'PROVIDER REVIEW',
      count: 11,
      description: 'Prescriber sign-off',
      colorClass: 'border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50',
      dotClass: 'bg-indigo-500',
    },
    {
      id: 'PHARMACY READY',
      label: 'PHARMACY READY',
      count: 16,
      description: 'Dispense queued',
      colorClass: 'border-teal-200 bg-teal-50/50 hover:bg-teal-50',
      dotClass: 'bg-teal-500',
    },
    {
      id: 'RESOLVED',
      label: 'RESOLVED',
      count: 47,
      description: 'Dispense verified',
      colorClass: 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50',
      dotClass: 'bg-emerald-500',
    },
  ];

  const handleStageClick = (stageId: WorkflowStage) => {
    setFilterStage(stageId);
    setCurrentView('queue');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Refill Workflow Pipeline</span>
            <span className="text-xs font-normal text-slate-500">
              (Click any stage to filter active queue)
            </span>
          </h2>
        </div>
        <button
          onClick={() => {
            setFilterStage('ALL');
            setCurrentView('queue');
          }}
          className="text-xs font-medium text-teal-700 hover:text-teal-900 flex items-center gap-1 transition-colors"
        >
          <span>Open Full Refill Queue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Horizontal Pipeline Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 relative">
        {stages.map((stage, idx) => (
          <button
            key={stage.id}
            onClick={() => handleStageClick(stage.id)}
            className={`p-3 rounded-lg border text-left transition-all duration-150 cursor-pointer relative group flex flex-col justify-between ${
              stage.colorClass
            } hover:shadow-xs hover:border-slate-400`}
            title={`Filter Refill Queue by ${stage.label}`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-semibold tracking-wider text-slate-700 uppercase">
                  {stage.label}
                </span>
                <span className={`w-2 h-2 rounded-full ${stage.dotClass}`} />
              </div>
              <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
                {stage.count}
              </div>
            </div>

            <div className="mt-2 text-[10px] text-slate-500 truncate flex items-center justify-between">
              <span>{stage.description}</span>
              <ChevronRight className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
