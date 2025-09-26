import { Request, Response } from 'express';
import { RecommendRequest, RouteOption, ApiResponse } from '../types/index.js';
import mockRoutes from '../data/mockRoutes.json' assert { type: 'json' };

/**
 * Get route recommendations based on parsed query
 * TODO: Implement intelligent recommendation algorithm
 */
export async function getRecommendations(req: Request, res: Response): Promise<void> {
  try {
    const { parsedQuery, maxResults = 10 }: RecommendRequest = req.body;

    if (!parsedQuery || !parsedQuery.from || !parsedQuery.to) {
      res.status(400).json({
        success: false,
        error: 'ParsedQuery with from and to locations is required',
        timestamp: new Date().toISOString()
      } as ApiResponse);
      return;
    }

    // TODO: Implement intelligent filtering and ranking algorithm
    // For now, filter routes based on from/to locations
    const filteredRoutes = (mockRoutes as RouteOption[]).filter(route => {
      const fromMatch = route.from.toLowerCase().includes(parsedQuery.from.toLowerCase()) ||
                       parsedQuery.from.toLowerCase().includes(route.from.toLowerCase());
      const toMatch = route.to.toLowerCase().includes(parsedQuery.to.toLowerCase()) ||
                     parsedQuery.to.toLowerCase().includes(route.to.toLowerCase());
      
      return fromMatch && toMatch;
    });

    // TODO: Apply preference-based filtering
    let recommendedRoutes = filteredRoutes;

    if (parsedQuery.preferences) {
      recommendedRoutes = applyPreferenceFilters(filteredRoutes, parsedQuery.preferences);
    }

    // TODO: Implement intelligent ranking algorithm
    // For now, sort by cost (ascending)
    recommendedRoutes.sort((a, b) => a.cost - b.cost);

    // Limit results
    const limitedResults = recommendedRoutes.slice(0, maxResults);

    const response: ApiResponse<RouteOption[]> = {
      success: true,
      data: limitedResults,
      timestamp: new Date().toISOString()
    };

    res.json(response);
  } catch (error) {
    console.error('Error in getRecommendations:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to get recommendations',
      timestamp: new Date().toISOString()
    } as ApiResponse);
  }
}

/**
 * Apply preference-based filters to route options
 * TODO: Enhance filtering logic
 */
function applyPreferenceFilters(
  routes: RouteOption[], 
  preferences: NonNullable<import('../types/index.js').ParsedQuery['preferences']>
): RouteOption[] {
  let filtered = routes;

  // Filter by max cost
  if (preferences.maxCost) {
    filtered = filtered.filter(route => route.cost <= preferences.maxCost!);
  }

  // Filter by max time
  if (preferences.maxTime) {
    filtered = filtered.filter(route => route.timeMin <= preferences.maxTime!);
  }

  // Filter by preferred modes
  if (preferences.preferredModes && preferences.preferredModes.length > 0) {
    filtered = filtered.filter(route => preferences.preferredModes!.includes(route.mode));
  }

  // Filter by comfort level
  if (preferences.comfortLevel) {
    // TODO: Implement comfort level filtering logic
    // For now, just return all routes
  }

  return filtered;
}