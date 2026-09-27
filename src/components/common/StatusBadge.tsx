import React from 'react';
import { RefillStatus, WorkflowStage, Priority } from '../../types';

interface StatusBadgeProps {
  status: RefillStatus | WorkflowStage;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  let colorStyles = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  switch (status) {
    case 'RESOLVED':
      colorStyles = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      dotColor = 'bg-emerald-500';
      break;
    case 'READY':
    case 'PHARMACY READY':
      colorStyles = 'bg-teal-50 text-teal-800 border-teal-200';
      dotColor = 'bg-teal-500';
      break;
    case 'WAITING FOR PROVIDER':
    case 'PROVIDER REVIEW':
      colorStyles = 'bg-indigo-50 text-indigo-800 border-indigo-200';
      dotColor = 'bg-indigo-500';
      break;
    case 'ACTION REQUIRED':
    case 'FOLLOW-UP REQUIRED':
    case 'WAITING FOR PHARMACY':
      colorStyles = 'bg-amber-50 text-amber-800 border-amber-200';
      dotColor = 'bg-amber-500';
      break;
    case 'BLOCKED':
    case 'INSURANCE BLOCKED':
    case 'MISSING INFORMATION':
      colorStyles = 'bg-rose-50 text-rose-800 border-rose-200';
      dotColor = 'bg-rose-500';
      break;
    case 'ANALYZING':
      colorStyles = 'bg-sky-50 text-sky-800 border-sky-200';
      dotColor = 'bg-sky-500 animate-pulse';
      break;
    case 'NEW':
      colorStyles = 'bg-blue-50 text-blue-800 border-blue-200';
      dotColor = 'bg-blue-500';
      break;
  }

  const paddingClass = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-md ${paddingClass} ${colorStyles} whitespace-nowrap`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{status}</span>
    </span>
  );
};

export const PriorityIndicator: React.FC<{ priority: Priority }> = ({ priority }) => {
  switch (priority) {
    case 'CRITICAL':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
          CRITICAL
        </span>
      );
    case 'HIGH':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          HIGH
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          MEDIUM
        </span>
      );
    case 'LOW':
    default:
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          LOW
        </span>
      );
  }
};
