import type { Metadata, Viewport } from 'next';
import { AppContextProvider, TrackProvider, ResumeProvider } from '@/lib/contexts';
import { generateNextMetadata, getPersonSchema } from '@/lib/seoUtils';
import { baseSEO, personSchema } from '@/seoDataRefactored';
import { siteConfig } from '@/lib/config';
import '@/styles/globals.css';

// Generate comprehensive SEO metadata
const seoMetadata = generateNextMetadata(baseSEO, '/');

export const metadata: Metadata = {
  ...seoMetadata,
  title: {
    default: baseSEO.title,
    template: '%s | Brian Makhembu',
  },
  description: baseSEO.description,
  keywords: baseSEO.keywords,
  authors: [{ name: 'Brian Makhembu' }],
  creator: 'Brian Makhembu',
  publisher: 'Brian Makhembu',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: siteConfig.baseUrl,
  },
  verification: {
    // Add your verification codes here
    // google: 'google-site-verification-code',
  },
  metadataBase: new URL(siteConfig.baseUrl),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.baseUrl,
    siteName: 'Brian Makhembu Portfolio',
    title: baseSEO.ogTitle || baseSEO.title,
    description: baseSEO.ogDescription || baseSEO.description,
    images: [
      {
        url: baseSEO.ogImage || '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Brian Makhembu - Full-Stack Engineer & UX Strategist',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@brianuche',
    creator: '@brianuche',
    title: baseSEO.title,
    description: baseSEO.description,
    images: [baseSEO.ogImage || '/og-image.jpg'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        {/* Theme initialization script - runs before React hydration to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  let isDark = false;
                  
                  if (savedTheme) {
                    isDark = savedTheme === 'dark';
                  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    isDark = true;
                  }
                  
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              darkMode: 'class',
              theme: {
                extend: {
                  fontFamily: {
                    sans: ['Inter', 'sans-serif'],
                    display: ['Space Grotesk', 'sans-serif'],
                  },
                }
              }
            }
          `
        }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
        />
        
        {/* Additional SEO meta tags */}
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        
        {/* Google verification (add your code) */}
        {/* <meta name="google-site-verification" content="your-verification-code" /> */}
        
        {/* Sitemap and RSS */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        
        {/* Alternate language links for international SEO */}
        <link rel="alternate" hrefLang="en-US" href={siteConfig.baseUrl} />
        <link rel="alternate" hrefLang="sw-KE" href={`${siteConfig.baseUrl}/sw`} />
        
        <style dangerouslySetInnerHTML={{
          __html: `
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            .glass { backdrop-filter: blur(12px); }
            
            @media print {
              .print\\:hidden {
                display: none;
              }
            }
          `
        }} />
      </head>
      <body className="bg-white dark:bg-[#0a0a0b] text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <TrackProvider>
          <AppContextProvider>
            <ResumeProvider>
              {children}
            </ResumeProvider>
          </AppContextProvider>
        </TrackProvider>
      </body>
    </html>
  );
}
