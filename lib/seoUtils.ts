import { PageSEO, baseSEO, personSchema, SchemaMicrodata } from "../seoData";
import { siteConfig } from "./config";

/**
 * SEO Utilities and Helpers
 * Functions for managing metadata, structured data, and SEO-related operations
 */

/**
 * Generate structured data (JSON-LD) for Person schema
 * @returns Structured data object
 */
export const getPersonSchema = (): string => {
  return JSON.stringify(personSchema, null, 2);
};

/**
 * Generate Open Graph meta tags
 * @param seo - SEO data
 * @returns Object with OG attributes
 */
export const generateOGTags = (seo: PageSEO) => {
  return {
    title: seo.ogTitle || seo.title,
    description: seo.ogDescription || seo.description,
    image: seo.ogImage || siteConfig.images.ogImage,
    type: "website",
    url: seo.canonicalUrl || siteConfig.baseUrl,
  };
};

/**
 * Generate Twitter Card meta tags
 * @param seo - SEO data
 * @returns Object with Twitter Card attributes
 */
export const generateTwitterTags = (seo: PageSEO) => {
  return {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
    image: seo.ogImage || siteConfig.images.ogImage,
    creator: seo.twitterHandle || siteConfig.seo.twitterHandle,
  };
};

/**
 * Format keywords for meta tags
 * @param keywords - Array of keywords
 * @returns Comma-separated keyword string
 */
export const formatKeywords = (keywords: string[]): string => {
  return keywords.slice(0, 10).join(", ");
};

/**
 * Build canonical URL
 * @param path - Page path
 * @param baseUrl - Base URL
 * @returns Full canonical URL
 */
export const buildCanonicalUrl = (
  path: string = "/",
  baseUrl: string = siteConfig.baseUrl
): string => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

/**
 * Generate robots meta tag value
 * @param allowIndex - Allow indexing
 * @param allowFollow - Allow following links
 * @returns Robots meta content
 */
export const generateRobotsMeta = (
  allowIndex: boolean = true,
  allowFollow: boolean = true
): string => {
  const parts = [];
  parts.push(allowIndex ? "index" : "noindex");
  parts.push(allowFollow ? "follow" : "nofollow");
  return parts.join(", ");
};

/**
 * Generate hreflang tags for internationalization
 * @returns Object with language alternates
 */
export const generateHreflang = () => {
  return {
    "en-US": siteConfig.baseUrl,
    "sw-KE": `${siteConfig.baseUrl}/sw`,
  };
};

/**
 * Create breadcrumb schema data
 * @param items - Breadcrumb items [{ name, url }]
 * @returns Breadcrumb schema
 */
export const createBreadcrumbSchema = (
  items: Array<{ name: string; url: string }>
): SchemaMicrodata => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

/**
 * Create Article schema for blog posts
 * @param data - Article data
 * @returns Article schema
 */
export const createArticleSchema = (data: {
  headline: string;
  description: string;
  image?: string;
  author: string;
  datePublished: string;
  dateModified?: string;
}): SchemaMicrodata => {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data.headline,
    description: data.description,
    image: data.image || siteConfig.images.ogImage,
    author: {
      "@type": "Person",
      name: data.author,
      url: siteConfig.baseUrl,
    },
    datePublished: data.datePublished,
    dateModified: data.dateModified || data.datePublished,
  };
};

/**
 * Create Organization schema
 * @returns Organization schema
 */
export const createOrganizationSchema = (): SchemaMicrodata => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.seo.siteName,
    url: siteConfig.baseUrl,
    logo: siteConfig.images.logo,
    sameAs: [
      siteConfig.social.github,
      siteConfig.social.linkedin,
    ],
  };
};

/**
 * Validate SEO metadata
 * @param seo - SEO data to validate
 * @returns Validation result with warnings
 */
export const validateSEO = (
  seo: PageSEO
): { valid: boolean; warnings: string[] } => {
  const warnings: string[] = [];

  if (!seo.title || seo.title.length === 0) {
    warnings.push("Title is missing");
  } else if (seo.title.length < 30) {
    warnings.push("Title is too short (min 30 characters)");
  } else if (seo.title.length > 60) {
    warnings.push("Title is too long (max 60 characters)");
  }

  if (!seo.description || seo.description.length === 0) {
    warnings.push("Meta description is missing");
  } else if (seo.description.length < 120) {
    warnings.push("Meta description is too short (min 120 characters)");
  } else if (seo.description.length > 160) {
    warnings.push("Meta description is too long (max 160 characters)");
  }

  if (!seo.keywords || seo.keywords.length === 0) {
    warnings.push("Keywords are missing");
  } else if (seo.keywords.length < 3) {
    warnings.push("Too few keywords (min 3)");
  } else if (seo.keywords.length > 15) {
    warnings.push("Too many keywords (max 15)");
  }

  if (!seo.canonicalUrl) {
    warnings.push("Canonical URL is missing");
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
};

/**
 * Generate metadata exports for Next.js
 * @param seo - SEO data
 * @param url - Page URL
 * @returns Next.js compatible metadata object
 */
export const generateNextMetadata = (seo: PageSEO, url: string = "/") => {
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords.join(", "),
    authors: [{ name: seo.author || "Brian Makhembu" }],
    openGraph: {
      title: seo.ogTitle || seo.title,
      description: seo.ogDescription || seo.description,
      images: seo.ogImage ? [{ url: seo.ogImage }] : [],
      url: seo.canonicalUrl || buildCanonicalUrl(url),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      creator: seo.twitterHandle || "@brianuche",
    },
    canonical: seo.canonicalUrl || buildCanonicalUrl(url),
  };
};

/**
 * SEO score breakdown
 * @param score - SEO score (0-100)
 * @returns Quality rating
 */
export const getSEOScoreRating = (score: number): string => {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  if (score >= 30) return "Needs Improvement";
  return "Poor";
};
