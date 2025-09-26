import express from 'express';
import { getRecommendations } from '../controllers/recommendController.js';

const router = express.Router();

/**
 * POST /recommend
 * Get route recommendations based on parsed query
 * 
 * Body: { parsedQuery: ParsedQuery, maxResults?: number }
 * Response: { success: boolean, data: RouteOption[], timestamp: string }
 */
router.post('/', getRecommendations);

/**
 * GET /recommend/test
 * Test endpoint for recommendations
 */
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Recommend route is working',
    timestamp: new Date().toISOString()
  });
});

export default router;