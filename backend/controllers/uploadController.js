import { transcribeAudio, analyzeImage } from '../services/groqService.js';
import { qbitAgent } from '../agents/qbitAgent.js';

/**
 * Handle Voice Command
 * Receives audio buffer, transcribes via Whisper, sends pure text to Qbit
 */
export const handleAudioUpload = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No audio file uploaded' });
    const { userId } = req.body;

    console.log('[Upload] Transcribing audio...');
    const transcription = await transcribeAudio(req.file.buffer, req.file.originalname);
    const spokenText = transcription.text;
    console.log(`[Upload] Transcribed text: "${spokenText}"`);

    // Route straight to Qbit as if they typed it
    const aiResponse = await qbitAgent(userId || 'default_user', spokenText);

    // Attach the transcription so the frontend knows what was heard
    res.json({ transcribed_text: spokenText, ...aiResponse });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle Vision Command
 * Receives image buffer, converts to base64, analyzes via LlaVA, then sends analysis to Qbit
 */
export const handleImageUpload = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image file uploaded' });
    const { userId, prompt } = req.body;

    // Convert memory buffer to base64 for Groq Vision
    const base64Image = req.file.buffer.toString('base64');

    const userPrompt = prompt || "Analyze this financial chart or data.";
    console.log('[Upload] Sending image to Groq Vision...');

    const visualAnalysis = await analyzeImage(base64Image, userPrompt);
    console.log(`[Upload] Image Analysis: ${visualAnalysis.substring(0, 50)}...`);

    // We pass the analysis into Qbit as 'imageConfig' to synthesize with other agents
    const aiResponse = await qbitAgent(userId || 'default_user', userPrompt, { analysis: visualAnalysis });

    res.json(aiResponse);
  } catch (error) {
    next(error);
  }
};
