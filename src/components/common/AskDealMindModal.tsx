import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  HelpCircle,
  Database,
  ArrowRight,
  Brain,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { useDealMind } from '../../context/DealMindContext';
import { askDealMindViaGemini } from '../../services/apiBridge';
import { HindsightMemory } from '../../types';

export const AskDealMindModal: React.FC = () => {
  const { isAskDealMindOpen, setIsAskDealMindOpen, activeCustomer, customerMemories, hindsightService } =
    useDealMind();

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    answer: string;
    keyTakeaways: string[];
    whyAmISayingThis: string[];
    recommendedAction?: string;
    memoriesUsed: HindsightMemory[];
  } | null>(null);
  const [showMemoryBreakdown, setShowMemoryBreakdown] = useState(true);

  if (!isAskDealMindOpen) return null;

  const examplePrompts = [
    `Prepare me for ${activeCustomer.name.split(' ')[0]}'s meeting`,
    `What objections has ${activeCustomer.name.split(' ')[0]} raised?`,
    `Which competitors has this customer mentioned?`,
    `What did I promise ${activeCustomer.name.split(' ')[0]}?`,
    `What does this customer care about most?`,
    `When did pricing first become an issue?`,
    `Summarize our entire relationship`,
  ];

  const handleAsk = async (queryText: string) => {
    if (!queryText.trim()) return;
    setLoading(true);

    // 1. Retrieve relevant Hindsight memories
    const recalled = hindsightService.retrieveMemories(activeCustomer.id, queryText, { limit: 4 });

    // 2. Query Gemini via Server Bridge
    const geminiRes = await askDealMindViaGemini(activeCustomer, queryText, recalled);

    if (geminiRes) {
      setResponse({
        answer: geminiRes.answer,
        keyTakeaways: geminiRes.keyTakeaways || [],
        whyAmISayingThis: geminiRes.whyAmISayingThis || [],
        recommendedAction: geminiRes.recommendedAction,
        memoriesUsed: recalled,
      });
    } else {
      // Deterministic Hindsight fallback synthesis
      const objectionMem = recalled.find((m) => m.category === 'Objection' || m.category === 'Pricing');
      const competitorMem = recalled.find((m) => m.category === 'Competitor');
      const commitmentMem = recalled.find((m) => m.category === 'Commitment');

      let answer = `${activeCustomer.name} (${activeCustomer.role} at ${activeCustomer.company}) has a deal in ${activeCustomer.stage} valued at ${activeCustomer.formattedDealValue}. `;
      const takeaways: string[] = [];
      const whyReasons: string[] = [];

      if (queryText.toLowerCase().includes('objection')) {
        answer += `The primary recorded objections center on ${objectionMem?.extractedFact || 'pricing sensitivity and multi-year commitment terms'}.`;
        takeaways.push('Pricing objection logged on March 5 (₹8.5L exceeds initial Q1 departmental budget)');
        takeaways.push('CFO Priya Rao requires 9-month ROI payback proof before approving expenditures above ₹5,00,000');
      } else if (queryText.toLowerCase().includes('competitor')) {
        answer += `${activeCustomer.name} explicitly noted that their procurement team is reviewing ${competitorMem?.extractedFact || 'Salesforce Data Cloud'}.`;
        takeaways.push('Salesforce Data Cloud actively benchmarked by procurement');
        takeaways.push('DealMind differentiator: zero 6-month consulting integration, immediate memory recall');
      } else if (queryText.toLowerCase().includes('promise') || queryText.toLowerCase().includes('commitment')) {
        answer += `You have an open commitment logged on March 25: "${commitmentMem?.extractedFact || 'Deliver 3-phase migration blueprint with zero downtime guarantee'}".`;
        takeaways.push('Deliver 3-phase migration blueprint with zero downtime guarantee before next call');
        takeaways.push('Ensure migration SLA covers 3 years of legacy CRM data preservation');
      } else {
        answer += `Based on ${recalled.length} retrieved Hindsight memories, ${activeCustomer.name}'s priorities are minimizing technical migration disruption, securing an annual contract discount, and satisfying CFO Priya Rao's ROI threshold.`;
        takeaways.push(`Customer is evaluating competitors while managing tight Q1 budget`);
        takeaways.push(`Key decision maker: Priya Rao (CFO) requires hard ROI payback within 9 months`);
        takeaways.push(`Open commitment pending: 3-phase migration roadmap`);
      }

      recalled.forEach((m) => {
        whyReasons.push(`[${m.relativeDate || 'Previous Call'}] ${m.category}: "${m.extractedFact}"`);
      });

      setResponse({
        answer,
        keyTakeaways: takeaways,
        whyAmISayingThis: whyReasons,
        recommendedAction: 'Review the migration blueprint and lead with the 15% annual billing discount clause.',
        memoriesUsed: recalled,
      });
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-2xl bg-[#0F1420] border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Ask DealMind</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Target: {activeCustomer.name}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Queries Hindsight persistent memory layer for instant factual context
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAskDealMindOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Preset Questions */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-indigo-400" />
              <span>Suggested questions for {activeCustomer.name}:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {examplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputQuery(prompt);
                    handleAsk(prompt);
                  }}
                  className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-900/40 border border-slate-700 hover:border-indigo-500/50 text-[11px] text-slate-300 hover:text-white transition-all text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Response Container */}
          {loading && (
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-center gap-3 text-slate-400">
              <div className="relative">
                <Brain className="w-8 h-8 text-indigo-400 animate-pulse" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping"></span>
              </div>
              <p className="text-xs font-medium">
                Searching Hindsight memory bank & synthesizing consultative intelligence...
              </p>
            </div>
          )}

          {response && !loading && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Answer Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950/30 border border-indigo-500/30 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    DealMind Response
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {response.memoriesUsed.length} Memories Activated
                  </span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-normal">
                  {response.answer}
                </p>

                {response.keyTakeaways.length > 0 && (
                  <div className="pt-2 border-t border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Key Takeaways
                    </span>
                    <ul className="space-y-1">
                      {response.keyTakeaways.map((point, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {response.recommendedAction && (
                  <div className="p-2.5 rounded-lg bg-indigo-900/30 border border-indigo-500/40 flex items-center justify-between text-xs text-indigo-200">
                    <span className="font-semibold">Recommended Action:</span>
                    <span>{response.recommendedAction}</span>
                  </div>
                )}
              </div>

              {/* Memory Explanation: "Why am I saying this?" */}
              <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
                <button
                  onClick={() => setShowMemoryBreakdown(!showMemoryBreakdown)}
                  className="w-full px-4 py-2.5 bg-slate-800/60 hover:bg-slate-800 flex items-center justify-between text-xs font-semibold text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-400" />
                    <span className="text-white">Why am I saying this? (Memory Provenance)</span>
                  </div>
                  <span className="text-[11px] text-indigo-400 font-mono">
                    {showMemoryBreakdown ? 'Hide Source Citations ▲' : 'Show Source Citations ▼'}
                  </span>
                </button>

                {showMemoryBreakdown && (
                  <div className="p-4 space-y-3 bg-slate-950/40">
                    <p className="text-[11px] text-slate-400">
                      DealMind retrieved the following persistent facts from past interactions to formulate this response:
                    </p>
                    <div className="space-y-2">
                      {response.memoriesUsed.map((mem, idx) => (
                        <div
                          key={mem.id}
                          className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
                              <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] flex items-center justify-center font-bold">
                                {idx + 1}
                              </span>
                              {mem.relativeDate || 'Past Interaction'} • {mem.category}
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400">
                              Relevance: {Math.round((mem.relevanceScore || 0.85) * 100)}%
                            </span>
                          </div>
                          <p className="text-slate-200 font-medium">{mem.extractedFact}</p>
                          {mem.sourceQuote && (
                            <p className="text-[11px] text-slate-500 italic">
                              "{mem.sourceQuote}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk(inputQuery);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask DealMind about your customers, deals, or meetings..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all active:scale-95"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
