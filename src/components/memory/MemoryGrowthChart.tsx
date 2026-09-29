import React from 'react';
import {
  TrendingUp,
  Brain,
  Sparkles,
  CheckCircle2,
  Lock,
  Layers,
  Zap,
  Target,
  ShieldCheck,
} from 'lucide-react';
import { useDealMind } from '../../context/DealMindContext';

export const MemoryGrowthChart: React.FC = () => {
  const { activeCustomer, hindsightService } = useDealMind();
  const stages = hindsightService.calculateLearningCurve(activeCustomer);

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl space-y-6">
      {/* Title & Concept */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              DealMind Learning Curve
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Hindsight Cognitive Compounding
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            The more interactions logged with {activeCustomer.name}, the deeper DealMind's predictive intelligence becomes.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700">
          <Brain className="w-4 h-4 text-purple-400" />
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block leading-none">Deal Intelligence</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">
              Level {activeCustomer.learningLevel} / 5
            </span>
          </div>
        </div>
      </div>

      {/* Visual Progression Curve Steps */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {stages.map((stage, idx) => {
          const isCurrentOrPast = idx + 1 <= activeCustomer.learningLevel;
          const isCurrent = idx + 1 === activeCustomer.learningLevel;

          return (
            <div
              key={stage.interaction}
              className={`relative p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
                isCurrent
                  ? 'bg-gradient-to-b from-indigo-950/80 to-purple-950/40 border-indigo-500 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/50'
                  : isCurrentOrPast
                  ? 'bg-slate-900/90 border-slate-700/80 hover:border-slate-600'
                  : 'bg-slate-950/50 border-slate-800/60 opacity-60'
              }`}
            >
              {/* Top tag */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                  {stage.interaction}
                </span>
                {isCurrentOrPast ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                )}
              </div>

              {/* Title & Desc */}
              <div className="space-y-1 mb-3">
                <h4 className="text-xs font-bold text-white leading-tight">{stage.title}</h4>
                <p className="text-[11px] text-slate-400 leading-snug">{stage.description}</p>
              </div>

              {/* Capabilities Unlocked */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1">
                <span className="text-[9px] uppercase font-mono text-slate-500 block font-semibold">
                  Unlocked:
                </span>
                {stage.unlockedCapabilities.map((cap, i) => (
                  <div key={i} className="text-[10px] text-slate-300 flex items-center gap-1.5 truncate">
                    <span className="w-1 h-1 rounded-full bg-indigo-400 shrink-0"></span>
                    <span className="truncate">{cap}</span>
                  </div>
                ))}
              </div>

              {/* Score bar */}
              <div className="mt-3 pt-2">
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>Depth</span>
                  <span className="text-indigo-300 font-semibold">{stage.intelligenceScore}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCurrentOrPast
                        ? 'bg-gradient-to-r from-indigo-500 to-emerald-400'
                        : 'bg-slate-700'
                    }`}
                    style={{ width: `${stage.intelligenceScore}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Philosophy Callout */}
      <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong className="text-white">The Compounding Advantage:</strong> Unlike stateless LLMs that reset on every prompt, DealMind's Hindsight layer retains every objection, competitor mention, and commitment forever.
          </span>
        </div>
      </div>
    </div>
  );
};
