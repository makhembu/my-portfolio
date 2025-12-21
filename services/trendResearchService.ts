import { getAi } from "@/lib/geminiClient";

/**
 * AI-Powered Trend Research Service
 * Researches current job market trends, recruiter interests, and emerging technologies
 * Uses this data to optimize SEO for maximum recruiter visibility
 */

export interface JobTrend {
  skill: string;
  trendScore: number; // 0-100, how hot this skill is
  searchVolume: string; // high, medium, low
  hiringSeason: string; // peak, moderate, slow
  description: string;
}

export interface RecruiterTrend {
  title: string;
  trend: string;
  keywords: string[];
  urgency: "high" | "medium" | "low";
  description: string;
}

export interface TrendReport {
  date: string;
  timestamp: string;
  topSkills: JobTrend[];
  recruiterFocus: RecruiterTrend[];
  emergingTechs: string[];
  marketInsights: string[];
  recruitmentTips: string[];
}

/**
 * Research trending job titles and skills recruiters are searching for TODAY
 * @returns Top trending jobs and skills
 */
export const researchTrendingJobs = async (): Promise<JobTrend[]> => {
  try {
    const ai = getAi();
    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const prompt = `You are a recruitment market analyst. Research and list the TOP 10 most in-demand technical skills and job titles that recruiters are actively searching for TODAY (${today}). 

For each skill, provide:
1. Skill name
2. Trend score (0-100, where 100 is extremely hot)
3. Search volume (high/medium/low)
4. Hiring season (peak/moderate/slow)
5. Why this skill is trending NOW

Format as JSON array with this structure:
[
  {
    "skill": "skill name",
    "trendScore": 85,
    "searchVolume": "high",
    "hiringSeason": "peak",
    "description": "why it's trending"
  }
]

Focus on:
- Full-stack development frameworks (React, Next.js, Node.js, etc)
- Infrastructure and DevOps trends
- AI/ML integration skills
- UX/Design trends
- Mobile development
- Cloud technologies

Return ONLY the JSON array, no markdown or explanation.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.8,
      },
    });

    if (!response.text) {
      throw new Error("Empty response from AI");
    }

    const trends = JSON.parse(response.text.trim());
    return trends;
  } catch (error) {
    console.error("Trend research error:", error);
    return [];
  }
};

/**
 * Research what recruiters specifically care about and are looking for
 * @returns Recruiter focus areas
 */
export const researchRecruiterFocus = async (): Promise<RecruiterTrend[]> => {
  try {
    const ai = getAi();

    const prompt = `You are a recruitment strategist. Analyze what RECRUITERS and HIRING MANAGERS are currently prioritizing in 2024. 

Based on current market conditions, list the TOP 8 areas recruiter are most focused on:

1. What skills matter most to them
2. What certifications/backgrounds they value
3. What soft skills they're emphasizing
4. What project types are most attractive
5. What portfolio items grab attention
6. What languages/frameworks are hot
7. What experience levels are being hired
8. What emerging trends are game-changers

For each, provide:
- Title of the trend
- What it means
- Keywords related to it
- Urgency level (high/medium/low)
- Detailed explanation

Format as JSON:
[
  {
    "title": "trend title",
    "trend": "brief explanation",
    "keywords": ["keyword1", "keyword2"],
    "urgency": "high",
    "description": "detailed analysis"
  }
]

Return ONLY the JSON array, no markdown.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.8,
      },
    });

    if (!response.text) {
      throw new Error("Empty response from AI");
    }

    const trends = JSON.parse(response.text.trim());
    return trends;
  } catch (error) {
    console.error("Recruiter focus research error:", error);
    return [];
  }
};

/**
 * Research emerging technologies that will matter in next 6 months
 * @returns List of emerging tech areas
 */
export const researchEmergingTechs = async (): Promise<string[]> => {
  try {
    const ai = getAi();

    const prompt = `List the TOP 10 emerging technologies and trends that will be important for software engineers in the next 6 months. 

Think about:
- New frameworks and libraries gaining adoption
- AI integration trends (Copilot, LLMs, agents)
- Web development innovations
- Infrastructure improvements
- Developer tools evolution
- Architectural patterns gaining popularity
- Performance optimization techniques

Provide brief, specific tech names and trends. Format as JSON array of strings:
["tech1", "tech2", "tech3"]

Return ONLY the JSON array.`;

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

    const techs = JSON.parse(response.text.trim());
    return techs;
  } catch (error) {
    console.error("Emerging tech research error:", error);
    return [];
  }
};

/**
 * Get market insights for positioning
 * @returns Strategic insights for portfolio positioning
 */
export const getMarketInsights = async (): Promise<string[]> => {
  try {
    const ai = getAi();

    const prompt = `As a tech career strategist, provide 5 actionable insights for a full-stack engineer to position themselves for maximum recruiter visibility in the current market. 

Consider:
- What projects to highlight
- What skills combinations are valuable
- What certifications matter
- How to stand out from competition
- What types of companies are hiring most

Format as JSON array of insight strings:
["insight1", "insight2", "insight3"]

Return ONLY the JSON array.`;

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

    const insights = JSON.parse(response.text.trim());
    return insights;
  } catch (error) {
    console.error("Market insights research error:", error);
    return [];
  }
};

/**
 * Get recruitment tips based on current market
 * @returns Practical tips for attracting recruiters
 */
export const getRecruitmentTips = async (): Promise<string[]> => {
  try {
    const ai = getAi();

    const prompt = `Provide 5 specific, actionable tips for a software engineer to attract MORE recruiter attention RIGHT NOW based on current market conditions.

Make them tactical and specific (not generic). Consider:
- What to include in portfolio
- How to position experience
- What keywords matter
- How to stand out
- What types of projects appeal to recruiters most

Format as JSON array:
["tip1", "tip2", "tip3"]

Return ONLY the JSON array.`;

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

    const tips = JSON.parse(response.text.trim());
    return tips;
  } catch (error) {
    console.error("Recruitment tips research error:", error);
    return [];
  }
};

/**
 * Run complete trend research and compile full report
 * @returns Comprehensive trend report for the day
 */
export const compileTrendReport = async (): Promise<TrendReport> => {
  console.log("🔍 Researching market trends for SEO optimization...");

  const [topSkills, recruiterFocus, emergingTechs, marketInsights, recruitmentTips] =
    await Promise.all([
      researchTrendingJobs(),
      researchRecruiterFocus(),
      researchEmergingTechs(),
      getMarketInsights(),
      getRecruitmentTips(),
    ]);

  const now = new Date();
  const report: TrendReport = {
    date: now.toLocaleDateString(),
    timestamp: now.toISOString(),
    topSkills,
    recruiterFocus,
    emergingTechs,
    marketInsights,
    recruitmentTips,
  };

  console.log("✅ Trend research complete");
  return report;
};

/**
 * Extract all relevant keywords from trend report for SEO
 * @param report - Trend report
 * @returns Array of SEO-optimized keywords
 */
export const extractKeywordsFromTrends = (report: TrendReport): string[] => {
  const keywords = new Set<string>();

  // From top skills
  report.topSkills.forEach((skill) => {
    keywords.add(skill.skill);
  });

  // From recruiter focus
  report.recruiterFocus.forEach((trend) => {
    trend.keywords.forEach((kw) => keywords.add(kw));
  });

  // From emerging techs
  report.emergingTechs.forEach((tech) => {
    keywords.add(tech);
  });

  return Array.from(keywords);
};
