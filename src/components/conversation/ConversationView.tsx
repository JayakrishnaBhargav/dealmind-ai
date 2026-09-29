import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Play,
  RotateCcw,
  Sparkles,
  Brain,
  CheckCircle2,
  AlertCircle,
  Clock,
  Briefcase,
  User,
  Building,
  Layers,
  Zap,
} from 'lucide-react';
import { useDealMind } from '../../context/DealMindContext';
import { MemoryActivatedPanel } from '../memory/MemoryActivatedPanel';
import { HindsightMemory } from '../../types';

export const ConversationView: React.FC = () => {
  const {
    activeCustomer,
    customerMemories,
    simulationSteps,
    currentSimStepIndex,
    isSimulating,
    runNextSimulationStep,
    resetSimulation,
    addMessageAndExtractMemory,
    setActiveView,
    hindsightService,
  } = useDealMind();

  const [inputMessage, setInputMessage] = useState('');
  const [speakerRole, setSpeakerRole] = useState<'customer' | 'sales_rep'>('customer');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastExtractedMemory, setLastExtractedMemory] = useState<HindsightMemory | null>(null);

  // Chat conversation history state
  const [messages, setMessages] = useState<Array<{
    id: string;
    sender: 'customer' | 'sales_rep' | 'agent';
    speakerName: string;
    text: string;
    timestamp: string;
    extractedMemory?: HindsightMemory | null;
  }>>([
    {
      id: 'init-1',
      sender: 'sales_rep',
      speakerName: 'Vikram Seth (AE)',
      text: 'Hi Rahul, thanks for jumping on. I know you had a chance to test the sandbox. How is the team feeling about the persistent memory recall?',
      timestamp: '10:00 AM',
    },
    {
      id: 'init-2',
      sender: 'customer',
      speakerName: activeCustomer.name,
      text: 'We really like the recall precision, but our management is reviewing overall vendor budgets for Q1 and pricing is top of mind.',
      timestamp: '10:02 AM',
      extractedMemory: customerMemories.find((m) => m.category === 'Objection') || null,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSimulating]);

  // Recalled memories for the active conversation state
  const lastMessageText = messages[messages.length - 1]?.text || 'meeting prep';
  const activatedMemories = hindsightService.retrieveMemories(activeCustomer.id, lastMessageText, {
    limit: 4,
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isProcessing) return;

    const userText = inputMessage;
    setInputMessage('');
    setIsProcessing(true);

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = `msg-${Date.now()}`;

    // 1. Run Hindsight memory extraction
    const extracted = await addMessageAndExtractMemory(activeCustomer.id, userText, speakerRole);

    setLastExtractedMemory(extracted);

    // Append user message
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: speakerRole,
        speakerName: speakerRole === 'customer' ? activeCustomer.name : 'Vikram Seth (AE)',
        text: userText,
        timestamp: now,
        extractedMemory: extracted,
      },
    ]);

    // 2. Generate simulated AI Sales Agent coaching response
    setTimeout(() => {
      const recalled = hindsightService.retrieveMemories(activeCustomer.id, userText, { limit: 2 });
      let agentReply = '';

      if (extracted) {
        agentReply = `[DealMind Auto-Coaching]: Remembered ${extracted.category}. Suggested counter: acknowledge ${activeCustomer.name}'s priority and tie our value directly to CFO approval thresholds.`;
      } else {
        agentReply = `[DealMind Auto-Coaching]: Filtered out conversational pleasantry. Keeping focus on the ${activeCustomer.formattedDealValue} closing roadmap.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          sender: 'agent',
          speakerName: 'DealMind Agent',
          text: agentReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsProcessing(false);
    }, 600);
  };

  const handleRunSimulatorStep = async () => {
    if (currentSimStepIndex >= simulationSteps.length) return;
    const step = simulationSteps[currentSimStepIndex];

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Run context simulation step
    await runNextSimulationStep();

    // Add step messages
    setMessages((prev) => [
      ...prev,
      {
        id: `sim-cust-${Date.now()}`,
        sender: 'customer',
        speakerName: activeCustomer.name,
        text: step.customerMessage,
        timestamp: now,
        extractedMemory: {
          id: `sim-m-${Date.now()}`,
          customerId: activeCustomer.id,
          category: step.newMemory.category,
          extractedFact: step.newMemory.fact,
          importance: step.newMemory.importance,
          timestamp: new Date().toISOString(),
        },
      },
      {
        id: `sim-agent-${Date.now()}`,
        sender: 'agent',
        speakerName: 'DealMind (With Hindsight Memory)',
        text: step.agentResponse,
        timestamp: now,
      },
    ]);
  };

  return (
    <div className="flex h-[calc(100vh-8.5rem)] rounded-2xl bg-[#0B0F17] border border-slate-800 shadow-2xl overflow-hidden">
      {/* Left Column: Customer Context Brief */}
      <div className="w-72 border-r border-slate-800 bg-[#0A0E17] p-4 flex flex-col justify-between overflow-y-auto shrink-0 hidden lg:flex">
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <img
              src={activeCustomer.avatar}
              alt={activeCustomer.name}
              className="w-11 h-11 rounded-xl object-cover ring-2 ring-indigo-500/40"
            />
            <div className="min-w-0">
              <h2 className="text-xs font-bold text-white truncate">{activeCustomer.name}</h2>
              <p className="text-[11px] text-slate-400 truncate">{activeCustomer.role}</p>
              <p className="text-[10px] text-slate-500 truncate">{activeCustomer.company}</p>
            </div>
          </div>

          {/* Deal snapshot */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Deal Value:</span>
              <span className="font-mono font-bold text-emerald-400">
                {activeCustomer.formattedDealValue}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Pipeline Stage:</span>
              <span className="font-semibold text-indigo-300">{activeCustomer.stage}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Sentiment:</span>
              <span className="font-semibold text-amber-400">{activeCustomer.sentimentLabel}</span>
            </div>
          </div>

          {/* Top Concerns Recorded */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Top Concerns (From Memory)
            </span>
            <div className="space-y-1">
              {activeCustomer.topConcerns.slice(0, 3).map((concern, i) => (
                <div
                  key={i}
                  className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-300 leading-snug"
                >
                  • {concern}
                </div>
              ))}
            </div>
          </div>

          {/* Competitors Mentioned */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Competitors in Play
            </span>
            <div className="flex flex-wrap gap-1">
              {activeCustomer.competitorsMentioned.map((comp) => (
                <span
                  key={comp}
                  className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono text-amber-300"
                >
                  {comp}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveView('meeting-prep')}
          className="w-full py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-semibold text-indigo-300 transition-colors"
        >
          Prepare Meeting Briefing →
        </button>
      </div>

      {/* Middle Column: Chat / Conversation Stream */}
      <div className="flex-1 flex flex-col bg-[#0F1420] min-w-0">
        {/* Simulator Banner */}
        <div className="p-3 bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-indigo-500/20 text-indigo-400">
              <Zap className="w-3.5 h-3.5" />
            </span>
            <div>
              <span className="text-xs font-bold text-white">Conversation Simulator</span>
              <span className="text-[11px] text-slate-400 ml-2 hidden sm:inline">
                Test Hindsight real-time extraction across multi-call cycles
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunSimulatorStep}
              disabled={currentSimStepIndex >= simulationSteps.length}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>
                {currentSimStepIndex >= simulationSteps.length
                  ? 'Simulation Complete'
                  : `Run Step ${currentSimStepIndex + 1} of 4`}
              </span>
            </button>
            <button
              onClick={resetSimulation}
              title="Reset Simulator"
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isCustomer = msg.sender === 'customer';
            const isAgent = msg.sender === 'agent';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  isCustomer ? 'items-start' : isAgent ? 'items-center my-2' : 'items-end'
                }`}
              >
                {/* Speaker Tag */}
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1 font-mono">
                  <span>{msg.speakerName}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                    isCustomer
                      ? 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-sm'
                      : isAgent
                      ? 'bg-indigo-950/60 border border-indigo-500/40 text-indigo-200 rounded-xl w-[90%] text-center font-medium shadow-indigo-500/10'
                      : 'bg-indigo-600 text-white rounded-tr-sm'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Extracted Memory Pill Badge */}
                  {msg.extractedMemory && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[10px] font-mono text-emerald-300 bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/30">
                      <div className="flex items-center gap-1.5 truncate">
                        <Brain className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="font-semibold uppercase text-emerald-400">
                          {msg.extractedMemory.category} Memorized:
                        </span>
                        <span className="truncate">{msg.extractedMemory.extractedFact}</span>
                      </div>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold shrink-0">
                        Saved
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90">
          <form onSubmit={handleSendMessage} className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span>Speaking as:</span>
                <button
                  type="button"
                  onClick={() => setSpeakerRole('customer')}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                    speakerRole === 'customer'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Customer ({activeCustomer.name.split(' ')[0]})
                </button>
                <button
                  type="button"
                  onClick={() => setSpeakerRole('sales_rep')}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                    speakerRole === 'sales_rep'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Sales Rep (You)
                </button>
              </div>

              <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                Hindsight cognitive filter active
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={
                  speakerRole === 'customer'
                    ? `Simulate customer message (e.g. 'We need to migrate our DB without downtime')...`
                    : `Enter your message (e.g. 'I promise we will deliver the migration plan by Friday')...`
                }
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isProcessing}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all active:scale-95"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Column: Memory Activated Panel */}
      <MemoryActivatedPanel
        activatedMemories={activatedMemories}
        customerName={activeCustomer.name}
        onExploreMemory={() => setActiveView('memory')}
      />
    </div>
  );
};
