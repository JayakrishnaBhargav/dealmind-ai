import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize GoogleGenAI server client
const apiKey = process.env.GEMINI_API_KEY || '';
let genAI: GoogleGenAI | null = null;
if (apiKey) {
  try {
    genAI = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI:', err);
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!apiKey,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Endpoint: Extract Memory from Conversation using Gemini 3.8 Flash
 */
app.post('/api/gemini/extract-memory', async (req, res) => {
  try {
    const { customerName, companyName, messageText, speaker } = req.body;

    if (!messageText || typeof messageText !== 'string') {
      return res.status(400).json({ error: 'messageText is required' });
    }

    if (!genAI) {
      return res.json({
        fallback: true,
        reason: 'GEMINI_API_KEY not configured or offline',
      });
    }

    const prompt = `You are the Hindsight Memory Extraction Engine for DealMind, a high-stakes enterprise sales intelligence agent.
Target Customer: ${customerName || 'Customer'} (${companyName || 'Target Company'})
Speaker: ${speaker || 'customer'}
Spoken Statement: "${messageText}"

Analyze if this statement contains a lasting business memory, or if it is merely conversational noise (e.g. "hello", "thanks", "sounds good", "okay").
If it is noise, return JSON with "isMeaningful": false.
If it is meaningful, extract the factual core without filler words.
Classify strictly into one of these categories:
- Customer Preference
- Objection
- Requirement
- Competitor
- Decision Maker
- Commitment
- Pain Point
- Product Interest
- Pricing
- Technical Requirement
- Meeting Outcome
- Follow-up

Importance must be one of: "critical", "high", "medium", "low".

Return ONLY raw valid JSON:
{
  "isMeaningful": true,
  "category": "Objection",
  "extractedFact": "Customer raised pricing concern: ₹8.5L exceeds Q1 departmental SaaS budget",
  "importance": "critical",
  "tags": ["pricing", "budget", "objection"]
}`;

    const response = await genAI.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Gemini extraction error:', error);
    return res.status(500).json({ error: error.message || 'Extraction failed' });
  }
});

/**
 * Endpoint: Ask DealMind with Hindsight Context
 */
app.post('/api/gemini/ask-dealmind', async (req, res) => {
  try {
    const { customer, question, retrievedMemories } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    if (!genAI) {
      return res.json({
        fallback: true,
        reason: 'GEMINI_API_KEY not configured or offline',
      });
    }

    const memoryBullets = Array.isArray(retrievedMemories) && retrievedMemories.length > 0
      ? retrievedMemories.map((m: any, idx: number) => `[Memory ${idx + 1}] (${m.category}, ${m.relativeDate || 'Past'}): ${m.extractedFact}`).join('\n')
      : 'No prior memories found.';

    const prompt = `You are DealMind, an elite sales intelligence agent that NEVER forgets a deal.
You are powered by Hindsight persistent memory.
Customer Context:
- Name: ${customer?.name || 'Customer'}
- Company: ${customer?.company || 'Company'}
- Role: ${customer?.role || 'Executive'}
- Deal Value: ${customer?.formattedDealValue || 'N/A'}
- Stage: ${customer?.stage || 'Negotiation'}

RECALLED HINDSIGHT MEMORIES:
${memoryBullets}

Sales Rep Question:
"${question}"

Provide a sharp, consultative, high-conviction answer directly referencing the retrieved memories.
Cite specific facts from the memories (e.g., pricing objections, competitors, technical anxieties, and open commitments).
Also include a "whyAmISayingThis" section explaining the memory sources that triggered this recommendation.

Return ONLY raw valid JSON:
{
  "answer": "Clear, direct, strategic answer...",
  "keyTakeaways": ["Point 1", "Point 2", "Point 3"],
  "whyAmISayingThis": [
    "Retrieved pricing objection from March 5 where Rahul indicated ₹8.5L exceeds Q1 budget",
    "Identified competitor evaluation: Salesforce Data Cloud mentioned by procurement",
    "Open commitment from March 25 to send 3-phase migration blueprint"
  ],
  "recommendedAction": "Actionable next step for the sales rep"
}`;

    const response = await genAI.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Gemini ask error:', error);
    return res.status(500).json({ error: error.message || 'Ask DealMind failed' });
  }
});

/**
 * Endpoint: Generate Meeting Prep Briefing with Gemini 3.8 Flash
 */
app.post('/api/gemini/meeting-prep', async (req, res) => {
  try {
    const { customer, meetingTime, memories } = req.body;

    if (!genAI) {
      return res.json({
        fallback: true,
        reason: 'GEMINI_API_KEY not configured or offline',
      });
    }

    const memoryList = (memories || [])
      .map((m: any) => `- [${m.category}] ${m.extractedFact} (Date: ${m.relativeDate || 'Past'})`)
      .join('\n');

    const prompt = `You are DealMind's Meeting Prep Intelligence Engine.
Generate an executive sales briefing for an upcoming critical meeting with:
Customer: ${customer?.name} (${customer?.role} at ${customer?.company})
Meeting Time: ${meetingTime || 'Tomorrow 10:30 AM'}
Deal Value: ${customer?.formattedDealValue}
Stage: ${customer?.stage}

Hindsight Persistent Memories on Record:
${memoryList}

Generate a comprehensive meeting briefing.
Return ONLY valid JSON matching this schema:
{
  "executiveSummary": "Concise 3-sentence summary of the account state and goal for this call",
  "whatTheyCareAbout": ["Priority 1", "Priority 2", "Priority 3"],
  "suggestedTalkingPoints": [
    "Personalized talking point acknowledging previous concerns",
    "Commercial justification point addressing CFO/pricing",
    "Migration assurance point"
  ],
  "questionsToAsk": [
    "Probing question on technical cutover",
    "Commercial sign-off timeline question",
    "Competitor differentiation check"
  ]
}`;

    const response = await genAI.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Gemini meeting prep error:', error);
    return res.status(500).json({ error: error.message || 'Meeting prep failed' });
  }
});

// Setup Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DealMind Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
