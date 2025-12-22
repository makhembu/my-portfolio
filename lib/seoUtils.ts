/**
 * SEO UTILITIES (REFACTORED)
 * ==========================
 * Simplified utilities for static metadata management
 * REMOVED: AI generation, SEO scoring, trend optimization
 * KEPT: Metadata helpers, validation warnings, schema generation
 * 
 * Philosophy: Deterministic, human-maintained metadata
 * Updated: 2025-12-22
 */

import { PageSEO, baseSEO, personSchema, SchemaMicrodata } from "../seoDataRefactored";
import { siteConfig } from "./config";

/**
 * Export Person schema as JSON string
 * Used in app/layout.tsx for JSON-LD metadata
 */
export const getPersonSchema = (): string => {
  return JSON.stringify(personSchema, null, 2);
};

/**
 * Generate Open Graph meta tags object
 * Used for social media sharing (Facebook, LinkedIn, etc.)
 */
export const generateOGTags = (seo: PageSEO) => ({
  title: seo.ogTitle || seo.title,
  description: seo.ogDescription || seo.description,
  image: seo.ogImage || siteConfig.images.ogImage,
  type: "website",
  url: seo.canonicalUrl || siteConfig.baseUrl,
});

/**
 * Generate Twitter Card meta tags
 * Used for Twitter/X sharing
 */
export const generateTwitterTags = (seo: PageSEO) => ({
  card: "summary_large_image",
  title: seo.title,
  description: seo.description,
  image: seo.ogImage || siteConfig.images.ogImage,
  creator: "@brianuche",
});

/**
 * Format keywords for meta tags (max 10)
 * Google ignores keywords meta tag, but useful for documentation
 */
export const formatKeywords = (keywords: string[]): string => {
  return keywords.slice(0, 10).join(", ");
};

/**
 * Build canonical URL for a page
 * Prevents duplicate content issues
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
 * Controls search engine crawling and indexing behavior
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
 * Tells Google about language/region alternatives
 */
export const generateHreflang = () => ({
  "en-US": siteConfig.baseUrl,
  "sw-KE": `${siteConfig.baseUrl}/sw`,
});

/**
 * Create breadcrumb schema (JSON-LD)
 * Improves navigation in search results
 */
export const createBreadcrumbSchema = (
  items: Array<{ name: string; url: string }>
): SchemaMicrodata => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

/**
 * Create Article/BlogPosting schema (JSON-LD)
 * For future blog posts - currently unused
 */
export const createArticleSchema = (data: {
  headline: string;
  description: string;
  image?: string;
  author: string;
  datePublished: string;
  dateModified?: string;
}): SchemaMicrodata => ({
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
});

/**
 * VALIDATION ONLY (no scoring)
 * Checks SEO metadata against best practices
 * Returns warnings, not scores
 * Purpose: Help identify missing or incorrect metadata
 */
export const validateSEO = (
  seo: PageSEO
): { valid: boolean; warnings: string[] } => {
  const warnings: string[] = [];

  // Title validation
  if (!seo.title || seo.title.length === 0) {
    warnings.push("❌ Title is missing");
  } else if (seo.title.length < 30) {
    warnings.push(`⚠️  Title too short: ${seo.title.length} chars (target: 30-60)`);
  } else if (seo.title.length > 60) {
    warnings.push(`⚠️  Title too long: ${seo.title.length} chars (target: 30-60)`);
  }

  // Description validation
  if (!seo.description || seo.description.length === 0) {
    warnings.push("❌ Meta description is missing");
  } else if (seo.description.length < 120) {
    warnings.push(`⚠️  Description too short: ${seo.description.length} chars (target: 120-160)`);
  } else if (seo.description.length > 160) {
    warnings.push(`⚠️  Description too long: ${seo.description.length} chars (target: 120-160)`);
  }

  // Keywords validation (informational - Google ignores this)
  if (!seo.keywords || seo.keywords.length === 0) {
    warnings.push("ℹ️  Keywords empty (Google ignores keywords meta tag)");
  } else if (seo.keywords.length < 3) {
    warnings.push(`ℹ️  Few keywords: ${seo.keywords.length} (suggested: 5-10)`);
  } else if (seo.keywords.length > 15) {
    warnings.push(`⚠️  Too many keywords: ${seo.keywords.length} (recommended: ≤15)`);
  }

  // Canonical URL validation
  if (!seo.canonicalUrl) {
    warnings.push("❌ Canonical URL is missing");
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
};

/**
 * Next.js metadata object generator
 * Converts PageSEO to Next.js Metadata format
 * Used in layout.tsx and page-specific metadata
 */
export const generateNextMetadata = (seo: PageSEO, url: string = "/") => ({
  title: seo.title,
  description: seo.description,
  keywords: formatKeywords(seo.keywords),
  authors: [{ name: seo.author || "Brian Makhembu" }],
  openGraph: {
    title: seo.ogTitle || seo.title,
    description: seo.ogDescription || seo.description,
    images: seo.ogImage ? [{ url: seo.ogImage }] : [],
    url: seo.canonicalUrl || buildCanonicalUrl(url),
    type: "website" as const,
  },
  twitter: {
    card: "summary_large_image" as const,
    title: seo.title,
    description: seo.description,
    creator: "@brianuche",
  },
  canonical: seo.canonicalUrl || buildCanonicalUrl(url),
});
