import { generateResponse } from '../services/groqService.js';

export const deepSearchAgent = async (userId, prompt, memoryContext) => {
  console.log(`[DeepSearch Agent] Analyzing search requirement for ${userId}`);
  
  // In a production app, we would ping Tavily, SerpAPI, or a vector DB with external articles here.
  // For the hackathon, we simulate a deep fundamental analysis search via LLM knowledge retrieval.
  
  const systemPrompt = `
    You are the Deep Search Agent. The user is asking a question that requires external context or heavy analysis.
    Retrieve simulated real-time insights or deep historical context based on their prompt.
    Consider their memory context: ${memoryContext}
    
    Output MUST be valid JSON:
    { "search_summary": "<detailed insights>", "key_metrics": ["<metric1>", "<metric2>"] }
  `;

  try {
    const response = await generateResponse(prompt, systemContext, true);
    return JSON.parse(response);
  } catch (err) {
    console.error('[DeepSearch Agent] Error:', err);
    return { search_summary: "Deep search failed to process.", key_metrics: [] };
  }
};
