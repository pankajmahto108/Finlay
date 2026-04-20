import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.HINDSIGHT_API_KEY;
const BASE_URL = process.env.HINDSIGHT_BASE_URL;
const PIPELINE = process.env.HINDSIGHT_PIPLINE; // Spelling strictly aligned with your .env requirement

/**
 * Retain memory for future use using Hindsight REST API.
 */
export const retain = async (userId, content, metadata = {}) => {
  if (!API_KEY || !BASE_URL) {
    console.error('[Hindsight Retain Error] Missing API keys or base URL in .env');
    return null;
  }

  try {
    const response = await fetch(`${BASE_URL}/retain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        pipeline: PIPELINE,
        userId,
        content,
        metadata
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`API Error ${response.status}: ${err}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[Hindsight Retain Error]', error.message || error);
    throw new Error('Failed to retain memory via Hindsight API');
  }
};

/**
 * Recall memories based on query.
 */
export const recall = async (userId, query, limit = 5) => {
  if (!API_KEY || !BASE_URL) {
    console.error('[Hindsight Recall Error] Missing API keys or base URL in .env');
    return [];
  }

  try {
    const response = await fetch(`${BASE_URL}/recall`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        pipeline: PIPELINE,
        userId,
        query,
        limit
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`API Error ${response.status}: ${err}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[Hindsight Recall Error]', error.message || error);
    throw new Error('Failed to recall memory via Hindsight API');
  }
};
