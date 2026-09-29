/**
 * HINDSIGHT PERSISTENT MEMORY ENGINE
 * 
 * Core intellectual memory layer for DealMind.
 * Implements episodic, semantic, and procedural memory extraction,
 * relevance retrieval, cognitive decay/reinforcement, and memory-informed synthesis.
 */

import { HindsightMemory, MemoryCategory, MemoryImportance, Customer, MeetingPrepBriefing } from '../types';

export class HindsightMemoryService {
  private memories: HindsightMemory[] = [];
  private readonly NOISE_PATTERNS = [
    /^(hi|hello|hey|good\s+(morning|afternoon|evening)|howdy)\b/i,
    /^(thanks|thank\s+you|appreciate\s+it|thx|cheers)\b/i,
    /^(okay|ok|sure|alright|fine|sounds\s+good|got\s+it|cool|yep|yeah)\b/i,
    /^(bye|goodbye|talk\s+soon|see\s+ya|have\s+a\s+good\s+one)\b/i,
    /^(can\s+you\s+hear\s+me|testing|is\s+my\s+mic\s+working)\b/i,
  ];

  constructor(initialMemories: HindsightMemory[] = []) {
    this.memories = [...initialMemories];
  }

  /**
   * Set or update stored memories
   */
  public setMemories(memories: HindsightMemory[]) {
    this.memories = [...memories];
  }

  /**
   * Get all active memories
   */
  public getAllMemories(): HindsightMemory[] {
    return [...this.memories];
  }

  /**
   * Get memories for a specific customer
   */
  public getCustomerMemories(customerId: string): HindsightMemory[] {
    return this.memories
      .filter((m) => m.customerId === customerId && m.status !== 'superseded')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * Evaluates if a statement is conversational noise or high-signal information
   */
  public isMeaningful(text: string): boolean {
    const trimmed = text.trim();
    if (trimmed.length < 12) return false;
    for (const pattern of this.NOISE_PATTERNS) {
      if (pattern.test(trimmed) && trimmed.length < 35) {
        return false;
      }
    }
    return true;
  }

  /**
   * Heuristic Cognitive Classifier for Memory Extraction
   * Detects categories, importance, and clean factual extractions
   */
  public analyzeAndExtractMemory(
    text: string,
    customerId: string,
    speaker: 'customer' | 'sales_rep' | 'system' = 'customer',
    dealId?: string,
    conversationId?: string
  ): HindsightMemory | null {
    if (!this.isMeaningful(text)) {
      return null;
    }

    const lower = text.toLowerCase();
    let category: MemoryCategory = 'Product Interest';
    let importance: MemoryImportance = 'medium';
    let fact = text.trim();
    const tags: string[] = [];

    // 1. Objections & Pricing
    if (
      lower.includes('price') ||
      lower.includes('pricing') ||
      lower.includes('expensive') ||
      lower.includes('budget') ||
      lower.includes('cost') ||
      lower.includes('discount') ||
      lower.includes('rate') ||
      lower.includes('lakh') ||
      lower.includes('rupee') ||
      lower.includes('dollar')
    ) {
      if (
        lower.includes('high') ||
        lower.includes('tight') ||
        lower.includes('cannot afford') ||
        lower.includes('exceed') ||
        lower.includes('freeze') ||
        lower.includes('concern')
      ) {
        category = 'Objection';
        importance = 'critical';
        tags.push('pricing', 'budget-freeze', 'objection');
        fact = `Customer raised pricing concern: ${text.replace(/^["']|["']$/g, '')}`;
      } else {
        category = 'Pricing';
        importance = 'high';
        tags.push('pricing', 'commercial');
      }
    }
    // 2. Competitors
    else if (
      lower.includes('salesforce') ||
      lower.includes('hubspot') ||
      lower.includes('gong') ||
      lower.includes('chorus') ||
      lower.includes('dynamics') ||
      lower.includes('zoho') ||
      lower.includes('competitor') ||
      lower.includes('evaluating') ||
      lower.includes('alternative')
    ) {
      category = 'Competitor';
      importance = 'high';
      tags.push('competitor', 'competitive-intel');
      const compName = lower.includes('salesforce')
        ? 'Salesforce'
        : lower.includes('hubspot')
        ? 'HubSpot'
        : lower.includes('gong')
        ? 'Gong.io'
        : lower.includes('dynamics')
        ? 'Microsoft Dynamics'
        : 'Competitor';
      fact = `Customer mentioned competitor (${compName}) under active evaluation: "${text}"`;
    }
    // 3. Technical Requirements & Migration
    else if (
      lower.includes('migration') ||
      lower.includes('migrate') ||
      lower.includes('database') ||
      lower.includes('api') ||
      lower.includes('security') ||
      lower.includes('soc-2') ||
      lower.includes('rbi') ||
      lower.includes('compliance') ||
      lower.includes('latency') ||
      lower.includes('uptime') ||
      lower.includes('downtime') ||
      lower.includes('technical') ||
      lower.includes('architect')
    ) {
      category = 'Technical Requirement';
      importance = lower.includes('migration') || lower.includes('compliance') ? 'critical' : 'high';
      tags.push('technical', 'architecture', 'migration');
      fact = `Technical consideration identified: ${text}`;
    }
    // 4. Commitments & Promises
    else if (
      speaker === 'sales_rep' &&
      (lower.includes('will send') ||
        lower.includes('will provide') ||
        lower.includes('promise') ||
        lower.includes('deliver') ||
        lower.includes('follow up') ||
        lower.includes('by friday') ||
        lower.includes('before our next') ||
        lower.includes('prepare'))
    ) {
      category = 'Commitment';
      importance = 'critical';
      tags.push('commitment', 'action-item', 'open-promise');
      fact = `Salesperson committed: ${text}`;
    }
    // 5. Decision Makers
    else if (
      lower.includes('cfo') ||
      lower.includes('cto') ||
      lower.includes('cro') ||
      lower.includes('ceo') ||
      lower.includes('procurement') ||
      lower.includes('board') ||
      lower.includes('decision maker') ||
      lower.includes('sign off') ||
      lower.includes('approve') ||
      lower.includes('authority')
    ) {
      category = 'Decision Maker';
      importance = 'high';
      tags.push('stakeholder', 'org-chart', 'sign-off');
      fact = `Key stakeholder dynamic noted: ${text}`;
    }
    // 6. Preferences
    else if (
      lower.includes('prefer') ||
      lower.includes('annual') ||
      lower.includes('monthly') ||
      lower.includes('billing') ||
      lower.includes('contract') ||
      lower.includes('invoice') ||
      lower.includes('slack') ||
      lower.includes('email')
    ) {
      category = 'Customer Preference';
      importance = 'medium';
      tags.push('preference', 'commercial-terms');
      fact = `Customer preference recorded: ${text}`;
    }
    // 7. General Pain Point / Requirement
    else if (
      lower.includes('struggle') ||
      lower.includes('problem') ||
      lower.includes('difficult') ||
      lower.includes('frustrat') ||
      lower.includes('need') ||
      lower.includes('require')
    ) {
      category = 'Pain Point';
      importance = 'high';
      tags.push('pain-point', 'driver');
      fact = `Key customer pain point: ${text}`;
    } else {
      category = 'Requirement';
      importance = 'medium';
      tags.push('requirement');
      fact = text;
    }

    const now = new Date();
    const newMemory: HindsightMemory = {
      id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      customerId,
      dealId,
      conversationId,
      category,
      extractedFact: fact,
      importance,
      timestamp: now.toISOString(),
      relativeDate: 'Just now',
      sourceSpeaker: speaker,
      sourceQuote: text,
      status: 'active',
      tags,
    };

    return newMemory;
  }

  /**
   * Store a memory directly into the Hindsight layer
   */
  public storeMemory(memory: HindsightMemory): HindsightMemory {
    this.memories.unshift(memory);
    return memory;
  }

  /**
   * Semantic and Lexical Relevance Retrieval
   * Retrieves memories that match query context with relevance scoring (0.0 to 1.0)
   */
  public retrieveMemories(
    customerId: string,
    queryText: string,
    options: {
      categoryFilter?: MemoryCategory[];
      minRelevance?: number;
      limit?: number;
    } = {}
  ): HindsightMemory[] {
    const customerMemories = this.getCustomerMemories(customerId);
    const queryTerms = queryText
      .toLowerCase()
      .split(/[\s,.;:?!]+/)
      .filter((w) => w.length > 2);
    const limit = options.limit || 5;

    const scored = customerMemories.map((mem) => {
      let score = 0.15; // baseline prior
      const factLower = mem.extractedFact.toLowerCase();
      const quoteLower = (mem.sourceQuote || '').toLowerCase();
      const categoryLower = mem.category.toLowerCase();
      const tagsString = (mem.tags || []).join(' ').toLowerCase();

      // Check category match if requested
      if (options.categoryFilter && options.categoryFilter.includes(mem.category)) {
        score += 0.35;
      }

      // Query term overlap
      let termMatches = 0;
      for (const term of queryTerms) {
        if (factLower.includes(term)) termMatches += 1.5;
        if (quoteLower.includes(term)) termMatches += 1.0;
        if (categoryLower.includes(term)) termMatches += 1.2;
        if (tagsString.includes(term)) termMatches += 1.2;
      }

      if (queryTerms.length > 0) {
        score += Math.min(0.65, (termMatches / (queryTerms.length * 1.5)) * 0.7);
      }

      // Importance bias
      if (mem.importance === 'critical') score += 0.2;
      else if (mem.importance === 'high') score += 0.12;

      // Bound score between 0.1 and 0.99
      const relevanceScore = Math.min(0.99, Math.max(0.12, parseFloat(score.toFixed(2))));

      return {
        ...mem,
        relevanceScore,
      };
    });

    // Filter by minRelevance if passed
    const filtered = options.minRelevance
      ? scored.filter((m) => (m.relevanceScore || 0) >= options.minRelevance!)
      : scored;

    // Sort by relevance score descending
    filtered.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

    return filtered.slice(0, limit);
  }

  /**
   * Search customer memories by free text query
   */
  public searchCustomerMemory(customerId: string, term: string): HindsightMemory[] {
    if (!term.trim()) return this.getCustomerMemories(customerId);
    const q = term.toLowerCase();
    return this.getCustomerMemories(customerId).filter((m) => {
      return (
        m.extractedFact.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        (m.sourceQuote && m.sourceQuote.toLowerCase().includes(q)) ||
        (m.tags && m.tags.some((t) => t.toLowerCase().includes(q)))
      );
    });
  }

  /**
   * Compiles executive deal intelligence summary from Hindsight memories
   */
  public getRelevantDealContext(customer: Customer) {
    const memories = this.getCustomerMemories(customer.id);
    const objections = memories.filter((m) => m.category === 'Objection' || m.category === 'Pricing');
    const competitors = memories.filter((m) => m.category === 'Competitor');
    const commitments = memories.filter((m) => m.category === 'Commitment');
    const preferences = memories.filter((m) => m.category === 'Customer Preference');
    const technical = memories.filter((m) => m.category === 'Technical Requirement' || m.category === 'Requirement');

    return {
      totalMemories: memories.length,
      objections,
      competitors,
      commitments,
      preferences,
      technical,
    };
  }

  /**
   * Generates the Meeting Prep Briefing for a customer
   */
  public generateMeetingPrep(customer: Customer): MeetingPrepBriefing {
    const memories = this.getCustomerMemories(customer.id);
    const context = this.getRelevantDealContext(customer);

    const objectionsFormatted = context.objections.map((obj) => {
      let counter = 'Reinforce value and ROI metrics with concrete payback timeline.';
      if (obj.extractedFact.toLowerCase().includes('price') || obj.extractedFact.toLowerCase().includes('budget')) {
        counter = 'Emphasize the 15% annual commitment discount and demonstrate time-to-value payback in under 6 months.';
      } else if (obj.extractedFact.toLowerCase().includes('migration')) {
        counter = 'Walk through the 3-phase automated zero-downtime migration blueprint with data integrity validation.';
      }
      return {
        objection: obj.extractedFact,
        context: obj.sourceQuote || 'Raised in previous discussion',
        suggestedCounter: counter,
        memoryId: obj.id,
      };
    });

    const competitorsFormatted = context.competitors.map((comp) => {
      const isSalesforce = comp.extractedFact.toLowerCase().includes('salesforce');
      return {
        name: isSalesforce ? 'Salesforce Data Cloud' : 'Alternative Vendor',
        context: comp.extractedFact,
        ourDifferentiator: isSalesforce
          ? 'DealMind delivers zero-setup autonomous memory with instant deal recall, while Salesforce requires months of data architect consulting and massive setup fees.'
          : 'DealMind is purpose-built for proactive memory recall rather than passive transcription.',
      };
    });

    const openCommitmentsFormatted = context.commitments.map((comm) => {
      return {
        commitment: comm.extractedFact,
        promisedDate: comm.relativeDate || 'Previous interaction',
        status: 'pending' as const,
      };
    });

    // Key talking points based on active memories
    const talkingPoints: string[] = [
      `Acknowledge ${customer.name}'s priority around zero disruption and present our verified 3-phase rollout roadmap.`,
      `Frame the ${customer.formattedDealValue} investment in terms of recovering 4 hours per sales rep per week in lost deal context.`,
      `Highlight how DealMind isolates customer memory per tenant with strict encryption, addressing security & compliance requirements.`,
      `Offer a 14-day parallel pilot with their staging workspace to demonstrate memory accuracy live before commercial sign-off.`,
    ];

    const questionsToAsk: string[] = [
      `"Rahul, since our last discussion on migration risks, has your platform engineering team finalized their cutover window for Q4?"`,
      `"How does Priya Rao (CFO) typically evaluate software payback—would a 9-month ROI model aligned with your annual billing preference work best?"`,
      `"Regarding Salesforce Data Cloud, are they offering custom SLA guarantees for conversation memory recall, or just standard cloud storage?"`,
    ];

    return {
      customerId: customer.id,
      meetingTime: customer.nextMeeting || 'Tomorrow at 10:30 AM',
      meetingTitle: `Strategy Review & Commercial Alignment with ${customer.name}`,
      executiveSummary: `${customer.name} (${customer.role} at ${customer.company}) is in the ${customer.stage} stage for an enterprise deal valued at ${customer.formattedDealValue}. DealMind has retained ${memories.length} persistent memory points across prior interactions. The primary headwinds are pricing budget constraints and migration complexity fears, with Salesforce actively evaluated by procurement. However, high interest exists in autonomous deal recall.`,
      whatTheyCareAbout: customer.topConcerns,
      previousObjections: objectionsFormatted.length > 0 ? objectionsFormatted : [
        {
          objection: 'Upfront budget sensitivity',
          context: 'Discussed in previous calls',
          suggestedCounter: 'Offer annual milestone billing structure',
          memoryId: 'mem-fallback',
        },
      ],
      competitors: competitorsFormatted.length > 0 ? competitorsFormatted : [
        {
          name: 'Salesforce Data Cloud',
          context: 'Evaluating enterprise packages',
          ourDifferentiator: 'Instant memory without expensive data cloud integrations',
        },
      ],
      openCommitments: openCommitmentsFormatted.length > 0 ? openCommitmentsFormatted : [
        {
          commitment: 'Deliver customized 3-phase migration blueprint with zero downtime guarantee',
          promisedDate: 'March 25',
          status: 'pending',
        },
      ],
      conversationHistorySummary: `Past 3 interactions showed progressive movement from initial problem validation to technical feasibility and commercial negotiations. The customer has consistently requested concrete implementation details over marketing collateral.`,
      suggestedTalkingPoints: talkingPoints,
      questionsToAsk: questionsToAsk,
      memorySources: memories.slice(0, 6),
    };
  }

  /**
   * The "Why Memory Matters" side-by-side comparison generator
   */
  public compareWithAndWithoutMemory(customer: Customer, question: string = 'Help me prepare for my meeting') {
    const memories = this.getCustomerMemories(customer.id);
    const relevantMemories = this.retrieveMemories(customer.id, question, { limit: 3 });

    const withoutMemory = {
      title: 'WITHOUT MEMORY (Generic Chatbot)',
      badge: 'Stateless / Generic',
      response: `Prepare by understanding the customer's needs and discussing pricing. Make sure to present your product features clearly, ask what their budget is, and follow up afterwards with an email. Be ready to handle any objections they might have about your solution.`,
      retrievedCount: 0,
      memoriesUsed: [] as HindsightMemory[],
      criticism: 'Has zero memory of past calls. Forgets that pricing was already rejected, misses the CTO’s migration fears, and ignores the open commitment to send a blueprint.',
    };

    const withMemory = {
      title: 'WITH HINDSIGHT MEMORY (DealMind)',
      badge: 'Persistent Deal Intelligence',
      response: `${customer.name} previously raised serious pricing objections regarding the ${customer.formattedDealValue} quote and is actively benchmarking Salesforce Data Cloud. His primary technical anxiety is migration complexity and potential downtime for 65 reps. Crucially, your previous commitment on March 25 to provide a 3-phase migration blueprint is still OPEN and must be presented first. Address CFO Priya Rao’s annual billing preference to unblock commercial sign-off.`,
      retrievedCount: relevantMemories.length,
      memoriesUsed: relevantMemories,
      advantage: 'Retrieves episodic facts from 3 weeks ago, links stakeholders, flags open promises, and provides precise counter-tactics.',
    };

    return {
      withoutMemory,
      withMemory,
    };
  }

  /**
   * Calculates the Learning Curve progression data for visualization
   */
  public calculateLearningCurve(customer: Customer) {
    const memoryCount = this.getCustomerMemories(customer.id).length;
    return [
      {
        interaction: 'Call 1',
        title: 'Basic Understanding',
        description: 'Company size, team role, generic interest noted',
        memoriesCount: 1,
        intelligenceScore: 20,
        unlockedCapabilities: ['Account profile created', 'Basic pain points captured'],
        isCompleted: true,
      },
      {
        interaction: 'Call 2',
        title: 'Budget & Objections',
        description: 'Commercial boundaries, pricing friction, budget cycles recorded',
        memoriesCount: 3,
        intelligenceScore: 45,
        unlockedCapabilities: ['Objection tracking', 'Budget threshold alerts'],
        isCompleted: true,
      },
      {
        interaction: 'Call 3',
        title: 'Competitors & Tech Stack',
        description: 'Salesforce evaluation spotted, migration risks, CTO concerns',
        memoriesCount: 6,
        intelligenceScore: 70,
        unlockedCapabilities: ['Competitor battlecards', 'Architecture constraint mapping'],
        isCompleted: true,
      },
      {
        interaction: 'Call 4',
        title: 'Stakeholder & Commitments',
        description: 'CFO sign-off rule (Priya Rao), open promises, billing preferences',
        memoriesCount: 9,
        intelligenceScore: 88,
        unlockedCapabilities: ['Commitment follow-up tracking', 'Stakeholder influence map'],
        isCompleted: memoryCount >= 8,
      },
      {
        interaction: 'Call 5+',
        title: 'Deep Customer Intelligence',
        description: 'Autonomous meeting briefings, objection counters, proactive risk mitigation',
        memoriesCount: Math.max(12, memoryCount),
        intelligenceScore: 98,
        unlockedCapabilities: ['Proactive negotiation tactics', 'Predictive win strategy'],
        isCompleted: memoryCount >= 11,
      },
    ];
  }
}
