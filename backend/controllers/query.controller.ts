import { Request, Response } from 'express';
import type { QueryIntent } from '../types/index';

export function handleQueryIntent(req: Request, res: Response) {
  const body = req.body as Partial<QueryIntent>;
  if (!body?.origin || !body?.destination) {
    return res.status(400).json({ error: 'origin and destination are required' });
  }

  const intent: QueryIntent = {
    origin: body.origin,
    destination: body.destination,
    constraints: body.constraints,
  };

  return res.json({ intent });
}


