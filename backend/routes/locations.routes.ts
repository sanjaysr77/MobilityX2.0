import { Router } from 'express';
import { searchLocations } from '../controllers/locations.controller';

const router = Router();

router.get('/search', searchLocations);

export default router;


