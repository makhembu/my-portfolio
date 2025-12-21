import fs from 'fs/promises';
import path from 'path';
import { TrendReport } from '@/services/trendResearchService';

/**
 * Trend Data Storage
 * Persists trend research reports for analysis and reference
 */

const DATA_DIR = path.join(process.cwd(), '.data');
const TRENDS_DIR = path.join(DATA_DIR, 'trends');
const CURRENT_TRENDS_FILE = path.join(TRENDS_DIR, 'current.json');
const TRENDS_HISTORY_FILE = path.join(TRENDS_DIR, 'history.json');

/**
 * Ensure trends directory exists
 */
export const ensureTrendsDir = async (): Promise<void> => {
  try {
    await fs.mkdir(TRENDS_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create trends directory:', error);
  }
};

/**
 * Save current trend report
 * @param report - Trend report to save
 */
export const saveTrendReport = async (report: TrendReport): Promise<void> => {
  try {
    await ensureTrendsDir();
    await fs.writeFile(
      CURRENT_TRENDS_FILE,
      JSON.stringify(report, null, 2),
      'utf-8'
    );
    console.log(`✅ Trend report saved for ${report.date}`);

    // Also add to history
    await addToTrendHistory(report);
  } catch (error) {
    console.error('Failed to save trend report:', error);
  }
};

/**
 * Load current trend report
 * @returns Current trend report or null
 */
export const loadCurrentTrends = async (): Promise<TrendReport | null> => {
  try {
    await ensureTrendsDir();
    const data = await fs.readFile(CURRENT_TRENDS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    console.error('Failed to load current trends:', error);
    return null;
  }
};

/**
 * Add report to history
 * @param report - Report to add to history
 */
export const addToTrendHistory = async (report: TrendReport): Promise<void> => {
  try {
    await ensureTrendsDir();
    let history: TrendReport[] = [];

    try {
      const data = await fs.readFile(TRENDS_HISTORY_FILE, 'utf-8');
      history = JSON.parse(data);
    } catch {
      // File doesn't exist yet
    }

    // Keep last 30 reports
    history.unshift(report);
    if (history.length > 30) {
      history = history.slice(0, 30);
    }

    await fs.writeFile(
      TRENDS_HISTORY_FILE,
      JSON.stringify(history, null, 2),
      'utf-8'
    );
  } catch (error) {
    console.error('Failed to add to trend history:', error);
  }
};

/**
 * Get trend history
 * @param limit - Number of reports to retrieve
 * @returns Array of past trend reports
 */
export const getTrendHistory = async (limit: number = 10): Promise<TrendReport[]> => {
  try {
    await ensureTrendsDir();
    const data = await fs.readFile(TRENDS_HISTORY_FILE, 'utf-8');
    const history: TrendReport[] = JSON.parse(data);
    return history.slice(0, limit);
  } catch (error) {
    console.error('Failed to load trend history:', error);
    return [];
  }
};

/**
 * Check if trends need updating (older than 24 hours)
 * @returns true if trends should be refreshed
 */
export const shouldRefreshTrends = async (): Promise<boolean> => {
  try {
    const trends = await loadCurrentTrends();
    if (!trends) return true;

    const trendDate = new Date(trends.timestamp);
    const now = new Date();
    const hoursDiff = (now.getTime() - trendDate.getTime()) / (1000 * 60 * 60);

    return hoursDiff >= 24;
  } catch (error) {
    console.error('Failed to check trend freshness:', error);
    return true;
  }
};

/**
 * Get trend statistics
 * @returns Stats about stored trends
 */
export const getTrendStats = async () => {
  try {
    const currentTrends = await loadCurrentTrends();
    const history = await getTrendHistory(100);

    return {
      hasCurrent: currentTrends !== null,
      currentDate: currentTrends?.date || 'None',
      historyCount: history.length,
      lastUpdated: currentTrends?.timestamp || null,
    };
  } catch (error) {
    console.error('Failed to get trend stats:', error);
    return {
      hasCurrent: false,
      currentDate: 'None',
      historyCount: 0,
      lastUpdated: null,
    };
  }
};

/**
 * Export trends for analysis
 * @param filename - Output filename
 */
export const exportTrends = async (filename: string): Promise<void> => {
  try {
    const currentTrends = await loadCurrentTrends();
    const history = await getTrendHistory(30);

    const exportData = {
      current: currentTrends,
      history,
      exportDate: new Date().toISOString(),
    };

    const exportPath = path.join(TRENDS_DIR, filename);
    await fs.writeFile(exportPath, JSON.stringify(exportData, null, 2), 'utf-8');
    console.log(`📊 Trends exported to ${exportPath}`);
  } catch (error) {
    console.error('Failed to export trends:', error);
  }
};

/**
 * Clear old trend history (keep only recent)
 * @param keepDays - Number of days to keep
 */
export const cleanupOldTrends = async (keepDays: number = 30): Promise<void> => {
  try {
    const history = await getTrendHistory(100);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - keepDays);

    const filtered = history.filter((report) => {
      return new Date(report.timestamp) > cutoffDate;
    });

    if (filtered.length < history.length) {
      await ensureTrendsDir();
      await fs.writeFile(
        TRENDS_HISTORY_FILE,
        JSON.stringify(filtered, null, 2),
        'utf-8'
      );
      console.log(
        `🧹 Cleaned up trend history: ${history.length - filtered.length} old reports removed`
      );
    }
  } catch (error) {
    console.error('Failed to cleanup old trends:', error);
  }
};
