import { storeMemory } from '../services/hindsightService.js';
import { generateResponse } from '../services/groqService.js';

/**
 * Memory Agent evaluates the interaction and decides what is worth saving.
 */
export const memoryAgent = async (userId, userInput, agentOutput) => {
  const systemPrompt = `
    You are the Memory Extraction Agent.
    Analyze the user input and the AI output. Extract a 1-sentence summary of any new, persistent user preference, behavioral pattern, or trading outcome that should be remembered for future sessions.
    If nothing is worth remembering, return { "shouldSave": false }.
    If something is important, return { "shouldSave": true, "memoryType": "preference|outcome", "memoryText": "<text>" }
    
    User Input: ${userInput}
    Agent Output: ${JSON.stringify(agentOutput)}
    
    Respond strictly in JSON.
  `;

  try {
    const response = await generateResponse('Extract memory.', systemPrompt);
    const parsed = JSON.parse(response);

    if (parsed.shouldSave && parsed.memoryText) {
      await storeMemory(userId, parsed.memoryType || 'interaction', parsed.memoryText);
      console.log(`[Memory Agent] Saved ${parsed.memoryType} memory for user ${userId}.`);
    }
  } catch (error) {
    // Silently fail as this is a background process
    console.error('[Memory Agent] Failed to process memory:', error.message);
  }
};
