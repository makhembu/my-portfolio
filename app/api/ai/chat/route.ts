/**
 * POST /api/ai/chat
 * Brian's AI Assistant - Answer questions about Brian's experience
 * 
 * SAFETY FEATURES:
 * - Rate limited to 10 requests/minute per IP
 * - Max request length: 5000 characters
 * - Max response length: 800 characters (enforced)
 * - Request timeout: 15 seconds
 * - No API key exposed to client
 */

import { NextRequest } from 'next/server';
import { chatWithBrianAI } from '@/services/geminiService';
import {
  getClientIP,
  checkRateLimit,
  validateRequestLength,
  createRateLimitHeaders,
  createErrorResponse,
  withTimeout,
  RATE_LIMIT_CONFIGS,
} from '@/lib/apiSafety';

export async function POST(request: NextRequest) {
  try {
    // SAFETY CHECK 1: Rate Limiting
    const ip = getClientIP(request);
    const rateLimit = checkRateLimit(ip, RATE_LIMIT_CONFIGS.brianAI);
    const rateLimitHeaders = createRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime);

    if (!rateLimit.allowed) {
      const resetTime = new Date(rateLimit.resetTime).toLocaleTimeString();
      return createErrorResponse(
        `Rate limit exceeded. Maximum 10 requests per minute. Reset at ${resetTime}`,
        429,
        rateLimitHeaders
      );
    }

    // SAFETY CHECK 2: Parse and validate request
    const body = await request.json();
    const { message } = body || {};

    if (!message) {
      return createErrorResponse(
        'Missing required field: message',
        400,
        rateLimitHeaders
      );
    }

    // SAFETY CHECK 3: Request length validation
    const validation = validateRequestLength(
      { text: message },
      RATE_LIMIT_CONFIGS.brianAI.maxRequestLengthChars,
      'message'
    );

    if (!validation.valid) {
      return createErrorResponse(
        validation.error || 'Message too long',
        400,
        rateLimitHeaders
      );
    }

    // SAFETY CHECK 4: Timeout enforcement
    const response = await withTimeout(
      chatWithBrianAI(message),
      RATE_LIMIT_CONFIGS.brianAI.timeoutSeconds
    );

    return Response.json(
      {
        success: true,
        response,
        disclaimer: 'This is an AI summary of documented portfolio content. For career advice, contact Brian directly.',
      },
      {
        headers: rateLimitHeaders,
      }
    );
  } catch (error) {
    const ip = getClientIP(request);
    const rateLimit = checkRateLimit(ip, RATE_LIMIT_CONFIGS.brianAI);
    const rateLimitHeaders = createRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('AI chat error:', errorMessage);

    if (errorMessage.includes('timeout')) {
      return createErrorResponse(
        'Request took too long. Please try a simpler question.',
        504,
        rateLimitHeaders
      );
    }

    return createErrorResponse(
      'Failed to process request. Please try again later.',
      500,
      rateLimitHeaders
    );
  }
}
