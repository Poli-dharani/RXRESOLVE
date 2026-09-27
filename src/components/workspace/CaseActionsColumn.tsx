import React, { useState } from 'react';
import {
  UserCheck,
  Send,
  Building,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldAlert,
  ArrowRight,
  Clock,
  Sparkles,
  RefreshCw,
  X,
} from 'lucide-react';
import { RefillRequest, UserRole } from '../../types';
import { useApp } from '../../context/AppContext';

interface CaseActionsColumnProps {
  currentCase: RefillRequest;
}

export const CaseActionsColumn: React.FC<CaseActionsColumnProps> = ({ currentCase }) => {
  const {
    requestProviderReview,
    sendPatientUpdate,
    contactPharmacy,
    assignStaff,
    addCaseNote,
    escalateCase,
    resolveRefill,
    authorizePrescriptionRenewal,
    currentRole,
    currentUser,
    providers,
    showToast,
  } = useApp();

  const isProvider = currentRole === 'Provider' || currentRole === 'Physician / Prescriber';

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [providerNote, setProviderNote] = useState('');
  const [patientSms, setPatientSms] = useState('Your prescription renewal has been requested from your provider. We will notify you once ready for pickup.');
  const [pharmacyInquiry, setPharmacyInquiry] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('Elena Rostova, RN');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Clinical Staff / MA');
  const [caseNote, setCaseNote] = useState('');
  const [escalateReason, setEscalateReason] = useState('Patient is out of medication today; elevated clinical risk.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Error simulation state
  const [simulatedError, setSimulatedError] = useState<string | null>(null);

  const handleRequestReview = async () => {
    setIsSubmitting(true);
    await requestProviderReview(currentCase.id, providerNote);
    setIsSubmitting(false);
    setActiveModal(null);
  };

  const handleSendPatientUpdate = async () => {
    if (!patientSms.trim()) return;
    setIsSubmitting(true);
    await sendPatientUpdate(currentCase.id, patientSms.trim());
    setIsSubmitting(false);
    setActiveModal(null);
  };

  const handleContactPharmacy = async () => {
    if (!pharmacyInquiry.trim()) return;
    setIsSubmitting(true);
    await contactPharmacy(currentCase.id, pharmacyInquiry.trim());
    setIsSubmitting(false);
    setActiveModal(null);
  };

  const handleAssignStaff = async () => {
    setIsSubmitting(true);
    await assignStaff(currentCase.id, selectedStaff, selectedRole);
    setIsSubmitting(false);
    setActiveModal(null);
  };

  const handleAddNote = async () => {
    if (!caseNote.trim()) return;
    setIsSubmitting(true);
    await addCaseNote(currentCase.id, caseNote.trim());
    setIsSubmitting(false);
    setCaseNote('');
    setActiveModal(null);
  };

  const handleEscalate = async () => {
    setIsSubmitting(true);
    await escalateCase(currentCase.id, escalateReason);
    setIsSubmitting(false);
    setActiveModal(null);
  };

  const handleResolve = async () => {
    setIsSubmitting(true);
    await resolveRefill(currentCase.id);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-4">
      {/* Primary Actions Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            CASE ACTIONS
          </span>
          <span className="text-[11px] font-mono text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            Active Workflow
          </span>
        </div>

        <p className="text-xs text-slate-500">
          Execute operational and clinical interventions with real-time audit logging.
        </p>

        {/* Action Buttons List */}
        <div className="space-y-2">
          {/* Action 0: Physician Electronic Sign-Off (Role-Enforced) */}
          {currentCase.status !== 'RESOLVED' && (
            <button
              onClick={() => {
                if (isProvider) {
                  setActiveModal('physician_signoff');
                } else {
                  showToast(
                    'Clinical Safeguard: Only licensed Prescribers/Providers can authorize prescription renewals. Switch role in TopBar to Provider.'
                  );
                }
              }}
              className={`w-full text-left p-3 rounded-lg border font-semibold text-xs flex items-center justify-between group transition-all cursor-pointer ${
                isProvider
                  ? 'border-teal-300 bg-teal-500/10 hover:bg-teal-500/20 text-teal-950'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                    isProvider ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="block font-bold">Authorize & Sign Renewal</span>
                    {isProvider && (
                      <span className="text-[9px] bg-teal-600 text-white px-1.5 py-0.2 rounded font-bold">
                        MD Sign-off
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-normal text-slate-500">
                    {isProvider
                      ? 'Electronic DEA/NPI prescription renewal'
                      : 'Requires Physician / Prescriber role'}
                  </span>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-800 group-hover:translate-x-0.5 transition-all" />
            </button>
          )}

          {/* Action 1: Request Provider Review */}
          <button
            onClick={() => setActiveModal('provider_review')}
            className="w-full text-left p-3 rounded-lg border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-950 font-semibold text-xs flex items-center justify-between group transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="block font-bold">Request Provider Review</span>
                <span className="text-[10px] font-normal text-indigo-800/80">
                  Routes to Dr. {currentCase.provider.lastName}
                </span>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-800 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Action 2: Send Patient Update */}
          <button
            onClick={() => setActiveModal('patient_update')}
            className="w-full text-left p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 font-semibold text-xs flex items-center justify-between group transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-teal-50 text-teal-800 flex items-center justify-center shrink-0">
                <Send className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="block font-bold">Send Patient Update</span>
                <span className="text-[10px] font-normal text-slate-500">
                  Automated SMS & Portal push
                </span>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-800 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Action 3: Contact Pharmacy */}
          <button
            onClick={() => setActiveModal('contact_pharmacy')}
            className="w-full text-left p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 font-semibold text-xs flex items-center justify-between group transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                <Building className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="block font-bold">Contact Pharmacy</span>
                <span className="text-[10px] font-normal text-slate-500">
                  Inquire with {currentCase.pharmacy.name}
                </span>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-800 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Action 4: Assign Staff */}
          <button
            onClick={() => setActiveModal('assign_staff')}
            className="w-full text-left p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 font-semibold text-xs flex items-center justify-between group transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-sky-50 text-sky-800 flex items-center justify-center shrink-0">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="block font-bold">Assign Staff</span>
                <span className="text-[10px] font-normal text-slate-500">
                  Current owner: {currentCase.owner}
                </span>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-800 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Action 5: Add Note */}
          <button
            onClick={() => setActiveModal('add_note')}
            className="w-full text-left p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 font-semibold text-xs flex items-center justify-between group transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="block font-bold">Add Note</span>
                <span className="text-[10px] font-normal text-slate-500">
                  Append internal clinical memo
                </span>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-800 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Action 6: Escalate */}
          <button
            onClick={() => setActiveModal('escalate')}
            className="w-full text-left p-3 rounded-lg border border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-amber-950 font-semibold text-xs flex items-center justify-between group transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="block font-bold">Escalate</span>
                <span className="text-[10px] font-normal text-amber-800/80">
                  Elevate priority to CRITICAL
                </span>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:text-amber-800 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Action 7: Resolve */}
          <button
            disabled={isSubmitting || currentCase.status === 'RESOLVED'}
            onClick={handleResolve}
            className={`w-full text-left p-3 rounded-lg border font-semibold text-xs flex items-center justify-between transition-colors ${
              currentCase.status === 'RESOLVED'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 opacity-80'
                : 'border-emerald-300 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                  currentCase.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-white/20 text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="block font-bold">
                  {currentCase.status === 'RESOLVED' ? 'Refill Case Resolved' : 'Mark Resolved'}
                </span>
                <span className="text-[10px] opacity-90">
                  {currentCase.status === 'RESOLVED' ? 'Verified with pharmacy' : 'Close loop and log audit'}
                </span>
              </div>
            </div>
            {currentCase.status !== 'RESOLVED' && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Edge Case / Error Simulator (Requirement 16) */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Diagnostic Anomaly Testing
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Stage 2 Validation</span>
        </div>

        <p className="text-[11px] text-slate-500">
          Simulate clinical exception handling and ingest integrity checks:
        </p>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() =>
              setSimulatedError(
                'Missing Patient Information: PBM flagged missing member suffix or secondary policy verification.'
              )
            }
            className="p-1.5 text-left text-[10px] rounded bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 truncate"
          >
            Missing Info
          </button>
          <button
            onClick={() =>
              setSimulatedError(
                'Missing Prescription: No matching electronic master RX record found in Surescripts ledger.'
              )
            }
            className="p-1.5 text-left text-[10px] rounded bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 truncate"
          >
            Missing Script
          </button>
          <button
            onClick={() =>
              setSimulatedError(
                'Duplicate Request Intercept: Retail pharmacy submitted duplicate e-refill within 48h window.'
              )
            }
            className="p-1.5 text-left text-[10px] rounded bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 truncate"
          >
            Duplicate Request
          </button>
          <button
            onClick={() =>
              setSimulatedError(
                'Conflicting Information: Sig instruction discrepancy between EHR chart (Daily) vs Pharmacy claim (BID).'
              )
            }
            className="p-1.5 text-left text-[10px] rounded bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 truncate"
          >
            Conflicting Info
          </button>
        </div>

        {simulatedError && (
          <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded text-amber-900 text-[11px] space-y-1 animate-in fade-in">
            <div className="flex justify-between items-start">
              <strong className="font-semibold">Simulated Exception Alert:</strong>
              <button
                onClick={() => setSimulatedError(null)}
                className="text-amber-700 hover:text-amber-900"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <p>{simulatedError}</p>
          </div>
        )}
      </div>

      {/* MODAL OVERLAYS FOR ACTIONS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div
            className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 text-xs space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal: Provider Review */}
            {activeModal === 'provider_review' && (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-indigo-600" />
                    <span>Request Provider Review: {currentCase.id}</span>
                  </h3>
                  <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <p className="text-slate-600 leading-relaxed">
                    This will create a high-priority task in <strong>Dr. {currentCase.provider.lastName}</strong>'s
                    electronic signing queue, advance case stage to <strong>PROVIDER REVIEW</strong>, and append an audit event.
                  </p>

                  <label className="font-semibold text-slate-700 block mt-2">
                    Clinical Context / Pre-Check Note (Optional):
                  </label>
                  <textarea
                    rows={3}
                    value={providerNote}
                    onChange={(e) => setProviderNote(e.target.value)}
                    placeholder="e.g. Lab compliance verified (LDL 68 mg/dL). Pre-approved for 1-year renewal x 3 refills."
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isSubmitting}
                    onClick={handleRequestReview}
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                  >
                    Confirm Review Request
                  </button>
                </div>
              </>
            )}

            {/* Modal: Send Patient Update */}
            {activeModal === 'patient_update' && (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Send className="w-4 h-4 text-teal-600" />
                    <span>Send Patient SMS Update</span>
                  </h3>
                  <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="text-slate-600">
                    Recipient: <strong>{currentCase.patient.firstName} {currentCase.patient.lastName}</strong> ({currentCase.patient.phone})
                  </div>

                  <label className="font-semibold text-slate-700 block mt-2">
                    SMS Message Content:
                  </label>
                  <textarea
                    rows={3}
                    value={patientSms}
                    onChange={(e) => setPatientSms(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-teal-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isSubmitting}
                    onClick={handleSendPatientUpdate}
                    className="px-4 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold shadow-xs"
                  >
                    Dispatch SMS
                  </button>
                </div>
              </>
            )}

            {/* Modal: Contact Pharmacy */}
            {activeModal === 'contact_pharmacy' && (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Building className="w-4 h-4 text-amber-600" />
                    <span>Contact Dispensing Pharmacy</span>
                  </h3>
                  <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="text-slate-600">
                    Destination: <strong>{currentCase.pharmacy.name}</strong> ({currentCase.pharmacy.preferredCommunicationChannel})
                  </div>

                  <label className="font-semibold text-slate-700 block mt-2">
                    Electronic Clarification Inquiry:
                  </label>
                  <textarea
                    rows={3}
                    value={pharmacyInquiry}
                    onChange={(e) => setPharmacyInquiry(e.target.value)}
                    placeholder="e.g. Please confirm inventory on 20mg strength tablets or advise if 30-day bridge fill is processed."
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isSubmitting}
                    onClick={handleContactPharmacy}
                    className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs"
                  >
                    Transmit Query
                  </button>
                </div>
              </>
            )}

            {/* Modal: Assign Staff */}
            {activeModal === 'assign_staff' && (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-sky-600" />
                    <span>Reassign Case Ownership</span>
                  </h3>
                  <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Assign To Clinical Staff:</label>
                    <select
                      value={selectedStaff}
                      onChange={(e) => setSelectedStaff(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900"
                    >
                      <option value="Elena Rostova, RN">Elena Rostova, RN (Nurse Triage)</option>
                      <option value="Dr. Emily Carter">Dr. Emily Carter (Cardiology Attending)</option>
                      <option value="Dr. Eleanor Vance">Dr. Eleanor Vance (Internal Medicine)</option>
                      <option value="Julian Alvarez, PharmD">Julian Alvarez, PharmD (Pharmacy Liaison)</option>
                      <option value="Marcus Sterling">Marcus Sterling (Practice Manager)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Operational Role:</label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900"
                    >
                      <option value="Clinical Staff / MA">Clinical Staff / MA</option>
                      <option value="Physician / Prescriber">Physician / Prescriber</option>
                      <option value="Pharmacy Liaison">Pharmacy Liaison</option>
                      <option value="Practice Manager">Practice Manager</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isSubmitting}
                    onClick={handleAssignStaff}
                    className="px-4 py-1.5 rounded-lg bg-sky-700 hover:bg-sky-800 text-white font-semibold shadow-xs"
                  >
                    Update Ownership
                  </button>
                </div>
              </>
            )}

            {/* Modal: Add Note */}
            {activeModal === 'add_note' && (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-700" />
                    <span>Add Internal Case Memo</span>
                  </h3>
                  <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="font-semibold text-slate-700 block">
                    Clinical / Operational Memo:
                  </label>
                  <textarea
                    rows={4}
                    value={caseNote}
                    onChange={(e) => setCaseNote(e.target.value)}
                    placeholder="Enter confidential clinical observation or insurance coordination details..."
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-slate-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isSubmitting}
                    onClick={handleAddNote}
                    className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-xs"
                  >
                    Save Memo
                  </button>
                </div>
              </>
            )}

            {/* Modal: Escalate */}
            {activeModal === 'escalate' && (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-rose-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Escalate Case to CRITICAL</span>
                  </h3>
                  <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <p className="text-slate-600">
                    Escalating will notify the department medical director and trigger priority SLA alerts.
                  </p>

                  <label className="font-semibold text-slate-700 block mt-2">
                    Escalation Justification:
                  </label>
                  <textarea
                    rows={3}
                    value={escalateReason}
                    onChange={(e) => setEscalateReason(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-rose-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isSubmitting}
                    onClick={handleEscalate}
                    className="px-4 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-semibold shadow-xs"
                  >
                    Confirm Escalation
                  </button>
                </div>
              </>
            )}

            {/* Modal: Physician Sign-Off */}
            {activeModal === 'physician_signoff' && (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-teal-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Physician e-Prescription Authorization</span>
                  </h3>
                  <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
                    <p className="font-bold text-teal-950">
                      {currentCase.medication.name} {currentCase.medication.dosage}
                    </p>
                    <p className="text-slate-600">
                      Patient: {currentCase.patient.firstName} {currentCase.patient.lastName} (DOB: {currentCase.patient.dateOfBirth})
                    </p>
                    <p className="text-slate-600">
                      Destination: {currentCase.pharmacy.name}
                    </p>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-600 space-y-1">
                    <p className="font-semibold text-slate-800">Renewal Parameters:</p>
                    <p>• Quantity / Days Supply: 90 days (Maintenance)</p>
                    <p>• Authorized Refills: 3 renewals (1-year coverage)</p>
                    <p>• Prescriber: {currentUser.name} (NPI: 1982736410)</p>
                  </div>

                  <p className="text-[11px] text-slate-500 italic">
                    By signing, you electronically certify that you have reviewed the patient chart, vital signs, and recent laboratory monitoring.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isSubmitting}
                    onClick={async () => {
                      setIsSubmitting(true);
                      await authorizePrescriptionRenewal(currentCase.id, { refillsCount: 3, daysSupply: 90 });
                      setIsSubmitting(false);
                      setActiveModal(null);
                    }}
                    className="px-4 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold shadow-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Sign & Renew Order
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
