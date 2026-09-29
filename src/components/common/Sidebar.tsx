import React from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  MessageSquare,
  Clock,
  CalendarCheck,
  TrendingUp,
  Settings,
  Sparkles,
  GitCompare,
  Zap,
  ChevronRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { useDealMind, ActiveView } from '../../context/DealMindContext';

interface NavItem {
  id: ActiveView;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, activeCustomer, customerMemories, stats } = useDealMind();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users, badge: `${stats.customersCount}` },
    { id: 'deals', label: 'Deals', icon: Briefcase, badge: `${stats.activeDealsCount}` },
    { id: 'conversation', label: 'Conversations', icon: MessageSquare },
    {
      id: 'memory',
      label: 'Memory Timeline',
      icon: Clock,
      badge: 'Core',
      badgeColor: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
    },
    {
      id: 'meeting-prep',
      label: 'Meeting Prep',
      icon: CalendarCheck,
      badge: 'Hero',
      badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'landing', label: 'Landing & Story', icon: Compass },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-[#0B0F17] flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16">
      {/* Navigation Links */}
      <div className="p-3.5 space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Sales Intelligence Platform
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-900/60 to-purple-900/30 text-white border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    item.badgeColor || 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Account Memory Pulse Card */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/40">
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Active Context
            </span>
            <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {customerMemories.length} Memories
            </span>
          </div>

          <div className="flex items-center gap-2.5 mb-2.5">
            <img
              src={activeCustomer.avatar}
              alt={activeCustomer.name}
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{activeCustomer.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{activeCustomer.company}</p>
            </div>
          </div>

          {/* Learning Level Progression */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Hindsight Learning</span>
              <span className="font-semibold text-indigo-400">Level {activeCustomer.learningLevel}/5</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${(activeCustomer.learningLevel / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          <button
            onClick={() => setActiveView('memory')}
            className="w-full mt-3 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-[11px] font-semibold text-slate-200 flex items-center justify-center gap-1 transition-colors"
          >
            <span>Explore Memory Graph</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>
    </aside>
  );
};
