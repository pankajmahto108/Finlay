import { generateResponse } from '../services/groqService.js';

export const todoAgent = async (userId, prompt, memoryContext) => {
  console.log(`[Todo Agent] Generating actionable items for ${userId}`);
  
  const systemPrompt = `
    You are the Task Planning (TODO) Agent.
    Break the user's intent into a structured, highly-actionable step-by-step to-do list.
    Prioritize actions based on risk and execution flow.
    Memory Context: ${memoryContext}
    
    Output MUST be valid JSON:
    { "tasks": [ {"step": 1, "action": "<action>", "priority": "High|Med|Low"} ] }
  `;

  try {
    const response = await generateResponse(prompt, systemContext, true);
    return JSON.parse(response);
  } catch (err) {
    console.error('[Todo Agent] Error:', err);
    return { tasks: [] };
  }
};
