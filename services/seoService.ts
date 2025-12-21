import { getAi } from "@/lib/geminiClient";
import {
  PageSEO,
  AIGeneratedSEO,
  skillSEOMap,
} from "../seoData";
import {
  readSEOCache,
  updateSEOInCache,
  getSEOFromCache,
} from "@/lib/seoStorage";

/**
 * AI-Powered SEO Content Generation Service
 * Automatically generates optimized SEO content using Google Gemini
 * Stores generated content for automatic optimization
 */

/**
 * Generate SEO-optimized title for a page
 * @param pageContent - Main content/context of the page
 * @param keywords - Target keywords for the page
 * @returns AI-generated title optimized for SEO
 */
export const generateSEOTitle = async (
  pageContent: string,
  keywords: string[]
): Promise<string> => {
  if (!pageContent || pageContent.trim().length === 0) {
    return "Brian Makhembu | Full-Stack Engineer & UX Strategist";
  }

  try {
    const ai = getAi();
    const prompt = `Generate an SEO-optimized page title (max 60 characters) for a portfolio page about: "${pageContent}". Include these keywords naturally: ${keywords.join(", ")}. Return ONLY the title, no explanation.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    if (!response.text) {
      throw new Error("Empty response from AI");
    }

    const title = response.text.trim();
    return title.length > 60 ? title.substring(0, 57) + "..." : title;
  } catch (error) {
    console.error("SEO Title generation error:", error);
    return "Brian Makhembu | Full-Stack Engineer & UX Strategist";
  }
};

/**
 * Generate SEO-optimized meta description
 * @param pageContent - Main content/context of the page
 * @param keywords - Target keywords
 * @returns AI-generated description (120-160 chars)
 */
export const generateSEODescription = async (
  pageContent: string,
  keywords: string[]
): Promise<string> => {
  if (!pageContent || pageContent.trim().length === 0) {
    return "Full-Stack Engineer, UX Strategist, and Professional Swahili Linguist. Expert in infrastructure, design, and technical solutions.";
  }

  try {
    const ai = getAi();
    const prompt = `Generate an SEO meta description (120-160 characters) for: "${pageContent}". Include keywords: ${keywords.join(", ")}. Focus on user benefit. Return ONLY the description.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    if (!response.text) {
      throw new Error("Empty response from AI");
    }

    const description = response.text.trim();
    return description.length > 160
      ? description.substring(0, 157) + "..."
      : description;
  } catch (error) {
    console.error("SEO Description generation error:", error);
    return "Full-Stack Engineer, UX Strategist, and Professional Swahili Linguist specializing in strategic solutions.";
  }
};

/**
 * Generate SEO-optimized keywords list
 * @param pageContent - Main content/context
 * @param baseKeywords - Base keywords to include
 * @returns Array of SEO-optimized keywords
 */
export const generateSEOKeywords = async (
  pageContent: string,
  baseKeywords: string[]
): Promise<string[]> => {
  if (!pageContent || pageContent.trim().length === 0) {
    return baseKeywords;
  }

  try {
    const ai = getAi();
    const prompt = `Generate 10-15 SEO-optimized keywords for: "${pageContent}". Include these base keywords: ${baseKeywords.join(", ")}. Return as comma-separated list ONLY, no explanation.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.6,
      },
    });

    if (!response.text) {
      throw new Error("Empty response from AI");
    }

    const keywords = response.text
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);
    return keywords.length > 0 ? keywords : baseKeywords;
  } catch (error) {
    console.error("SEO Keywords generation error:", error);
    return baseKeywords;
  }
};

/**
 * Generate complete SEO metadata for a page
 * @param pageId - Unique identifier for the page
 * @param pageContent - Main content context
 * @param baseKeywords - Base keywords to include
 * @returns Complete SEO metadata
 */
export const generateCompleteSEOMetadata = async (
  pageId: string,
  pageContent: string,
  baseKeywords: string[]
): Promise<PageSEO> => {
  try {
    const [title, description, keywords] = await Promise.all([
      generateSEOTitle(pageContent, baseKeywords),
      generateSEODescription(pageContent, baseKeywords),
      generateSEOKeywords(pageContent, baseKeywords),
    ]);

    const seoData: PageSEO = {
      title,
      description,
      keywords,
      ogTitle: title,
      ogDescription: description,
    };

    // Store the generated data to JSON file storage
    const aiSEO: AIGeneratedSEO = {
      pageId,
      generatedTitle: title,
      generatedDescription: description,
      generatedKeywords: keywords,
      generatedMetaDescription: description,
      lastUpdated: new Date().toISOString(),
      aiModel: "gemini-2.5-flash",
    };

    // Persist to JSON file
    await updateSEOInCache(pageId, aiSEO);

    return seoData;
  } catch (error) {
    console.error("Complete SEO metadata generation error:", error);
    return {
      title: "Brian Makhembu | Full-Stack Engineer & UX Strategist",
      description:
        "Full-Stack Software Engineer, UX Strategist, and Professional Swahili Linguist.",
      keywords: baseKeywords,
    };
  }
};

/**
 * Generate SEO-optimized content for a specific skill
 * @param skill - Skill name
 * @returns Optimized description for SEO
 */
export const generateSkillSEOContent = async (skill: string): Promise<string> => {
  // Check if we already have cached content
  if (skillSEOMap[skill]) {
    return skillSEOMap[skill];
  }

  try {
    const ai = getAi();
    const prompt = `Write a concise, SEO-optimized 1-2 sentence description for the skill: "${skill}" in the context of a full-stack engineer's portfolio. Include long-tail keywords naturally.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    if (!response.text) {
      throw new Error("Empty response from AI");
    }

    return response.text.trim();
  } catch (error) {
    console.error("Skill SEO content generation error:", error);
    return skillSEOMap[skill] || skill;
  }
};

/**
 * Calculate SEO optimization score (0-100)
 * @param seo - SEO metadata
 * @returns Optimization score
 */
export const calculateSEOScore = (seo: PageSEO): number => {
  let score = 0;

  // Check title (max 20 points)
  if (seo.title && seo.title.length > 0) {
    score += 10;
    if (seo.title.length >= 30 && seo.title.length <= 60) score += 10;
  }

  // Check description (max 20 points)
  if (seo.description && seo.description.length > 0) {
    score += 10;
    if (seo.description.length >= 120 && seo.description.length <= 160)
      score += 10;
  }

  // Check keywords (max 20 points)
  if (seo.keywords && seo.keywords.length > 0) {
    score += 10;
    if (seo.keywords.length >= 5 && seo.keywords.length <= 15) score += 10;
  }

  // Check OG tags (max 20 points)
  if (seo.ogTitle && seo.ogDescription) score += 20;

  // Check author and canonical (max 20 points)
  if (seo.author) score += 10;
  if (seo.canonicalUrl) score += 10;

  return Math.min(score, 100);
};

/**
 * Get or generate stored AI SEO data for a page
 * @param pageId - Page identifier
 * @returns Stored AI-generated SEO data
 */
export const getAISEOData = async (
  pageId: string
): Promise<AIGeneratedSEO | undefined> => {
  return await getSEOFromCache(pageId);
};

/**
 * Update SEO data from AI regeneration
 * @param pageId - Page identifier
 * @param pageContent - Current page content
 * @param baseKeywords - Base keywords
 */
export const refreshAISEOData = async (
  pageId: string,
  pageContent: string,
  baseKeywords: string[]
): Promise<void> => {
  const metadata = await generateCompleteSEOMetadata(
    pageId,
    pageContent,
    baseKeywords
  );
  const aiSEO = await getSEOFromCache(pageId);
  if (aiSEO) {
    aiSEO.lastUpdated = new Date().toISOString();
    aiSEO.optimizationScore = calculateSEOScore(metadata);
    await updateSEOInCache(pageId, aiSEO);
  }
};
