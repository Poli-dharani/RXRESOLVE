import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Edit3,
  XCircle,
  FileText,
  UserCheck,
  Clock,
  ExternalLink,
  ChevronDown,
  Info,
  ShieldAlert,
  Check,
  MessageSquare,
  CornerDownRight,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  RefillRequest,
  AICopilotMessage,
  AICopilotResponseFormat,
  DecisionStatus,
} from '../../types';
import { queryCopilot, CLINICAL_GUARDRAIL_NOTICE } from '../../services';

const SUGGESTED_PROMPTS = [
  'Why is this refill blocked?',
  "Summarize this patient's relevant refill history.",
  'What information is missing?',
  'What should happen next?',
  'Draft a provider review request.',
  'Draft a patient update.',
  'Find previous refill blockers.',
  'Why is this case high priority?',
];

export const AICopilotView: React.FC = () => {
  const {
    refills,
    selectedRefill,
    openRefillDetail,
    currentRole,
    currentUser,
    approveRecommendation,
    editAndApproveRecommendation,
    rejectRecommendation,
    authorizePrescriptionRenewal,
    showToast,
  } = useApp();

  // Active case context
  const [activeCaseId, setActiveCaseId] = useState<string>(
    selectedRefill?.id || refills[0]?.id || 'RX-10482'
  );

  const activeCase = refills.find((r) => r.id === activeCaseId) || refills[0];

  // Conversation history
  const [messages, setMessages] = useState<AICopilotMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Edit modal state
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  // Reject modal state
  const [rejectingMessageId, setRejectingMessageId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState(
    'Patient scheduled for in-person appointment tomorrow'
  );

  // Clinical sign-off modal state
  const [providerSignoffModal, setProviderSignoffModal] = useState<{
    messageId: string;
    refillId: string;
    medication: string;
    dosage: string;
    patientName: string;
  } | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize with initial analysis when switching case or loading first time
  useEffect(() => {
    if (activeCase && messages.length === 0) {
      handleAutoInit(activeCase);
    }
  }, [activeCaseId]);

  const handleAutoInit = async (targetRefill: RefillRequest) => {
    setIsLoading(true);
    const initialQuery = 'Why is this refill blocked?';
    const response = await queryCopilot({
      prompt: initialQuery,
      selectedRefill: targetRefill,
      allRefills: refills,
      currentRole,
    });

    const initUserMsg: AICopilotMessage = {
      id: `msg-user-init`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      queryText: initialQuery,
      caseContextId: targetRefill.id,
    };

    const initAiMsg: AICopilotMessage = {
      id: `msg-ai-init`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      structuredResponse: response,
      caseContextId: targetRefill.id,
      decisionStatus: 'PENDING',
    };

    setMessages([initUserMsg, initAiMsg]);
    setIsLoading(false);
  };

  const handleSendPrompt = async (promptText: string) => {
    if (!promptText.trim() || isLoading) return;

    const userMsg: AICopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      queryText: promptText,
      caseContextId: activeCase.id,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    setTimeout(async () => {
      const response = await queryCopilot({
        prompt: promptText,
        selectedRefill: activeCase,
        allRefills: refills,
        currentRole,
      });

      const aiMsg: AICopilotMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structuredResponse: response,
        caseContextId: activeCase.id,
        decisionStatus: 'PENDING',
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false);
    }, 450);
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Human-in-the-loop: Approve Action
  const handleApprove = async (msg: AICopilotMessage) => {
    if (!msg.structuredResponse) return;
    const rec = msg.structuredResponse.recommendedAction;

    // Check if clinical authorization
    if (rec.isClinicalAuthorization || rec.actionType === 'AUTHORIZE_RENEWAL') {
      const isProvider = currentRole === 'Provider' || currentRole === 'Physician / Prescriber';
      if (!isProvider) {
        showToast(
          'Clinical Safeguard: Only licensed Providers can authorize prescriptions. Please switch to Provider role in top bar.'
        );
        return;
      }
      setProviderSignoffModal({
        messageId: msg.id,
        refillId: activeCase.id,
        medication: activeCase.medication.name,
        dosage: activeCase.medication.dosage,
        patientName: `${activeCase.patient.firstName} ${activeCase.patient.lastName}`,
      });
      return;
    }

    const success = await approveRecommendation(activeCase.id, rec);
    if (success) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msg.id
            ? {
                ...m,
                decisionStatus: 'APPROVED',
                decisionActor: currentUser.name,
                decisionTimestamp: new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
              }
            : m
        )
      );
    }
  };

  // Provider clinical sign-off confirmation
  const handleConfirmProviderSignoff = async () => {
    if (!providerSignoffModal) return;
    const result = await authorizePrescriptionRenewal(providerSignoffModal.refillId, {
      refillsCount: 3,
      daysSupply: 90,
    });

    if (result.success) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === providerSignoffModal.messageId
            ? {
                ...m,
                decisionStatus: 'APPROVED',
                decisionActor: `${currentUser.name} (Authorized Prescriber)`,
                decisionTimestamp: new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
              }
            : m
        )
      );
    }
    setProviderSignoffModal(null);
  };

  // Human-in-the-loop: Edit Action
  const handleStartEdit = (msg: AICopilotMessage) => {
    if (!msg.structuredResponse) return;
    setEditingMessageId(msg.id);
    setEditingText(
      msg.structuredResponse.recommendedAction.draftMessage ||
        msg.structuredResponse.recommendedAction.description
    );
  };

  const handleSaveEditAndApprove = async () => {
    const targetMsg = messages.find((m) => m.id === editingMessageId);
    if (!targetMsg?.structuredResponse) return;

    const rec = targetMsg.structuredResponse.recommendedAction;
    const success = await editAndApproveRecommendation(activeCase.id, rec, editingText);

    if (success) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === editingMessageId
            ? {
                ...m,
                decisionStatus: 'EDITED',
                decisionNote: editingText,
                decisionActor: currentUser.name,
                decisionTimestamp: new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
              }
            : m
        )
      );
    }
    setEditingMessageId(null);
  };

  // Human-in-the-loop: Reject Action
  const handleOpenRejectModal = (msgId: string) => {
    setRejectingMessageId(msgId);
  };

  const handleConfirmReject = async () => {
    if (!rejectingMessageId) return;
    await rejectRecommendation(activeCase.id, rejectReason);

    setMessages((prev) =>
      prev.map((m) =>
        m.id === rejectingMessageId
          ? {
              ...m,
              decisionStatus: 'REJECTED',
              decisionNote: rejectReason,
              decisionActor: currentUser.name,
              decisionTimestamp: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
            }
          : m
      )
    );
    setRejectingMessageId(null);
  };

  const handleResetConversation = () => {
    setMessages([]);
    handleAutoInit(activeCase);
  };

  return (
    <div className="space-y-5 pb-16 max-w-5xl mx-auto">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shadow-2xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  RXRESOLVE AI COPILOT
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  "Understand the case. Recommend the next action. Keep humans in control."
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-teal-50 text-teal-800 border border-teal-200">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse" />
              Active Role: {currentRole}
            </span>
            <button
              onClick={handleResetConversation}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              title="Reset conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* 2. Active Case Context Selector */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 p-3 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
              Active Case Context:
            </span>
            <div className="relative">
              <select
                value={activeCaseId}
                onChange={(e) => {
                  setActiveCaseId(e.target.value);
                  const newCase = refills.find((r) => r.id === e.target.value);
                  if (newCase) {
                    setMessages([]);
                    handleAutoInit(newCase);
                  }
                }}
                className="text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 pr-8 appearance-none focus:outline-hidden focus:ring-1 focus:ring-teal-500 cursor-pointer shadow-2xs"
              >
                {refills.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.id} — {r.patient.firstName} {r.patient.lastName} ({r.medication.name}{' '}
                    {r.medication.dosage}) · {r.status}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => openRefillDetail(activeCase)}
              className="font-medium text-teal-700 hover:text-teal-900 flex items-center gap-1 bg-white px-2.5 py-1 rounded border border-slate-200 shadow-2xs"
            >
              Inspect 360 Workspace
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Clinical Safeguard Notice */}
      <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-200 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
        <div className="text-xs text-indigo-950 space-y-0.5">
          <p className="font-semibold text-indigo-900">
            Clinical Safety Guardrail Enforced:
          </p>
          <p className="text-slate-600 leading-relaxed">
            AI is strictly prohibited from prescribing, changing dosages, substituting medications,
            or authorizing treatment. All advisory recommendations require human healthcare
            provider verification.
          </p>
        </div>
      </div>

      {/* 4. Suggested Prompts Chips */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Suggested Clinical & Operational Prompts:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendPrompt(prompt)}
              disabled={isLoading}
              className="text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors shadow-2xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <CornerDownRight className="w-3 h-3 text-teal-600 shrink-0" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Chat History Feed */}
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-2">
            {/* User message */}
            {msg.sender === 'user' ? (
              <div className="flex items-start justify-end gap-3">
                <div className="bg-slate-900 text-white rounded-xl rounded-tr-xs px-4 py-2.5 max-w-xl shadow-xs">
                  <p className="text-xs font-medium leading-relaxed">{msg.queryText}</p>
                  <span className="text-[10px] text-slate-400 block mt-1 text-right">
                    {msg.timestamp} · Context: {msg.caseContextId}
                  </span>
                </div>
              </div>
            ) : (
              /* Assistant message formatted strictly in the standard schema */
              msg.structuredResponse && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                  {/* Message Header */}
                  <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-teal-100/70 text-teal-800 flex items-center justify-center font-bold text-xs">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        RXRESOLVE Intelligence Diagnostic
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="font-mono text-xs text-slate-500 font-semibold">
                        Case {msg.caseContextId}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                        {msg.structuredResponse.confidence}% Confidence
                      </span>
                      <span className="text-[11px] text-slate-400">{msg.timestamp}</span>
                    </div>
                  </div>

                  {/* Standard Schema Body */}
                  <div className="p-5 space-y-4 text-xs">
                    {/* SUMMARY */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        SUMMARY
                      </span>
                      <p className="text-sm font-semibold text-slate-900 leading-snug">
                        {msg.structuredResponse.summary}
                      </p>
                    </div>

                    {/* BLOCKER */}
                    <div className="p-3 rounded-lg bg-rose-50/60 border border-rose-200 text-rose-950">
                      <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block mb-0.5">
                        BLOCKER
                      </span>
                      <p className="font-medium text-xs text-rose-900">
                        {msg.structuredResponse.blocker}
                      </p>
                    </div>

                    {/* EVIDENCE */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        EVIDENCE
                      </span>
                      <ul className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
                        {msg.structuredResponse.evidence.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-slate-700 leading-relaxed"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* RECOMMENDED ACTION */}
                    <div className="p-3.5 rounded-lg bg-teal-50/50 border border-teal-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
                          RECOMMENDED ACTION
                        </span>
                        <span className="text-[10px] font-semibold text-teal-700 bg-teal-100/60 px-2 py-0.5 rounded">
                          {msg.structuredResponse.recommendedAction.title}
                        </span>
                      </div>
                      <p className="text-xs text-teal-950 font-medium mb-2">
                        {msg.structuredResponse.recommendedAction.description}
                      </p>

                      {/* Drafted message preview if available */}
                      {msg.structuredResponse.recommendedAction.draftMessage && (
                        <div className="p-2.5 rounded bg-white border border-teal-200 font-mono text-[11px] text-slate-700 whitespace-pre-line">
                          {msg.structuredResponse.recommendedAction.draftMessage}
                        </div>
                      )}
                    </div>

                    {/* HUMAN APPROVAL & DECISION CONTROLS */}
                    <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          HUMAN APPROVAL:
                        </span>
                        <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {msg.structuredResponse.humanApproval}
                        </span>
                      </div>

                      {/* Decision State or Buttons */}
                      {msg.decisionStatus === 'PENDING' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApprove(msg)}
                            className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            APPROVE
                          </button>

                          <button
                            onClick={() => handleStartEdit(msg)}
                            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs rounded-lg border border-slate-200 shadow-2xs transition-colors flex items-center gap-1.5"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                            EDIT
                          </button>

                          <button
                            onClick={() => handleOpenRejectModal(msg.id)}
                            className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 font-medium text-xs rounded-lg border border-rose-200 shadow-2xs transition-colors flex items-center gap-1.5"
                          >
                            <XCircle className="w-3.5 h-3.5 text-rose-500" />
                            REJECT
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {msg.decisionStatus === 'APPROVED' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 font-semibold text-xs">
                              <CheckCircle2 className="w-4 h-4 text-teal-600" />
                              Approved by {msg.decisionActor || currentUser.name} (
                              {msg.decisionTimestamp})
                            </span>
                          )}
                          {msg.decisionStatus === 'EDITED' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 font-semibold text-xs">
                              <Edit3 className="w-4 h-4 text-indigo-600" />
                              Customized & Approved by {msg.decisionActor || currentUser.name}
                            </span>
                          )}
                          {msg.decisionStatus === 'REJECTED' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 font-semibold text-xs">
                              <XCircle className="w-4 h-4 text-rose-600" />
                              Overruled by clinician: {msg.decisionNote}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        ))}

        {isLoading && (
          <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-center gap-3 text-xs text-slate-500 shadow-2xs animate-pulse">
            <Sparkles className="w-4 h-4 text-teal-600 animate-spin" />
            <span>Analyzing EHR chart, pharmacy claims, and clinical guidelines...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* 6. Prompt Input Form */}
      <div className="sticky bottom-4 z-20 bg-white p-3 rounded-xl border border-slate-200 shadow-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendPrompt(inputValue);
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Copilot about blockers, missing labs, prior auth, or draft messages..."
              className="w-full text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>Ask Copilot</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Modal: Edit AI Recommendation Before Approval */}
      {editingMessageId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Edit Clinical/Operational Recommendation
                </h3>
              </div>
              <button
                onClick={() => setEditingMessageId(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Customize the drafted instruction, provider message, or patient SMS text before
              executing into the EHR workflow.
            </p>

            <textarea
              rows={6}
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingMessageId(null)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditAndApprove}
                className="px-4 py-1.5 text-xs text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold shadow-2xs"
              >
                Save & Approve Action
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Reject AI Recommendation */}
      {rejectingMessageId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-rose-600">
                <XCircle className="w-4 h-4" />
                <h3 className="font-bold text-sm text-slate-900">
                  Clinician Override / Rejection
                </h3>
              </div>
              <button
                onClick={() => setRejectingMessageId(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Specify the clinical or operational reason for rejecting this AI recommendation. This
              will be permanently recorded in the HIPAA audit history.
            </p>

            <div className="space-y-2">
              {[
                'Patient scheduled for in-person appointment tomorrow',
                'Medication under specialist evaluation (cardiology/endo)',
                'Prior authorization already handled via external portal',
                'Clinician ordered alternative lab panel',
                'Patient discontinued therapy per office visit note',
              ].map((reason) => (
                <label
                  key={reason}
                  className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-xs text-slate-700 cursor-pointer border border-transparent hover:border-slate-200"
                >
                  <input
                    type="radio"
                    name="rejectReason"
                    checked={rejectReason === reason}
                    onChange={() => setRejectReason(reason)}
                    className="text-rose-600 focus:ring-rose-500"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingMessageId(null)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-1.5 text-xs text-white bg-rose-600 hover:bg-rose-700 rounded-lg font-semibold shadow-2xs"
              >
                Confirm Rejection & Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Provider Clinical Electronic Sign-Off */}
      {providerSignoffModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-teal-800">
                <ShieldCheck className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Electronic Prescription Renewal Sign-Off
                </h3>
              </div>
              <button
                onClick={() => setProviderSignoffModal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-teal-50/50 border border-teal-200 rounded-lg space-y-1 text-xs">
              <span className="font-bold text-teal-900 block uppercase text-[10px]">
                Prescription Renewal Order
              </span>
              <p className="font-semibold text-slate-900">
                {providerSignoffModal.medication} {providerSignoffModal.dosage}
              </p>
              <p className="text-slate-600">
                Patient: {providerSignoffModal.patientName} (Refill #{providerSignoffModal.refillId})
              </p>
              <p className="text-slate-600">
                Authorized Fills: 90 days supply × 3 refills (1-Year Maintenance)
              </p>
            </div>

            <div className="text-xs text-slate-600 space-y-2">
              <p>
                <strong>Attestation:</strong> I attest as a licensed healthcare provider (NPI:
                1982736410) that I have evaluated the clinical chart and telemetry, and authorize
                the renewal of this medication.
              </p>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded font-mono text-[11px] text-slate-500">
                Digital Certificate: DEA-EPCS-SHA256-VERIFIED
                <br />
                Prescriber: {currentUser.name}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setProviderSignoffModal(null)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmProviderSignoff}
                className="px-4 py-2 text-xs text-white bg-teal-600 hover:bg-teal-700 rounded-lg font-semibold shadow-2xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Sign & Transmit to Pharmacy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
