import { generateResponse } from '../services/groqService.js';
import { fetchMarketContext } from '../services/insightService.js';

export const tradingAgent = async (userId, prompt, memoryContext) => {
  // Extract potential symbols (mock logic, LLM usually handles this better)
  const marketContext = await fetchMarketContext('BTC'); 

  const systemPrompt = `
    You are the Trading Execution Agent.
    User is asking to trade or check trade viability.
    
    Market Context: ${JSON.stringify(marketContext)}
    Memory Context: ${memoryContext}
    
    Output JSON: { "action": "buy|sell|hold", "confidence": <0-100>, "reasoning": "<why>", "response": "<message to user>" }
  `;

  const rawResponse = await generateResponse(prompt, systemPrompt);
  
  try {
    return JSON.parse(rawResponse);
  } catch (e) {
    return { error: 'Failed to parse trading decision', detail: rawResponse };
  }
};
