import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

let openaiClient: OpenAI | null = null;

/**
 * Initialize and return OpenAI client if API key is available
 * Returns null if OPENAI_API_KEY is not configured
 */
export function getOpenAIClient(): OpenAI | null {
  if (openaiClient) {
    return openaiClient;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️  OPENAI_API_KEY not found in environment variables');
    return null;
  }

  try {
    openaiClient = new OpenAI({
      apiKey: apiKey,
    });
    
    console.log('✅ OpenAI client initialized successfully');
    return openaiClient;
  } catch (error) {
    console.error('❌ Failed to initialize OpenAI client:', error);
    return null;
  }
}

/**
 * Check if OpenAI client is available and configured
 */
export function isOpenAIAvailable(): boolean {
  return getOpenAIClient() !== null;
}

/**
 * Safe wrapper for OpenAI chat completions
 */
export async function createChatCompletion(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<OpenAI.Chat.Completions.ChatCompletion | null> {
  const client = getOpenAIClient();
  
  if (!client) {
    console.error('OpenAI client not available');
    return null;
  }

  try {
    const completion = await client.chat.completions.create({
      model: options?.model || 'gpt-3.5-turbo',
      messages,
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 1000,
    });

    return completion;
  } catch (error) {
    console.error('Error creating chat completion:', error);
    return null;
  }
}

export default getOpenAIClient;