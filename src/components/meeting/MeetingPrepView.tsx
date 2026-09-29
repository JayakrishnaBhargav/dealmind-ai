import React, { useState } from 'react';
import {
  CalendarCheck,
  Sparkles,
  Brain,
  AlertTriangle,
  Swords,
  Clock,
  CheckCircle2,
  HelpCircle,
  Copy,
  Printer,
  Share2,
  Calendar,
  Building,
  User,
  ArrowRight,
  ShieldAlert,
  ChevronDown,
} from 'lucide-react';
import { useDealMind } from '../../context/DealMindContext';
import { generateMeetingPrepViaGemini } from '../../services/apiBridge';
import { MeetingPrepBriefing } from '../../types';

export const MeetingPrepView: React.FC = () => {
  const {
    customers,
    activeCustomer,
    setActiveCustomerId,
    customerMemories,
    hindsightService,
  } = useDealMind();

  const [meetingTime, setMeetingTime] = useState('Tomorrow at 10:30 AM');
  const [meetingTitle, setMeetingTitle] = useState('Q4 Strategy Review & Commercial Architecture Alignment');
  const [isGenerating, setIsGenerating] = useState(false);
  const [briefing, setBriefing] = useState<MeetingPrepBriefing>(() => {
    return hindsightService.generateMeetingPrep(activeCustomer);
  });
  const [copied, setCopied] = useState(false);

  const handlePrepareMe = async () => {
    setIsGenerating(true);

    // Call server Gemini 3.8 Flash endpoint or use internal Hindsight engine
    const geminiResult = await generateMeetingPrepViaGemini(
      activeCustomer,
      meetingTime,
      customerMemories
    );

    const baseBriefing = hindsightService.generateMeetingPrep(activeCustomer);

    if (geminiResult) {
      setBriefing({
        ...baseBriefing,
        executiveSummary: geminiResult.executiveSummary || baseBriefing.executiveSummary,
        whatTheyCareAbout: geminiResult.whatTheyCareAbout || baseBriefing.whatTheyCareAbout,
        suggestedTalkingPoints:
          geminiResult.suggestedTalkingPoints || baseBriefing.suggestedTalkingPoints,
        questionsToAsk: geminiResult.questionsToAsk || baseBriefing.questionsToAsk,
      });
    } else {
      setBriefing(baseBriefing);
    }

    setIsGenerating(false);
  };

  const handleCopyBriefing = () => {
    const text = `
DEALMIND EXECUTIVE MEETING BRIEFING
Target: ${activeCustomer.name} (${activeCustomer.role}, ${activeCustomer.company})
Time: ${meetingTime}
Deal Value: ${activeCustomer.formattedDealValue} | Stage: ${activeCustomer.stage}

EXECUTIVE SUMMARY:
${briefing.executiveSummary}

WHAT THEY CARE ABOUT:
${briefing.whatTheyCareAbout.map((c) => `- ${c}`).join('\n')}

PREVIOUS OBJECTIONS:
${briefing.previousObjections.map((o) => `- Objection: ${o.objection}\n  Counter: ${o.suggestedCounter}`).join('\n')}

COMPETITORS:
${briefing.competitors.map((c) => `- ${c.name}: ${c.ourDifferentiator}`).join('\n')}

OPEN COMMITMENTS:
${briefing.openCommitments.map((c) => `- [PENDING] ${c.commitment} (Promised: ${c.promisedDate})`).join('\n')}

TALKING POINTS:
${briefing.suggestedTalkingPoints.map((p) => `- ${p}`).join('\n')}

QUESTIONS TO ASK:
${briefing.questionsToAsk.map((q) => `- ${q}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Hero Control Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-purple-950/30 border border-indigo-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/40">
              <CalendarCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Executive Meeting Prep
            </h1>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
              Hero Feature
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Synthesizes every past conversation, objection, and open commitment into an actionable briefing.
          </p>
        </div>

        {/* Inputs & Prepare Me Trigger */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Customer select */}
          <select
            value={activeCustomer.id}
            onChange={(e) => setActiveCustomerId(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.company})
              </option>
            ))}
          </select>

          {/* Meeting Time Pill */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <input
              type="text"
              value={meetingTime}
              onChange={(e) => setMeetingTime(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none font-medium w-40"
            />
          </div>

          <button
            onClick={handlePrepareMe}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'Synthesizing...' : 'Prepare Me'}</span>
          </button>
        </div>
      </div>

      {/* Briefing Action Toolbar */}
      <div className="flex items-center justify-between bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-slate-400">Briefing Generated for:</span>
          <span className="font-bold text-white flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-indigo-400" />
            {activeCustomer.name} • {activeCustomer.company}
          </span>
          <span className="text-[10px] font-mono text-emerald-400">
            ({customerMemories.length} Memories Recalled)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyBriefing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied!' : 'Copy Briefing'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Main Briefing Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Strategic Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Executive Summary */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-400" />
                1. Executive Summary
              </h3>
              <span className="text-[10px] font-mono text-slate-500">Autonomous Synthesis</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-normal">
              {briefing.executiveSummary}
            </p>
          </div>

          {/* 2. Open Commitments (Crucial to never drop promises) */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/30 to-slate-900 border border-amber-500/30 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                2. Open Commitments (Promises to Fulfill)
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Action Required
              </span>
            </div>
            <div className="space-y-2">
              {briefing.openCommitments.map((comm, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/70 border border-amber-500/30 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-100">{comm.commitment}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Promised on: {comm.promisedDate} • Rep: Vikram Seth
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                    {comm.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Previous Objections & Counters */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-3">
            <h3 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              3. Previous Objections & AI Rebuttals
            </h3>
            <div className="space-y-3">
              {briefing.previousObjections.map((obj, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between text-rose-300 font-semibold">
                    <span>Objection: "{obj.objection}"</span>
                    <span className="text-[10px] font-mono text-slate-500">Historical Record</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                      Suggested Battle-Tested Counter:
                    </span>
                    <p className="text-xs text-slate-200">{obj.suggestedCounter}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Suggested Talking Points */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-3">
            <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              4. Personalized Talking Points (Memory-Grounded)
            </h3>
            <ul className="space-y-2">
              {briefing.suggestedTalkingPoints.map((point, i) => (
                <li
                  key={i}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-200 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 5. Questions To Ask */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-3">
            <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-purple-400" />
              5. High-Impact Questions To Ask (Unresolved Issues)
            </h3>
            <ul className="space-y-2">
              {briefing.questionsToAsk.map((q, i) => (
                <li
                  key={i}
                  className="p-3 rounded-xl bg-slate-950/60 border border-purple-500/20 text-xs text-purple-200 flex items-start gap-2.5 italic"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right 1 Col: Intelligence Context & Memory Sources */}
        <div className="space-y-6">
          {/* What They Care About */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-3">
            <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
              What They Care About Most
            </h3>
            <div className="space-y-1.5">
              {briefing.whatTheyCareAbout.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-200 font-medium"
                >
                  • {item}
                </div>
              ))}
            </div>
          </div>

          {/* Competitors In Play */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-3">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <Swords className="w-4 h-4 text-amber-400" />
              Competitor Positioning
            </h3>
            <div className="space-y-2.5">
              {briefing.competitors.map((comp, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300">{comp.name}</span>
                    <span className="text-[10px] font-mono text-slate-500">Active Rival</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{comp.context}</p>
                  <div className="pt-1 text-[11px] text-indigo-300 font-medium">
                    <strong className="text-white">Our Edge:</strong> {comp.ourDifferentiator}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Memory Sources (Section 10 Requirement) */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-950/30 to-slate-900 border border-indigo-500/30 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-400" />
                Hindsight Memory Sources
              </h3>
              <span className="text-[10px] font-mono text-emerald-400">
                {briefing.memorySources.length} Citations
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              The exact episodic nodes DealMind referenced to produce this strategic briefing:
            </p>
            <div className="space-y-2">
              {briefing.memorySources.map((mem, i) => (
                <div
                  key={mem.id}
                  className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] space-y-1"
                >
                  <div className="flex items-center justify-between text-indigo-300 font-semibold">
                    <span>
                      #{i + 1} {mem.relativeDate || 'Past call'}
                    </span>
                    <span className="text-[9px] uppercase font-mono px-1 rounded bg-slate-800 text-slate-400">
                      {mem.category}
                    </span>
                  </div>
                  <p className="text-slate-200 line-clamp-2">{mem.extractedFact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
