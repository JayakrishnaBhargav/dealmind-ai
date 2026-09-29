import React from 'react';
import {
  Briefcase,
  Users,
  Calendar,
  AlertTriangle,
  Brain,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  Zap,
  Play,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useDealMind } from '../../context/DealMindContext';
import { MemoryGrowthChart } from '../memory/MemoryGrowthChart';
import { BeforeAfterMemoryView } from '../memory/BeforeAfterMemoryView';

export const DashboardView: React.FC = () => {
  const {
    stats,
    activities,
    customers,
    activeCustomer,
    setActiveCustomerId,
    setActiveView,
    setIsAskDealMindOpen,
    setIsDemoTourOpen,
  } = useDealMind();

  const kpis = [
    {
      label: 'Active Deals',
      value: stats.activeDealsCount,
      change: '₹46.8L Pipeline',
      icon: Briefcase,
      color: 'from-blue-600 to-indigo-600',
      textColor: 'text-blue-400',
    },
    {
      label: 'Customers Tracked',
      value: stats.customersCount,
      change: '100% In Memory',
      icon: Users,
      color: 'from-indigo-600 to-purple-600',
      textColor: 'text-indigo-400',
    },
    {
      label: 'Upcoming Meetings',
      value: stats.upcomingMeetingsCount,
      change: 'Next: Tomorrow 10:30 AM',
      icon: Calendar,
      color: 'from-purple-600 to-pink-600',
      textColor: 'text-purple-400',
    },
    {
      label: 'Pending Follow-ups',
      value: stats.pendingFollowUpsCount,
      change: 'Commitments Tracked',
      icon: Clock,
      color: 'from-amber-600 to-orange-600',
      textColor: 'text-amber-400',
    },
    {
      label: 'Hindsight Memories',
      value: stats.memoriesCreatedCount,
      change: '+4 added this week',
      icon: Brain,
      color: 'from-emerald-600 to-teal-600',
      textColor: 'text-emerald-400',
    },
    {
      label: 'Deals At Risk',
      value: stats.dealsAtRiskCount,
      change: 'Objections Detected',
      icon: AlertTriangle,
      color: 'from-rose-600 to-red-600',
      textColor: 'text-rose-400',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Welcome / Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-purple-950/40 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-xs font-semibold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Persistent Hindsight Memory Layer Active</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            The Sales Agent That Never Forgets a Deal
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Turn every customer interaction into persistent intelligence. DealMind captures objections, competitors, and commitments so every future conversation is 10x smarter.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setIsDemoTourOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Launch 60-Second Demo</span>
            </button>
            <button
              onClick={() => setActiveView('conversation')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Run Conversation Simulator</span>
            </button>
            <button
              onClick={() => setIsAskDealMindOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Ask DealMind Anything</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 transition-all shadow-md space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 truncate">
                  {kpi.label}
                </span>
                <div
                  className={`w-7 h-7 rounded-lg bg-gradient-to-br ${kpi.color} flex items-center justify-center text-white shadow-sm`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-xl font-bold text-white font-mono">{kpi.value}</div>
              <p className={`text-[10px] font-medium truncate ${kpi.textColor}`}>
                {kpi.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* Hero Before vs After Demo */}
      <BeforeAfterMemoryView />

      {/* Middle Grid: Active Accounts + Recent Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Accounts & Quick Action */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              Active Customer Pipeline
            </h2>
            <button
              onClick={() => setActiveView('customers')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {customers.map((c) => {
              const isSelected = c.id === activeCustomer.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setActiveCustomerId(c.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-gradient-to-br from-indigo-950/50 to-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-700"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{c.name}</h4>
                        <p className="text-[11px] text-slate-400 truncate">{c.company}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {c.formattedDealValue}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Stage:</span>
                      <span className="font-semibold text-indigo-300">{c.stage}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Top Concern:</span>
                      <span className="text-rose-300 truncate max-w-[170px] text-right">
                        {c.topConcerns[0] || 'Pricing'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-mono text-indigo-400">
                      Learning Lvl {c.learningLevel}/5
                    </span>
                    <span className="hover:text-white flex items-center gap-1 font-semibold text-indigo-300">
                      Select Account →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Live Activity Feed (Prompt Section 5) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              Recent Memory Activity
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              Live Feed
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3.5 max-h-[380px] overflow-y-auto">
            {activities.map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-indigo-400 font-semibold">{act.title}</span>
                  <span className="text-slate-500">{act.timestamp}</span>
                </div>
                <p className="text-xs text-slate-200 font-medium leading-snug">{act.description}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>Account: {act.customerName}</span>
                  {act.memoryCategory && (
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {act.memoryCategory}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Curve Visual Component */}
      <MemoryGrowthChart />
    </div>
  );
};
