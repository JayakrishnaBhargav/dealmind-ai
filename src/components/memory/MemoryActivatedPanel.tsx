import React from 'react';
import {
  Brain,
  Sparkles,
  Layers,
  Clock,
  Tag,
  ShieldCheck,
  TrendingUp,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { HindsightMemory, MemoryCategory } from '../../types';

interface MemoryActivatedPanelProps {
  activatedMemories: HindsightMemory[];
  customerName: string;
  onExploreMemory?: () => void;
}

export const MemoryActivatedPanel: React.FC<MemoryActivatedPanelProps> = ({
  activatedMemories,
  customerName,
  onExploreMemory,
}) => {
  const getCategoryColor = (category: MemoryCategory) => {
    switch (category) {
      case 'Objection':
      case 'Pricing':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'Competitor':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Commitment':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Technical Requirement':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'Decision Maker':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'Customer Preference':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      default:
        return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
    }
  };

  return (
    <div className="w-80 border-l border-slate-800 bg-[#0A0E17] flex flex-col h-full shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Brain className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Memory Activated
              </h3>
              <p className="text-[11px] text-slate-400">Hindsight Real-Time Retrieval</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
            {activatedMemories.length} Recalled
          </span>
        </div>

        {/* Visual Callout */}
        <div className="mt-3 p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-[11px] text-indigo-200 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>Responses are dynamically calibrated using these recalled facts.</span>
        </div>
      </div>

      {/* Memory List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {activatedMemories.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-xs space-y-2">
            <Brain className="w-8 h-8 text-slate-700 mx-auto" />
            <p>No memories triggered yet. Say something in conversation to query Hindsight.</p>
          </div>
        ) : (
          activatedMemories.map((mem, idx) => (
            <div
              key={mem.id}
              className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-all text-xs space-y-2 group shadow-sm"
            >
              {/* Top metadata */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getCategoryColor(
                    mem.category
                  )}`}
                >
                  {mem.category}
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {Math.round((mem.relevanceScore || 0.9) * 100)}% match
                </span>
              </div>

              {/* Memory Fact */}
              <p className="text-slate-200 font-medium leading-snug">{mem.extractedFact}</p>

              {/* Source date and quote */}
              <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {mem.relativeDate || 'Past interaction'}
                </span>
                <span className="text-slate-500">Node #{idx + 1}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Explore */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        <button
          onClick={onExploreMemory}
          className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-800 hover:border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
        >
          <span>View Full Memory Graph</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    </div>
  );
};
