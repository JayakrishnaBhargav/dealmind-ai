import React, { useState } from 'react';
import {
  GitCompare,
  XCircle,
  CheckCircle,
  Brain,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Lightbulb,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useDealMind } from '../../context/DealMindContext';

export const BeforeAfterMemoryView: React.FC = () => {
  const { activeCustomer, hindsightService } = useDealMind();
  const [selectedPrompt, setSelectedPrompt] = useState('Help me prepare for my meeting');

  const comparison = hindsightService.compareWithAndWithoutMemory(activeCustomer, selectedPrompt);

  const testPrompts = [
    'Help me prepare for my meeting',
    'How should I respond to their pricing pushback?',
    'What competitor threats should I be ready for?',
  ];

  return (
    <div className="p-6 rounded-2xl bg-[#0E131F] border border-indigo-500/30 shadow-2xl space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <GitCompare className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">Why Memory Matters</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              The Hindsight Proof
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            See the definitive difference between standard stateless AI chatbots and DealMind's persistent memory.
          </p>
        </div>

        {/* Prompt selector pills */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {testPrompts.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPrompt(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedPrompt === p
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WITHOUT MEMORY CARD */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-rose-500/20 space-y-4 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                  Without Memory (Stateless Chatbot)
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                0 Memories Recalled
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90 text-xs text-slate-300 font-mono">
              <span className="text-slate-500 block mb-1">Sales Rep Prompt:</span>
              "{selectedPrompt}"
            </div>

            <div className="p-4 rounded-xl bg-rose-950/10 border border-rose-500/20 text-xs text-slate-300 leading-relaxed">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-1">
                Generic LLM Output:
              </span>
              "{comparison.withoutMemory.response}"
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-[11px] text-rose-300/80 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>
              <strong>The Fatal Flaw:</strong> {comparison.withoutMemory.criticism}
            </span>
          </div>
        </div>

        {/* WITH HINDSIGHT MEMORY CARD */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-950/40 to-slate-900 border border-indigo-500/40 shadow-xl shadow-indigo-500/10 space-y-4 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  With Hindsight Memory (DealMind)
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                {comparison.withMemory.retrievedCount} Memories Activated
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-indigo-500/30 text-xs text-indigo-200 font-mono">
              <span className="text-indigo-400 block mb-1">Sales Rep Prompt:</span>
              "{selectedPrompt}"
            </div>

            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-xs text-slate-100 leading-relaxed shadow-inner">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" />
                DealMind Context-Aware Output:
              </span>
              "{comparison.withMemory.response}"
            </div>

            {/* Recalled Memories Showcase */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">
                Evidence Recalled from Past Conversations:
              </span>
              <div className="space-y-1.5">
                {comparison.withMemory.memoriesUsed.map((mem, idx) => (
                  <div
                    key={mem.id}
                    className="p-2 rounded-lg bg-slate-900/90 border border-indigo-500/30 flex items-center justify-between text-[11px]"
                  >
                    <span className="text-slate-200 truncate pr-2 font-medium">
                      <strong className="text-indigo-400 font-mono mr-1">#{idx + 1}</strong>
                      {mem.extractedFact}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 shrink-0">
                      {mem.relativeDate || 'Past'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>The Hindsight Advantage:</strong> {comparison.withMemory.advantage}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
