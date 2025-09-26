export interface RouteOption {
  id: string;
  mode: 'Bus' | 'Auto' | 'Cab';
  origin: string;
  destination: string;
  durationMinutes: number;
  costINR: number;
  etaMinutes?: number;
}

export interface QueryIntent {
  origin: string;
  destination: string;
  constraints?: {
    maxCostINR?: number;
    maxDurationMinutes?: number;
    preferredModes?: Array<RouteOption['mode']>;
  };
}

export interface RecommendInput {
  intent: QueryIntent;
  options: RouteOption[];
}

export type Id = string;


