import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const EnvironmentBadge: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase rounded-md border border-amber-300/70 bg-amber-50/90 text-amber-900 shadow-xs ${
        compact ? 'text-[10px] px-2 py-0.5' : ''
      }`}
      title="This environment is strictly running on synthetic clinical demonstration data."
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
      <span className="font-mono">DEMO ENVIRONMENT</span>
      <span className="text-amber-400">·</span>
      <span className="font-mono text-amber-800">SYNTHETIC DATA</span>
    </div>
  );
};
