import { Request, Response } from 'express';
import { googlePlacesAutocomplete } from '../utils/googleMapsClient';

export async function searchLocations(req: Request, res: Response) {
  try {
    const query = String(req.query.q || '');
    if (!query) {
      return res.status(400).json({ error: 'q is required' });
    }

    const results = await googlePlacesAutocomplete(query);
    res.json({ results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to search locations' });
  }
}


