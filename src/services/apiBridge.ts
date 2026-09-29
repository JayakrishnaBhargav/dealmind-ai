import { Customer, HindsightMemory, MemoryCategory, MemoryImportance } from '../types';

export interface ExtractMemoryResult {
  isMeaningful: boolean;
  category?: MemoryCategory;
  extractedFact?: string;
  importance?: MemoryImportance;
  tags?: string[];
}

export interface AskDealMindResult {
  answer: string;
  keyTakeaways: string[];
  whyAmISayingThis: string[];
  recommendedAction?: string;
  isAiGenerated: boolean;
}

export interface MeetingPrepResult {
  executiveSummary: string;
  whatTheyCareAbout: string[];
  suggestedTalkingPoints: string[];
  questionsToAsk: string[];
  isAiGenerated: boolean;
}

/**
 * Call Server API: Extract Memory
 */
export async function extractMemoryViaGemini(
  customer: Customer,
  messageText: string,
  speaker: 'customer' | 'sales_rep' | 'system'
): Promise<ExtractMemoryResult | null> {
  try {
    const response = await fetch('/api/gemini/extract-memory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: customer.name,
        companyName: customer.company,
        messageText,
        speaker,
      }),
    });

    if (!response.ok) return null;
    const resData = await response.json();
    if (resData.success && resData.data) {
      return resData.data as ExtractMemoryResult;
    }
    return null;
  } catch (err) {
    console.warn('[API Bridge] Extract memory fallback to local Hindsight engine', err);
    return null;
  }
}

/**
 * Call Server API: Ask DealMind
 */
export async function askDealMindViaGemini(
  customer: Customer,
  question: string,
  retrievedMemories: HindsightMemory[]
): Promise<AskDealMindResult | null> {
  try {
    const response = await fetch('/api/gemini/ask-dealmind', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer,
        question,
        retrievedMemories,
      }),
    });

    if (!response.ok) return null;
    const resData = await response.json();
    if (resData.success && resData.data) {
      return {
        ...resData.data,
        isAiGenerated: true,
      };
    }
    return null;
  } catch (err) {
    console.warn('[API Bridge] Ask DealMind fallback to local Hindsight engine', err);
    return null;
  }
}

/**
 * Call Server API: Meeting Prep Briefing
 */
export async function generateMeetingPrepViaGemini(
  customer: Customer,
  meetingTime: string,
  memories: HindsightMemory[]
): Promise<MeetingPrepResult | null> {
  try {
    const response = await fetch('/api/gemini/meeting-prep', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer,
        meetingTime,
        memories,
      }),
    });

    if (!response.ok) return null;
    const resData = await response.json();
    if (resData.success && resData.data) {
      return {
        ...resData.data,
        isAiGenerated: true,
      };
    }
    return null;
  } catch (err) {
    console.warn('[API Bridge] Meeting Prep fallback to local Hindsight engine', err);
    return null;
  }
}
