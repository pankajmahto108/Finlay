import { retain, recall } from '../services/hindsightService.js';

export const addMemory = async (req, res, next) => {
  try {
    const { userId, memoryType, content, metadata } = req.body;

    if (!userId || !memoryType || !content) {
      return res.status(400).json({ error: 'userId, memoryType, and content are required' });
    }

    const memory = await retain(userId, content, { memoryType, ...metadata });
    res.status(201).json(memory);
  } catch (error) {
    next(error);
  }
};

export const getMemories = async (req, res, next) => {
  try {
    const { userId, query } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const memories = await recall(userId, query || '', 5);
    res.json(memories);
  } catch (error) {
    next(error);
  }
};
