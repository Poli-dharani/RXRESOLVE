import React from 'react';
import { Activity, ShieldCheck, CheckCircle2, Server, Cpu, Database, Bell } from 'lucide-react';

export const SystemStatusCard: React.FC = () => {
  const subsystems = [
    { name: 'Frontend', status: 'Operational', icon: Server, latency: '12ms' },
    { name: 'Workflow Engine', status: 'Operational', icon: Activity, latency: '45ms' },
    { name: 'AI Service', status: 'Operational', icon: Cpu, latency: '120ms (Deterministic fallback active)' },
    { name: 'Notification Service', status: 'Operational', icon: Bell, latency: '28ms' },
    { name: 'Mock EHR Integration', status: 'Operational', icon: Database, latency: '35ms (FHIR R4)' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">SYSTEM STATUS</h3>
        </div>
        <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
          99.98% UPTIME
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {subsystems.map((sub) => {
          const Icon = sub.icon;
          return (
            <div
              key={sub.name}
              className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <Icon className="w-4 h-4 text-slate-500" />
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {sub.status}
                </span>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-900 truncate">
                  {sub.name}
                </span>
                <span className="block text-[10px] text-slate-400 font-mono">
                  {sub.latency}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 gap-2">
        <span>Fail-safe protocol: Automatic graceful degradation to deterministic clinical rules if LLM gateway times out.</span>
        <span className="font-mono text-[10px] text-slate-400">Health Check: Heartbeat verified 2s ago</span>
      </div>
    </div>
  );
};
