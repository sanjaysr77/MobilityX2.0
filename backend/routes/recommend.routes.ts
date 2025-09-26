import { Router } from 'express';
import { handleRecommend } from '../controllers/recommend.controller';

const router = Router();

router.post('/', handleRecommend);

export default router;


