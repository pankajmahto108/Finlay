import { generateResponse } from '../services/groqService.js';

export const recommendationAgent = async (userId, prompt, memoryContext) => {
  const systemPrompt = `
    You are the Recommendation Agent.
    Suggest portfolio adjustments or new assets based on user history.
    Memory Context: ${memoryContext}
    
    Output JSON: { "suggestions": ["<asset1>", "<asset2>"], "reasoning": "<why>", "response": "<message to user>" }
  `;

  const rawResponse = await generateResponse(prompt, systemPrompt);
  
  try {
    return JSON.parse(rawResponse);
  } catch (e) {
    return { error: 'Failed to parse recommendations', detail: rawResponse };
  }
};
