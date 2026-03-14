import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { ChatMessage } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const sendMessageToGemini = async (history: ChatMessage[], message: string): Promise<string> => {
  try {
    const chatHistory = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));

    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: chatHistory
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I'm sorry, I couldn't process that request right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the Login Cafe server. Please try again later or call us directly.";
  }
};