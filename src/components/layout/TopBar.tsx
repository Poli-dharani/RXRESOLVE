import React, { useState } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Building,
  UserCheck,
  Menu,
  Shield,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { EnvironmentBadge } from '../common/EnvironmentBadge';
import { NotificationsDropdown } from './NotificationsDropdown';

export const TopBar: React.FC = () => {
  const {
    currentUser,
    currentRole,
    setCurrentRole,
    currentOrg,
    setCurrentOrg,
    organizations,
    unreadNotificationCount,
    setIsSearchModalOpen,
    sidebarCollapsed,
    setSidebarCollapsed,
    mode,
    setMode,
  } = useApp();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);

  const roles: { role: UserRole; label: string; desc: string; persona: string }[] = [
    { role: 'Practice Staff', label: 'Practice Staff', desc: 'Triage, gather labs, draft review packets', persona: 'Elena Rostova, MA' },
    { role: 'Provider', label: 'Provider', desc: 'Physician sign-off & e-Prescribing renewal', persona: 'Dr. Emily Carter, MD' },
    { role: 'Pharmacy Staff', label: 'Pharmacy Staff', desc: 'Dispensing status, Surescripts, formulary check', persona: 'Marcus Vance, PharmD' },
    { role: 'Operations Manager', label: 'Operations Manager', desc: 'SLA monitoring, clinic throughput, escalations', persona: 'Sarah Jenkins, Ops Lead' },
    { role: 'Admin', label: 'Admin', desc: 'Audit logging, HIPAA security, permissions', persona: 'Alex Thorne, Compliance' },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Left zone: Mobile toggle & Global search button */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={() => setSidebarCollapsed((prev) => !prev)}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-hidden"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar (Trigger for Global Search Modal) */}
        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors group cursor-text"
        >
          <div className="flex items-center gap-2.5 truncate">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
            <span className="truncate">Search refill ID (e.g. RX-10482), patient, medication, provider...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right zone: Environment badge, Selectors, Notifications & User */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Persistent Environment Badge */}
        <EnvironmentBadge compact />

        {/* Organization Selector */}
        <div className="relative hidden md:block">
          <button
            onClick={() => {
              setIsOrgDropdownOpen(!isOrgDropdownOpen);
              setIsRoleDropdownOpen(false);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Building className="w-3.5 h-3.5 text-teal-600" />
            <span className="truncate max-w-[150px] font-semibold">{currentOrg.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isOrgDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-40">
              <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                Active Health Organization
              </div>
              {organizations.map((org) => (
                <button
                  key={org.id}
                  onClick={() => {
                    setCurrentOrg(org);
                    setIsOrgDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex flex-col hover:bg-slate-50 transition-colors ${
                    currentOrg.id === org.id ? 'bg-teal-50/50 text-teal-900 font-semibold' : 'text-slate-700'
                  }`}
                >
                  <span>{org.name}</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {org.type} · {org.activeCasesCount} active cases
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Role Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setIsRoleDropdownOpen(!isRoleDropdownOpen);
              setIsOrgDropdownOpen(false);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            title="Switch Simulated Healthcare Role"
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline text-slate-500 font-normal">Role:</span>
            <span className="font-semibold text-slate-800">{currentRole}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40">
              <div className="px-3.5 py-1.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase border-b border-slate-100 mb-1">
                Switch Operational Perspective
              </div>
              {roles.map((r) => (
                <button
                  key={r.role}
                  onClick={() => {
                    setCurrentRole(r.role);
                    setIsRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 text-xs flex flex-col gap-0.5 hover:bg-slate-50 transition-colors ${
                    currentRole === r.role ? 'bg-indigo-50/70 border-l-2 border-indigo-600' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{r.label}</span>
                    <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                      {r.persona.split(',')[0]}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">{r.desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsRoleDropdownOpen(false);
              setIsOrgDropdownOpen(false);
            }}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          <NotificationsDropdown
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
          />
        </div>

        {/* User Profile Capsule */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-2xs">
            ER
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-slate-900 leading-tight">
              {currentUser.name}
            </div>
            <div className="text-[11px] text-slate-500 leading-tight">
              {currentUser.role}
            </div>
          </div>
        </div>

        {/* Back to landing link if in app mode */}
        {mode === 'app' && (
          <button
            onClick={() => setMode('landing')}
            className="hidden xl:inline-flex items-center gap-1 text-xs text-slate-500 hover:text-teal-700 font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors ml-1"
            title="View Product Landing Page"
          >
            <span>Landing</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </button>
        )}
      </div>
    </header>
  );
};
