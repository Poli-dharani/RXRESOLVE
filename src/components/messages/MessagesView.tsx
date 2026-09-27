import React, { useState } from 'react';
import {
  MessageSquare,
  Building,
  Send,
  User,
  Clock,
  ArrowRight,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MessagesView: React.FC = () => {
  const { refills, currentUser, openRefillDetail } = useApp();

  const [selectedCaseId, setSelectedCaseId] = useState<string>(refills[0]?.id || '');
  const [newMsg, setNewMsg] = useState('');

  const currentCase = refills.find((r) => r.id === selectedCaseId) || refills[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim() || !currentCase) return;

    currentCase.messages.push({
      id: `msg-${Date.now()}`,
      refillId: currentCase.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderOrg: currentUser.organization,
      timestamp: 'Just now',
      content: newMsg.trim(),
      isPharmacyStaff: false,
      channel: 'Direct EHR Link',
    });
    setNewMsg('');
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Pharmacy & Practice Secure Messaging
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Direct clinical clarification threads between physician offices and retail / health-system pharmacies
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-lg">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Surescripts Certified Direct Messaging</span>
        </div>
      </div>

      {/* Two Column Messaging Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Refill Case Threads List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[600px]">
          <div className="p-3.5 border-b border-slate-100 bg-slate-50/75">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Active Case Threads ({refills.filter((r) => r.messages.length > 0).length})
            </span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {refills
              .filter((r) => r.messages.length > 0)
              .map((r) => {
                const isSelected = r.id === selectedCaseId;
                const lastMsg = r.messages[r.messages.length - 1];
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedCaseId(r.id)}
                    className={`p-3.5 cursor-pointer transition-colors ${
                      isSelected ? 'bg-teal-50/60 border-l-4 border-l-teal-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-teal-800">
                        {r.id}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {lastMsg ? lastMsg.timestamp : ''}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-slate-900 mt-1 truncate">
                      {r.patient.firstName} {r.patient.lastName} · {r.medication.name}
                    </div>

                    <div className="text-[11px] text-slate-500 mt-0.5 truncate flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{r.pharmacy.name}</span>
                    </div>

                    {lastMsg && (
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 bg-white/70 p-1.5 rounded border border-slate-200/60">
                        {lastMsg.content}
                      </p>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* Right: Message Thread & Sender */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-[600px] overflow-hidden">
          {currentCase ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-teal-800">
                      {currentCase.id}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs font-bold text-slate-900">
                      {currentCase.patient.firstName} {currentCase.patient.lastName}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-600 font-medium">
                      {currentCase.medication.name} {currentCase.medication.dosage}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                    <span>Pharmacy: {currentCase.pharmacy.name}</span>
                    <span>·</span>
                    <span>PIC: {currentCase.pharmacy.pharmacistInCharge}</span>
                  </div>
                </div>

                <button
                  onClick={() => openRefillDetail(currentCase)}
                  className="px-3 py-1.5 text-xs font-semibold text-teal-800 bg-white hover:bg-teal-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1"
                >
                  <span>Open Full Case</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Message Bubbles */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/30">
                {currentCase.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-xl p-3.5 rounded-xl border text-xs shadow-2xs ${
                      m.isPharmacyStaff
                        ? 'bg-amber-50/70 border-amber-200 mr-auto text-slate-900'
                        : 'bg-white border-slate-200 ml-auto text-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <span className="font-bold text-slate-900">
                        {m.senderName} ({m.senderRole})
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {m.timestamp}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{m.content}</p>
                    <div className="text-[10px] text-slate-400 mt-1.5 flex items-center justify-between">
                      <span>{m.senderOrg}</span>
                      <span>Channel: {m.channel}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Composer */}
              <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex gap-2">
                <input
                  type="text"
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  placeholder={`Reply to ${currentCase.pharmacy.name}...`}
                  className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-teal-500 focus:bg-white text-slate-900"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </form>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400 m-auto">
              Select a thread to view communication history
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
