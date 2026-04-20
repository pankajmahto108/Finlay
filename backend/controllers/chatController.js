import { qbitAgent } from '../agents/qbitAgent.js';
import { ChatLog } from '../models/ChatLog.js';
import { retain, recall } from '../services/hindsightService.js';

export const handleChat = async (req, res, next) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: 'userId and message are required' });
    }

    // 1. RECALL: Query past memory related to what the user is asking
    let pastContext = [];
    try {
      pastContext = await recall(userId, message, 3);
    } catch (err) {
      console.warn("Memory recall failed, proceeding without context:", err.message);
    }

    // Process through master agent
    const aiResponse = await qbitAgent(userId, message, pastContext);

    // 2. RETAIN: Save important context from this interaction
    try {
      await retain(userId, message, { role: 'user', type: 'chat_history' });
      await retain(userId, JSON.stringify(aiResponse), { role: 'assistant', type: 'chat_history' });
    } catch (err) {
      console.warn("Memory retain failed, continuing normally:", err.message);
    }

    // Save to traditional chat log asynchronously
    ChatLog.create({
      userId,
      message,
      role: 'user'
    }).catch(console.error);

    ChatLog.create({
      userId,
      message: JSON.stringify(aiResponse),
      role: 'assistant'
    }).catch(console.error);

    res.json(aiResponse);
  } catch (error) {
    next(error); // Pass to error handler
  }
};
