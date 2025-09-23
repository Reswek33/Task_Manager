import express from 'express';

import { getStats } from '../controllers/taskController';

const router = express.Router();

router.get('/' , getStats)


export default router;