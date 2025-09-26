import { Request, Response } from 'express';
import { LocationSearchRequest, LocationSuggestion, ApiResponse } from '../types/index.js';

// Mock location data for Coimbatore
const mockLocations: LocationSuggestion[] = [
  {
    id: 'loc_001',
    name: 'KPR College',
    address: 'KPR Institute of Engineering and Technology, Coimbatore',
    coordinates: { lat: 11.0168, lng: 76.9558 },
    type: 'college'
  },
  {
    id: 'loc_002',
    name: 'Gandhipuram',
    address: 'Gandhipuram, Coimbatore, Tamil Nadu',
    coordinates: { lat: 11.0183, lng: 76.9725 },
    type: 'landmark'
  },
  {
    id: 'loc_003',
    name: 'Coimbatore Airport',
    address: 'Coimbatore International Airport, Peelamedu, Coimbatore',
    coordinates: { lat: 11.0297, lng: 77.0436 },
    type: 'airport'
  },
  {
    id: 'loc_004',
    name: 'Brookefields Mall',
    address: 'Brookefields Mall, Saibaba Colony, Coimbatore',
    coordinates: { lat: 11.0168, lng: 76.9739 },
    type: 'mall'
  },
  {
    id: 'loc_005',
    name: 'Coimbatore Railway Station',
    address: 'Coimbatore Junction, Railway Station Road, Coimbatore',
    coordinates: { lat: 11.0015, lng: 76.9636 },
    type: 'station'
  },
  {
    id: 'loc_006',
    name: 'KMCH Hospital',
    address: 'Kovai Medical Center and Hospital, Avinashi Road, Coimbatore',
    coordinates: { lat: 11.0510, lng: 76.9635 },
    type: 'hospital'
  }
];

/**
 * Search for location suggestions
 * TODO: Integrate with Google Maps API for real location data
 */
export async function searchLocations(req: Request, res: Response): Promise<void> {
  try {
    const { q: query, limit = '10', type } = req.query as {
      q?: string;
      limit?: string;
      type?: LocationSuggestion['type'];
    };

    if (!query || typeof query !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Query parameter "q" is required',
        timestamp: new Date().toISOString()
      } as ApiResponse);
      return;
    }

    const maxResults = Math.min(parseInt(limit) || 10, 50);

    // TODO: Replace with Google Maps API integration
    let filteredLocations = mockLocations.filter(location =>
      location.name.toLowerCase().includes(query.toLowerCase()) ||
      location.address.toLowerCase().includes(query.toLowerCase())
    );

    // Filter by type if specified
    if (type) {
      filteredLocations = filteredLocations.filter(location => location.type === type);
    }

    // Limit results
    const results = filteredLocations.slice(0, maxResults);

    const response: ApiResponse<LocationSuggestion[]> = {
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    };

    res.json(response);
  } catch (error) {
    console.error('Error in searchLocations:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to search locations',
      timestamp: new Date().toISOString()
    } as ApiResponse);
  }
}

/**
 * Get detailed information about a specific location
 * TODO: Integrate with Google Maps API for detailed location data
 */
export async function getLocationDetails(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: 'Location ID is required',
        timestamp: new Date().toISOString()
      } as ApiResponse);
      return;
    }

    // TODO: Replace with Google Maps API integration
    const location = mockLocations.find(loc => loc.id === id);

    if (!location) {
      res.status(404).json({
        success: false,
        error: 'Location not found',
        timestamp: new Date().toISOString()
      } as ApiResponse);
      return;
    }

    const response: ApiResponse<LocationSuggestion> = {
      success: true,
      data: location,
      timestamp: new Date().toISOString()
    };

    res.json(response);
  } catch (error) {
    console.error('Error in getLocationDetails:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to get location details',
      timestamp: new Date().toISOString()
    } as ApiResponse);
  }
}