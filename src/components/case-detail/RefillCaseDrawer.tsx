import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  UserCheck,
  ArrowRight,
  ShieldCheck,
  Send,
  MessageSquare,
  Clock,
  Calendar,
  Building,
  User,
  Pill,
  FileText,
  Sparkles,
  CheckSquare,
  History,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PriorityIndicator } from '../common/PriorityIndicator';
import { StatusBadge } from '../common/StatusBadge';
import { taskService, messageService } from '../../services';

export const RefillCaseDrawer: React.FC = () => {
  const {
    selectedRefill,
    closeRefillDetail,
    currentUser,
    resolveRefill,
    updateRefillStage,
    viewPatient360,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'workflow' | 'tasks' | 'messages' | 'audit'>('workflow');
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedRefill) return null;

  const handleResolve = async () => {
    setIsSubmitting(true);
    await resolveRefill(selectedRefill.id);
    setIsSubmitting(false);
  };

  const handleAdvance = async () => {
    setIsSubmitting(true);
    let nextStage = selectedRefill.workflowStage;
    let nextStatus = selectedRefill.status;

    if (selectedRefill.workflowStage === 'BLOCKED') {
      nextStage = 'ACTION REQUIRED';
      nextStatus = 'WAITING FOR PROVIDER';
    } else if (selectedRefill.workflowStage === 'ACTION REQUIRED') {
      nextStage = 'PROVIDER REVIEW';
      nextStatus = 'WAITING FOR PROVIDER';
    } else if (selectedRefill.workflowStage === 'PROVIDER REVIEW') {
      nextStage = 'PHARMACY READY';
      nextStatus = 'READY';
    } else if (selectedRefill.workflowStage === 'PHARMACY READY') {
      nextStage = 'RESOLVED';
      nextStatus = 'RESOLVED';
    }

    await updateRefillStage(selectedRefill.id, nextStage, nextStatus);
    setIsSubmitting(false);
  };

  const handleToggleTask = async (taskId: string) => {
    await taskService.toggleTaskCompleted(selectedRefill.id, taskId, currentUser.name);
    // force re-render by cloning selectedRefill
    const task = selectedRefill.tasks.find((t) => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      task.completedAt = task.completed ? new Date().toISOString() : undefined;
      task.completedBy = task.completed ? currentUser.name : undefined;
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await messageService.sendMessage(
      selectedRefill.id,
      newMessage.trim(),
      currentUser.name,
      currentUser.role,
      currentUser.organization,
      false
    );
    setNewMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-4xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 border-l border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 bg-white flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-teal-800">
                  {selectedRefill.id}
                </span>
                <span className="text-slate-300">·</span>
                <PriorityIndicator priority={selectedRefill.priority} />
                <span className="text-slate-300">·</span>
                <StatusBadge status={selectedRefill.status} size="sm" />
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                {selectedRefill.medication.name} {selectedRefill.medication.dosage}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => viewPatient360(selectedRefill.patientId)}
              className="px-3 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors"
            >
              Open Patient 360
            </button>
            <button
              onClick={closeRefillDetail}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Patient & Pharmacy Metadata Ribbon */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Patient
            </span>
            <span className="font-semibold text-slate-900">
              {selectedRefill.patient.firstName} {selectedRefill.patient.lastName}
            </span>
            <span className="text-slate-500 block text-[11px]">
              {selectedRefill.patient.mrn} · DOB {selectedRefill.patient.dateOfBirth}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Prescriber
            </span>
            <span className="font-semibold text-slate-900">
              Dr. {selectedRefill.provider.firstName} {selectedRefill.provider.lastName}
            </span>
            <span className="text-slate-500 block text-[11px]">
              {selectedRefill.provider.specialty}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Dispensing Pharmacy
            </span>
            <span className="font-semibold text-slate-900 truncate block">
              {selectedRefill.pharmacy.name}
            </span>
            <span className="text-slate-500 block text-[11px] truncate">
              {selectedRefill.pharmacy.phone}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Age & Owner
            </span>
            <span className="font-mono font-semibold text-slate-900">
              {selectedRefill.ageFormatted}
            </span>
            <span className="text-slate-500 block text-[11px]">
              Assigned: {selectedRefill.owner}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('workflow')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'workflow'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Workflow & Intelligence (6 Answers)</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'tasks'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Tasks ({selectedRefill.tasks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'messages'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Pharmacy Communications ({selectedRefill.messages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'audit'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail</span>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {activeTab === 'workflow' && (
            <div className="space-y-6">
              {/* THE 6 CORE QUESTIONS GRID */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    <span>The 6 Operational Refill Questions</span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    RXRESOLVE Standard Decision Architecture
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Q1: WHAT IS HAPPENING? */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-[10px]">
                        1
                      </span>
                      <span>WHAT IS HAPPENING?</span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed font-medium">
                      {selectedRefill.whatIsHappening}
                    </p>
                  </div>

                  {/* Q2: WHAT IS BLOCKING THE REFILL? */}
                  <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs bg-rose-50/20">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 uppercase tracking-wider mb-2">
                      <span className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-rose-800 font-bold text-[10px]">
                        2
                      </span>
                      <span>WHAT IS BLOCKING THE REFILL?</span>
                    </div>
                    <p className="text-xs text-rose-900 leading-relaxed font-semibold">
                      {selectedRefill.whatIsBlocking}
                    </p>
                  </div>

                  {/* Q3: WHAT INFORMATION IS MISSING? */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-[10px]">
                        3
                      </span>
                      <span>WHAT INFORMATION IS MISSING?</span>
                    </div>
                    {selectedRefill.whatInformationIsMissing.length === 0 ? (
                      <p className="text-xs text-emerald-700 font-medium">
                        ✓ All necessary clinical information is present.
                      </p>
                    ) : (
                      <ul className="space-y-1.5">
                        {selectedRefill.whatInformationIsMissing.map((item, idx) => (
                          <li key={idx} className="text-xs text-slate-800 flex items-start gap-1.5">
                            <span className="text-amber-500 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Q4: WHO NEEDS TO ACT? */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-[10px]">
                        4
                      </span>
                      <span>WHO NEEDS TO ACT?</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                      <p className="text-xs text-slate-900 font-semibold">
                        {selectedRefill.whoNeedsToAct}
                      </p>
                    </div>
                  </div>

                  {/* Q5: WHAT SHOULD HAPPEN NEXT? */}
                  <div className="bg-white p-4 rounded-xl border border-teal-200 shadow-xs bg-teal-50/20">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-2">
                      <span className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 font-bold text-[10px]">
                        5
                      </span>
                      <span>WHAT SHOULD HAPPEN NEXT?</span>
                    </div>
                    <p className="text-xs text-teal-900 leading-relaxed font-semibold">
                      {selectedRefill.whatShouldHappenNext}
                    </p>
                  </div>

                  {/* Q6: DID THE ACTION ACTUALLY HAPPEN? */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-[10px]">
                          6
                        </span>
                        <span>DID THE ACTION ACTUALLY HAPPEN?</span>
                      </div>
                      <span
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                          selectedRefill.didActionActuallyHappen.status === 'VERIFIED_WITH_PHARMACY'
                            ? 'bg-emerald-100 text-emerald-800'
                            : selectedRefill.didActionActuallyHappen.status === 'COMPLETED'
                            ? 'bg-teal-100 text-teal-800'
                            : selectedRefill.didActionActuallyHappen.status === 'IN_PROGRESS'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {selectedRefill.didActionActuallyHappen.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {selectedRefill.didActionActuallyHappen.details}
                    </p>
                    {selectedRefill.didActionActuallyHappen.verifiedTimestamp && (
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                        Verified at: {selectedRefill.didActionActuallyHappen.verifiedTimestamp}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* AI Recommendation Banner */}
              <div className="bg-white p-5 rounded-xl border border-teal-200 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      AI Clinical Advisory Recommendation
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {selectedRefill.aiRecommendation.confidenceScore}% Confidence
                    </span>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="text-xs text-slate-900 font-semibold">
                    Suggested Action: {selectedRefill.aiRecommendation.suggestedAction}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedRefill.aiRecommendation.clinicalRationale}
                  </p>
                  {selectedRefill.aiRecommendation.alternativeOptions && (
                    <div className="mt-2 text-xs text-slate-500">
                      <span className="font-medium text-slate-700">Alternative Clinical Paths: </span>
                      {selectedRefill.aiRecommendation.alternativeOptions.join(' · ')}
                    </div>
                  )}
                </div>
              </div>

              {/* Workflow Timeline Progress */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>Case Event Progression</span>
                </h4>

                <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {selectedRefill.workflowTimeline.map((ev, idx) => (
                    <div key={ev.id} className="relative pl-7">
                      <span className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-teal-500 ring-4 ring-white" />
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900">{ev.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{ev.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{ev.description}</p>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Actor: {ev.actor}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Assigned Clinical & Operational Tasks
                </h3>
              </div>

              <div className="space-y-2">
                {selectedRefill.tasks.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
                    No open tasks for this case
                  </div>
                ) : (
                  selectedRefill.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-start gap-3"
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleTask(task.id)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-semibold ${
                              task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                            }`}
                          >
                            {task.title}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Due: {task.dueDate}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{task.description}</p>
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
                          <span>Assigned to: {task.assignedTo}</span>
                          <span>·</span>
                          <span>Role: {task.assignedRole}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-4 flex flex-col h-[520px]">
              <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-white rounded-xl border border-slate-200">
                {selectedRefill.messages.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No messages recorded yet
                  </div>
                ) : (
                  selectedRefill.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-lg border text-xs ${
                        m.isPharmacyStaff
                          ? 'bg-amber-50/50 border-amber-200 text-slate-800'
                          : 'bg-teal-50/50 border-teal-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-900">
                          {m.senderName} ({m.senderRole})
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {m.timestamp}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{m.content}</p>
                      <div className="mt-1 text-[10px] text-slate-400">
                        {m.senderOrg} · via {m.channel}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input Form */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a clinical note or response to pharmacy..."
                  className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-teal-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                HIPAA & SOC 2 Verifiable Audit Log
              </h3>
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 text-xs">
                {selectedRefill.auditHistory.map((item) => (
                  <div key={item.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{item.action}</span>
                      <span className="text-[10px] font-mono text-slate-400">{item.timestamp}</span>
                    </div>
                    <p className="text-slate-600 mt-0.5">{item.details}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                      <span>Actor: {item.actorName} ({item.actorRole})</span>
                      <span>·</span>
                      <span>IP: {item.ipAddress}</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-semibold">{item.outcome}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Action Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Current Stage:</span>
            <span className="font-semibold text-slate-900">{selectedRefill.workflowStage}</span>
          </div>

          <div className="flex items-center gap-2">
            {selectedRefill.status !== 'RESOLVED' && (
              <>
                <button
                  disabled={isSubmitting}
                  onClick={handleAdvance}
                  className="px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>Advance Stage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  disabled={isSubmitting}
                  onClick={handleResolve}
                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Resolved & Closed</span>
                </button>
              </>
            )}

            {selectedRefill.status === 'RESOLVED' && (
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Refill Workflow Verified & Completed</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
