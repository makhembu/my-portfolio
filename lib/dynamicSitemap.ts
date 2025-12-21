import { MetadataRoute } from 'next';
import { readSEOCache } from '@/lib/seoStorage';
import { siteConfig } from '@/lib/config';

/**
 * Dynamic Sitemap Generator
 * Pulls from actual pages and trend data instead of hardcoding
 */

interface SitemapEntry {
  url: string;
  lastModified?: Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * Get dynamic pages from SEO cache
 * These are pages that have been optimized with trend data
 */
export const getDynamicPages = async (): Promise<SitemapEntry[]> => {
  try {
    const seoCache = await readSEOCache();
    const baseUrl = siteConfig.baseUrl;
    const lastModified = new Date();

    const pages: SitemapEntry[] = [];

    // Add pages from SEO cache with their actual last modified dates
    for (const [pageId, seoData] of seoCache) {
      const pageUrl = mapPageIdToUrl(pageId);
      if (pageUrl) {
        pages.push({
          url: `${baseUrl}${pageUrl}`,
          lastModified: new Date(seoData.lastUpdated),
          changeFrequency: 'daily', // Dynamic content = frequent updates
          priority: getPagePriority(pageId),
        });
      }
    }

    return pages;
  } catch (error) {
    console.error('Error getting dynamic pages:', error);
    return [];
  }
};

/**
 * Map page IDs to actual URLs
 * @param pageId - Page identifier
 * @returns URL path or null
 */
function mapPageIdToUrl(pageId: string): string | null {
  const urlMap: Record<string, string> = {
    home: '/',
    about: '/#about',
    projects: '/#projects',
    experience: '/#experience',
    aihub: '/#aihub',
    contact: '/#contact',
  };

  return urlMap[pageId] || null;
}

/**
 * Get priority for URL based on importance
 * @param pageId - Page identifier
 * @returns Priority (0.0-1.0)
 */
function getPagePriority(pageId: string): number {
  const priorityMap: Record<string, number> = {
    home: 1.0,
    about: 0.9,
    projects: 0.9,
    experience: 0.9,
    aihub: 0.8,
    contact: 0.7,
  };

  return priorityMap[pageId] || 0.5;
}

/**
 * Generate core static pages
 */
const getCorePages = (): SitemapEntry[] => {
  const baseUrl = siteConfig.baseUrl;
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/#about`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
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
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];
};

/**
 * Generate protocol pages
 */
const getProtocolPages = (): SitemapEntry[] => {
  const baseUrl = siteConfig.baseUrl;
  const lastModified = new Date();

  return [
    {
      url: `${baseUrl}/sitemap.xml`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/robots.txt`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];
};

/**
 * Generate complete dynamic sitemap
 * Combines static pages with dynamic trend-optimized pages
 */
export async function generateDynamicSitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [corePages, protocolPages, dynamicPages] = await Promise.all([
      Promise.resolve(getCorePages()),
      Promise.resolve(getProtocolPages()),
      getDynamicPages(),
    ]);

    // Combine all pages, remove duplicates
    const urlSet = new Set<string>();
    const entries: MetadataRoute.Sitemap = [];

    // Add in priority order
    [corePages, dynamicPages, protocolPages].forEach((pageGroup) => {
      pageGroup.forEach((page) => {
        if (!urlSet.has(page.url)) {
          urlSet.add(page.url);
          entries.push({
            url: page.url,
            lastModified: page.lastModified,
            changeFrequency: page.changeFrequency as any,
            priority: page.priority,
          });
        }
      });
    });

    return entries;
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    // Fallback to core pages
    return getCorePages().map((p) => ({
      url: p.url,
      lastModified: p.lastModified,
      changeFrequency: p.changeFrequency as any,
      priority: p.priority,
    }));
  }
}

/**
 * Get sitemap statistics
 */
export async function getSitemapStats() {
  const allPages = [
    ...getCorePages(),
    ...getProtocolPages(),
    ...(await getDynamicPages()),
  ];

  return {
    totalEntries: allPages.length,
    lastModified: new Date().toISOString(),
    dynamicPages: (await getDynamicPages()).length,
    staticPages: getCorePages().length,
  };
}
