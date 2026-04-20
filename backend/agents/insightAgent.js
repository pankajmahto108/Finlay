import { generateResponse } from '../services/groqService.js';

export const insightAgent = async (userId, prompt, memoryContext) => {
  console.log(`[Insight Agent] Formulating deep reasoning for ${userId}`);
  
  const systemPrompt = `
    You are the Insight Agent. Add depth, reasoning, and probabilistic "what-if" scenarios to the user's query.
    Why is this happening? What are the underlying risks?
    Memory Context: ${memoryContext}
    
    Output MUST be valid JSON:
    { "reasoning": "<deep explanation>", "risks": ["<risk1>", "<risk2>"], "confidence_score": <0-100> }
  `;

  try {
    const response = await generateResponse(prompt, systemContext, true);
    return JSON.parse(response);
  } catch (err) {
    console.error('[Insight Agent] Error:', err);
    return { reasoning: "Could not generate insights.", risks: [], confidence_score: 50 };
  }
};
