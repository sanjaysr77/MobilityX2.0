// Core data types for MobilityX backend

export interface ParsedQuery {
  source: string | null;
  destination: string | null;
  intent: 'cheapest' | 'fastest' | 'comfortable' | 'unknown';
  timestamp: string;
}


export interface RouteOption {
  id: string;
  from: string;
  to: string;
  mode: TransportMode;
  cost: number;
  timeMin: number;
  comfort: ComfortLevel;
  distance?: number;
  provider?: string;
  availability?: 'available' | 'limited' | 'unavailable';
  estimatedArrival?: string;
  route?: {
    waypoints?: string[];
    traffic?: 'light' | 'moderate' | 'heavy';
  };
}

export type TransportMode = 'Bus' | 'Auto' | 'Cab' | 'Metro' | 'Walk' | 'Bike';

export type ComfortLevel = 'basic' | 'standard' | 'premium';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface LocationSuggestion {
  id: string;
  name: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  type?: 'landmark' | 'station' | 'college' | 'airport' | 'mall' | 'hospital';
}

// Request/Response interfaces
export interface QueryRequest {
  query: string;
  context?: {
    currentLocation?: string;
    userId?: string;
  };
}

export interface RecommendRequest {
  parsedQuery: ParsedQuery;
  maxResults?: number;
}

export interface LocationSearchRequest {
  query: string;
  limit?: number;
  type?: LocationSuggestion['type'];
}