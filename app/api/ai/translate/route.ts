/**
 * POST /api/ai/translate
 * English to Swahili Translation Service
 * 
 * SAFETY FEATURES:
 * - Rate limited to 20 requests/minute per IP
 * - Max request length: 5000 characters
 * - Request timeout: 15 seconds
 * - Professional translator constraints
 * - No API key exposed to client
 */

import { NextRequest } from 'next/server';
import { translateText } from '@/services/geminiService';
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
    const rateLimit = checkRateLimit(ip, RATE_LIMIT_CONFIGS.translate);
    const rateLimitHeaders = createRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime);

    if (!rateLimit.allowed) {
      const resetTime = new Date(rateLimit.resetTime).toLocaleTimeString();
      return createErrorResponse(
        `Rate limit exceeded. Maximum 20 requests per minute. Reset at ${resetTime}`,
        429,
        rateLimitHeaders
      );
    }

    // SAFETY CHECK 2: Parse and validate request
    const body = await request.json();
    const { text } = body || {};

    if (!text) {
      return createErrorResponse(
        'Missing required field: text',
        400,
        rateLimitHeaders
      );
    }

    // SAFETY CHECK 3: Request length validation
    const validation = validateRequestLength(
      { text },
      RATE_LIMIT_CONFIGS.translate.maxRequestLengthChars,
      'text'
    );

    if (!validation.valid) {
      return createErrorResponse(
        validation.error || 'Text too long',
        400,
        rateLimitHeaders
      );
    }

    // SAFETY CHECK 4: Timeout enforcement
    const translatedText = await withTimeout(
      translateText(text),
      RATE_LIMIT_CONFIGS.translate.timeoutSeconds
    );

    return Response.json(
      {
        success: true,
        originalText: text,
        translatedText,
        sourceLanguage: 'en',
        targetLanguage: 'sw',
        translator: 'Brian Makhembu (Professional Translator)',
      },
      {
        headers: rateLimitHeaders,
      }
    );
  } catch (error) {
    const ip = getClientIP(request);
    const rateLimit = checkRateLimit(ip, RATE_LIMIT_CONFIGS.translate);
    const rateLimitHeaders = createRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Translation error:', errorMessage);

    if (errorMessage.includes('timeout')) {
      return createErrorResponse(
        'Translation took too long. Please try with shorter text.',
        504,
        rateLimitHeaders
      );
    }

    return createErrorResponse(
      'Failed to process translation. Please try again later.',
      500,
      rateLimitHeaders
    );
  }
}
