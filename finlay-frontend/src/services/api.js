/**
 * Centralized API Service
 * All external requests from the frontend must go through these functions.
 * No API keys or secret tokens should be present here.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const WS_BASE = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';

export const apiClient = {
  /**
   * Send a chat message to Qbit via the HTTP endpoint
   */
  async sendChatMessage(userId, message) {
    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, message }),
      });
      if (!response.ok) throw new Error('Failed to get chat response');
      return await response.json();
    } catch (error) {
      console.error('API Error (Chat):', error);
      throw error;
    }
  },

  /**
   * Execute a simulated trade through the backend
   */
  async executeTrade(userId, symbol, action, quantity) {
    try {
      const response = await fetch(`${API_BASE}/trade/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          symbol,
          action,
          quantity
        }),
      });
      if (!response.ok) throw new Error('Trade execution failed');
      return await response.json();
    } catch (error) {
      console.error('API Error (Trade):', error);
      throw error;
    }
  },

  /**
   * Securely fetch market data via the backend proxy
   */
  async getMarketData(symbol) {
    try {
      const response = await fetch(`${API_BASE}/market/data/${symbol}`);
      if (!response.ok) throw new Error('Market data fetch failed');
      return await response.json();
    } catch (error) {
      console.error('API Error (Market):', error);
      throw error;
    }
  },

  /**
   * Provide the WebSocket URL for Qbit live chat
   */
  getChatWebSocketUrl() {
    return `${WS_BASE}/chat`;
  }
};
