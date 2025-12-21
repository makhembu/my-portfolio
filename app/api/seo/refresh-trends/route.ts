import { NextRequest, NextResponse } from 'next/server';
import { compileTrendReport } from '@/services/trendResearchService';
import { runTrendOptimizationPipeline } from '@/services/trendOptimizationService';
import { saveTrendReport } from '@/lib/trendStorage';
import { pageSEOMap } from '@/seoData';

/**
 * API Route: POST /api/seo/refresh-trends
 * Triggers trend research and SEO optimization
 * Can be called manually or by scheduled jobs
 */

export async function POST(request: NextRequest) {
  try {
    // Verify authorization (optional - add your auth logic)
    const authHeader = request.headers.get('authorization');
    const secret = process.env.SEO_UPDATE_SECRET;

    if (secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🚀 Starting trend research and SEO optimization...');

    // Step 1: Research trends
    const trendReport = await compileTrendReport();
    console.log('✅ Trend research complete');

    // Step 2: Save trends
    await saveTrendReport(trendReport);
    console.log('💾 Trends saved');

    // Step 3: Optimize SEO
    const optimizedPages = await runTrendOptimizationPipeline(pageSEOMap);
    console.log('✨ SEO optimization complete');

    return NextResponse.json(
      {
        success: true,
        message: 'Trend research and SEO optimization completed',
        timestamp: new Date().toISOString(),
        trends: {
          topSkills: trendReport.topSkills.slice(0, 5),
          recruiterFocus: trendReport.recruiterFocus.slice(0, 3),
          emergingTechs: trendReport.emergingTechs.slice(0, 5),
        },
        optimizedPages: Object.keys(optimizedPages),
        pagesCount: Object.keys(optimizedPages).length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in trend optimization:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * API Route: GET /api/seo/refresh-trends
 * Returns current trend status and last update info
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'status') {
      // Return status information
      return NextResponse.json({
        status: 'ready',
        message: 'Use POST to trigger trend update',
        endpoint: '/api/seo/refresh-trends',
        method: 'POST',
        auth: 'Bearer token required if SEO_UPDATE_SECRET is set',
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      {
        error: 'Invalid action',
        supportedActions: ['status'],
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in trend status:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
