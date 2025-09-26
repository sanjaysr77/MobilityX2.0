import { Request, Response } from 'express';
import type { RecommendInput, RouteOption } from '../types/index';
import routes from '../data/mockRoutes.json';

export function handleRecommend(req: Request, res: Response) {
  const input = req.body as Partial<RecommendInput>;
  if (!input?.intent?.origin || !input?.intent?.destination) {
    return res.status(400).json({ error: 'intent.origin and intent.destination are required' });
  }

  const options = (routes as RouteOption[]).filter((r) => {
    const matchesOrigin = r.origin.toLowerCase().includes(input.intent!.origin.toLowerCase());
    const matchesDest = r.destination.toLowerCase().includes(input.intent!.destination.toLowerCase());
    return matchesOrigin && matchesDest;
  });

  return res.json({ options });
}


