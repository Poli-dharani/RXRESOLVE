/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { LandingPage } from './components/landing/LandingPage';
import { LandingPageNew } from './components/landing/LandingPageNew';
import { DashboardView } from './components/dashboard/DashboardView';
import { RefillQueueView } from './components/queue/RefillQueueView';
import { Patient360View } from './components/patient/Patient360View';
import { TasksView } from './components/tasks/TasksView';
import { MessagesView } from './components/messages/MessagesView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { AuditView } from './components/audit/AuditView';
import { AICopilotView } from './components/copilot/AICopilotView';
import { SettingsView } from './components/settings/SettingsView';
import { HelpView } from './components/help/HelpView';
import { DemoCenterView } from './components/demo/DemoCenterView';
import { SystemArchitectureView } from './components/architecture/SystemArchitectureView';
import { GoToMarketView } from './components/gtm/GoToMarketView';
import { GuidedDemoModal } from './components/demo/GuidedDemoModal';
import { RefillCaseWorkspace } from './components/workspace/RefillCaseWorkspace';
import { ToastNotification } from './components/common/ToastNotification';
import '../src/styles/clay-design.css';

const AppShell: React.FC = () => {
  const {
    mode,
    currentView,
    selectedRefill,
    closeRefillDetail,
    isGuidedDemoOpen,
    setIsGuidedDemoOpen,
    setMode,
  } = useApp();

  if (mode === 'landing') {
    return (
      <LandingPageNew
        onEnterDemo={() => {
          setMode('app');
          window.scrollTo(0, 0);
        }}
      />
    );
  }

  const renderCurrentView = () => {
    // If a refill case is active, render the 3-column Refill Case Workspace!
    if (selectedRefill) {
      return (
        <RefillCaseWorkspace
          currentCase={selectedRefill}
          onClose={closeRefillDetail}
        />
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'queue':
        return <RefillQueueView />;
      case 'patient-360':
        return <Patient360View />;
      case 'copilot':
        return <AICopilotView />;
      case 'demo-center':
        return <DemoCenterView onStartGuidedDemo={() => setIsGuidedDemoOpen(true)} />;
      case 'tasks':
        return <TasksView />;
      case 'messages':
        return <MessagesView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'audit':
        return <AuditView />;
      case 'architecture':
        return <SystemArchitectureView />;
      case 'go-to-market':
        return <GoToMarketView />;
      case 'settings':
        return <SettingsView />;
      case 'help':
        return <HelpView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Persistent Top Navigation Bar */}
        <TopBar />

        {/* Viewport Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {renderCurrentView()}
          </div>
        </main>
      </div>

      {/* Global Real-time Search Modal */}
      <GlobalSearchModal />

      {/* Toast Notification HUD */}
      <ToastNotification />

      {/* Guided Walkthrough Overlay for Hackathon Evaluation */}
      <GuidedDemoModal
        isOpen={isGuidedDemoOpen}
        onClose={() => setIsGuidedDemoOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
