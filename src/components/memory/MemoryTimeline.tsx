import React, { useState } from 'react';
import {
  Clock,
  Filter,
  Plus,
  Search,
  Sparkles,
  Tag,
  AlertCircle,
  CheckCircle,
  Quote,
  Trash2,
  Brain,
  Shield,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { useDealMind } from '../../context/DealMindContext';
import { MemoryCategory, MemoryImportance, HindsightMemory } from '../../types';

const CATEGORIES: Array<MemoryCategory | 'All'> = [
  'All',
  'Objection',
  'Competitor',
  'Commitment',
  'Technical Requirement',
  'Customer Preference',
  'Decision Maker',
  'Pricing',
  'Product Interest',
  'Follow-up',
];

export const MemoryTimeline: React.FC = () => {
  const {
    activeCustomer,
    customerMemories,
    filterCategory,
    setFilterCategory,
    searchQuery,
    setSearchQuery,
    addManualMemory,
    deleteMemory,
    hindsightService,
  } = useDealMind();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFact, setNewFact] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryCategory>('Customer Preference');
  const [newImportance, setNewImportance] = useState<MemoryImportance>('high');
  const [newQuote, setNewQuote] = useState('');

  // Filter memories
  const filteredMemories = customerMemories.filter((mem) => {
    const matchesCategory = filterCategory === 'All' || mem.category === filterCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      mem.extractedFact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (mem.sourceQuote && mem.sourceQuote.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFact.trim()) return;

    addManualMemory({
      customerId: activeCustomer.id,
      category: newCategory,
      extractedFact: newFact,
      importance: newImportance,
      sourceQuote: newQuote || undefined,
      sourceSpeaker: 'sales_rep',
      tags: ['manual-entry', newCategory.toLowerCase().replace(/\s+/g, '-')],
    });

    setNewFact('');
    setNewQuote('');
    setIsAddModalOpen(false);
  };

  const getImportanceBadge = (importance: MemoryImportance) => {
    switch (importance) {
      case 'critical':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'high':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'medium':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'low':
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  const getCategoryColor = (category: MemoryCategory) => {
    switch (category) {
      case 'Objection':
      case 'Pricing':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'Competitor':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Commitment':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Technical Requirement':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'Decision Maker':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'Customer Preference':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default:
        return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Brain className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Customer Memory</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {customerMemories.length} Memories Retained
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Everything DealMind has learned about this relationship across calls, emails, and meetings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Deal Fact</span>
          </button>
        </div>
      </div>

      {/* Filter and Category Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filterCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search memory graph..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Timeline View */}
      {filteredMemories.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3">
          <Brain className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">No memories matched your filter</p>
          <p className="text-xs text-slate-500">
            Try adjusting your search query or reset the category filter to 'All'.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-purple-500/40 before:to-slate-800">
          {filteredMemories.map((mem, idx) => (
            <div key={mem.id} className="relative group">
              {/* Timeline Bullet Node */}
              <div className="absolute -left-6 sm:-left-8 top-1.5 w-5 h-5 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-125 transition-transform">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
              </div>

              {/* Memory Card */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900 transition-all shadow-md space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getCategoryColor(
                        mem.category
                      )}`}
                    >
                      {mem.category}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded border ${getImportanceBadge(
                        mem.importance
                      )}`}
                    >
                      {mem.importance}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {mem.relativeDate || 'Past call'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500">
                      ID: {mem.id.substring(0, 10)}
                    </span>
                    <button
                      onClick={() => deleteMemory(mem.id)}
                      className="p-1 rounded text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete memory node"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Extracted Fact */}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-100 leading-snug">
                    {mem.extractedFact}
                  </p>
                </div>

                {/* Source Quote */}
                {mem.sourceQuote && (
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2">
                    <Quote className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                    <span className="italic">"{mem.sourceQuote}"</span>
                  </div>
                )}

                {/* Tags and Meta */}
                {mem.tags && mem.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 pt-1">
                    <Tag className="w-3 h-3 text-slate-500" />
                    {mem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Manual Memory Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-[#0F1420] border border-slate-700 shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-400" />
                Store New Deal Memory in Hindsight
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMemory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Extracted Fact / Memory Summary
                </label>
                <textarea
                  rows={3}
                  value={newFact}
                  onChange={(e) => setNewFact(e.target.value)}
                  placeholder="e.g. Customer requires 15% discount for 2-year upfront commitment..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as MemoryCategory)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Importance
                  </label>
                  <select
                    value={newImportance}
                    onChange={(e) => setNewImportance(e.target.value as MemoryImportance)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Verbatim Customer Quote (Optional)
                </label>
                <input
                  type="text"
                  value={newQuote}
                  onChange={(e) => setNewQuote(e.target.value)}
                  placeholder="e.g. 'We won't sign unless our finance team gets annual invoices.'"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
                >
                  Save to Hindsight
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
