import express from 'express';
import { searchLocations, getLocationDetails } from '../controllers/locationsController.js';

const router = express.Router();

/**
 * GET /locations/search?q=query&limit=10&type=landmark
 * Search for location suggestions
 * 
 * Query params: q (required), limit (optional), type (optional)
 * Response: { success: boolean, data: LocationSuggestion[], timestamp: string }
 */
router.get('/search', searchLocations);

/**
 * GET /locations/:id
 * Get detailed information about a specific location
 * 
 * Params: id (location ID)
 * Response: { success: boolean, data: LocationSuggestion, timestamp: string }
 */
router.get('/:id', getLocationDetails);

/**
 * GET /locations/test
 * Test endpoint for locations
 */
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Locations route is working',
    timestamp: new Date().toISOString()
  });
});

export default router;