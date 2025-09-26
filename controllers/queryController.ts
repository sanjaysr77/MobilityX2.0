import { Request, Response } from 'express';
import { ParsedQuery, ApiResponse } from '../types/index.js';
import { createChatCompletion, isOpenAIAvailable } from '../utils/openaiClient.js';

interface QueryRequest {
  message: string;
}

/**
 * Parse natural language query into structured format
 * Uses OpenAI if available, falls back to local regex parsing
 */
export async function parseQuery(req: Request, res: Response): Promise<void> {
  try {
    const { message }: QueryRequest = req.body;

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: 'Message is required and must be a non-empty string',
        timestamp: new Date().toISOString()
      } as ApiResponse);
      return;
    }

    let parsedQuery: ParsedQuery;

    // Try OpenAI parsing first if available
    if (isOpenAIAvailable()) {
      console.log('🤖 Using OpenAI for query parsing');
      try {
        parsedQuery = await parseWithOpenAI(message);
      } catch (error) {
        console.warn('⚠️ OpenAI parsing failed, falling back to local parser:', error);
        parsedQuery = parseWithLocalParser(message);
      }
    } else {
      console.log('🔧 Using local parser (OpenAI not available)');
      parsedQuery = parseWithLocalParser(message);
    }

    const response: ApiResponse<ParsedQuery> = {
      success: true,
      data: parsedQuery,
      timestamp: new Date().toISOString()
    };

    res.json(response);
  } catch (error) {
    console.error('Error in parseQuery:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to parse query',
      timestamp: new Date().toISOString()
    } as ApiResponse);
  }
}

/**
 * Parse query using OpenAI chat completion
 * Extracts source, destination, and intent from natural language
 */
async function parseWithOpenAI(message: string): Promise<ParsedQuery> {
  const systemPrompt = `You are a travel query parser. Extract source, destination, and intent from user messages.

Return ONLY a JSON object with this exact structure:
{
  "source": "extracted source location or null",
  "destination": "extracted destination location or null", 
  "intent": "cheapest|fastest|comfortable|unknown"
}

Intent detection rules:
- "cheapest": keywords like cheap, budget, affordable, low cost, save money
- "fastest": keywords like fast, quick, urgent, hurry, time
- "comfortable": keywords like comfort, comfortable, luxury, premium, relaxed
- "unknown": if no clear intent is detected

Examples:
- "I want to go from KPR College to Gandhipuram cheaply" → {"source": "KPR College", "destination": "Gandhipuram", "intent": "cheapest"}
- "Fast route to airport from my location" → {"source": null, "destination": "airport", "intent": "fastest"}
- "Comfortable ride to Brookefields Mall" → {"source": null, "destination": "Brookefields Mall", "intent": "comfortable"}`;

  const completion = await createChatCompletion([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: message }
  ], {
    model: 'gpt-3.5-turbo',
    temperature: 0.1,
    maxTokens: 200
  });

  if (!completion?.choices?.[0]?.message?.content) {
    throw new Error('No response from OpenAI');
  }

  try {
    const parsed = JSON.parse(completion.choices[0].message.content);
    
    // Validate the response structure
    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('Invalid response format');
    }

    // Ensure intent is valid
    const validIntents = ['cheapest', 'fastest', 'comfortable', 'unknown'];
    if (!validIntents.includes(parsed.intent)) {
      parsed.intent = 'unknown';
    }

    return {
      source: parsed.source || null,
      destination: parsed.destination || null,
      intent: parsed.intent,
      timestamp: new Date().toISOString()
    };
  } catch (parseError) {
    console.error('Failed to parse OpenAI response:', parseError);
    throw new Error('Invalid JSON response from OpenAI');
  }
}

/**
 * Local regex-based parser as fallback
 * Extracts source, destination, and intent using pattern matching
 */
function parseWithLocalParser(message: string): ParsedQuery {
  const lowerMessage = message.toLowerCase();
  
  // Extract source location
  let source: string | null = null;
  const fromPatterns = [
    /from\s+([^to]+?)(?:\s+to|\s*$)/i,
    /starting\s+(?:from\s+)?([^to]+?)(?:\s+to|\s*$)/i,
    /leaving\s+(?:from\s+)?([^to]+?)(?:\s+to|\s*$)/i
  ];
  
  for (const pattern of fromPatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      source = match[1].trim();
      break;
    }
  }

  // Extract destination location
  let destination: string | null = null;
  const toPatterns = [
    /to\s+([^from]+?)(?:\s+from|\s*$)/i,
    /going\s+to\s+([^from]+?)(?:\s+from|\s*$)/i,
    /heading\s+to\s+([^from]+?)(?:\s+from|\s*$)/i,
    /destination\s+([^from]+?)(?:\s+from|\s*$)/i
  ];
  
  for (const pattern of toPatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      destination = match[1].trim();
      break;
    }
  }

  // If no "from/to" pattern found, try to extract any location mentions
  if (!source && !destination) {
    const locationKeywords = ['college', 'airport', 'mall', 'hospital', 'station', 'gandhipuram', 'kpr'];
    const words = message.split(/\s+/);
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i].toLowerCase();
      if (locationKeywords.some(keyword => word.includes(keyword))) {
        // Take this word and potentially the next few words as a location
        const location = words.slice(i, Math.min(i + 3, words.length)).join(' ');
        if (!destination) {
          destination = location;
        } else if (!source) {
          source = location;
        }
      }
    }
  }

  // Detect intent from keywords
  let intent: ParsedQuery['intent'] = 'unknown';
  
  const cheapKeywords = ['cheap', 'budget', 'affordable', 'low cost', 'save money', 'economical', 'inexpensive'];
  const fastKeywords = ['fast', 'quick', 'urgent', 'hurry', 'time', 'speed', 'rapid', 'express'];
  const comfortKeywords = ['comfort', 'comfortable', 'luxury', 'premium', 'relaxed', 'cozy', 'pleasant'];
  
  if (cheapKeywords.some(keyword => lowerMessage.includes(keyword))) {
    intent = 'cheapest';
  } else if (fastKeywords.some(keyword => lowerMessage.includes(keyword))) {
    intent = 'fastest';
  } else if (comfortKeywords.some(keyword => lowerMessage.includes(keyword))) {
    intent = 'comfortable';
  }

  return {
    source,
    destination,
    intent,
    timestamp: new Date().toISOString()
  };
}