import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  isAiAnalysis?: boolean;
}

const AI_REASONING_STEPS = [
  'Reviewing prescription and remaining fills...',
  'Checking refill history and prior interventions...',
  'Analyzing workflow routing and provider telemetry...',
  'Identifying blocker root cause...',
  'Preparing clinical and operational recommendation...',
];

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading operational workflow...',
  isAiAnalysis = false,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  useEffect(() => {
    if (!isAiAnalysis) return;
    const interval = setInterval(() => {
      setCurrentStepIdx((prev) => (prev < AI_REASONING_STEPS.length - 1 ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(interval);
  }, [isAiAnalysis]);

  if (isAiAnalysis) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4 max-w-md mx-auto my-8 text-xs">
        <div className="flex items-center gap-2.5 text-teal-800 font-bold">
          <Sparkles className="w-4 h-4 animate-spin text-teal-600" />
          <span>AI Clinical & Operational Analysis</span>
        </div>

        <div className="space-y-2">
          {AI_REASONING_STEPS.map((step, idx) => {
            const isDone = idx < currentStepIdx;
            const isCurrent = idx === currentStepIdx;
            return (
              <div
                key={step}
                className={`flex items-center gap-2 transition-all ${
                  isDone
                    ? 'text-emerald-700 font-medium'
                    : isCurrent
                    ? 'text-teal-950 font-bold animate-pulse'
                    : 'text-slate-300'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                      isCurrent
                        ? 'border-teal-600 bg-teal-50'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />}
                  </div>
                )}
                <span>{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-8 h-8 rounded-full border-2 border-teal-600 border-t-transparent animate-spin mb-3" />
      <span className="text-xs font-semibold text-slate-600">{message}</span>
    </div>
  );
};
