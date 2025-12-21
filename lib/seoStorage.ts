import fs from 'fs/promises';
import path from 'path';
import { AIGeneratedSEO } from '@/seoData';

/**
 * JSON File Storage for SEO Data
 * Provides persistent storage for AI-generated SEO content
 * Data survives server restarts and deployments
 */

const DATA_DIR = path.join(process.cwd(), '.data');
const SEO_CACHE_FILE = path.join(DATA_DIR, 'seo-cache.json');

/**
 * Ensure the .data directory exists
 */
export const ensureDataDir = async (): Promise<void> => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create .data directory:', error);
  }
};

/**
 * Read SEO cache from JSON file
 * @returns Map of page SEO data or empty Map if file doesn't exist
 */
export const readSEOCache = async (): Promise<
  Map<string, AIGeneratedSEO>
> => {
  try {
    await ensureDataDir();
    const data = await fs.readFile(SEO_CACHE_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return new Map(Object.entries(parsed));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // File doesn't exist yet - return empty map
      return new Map();
    }
    console.error('Failed to read SEO cache:', error);
    return new Map();
  }
};

/**
 * Write SEO cache to JSON file
 * @param seoMap - Map of SEO data to persist
 */
export const writeSEOCache = async (
  seoMap: Map<string, AIGeneratedSEO>
): Promise<void> => {
  try {
    await ensureDataDir();
    const data = Object.fromEntries(seoMap);
    await fs.writeFile(
      SEO_CACHE_FILE,
      JSON.stringify(data, null, 2),
      'utf-8'
    );
  } catch (error) {
    console.error('Failed to write SEO cache:', error);
  }
};

/**
 * Get a single SEO entry from cache
 * @param pageId - Page identifier
 * @returns SEO data for page or undefined
 */
export const getSEOFromCache = async (
  pageId: string
): Promise<AIGeneratedSEO | undefined> => {
  const cache = await readSEOCache();
  return cache.get(pageId);
};

/**
 * Update a single SEO entry in cache
 * @param pageId - Page identifier
 * @param seoData - SEO data to save
 */
export const updateSEOInCache = async (
  pageId: string,
  seoData: AIGeneratedSEO
): Promise<void> => {
  const cache = await readSEOCache();
  cache.set(pageId, seoData);
  await writeSEOCache(cache);
};

/**
 * Delete a SEO entry from cache
 * @param pageId - Page identifier
 */
export const deleteSEOFromCache = async (pageId: string): Promise<void> => {
  const cache = await readSEOCache();
  cache.delete(pageId);
  await writeSEOCache(cache);
};

/**
 * Clear all SEO cache
 */
export const clearSEOCache = async (): Promise<void> => {
  try {
    await ensureDataDir();
    await fs.writeFile(SEO_CACHE_FILE, '{}', 'utf-8');
  } catch (error) {
    console.error('Failed to clear SEO cache:', error);
  }
};

/**
 * Get all SEO entries from cache
 * @returns Array of all SEO data entries
 */
export const getAllSEOFromCache = async (): Promise<AIGeneratedSEO[]> => {
  const cache = await readSEOCache();
  return Array.from(cache.values());
};

/**
 * Get cache statistics
 * @returns Cache stats including size and last modified
 */
export const getCacheStats = async (): Promise<{
  size: number;
  entries: number;
  lastModified: string | null;
}> => {
  try {
    const stats = await fs.stat(SEO_CACHE_FILE);
    const cache = await readSEOCache();
    return {
      size: stats.size,
      entries: cache.size,
      lastModified: stats.mtime.toISOString(),
    };
  } catch (error) {
    return {
      size: 0,
      entries: 0,
      lastModified: null,
    };
  }
};

/**
 * Export cache to file (for backups)
 * @param filename - Output filename
 */
export const exportSEOCache = async (filename: string): Promise<void> => {
  try {
    const cache = await readSEOCache();
    const data = Object.fromEntries(cache);
    const exportPath = path.join(DATA_DIR, filename);
    await fs.writeFile(exportPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`SEO cache exported to ${exportPath}`);
  } catch (error) {
    console.error('Failed to export SEO cache:', error);
  }
};

/**
 * Import cache from file (for restoration)
 * @param filename - Input filename
 */
export const importSEOCache = async (filename: string): Promise<void> => {
  try {
    const importPath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(importPath, 'utf-8');
    const parsed = JSON.parse(data);
    const seoMap = new Map(Object.entries(parsed)) as Map<string, AIGeneratedSEO>;
    await writeSEOCache(seoMap);
    console.log(`SEO cache imported from ${importPath}`);
  } catch (error) {
    console.error('Failed to import SEO cache:', error);
  }
};
