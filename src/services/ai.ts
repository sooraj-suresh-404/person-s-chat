import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AIPersonality } from '../types';

// Validate API key
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('Missing GEMINI_API_KEY environment variable');
}

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || 'dummy-key');

// Store chat history for each personality
const chatHistories = new Map<string, any>();

interface PersonalityConfig {
  prompt: string;
  formatResponse?: (response: string) => string;
  temperature?: number;
  topK?: number;
  topP?: number;
}

const personalityConfigs: Record<string, PersonalityConfig> = {
  '1': {
    prompt: `You are Albert Einstein. Respond as if you are the famous physicist, incorporating these elements:
    - Use your knowledge of physics, relativity, and scientific concepts
    - Occasionally reference your famous quotes and theories
    - Show curiosity and wonder about scientific phenomena
    - Keep responses concise and engaging
    - Sometimes include "mein Freund" or similar German phrases
    - Express humility despite your genius
    Keep responses under 150 words.`,
    temperature: 0.9,
    formatResponse: (response) => response.replace(/^(Einstein:|Albert Einstein:)/, '').trim(),
  },
  '2': {
    prompt: `You are William Shakespeare. Respond as the legendary playwright and poet with these characteristics:
    - Use Early Modern English occasionally, but remain understandable
    - Reference your plays and sonnets when relevant
    - Include poetic elements and wordplay
    - Keep responses concise and engaging
    - Sometimes speak in iambic pentameter
    Keep responses under 150 words.`,
    temperature: 0.8,
    formatResponse: (response) => response.replace(/^(Shakespeare:|William Shakespeare:)/, '').trim(),
  },
  '3': {
    prompt: `You are Marie Curie. Respond as the pioneering scientist with these elements:
    - Draw from your knowledge of radioactivity and chemistry
    - Reference your discoveries and research
    - Show passion for scientific inquiry
    - Occasionally include French phrases
    - Emphasize the importance of persistence in research
    Keep responses under 150 words.`,
    temperature: 0.7,
    formatResponse: (response) => response.replace(/^(Marie Curie:|Madame Curie:)/, '').trim(),
  },
};

export async function generateResponse(personalityId: string, userMessage: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    return 'API key not configured. Please add your Gemini API key to the .env file.';
  }

  const config = personalityConfigs[personalityId];
  if (!config) {
    return 'Personality configuration not found.';
  }

  try {
    // Get or create a new chat for this personality
    let chat = chatHistories.get(personalityId);
    if (!chat) {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-pro',
        generationConfig: {
          temperature: config.temperature,
          topK: config.topK,
          topP: config.topP,
          maxOutputTokens: 200,
        },
      });

      chat = model.startChat({
        history: [
          {
            role: 'user',
            parts: config.prompt,
          },
          {
            role: 'model',
            parts: 'I understand and will respond accordingly.',
          },
        ],
      });
      chatHistories.set(personalityId, chat);
    }

    // Generate response
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const text = response.text();
    
    // Apply personality-specific formatting if available
    return config.formatResponse ? config.formatResponse(text) : text;
  } catch (error) {
    console.error('Error generating response:', error);
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return 'Invalid API key. Please check your Gemini API key configuration.';
      }
      if (error.message.includes('network')) {
        return 'Network error. Please check your internet connection and try again.';
      }
      if (error.message.includes('rate limit')) {
        return 'Rate limit exceeded. Please wait a moment before trying again.';
      }
      if (error.message.includes('content filtered')) {
        return 'I apologize, but I cannot provide a response to that message.';
      }
    }
    return 'I apologize, but I am unable to respond at the moment. Please try again later.';
  }
}

// Helper function to clear chat history for a personality
export function clearChatHistory(personalityId: string): void {
  chatHistories.delete(personalityId);
}

// Helper function to clear all chat histories
export function clearAllChatHistories(): void {
  chatHistories.clear();
}