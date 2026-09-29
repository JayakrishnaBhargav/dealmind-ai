import React from 'react';
import {
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  Brain,
  CalendarCheck,
  MessageSquare,
  AlertTriangle,
  Swords,
  HeartHandshake,
  Users2,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useDealMind } from '../../context/DealMindContext';

export const CustomerProfileView: React.FC = () => {
  const {
    customers,
    activeCustomer,
    setActiveCustomerId,
    customerMemories,
    setActiveView,
  } = useDealMind();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Account Selector Pill Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {customers.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCustomerId(c.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              c.id === activeCustomer.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <img src={c.avatar} alt={c.name} className="w-5 h-5 rounded-full object-cover" />
            <span>{c.name}</span>
            <span className="text-[10px] opacity-75 font-mono">({c.company})</span>
          </button>
        ))}
      </div>

      {/* Main Profile Header Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={activeCustomer.avatar}
              alt={activeCustomer.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/50 shadow-lg"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  {activeCustomer.name}
                </h1>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {activeCustomer.formattedDealValue}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {activeCustomer.stage}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-300">
                {activeCustomer.role} • <strong className="text-white">{activeCustomer.company}</strong>
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  {activeCustomer.industry}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {activeCustomer.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  {activeCustomer.email}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveView('conversation')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span>Log Conversation</span>
            </button>
            <button
              onClick={() => setActiveView('meeting-prep')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition-all active:scale-95"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Meeting Prep</span>
            </button>
          </div>
        </div>
      </div>

      {/* Intelligence Cards Grid (Prompt Section 6) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Customer Intelligence (Hindsight Synthesized)
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Derived from {customerMemories.length} accumulated memories
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top Concerns */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Top Customer Concerns & Objections
              </h3>
              <span className="text-[10px] font-mono text-slate-500">Active Blockers</span>
            </div>
            <div className="space-y-2">
              {activeCustomer.topConcerns.map((concern, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-950/60 border border-rose-500/20 text-xs text-slate-200 leading-snug flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5"></span>
                  <span>{concern}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Competitors Mentioned */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <Swords className="w-4 h-4 text-amber-400" />
                Competitors Under Active Evaluation
              </h3>
              <span className="text-[10px] font-mono text-slate-500">Benchmark Rivals</span>
            </div>
            <div className="space-y-2">
              {activeCustomer.competitorsMentioned.map((comp, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-950/60 border border-amber-500/20 text-xs text-slate-200 flex items-center justify-between"
                >
                  <span className="font-semibold text-amber-300">{comp}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Flagged in Call
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Preferences */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-blue-400" />
                Operational & Commercial Preferences
              </h3>
              <span className="text-[10px] font-mono text-slate-500">Deal Velocity Keys</span>
            </div>
            <div className="space-y-2">
              {activeCustomer.preferences.map((pref, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-950/60 border border-blue-500/20 text-xs text-slate-200 leading-snug flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5"></span>
                  <span>{pref}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Decision Makers */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                <Users2 className="w-4 h-4 text-purple-400" />
                Stakeholders & Sign-off Hierarchy
              </h3>
              <span className="text-[10px] font-mono text-slate-500">Influence Map</span>
            </div>
            <div className="space-y-2">
              {activeCustomer.decisionMakers.map((dm, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-950/60 border border-purple-500/20 text-xs text-slate-200 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-white">{dm.name}</p>
                    <p className="text-[11px] text-slate-400">{dm.role}</p>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {dm.influence.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
