import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import FormData from 'form-data';

dotenv.config();

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

export const generateResponse = async (prompt, systemContext = 'You are a helpful AI.', enforceJSON = true) => {
  if (!groq) return JSON.stringify({ error: "Groq API key not configured." });

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemContext },
        { role: 'user', content: prompt }
      ],
      model: 'llama3-70b-8192',
      temperature: 0.3,
      max_tokens: 2000,
      top_p: 1,
      stream: false,
      response_format: enforceJSON ? { type: 'json_object' } : undefined
    });

    return chatCompletion.choices[0]?.message?.content || '{}';
  } catch (error) {
    console.error('Groq API Error [LLM]:', error);
    throw new Error('Failed to communicate with Groq AI');
  }
};

/**
 * Parses user intent to route to sub-agents cleanly
 */
export const extractIntent = async (prompt) => {
  const systemContext = `
    You are the Master Intent Classifier.
    Analyze the prompt and decide which parallel agents to trigger.
    Possible agents: 'trading', 'deepSearch', 'todo', 'insight'.
    Return a strict JSON array of strings, e.g., { "agents": ["deepSearch", "insight"] }
  `;
  try {
    const raw = await generateResponse(prompt, systemContext, true);
    return JSON.parse(raw).agents || ["insight"];
  } catch(e) {
    return ["insight"];
  }
};

/**
 * Transcribes audio via Groq Whisper API
 * @param {Buffer} audioBuffer 
 * @param {string} filename 
 */
export const transcribeAudio = async (audioBuffer, filename = 'audio.wav') => {
  if (!groq) throw new Error("Groq API key not found");
  
  try {
    // Convert buffer to something Groq's SDK expects (File-like object or stream via custom wrapper)
    // The easiest way for raw buffer in Node/Groq SDK is using a Custom File type or saving temporarily.
    // For in-memory hackathon use: We convert buffer to a Blob-like File or use form-data natively.
    // Groq SDK actually natively accepts standard Web File API if available, or fetch standards.
    const file = new File([audioBuffer], filename, { type: 'audio/wav' });

    const transcription = await groq.audio.transcriptions.create({
      file: file,
      model: "whisper-large-v3",
      response_format: "text",
    });

    return transcription;
  } catch (error) {
    console.error('Groq API Error [Whisper]:', error);
    throw new Error('Failed to transcribe audio via Groq');
  }
};

/**
 * Analyzes an image via Groq Vision API
 * @param {string} base64Image - the base64 encoded string of the image (without data:image prefix)
 * @param {string} prompt 
 */
export const analyzeImage = async (base64Image, prompt = "Explain what is in this image regarding financial markets.") => {
  if (!groq) throw new Error("Groq API key not found");

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      model: "llama-3.2-11b-vision-preview",
      temperature: 0.2,
      max_tokens: 1024,
      top_p: 1,
      stream: false
    });

    return chatCompletion.choices[0]?.message?.content || 'No analysis returned.';
  } catch (error) {
    console.error('Groq API Error [Vision]:', error);
    throw new Error('Failed to analyze image via Groq Vision');
  }
};
