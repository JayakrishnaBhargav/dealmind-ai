import React from 'react';
import {
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Brain,
  Clock,
  Swords,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useDealMind } from '../../context/DealMindContext';

export const DealsView: React.FC = () => {
  const { deals, customers, setActiveCustomerId, setActiveView } = useDealMind();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Briefcase className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Deal Intelligence</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {deals.length} Active Pipelines
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Interaction-derived deal knowledge, sentiment signals, and outstanding risk mitigation.
          </p>
        </div>

        <button
          onClick={() => setActiveView('meeting-prep')}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all active:scale-95"
        >
          Prepare Active Deal Briefing
        </button>
      </div>

      {/* Deals Cards */}
      <div className="space-y-6">
        {deals.map((deal) => {
          const customer = customers.find((c) => c.id === deal.customerId);

          return (
            <div
              key={deal.id}
              className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-all shadow-lg space-y-5"
            >
              {/* Header Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-bold text-white tracking-tight">
                      {deal.title}
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-semibold ${
                        deal.health === 'healthy'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {deal.health.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Lead: <strong className="text-slate-200">{deal.owner}</strong> • Target Close:{' '}
                    <span className="font-mono text-slate-300">{deal.closeDate}</span>
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-mono">Deal Value</span>
                    <span className="text-lg font-bold text-emerald-400 font-mono">
                      ₹{deal.value.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (customer) {
                        setActiveCustomerId(customer.id);
                        setActiveView('conversation');
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold border border-slate-700 transition-colors"
                  >
                    Open Account →
                  </button>
                </div>
              </div>

              {/* Summary narrative */}
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                {deal.summary}
              </p>

              {/* Deal Knowledge Growth Visual Indicator */}
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-indigo-400" />
                    <span className="font-bold text-white">Deal Knowledge Growth</span>
                  </div>
                  <span className="font-mono text-indigo-300 text-xs font-semibold">
                    {deal.knowledgeGrowthRate}% Deep Context ({deal.memoryCount} Memories)
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${deal.knowledgeGrowthRate}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Calculated from extracted objections, competitor evaluations, and verified stakeholder requirements over time.
                </p>
              </div>

              {/* Multi-point Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {/* Major Objections */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-rose-500/20 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-rose-300 tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    Major Objections Recorded
                  </span>
                  <div className="space-y-1 text-xs text-slate-300">
                    {deal.majorObjections.map((obj, i) => (
                      <p key={i} className="line-clamp-2">
                        • {obj}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Competitors */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-amber-500/20 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider flex items-center gap-1.5">
                    <Swords className="w-3.5 h-3.5 text-amber-400" />
                    Competitor Mentions
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {deal.competitors.map((comp, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-mono"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Next Action & Commitment */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-indigo-500/30 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    Crucial Next Action
                  </span>
                  <p className="text-xs text-slate-200 line-clamp-3 leading-snug">
                    {deal.nextAction}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
