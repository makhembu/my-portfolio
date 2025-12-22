/**
 * API Safety Utilities
 * Centralized rate limiting, validation, and error handling for all AI endpoints
 * 
 * DESIGN PRINCIPLES:
 * - Rate limit per IP to prevent abuse
 * - Validate request sizes to prevent spam
 * - Enforce timeouts to prevent hanging
 * - Return clear, non-leaky error messages
 */

import { NextRequest } from 'next/server';

// In-memory store for rate limiting (per IP)
// In production, use Redis or similar
const rateLimitStore = new Map<string, { requests: number; resetTime: number }>();

/**
 * Rate limit configuration for each AI feature
 * Balances usability (reasonable limits) with protection (prevents abuse)
 */
export const RATE_LIMIT_CONFIGS = {
  brianAI: {
    maxRequestsPerMinute: 10,        // Conversational, so more generous
    maxRequestLengthChars: 5000,     // Prevent massive inputs
    maxResponseLengthChars: 800,     // Keep responses concise
    timeoutSeconds: 15,
  },
  optimizer: {
    maxRequestsPerMinute: 5,         // Resume optimization is more intensive
    maxRequestLengthChars: 10000,    // Job descriptions can be longer
    timeoutSeconds: 30,
  },
  translate: {
    maxRequestsPerMinute: 20,        // Translation is fast
    maxRequestLengthChars: 5000,     // Reasonable text length
    timeoutSeconds: 15,
  },
};

/**
 * Extract client IP address from request
 * Handles X-Forwarded-For header for proxied requests
 */
export function getClientIP(request: NextRequest | Request): string {
  // Check various headers for IP (Vercel, CloudFlare, etc.)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can be comma-separated list, take the first
    return forwardedFor.split(',')[0].trim();
  }

  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) return cfConnectingIP;

  // Fallback to connection IP if available
  if ('ip' in request && typeof (request as any).ip === 'string') {
    return (request as any).ip;
  }

  // Last resort: use a generic identifier
  return 'unknown';
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Check if request should be allowed based on rate limit
 * Uses sliding window: tracks requests in the last minute
 */
export function checkRateLimit(
  ip: string,
  config: (typeof RATE_LIMIT_CONFIGS)[keyof typeof RATE_LIMIT_CONFIGS]
): RateLimitResult {
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = config.maxRequestsPerMinute;

  let ipData = rateLimitStore.get(ip);

  // Initialize or reset if window has passed
  if (!ipData || now > ipData.resetTime) {
    ipData = {
      requests: 0,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(ip, ipData);
  }

  // Increment request count
  ipData.requests += 1;

  const allowed = ipData.requests <= maxRequests;
  const remaining = Math.max(0, maxRequests - ipData.requests);

  return {
    allowed,
    remaining,
    resetTime: ipData.resetTime,
  };
}

interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate request payload length
 * Prevents abuse through massive payloads
 */
export function validateRequestLength(
  payload: { text?: string; jobDescription?: string; [key: string]: any },
  maxLengthChars: number,
  fieldName: string = 'request'
): ValidationResult {
  const text = payload.text || payload.jobDescription || '';

  if (!text) {
    return { valid: false, error: `${fieldName} is required` };
  }

  if (text.length > maxLengthChars) {
    return {
      valid: false,
      error: `${fieldName} exceeds maximum length of ${maxLengthChars} characters. Current: ${text.length}`,
    };
  }

  return { valid: true };
}

/**
 * Create rate limit HTTP headers for response
 * Helps clients understand their quota
 */
export function createRateLimitHeaders(remaining: number, resetTime: number) {
  return {
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': new Date(resetTime).toISOString(),
  };
}

/**
 * Create standardized error response
 * Prevents info leakage while being helpful
 */
export function createErrorResponse(
  message: string,
  status: number,
  headers?: Record<string, string>
) {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...(headers || {}),
      },
    }
  );
}

/**
 * Wrap promise with timeout
 * Prevents hanging requests
 */
export function withTimeout<T>(promise: Promise<T>, seconds: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Request timeout after ${seconds} seconds`)),
        seconds * 1000
      )
    ),
  ]);
}

/**
 * Clean up old rate limit entries
 * Call periodically to prevent memory bloat (e.g., in a cron job)
 */
export function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [ip, data] of rateLimitStore.entries()) {
    if (now > data.resetTime + 60000) {
      // Remove entries older than 2 minutes
      rateLimitStore.delete(ip);
    }
  }
}

/**
 * Reset rate limit for a specific IP (for testing/admin)
 */
export function resetRateLimitForIP(ip: string) {
  rateLimitStore.delete(ip);
}

/**
 * Get current rate limit status for an IP (for debugging)
 */
export function getRateLimitStatus(ip: string) {
  return rateLimitStore.get(ip) || null;
}
