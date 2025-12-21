import { NextRequest, NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { htmlString, filename } = await request.json();

    if (!htmlString) {
      return NextResponse.json(
        { error: 'HTML content is required' },
        { status: 400 }
      );
    }

    // Create a temporary HTML document
    const tempDiv = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; padding: 0; }
  </style>
</head>
<body>
  ${htmlString}
</body>
</html>`;

    console.log('Generating PDF...');
    
    // For now, return a message that client-side generation is needed
    // The Turbopack issue makes server-side html2canvas unreliable
    return NextResponse.json(
      { 
        error: 'Use client-side generation',
        message: 'PDF generation should be handled client-side'
      },
      { status: 400 }
    );

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('PDF generation error:', errorMsg);
    
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: errorMsg },
      { status: 500 }
    );
  }
}
