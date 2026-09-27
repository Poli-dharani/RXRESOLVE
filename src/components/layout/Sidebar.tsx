import React from 'react';
import {
  LayoutDashboard,
  Layers,
  Users,
  Bot,
  CheckSquare,
  MessageSquare,
  BarChart3,
  ShieldAlert,
  Settings,
  HelpCircle,
  Activity,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Play,
  Workflow,
  Target,
} from 'lucide-react';
import { useApp, AppView } from '../../context/AppContext';

interface NavItem {
  id: AppView;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
}

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    sidebarCollapsed,
    setSidebarCollapsed,
    refills,
    notifications,
    setMode,
  } = useApp();

  const activeRefillsCount = refills.length;
  const pendingTasksCount = refills.reduce(
    (acc, r) => acc + r.tasks.filter((t) => !t.completed).length,
    0
  );

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'queue', label: 'Refill Queue', icon: Layers, badge: activeRefillsCount },
    { id: 'patient-360', label: 'Patient 360', icon: Users },
    { id: 'copilot', label: 'AI Copilot', icon: Bot, badge: 'Advisor' },
    { id: 'demo-center', label: 'Demo Center', icon: Play, badge: 'Judge' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: pendingTasksCount },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'audit', label: 'Audit & Security', icon: ShieldAlert },
    { id: 'architecture', label: 'Architecture', icon: Workflow },
    { id: 'go-to-market', label: 'Go-To-Market', icon: Target },
  ];

  const bottomItems: { id: AppView; label: string; icon: React.ElementType }[] = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Protocols', icon: HelpCircle },
  ];

  return (
    <aside
      className={`bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 transition-all duration-300 z-40 shrink-0 ${
        sidebarCollapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <div
            onClick={() => setMode('landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
            title="RXRESOLVE — Home"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:border-teal-400 group-hover:bg-teal-500/20 transition-all shadow-inner">
              <Activity className="w-4 h-4 text-teal-400" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  RXRESOLVE
                </span>
                <span className="text-[10px] text-teal-400/90 font-medium tracking-wide uppercase">
                  Refill Orchestration
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden sm:block"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Primary Navigation */}
        <nav className="p-3 space-y-1">
          {!sidebarCollapsed && (
            <div className="px-3 py-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Clinical Operations
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                  isActive
                    ? 'bg-teal-500/15 text-teal-300 font-semibold shadow-inner'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-teal-400' : 'text-slate-400'
                  }`}
                />
                {!sidebarCollapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
                {!sidebarCollapsed && item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-teal-500/30 text-teal-200'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-teal-400 rounded-r" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              } ${sidebarCollapsed ? 'justify-center' : ''}`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0 text-slate-400" />
              {!sidebarCollapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}
            </button>
          );
        })}

        {!sidebarCollapsed && (
          <div className="mt-3 px-3 py-2 bg-slate-800/60 rounded-lg border border-slate-700/50">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Surescripts & EHR Synced</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Refill intelligence gateway active
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
