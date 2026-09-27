import React from 'react';
import { AlertCircle, RotateCcw, ShieldAlert } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isPermissionError?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Encountered operational error',
  message = 'Unable to complete the requested workflow operation. Please retry or contact technical support.',
  onRetry,
  isPermissionError = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-xl border border-rose-200/80 shadow-2xs">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-2xs ${
          isPermissionError
            ? 'bg-amber-50 text-amber-700 border border-amber-200'
            : 'bg-rose-50 text-rose-700 border border-rose-200'
        }`}
      >
        {isPermissionError ? (
          <ShieldAlert className="w-6 h-6" />
        ) : (
          <AlertCircle className="w-6 h-6" />
        )}
      </div>
      <h3 className="text-sm font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-600 max-w-sm mb-4 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};
