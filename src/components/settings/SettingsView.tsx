import React from 'react';
import { Settings, Shield, Building, Key, Users, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const { currentOrg, currentRole, currentUser } = useApp();

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Organization & Workflow Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure electronic prescribing gateways, delegated staff protocols, and PBM connectivity
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5 text-xs">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
          <Building className="w-4 h-4 text-teal-600" />
          <span>Healthcare Organization Profile</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Organization Name</label>
            <input
              type="text"
              readOnly
              value={currentOrg.name}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Organization NPI</label>
            <input
              type="text"
              readOnly
              value={currentOrg.npiOrg}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Surescripts 2026 E-Prescribing Gateway Connected</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Environment: Synthetic Sandbox</span>
        </div>
      </div>
    </div>
  );
};
