/**
 * REFACTORED DYNAMIC SITEMAP GENERATOR (v2)
 * ==========================================
 * REMOVED: Dependencies on SEO cache, trend data, AI-generated metadata
 * KEPT: Static page list, priority mapping, changefreq logic
 * MODIFIED: Use portfolioData for actual content, track content changes only
 * 
 * Philosophy: Changefreq tied to actual content changes, not daily arbitrary updates
 * Last Updated: 2025-12-22
 */

import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/config';
import { portfolioData } from '@/portfolioData';

interface SitemapEntry {
  url: string;
  lastModified?: Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * URL mapping for portfolio sections
 * Maps section IDs to actual anchor URLs
 */
const PAGE_URL_MAP: Record<string, string> = {
  home: '/',
  about: '/#about',
  projects: '/#projects',
  experience: '/#experience',
  aihub: '/#aihub',
  contact: '/#contact',
};

/**
 * Page priority mapping
 * Based on importance and CTR expectations
 */
const PAGE_PRIORITY_MAP: Record<string, number> = {
  home: 1.0,       // Entry point - highest priority
  projects: 0.9,   // Portfolio work - high engagement
  experience: 0.9, // Professional credibility
  about: 0.8,      // Context - moderate importance
  aihub: 0.7,      // Tools/features - moderate
  contact: 0.6,    // Action item - lower priority
};

/**
 * Change frequency mapping
 * Based on actual content update patterns
 * - home: weekly (layout, featured projects change)
 * - projects: weekly (new projects, case study updates)
 * - experience: monthly (rarely changes after initial setup)
 * - about: monthly (biographical info stable)
 * - aihub: weekly (features, API integrations evolve)
 * - contact: yearly (contact info relatively static)
 */
const PAGE_CHANGEFREQ_MAP: Record<string, 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'> = {
  home: 'weekly',
  projects: 'weekly',
  experience: 'monthly',
  about: 'monthly',
  aihub: 'weekly',
  contact: 'yearly',
};

/**
 * IMPORTANT: Use git commit timestamp for lastModified
 * This ensures sitemap only shows actual changes, not arbitrary daily updates
 * Format: Run this at build time to extract git timestamps
 * 
 * For now: Use portfolio data's last update date
 * In production: Replace with git log parsing
 */
const PORTFOLIO_LAST_UPDATE = new Date('2025-12-22');

/**
 * Generate core static pages
 * These are portfolio sections that always exist
 */
const generateCorePages = (): SitemapEntry[] => {
  const baseUrl = siteConfig.baseUrl;

  return Object.entries(PAGE_URL_MAP).map(([pageId, path]) => ({
    url: `${baseUrl}${path}`,
    lastModified: PORTFOLIO_LAST_UPDATE,
    changeFrequency: PAGE_CHANGEFREQ_MAP[pageId] || 'monthly',
    priority: PAGE_PRIORITY_MAP[pageId] || 0.5,
  }));
};

/**
 * Generate core static pages
 */
const getCorePages = (): SitemapEntry[] => {
  const baseUrl = siteConfig.baseUrl;
  const lastModified = PORTFOLIO_LAST_UPDATE;

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/#about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#projects`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#experience`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#aihub`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];
};

/**
 * Generate protocol pages (sitemap, robots)
 */
const getProtocolPages = (): SitemapEntry[] => {
  const baseUrl = siteConfig.baseUrl;
  const lastModified = PORTFOLIO_LAST_UPDATE;

  return [
    {
      url: `${baseUrl}/sitemap.xml`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
  ];
};

/**
 * Generate complete sitemap
 * Static pages only - no dynamic cache dependencies
 * Changefreq based on actual content change patterns
 */
export async function generateDynamicSitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const corePages = getCorePages();
    const protocolPages = getProtocolPages();

    // Combine all pages, remove duplicates
    const urlSet = new Set<string>();
    const entries: MetadataRoute.Sitemap = [];

    // Add in priority order
    [corePages, protocolPages].forEach((pageGroup) => {
      pageGroup.forEach((page) => {
        if (!urlSet.has(page.url)) {
          urlSet.add(page.url);
          entries.push({
            url: page.url,
            lastModified: page.lastModified,
            changeFrequency: page.changeFrequency,
            priority: page.priority,
          });
        }
      });
    });

    return entries;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Fallback to core pages
    return getCorePages().map((p) => ({
      url: p.url,
      lastModified: p.lastModified,
      changeFrequency: p.changeFrequency,
      priority: p.priority,
    }));
  }
}

/**
 * Get sitemap statistics for monitoring
 */
export async function getSitemapStats() {
  const allPages = [...getCorePages(), ...getProtocolPages()];

  return {
    totalEntries: allPages.length,
    lastModified: PORTFOLIO_LAST_UPDATE.toISOString(),
    corePages: getCorePages().length,
    protocolPages: getProtocolPages().length,
  };
}
