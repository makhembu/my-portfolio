# AI Safety & Rate Limiting Documentation

## Overview

This document explains the comprehensive safety measures, rate limiting, and ethical constraints implemented for all AI features in the portfolio system.

## Core Principles

### 1. **No Exaggeration or Invention**
- AI must never invent skills, projects, or experience Brian doesn't have
- All claims must be backed by documented portfolio content
- Skill gaps are acknowledged honestly

### 2. **Summarization Only**
- AI summarizes and clarifies existing content
- No speculative career advice
- No role recommendations
- No speculation about future capabilities

### 3. **Source of Truth**
- Portfolio data (`portfolioData.ts`) is authoritative
- GitHub repos are referenced for code examples when relevant
- On-page content takes precedence over AI interpretation

### 4. **No Confidence Theater**
- Match scores reflect actual fit, not inflated numbers
- AI avoids overconfident language ("definitely", "clearly")
- Limitations are explicitly stated

## Rate Limiting Configuration

All AI features use per-IP rate limiting to prevent abuse.

### Configuration File: `lib/apiSafety.ts`

```typescript
export const RATE_LIMIT_CONFIGS = {
  brianAI: {
    maxRequestsPerMinute: 10,        // Conversational usage
    maxRequestLengthChars: 5000,
    maxResponseLengthChars: 800,
    timeoutSeconds: 15,
  },
  optimizer: {
    maxRequestsPerMinute: 5,         // More intensive processing
    maxRequestLengthChars: 10000,
    timeoutSeconds: 30,
  },
  translate: {
    maxRequestsPerMinute: 20,        // Fast translation
    maxRequestLengthChars: 5000,
    timeoutSeconds: 15,
  },
};
```

### Rate Limit Features

#### 1. **Per-IP Tracking**
```typescript
const rateLimitStore = new Map<string, { requests: number; resetTime: number }>();

function getClientIP(request: NextRequest): string {
  // Extracts IP from:
  // - x-forwarded-for (proxied requests)
  // - cf-connecting-ip (CloudFlare)
  // - connection IP (direct requests)
}
```

#### 2. **Sliding Window Implementation**
- Tracks requests in the last 60 seconds
- Automatically resets window after 1 minute
- Returns remaining quota and reset time

#### 3. **Rate Limit Headers**
All responses include:
```
X-RateLimit-Remaining: [number]
X-RateLimit-Reset: [ISO timestamp]
```

#### 4. **Cleanup Mechanism**
```typescript
export function cleanupRateLimitStore() {
  // Remove entries older than 2 minutes
  // Call periodically to prevent memory bloat
}
```

## API Endpoints & Safety Measures

### 1. **Brian AI Assistant** (`POST /api/ai/chat`)

**Purpose**: Answer questions about Brian's documented experience

**Constraints**:
- Max request: 5,000 characters
- Max response: 800 characters (truncated if longer)
- Rate limit: 10 requests/minute
- Timeout: 15 seconds

**Safety Implementation**:

```typescript
// In services/geminiService.ts
const systemInstruction = `
  *** CRITICAL SAFETY CONSTRAINTS ***
  1. SUMMARIZATION ONLY: You summarize documented experience only.
  2. NO INVENTION: Never invent skills, projects, or experience.
  3. NO EXAGGERATION: Don't inflate accomplishments.
  4. SOURCE OF TRUTH: All claims must refer to portfolio content.
  5. CODE REFERENCES: Reference actual code from GitHub when relevant.
  6. NOT A DECISION-MAKER: You are a reference tool, not a career advisor.
  7. ADMIT LIMITS: Explicitly state when something is outside documented content.
  
  FORBIDDEN:
  - Skill inflation or invented accomplishments
  - Career recommendations or advice
  - Confidence-theater claims ("definitely", "clearly excellent")
  - Speculation about future capabilities
  - Claims not backed by documented content
`;
```

**Error Handling**:
- Graceful timeout messages
- No sensitive error details leaked
- User-friendly error messages

### 2. **Resume Optimizer** (`POST /api/resume/optimize`)

**Purpose**: Match resume to job descriptions through keyword analysis

**Constraints**:
- Max request: 10,000 characters
- Rate limit: 5 requests/minute
- Timeout: 30 seconds
- **NO SKILL INVENTION**: Only reorders and emphasizes existing content

**Safety Implementation**:

```typescript
const prompt = `
  *** CRITICAL RULES - DO NOT VIOLATE ***
  1. NEVER invent skills or experience the candidate doesn't have
  2. NEVER exaggerate accomplishments
  3. Only REORDER and EMPHASIZE existing documented experience
  4. Only MATCH documented skills to job requirements
  5. All suggestions must be TRUTHFUL
  6. If skill gap exists, acknowledge it honestly
  7. Match score reflects ACTUAL fit, not confidence theater
  
  ALLOWED OPERATIONS:
  ✓ Reorder experience by relevance
  ✓ Emphasize existing skills that match
  ✓ Reframe accomplishments to job context (without changing facts)
  ✓ Identify matching keywords
  ✓ Highlight relevant projects
  ✓ Acknowledge skill gaps honestly
  
  FORBIDDEN OPERATIONS:
  ✗ Invent skills candidate doesn't have
  ✗ Inflate experience or expertise claims
  ✗ Add technologies not in documented experience
  ✗ Exaggerate project impact
`;
```

**Match Score Accuracy**:
- Returns realistic scores (may be 30-40 if there's poor fit)
- Explains gaps honestly
- Avoids inflating to seem helpful

### 3. **Translation Service** (`POST /api/ai/translate`)

**Purpose**: Professional English-to-Swahili translation

**Constraints**:
- Max text: 5,000 characters
- Rate limit: 20 requests/minute (fast operation)
- Timeout: 15 seconds

**Safety Implementation**:
```typescript
const systemPrompt = `
  You are a professional English-Swahili translator.
  
  TRANSLATION CONSTRAINTS:
  1. Professional, context-aware tone for East African business
  2. Preserve technical terminology accurately
  3. Natural Swahili - not word-for-word
  4. Maintain document structure
  5. For technical terms without Swahili equivalents, use English in parentheses
`;
```

## Request Validation Pipeline

Every AI endpoint follows this safety pipeline:

```
1. RATE LIMIT CHECK
   ↓ (rejected if over limit)
   
2. REQUEST PARSING
   ↓ (validated JSON format)
   
3. FIELD VALIDATION
   ↓ (required fields present)
   
4. LENGTH VALIDATION
   ↓ (text within limits)
   
5. TIMEOUT ENFORCEMENT
   ↓ (promise race with timeout)
   
6. RESPONSE VALIDATION
   ↓ (check for empty/invalid responses)
   
7. ERROR HANDLING
   ↓ (sanitized error messages)
   
8. RESPONSE HEADERS
   ↓ (rate limit headers included)
```

## Error Messages

All error messages are **safe and non-leaky**:

### Good Error Messages (Safe)
✅ "Rate limit exceeded. Maximum 10 requests per minute. Reset at 3:45 PM"
✅ "Text too long. Maximum 5000 characters. Your text: 6523 characters."
✅ "Request took too long. Please try a simpler question."

### Bad Error Messages (Leaky)
❌ "Database connection failed"
❌ "API key not configured"
❌ Stack traces or internal errors

## Input Sanitization

### Length Validation
```typescript
function validateRequestLength(
  payload: { text?: string; jobDescription?: string },
  maxLengthChars: number,
  fieldName: string
): ValidationResult {
  if (text.length > maxLengthChars) {
    return {
      valid: false,
      error: `${fieldName} exceeds maximum length of ${maxLengthChars} characters`
    };
  }
  return { valid: true };
}
```

### Markdown Cleaning
```typescript
function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')     // **bold** -> bold
    .replace(/\*(.*?)\*/g, '$1')         // *italic* -> italic
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1'); // [link](url) -> link
}
```

## Monitoring & Debugging

### Development Tools

**Check rate limit status**:
```typescript
import { getRateLimitStatus, resetRateLimitForIP } from '@/lib/apiSafety';

// Get status for debugging
const status = getRateLimitStatus('192.168.1.1');

// Reset for testing
resetRateLimitForIP('192.168.1.1');
```

**Console logging**:
- All errors logged with context
- Rate limit violations tracked
- Request timeouts recorded

### Production Monitoring
- Track rate limit violations per IP
- Monitor timeout frequency
- Alert on unusual patterns

## GitHub Context Integration

The system references Brian's actual GitHub repositories when relevant:

```typescript
const GITHUB_REPOS = {
  portfolio: "https://github.com/makhembu/portfolio",
  // Add more repos as projects grow
};
```

**In AI responses**:
> "Looking at the portfolio code [github.com/makhembu/portfolio], Brian demonstrates X skill by doing..."

This avoids vague claims by pointing to real implementations.

## Content Validation

### Portfolio-Backed Claims

**Allowed**:
- "Brian has 7+ years in infrastructure (documented in portfolio)"
- "His experience with React is shown in the portfolio projects"
- "The portfolio demonstrates his UX strategy approach"

**Not Allowed**:
- "Brian is probably very good at..."
- "We can infer that Brian might have..."
- "Brian likely has experience with..."

### Skill Inventory

All documented skills in `portfolioData.ts`:

```typescript
skills: {
  it: {
    frontend: ["React", "Next.js", "TypeScript", ...],
    backend: ["Node.js", "PostgreSQL", ...],
    infrastructure: ["Linux", "Docker", ...],
  },
  translation: {
    technical: ["Technical translation", ...],
    languages: ["English", "Swahili"],
  }
}
```

**AI can only claim Brian has skills in this list.**

## Response Disclaimers

All AI features include explicit disclaimers:

### Brian AI Assistant
> "This is an AI summary of documented portfolio content. For career advice, contact Brian directly."

### Resume Optimizer
> "This score is based on keyword alignment heuristics. It's not a hiring decision or guarantee."

### Translation Service
> "Professional translation by Brian Makhembu. Verify technical terminology for accuracy."

## Rate Limiting in Production

### On Vercel

Rate limiting is in-memory (in-process) by default. For high-traffic production:

**Option 1: Scale with Vercel Edge Middleware**
```typescript
// middleware.ts - Rate limit at edge
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check rate limit before processing
  const ip = request.ip;
  // ... rate limit check
}
```

**Option 2: Use Redis (Recommended)**
```typescript
import { createClient } from 'redis';

const redis = createClient({
  url: process.env.REDIS_URL
});

async function checkRateLimitRedis(ip: string, key: string) {
  const count = await redis.incr(`${key}:${ip}`);
  await redis.expire(`${key}:${ip}`, 60);
  return count <= maxRequests;
}
```

**Option 3: Use Upstash (Serverless Redis)**
```typescript
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
});

const { success } = await ratelimit.limit(ip);
```

## Logging & Audit Trail

### What to Log

```typescript
// Log rate limit violations
console.log({
  timestamp: new Date().toISOString(),
  ip,
  endpoint: '/api/ai/chat',
  status: 'rate-limited',
  remaining: rateLimit.remaining,
  resetTime: rateLimit.resetTime,
});

// Log errors
console.error({
  timestamp: new Date().toISOString(),
  ip,
  endpoint: '/api/ai/chat',
  error: errorMessage,
  status: 500,
});
```

### What NOT to Log
❌ Full request payloads (privacy)
❌ API keys or secrets
❌ User personal information
❌ Verbose stack traces in production

## Testing Rate Limits

### Manual Testing

```bash
# Test rate limit (10 requests in quick succession)
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/ai/chat \
    -H "Content-Type: application/json" \
    -d '{"message":"What is Brian good at?"}' \
    -H "X-Forwarded-For: 192.168.1.100"
  sleep 0.1
done

# Should return 429 after 10 requests
```

### Automated Testing

```typescript
// test/rateLimit.test.ts
describe('Rate Limiting', () => {
  it('should limit requests to 10/minute', async () => {
    const ip = '192.168.1.100';
    
    // Make 10 requests
    for (let i = 0; i < 10; i++) {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: 'test' }),
        headers: { 'X-Forwarded-For': ip },
      });
      expect(res.status).toBe(200);
    }
    
    // 11th request should be rate limited
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'test' }),
      headers: { 'X-Forwarded-For': ip },
    });
    expect(res.status).toBe(429);
  });
});
```

## Summary: Safety Checklist

- ✅ Rate limiting per IP
- ✅ Request length validation
- ✅ Timeout enforcement
- ✅ No skill invention
- ✅ No exaggeration
- ✅ Source of truth (portfolio data)
- ✅ Code references (GitHub)
- ✅ Honest about limits
- ✅ No confidence theater
- ✅ Explicit disclaimers
- ✅ Safe error messages
- ✅ No credential leakage
- ✅ Documented response formats
- ✅ Audit logging

## Future Improvements

1. **Persistent Rate Limit Storage**
   - Move from in-memory to Redis/Upstash
   - Survive Vercel cold starts

2. **Advanced Monitoring**
   - Dashboard for rate limit violations
   - Alerts for abuse patterns
   - Per-endpoint analytics

3. **IP Reputation**
   - Track repeat offenders
   - Adjust limits for trusted IPs
   - Block known malicious IPs

4. **AI Output Validation**
   - Parse responses for forbidden claims
   - Automatically reject if exaggeration detected
   - Flag responses for human review

5. **A/B Testing**
   - Different rate limits for different user cohorts
   - Measure impact on user experience
   - Optimize limits based on data

---

**Last Updated**: December 2025
**Maintained by**: Brian Makhembu
