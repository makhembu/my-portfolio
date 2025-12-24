/**
 * Site Configuration
 * All URLs and site-specific values pulled from environment variables
 * This makes the site portable and environment-aware
 */

export const siteConfig = {
  // Base site URL (from environment or fallback)
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://brianmakhembu-portfolio.vercel.app',
  
  // Social links (from environment or fallback)
  social: {
    github: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/makhembu',
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com/in/brianmakhembu/',
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || 'https://twitter.com/brianuche',
  },
  
  // Image URLs
  images: {
    ogImage: process.env.NEXT_PUBLIC_OG_IMAGE || '/og-image.jpg',
    profileImage: process.env.NEXT_PUBLIC_PROFILE_IMAGE || '/profile-image.jpg',
    logo: process.env.NEXT_PUBLIC_LOGO || '/logo.jpg',
  },

  // SEO settings
  seo: {
    twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@brianuche',
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Brian Makhembu Portfolio',
  },

  // Build-time settings
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
};

/**
 * Get full URL for a path
 * @param path - Path (with or without leading slash)
 * @returns Full absolute URL
 */
export const getFullUrl = (path: string = '/'): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.baseUrl}${cleanPath}`;
};

/**
 * Get full image URL
 * @param imagePath - Image path or already full URL
 * @returns Full absolute image URL
 */
export const getImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  return getFullUrl(imagePath);
};

/**
 * Validate required environment variables
 * Call this in development to catch missing config early
 */
export const validateConfig = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    console.warn('⚠️  NEXT_PUBLIC_SITE_URL not set, using default: https://brianmakhembu-portfolio.vercel.app');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
