
import { chatWithGemini, analyzeWithGemini } from "@/lib/geminiClient";
import { portfolioData } from "@/portfolioData";

/**
 * SAFETY CONSTRAINTS for all AI features:
 * ========================================
 * 1. SUMMARIZATION ONLY: AI summarizes documented portfolio content
 * 2. NO EXAGGERATION: Cannot invent or inflate Brian's experience
 * 3. SOURCE OF TRUTH: All claims must defer to portfolio data and GitHub repos
 * 4. CODE REFERENCES: When relevant, reference actual code from GitHub
 * 5. NO CONFIDENCE THEATER: Don't make overconfident claims
 * 6. EXPLICIT LIMITS: AI acknowledges what's outside its knowledge
 * 7. DEFER TO SOURCE: Always point to original content as primary source
 */

const GITHUB_REPOS = {
  portfolio: "https://github.com/makhembu/portfolio",
  // Add more repos as needed for code examples
};

/**
 * Chat with Brian's AI Assistant
 * CONSTRAINED to summarization only - no speculation, role recommendations, or skill inflation
 * 
 * @param message - User message to send to the AI
 * @returns Promise resolving to AI response or error message
 */
export const chatWithBrianAI = async (message: string): Promise<string> => {
  if (!message || message.trim().length === 0) {
    return "Please provide a message to continue the conversation.";
  }

  // Enforce request length cap (5000 chars) to prevent API spam
  const maxMessageLength = 5000;
  if (message.length > maxMessageLength) {
    return "Your message is too long. Please keep it under 5000 characters.";
  }

  const { profile, socials, projects, detailedContext, experience } = portfolioData;
  
  const systemInstruction = `
    You are an AI assistant representing Brian Makhembu's professional background.
    
    *** CRITICAL SAFETY CONSTRAINTS ***
    1. SUMMARIZATION ONLY: You summarize and explain Brian's DOCUMENTED experience only.
    2. NO INVENTION: Never invent skills, projects, or experience Brian doesn't have.
    3. NO EXAGGERATION: Don't inflate accomplishments or inflate confidence claims.
    4. SOURCE OF TRUTH: All claims must refer to portfolio content at brianuche.dev.
    5. CODE REFERENCES: Reference actual code from GitHub when relevant: ${GITHUB_REPOS.portfolio}
    6. NOT A DECISION-MAKER: You are a reference tool, not a career advisor.
    7. ADMIT LIMITS: When something is outside documented content, explicitly say so.
    
    WHO IS BRIAN? (From documented portfolio only)
    Name: ${profile.firstName} ${profile.lastName}
    Location: ${profile.location}
    Education: ${profile.education}
    
    Career tracks:
    - IT Track: Full-Stack Engineer | AI/ML & Automation
    - Translation Track: Professional English-Swahili Linguist & Technical Translator
    
    KEY DOCUMENTED BACKGROUND:
    - JKUAT: School of Computing and Information Technology (SCIT), specialized in Decision Support Systems (DSS)
    - FARNHAM & AVENTUS: 6+ years (2017-2024) managing IT infrastructure, deployed 10+ school labs across Kenya
    - NOTIFY LOGISTICS: Android development focusing on logistics tracking
    - UX PHILOSOPHY: "Strategy over Aesthetics" - research-driven, documented in portfolio
    - LINGUISTICS: Professional English-Swahili translator at Jambo Linguists, 2+ years experience
    - CURRENT: Full-Stack Development (React, Next.js, TypeScript, Node.js), cloud infrastructure
    
    DOCUMENTED EXPERIENCE:
    ${experience
      .map(e => `- ${e.role} at ${e.company} (${e.period}): ${e.description.join('; ')}`)
      .join('\n')}
    
    DOCUMENTED PROJECTS:
    ${projects
      .map(p => `- ${p.title} (${p.category}): ${p.description}`)
      .join('\n')}
    
    YOUR RESPONSE RULES:
    1. Keep responses under 150 words (concise, not extended commentary)
    2. Reference SPECIFIC documented roles and timelines from portfolio
    3. If asked "is Brian good at X?", provide documented examples ONLY
    4. If skills question: Check if it's in documented experience or projects first
    5. For code-related questions: Reference ${GITHUB_REPOS.portfolio} when relevant
    6. Never say "Brian is probably...", "Brian might...", or other speculation
    7. When asked for advice: "I can explain what Brian has done, but decisions are his to make."
    8. Direct to source: "See [portfolio section] at brianuche.dev for details"
    9. Admit limits: "This is outside Brian's documented portfolio content"
    10. Contact info: GitHub (${socials.github}), LinkedIn (${socials.linkedin})
    
    FORBIDDEN:
    - Skill inflation or invented accomplishments
    - Career recommendations or advice
    - Confidence-theater claims ("definitely", "clearly excellent")
    - Speculation about future capabilities
    - Claims not backed by documented content
    
    Remember: You're a summarizer amplifying Brian's own documented achievements, not adding new ones.
  `;

  try {
    const response = await chatWithGemini(systemInstruction, message, "gemini-2.5-flash");
    
    // Truncate extremely long responses to enforce conciseness
    const maxResponseLength = 800;
    if (response.length > maxResponseLength) {
      return response.substring(0, maxResponseLength) + "...\n\nFor more details, visit brianuche.dev or contact Brian directly.";
    }
    
    return response;
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
 * Get suggested starter prompts for the AI assistant
 * Constrain conversation to documented content only
 */
export const getStarterPrompts = (): string[] => {
  return [
    "What are Brian's main technical skills?",
    "Tell me about Brian's infrastructure experience",
    "What full-stack projects has Brian built?",
    "What's Brian's background in Swahili translation?",
    "Explain Brian's UX 'Strategy over Aesthetics' philosophy",
    "What's Brian's experience level with React and Node.js?"
  ];
};

/**
 * Translate text from English to Swahili using AI
 * Professional, context-aware translation
 * CONSTRAINT: Professional translator only, maintains technical accuracy
 * 
 * @param text - English text to translate
 * @returns Promise resolving to Swahili translation or error message
 */
export const translateText = async (text: string): Promise<string> => {
  if (!text || text.trim().length === 0) {
    return "Please provide text to translate.";
  }

  // Enforce length limit (5000 chars)
  const maxLength = 5000;
  if (text.length > maxLength) {
    return `Text too long. Maximum ${maxLength} characters. Your text: ${text.length} characters.`;
  }

  try {
    const systemPrompt = `You are ${portfolioData.profile.firstName} ${portfolioData.profile.lastName}, a professional English-Swahili translator with 2+ years of experience in technical documentation translation.

TRANSLATION CONSTRAINTS:
1. Professional, context-aware tone for East African business
2. Preserve technical terminology accurately
3. Natural Swahili - not word-for-word
4. Maintain document structure (paragraphs, lists, etc.)
5. For technical terms without Swahili equivalents, use the English term in parentheses

Translate the following text to professional Swahili:`;

    const fullPrompt = `${systemPrompt}\n\n${text}`;
    const translation = await analyzeWithGemini(fullPrompt, "gemini-2.5-flash");
    
    return translation;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Translation error:", errorMessage);
    
    if (errorMessage.includes('API_KEY')) {
      return "Configuration error: API key not set.";
    }
    
    if (errorMessage.includes('timeout')) {
      return "Translation request timed out. Please try with shorter text.";
    }
    
    return "Error: Could not process translation at this time.";
  }
};

/**
 * Validate and enhance resume with documented context only
 * NO skill inflation or invention
 * All recommendations must be supported by portfolio content
 */
export const validateResumeContent = (
  resumeData: any
): { valid: boolean; warnings: string[] } => {
  const warnings: string[] = [];
  
  // Check that experience matches portfolio
  const portfolioRoles = portfolioData.experience.map(e => e.role.toLowerCase());
  
  if (resumeData.experience) {
    for (const exp of resumeData.experience) {
      const roleExists = portfolioRoles.some(r => 
        r.includes(exp.role.toLowerCase()) || 
        exp.role.toLowerCase().includes(r)
      );
      
      if (!roleExists) {
        warnings.push(
          `Experience role "${exp.role}" not found in documented portfolio. Ensure all roles are documented.`
        );
      }
    }
  }
  
  // Check skills are documented
  const documentedSkills = [
    ...portfolioData.skills.it.frontend,
    ...portfolioData.skills.it.backend,
    ...portfolioData.skills.it.infrastructure,
    ...portfolioData.skills.translation.technical,
    ...portfolioData.skills.translation.languages,
  ].map(s => s.toLowerCase());
  
  if (resumeData.skills) {
    const allSkills = [
      ...(resumeData.skills.frontend || []),
      ...(resumeData.skills.backend || []),
      ...(resumeData.skills.infrastructure || []),
    ];
    
    for (const skill of allSkills) {
      if (!documentedSkills.includes(skill.toLowerCase())) {
        warnings.push(
          `Skill "${skill}" not found in documented portfolio. Only include documented skills.`
        );
      }
    }
  }
  
  return {
    valid: warnings.length === 0,
    warnings,
  };
};