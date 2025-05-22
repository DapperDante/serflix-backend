import { Router } from 'express';
import { healthCheck } from '../controllers/health.controller';
const routerHealth = Router();
routerHealth.get('/', healthCheck);
export default routerHealth;