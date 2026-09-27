import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  Filter,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PriorityIndicator } from '../common/PriorityIndicator';
import { taskService } from '../../services';

export const TasksView: React.FC = () => {
  const { refills, currentRole, currentUser, openRefillDetail } = useApp();

  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'OPEN' | 'COMPLETED'>('OPEN');

  // Flatten tasks across refills
  const allTasks = refills.flatMap((r) =>
    r.tasks.map((t) => ({ ...t, caseId: r.id, caseRef: r }))
  );

  const filteredTasks = allTasks.filter((t) => {
    if (filterStatus === 'OPEN' && t.completed) return false;
    if (filterStatus === 'COMPLETED' && !t.completed) return false;
    if (filterRole !== 'ALL' && t.assignedRole !== filterRole) return false;
    return true;
  });

  const handleToggle = async (refillId: string, taskId: string) => {
    await taskService.toggleTaskCompleted(refillId, taskId, currentUser.name);
    // Find task and toggle
    const refill = refills.find((r) => r.id === refillId);
    if (refill) {
      const task = refill.tasks.find((t) => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
      }
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Clinical & Operational Tasks
            </h1>
            <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {filteredTasks.length} tasks
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Action items assigned to clinical staff, medical assistants, prescribers, and pharmacy liaisons
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'ALL' | 'OPEN' | 'COMPLETED')}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-teal-500"
          >
            <option value="OPEN">Status: Open Tasks</option>
            <option value="COMPLETED">Status: Completed</option>
            <option value="ALL">Status: All</option>
          </select>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-teal-500"
          >
            <option value="ALL">Role: All Roles</option>
            <option value="Clinical Staff / MA">Clinical Staff / MA</option>
            <option value="Physician / Prescriber">Physician / Prescriber</option>
            <option value="Practice Manager">Practice Manager</option>
            <option value="Pharmacy Liaison">Pharmacy Liaison</option>
          </select>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700">All tasks in this view are completed!</p>
            <p className="text-xs text-slate-400 mt-1">Check back as new refill requests arrive.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="p-4 hover:bg-slate-50/70 transition-colors flex items-start gap-4 group"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggle(task.caseId, task.id)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
              />

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span
                      onClick={() => openRefillDetail(task.caseRef)}
                      className="font-mono text-xs font-bold text-teal-700 hover:underline cursor-pointer"
                    >
                      {task.caseId}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span
                      className={`text-xs font-bold ${
                        task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <PriorityIndicator priority={task.priority} />
                    <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      Due: {task.dueDate}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-1">{task.description}</p>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-medium text-slate-600">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      Assigned: {task.assignedTo} ({task.assignedRole})
                    </span>
                    <span>·</span>
                    <span>Patient: {task.caseRef.patient.firstName} {task.caseRef.patient.lastName}</span>
                  </div>

                  <button
                    onClick={() => openRefillDetail(task.caseRef)}
                    className="text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1"
                  >
                    <span>View Case</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
