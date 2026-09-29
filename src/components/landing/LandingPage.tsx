import React from 'react';
import {
  Brain,
  Sparkles,
  Play,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  CalendarCheck,
  TrendingUp,
  Cpu,
  Lock,
  GitCompare,
  Layers,
} from 'lucide-react';
import { useDealMind } from '../../context/DealMindContext';
import { BeforeAfterMemoryView } from '../memory/BeforeAfterMemoryView';

export const LandingPage: React.FC = () => {
  const { setActiveView, setIsDemoTourOpen, setIsAskDealMindOpen } = useDealMind();

  return (
    <div className="space-y-16 max-w-6xl mx-auto pb-20">
      {/* Hero Section */}
      <section className="relative text-center pt-8 sm:pt-14 pb-8 space-y-6">
        {/* Glow */}
        <div className="absolute left-1/2 -top-12 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-semibold text-indigo-300">
          <Brain className="w-4 h-4 text-indigo-400" />
          <span>Powered by Hindsight Memory Architecture</span>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            The Sales Agent That <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400">
              Never Forgets a Deal
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Turn every customer conversation into persistent intelligence. DealMind captures objections, competitors, technical anxieties, and open promises—so every future call is 10x smarter.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold shadow-xl shadow-indigo-600/30 transition-all active:scale-95 group"
          >
            <span>Start Building Your Deal Memory</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => setIsDemoTourOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-bold shadow-md transition-all active:scale-95"
          >
            <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            <span>See How It Works (60-Sec Demo)</span>
          </button>
        </div>

        {/* Tagline */}
        <p className="text-xs font-mono text-indigo-400 pt-2">
          "Every conversation makes your next conversation smarter."
        </p>
      </section>

      {/* Storytelling Framework (Section 27) */}
      <section className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
            The Fundamental Shift
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Conversation → Memory → Learning → Better Decisions
          </h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Traditional CRMs store dead records; standard chatbots forget everything. DealMind forms long-term episodic memory.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Problem */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-rose-500/20 space-y-2.5">
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
              1. The Problem
            </span>
            <h3 className="text-sm font-bold text-white">Salespeople Forget Key Details</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              In 4-month enterprise cycles, reps forget pricing boundaries, CFO requirements, and open commitments made 3 weeks ago.
            </p>
          </div>

          {/* 2. Solution */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-indigo-500/20 space-y-2.5">
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              2. The Solution
            </span>
            <h3 className="text-sm font-bold text-white">Total Conversation Recall</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              DealMind filters out filler noise and extracts lasting business facts into an active memory graph.
            </p>
          </div>

          {/* 3. Intelligence */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-purple-500/20 space-y-2.5">
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              3. The Intelligence
            </span>
            <h3 className="text-sm font-bold text-white">Hindsight Persistent Layer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unlike stateless LLMs, Hindsight maintains long-term cognitive continuity across calls, emails, and meetings.
            </p>
          </div>

          {/* 4. Result */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-emerald-500/20 space-y-2.5">
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              4. The Result
            </span>
            <h3 className="text-sm font-bold text-white">Hyper-Personalized Sales Wins</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every meeting briefing is armed with exact objection counters, competitor battlecards, and zero dropped commitments.
            </p>
          </div>
        </div>
      </section>

      {/* The Hero Demonstration Component */}
      <BeforeAfterMemoryView />

      {/* Interactive Feature Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => setActiveView('meeting-prep')}
          className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all shadow-lg space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30 group-hover:scale-105 transition-transform">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Autonomous Meeting Prep</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            One-click executive briefing synthesizes relationship state, what they care about, previous objections, and talking points.
          </p>
          <span className="text-xs text-purple-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Explore Meeting Prep →
          </span>
        </div>

        <div
          onClick={() => setActiveView('conversation')}
          className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all shadow-lg space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 group-hover:scale-105 transition-transform">
            <Brain className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Conversation Simulator</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Witness Hindsight live: simulate realistic multi-call customer dialogues and watch memory nodes form in real time.
          </p>
          <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Launch Simulator →
          </span>
        </div>

        <div
          onClick={() => setIsAskDealMindOpen(true)}
          className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all shadow-lg space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Ask DealMind with Citations</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ask any question about your deals and get verifiable answers backed by exact dates and past customer quotes.
          </p>
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Query Knowledge Base →
          </span>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="text-center p-8 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Ready to See Persistent Deal Intelligence in Action?
        </h2>
        <p className="text-xs text-slate-300 max-w-lg mx-auto">
          Built for the AI-agent hackathon with Hindsight persistent memory as the core architectural layer.
        </p>
        <button
          onClick={() => setActiveView('dashboard')}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
        >
          Open DealMind Dashboard
        </button>
      </section>
    </div>
  );
};
