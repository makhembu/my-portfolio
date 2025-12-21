import { getAi } from "@/lib/geminiClient";
import { compileTrendReport, extractKeywordsFromTrends, TrendReport } from "./trendResearchService";
import { PageSEO } from "@/seoData";
import { updateSEOInCache } from "@/lib/seoStorage";

/**
 * Trend-Aware SEO Optimization Service
 * Uses real-time market research to optimize SEO for recruiter visibility
 * First researches trends, then creates optimized SEO content
 */

export interface TrendOptimizedSEO extends PageSEO {
  basedOnTrends: string[];
  recruiterKeywords: string[];
  optimizationDate: string;
  trendInfluence: string;
}

/**
 * Generate SEO title optimized for recruiter search based on trends
 * @param trends - Current trend report
 * @param baseTitle - Base title to enhance
 * @returns Recruiter-optimized title
 */
export const generateTrendOptimizedTitle = async (
  trends: TrendReport,
  baseTitle: string
): Promise<string> => {
  try {
    const ai = getAi();
    const trendingSkills = trends.topSkills
      .slice(0, 3)
      .map((s) => s.skill)
      .join(", ");

    const prompt = `Create an SEO title (max 60 chars) that will appeal to recruiters searching for ${trendingSkills} today. 

Base title: "${baseTitle}"
Current hot skills: ${trendingSkills}
Recruiter focus areas: ${trends.recruiterFocus.map((r) => r.title).join(", ")}

Make it:
- Include hot trending skills
- Appeal to recruiter searches
- Action-oriented
- Include location context if relevant

Return ONLY the new title, no explanation.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    if (!response.text) throw new Error("Empty response");
    const title = response.text.trim();
    return title.length > 60 ? title.substring(0, 57) + "..." : title;
  } catch (error) {
    console.error("Trend-optimized title generation error:", error);
    return baseTitle;
  }
};

/**
 * Generate meta description optimized for recruiter searches
 * @param trends - Current trend report
 * @param baseDescription - Base description
 * @returns Recruiter-optimized description
 */
export const generateTrendOptimizedDescription = async (
  trends: TrendReport,
  baseDescription: string
): Promise<string> => {
  try {
    const ai = getAi();
    const topSkills = trends.topSkills.slice(0, 5);
    const skillsList = topSkills.map((s) => s.skill).join(", ");

    const prompt = `Create a meta description (120-160 chars) optimized for recruiter searches today.

Based on:
- Trending skills: ${skillsList}
- Recruiter priorities: ${trends.recruiterFocus.map((r) => r.title).join(", ")}
- Current market: Full-stack engineer/software engineer

Base: "${baseDescription}"

Make it:
- Highlight trending skills
- Appeal to recruiter needs
- Show broad capability
- Include call to action

Return ONLY the description, no markdown.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    if (!response.text) throw new Error("Empty response");
    const desc = response.text.trim();
    return desc.length > 160 ? desc.substring(0, 157) + "..." : desc;
  } catch (error) {
    console.error("Trend-optimized description error:", error);
    return baseDescription;
  }
};

/**
 * Generate recruiter-focused keywords based on current trends
 * @param trends - Current trend report
 * @returns Array of recruiter-optimized keywords
 */
export const generateRecruiterKeywords = async (
  trends: TrendReport
): Promise<string[]> => {
  try {
    const ai = getAi();

    const trendKeywords = extractKeywordsFromTrends(trends);
    const trendStr = trendKeywords.slice(0, 10).join(", ");

    const prompt = `Generate 15-20 SEO keywords that recruiters are ACTIVELY SEARCHING FOR TODAY to find engineers like Brian.

Current trends:
- Hot skills: ${trends.topSkills.slice(0, 3).map((s) => s.skill).join(", ")}
- Recruiter focus: ${trends.recruiterFocus.slice(0, 3).map((r) => r.title).join(", ")}
- Emerging tech: ${trends.emergingTechs.slice(0, 3).join(", ")}
- Base keywords: ${trendStr}

Include:
- Exact skill matches (React, Next.js, Node.js, etc)
- Job titles (Full-Stack Engineer, Software Engineer, etc)
- Combinations that matter (e.g., "React Next.js engineer")
- Location if relevant (Full-stack engineer in Kenya)
- Long-tail keywords (phrases recruiters use)

Format as JSON array:
["keyword1", "keyword2"]

Return ONLY the JSON array.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    if (!response.text) throw new Error("Empty response");
    const keywords = JSON.parse(response.text.trim());
    return keywords;
  } catch (error) {
    console.error("Recruiter keywords generation error:", error);
    return extractKeywordsFromTrends(trends);
  }
};

/**
 * Create complete trend-optimized SEO metadata
 * @param pageId - Page identifier
 * @param basePageSEO - Base SEO data
 * @param trends - Current trend report
 * @returns Trend-optimized SEO
 */
export const createTrendOptimizedSEO = async (
  pageId: string,
  basePageSEO: PageSEO,
  trends: TrendReport
): Promise<TrendOptimizedSEO> => {
  console.log(`📊 Optimizing SEO for ${pageId} based on current trends...`);

  const [optimizedTitle, optimizedDescription, recruiterKeywords] =
    await Promise.all([
      generateTrendOptimizedTitle(trends, basePageSEO.title),
      generateTrendOptimizedDescription(trends, basePageSEO.description),
      generateRecruiterKeywords(trends),
    ]);

  const allKeywords = [
    ...basePageSEO.keywords,
    ...recruiterKeywords,
  ];

  const trendOptimized: TrendOptimizedSEO = {
    ...basePageSEO,
    title: optimizedTitle,
    description: optimizedDescription,
    keywords: Array.from(new Set(allKeywords)),
    recruiterKeywords,
    basedOnTrends: trends.topSkills.slice(0, 5).map((s) => s.skill),
    optimizationDate: trends.date,
    trendInfluence: `Optimized based on ${trends.topSkills.length} trending skills and ${trends.recruiterFocus.length} recruiter focus areas`,
  };

  // Save to cache
  await updateSEOInCache(pageId, {
    pageId,
    generatedTitle: trendOptimized.title,
    generatedDescription: trendOptimized.description,
    generatedKeywords: trendOptimized.keywords,
    generatedMetaDescription: trendOptimized.description,
    lastUpdated: new Date().toISOString(),
    aiModel: "gemini-2.5-flash",
  });

  console.log(`✅ SEO optimized for ${pageId}`);
  return trendOptimized;
};

/**
 * Generate recruiter-attracting content suggestions based on trends
 * @param trends - Current trend report
 * @returns Suggestions for portfolio/content updates
 */
export const generateRecruiterContentSuggestions = async (
  trends: TrendReport
): Promise<string[]> => {
  try {
    const ai = getAi();

    const prompt = `Based on current recruiter priorities and job market trends, suggest 5 SPECIFIC portfolio or content updates that Brian should make to attract more recruiter attention.

Trends:
- Hot skills: ${trends.topSkills.slice(0, 5).map((s) => s.skill).join(", ")}
- Recruiter focus: ${trends.recruiterFocus.map((r) => r.title).join(", ")}
- Emerging tech: ${trends.emergingTechs.join(", ")}

Make suggestions:
- Specific and actionable
- Based on recruiter search patterns
- Something he can implement quickly
- Portfolio/project focused

Format as JSON array:
["suggestion1", "suggestion2"]

Return ONLY the JSON array.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    if (!response.text) throw new Error("Empty response");
    const suggestions = JSON.parse(response.text.trim());
    return suggestions;
  } catch (error) {
    console.error("Content suggestions error:", error);
    return [];
  }
};

/**
 * Run full trend research and SEO optimization pipeline
 * @param pageSEOMap - Map of page IDs to base SEO data
 * @returns Updated SEO data for all pages
 */
export const runTrendOptimizationPipeline = async (
  pageSEOMap: Record<string, PageSEO>
): Promise<Record<string, TrendOptimizedSEO>> => {
  console.log("🚀 Starting Trend-Based SEO Optimization Pipeline...");
  console.log("Step 1: Researching current market trends...");

  // Step 1: Research trends
  const trends = await compileTrendReport();

  console.log("Step 2: Optimizing SEO for all pages...");

  // Step 2: Optimize all pages
  const optimizedPages: Record<string, TrendOptimizedSEO> = {};

  for (const [pageId, baseSEO] of Object.entries(pageSEOMap)) {
    const optimized = await createTrendOptimizedSEO(pageId, baseSEO, trends);
    optimizedPages[pageId] = optimized;
  }

  console.log("Step 3: Generating recruiter content suggestions...");

  // Step 3: Get content suggestions
  const suggestions = await generateRecruiterContentSuggestions(trends);

  console.log("\n📈 Trend-Based SEO Optimization Complete!");
  console.log(`\nTrend Report Summary:`);
  console.log(`- Top trending skills: ${trends.topSkills.slice(0, 3).map((s) => s.skill).join(", ")}`);
  console.log(`- Recruiter focus areas: ${trends.recruiterFocus.slice(0, 3).map((r) => r.title).join(", ")}`);
  console.log(`- Emerging technologies: ${trends.emergingTechs.slice(0, 3).join(", ")}`);
  console.log(`\nPortfolio Update Suggestions:`);
  suggestions.forEach((s, i) => console.log(`${i + 1}. ${s}`));

  return optimizedPages;
};
