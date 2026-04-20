import { generateResponse } from '../services/groqService.js';

export const analysisAgent = async (userId, prompt, memoryContext) => {
  const systemPrompt = `
    You are the Market Analysis Agent.
    Provide detailed fundamental and technical analysis based on user prompt.
    Memory Context: ${memoryContext}
    
    Output JSON: { "sentiment": "bullish|bearish|neutral", "analysis": "<detailed_analysis>", "response": "<summary for user>" }
  `;

  const rawResponse = await generateResponse(prompt, systemPrompt);
  
  try {
    return JSON.parse(rawResponse);
  } catch (e) {
    return { error: 'Failed to parse analysis', detail: rawResponse };
  }
};
