import React, { useState } from 'react';
import {
  Brain,
  Search,
  Sparkles,
  Play,
  ChevronDown,
  Bell,
  Cpu,
  Layers,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { useDealMind } from '../../context/DealMindContext';

export const Header: React.FC = () => {
  const {
    customers,
    activeCustomer,
    setActiveCustomerId,
    setIsAskDealMindOpen,
    setIsDemoTourOpen,
    searchQuery,
    setSearchQuery,
    customerMemories,
    setActiveView,
    activities,
  } = useDealMind();

  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-800 bg-[#0B0F17]/90 backdrop-blur-md px-6 flex items-center justify-between gap-4">
      {/* Left: Branding & Status */}
      <div className="flex items-center gap-4">
        <div 
          onClick={() => setActiveView('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white">DealMind</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Hindsight Core
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Persistent Sales Intelligence
            </p>
          </div>
        </div>

        {/* Hindsight Status Chip */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[11px] font-mono text-slate-300">
            Hindsight Memory: <strong className="text-emerald-400 font-normal">Active</strong> ({customerMemories.length} recalled)
          </span>
        </div>
      </div>

      {/* Middle: Universal Search & Account Switcher */}
      <div className="flex-1 max-w-xl flex items-center gap-3">
        {/* Customer Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowCustomerDropdown(!showCustomerDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-slate-600 text-xs text-slate-200 transition-colors shadow-sm"
          >
            <img
              src={activeCustomer.avatar}
              alt={activeCustomer.name}
              className="w-5 h-5 rounded-full object-cover ring-1 ring-indigo-500/50"
            />
            <span className="font-semibold max-w-[120px] truncate">{activeCustomer.name}</span>
            <span className="text-slate-400 text-[11px]">({activeCustomer.company})</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showCustomerDropdown && (
            <div className="absolute left-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-1.5 z-50">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                Select Active Account
              </div>
              {customers.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveCustomerId(c.id);
                    setShowCustomerDropdown(false);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center gap-3 hover:bg-slate-800/80 transition-colors ${
                    c.id === activeCustomer.id ? 'bg-indigo-950/40 border-l-2 border-indigo-500' : ''
                  }`}
                >
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-100 truncate">{c.name}</p>
                      <span className="text-[10px] text-emerald-400 font-mono font-medium">{c.formattedDealValue}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{c.company} • {c.stage}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search memories, objections, commitments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5">
        {/* Ask DealMind AI Button */}
        <button
          onClick={() => setIsAskDealMindOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask DealMind</span>
        </button>

        {/* 60-Second Demo Trigger */}
        <button
          onClick={() => setIsDemoTourOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold transition-all active:scale-95 group"
        >
          <Play className="w-3.5 h-3.5 fill-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">60-Sec Demo</span>
        </button>

        {/* Memory Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors relative"
            title="Recent Memory Events"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-[#0B0F17]"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50">
              <div className="px-3.5 py-1.5 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">Recent Memory Events</span>
                <span className="text-[10px] text-indigo-400 font-mono">Live Stream</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                {activities.slice(0, 5).map((act) => (
                  <div key={act.id} className="p-3 hover:bg-slate-800/40 transition-colors">
                    <p className="text-xs font-semibold text-slate-200">{act.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{act.description}</p>
                    <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-500">
                      <span>{act.customerName}</span>
                      <span>{act.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
