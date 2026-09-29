import React, { useState } from 'react';
import {
  Settings,
  Cpu,
  Brain,
  Database,
  Download,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  FileCode,
} from 'lucide-react';
import { useDealMind } from '../../context/DealMindContext';

export const SettingsView: React.FC = () => {
  const { memories, customers, deals, hindsightService } = useDealMind();
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [testText, setTestText] = useState('We really need to know if you support SOC-2 Type II audit reports.');
  const [testResult, setTestResult] = useState<any>(null);

  const handleExportJson = () => {
    const data = {
      dealMindVersion: '2.4-hindsight',
      timestamp: new Date().toISOString(),
      statistics: {
        totalMemories: memories.length,
        totalCustomers: customers.length,
        totalDeals: deals.length,
      },
      customers,
      deals,
      memories,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dealmind-hindsight-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleTestClassifier = () => {
    const res = hindsightService.analyzeAndExtractMemory(testText, customers[0].id, 'customer');
    setTestResult(res);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Settings className="w-5 h-5" />
          </span>
          <h1 className="text-xl font-bold text-white tracking-tight">System & Memory Engine Settings</h1>
        </div>
        <p className="text-xs text-slate-400">
          Inspect Hindsight persistent memory health, cognitive classification rules, and telemetry.
        </p>
      </div>

      {/* Engine Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Memory Layer</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
              Active
            </span>
          </div>
          <div className="text-base font-bold text-white font-mono">Hindsight v2.4</div>
          <p className="text-[11px] text-slate-400">
            Episodic, Semantic & Temporal Relationship Graph
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">AI Model Provider</span>
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">
              Server-Side
            </span>
          </div>
          <div className="text-base font-bold text-white font-mono">gemini-3.8-flash</div>
          <p className="text-[11px] text-slate-400">
            @google/genai SDK with autonomous cognitive fallback
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Total Memory Nodes</span>
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px]">
              Persistent
            </span>
          </div>
          <div className="text-base font-bold text-white font-mono">{memories.length} Nodes</div>
          <p className="text-[11px] text-slate-400">
            Across 4 enterprise customer relationships
          </p>
        </div>
      </div>

      {/* Interactive Cognitive Classifier Sandbox */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Brain className="w-4 h-4 text-indigo-400" />
            Hindsight Cognitive Classifier Sandbox
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Test how Hindsight filters out noise like "Hello" or "Thanks" and extracts factual business memory.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">
            Test Input Statement
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleTestClassifier}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
            >
              Analyze
            </button>
          </div>
        </div>

        {testResult !== null && (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">Extraction Result:</span>
              <span
                className={`font-mono text-[10px] px-2 py-0.5 rounded ${
                  testResult ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}
              >
                {testResult ? 'Meaningful Memory Captured' : 'Conversational Noise Filtered Out'}
              </span>
            </div>
            {testResult ? (
              <div className="space-y-1 pt-1 text-slate-300 font-mono text-[11px]">
                <p>
                  <strong className="text-indigo-400">Category:</strong> {testResult.category}
                </p>
                <p>
                  <strong className="text-indigo-400">Importance:</strong> {testResult.importance}
                </p>
                <p>
                  <strong className="text-indigo-400">Extracted Fact:</strong> {testResult.extractedFact}
                </p>
              </div>
            ) : (
              <p className="text-slate-400 italic">
                Statement rejected as non-persisted pleasantry. Hindsight only saves lasting facts.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Export Memory Graph */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-400" />
            Export Hindsight Memory Graph
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Download complete customer timeline, facts, commitments, and objection logs in structured JSON format.
          </p>
        </div>

        <button
          onClick={handleExportJson}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{downloadSuccess ? 'Downloaded!' : 'Export JSON'}</span>
        </button>
      </div>
    </div>
  );
};
