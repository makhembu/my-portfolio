/**
 * Centralized Gemini API Client
 * Single file for all Google Gemini AI requests
 * Handles API key management and model initialization
 * Env vars are ONLY evaluated at runtime, never at build time
 */

import { GoogleGenAI } from "@google/genai";

let geminiClient: GoogleGenAI | null = null;

/**
 * Get or create the Gemini client instance
 * Lazy initialization at runtime (not build time) to avoid env var issues
 * This function is only called when AI is actually needed, never at build time
 */
export function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    // Only access env var when this function is actually called (at runtime)
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 
                   process.env.GEMINI_API_KEY ||
                   "";
    
    if (!apiKey) {
      throw new Error(
        'Gemini API key is not configured. ' +
        'Set NEXT_PUBLIC_GEMINI_API_KEY or GEMINI_API_KEY in your environment variables.'
      );
    }
    
    geminiClient = new GoogleGenAI({ apiKey });
  }
  
  return geminiClient;
}

/**
 * Generate content using Gemini API
 * @param model - Model to use (e.g., "gemini-2.5-flash")
 * @param prompt - Text prompt to send to the model
 * @returns Generated text content
 */
export async function generateGeminiContent(
  model: string,
  prompt: string
): Promise<string> {
  const client = getGeminiClient();
  const response = await client.models.generateContent({
    model,
    contents: prompt,
  });

  const content = response.response.content();
  if (content && content.parts && content.parts.length > 0) {
    const part = content.parts[0];
    if ('text' in part) {
      return part.text;
    }
  }

  throw new Error('Empty response from Gemini API');
}

/**
 * Stream content from Gemini API
 * @param model - Model to use
 * @param prompt - Text prompt to send to the model
 * @returns Async generator for streaming content
 */
export async function* streamGeminiContent(
  model: string,
  prompt: string
) {
  const client = getGeminiClient();
  const response = await client.models.streamGenerateContent({
    model,
    contents: prompt,
  });
  
  for await (const chunk of response.stream) {
    yield chunk;
  }
}

/**
 * Chat with Gemini using system instructions
 * @param systemInstruction - System prompt to guide the AI behavior
 * @param userMessage - User's message
 * @param model - Model to use (default: gemini-2.5-flash)
 * @returns AI response text
 */
export async function chatWithGemini(
  systemInstruction: string,
  userMessage: string,
  model: string = "gemini-2.5-flash"
): Promise<string> {
  try {
    const client = getGeminiClient();
    
    const response = await client.models.generateContent({
      model,
      systemInstruction,
      contents: userMessage,
    });

    const content = response.response.content();
    if (content && content.parts && content.parts.length > 0) {
      const part = content.parts[0];
      if ('text' in part) {
        return part.text;
      }
    }

    return "I encountered an issue processing your request. Please try again.";
  } catch (error) {
    console.error("Error in chatWithGemini:", error);
    throw error;
  }
}

/**
 * Analyze text with Gemini
 * @param prompt - Analysis prompt
 * @param model - Model to use
 * @returns Analysis result
 */
export async function analyzeWithGemini(
  prompt: string,
  model: string = "gemini-2.5-flash"
): Promise<string> {
  try {
    return await generateGeminiContent(model, prompt);
  } catch (error) {
    console.error("Error in analyzeWithGemini:", error);
    throw error;
  }
}

/**
 * Legacy compatibility: Export getGeminiClient as getAi for backwards compatibility
 * This allows services to work without major refactoring
 */
export const getAi = getGeminiClient;
