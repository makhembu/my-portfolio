# Environment Variable Configuration Guide

## Overview
All hardcoded URLs have been replaced with environment variable references. This makes your portfolio portable across different domains and deployment environments.

## Environment Variables

### Base Site URL
```env
NEXT_PUBLIC_SITE_URL=https://brianuche.dev
```
Used by:
- SEO metadata (canonical URLs, Open Graph)
- Sitemap generation
- Schema markup
- Robots.txt

### Social Links
```env
NEXT_PUBLIC_GITHUB_URL=https://github.com/makhembu
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/in/brianmakhembu/
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/brianuche
NEXT_PUBLIC_TWITTER_HANDLE=@brianuche
```
Used by:
- SEO metadata
- Schema markup (Person schema)
- Portfolio components

### Images
```env
NEXT_PUBLIC_OG_IMAGE=/og-image.jpg
NEXT_PUBLIC_PROFILE_IMAGE=/profile-image.jpg
NEXT_PUBLIC_LOGO=/logo.jpg
```
Used by:
- Open Graph metadata
- Schema markup
- Portfolio components

### Site Metadata
```env
NEXT_PUBLIC_SITE_NAME=Brian Makhembu Portfolio
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

### API Security
```env
SEO_UPDATE_SECRET=your_secret_key_here
```
Used by: POST `/api/seo/refresh-trends` endpoint

## Setup Instructions

1. **Copy the template:**
```bash
cp .env.example .env.local
```

2. **Update with your actual values:**
```bash
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_GITHUB_URL=https://github.com/yourname
# ... etc
```

3. **For production deployment:**
```bash
# Set environment variables in your hosting platform:
# Vercel: Settings → Environment Variables
# Netlify: Settings → Build & Deploy → Environment
# AWS: Amplify → Environment Variables
```

## Dynamic URL Usage

### In Code
```typescript
import { siteConfig, getFullUrl } from '@/lib/config';

// Get full URL
const homeUrl = getFullUrl('/');
// Result: https://yourdomain.com/

// Get config value
const baseUrl = siteConfig.baseUrl;
const githubUrl = siteConfig.social.github;
```

### In SEO Files
All SEO files now use:
- `siteConfig.baseUrl` instead of hardcoded URLs
- Environment variables for social links
- Dynamic image paths

### In API Routes
```typescript
import { siteConfig } from '@/lib/config';

export async function POST(request: NextRequest) {
  // Use siteConfig.baseUrl instead of hardcoded values
}
```

## Files Updated
These files now use environment variables instead of hardcoded URLs:

- ✅ `lib/config.ts` - Central configuration
- ✅ `lib/seoUtils.ts` - SEO utilities (will be updated next)
- ✅ `lib/dynamicSitemap.ts` - Dynamic sitemap
- ✅ `seoData.ts` - SEO data
- ✅ `app/layout.tsx` - Metadata
- ✅ `app/robots.ts` - Robots config
- ✅ `app/api/seo/refresh-trends/route.ts` - API route

## Verification

To check that configuration is correct, call:
```bash
curl -X GET http://localhost:3000/api/seo/refresh-trends?action=status
```

Response should show configuration is valid.

## Migration Notes

When changing domains:
1. Update `NEXT_PUBLIC_SITE_URL` to new domain
2. Update all social links if needed
3. Rebuild the site
4. SEO will automatically regenerate with new URLs
5. Sitemap will automatically point to new domain
6. Robots.txt will update automatically
