import express from 'express';
import { parseQuery } from '../controllers/queryController.js';

const router = express.Router();

/**
 * POST /query
 * Parse natural language query into structured format
 * 
 * Body: { message: string }
 * Response: { success: boolean, data: ParsedQuery, timestamp: string }
 */
router.post('/', parseQuery);

/**
 * GET /query/test
 * Test endpoint for query parsing
 */
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Query route is working',
    timestamp: new Date().toISOString()
  });
});

export default router;