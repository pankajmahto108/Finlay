import { generateResponse, extractIntent } from '../services/groqService.js';
import { retrieveMemory } from '../services/hindsightService.js';

// Import sub-agents
import { tradingAgent } from './tradingAgent.js';
import { analysisAgent } from './analysisAgent.js';
import { memoryAgent } from './memoryAgent.js';
import { recommendationAgent } from './recommendationAgent.js';
import { deepSearchAgent } from './deepSearchAgent.js';
import { todoAgent } from './todoAgent.js';
import { insightAgent } from './insightAgent.js';

/**
 * Qbit Orchestrator
 * Fully parallelized multi-agent execution pipeline.
 */
export const qbitAgent = async (userId, prompt, imageConfig = null) => {
  console.log(`[Qbit Orchestrator] Triggered by ${userId}. Prompt: ${prompt.substring(0, 50)}...`);

  // 1. Retrieve generalized memory context
  const memoryContextArr = await retrieveMemory(userId, prompt);
  const memoryString = memoryContextArr.length > 0 ? memoryContextArr.join('; ') : 'No long-term memory found.';

  // 2. Decide intent using LLM (Returns array of agent strings)
  const agentsToCall = await extractIntent(prompt);
  console.log(`[Qbit Orchestrator] Selected Agents: ${agentsToCall.join(', ')}`);

  // 3. Prepare execution promises
  const executionPromises = [];
  const executionMap = {}; // Maps promise index to agent name for recombination

  agentsToCall.forEach((agentName, index) => {
    executionMap[index] = agentName;
    switch (agentName) {
      case 'trading':
        executionPromises.push(tradingAgent(userId, prompt, memoryString));
        break;
      case 'analysis':
        executionPromises.push(analysisAgent(userId, prompt, memoryString));
        break;
      case 'recommendation':
        executionPromises.push(recommendationAgent(userId, prompt, memoryString));
        break;
      case 'deepSearch':
        executionPromises.push(deepSearchAgent(userId, prompt, memoryString));
        break;
      case 'todo':
        executionPromises.push(todoAgent(userId, prompt, memoryString));
        break;
      case 'insight':
      default:
        executionPromises.push(insightAgent(userId, prompt, memoryString));
        executionMap[index] = 'insight';
        break;
    }
  });

  // Always include a base insight execution if none matched
  if (executionPromises.length === 0) {
    executionPromises.push(insightAgent(userId, prompt, memoryString));
    executionMap[0] = 'insight';
  }

  // 4. Fire parallel executions (The core of multi-agent speed)
  const resultsArr = await Promise.all(executionPromises);
  
  // 5. Combine outputs
  const combinedRawOutputs = {};
  resultsArr.forEach((result, index) => {
    const name = executionMap[index];
    combinedRawOutputs[name] = result;
  });

  // 6. Master Synthesis: Qbit processes the combined data into exactly what the frontend needs
  // Include visual analysis context if an image was provided via modal injection.
  const visualContext = imageConfig ? `Image Analysis Context: ${imageConfig.analysis}` : "No image provided.";

  const finalSystemPrompt = `
    You are Qbit, the Master AI Orchestrator.
    Synthesize the raw outputs from your sub-agents into a final, highly-structured response for the user.
    Also incorporate this memory context: ${memoryString}
    ${visualContext}
    
    Sub-agent payload: ${JSON.stringify(combinedRawOutputs)}
    
    You must output strictly in JSON.
    Structure:
    {
      "master_response": "<A conversational summary of all findings>",
      "action_decision": "BUY|SELL|HOLD|RESEARCH",
      "todo_list": [ <insert exactly what the todoAgent outputted if available, or generate your own> ],
      "key_insights": [ <insert from insightAgent or deepSearchAgent> ],
      "reasoning": "<final synthesized reasoning>"
    }
  `;

  let finalResponse = {};
  try {
    const rawMaster = await generateResponse(prompt, finalSystemPrompt, true);
    finalResponse = JSON.parse(rawMaster);
  } catch(e) {
    console.error("[Qbit Master] Failed strict JSON parse", e);
    finalResponse = { master_response: "Agent pipeline completed but synthesis failed to parse.", action_decision: "RESEARCH" };
  }

  // 7. Fire Memory Synthesis Agent asynchronously (The Learning Loop)
  memoryAgent(userId, prompt, finalResponse).catch(err => console.error('[Memory Loop] Error:', err));

  return finalResponse;
};
