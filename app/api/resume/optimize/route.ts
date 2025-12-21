import { GoogleGenAI } from "@google/genai";

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jobDescription, candidateData } = body || {};

    if (!jobDescription || !candidateData) {
      return Response.json(
        { error: 'Missing required fields: jobDescription, candidateData' },
        { status: 400 }
      );
    }

    const prompt = `You are an expert recruiter and resume optimizer. Analyze this job description and tailor the candidate's resume to match the job requirements perfectly.

JOB DESCRIPTION:
${jobDescription}

CANDIDATE DATA:
Name: ${candidateData.profile.firstName} ${candidateData.profile.lastName}
Current Role: ${candidateData.profile.role}
Years of Experience: ${candidateData.profile.yearsExperience}
Location: ${candidateData.profile.location}
Education: ${candidateData.profile.education}

Experience:
${candidateData.experience
  .map(
    (exp: any) => `
- Role: ${exp.role} at ${exp.company} (${exp.period})
  ${exp.description.map((d: string) => `• ${d}`).join('\n  ')}
  Skills: ${exp.skills.join(', ')}
`
  )
  .join('\n')}

Skills:
- Frontend: ${candidateData.skills.frontend.join(', ')}
- Backend: ${candidateData.skills.backend.join(', ')}
- Infrastructure: ${candidateData.skills.infrastructure.join(', ')}

Projects:
${candidateData.projects
  .map((p: any) => `- ${p.title}: ${p.description}`)
  .join('\n')}

TASK: Optimize the resume to match this job description. Focus on:
1. Reorder experience entries by relevance to the job
2. Highlight skills that match the job requirements
3. Rewrite experience bullet points to emphasize relevant achievements
4. Identify top 5 matching keywords from the job description
5. Calculate a match score (0-100) based on how well the candidate fits

Return a JSON object with:
{
  "summary": "Optimized professional summary tailored to job requirements",
  "experience": [
    {
      "id": "original-id",
      "role": "Job Title",
      "company": "Company Name",
      "period": "Date Range",
      "description": ["bullet 1 (optimized for job)", "bullet 2"],
      "skills": ["relevant", "skills"],
      "relevanceScore": 95
    }
  ],
  "skills": {
    "frontend": ["relevant frontend skills only"],
    "backend": ["relevant backend skills only"],
    "infrastructure": ["relevant infra skills only"]
  },
  "relevantProjects": ["project 1 title", "project 2 title"],
  "keywordMatches": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "matchScore": 85
}

Be strategic - highlight the candidate's strongest matches and deemphasize less relevant experience.`;

    const genAI = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '' });
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // Handle the response text based on genai library structure
    let responseText = '';
    
    if (typeof result.text === 'string') {
      responseText = result.text;
    } else if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
      responseText = result.candidates[0].content.parts[0].text;
    }

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

    return Response.json(optimizedResume);
  } catch (error) {
    console.error('Resume optimization error:', error);
    return Response.json(
      { error: 'Failed to optimize resume. Please try again.' },
      { status: 500 }
    );
  }
}
