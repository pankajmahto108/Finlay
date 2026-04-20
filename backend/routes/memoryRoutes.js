import express from 'express';
import { addMemory, getMemories } from '../controllers/memoryController.js';

const router = express.Router();

router.post('/', addMemory);
router.get('/', getMemories);

export default router;
