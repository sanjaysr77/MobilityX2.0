import { Request, Response } from 'express';
import { QueryRequest, ParsedQuery, ApiResponse } from '../types/index.js';
import { createChatCompletion, isOpenAIAvailable } from '../utils/openaiClient.js';

/**
 * Parse natural language query into structured format
 * TODO: Implement OpenAI-based query parsing logic
 */
export async function parseQuery(req: Request, res: Response): Promise<void> {
  try {
    const { query, context }: QueryRequest = req.body;

    if (!query || typeof query !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Query is required and must be a string',
        timestamp: new Date().toISOString()
      } as ApiResponse);
      return;
    }

    // TODO: Implement actual query parsing logic using OpenAI
    // For now, return a mock parsed query
    const mockParsedQuery: ParsedQuery = {
      from: 'KPR College', // Extract from query
      to: 'Gandhipuram',   // Extract from query
      preferences: {
        maxCost: 200,
        maxTime: 60,
        preferredModes: ['Bus', 'Auto'],
        comfortLevel: 'standard'
      },
      timestamp: new Date().toISOString()
    };

    // Check if OpenAI is available for future implementation
    if (!isOpenAIAvailable()) {
      console.warn('OpenAI not available, using mock data');
    }

    const response: ApiResponse<ParsedQuery> = {
      success: true,
      data: mockParsedQuery,
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
 * Helper function to extract locations from query using OpenAI
 * TODO: Implement this function
 */
async function extractLocationsFromQuery(query: string): Promise<{ from: string; to: string } | null> {
  // TODO: Use OpenAI to extract from/to locations from natural language
  // Example: "I want to go from KPR College to Gandhipuram" -> { from: "KPR College", to: "Gandhipuram" }
  return null;
}

/**
 * Helper function to extract preferences from query
 * TODO: Implement this function
 */
async function extractPreferencesFromQuery(query: string): Promise<ParsedQuery['preferences']> {
  // TODO: Use OpenAI to extract preferences like budget, time constraints, comfort level
  return undefined;
}