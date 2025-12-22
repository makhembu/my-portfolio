# Brian Makhembu Portfolio System - Complete Architecture Guide

## Table of Contents
1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Core Architecture](#core-architecture)
4. [Data Flow & State Management](#data-flow--state-management)
5. [Component Structure](#component-structure)
6. [AI Features & Services](#ai-features--services)
7. [API Routes](#api-routes)
8. [Content Management](#content-management)
9. [Styling & Theme System](#styling--theme-system)
10. [SEO & Performance](#seo--performance)
11. [Deployment & Environment Configuration](#deployment--environment-configuration)

---

## System Overview

This is a **dual-track portfolio system** built with Next.js 16 (React 19) that showcases two distinct career paths: **Full-Stack Engineering** and **Professional Translation/Localization**. The system is production-ready, globally optimized, and integrates ethical AI for resume optimization, job matching, and technical translation.

### Key Characteristics:
- **Dual-Career Filtering**: Dynamic content that switches between IT and Translation tracks
- **Bilingual Support**: Full English and Swahili translations
- **ATS-Optimized Resumes**: Multiple export formats for applicant tracking systems
- **AI-Powered Features**: Ethical, rate-limited AI tools via Google Gemini API
- **Dark Mode Support**: System-aware theme switching with persistent state
- **Performance Optimized**: Server-side rendering (SSR) with incremental static regeneration (ISR)
- **Safety First**: Built-in rate limiting, request validation, and error handling

---

## Technology Stack

### Frontend
| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16 | React-based meta-framework with SSR/SSG |
| **Runtime Language** | TypeScript 5.8 | Type-safe development |
| **Styling** | Tailwind CSS | Utility-first CSS with custom components |
| **Icons** | Lucide React | SVG-based icon system |
| **React Version** | React 19 | Latest server components & features |

### Backend & Services
| Layer | Technology | Purpose |
|-------|-----------|---------|
| **API Handler** | Next.js API Routes | Serverless endpoint handlers |
| **AI Model** | Google Gemini 1.5 Flash | Text generation & analysis |
| **PDF Generation** | jsPDF + html-pdf-node | PDF export from DOM/HTML |
| **Canvas Rendering** | html2canvas | DOM to canvas conversion |
| **Image Processing** | Sharp 0.34 | Image optimization |

### Infrastructure & Hosting
| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Deployment** | Vercel | Edge deployment with caching |
| **Version Control** | GitHub | Source management & CI/CD |
| **Build** | npm scripts | Package management & build orchestration |
| **Database** | None (JSON-based) | Data stored in TypeScript files |

---

## Core Architecture

### Directory Structure

```
portfolio/
├── app/                          # Next.js app router
│   ├── layout.tsx               # Root layout with SEO metadata
│   ├── page.tsx                 # Home page (main portfolio view)
│   ├── robots.ts                # SEO robots.txt generation
│   ├── sitemap.ts               # Dynamic sitemap generation
│   └── api/                     # API endpoints
│       ├── resume/              # Resume-related APIs
│       │   ├── generate-pdf/    # PDF generation
│       │   └── optimize/        # AI resume optimization
│       └── translate/           # Translation API
│
├── components/                  # React components
│   ├── Hero.tsx                 # Hero section
│   ├── About.tsx                # About section
│   ├── Projects.tsx             # Projects showcase
│   ├── Experience.tsx           # Experience timeline
│   ├── ResumeSection.tsx        # Resume display & controls
│   ├── ATSFriendlyResume.tsx    # ATS-optimized resume view
│   ├── ResumeOptimizer.tsx      # AI job matcher
│   ├── AIHub.tsx                # AI features hub
│   ├── AIHubFAB.tsx             # Floating action button for AI
│   ├── NavbarClient.tsx         # Navigation bar
│   ├── Footer.tsx               # Footer
│   ├── GitHubActivity.tsx       # GitHub integration display
│   ├── PINModal.tsx             # PIN-protected content modal
│   └── ErrorBoundary.tsx        # Error handling wrapper
│
├── lib/                         # Utilities & hooks
│   ├── config.ts                # Site configuration
│   ├── context.tsx              # Global context providers
│   ├── useTrackContext.tsx      # Career track switching hook
│   ├── resumeContext.tsx        # Resume-related state
│   ├── geminiClient.ts          # Gemini API client
│   ├── browserUtils.ts          # Browser APIs helper
│   ├── dynamicSitemap.ts        # Sitemap generation
│   ├── seoUtils.ts              # SEO utilities
│   ├── useFilteredPortfolioData.ts # Data filtering hook
│   ├── projectSchema.ts         # Project type validation
│   └── pdf/                     # PDF generation utilities
│       ├── PDFConfig.ts         # PDF styling configuration
│       ├── PDFHeader.ts         # PDF header component
│       ├── PDFFooter.ts         # PDF footer component
│       ├── PDFSection.ts        # PDF section renderer
│       └── ResumePDFGenerator.ts # Main PDF generator
│
├── services/                    # Business logic services
│   ├── geminiService.ts         # Gemini API service wrapper
│   └── resumeOptimizationService.ts # Resume optimization logic
│
├── public/                      # Static assets
│   └── [images, icons, etc.]
│
├── styles/                      # Global CSS
│   └── globals.css              # Tailwind + custom CSS
│
├── types/                       # TypeScript type definitions
│   └── html2pdf.d.ts            # html2pdf type declarations
│
├── portfolioData.ts             # Master content data file
├── types.ts                     # Shared TypeScript interfaces
├── seoDataRefactored.ts         # SEO metadata configuration
├── seoData.ts                   # Original SEO data (legacy)
├── next.config.js               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies & scripts
├── postcss.config.mjs            # PostCSS configuration
├── vercel.json                  # Vercel deployment config
└── README.md                    # Documentation

```

---

## Data Flow & State Management

### Global State Architecture

The portfolio uses **React Context API** for global state management across three layers:

#### 1. **Language Context** (`LanguageContext`)
```typescript
interface LanguageContextType {
  lang: 'en' | 'sw';           // Current language
  setLang: (l: Language) => void;
  t: (key: string) => string;  // Translation function
}
```
- **Purpose**: Bilingual support (English/Swahili)
- **Data Source**: `portfolioData.uiTranslations`
- **Persistence**: localStorage (`lang_preference`)
- **Usage**: Access via `useContext(LanguageContext)` or `useLanguage()` hook

#### 2. **Track Context** (`TrackProvider`)
```typescript
interface TrackContextType {
  track: 'it' | 'translation';     // Selected career track
  setTrack: (t: CareerTrack) => void;
}
```
- **Purpose**: Switch between IT and Translation content
- **Filtering Effect**: Automatically filters projects, experience, services
- **Persistence**: localStorage (`selected_track`)
- **Usage**: Access via `useTrack()` hook
- **Scope**: Affects:
  - Projects (filtered by `track` field)
  - Experience entries (filtered by `track` field)
  - Services (filtered by `track` field)
  - Hero section (shows track-specific role)
  - About section (shows track-specific summary)

#### 3. **Theme Context** (`ThemeContext`)
```typescript
interface ThemeContextType {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  toggleTheme: (e?: React.MouseEvent) => void;
}
```
- **Purpose**: Dark/light mode switching
- **Detection**: System preference (`prefers-color-scheme`)
- **Persistence**: localStorage (`theme_preference`)
- **Implementation**: Tailwind `dark:` prefix classes
- **Usage**: Access via `useTheme()` hook

#### 4. **Resume Modal Context** (`ResumeModalContext`)
```typescript
interface ResumeModalContextType {
  isResumeOpen: boolean;
  setIsResumeOpen: (value: boolean) => void;
}
```
- **Purpose**: Control resume modal visibility
- **Trigger**: Resume button in navbar, resume section CTA
- **Content**: Shows `ATSFriendlyResume` component

### Context Provider Hierarchy

```typescript
// app/layout.tsx structure
<ResumeProvider>
  <AppContextProvider>
    <TrackProvider>
      {children}
    </TrackProvider>
  </AppContextProvider>
</ResumeProvider>
```

### Data Source: `portfolioData.ts`

Master data structure containing:

```typescript
interface EnhancedPortfolioData extends PortfolioData {
  profile: {
    firstName: string;
    lastName: string;
    location: string;
    education: string;
    availability: string;
    variants: {
      it: ProfileVariant;        // IT-specific role, tagline, summary
      translation: ProfileVariant; // Translation-specific role, tagline, summary
    };
  };
  
  socials: {
    github: string;
    linkedin: string;
    email: string;
  };
  
  projects: Project[];           // Filtered by track: 'it' | 'translation' | 'both'
  services: Service[];           // Filtered by track
  
  skills: {
    it: {
      frontend: string[];
      backend: string[];
      infrastructure: string[];
    };
    translation: {
      technical: string[];
      languages: string[];
      specializations: string[];
    };
  };
  
  languages: SkillItem[];        // Language proficiency levels
  experience: Experience[];      // Career history, filtered by track
  
  detailedContext: {
    universityLore: string;      // JKUAT background
    fanharmStories: string;      // Farnham Technologies experience
    linguisticBackground: string; // Jambo Linguists background
    designPhilosophy: string;    // "Strategy over Aesthetics"
  };
  
  uiTranslations: {
    en: Record<string, string>;  // English UI strings
    sw: Record<string, string>;  // Swahili UI strings
  };
}
```

### Data Filtering Pattern

The `useFilteredPortfolioData()` hook implements track-based filtering:

```typescript
// Returns filtered data based on current track
const filteredProjects = projects.filter(p => 
  p.track === 'both' || p.track === selectedTrack
);

const filteredExperience = experience.filter(e =>
  e.track === 'both' || e.track === selectedTrack
);

const filteredServices = services.filter(s =>
  s.track === 'both' || s.track === selectedTrack
);
```

---

## Component Structure

### Top-Level Layout Flow

```
RootLayout (layout.tsx)
├── SEO Metadata (generateNextMetadata)
├── Theme Configuration
├── ResumeProvider
├── AppContextProvider (Language + Theme)
│   └── TrackProvider
│       └── HomePage (page.tsx)
│           ├── ErrorBoundary
│           ├── NavbarClient
│           ├── AIHubFAB (Floating Action Button)
│           └── Main Content
│               ├── Hero
│               ├── About
│               ├── Projects
│               ├── ResumeSection
│               ├── Experience
│               └── Footer
```

### Key Components

#### **Hero Component**
- Displays role and tagline based on selected track
- Animated with fade-in and slide-in effects
- CTA buttons: "Get in Touch" & "View Shipped Work"
- Track-responsive text rendering

#### **About Component**
- Shows profile summary based on track
- Renders detailed context (university lore, experience stories)
- Lists languages and skills filtered by track
- Design philosophy section

#### **Projects Component**
- Displays project cards with images, descriptions, and links
- Filterable by category: all, code, infra, translation
- Track-based filtering (shows only relevant projects)
- Metrics display for each project
- GitHub and live links

#### **Experience Component**
- Timeline of career roles
- Filtered by track selection
- Shows company, role, period, description, and skills
- Chronological or reverse-chronological display

#### **ResumeSection Component**
- Two-tab interface:
  1. **ATS-Friendly Resume**: Semantic HTML export
  2. **AI Job Matcher**: Resume optimizer with scoring
- Download as PDF
- Copy to clipboard
- AI-powered optimization form

#### **ATSFriendlyResume Component**
- Renders clean, semantic resume
- ATS-compatible formatting
- Removes styling for plain text export
- Includes contact, summary, experience, skills
- Responsive text layout

#### **ResumeOptimizer Component**
- Form to input job description
- AI analysis via Gemini API
- Displays match score and suggestions
- Reorders experience by relevance
- Shows keyword matches and gaps
- **Two Modes**:
  - Public (demo, read-only)
  - Private (full features, environment-gated)

#### **AIHubFAB Component**
- Floating action button (FAB)
- Opens modal with:
  - Brian AI Assistant (summarization)
  - Translation service (English → Swahili)
  - Resume optimizer link
- Animated entrance/exit
- Dismissible

#### **NavbarClient Component**
- Navigation links to sections
- Theme toggle (dark/light mode)
- Language switcher (EN/SW)
- Track switcher (IT/Translation)
- Mobile-responsive hamburger menu
- Fixed positioning with scroll-aware styling

#### **Footer Component**
- Contact information
- Social media links
- Copyright notice
- Localized content

#### **ErrorBoundary Component**
- React error boundary
- Displays fallback UI on error
- Logs errors for debugging
- Prevents cascade failures

---

## AI Features & Services

### Architecture Overview

The portfolio includes **three distinct AI features**, each with different access levels, rate limits, and safety constraints:

```
┌─────────────────────────────────────────────┐
│         Google Gemini API (Backend)         │
├─────────────────────────────────────────────┤
│  Rate Limiting | Request Validation | Auth  │
├─────────────────────────────────────────────┤
│     ┌──────────┐   ┌────────────┐  ┌───┐   │
│     │ Brian AI │   │  Optimizer │  │ TX │   │
│     │Assistant │   │  (Demo/Pvt)│  │    │   │
│     └──────────┘   └────────────┘  └───┘   │
└─────────────────────────────────────────────┘
```

### 1. Brian AI Assistant (Public)

**Purpose**: Summarize Brian's documented experience from the portfolio

**Access Level**: Public (FAB + modal)

**Configuration**:
```typescript
{
  maxRequestLength: 5000,
  maxResponseLength: 800,
  rateLimit: 10,           // requests per minute
  timeout: 15000,          // milliseconds
  disclaimer: "I summarize Brian's experience. For career advice, contact Brian directly."
}
```

**Constraints**:
- Response capped at 800 characters (enforces conciseness)
- Cannot recommend roles or inflate skills
- No speculative advice
- No contact substitution

**Languages**: English + Swahili (auto-detected)

**Implementation**: 
- Component: `AIHub.tsx` (tab 1)
- Service: `geminiService.ts`
- Route: Uses browser-side fetch to `/api/ai/*`

**User Flow**:
1. User opens AIHubFAB
2. Clicks "Chat with Brian" tab
3. Types question about experience
4. AI returns summary within constraints
5. Response displayed in chat

### 2. Resume Optimizer (Hybrid)

**Purpose**: AI-powered job matching to tailor resume for opportunities

**Access Modes**:

#### Public Mode (Read-Only Demo)
- Pre-filled with sample job description
- Shows methodology without allowing uploads
- **Features Disabled**: Custom upload, reordering, export
- **Visibility**: Anyone can view
- **Purpose**: Demonstrates understanding of hiring systems

#### Private Mode (Full Features)
- Requires: `NEXT_PUBLIC_OPTIMIZER_PRIVATE_MODE=true`
- **Features Enabled**: Custom upload, reordering, export, scoring
- **Use Case**: Personal resume optimization
- **Access Control**: Environment variable gated

**Configuration**:
```typescript
{
  maxRequestLength: 10000,
  rateLimit: {
    public: 1,           // demo: once per session
    private: 5           // full: requests per minute
  },
  timeout: 30000,
  disclaimer: "This score is based on keyword alignment heuristics. 
               It's not a hiring decision or guarantee.",
  terminology: "AI Estimated Relevance" (not "match score")
}
```

**Implementation**:
- Component: `ResumeOptimizer.tsx`
- Modal: `ResumeOptimizerModal.tsx`
- Service: `resumeOptimizationService.ts`
- Route: `/api/resume/optimize`

**Algorithm**:
1. Parse job description (extract keywords, requirements)
2. Analyze resume experience (map skills, achievements)
3. Calculate relevance score (0-100)
4. Identify keyword gaps
5. Suggest reordering by relevance
6. Highlight matching bullet points

**Output Format**:
```typescript
{
  matchScore: number;           // 0-100
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  reorderedExperience: Experience[];
  highlightedBullets: string[];
}
```

**Safety Measures**:
- No guarantee language ("estimated relevance")
- No claim of hiring decision prediction
- Encourages human review
- Rate limited to prevent abuse

### 3. Translation Service (Public)

**Purpose**: Professional English-to-Swahili translation with technical accuracy

**Access Level**: Public (AIHub modal, integrated)

**Configuration**:
```typescript
{
  sourceLanguage: 'en',
  targetLanguage: 'sw',
  maxRequestLength: 5000,
  rateLimit: 20,               // requests per minute
  timeout: 15000,
  context: "Technical documentation, infrastructure specs, policy text"
}
```

**Use Cases**:
- Translate portfolio content to Swahili
- Technical documentation localization
- Software UI localization
- Professional communication

**Implementation**:
- Component: `AIHub.tsx` (tab 3)
- Service: `geminiService.ts`
- Route: `/api/translate`

**Flow**:
1. User enters English text
2. AI translates to Swahili
3. Maintains technical terminology
4. Returns professional tone
5. User copies or exports

### Service Layer Architecture

#### `geminiService.ts`

Wrapper around Google Gemini API:

```typescript
export interface GeminiServiceConfig {
  apiKey: string;
  model: string;
  temperature: number;
  topK?: number;
  topP?: number;
}

export class GeminiService {
  // Initialize with API key from env
  constructor(config: GeminiServiceConfig)

  // Chat interface for Brian AI Assistant
  async chat(
    message: string,
    context: string,
    history?: Message[]
  ): Promise<string>

  // Analysis for resume optimization
  async analyzeJobDescription(
    jobDescription: string,
    resume: string
  ): Promise<AnalysisResult>

  // Translation service
  async translate(
    text: string,
    sourceLang: string,
    targetLang: string
  ): Promise<string>

  // Rate limiting middleware
  private checkRateLimit(endpoint: string): boolean
}
```

#### Rate Limiting Implementation

Per-IP rate limiting using middleware:

```typescript
// /api/middleware/rateLimit.ts pattern
const rateLimits = {
  '/api/ai/chat': { limit: 10, window: 60000 },      // 10/min
  '/api/resume/optimize': { limit: 5, window: 60000 }, // 5/min
  '/api/translate': { limit: 20, window: 60000 }      // 20/min
};

function checkRateLimit(ip: string, endpoint: string): boolean {
  // Track requests per IP
  // Return true if under limit, false if exceeded
}
```

---

## API Routes

### Route Structure

```
/api/
├── resume/
│   ├── generate-pdf/
│   │   └── route.ts          # POST: Generate PDF from resume data
│   └── optimize/
│       └── route.ts          # POST: AI resume optimization
└── translate/
    └── route.ts              # POST: English to Swahili translation
```

### Route Specifications

#### **POST /api/resume/generate-pdf**

**Purpose**: Generate PDF from resume data

**Request Body**:
```typescript
{
  html: string;              // Resume HTML markup
  filename: string;          // Output filename
  format?: 'a4' | 'letter'; // Paper size
  margins?: number;          // Margin in mm
}
```

**Response**:
```typescript
{
  success: boolean;
  pdfBuffer?: Buffer;
  filename: string;
  error?: string;
}
```

**Implementation**:
- Uses `html-pdf-node` library
- Renders via headless Chrome
- Returns Buffer for download
- Handles errors gracefully

#### **POST /api/resume/optimize**

**Purpose**: AI-powered resume optimization for job matching

**Request Body**:
```typescript
{
  jobDescription: string;    // Pasted job description
  resumeText: string;        // Current resume text
  mode: 'demo' | 'private';  // Access mode
}
```

**Response**:
```typescript
{
  success: boolean;
  matchScore: number;        // 0-100
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  reorderedExperience: string[];
  error?: string;
}
```

**Implementation**:
- Validates request size
- Checks rate limit (per IP)
- Calls Gemini API with prompt
- Parses structured response
- Returns scored analysis

#### **POST /api/translate**

**Purpose**: Translate English text to Swahili with technical accuracy

**Request Body**:
```typescript
{
  text: string;              // English text to translate
  context?: string;          // Optional context
}
```

**Response**:
```typescript
{
  success: boolean;
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  error?: string;
}
```

**Implementation**:
- Validates text length
- Checks rate limit
- Calls Gemini with translation prompt
- Maintains terminology glossary
- Returns professional translation

---

## Content Management

### Content Structure: `portfolioData.ts`

This is the **single source of truth** for all portfolio content.

#### Profile Section
```typescript
profile: {
  firstName: "Brian",
  lastName: "Makhembu",
  location: "Nairobi, Kenya",
  education: "B.S. Computer Technology, JKUAT (2014-2018)",
  availability: "Available for Remote & Global Opportunities",
  variants: {
    it: {
      role: "Full-Stack Developer | AI/ML & Automation",
      tagline: "Full-Stack Web Developer | React, TypeScript, Node.js, Python",
      summary: "..."  // IT-specific summary
    },
    translation: {
      role: "Professional English-Swahili Linguist & Technical Translator",
      tagline: "Expert Technical Translator | Linguistics & Localization Specialist",
      summary: "..."  // Translation-specific summary
    }
  }
}
```

#### Projects Section
```typescript
projects: [
  {
    id: string;
    title: string;
    description: string;
    longDescription?: string;
    metrics?: { [key: string]: string | number };
    tags: string[];
    link?: string;
    githubUrl?: string;
    category: 'code' | 'translation' | 'infra' | 'both';
    imageUrl?: string;
    track: 'it' | 'translation' | 'both';  // Determines visibility
  }
]
```

#### Experience Section
```typescript
experience: [
  {
    id: string;
    company: string;
    role: string;
    period: string;
    description: string[];  // Array of bullet points
    skills: string[];
    track: 'it' | 'translation' | 'both';
  }
]
```

#### Skills Section
```typescript
skills: {
  it: {
    frontend: string[];     // React, Next.js, TypeScript, etc.
    backend: string[];      // Node.js, PostgreSQL, etc.
    infrastructure: string[]; // Linux, Docker, AWS, etc.
  },
  translation: {
    technical: string[];    // Technical translation expertise
    languages: string[];    // English, Swahili, etc.
    specializations: string[]; // Software localization, etc.
  }
}
```

#### Localization: UI Translations
```typescript
uiTranslations: {
  en: {
    navHome: "Home",
    navWork: "Projects",
    // ... 50+ UI strings
  },
  sw: {
    navHome: "Mwanzo",
    navWork: "Miradi",
    // ... Swahili equivalents
  }
}
```

### How Content is Used

1. **Hero Section**: Uses `profile.variants[track]` for role/tagline
2. **About Section**: Uses `profile.variants[track].summary` and detailed context
3. **Projects Grid**: Filters by `projects[].track` based on selected track
4. **Experience Timeline**: Filters by `experience[].track`
5. **Skills Display**: Uses `skills[track]` for relevant skills
6. **Navigation**: Uses `uiTranslations[lang]` for localized labels

---

## Styling & Theme System

### CSS Architecture

```
styles/
└── globals.css              # Tailwind + custom variables

Configuration:
- tailwind.config.js         # Tailwind CSS configuration
- postcss.config.mjs         # PostCSS pipeline
```

### Dark Mode Implementation

**Method**: Tailwind CSS with system preference detection

**Implementation**:
```css
/* In globals.css */
@layer base {
  :root {
    color-scheme: light dark;
  }
  
  @media (prefers-color-scheme: dark) {
    :root {
      /* Dark mode CSS variables */
    }
  }
}

/* Component usage */
<div className="bg-white dark:bg-slate-950">
  /* White in light mode, slate-950 in dark mode */
</div>
```

**Persistence**:
- localStorage saves user preference
- System preference is fallback
- Theme context provides toggle function

**Colors**:
- **Light**: White backgrounds, dark text
- **Dark**: Slate-950 backgrounds, light text
- **Accents**: Consistent across themes

### Component Styling Patterns

```typescript
// Example: Responsive + Dark Mode
<div className="
  px-4 sm:px-6 lg:px-8        // Responsive padding
  py-12 md:py-16              // Responsive vertical spacing
  bg-white dark:bg-slate-900  // Theme-aware background
  text-gray-900 dark:text-white // Theme-aware text
">
```

### Lucide Icons Integration

**Usage**: SVG icons from lucide-react package

```typescript
import { Menu, Moon, Globe, LogOut } from 'lucide-react';

<Menu className="w-6 h-6 text-gray-800 dark:text-white" />
```

**Advantages**:
- Lightweight (tree-shakeable)
- Consistent design
- Dark mode friendly
- Accessibility built-in

---

## SEO & Performance

### SEO Strategy

#### On-Page SEO

**Metadata** (from `seoDataRefactored.ts`):
```typescript
const baseSEO = {
  title: "Brian Makhembu - Full-Stack Engineer & Linguist",
  description: "Full-stack web developer & professional translator...",
  keywords: ["Next.js", "TypeScript", "React", ...],
  ogTitle: "...",
  ogDescription: "...",
  ogImage: "/og-image.jpg",
  author: "Brian Makhembu",
  publishedDate: "2024-01-01T00:00:00Z",
};
```

**Generated in Layout**:
- Dynamic title template
- Open Graph tags (Facebook/LinkedIn sharing)
- Twitter Card tags
- Canonical URL
- Robots meta tags
- Structured data (JSON-LD)

#### Structured Data

```typescript
// JSON-LD person schema
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Brian Makhembu",
  "url": "https://brianuche.dev",
  "sameAs": [
    "https://github.com/makhembu",
    "https://linkedin.com/in/brianmakhembu/"
  ],
  "jobTitle": "Full-Stack Software Engineer",
  "worksFor": {
    "@type": "Organization",
    "name": "Self-employed"
  }
};
```

#### Sitemap Generation

**File**: `app/sitemap.ts`

```typescript
export default async function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://brianuche.dev',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://brianuche.dev#projects',
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // ... more routes
  ];
}
```

**Robots.txt**: `app/robots.ts`

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: 'https://brianuche.dev/sitemap.xml',
  };
}
```

### Performance Optimizations

#### 1. **Server-Side Rendering (SSR)**
- Next.js default for optimal SEO
- Fast Time to First Byte (TTFB)
- Rich metadata injection

#### 2. **Incremental Static Regeneration (ISR)**
- Re-validate static content periodically
- Fresh content without rebuilds
- Fallback behavior for missing pages

#### 3. **Image Optimization**
- Sharp library for processing
- Responsive image sizes
- WebP format support

#### 4. **Code Splitting**
- Automatic route-based splitting
- Dynamic imports for large components
- Tree-shaking of unused code

#### 5. **Caching Strategy**
- Vercel Edge Cache
- Browser cache headers
- Consistent cache keys

#### 6. **Bundle Analysis**
- Next.js built-in bundle analyzer
- Identify large dependencies
- Optimize imports

---

## Deployment & Environment Configuration

### Environment Variables

**Public Variables** (exposed to browser):
```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://brianuche.dev
NEXT_PUBLIC_SITE_NAME=Brian Makhembu Portfolio
NEXT_PUBLIC_TWITTER_HANDLE=@brianuche

# Social Links
NEXT_PUBLIC_GITHUB_URL=https://github.com/makhembu
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/in/brianmakhembu/
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/brianuche

# Images
NEXT_PUBLIC_OG_IMAGE=/og-image.jpg
NEXT_PUBLIC_PROFILE_IMAGE=/profile-image.jpg
NEXT_PUBLIC_LOGO=/logo.jpg

# Feature Flags
NEXT_PUBLIC_OPTIMIZER_PRIVATE_MODE=false  # Enable private resume optimizer
```

**Private Variables** (server-only):
```bash
# API Keys (NEVER expose to client)
GEMINI_API_KEY=your-actual-key-here
NEXT_PUBLIC_GEMINI_API_KEY=key-if-needed  # Only if client-side needed

# Rate Limiting Config (optional)
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW_MS=60000
```

### Configuration Validation

**File**: `lib/config.ts`

```typescript
export const siteConfig = {
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://brianuche.dev',
  social: {
    github: process.env.NEXT_PUBLIC_GITHUB_URL || '...',
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || '...',
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || '...',
  },
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
};

export const validateConfig = () => {
  // Check required variables
  // Return errors if missing
  // Log warnings for optional vars
};
```

### Vercel Deployment

**Configuration**: `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "env": {
    "NEXT_PUBLIC_SITE_URL": "@site_url",
    "GEMINI_API_KEY": "@gemini_api_key"
  },
  "routes": [
    { "src": "/robots.txt", "dest": "/api/robots" },
    { "src": "/sitemap.xml", "dest": "/api/sitemap" },
    { "src": "/(.*)", "dest": "/" }
  ]
}
```

### Build & Deployment Scripts

```json
{
  "scripts": {
    "dev": "next dev",           // Local development
    "build": "next build",       // Production build
    "start": "next start",       // Production server
    "lint": "next lint"          // Code linting
  }
}
```

### Deployment Checklist

- [ ] Set environment variables in Vercel
- [ ] Ensure API keys are server-side only
- [ ] Enable cache headers
- [ ] Test SEO via lighthouse
- [ ] Verify sitemap.xml generation
- [ ] Check robots.txt blocking
- [ ] Validate all API endpoints
- [ ] Test dark mode switching
- [ ] Verify language switching
- [ ] Check mobile responsiveness
- [ ] Monitor performance metrics
- [ ] Set up error tracking

---

## Key Patterns & Best Practices

### 1. **Track-Based Filtering Pattern**

All content supports the `track` property:
- `'it'` - IT/Engineering specific
- `'translation'` - Translation/Localization specific
- `'both'` - Appears in both tracks

```typescript
// Filter function pattern
const filtered = data.filter(item =>
  item.track === 'both' || item.track === selectedTrack
);
```

### 2. **Bilingual Content Pattern**

All UI strings stored in `portfolioData.uiTranslations`:

```typescript
const text = t('navHome');  // Returns "Home" (en) or "Mwanzo" (sw)
```

### 3. **Context + Hook Pattern**

For global state:

```typescript
// Create context
export const MyContext = createContext<MyType>(defaultValue);

// Create custom hook
export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) throw new Error('useMyContext must be used within Provider');
  return context;
};

// Use in components
const { value, setValue } = useMyContext();
```

### 4. **Error Boundary Pattern**

Wrap risky components:

```typescript
<ErrorBoundary>
  <RiskyComponent />
</ErrorBoundary>
```

### 5. **Service Layer Pattern**

Separate business logic from components:

```typescript
// Service (lib/services/myService.ts)
export async function myBusinessLogic() { ... }

// Component uses service
import { myBusinessLogic } from '@/services/myService';
const result = await myBusinessLogic();
```

### 6. **API Rate Limiting Pattern**

Protect endpoints with rate limiting middleware:

```typescript
export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for');
  if (!checkRateLimit(ip, 'endpoint-name')) {
    return new Response('Too many requests', { status: 429 });
  }
  // ... API logic
}
```

---

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Common Tasks

#### Adding a New Project

1. Edit `portfolioData.ts`
2. Add entry to `projects` array:
   ```typescript
   {
     id: 'unique-id',
     title: 'Project Name',
     description: 'Short description',
     tags: ['tech1', 'tech2'],
     track: 'it',  // or 'translation', 'both'
     category: 'code',  // or 'infra', 'translation'
     // ... other fields
   }
   ```
3. Rebuild and verify in Projects section

#### Adding a New Experience Entry

1. Edit `portfolioData.ts`
2. Add to `experience` array:
   ```typescript
   {
     id: 'unique-id',
     company: 'Company Name',
     role: 'Job Title',
     period: '2020 - 2022',
     description: ['Bullet point 1', 'Bullet point 2'],
     skills: ['skill1', 'skill2'],
     track: 'it'  // or 'translation', 'both'
   }
   ```
3. Rebuild and verify in Experience section

#### Changing UI Copy

1. Edit `portfolioData.ts` → `uiTranslations`
2. Update both `en` and `sw` objects:
   ```typescript
   uiTranslations: {
     en: { myKey: "English text" },
     sw: { myKey: "Swahili text" }
   }
   ```
3. Use in component: `const text = t('myKey')`

#### Adding a New Feature

1. Create component in `components/`
2. Create service logic in `lib/` or `services/`
3. Create API route if needed in `app/api/`
4. Integrate into layout or existing component
5. Add translations to `uiTranslations`

---

## Performance Metrics

### Target Metrics

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **FCP** (First Contentful Paint): < 1.8s
- **TTFB** (Time to First Byte): < 0.6s

### Monitoring

Use Vercel Analytics:
- Real user monitoring
- Core Web Vitals tracking
- Performance dashboard

Use Google PageSpeed Insights:
- Desktop & mobile scores
- Opportunity identification
- Lab vs field data

---

## Security Considerations

### API Security
- ✅ Rate limiting per IP
- ✅ Request size validation
- ✅ Timeout enforcement
- ✅ No data persistence
- ✅ Error message sanitization

### Data Privacy
- ✅ No resume data stored
- ✅ No user tracking
- ✅ No cookies for analytics
- ✅ HTTPS enforced
- ✅ API keys server-side only

### Content Security
- ✅ No eval() or dangerous functions
- ✅ XSS protection via React
- ✅ CSRF tokens on forms
- ✅ Dependency scanning with npm audit

---

## Troubleshooting Guide

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Dark mode not working | CSS not loaded | Check globals.css import in layout |
| Track switching not working | Context not provided | Ensure TrackProvider wraps components |
| AI features return errors | Missing API key | Set GEMINI_API_KEY in .env.local |
| PDF generation fails | Missing dependencies | Run `npm install html-pdf-node` |
| Images not loading | Wrong path | Check public/ folder and imageUrl fields |
| Build errors | TypeScript issues | Run `npm run build` to see full errors |

---

## Summary

This portfolio system is a **production-ready, feature-rich application** that:

✅ **Showcases dual expertise** with track-based filtering (IT & Translation)
✅ **Implements ethical AI** with rate limiting and safety constraints
✅ **Supports global reach** with bilingual UI (English & Swahili)
✅ **Optimizes for hiring** with ATS-friendly resumes and job matching
✅ **Ensures accessibility** with dark mode and responsive design
✅ **Performs excellently** with Next.js SSR and edge caching
✅ **Maintains quality** with TypeScript, error boundaries, and validation

The architecture is modular, scalable, and maintainable—perfect for a professional who wants to showcase both engineering prowess and linguistic expertise.

---

**For Questions or Updates**: Edit `portfolioData.ts` as the single source of truth, and the entire system automatically reflects your changes.
