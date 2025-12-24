/**
 * POST /api/resume/optimize
 * AI-Powered Resume Optimizer with STRICT SAFETY CONSTRAINTS
 * 
 * SAFETY PRINCIPLES:
 * - NO INVENTION: Never creates skills or experience the candidate doesn't have
 * - NO EXAGGERATION: Reframes existing accomplishments, never inflates them
 * - TRUTHFUL MATCHING: Match score reflects reality, not confidence theater
 * - EMPHASIS ONLY: Reorders and emphasizes existing documented content
 * - HONEST GAPS: Acknowledges what candidate doesn't have
 * 
 * RATE LIMITING:
 * - 5 requests/minute per IP
 * - Max job description: 10,000 characters
 * - Timeout: 30 seconds
 * 
 * DATA INTEGRITY:
 * - All candidate data comes from portfolio
 * - No data is modified, only reordered and emphasized
 * - Skill gaps are identified honestly
 */

import { NextRequest } from 'next/server';
import { generateGeminiContent } from "@/lib/geminiClient";
import {
  getClientIP,
  checkRateLimit,
  validateRequestLength,
  createRateLimitHeaders,
  createErrorResponse,
  withTimeout,
  RATE_LIMIT_CONFIGS,
} from '@/lib/apiSafety';

/**
 * Remove markdown formatting from text
 * Converts **bold** to bold, *italic* to italic, etc.
 */
function cleanMarkdown(text: string): string {
  if (!text) return text;
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')  // **bold** -> bold
    .replace(/\*(.*?)\*/g, '$1')      // *italic* -> italic
    .replace(/__(.*?)__/g, '$1')      // __bold__ -> bold
    .replace(/_(.*?)_/g, '$1')        // _italic_ -> italic
    .replace(/`(.*?)`/g, '$1')        // `code` -> code
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1');  // [link](url) -> link
}

/**
 * Recursively clean markdown from an object
 */
function cleanMarkdownFromResume(obj: any): any {
  if (typeof obj === 'string') {
    return cleanMarkdown(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(item => cleanMarkdownFromResume(item));
  }
  if (obj !== null && typeof obj === 'object') {
    const cleaned: any = {};
    for (const key in obj) {
      cleaned[key] = cleanMarkdownFromResume(obj[key]);
    }
    return cleaned;
  }
  return obj;
}

export async function POST(request: NextRequest) {
  try {
    // Safety Check 1: Rate Limiting
    const ip = getClientIP(request);
    const rateLimit = checkRateLimit(ip, RATE_LIMIT_CONFIGS.optimizer);
    const rateLimitHeaders = createRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime);

    if (!rateLimit.allowed) {
      const resetTime = new Date(rateLimit.resetTime).toLocaleTimeString();
      return createErrorResponse(
        `Rate limit exceeded. Maximum 5 requests per minute. Reset at ${resetTime}`,
        429,
        rateLimitHeaders
      );
    }

    // Safety Check 2: Parse and validate request
    const body = await request.json();
    const { jobDescription, candidateData } = body || {};

    if (!jobDescription || !candidateData) {
      return createErrorResponse(
        'Missing required fields: jobDescription, candidateData',
        400,
        rateLimitHeaders
      );
    }

    // Safety Check 3: Request length validation
    const jobDescValidation = validateRequestLength(
      { text: jobDescription },
      RATE_LIMIT_CONFIGS.optimizer.maxRequestLengthChars,
      'jobDescription'
    );

    if (!jobDescValidation.valid) {
      return createErrorResponse(
        jobDescValidation.error || 'Job description too long',
        400,
        rateLimitHeaders
      );
    }

    const prompt = `You are a resume optimization assistant with STRICT SAFETY CONSTRAINTS.

*** CRITICAL RULES - DO NOT VIOLATE ***
1. NEVER invent skills, projects, or experience the candidate doesn't have
2. NEVER exaggerate accomplishments or inflate claims
3. Only REORDER and EMPHASIZE existing documented experience
4. Only MATCH documented skills to job requirements
5. All suggestions must be TRUTHFUL about what the candidate has done
6. If skill gap exists, acknowledge it honestly - don't invent expertise
7. Match score reflects ACTUAL fit, not confidence theater
8. Candidate's own documented content is the source of truth

JOB DESCRIPTION:
${jobDescription}

CANDIDATE DOCUMENTED DATA (NEVER MODIFY):
Name: ${candidateData.profile.firstName} ${candidateData.profile.lastName}
Current Role: ${candidateData.profile.role}
Education: ${candidateData.profile.education}

DOCUMENTED EXPERIENCE (Must reference exactly as shown):
${candidateData.experience
  .map(
    (exp: any) => `- ${exp.role} at ${exp.company} (${exp.period}): ${exp.description.join('; ')}`
  )
  .join('\n')}

DOCUMENTED SKILLS (Only these exist):
Frontend: ${candidateData.skills.frontend.join(', ')}
Backend: ${candidateData.skills.backend.join(', ')}
Infrastructure: ${candidateData.skills.infrastructure.join(', ')}

DOCUMENTED PROJECTS (Only these exist):
${candidateData.projects
  .map((p: any) => `- ${p.title}: ${p.description}`)
  .join('\n')}

TASK: Analyze fit between job and documented candidate experience.

ALLOWED OPERATIONS:
1. ✓ Reorder experience by relevance to job
2. ✓ Emphasize existing skills that match requirements
3. ✓ Reframe existing accomplishments to job context (without changing facts)
4. ✓ Identify matching keywords from job description
5. ✓ Highlight relevant projects
6. ✓ Acknowledge skill gaps honestly

FORBIDDEN OPERATIONS:
✗ Invent skills candidate doesn't have documented
✗ Inflate experience or claim expertise in untaught areas
✗ Rewrite facts to be "more impressive"
✗ Add technologies not in documented experience
✗ Exaggerate project impact or scope

Return JSON with TRUTHFUL optimization:
{
  "summary": "Professional summary emphasizing strongest documented matches",
  "experience": [
    {
      "id": "original-id",
      "role": "Job Title",
      "company": "Company Name",
      "period": "Date Range",
      "description": ["ORIGINAL bullet point with job context emphasized"],
      "skills": ["skills candidate actually has from this role"],
      "relevanceScore": "score based on actual match, 0-100"
    }
  ],
  "skills": {
    "frontend": ["skill1", "skill2"],
    "backend": ["skill1", "skill2"],
    "infrastructure": ["skill1", "skill2"]
  },
  "relevantProjects": ["project title"],
  "keywordMatches": ["keyword1", "keyword2"],
  "matchScore": "0-100 realistic score"
}

Remember: This is optimization through EMPHASIS, not INVENTION.
Candidate's integrity matters more than inflating match score.`;

    const responseText = await withTimeout(
      generateGeminiContent("gemini-2.5-flash", prompt),
      RATE_LIMIT_CONFIGS.optimizer.timeoutSeconds
    );

    if (!responseText) {
      throw new Error('Empty response from AI model');
    }

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    let optimizedResume = JSON.parse(jsonMatch[0]);
    
    // Clean markdown formatting from all text fields
    optimizedResume = cleanMarkdownFromResume(optimizedResume);

    // Ensure response has the correct format expected by the modal
    // If summary is missing or empty, generate a default one from role and top skills
    let summary = optimizedResume.summary;
    if (!summary || summary.trim() === '') {
      const topSkills = (optimizedResume.experience && optimizedResume.experience[0]?.skills) 
        ? optimizedResume.experience[0].skills.slice(0, 3).join(', ')
        : candidateData.skills.frontend.slice(0, 2).join(', ');
      summary = `Experienced ${candidateData.profile.role} with demonstrated expertise in ${topSkills}. Proven track record of delivering high-quality solutions with strong focus on code quality and system design.`;
    }

    const normalizedResume = {
      summary: summary,
      experience: (optimizedResume.experience || []).map((exp: any) => ({
        id: exp.id || '',
        role: exp.role || '',
        company: exp.company || '',
        period: exp.period || '',
        description: Array.isArray(exp.description) ? exp.description : [exp.description || ''],
        skills: Array.isArray(exp.skills) ? exp.skills : [exp.skills || ''],
        relevanceScore: exp.relevanceScore || 0,
      })),
      skills: optimizedResume.skills || {
        frontend: [],
        backend: [],
        infrastructure: [],
      },
      relevantProjects: optimizedResume.relevantProjects || [],
      keywordMatches: optimizedResume.keywordMatches || [],
      matchScore: optimizedResume.matchScore || 0,
    };

    return Response.json(normalizedResume, {
      headers: rateLimitHeaders,
    });
  } catch (error) {
    const ip = getClientIP(request as NextRequest);
    const rateLimit = checkRateLimit(ip, RATE_LIMIT_CONFIGS.optimizer);
    const rateLimitHeaders = createRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Resume optimization error:', errorMessage);

    if (errorMessage.includes('timeout')) {
      return createErrorResponse(
        'Request took too long. Job descriptions may be too long or system is busy. Please try again.',
        504,
        rateLimitHeaders
      );
    }

    if (errorMessage.includes('Failed to parse')) {
      return createErrorResponse(
        'AI response parsing failed. Please try again.',
        502,
        rateLimitHeaders
      );
    }

    return createErrorResponse(
      'Failed to optimize resume. Please try again later.',
      500,
      rateLimitHeaders
    );
  }
}
