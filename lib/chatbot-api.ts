import { env } from "process";

// API configuration for the 100Gaj Chatbot
export const CHATBOT_CONFIG = {
  API_BASE_URL: env.NEXT_PUBLIC_CHATBOT_API_URL || 'https://100gaj-chatbot-production.up.railway.app',
  ENDPOINTS: {
    HEALTH: '/',
    CHAT: '/api/v1/chat',
  },
  TIMEOUT: 30000, // 30 seconds
};

// Health check function
export const checkChatbotHealth = async (): Promise<{ isHealthy: boolean; message: string }> => {
  try {
    const response = await fetch(CHATBOT_CONFIG.API_BASE_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status === 'ok') {
      return {
        isHealthy: true,
        message: data.message || '100Gaj Chatbot API is running',
      };
    } else {
      return {
        isHealthy: false,
        message: 'API returned unexpected response',
      };
    }
  } catch (error) {
    console.error('Chatbot health check failed:', error);
    return {
      isHealthy: false,
      message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

// Types for chatbot messages
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface ChatRequest {
  message: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface ChatStreamData {
  type: 'text' | 'end';
  data?: string;
}
