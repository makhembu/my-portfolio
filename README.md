# Brian Makhembu - Portfolio

A full-stack portfolio application built with modern web technologies. Dual-track career showcase with ATS-optimized resume tools and AI-powered job matching capabilities.

## Overview

This portfolio demonstrates full-stack engineering expertise and ethical AI implementation through a high-performance web application featuring:

- **Dual Career Tracking**: Seamlessly switch between IT and Translation career paths with filtered content
- **ATS-Optimized Resume**: PDF and text export formats optimized for applicant tracking systems
- **AI-Powered Features**: Ethical, constrained AI tools for resume analysis and translation
- **Internationalization**: English and Swahili language support
- **Dark Mode**: System-aware theme switching with persistent state management
- **Performance Optimized**: Server-side rendering with incremental static regeneration
- **Safety & Rate Limiting**: Built-in request validation, rate limiting, and error handling

## AI Features Architecture

This portfolio includes three distinct AI-powered features, each with explicit safety constraints and visibility models:

### 1. Brian AI Assistant (Public)
- **Purpose**: Summarize documented experience from the portfolio
- **Access**: Public (FAB + full-page modal)
- **Constraints**:
  - Response length capped at 800 characters (enforces conciseness)
  - Request length limited to 5,000 characters
  - Forbidden: role recommendations, skill inflation, speculative advice
  - Rate-limited: 10 requests/minute
  - Timeout: 15 seconds
- **Languages**: English + Swahili
- **Disclaimer**: "I summarize Brian's experience. For career advice, contact Brian directly."

### 2. Resume Optimizer (Hybrid: Demo + Private)
- **Public Mode**: Read-only demonstration with pre-filled sample job description
  - Shows methodology without allowing custom uploads
  - Demonstrates understanding of hiring systems
  - Locked: No export or copy functionality
  - Access: Anyone can view
  
- **Private Mode**: Full functionality with custom job descriptions
  - Access: Environment variable gated (`NEXT_PUBLIC_OPTIMIZER_PRIVATE_MODE=true`)
  - Features: Custom upload, reordering, scoring, export
  - Use case: Personal resume optimization
  
- **Terminology**: "AI Estimated Relevance" (heuristic, not hiring decision)
- **Rate Limits**:
  - 5 requests/minute (private mode)
  - 10,000 character limit
  - 30 second timeout
- **Disclaimer**: "This score is based on keyword alignment heuristics. It's not a hiring decision or guarantee."

### 3. Translation Feature (Public)
- **Purpose**: Professional English-to-Swahili translation with technical accuracy
- **Access**: Public (integrated in AIHub)
- **Context**: Technical documentation, infrastructure specs, policy text
- **Rate Limits**:
  - 20 requests/minute
  - 5,000 character limit
  - 15 second timeout
- **Tone**: Professional, context-aware for East African business

### Safety Implementation
- **Rate Limiting**: Per-IP, per-minute request limits with graceful error messages
- **Request Validation**: Content length caps prevent API spam
- **Timeout Handling**: Clear timeout messages with appropriate HTTP status codes
- **Error States**: User-friendly messages without silent failures
- **No Data Storage**: All requests are stateless; no resume data persists

For detailed architecture and implementation, see [AI_FEATURES_ARCHITECTURE.md](./AI_FEATURES_ARCHITECTURE.md).
For disclaimer copy and messaging, see [AI_DISCLAIMERS_COPY.md](./AI_DISCLAIMERS_COPY.md).

## Overview (Original)

## Technology Stack

**Frontend**
- Next.js 15 (React 19) - Server components with streaming
- TypeScript - Type-safe development
- Tailwind CSS - Utility-first styling with custom components
- Lucide Icons - Performance-optimized SVG icons

**Backend**
- Next.js API Routes - Serverless functions
- Google Gemini API - AI text generation and analysis
- jsPDF - PDF generation
- html2canvas - DOM to canvas conversion

**Infrastructure**
- Vercel - Edge deployment and caching
- GitHub - Version control and CI/CD
- Environment-based configuration

## Key Features

### Resume Intelligence
- Track-specific filtering (IT vs Translation roles)
- Recency-based experience filtering (5-year window)
- ATS-friendly text export with semantic HTML
- PDF download with professional formatting
- AI-powered job matching (public demo + private full mode)

### Multi-Language Support
- English (default)
- Swahili
- Context-aware i18n with persistent language preference
- SEO-optimized language alternates

### Content Management
- Centralized data model (portfolioData.ts)
- Track-specific filtering at component level
- Dynamic sitemap generation
- Schema.org structured data for SEO

## Project Structure

```
app/
  api/
    resume/
      generate-pdf/    PDF generation endpoint
      optimize/        AI optimization endpoint
    seo/               SEO utilities
  layout.tsx           Root layout with providers
  page.tsx             Home page with section routing

components/
  ATSFriendlyResume.tsx      Resume download/export
  ResumeOptimizer.tsx        AI job matcher interface
  PINModal.tsx               Recruiter access control
  Experience.tsx             Career history
  Projects.tsx               Portfolio projects
  [other sections]

lib/
  context.tsx          Global state (theme, language, modal)
  resumeContext.tsx    Resume unlock state
  useTrackContext.tsx  Career track filtering
  pdf/                 PDF generation modules
  seoUtils.ts          Metadata and structured data

services/
  resumeOptimizationService.ts  Resume-AI interface
  geminiService.ts              API client utilities
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Gemini API key

### Installation

```bash
git clone <repository>
cd portfolio
npm install
```

### Environment Setup

Create `.env.local`:
```bash
# Required: Google Gemini API key for AI features
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here

# Optional: Enable private mode for Resume Optimizer (false by default)
# Set to 'true' to unlock full custom job description functionality
NEXT_PUBLIC_OPTIMIZER_PRIVATE_MODE=false
```

For public visitors, the Resume Optimizer shows a read-only demo with a sample job description.
Set `NEXT_PUBLIC_OPTIMIZER_PRIVATE_MODE=true` in development or production to access full functionality.

### Development

```bash
npm run dev
```

Visit http://localhost:3000

### Production Build

```bash
npm run build
npm run start
```

## Performance Optimizations

- Next.js Image component for optimized image loading
- CSS-in-JS with Tailwind purging unused styles
- SVG icons for zero-download icon fonts
- API route caching with revalidation strategies
- Dynamic imports for code splitting

## API Endpoints

All API endpoints include safety features: rate limiting, request validation, and proper error handling.

**POST /api/resume/optimize**
- Purpose: AI-powered resume optimization based on job description
- Rate Limit: 5 requests/minute, 10KB limit, 30s timeout
- Body: `{ jobDescription: string, candidateData: object, track: 'it' | 'translation' | 'both' }`
- Returns: Optimized resume with "AI Estimated Relevance" score
- Model: gemini-2.5-flash
- Status Codes:
  - 200: Success
  - 400: Invalid request or too long
  - 429: Rate limited
  - 504: Timeout

**POST /api/translate**
- Purpose: Professional English-to-Swahili translation
- Rate Limit: 20 requests/minute, 5KB limit, 15s timeout
- Body: `{ text: string }`
- Returns: `{ translation: string }`
- Model: gemini-2.5-flash
- Status Codes:
  - 200: Success
  - 400: Invalid request or too long
  - 429: Rate limited
  - 504: Timeout

**POST /api/resume/generate-pdf**
- Purpose: PDF generation from optimized resume data
- Body: `{ htmlString: string, filename: string }`
- Returns: PDF binary data
- Tool: jsPDF + html2canvas

## SEO Implementation

- Dynamic metadata generation based on routes
- Open Graph and Twitter card support
- JSON-LD structured data (Person schema)
- Sitemap generation with track filtering
- robots.txt configuration
- Canonical URL management

## State Management

- React Context API for global state
- Custom hooks for feature-specific state
- Persistent state in localStorage (theme, language)
- SessionStorage for temporary data

## Accessibility

- WCAG 2.1 compliant color contrasts
- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Dark mode respects system preferences

## Development Practices

- TypeScript strict mode enabled
- Component-based architecture with clear separation of concerns
- Custom hooks for reusable logic
- Environment-based configuration
- Error boundary components for resilience
- Console error handling with user-friendly messages

## Deployment

Deployed on Vercel with:
- Automatic deployments from main branch
- Edge function support for API routes
- Built-in analytics and monitoring
- Environment variable management
- Preview deployments for pull requests

## License

Brian Makhembu - Full-Stack Specialist

## Contact

- GitHub: [github.com/brianuche](https://github.com/brianuche)
- LinkedIn: [linkedin.com/in/brianuche](https://linkedin.com/in/brianuche)
- Email: brian@brianuche.dev
