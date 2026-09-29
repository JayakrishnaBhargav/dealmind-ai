/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DealMindProvider, useDealMind } from './context/DealMindContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { AskDealMindModal } from './components/common/AskDealMindModal';
import { HackathonDemoModal } from './components/common/HackathonDemoModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { CustomerProfileView } from './components/customers/CustomerProfileView';
import { DealsView } from './components/deals/DealsView';
import { ConversationView } from './components/conversation/ConversationView';
import { MemoryTimeline } from './components/memory/MemoryTimeline';
import { MeetingPrepView } from './components/meeting/MeetingPrepView';
import { InsightsView } from './components/insights/InsightsView';
import { LandingPage } from './components/landing/LandingPage';
import { SettingsView } from './components/settings/SettingsView';

const AppContent: React.FC = () => {
  const { activeView } = useDealMind();

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'customers':
        return <CustomerProfileView />;
      case 'deals':
        return <DealsView />;
      case 'conversation':
        return <ConversationView />;
      case 'memory':
        return <MemoryTimeline />;
      case 'meeting-prep':
        return <MeetingPrepView />;
      case 'insights':
        return <InsightsView />;
      case 'landing':
        return <LandingPage />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header />

      {/* Main View Area with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#0B0F17]">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <AskDealMindModal />
      <HackathonDemoModal />
    </div>
  );
};

export default function App() {
  return (
    <DealMindProvider>
      <AppContent />
    </DealMindProvider>
  );
}
