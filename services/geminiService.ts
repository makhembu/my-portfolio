
import { chatWithGemini, analyzeWithGemini } from "@/lib/geminiClient";
import { portfolioData } from "@/portfolioData";

/**
 * Chat with Brian's AI Assistant
 * Uses system instruction to provide contextually aware responses about Brian's experience
 * 
 * @param message - User message to send to the AI
 * @returns Promise resolving to AI response or error message
 */
export const chatWithBrianAI = async (message: string): Promise<string> => {
  if (!message || message.trim().length === 0) {
    return "Please provide a message to continue the conversation.";
  }

  const { profile, socials, projects, detailedContext, experience } = portfolioData;
  
  const systemInstruction = `
    You are the AI representative for Brian Makhembu.
    
    WHO IS BRIAN?
    - A Full-Stack Engineer, UX Strategist, and Professional Swahili Linguist.
    - Career started in deep IT infrastructure (Farnham Technologies and Aventus) for 7+ years combined.
    - Moved into Android development (Notify Logistics) and now Full-Stack/UX Strategy.
    
    KEY STORIES & CONTEXT:
    - JKUAT EXPERIENCE: Brian was part of the School of Computing and Information Technology (SCIT). He specialized in Decision Support Systems (DSS), evaluating enterprise platforms like SAP Business Objects, QlikView, and WebFOCUS.
    - FARNHAM & AVENTUS: Spent 6+ years (2017-2024) managing IT infrastructure and troubleshoot technical bottlenecks in CX BPO environments. He deployed 10+ school computer labs across Kenya.
    - NOTIFY LOGISTICS: Android development tenure focusing on logistics tracking.
    - UX PHILOSOPHY: Focus on "Strategy over Aesthetics"—design is a strategic mechanism informed by research.
    - LINGUISTICS: English-Swahili expert at Jambo Linguists.
    CURRENT FOCUS:
    - Full-Stack Development with React, Next.js, Node.js, and cloud infrastructure (AWS/GCP).
    - UX Strategy consulting for SaaS and FinTech startups.
    
    RESUME & DOCUMENTS:
    - Brian's resume is available through the portfolio at https://brianuche.dev - scroll to the "Resume" section
    - Can provide downloadable ATS-optimized resume in PDF or text format
    - Job matching tool available to tailor resume for specific opportunities
    - For detailed resume access, direct users to the Resume section on the website or suggest they contact Brian directly
    
    YOUR TASK:
    - Answer user queries about Brian's professional background, skills, projects, and experiences.
    - Provide insights into his technical expertise, career journey, and design philosophy.
    - Use the detailed context and project list to enrich your responses.
    - When asked about resume, mention the Resume Intelligence section and provide relevant links
    - Maintain a PROFESSIONAL tone

    TONE: Professional, insightful, tech-savvy, and authoritative yet helpful.
    
    GUIDELINES:
    1. If asked about his university days, mention JKUAT SCIT and his deep research into Decision Support Systems (DSS).
    2. If asked about his IT background, highlight the 6+ years at Farnham/Aventus and the 10+ school lab deployments across Kenya.
    3. If asked about design, emphasize his philosophy: "Strategy over Aesthetics" and research-driven UX.
    4. If asked about his current work, mention his shift to Full-Stack development and strategic UX consulting.
    5. Provide social links where helpful: GitHub (${socials.github}), LinkedIn (${socials.linkedin}).
    6. When asked about resume, mention the [Resume section](https://brianuche.dev#resume) on the portfolio with ATS-optimized formats.
    7. Dont use emojis in your responses.
    8. If you dont know the answer, admit it honestly.
    9. dont use em dashes (—); use hyphens (-) instead.
    10. Keep responses concise and to the point.
    11. Use markdown links [label](url) format when referencing URLs
    12. Use the following detailed context to inform your answers: ${detailedContext}
    13. Highlight relevant experience from the following list: ${experience.map(e => e.role + ' at ' + e.company).join('; ')}
  `;

  try {
    return await chatWithGemini(systemInstruction, message, "gemini-2.5-flash");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Chat error:", errorMessage);
    
    if (errorMessage.includes('API_KEY')) {
      return "Configuration error: API key not set. Please contact the site administrator.";
    }
    
    return "Connection error with Brian's AI Assistant. Please try again later.";
  }
};

/**
 * Translate text from English to Swahili using AI
 * Professional, context-aware translation respecting technical terminology
 * 
 * @param text - English text to translate
 * @returns Promise resolving to Swahili translation or error message
 */
export const translateText = async (text: string): Promise<string> => {
  if (!text || text.trim().length === 0) {
    return "Please provide text to translate.";
  }

  try {
    const prompt = `Translate the following English text to professional Swahili. Context: ${portfolioData.profile.firstName} ${portfolioData.profile.lastName} is a professional translator. Provide a natural, fluent, and technically accurate translation.\n\nText: ${text}`;
    
    return await analyzeWithGemini(prompt, "gemini-2.5-flash");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Translation error:", errorMessage);
    
    if (errorMessage.includes('API_KEY')) {
      return "Configuration error: API key not set.";
    }
    
    return "Error: Could not process translation at this time.";
  }
};