import { Router } from 'express';
import { handleQueryIntent } from '../controllers/query.controller';

const router = Router();

router.post('/', handleQueryIntent);

export default router;


