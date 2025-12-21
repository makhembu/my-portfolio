import { MetadataRoute } from 'next';
import { generateDynamicSitemap } from '@/lib/dynamicSitemap';

/**
 * Dynamic Sitemap Generation
 * Pulls from actual SEO cache instead of hardcoding
 * Updates automatically as SEO data changes
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return await generateDynamicSitemap();
}
