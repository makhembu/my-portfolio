# Brian Makhembu - Portfolio

A full-stack portfolio application built with modern web technologies. Dual-track career showcase with ATS-optimized resume tools and AI-powered job matching capabilities.

## Overview

This portfolio demonstrates full-stack engineering expertise through a high-performance web application featuring:

- **Dual Career Tracking**: Seamlessly switch between IT and Translation career paths with filtered content
- **ATS-Optimized Resume**: PDF and text export formats optimized for applicant tracking systems
- **AI Job Matcher**: Real-time resume optimization against job descriptions using Google Gemini API
- **Internationalization**: English and Swahili language support
- **Dark Mode**: System-aware theme switching with persistent state management
- **Performance Optimized**: Server-side rendering with incremental static regeneration

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
- PIN-protected premium features for recruiters

### AI Job Matching
- Job description parsing and analysis
- Relevance scoring (0-100) based on keyword matching
- Experience reordering by relevance
- Skill highlighting and optimization recommendations
- Real-time response streaming

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
```
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

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

**POST /api/resume/optimize**
- Body: `{ jobDescription: string, candidateData: object, track: 'it' | 'translation' | 'both' }`
- Returns: Optimized resume with match score
- Model: gemini-2.5-flash

**POST /api/resume/generate-pdf**
- Body: `{ htmlString: string, filename: string }`
- Returns: PDF binary data
- Uses: jsPDF + html2canvas

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
