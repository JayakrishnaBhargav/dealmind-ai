import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import {
  Customer,
  Deal,
  HindsightMemory,
  Conversation,
  ActivityEvent,
  CustomerInsight,
  MemoryCategory,
  SimulationStep,
} from '../types';
import {
  INITIAL_CUSTOMERS,
  INITIAL_DEALS,
  INITIAL_MEMORIES,
  INITIAL_CONVERSATIONS,
  INITIAL_ACTIVITIES,
  INITIAL_INSIGHTS,
} from '../data/mockData';
import { HindsightMemoryService } from '../services/hindsight';
import { extractMemoryViaGemini } from '../services/apiBridge';

export type ActiveView =
  | 'dashboard'
  | 'customers'
  | 'deals'
  | 'conversation'
  | 'memory'
  | 'meeting-prep'
  | 'insights'
  | 'landing'
  | 'settings';

interface DealMindContextType {
  customers: Customer[];
  activeCustomer: Customer;
  setActiveCustomerId: (id: string) => void;
  deals: Deal[];
  memories: HindsightMemory[];
  customerMemories: HindsightMemory[];
  conversations: Conversation[];
  activities: ActivityEvent[];
  insights: CustomerInsight[];
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  hindsightService: HindsightMemoryService;
  
  // Modals & Panels
  isAskDealMindOpen: boolean;
  setIsAskDealMindOpen: (open: boolean) => void;
  isDemoTourOpen: boolean;
  setIsDemoTourOpen: (open: boolean) => void;
  
  // Conversation Simulator
  simulationSteps: SimulationStep[];
  currentSimStepIndex: number;
  isSimulating: boolean;
  runNextSimulationStep: () => Promise<void>;
  resetSimulation: () => void;

  // Actions
  addMessageAndExtractMemory: (
    customerId: string,
    text: string,
    sender: 'customer' | 'sales_rep'
  ) => Promise<HindsightMemory | null>;
  addManualMemory: (memory: Partial<HindsightMemory>) => void;
  deleteMemory: (memoryId: string) => void;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterCategory: MemoryCategory | 'All';
  setFilterCategory: (category: MemoryCategory | 'All') => void;

  // Memory stats
  stats: {
    activeDealsCount: number;
    customersCount: number;
    upcomingMeetingsCount: number;
    pendingFollowUpsCount: number;
    memoriesCreatedCount: number;
    dealsAtRiskCount: number;
  };
}

const DealMindContext = createContext<DealMindContextType | undefined>(undefined);

export const SIMULATION_SCRIPT: SimulationStep[] = [
  {
    step: 1,
    customerMessage: 'We really like your product, but the ₹8.5L pricing is quite high compared to our allocated Q1 budget.',
    agentThought: 'Detected high-friction commercial concern. Evaluating budget allocation constraints.',
    newMemory: {
      category: 'Objection',
      fact: 'Pricing is a major concern: Customer stated ₹8.5L exceeds their allocated Q1 budget.',
      importance: 'critical',
    },
    agentResponse: 'I understand budget sensitivity is paramount for Q1, Rahul. Let’s look at structuring an annual commitment with milestone billing that fits neatly into your current cash flow.',
    retrievedMemoriesCount: 1,
  },
  {
    step: 2,
    customerMessage: 'Our procurement team has also engaged Salesforce for a quote on Data Cloud.',
    agentThought: 'Competitor alert: Salesforce Data Cloud under active evaluation. Activating competitive battlecard.',
    newMemory: {
      category: 'Competitor',
      fact: 'Competitor mentioned: Salesforce Data Cloud is under active evaluation by ABC Tech procurement.',
      importance: 'high',
    },
    agentResponse: 'Salesforce has strong brand recognition, but their Data Cloud requires a 6-month consulting integration. DealMind activates in 15 minutes with zero CRM migration downtime.',
    retrievedMemoriesCount: 2,
  },
  {
    step: 3,
    customerMessage: 'Our CTO is worried about migration. If we lose call histories during the switch, reps will revolt.',
    agentThought: 'Technical risk: Migration downtime and data loss fear identified. Needs ironclad SLA.',
    newMemory: {
      category: 'Technical Requirement',
      fact: 'Technical concern: CTO worried about migration complexity and losing historical call logs.',
      importance: 'critical',
    },
    agentResponse: 'That is completely fair. I will personally deliver a 3-phase migration blueprint with zero downtime and automated data parity verification before our next strategy review.',
    retrievedMemoriesCount: 3,
  },
  {
    step: 4,
    customerMessage: 'Our accounts department strictly prefers annual billing with pre-scheduled invoicing rather than per-seat card charges.',
    agentThought: 'Commercial preference identified: Annual invoicing with PO workflow unlocks CFO sign-off.',
    newMemory: {
      category: 'Customer Preference',
      fact: 'Preference: Customer strictly requires annual PO invoicing rather than monthly per-seat credit cards.',
      importance: 'medium',
    },
    agentResponse: 'Noted! We will configure the proposal with annual PO terms and invoice on net-30, matching your finance department’s standards exactly.',
    retrievedMemoriesCount: 4,
  },
];

export const DealMindProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [activeCustomerId, setActiveCustomerId] = useState<string>('cust-rahul');
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [memories, setMemories] = useState<HindsightMemory[]>(INITIAL_MEMORIES);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activities, setActivities] = useState<ActivityEvent[]>(INITIAL_ACTIVITIES);
  const [insights, setInsights] = useState<CustomerInsight[]>(INITIAL_INSIGHTS);
  
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [isAskDealMindOpen, setIsAskDealMindOpen] = useState(false);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<MemoryCategory | 'All'>('All');

  // Simulator
  const [currentSimStepIndex, setCurrentSimStepIndex] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  // Initialize Hindsight Engine
  const hindsightService = useMemo(() => {
    return new HindsightMemoryService(memories);
  }, [memories]);

  const activeCustomer = useMemo(() => {
    return customers.find((c) => c.id === activeCustomerId) || customers[0];
  }, [customers, activeCustomerId]);

  const customerMemories = useMemo(() => {
    return memories.filter((m) => m.customerId === activeCustomerId);
  }, [memories, activeCustomerId]);

  const stats = useMemo(() => {
    const atRisk = deals.filter((d) => d.health === 'warning' || d.health === 'at_risk').length;
    const commitments = memories.filter((m) => m.category === 'Commitment' && m.status === 'active').length;
    return {
      activeDealsCount: deals.length,
      customersCount: customers.length,
      upcomingMeetingsCount: 3,
      pendingFollowUpsCount: commitments,
      memoriesCreatedCount: memories.length,
      dealsAtRiskCount: atRisk,
    };
  }, [deals, customers, memories]);

  /**
   * Add message and run Hindsight Memory Extraction
   */
  const addMessageAndExtractMemory = useCallback(
    async (customerId: string, text: string, sender: 'customer' | 'sales_rep') => {
      const targetCustomer = customers.find((c) => c.id === customerId) || activeCustomer;

      // 1. Try Gemini API via server bridge
      let extracted = await extractMemoryViaGemini(targetCustomer, text, sender);

      // 2. If server API returned null or fallback, use local Hindsight heuristic engine
      let memoryToSave: HindsightMemory | null = null;
      if (extracted && extracted.isMeaningful && extracted.extractedFact) {
        memoryToSave = {
          id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          customerId,
          category: extracted.category || 'Product Interest',
          extractedFact: extracted.extractedFact,
          importance: extracted.importance || 'medium',
          timestamp: new Date().toISOString(),
          relativeDate: 'Just now',
          sourceSpeaker: sender,
          sourceQuote: text,
          status: 'active',
          tags: extracted.tags || ['ai-extracted'],
        };
      } else {
        // Fallback to internal cognitive parser
        memoryToSave = hindsightService.analyzeAndExtractMemory(text, customerId, sender);
      }

      if (memoryToSave) {
        setMemories((prev) => [memoryToSave!, ...prev]);

        // Log an activity event
        const newActivity: ActivityEvent = {
          id: `act-${Date.now()}`,
          type: memoryToSave.category === 'Objection' ? 'objection_logged' : 'memory_created',
          title: `${memoryToSave.category} Memorized`,
          description: `DealMind captured: ${memoryToSave.extractedFact}`,
          timestamp: 'Just now',
          customerId,
          customerName: targetCustomer.name,
          memoryCategory: memoryToSave.category,
        };
        setActivities((prev) => [newActivity, ...prev]);

        // Update customer memory learning level if enough memories
        setCustomers((prev) =>
          prev.map((c) => {
            if (c.id === customerId) {
              const currentTotal = memories.filter((m) => m.customerId === customerId).length + 1;
              const newLevel = Math.min(5, Math.max(1, Math.floor(currentTotal / 3) + 1));
              return {
                ...c,
                learningLevel: newLevel,
                lastInteraction: 'Just now',
              };
            }
            return c;
          })
        );
      }

      return memoryToSave;
    },
    [customers, activeCustomer, hindsightService, memories]
  );

  /**
   * Run next step in conversation simulator
   */
  const runNextSimulationStep = useCallback(async () => {
    if (currentSimStepIndex >= SIMULATION_SCRIPT.length) return;
    setIsSimulating(true);

    const step = SIMULATION_SCRIPT[currentSimStepIndex];
    const customer = customers.find((c) => c.id === 'cust-rahul') || activeCustomer;

    // Simulate extraction and saving of this step's memory
    const now = new Date();
    const newMemory: HindsightMemory = {
      id: `sim-mem-${Date.now()}`,
      customerId: customer.id,
      category: step.newMemory.category,
      extractedFact: step.newMemory.fact,
      importance: step.newMemory.importance,
      timestamp: now.toISOString(),
      relativeDate: 'Just now',
      sourceSpeaker: 'customer',
      sourceQuote: step.customerMessage,
      status: 'active',
      tags: ['simulation', step.newMemory.category.toLowerCase().replace(/\s+/g, '-')],
    };

    setMemories((prev) => [newMemory, ...prev]);

    // Add activity
    const newActivity: ActivityEvent = {
      id: `act-sim-${Date.now()}`,
      type: step.newMemory.category === 'Objection' ? 'objection_logged' : 'memory_created',
      title: `${step.newMemory.category} Memorized (Simulated)`,
      description: `DealMind extracted: ${step.newMemory.fact}`,
      timestamp: 'Just now',
      customerId: customer.id,
      customerName: customer.name,
      memoryCategory: step.newMemory.category,
    };
    setActivities((prev) => [newActivity, ...prev]);

    // Advance step
    setCurrentSimStepIndex((prev) => prev + 1);
    setIsSimulating(false);
  }, [currentSimStepIndex, customers, activeCustomer]);

  const resetSimulation = useCallback(() => {
    setCurrentSimStepIndex(0);
    setIsSimulating(false);
  }, []);

  const addManualMemory = useCallback((partial: Partial<HindsightMemory>) => {
    const newMem: HindsightMemory = {
      id: `mem-man-${Date.now()}`,
      customerId: partial.customerId || activeCustomerId,
      category: partial.category || 'Product Interest',
      extractedFact: partial.extractedFact || 'Custom note added by sales rep',
      importance: partial.importance || 'medium',
      timestamp: new Date().toISOString(),
      relativeDate: 'Today',
      sourceSpeaker: partial.sourceSpeaker || 'sales_rep',
      sourceQuote: partial.sourceQuote,
      status: 'active',
      tags: partial.tags || ['manual'],
    };
    setMemories((prev) => [newMem, ...prev]);
  }, [activeCustomerId]);

  const deleteMemory = useCallback((memoryId: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== memoryId));
  }, []);

  return (
    <DealMindContext.Provider
      value={{
        customers,
        activeCustomer,
        setActiveCustomerId,
        deals,
        memories,
        customerMemories,
        conversations,
        activities,
        insights,
        activeView,
        setActiveView,
        hindsightService,
        isAskDealMindOpen,
        setIsAskDealMindOpen,
        isDemoTourOpen,
        setIsDemoTourOpen,
        simulationSteps: SIMULATION_SCRIPT,
        currentSimStepIndex,
        isSimulating,
        runNextSimulationStep,
        resetSimulation,
        addMessageAndExtractMemory,
        addManualMemory,
        deleteMemory,
        searchQuery,
        setSearchQuery,
        filterCategory,
        setFilterCategory,
        stats,
      }}
    >
      {children}
    </DealMindContext.Provider>
  );
};

export const useDealMind = () => {
  const context = useContext(DealMindContext);
  if (!context) {
    throw new Error('useDealMind must be used within a DealMindProvider');
  }
  return context;
};
