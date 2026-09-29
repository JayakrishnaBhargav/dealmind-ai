import React, { useState } from 'react';
import {
  X,
  Play,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Brain,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldAlert,
  GitCompare,
  TrendingUp,
} from 'lucide-react';
import { useDealMind } from '../../context/DealMindContext';

interface DemoStep {
  stepNumber: number;
  title: string;
  badge: string;
  description: string;
  content: {
    speaker?: string;
    statement?: string;
    hindsightAction: string;
    memoryItem?: {
      category: string;
      fact: string;
      importance: string;
    };
    aiOutcome?: string;
  };
}

export const HackathonDemoModal: React.FC = () => {
  const { isDemoTourOpen, setIsDemoTourOpen, setActiveView, setActiveCustomerId } = useDealMind();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isDemoTourOpen) return null;

  const demoSteps: DemoStep[] = [
    {
      stepNumber: 1,
      title: 'Target Customer Selection',
      badge: 'Account Baseline',
      description: 'The sales rep opens Rahul Sharma (CTO at ABC Technologies) who has an ₹8,50,000 enterprise deal in Negotiation.',
      content: {
        hindsightAction: 'DealMind loads existing relationship profile and seeds memory store with account metadata and key stakeholders (CTO Rahul Sharma, CFO Priya Rao).',
        memoryItem: {
          category: 'Decision Maker',
          fact: 'Priya Rao (CFO) holds final sign-off authority on expenditures exceeding ₹5,00,000.',
          importance: 'high',
        },
        aiOutcome: 'Baseline intelligence ready. The agent is ready to listen to customer interactions.',
      },
    },
    {
      stepNumber: 2,
      title: 'First Interaction: Pricing Objection Raised',
      badge: 'Call #1',
      description: 'During a budget call, Rahul expresses concern about software pricing.',
      content: {
        speaker: 'Rahul Sharma (Customer)',
        statement: 'We really like your product, but the ₹8.5L pricing is quite high compared to our allocated Q1 budget.',
        hindsightAction: 'Hindsight cognitive parser identifies high-friction commercial boundary and rejects conversational noise.',
        memoryItem: {
          category: 'Objection',
          fact: 'Pricing is a major concern: Customer stated ₹8.5L exceeds allocated Q1 departmental budget.',
          importance: 'critical',
        },
        aiOutcome: 'Persistent memory record created and linked to the ABC Tech deal graph.',
      },
    },
    {
      stepNumber: 3,
      title: 'Second Interaction: Competitor & Migration Risk',
      badge: 'Call #2',
      description: 'A week later, procurement brings in Salesforce, and the CTO flags migration downtime fears.',
      content: {
        speaker: 'Rahul Sharma (Customer)',
        statement: 'Our procurement team is reviewing Salesforce Data Cloud. And our CTO is worried about migration complexity and losing call history.',
        hindsightAction: 'Hindsight instantly extracts TWO critical memories: competitor threat and technical migration constraint.',
        memoryItem: {
          category: 'Technical Requirement',
          fact: 'CTO deeply worried about migration complexity and losing 3 years of legacy CRM call logs.',
          importance: 'critical',
        },
        aiOutcome: 'Deal health automatically flagged to "Warning" due to competitor threat.',
      },
    },
    {
      stepNumber: 4,
      title: 'Rep Makes an Open Commitment',
      badge: 'Call #2 Follow-up',
      description: 'Sales rep Vikram promises a 3-phase migration blueprint with zero downtime before the next call.',
      content: {
        speaker: 'Vikram Seth (Sales Rep)',
        statement: 'I will personally prepare an end-to-end migration roadmap showing zero downtime and send it before our next review.',
        hindsightAction: 'Hindsight tracks salesperson commitments as an active follow-up item so promises are never forgotten.',
        memoryItem: {
          category: 'Commitment',
          fact: 'Sales rep Vikram promised to deliver 3-phase migration blueprint with zero-data-loss guarantee by Friday.',
          importance: 'critical',
        },
        aiOutcome: 'Open commitment tracked. DealMind will alert the rep before any future meeting with Rahul.',
      },
    },
    {
      stepNumber: 5,
      title: 'Customer States Commercial Preference',
      badge: 'Email Thread',
      description: 'Rahul clarifies billing requirements from finance.',
      content: {
        speaker: 'Rahul Sharma (Customer)',
        statement: 'Our accounts department strictly prefers annual billing with pre-scheduled invoicing rather than per-seat card charges.',
        hindsightAction: 'Hindsight stores operational preference, mapping it directly to the closing strategy.',
        memoryItem: {
          category: 'Customer Preference',
          fact: 'Preference: Customer strictly requires annual PO invoicing rather than monthly per-seat credit cards.',
          importance: 'medium',
        },
        aiOutcome: 'Deal intelligence reaches Level 4/5. Accumulated customer knowledge is now superior to human notes.',
      },
    },
    {
      stepNumber: 6,
      title: 'Meeting Prep: "Prepare Me" for Strategy Review',
      badge: 'Hero Workflow',
      description: 'Tomorrow morning at 10:30 AM, the rep has a critical review. One click generates a hyper-targeted briefing.',
      content: {
        hindsightAction: 'DealMind retrieves 6 interconnected episodic memories across pricing, Salesforce competitor, migration fear, and the unfulfilled blueprint commitment.',
        aiOutcome: 'Generates executive briefing: highlights the open commitment first, gives counter-tactics against Salesforce, and provides objection rebuttals for CFO Priya Rao.',
      },
    },
    {
      stepNumber: 7,
      title: 'Memory Explanation: "Why Am I Saying This?"',
      badge: 'Transparency',
      description: 'Every recommendation displays exact source citations from past calls, eliminating AI hallucination.',
      content: {
        hindsightAction: 'Auditable memory citations: March 5 (Pricing objection), March 10 (Salesforce quote), March 14 (Migration fear), March 25 (Rep promise).',
        aiOutcome: 'Sales reps and managers have 100% confidence because every piece of advice is anchored in historical evidence.',
      },
    },
    {
      stepNumber: 8,
      title: 'The Contrast: Stateless AI vs DealMind with Hindsight',
      badge: 'Why Memory Matters',
      description: 'Comparing generic AI against DealMind shows why persistent memory wins deals.',
      content: {
        statement: 'Question: "How should I handle tomorrow\'s call with Rahul?"',
        hindsightAction: 'WITHOUT MEMORY: Generic advice to "talk about product features and ask about budget". WITH HINDSIGHT: Flags the exact open promise, addresses the CFO sign-off threshold, and counters Salesforce.',
        aiOutcome: 'Deal closed faster, zero forgotten promises, 10x rep productivity.',
      },
    },
  ];

  const currentStep = demoSteps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < demoSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setIsDemoTourOpen(false);
      setActiveCustomerId('cust-rahul');
      setActiveView('meeting-prep');
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-2xl bg-[#0F1420] border border-indigo-500/40 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Play className="w-4 h-4 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">60-Second Hackathon Walkthrough</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Step {currentStep.stepNumber} of {demoSteps.length}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                How DealMind turns conversation into persistent customer intelligence
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDemoTourOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="px-6 py-2 bg-slate-900/80 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto">
          {demoSteps.map((s, idx) => (
            <button
              key={s.stepNumber}
              onClick={() => setCurrentStepIndex(idx)}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                idx === currentStepIndex
                  ? 'bg-gradient-to-r from-indigo-500 to-emerald-400'
                  : idx < currentStepIndex
                  ? 'bg-indigo-700/60'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {currentStep.badge}
              </span>
              <h2 className="text-base font-bold text-white">{currentStep.title}</h2>
            </div>
            <p className="text-xs text-slate-300">{currentStep.description}</p>
          </div>

          {/* Dialogue / Trigger Box */}
          {currentStep.content.statement && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                <span>{currentStep.content.speaker || 'Interaction Transcript'}</span>
                <span className="text-indigo-400 font-mono">Raw Audio / Text Input</span>
              </div>
              <p className="text-xs text-slate-100 italic bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                "{currentStep.content.statement}"
              </p>
            </div>
          )}

          {/* Hindsight Cognitive Action */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
              <Brain className="w-4 h-4 text-indigo-400" />
              <span>Hindsight Cognitive Action</span>
            </div>
            <p className="text-xs text-slate-200">{currentStep.content.hindsightAction}</p>

            {currentStep.content.memoryItem && (
              <div className="mt-2 p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                    {currentStep.content.memoryItem.category}
                  </span>
                  <p className="text-xs text-emerald-300 font-medium">
                    {currentStep.content.memoryItem.fact}
                  </p>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
                  {currentStep.content.memoryItem.importance}
                </span>
              </div>
            )}
          </div>

          {/* AI Outcome */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-slate-200">Outcome & Deal Impact</p>
              <p className="text-xs text-slate-400 mt-0.5">{currentStep.content.aiOutcome}</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 disabled:opacity-40 flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="text-xs text-slate-400 font-mono">
            {currentStepIndex + 1} / {demoSteps.length}
          </div>

          <button
            onClick={handleNext}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all active:scale-95"
          >
            <span>{currentStepIndex === demoSteps.length - 1 ? 'Go to Meeting Prep' : 'Next Step'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
