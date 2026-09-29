import React from 'react';
import {
  TrendingUp,
  Brain,
  AlertTriangle,
  Swords,
  Clock,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useDealMind } from '../../context/DealMindContext';

export const InsightsView: React.FC = () => {
  const { insights, setActiveCustomerId, setActiveView } = useDealMind();

  const getIcon = (type: string) => {
    switch (type) {
      case 'objection_pattern':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'competitor_pattern':
        return <Swords className="w-4 h-4 text-amber-400" />;
      case 'unresolved_commitment':
        return <Clock className="w-4 h-4 text-purple-400" />;
      case 'customer_preference':
        return <HeartHandshake className="w-4 h-4 text-blue-400" />;
      default:
        return <TrendingUp className="w-4 h-4 text-indigo-400" />;
    }
  };

  const getBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'medium':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Cross-Deal Strategic Insights
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              AI Synthesized
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Patterns, recurring objections, and commitment bottlenecks extracted across all customer interactions.
          </p>
        </div>

        <button
          onClick={() => setActiveView('conversation')}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all active:scale-95"
        >
          Add New Interaction →
        </button>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all shadow-md space-y-4"
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  {getIcon(insight.type)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{insight.title}</h3>
                  <span className="text-[11px] text-slate-400">
                    Account:{' '}
                    <strong className="text-slate-200">{insight.customerName}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border font-semibold ${getBadge(
                    insight.severity
                  )}`}
                >
                  {insight.severity} Priority
                </span>
                <button
                  onClick={() => {
                    setActiveCustomerId(insight.customerId);
                    setActiveView('meeting-prep');
                  }}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium border border-slate-700 transition-colors"
                >
                  Prepare Briefing →
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 leading-relaxed">{insight.description}</p>

            {/* Recommended Action */}
            <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex items-start gap-2.5 text-xs text-indigo-200">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Recommended Action:</strong>
                <span>{insight.actionRecommendation}</span>
              </div>
            </div>

            {/* Evidence Memories */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold block">
                Evidence Recalled from Hindsight:
              </span>
              <div className="space-y-1">
                {insight.evidenceMemories.map((ev, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2 italic"
                  >
                    <span className="w-1 h-1 rounded-full bg-indigo-400 shrink-0"></span>
                    <span>"{ev}"</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
