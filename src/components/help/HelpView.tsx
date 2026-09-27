import React from 'react';
import { HelpCircle, BookOpen, ShieldCheck, Phone, ExternalLink } from 'lucide-react';

export const HelpView: React.FC = () => {
  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Refill Protocols & Support
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Standard operating procedures for managing high-risk medications, prior authorizations, and clinic turnaround targets
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <BookOpen className="w-4 h-4 text-teal-600" />
            <span>Standing Order Delegation Protocols</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Clinical staff (RN/MA) are authorized under state delegation guidelines to conduct lab compliance verification, assemble 30-day bridge orders, and route renewal scripts directly to designated prescriber inboxes.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>High-Risk Medication Safeguards</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Anticoagulants (e.g., Eliquis), insulin, and antiarrhythmics must never be abruptly halted. If obligatory lab draws are overdue, a 14-day bridge fill is mandated while scheduling phlebotomy.
          </p>
        </div>
      </div>
    </div>
  );
};
