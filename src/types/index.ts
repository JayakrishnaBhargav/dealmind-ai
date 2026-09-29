/**
 * DealMind Data Types & Interfaces
 * Central data schema for Customers, Deals, Conversations, and the Hindsight Memory Engine.
 */

export type MemoryCategory =
  | 'Customer Preference'
  | 'Objection'
  | 'Requirement'
  | 'Competitor'
  | 'Decision Maker'
  | 'Commitment'
  | 'Pain Point'
  | 'Product Interest'
  | 'Pricing'
  | 'Technical Requirement'
  | 'Meeting Outcome'
  | 'Follow-up';

export type MemoryImportance = 'critical' | 'high' | 'medium' | 'low';

export interface HindsightMemory {
  id: string;
  customerId: string;
  dealId?: string;
  conversationId?: string;
  category: MemoryCategory;
  extractedFact: string;
  importance: MemoryImportance;
  relevanceScore?: number; // 0 to 1.0 calculated on query retrieval
  timestamp: string; // ISO date string or formatted date
  relativeDate?: string;
  sourceSpeaker?: 'customer' | 'sales_rep' | 'system';
  sourceQuote?: string;
  status?: 'active' | 'resolved' | 'superseded';
  tags?: string[];
  resolvedDetails?: string;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  role: string;
  avatar: string;
  industry: string;
  dealValue: number; // in INR e.g. 850000 = ₹8,50,000
  formattedDealValue: string;
  stage: 'Discovery' | 'Evaluation' | 'Proposal' | 'Negotiation' | 'Closing' | 'Won';
  lastInteraction: string;
  nextMeeting: string;
  email: string;
  phone: string;
  location: string;
  sentimentScore: number; // 0 to 100
  sentimentLabel: 'Positive' | 'Cautious' | 'Neutral' | 'At Risk';
  learningLevel: number; // 1 to 5: 1 (Basic) to 5 (Deep Intelligence)
  decisionMakers: Array<{
    name: string;
    role: string;
    influence: 'champion' | 'economic_buyer' | 'evaluator' | 'blocker';
  }>;
  topConcerns: string[];
  competitorsMentioned: string[];
  preferences: string[];
  openCommitmentsCount: number;
}

export interface Deal {
  id: string;
  customerId: string;
  title: string;
  value: number;
  stage: 'Discovery' | 'Evaluation' | 'Proposal' | 'Negotiation' | 'Closing' | 'Won';
  closeDate: string;
  owner: string;
  probability: number;
  health: 'healthy' | 'warning' | 'at_risk';
  summary: string;
  memoryCount: number;
  knowledgeGrowthRate: number; // percentage
  majorObjections: string[];
  competitors: string[];
  nextAction: string;
  lastUpdated: string;
}

export interface Message {
  id: string;
  sender: 'customer' | 'sales_rep' | 'agent';
  speakerName: string;
  text: string;
  timestamp: string;
  extractedMemoryIds?: string[];
  isSimulated?: boolean;
}

export interface Conversation {
  id: string;
  customerId: string;
  date: string;
  title: string;
  type: 'Video Call' | 'In-Person Meeting' | 'Phone Call' | 'Email Thread';
  duration?: string;
  summary: string;
  messages: Message[];
  memoriesCreated: HindsightMemory[];
  nextSteps?: string[];
}

export interface MeetingPrepBriefing {
  customerId: string;
  meetingTime: string;
  meetingTitle: string;
  executiveSummary: string;
  whatTheyCareAbout: string[];
  previousObjections: Array<{
    objection: string;
    context: string;
    suggestedCounter: string;
    memoryId: string;
  }>;
  competitors: Array<{
    name: string;
    context: string;
    ourDifferentiator: string;
  }>;
  openCommitments: Array<{
    commitment: string;
    promisedDate: string;
    status: 'pending' | 'in_progress';
  }>;
  conversationHistorySummary: string;
  suggestedTalkingPoints: string[];
  questionsToAsk: string[];
  memorySources: HindsightMemory[];
}

export interface ActivityEvent {
  id: string;
  type: 'memory_created' | 'objection_logged' | 'competitor_detected' | 'commitment_saved' | 'deal_advanced';
  title: string;
  description: string;
  timestamp: string;
  customerId: string;
  customerName: string;
  memoryCategory?: MemoryCategory;
}

export interface CustomerInsight {
  id: string;
  type: 'objection_pattern' | 'competitor_pattern' | 'unresolved_commitment' | 'customer_preference';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'info';
  customerId: string;
  customerName: string;
  actionRecommendation: string;
  evidenceMemories: string[];
}

export interface SimulationStep {
  step: number;
  customerMessage: string;
  agentThought: string;
  newMemory: {
    category: MemoryCategory;
    fact: string;
    importance: MemoryImportance;
  };
  agentResponse: string;
  retrievedMemoriesCount: number;
}
