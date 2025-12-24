'use client';

import React from 'react';
import { Navbar } from '@/components/NavbarClient';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Projects } from '@/components/Projects';
import { Experience } from '@/components/Experience';
import { ResumeSection } from '@/components/ResumeSection';
import { Footer } from '@/components/Footer';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AIHubFAB } from '@/components/AIHubFAB';

/**
 * Home Page - Main portfolio page with all sections
 * CLIENT COMPONENT - Required due to client-dependent components (context, ErrorBoundary class component)
 * Displays the hero section, about, projects, experience with error boundaries and context access
 */
export default function HomePage() {
  return (
    <ErrorBoundary>
      <Navbar />
      <AIHubFAB />
      <main className="animate-in fade-in slide-in-from-bottom-2 duration-500 pt-12 min-h-[calc(100vh-80px)]">
        <ErrorBoundary>
          <section id="home">
            <Hero />
          </section>
          <section id="about">
            <About />
          </section>
          <section id="projects">
            <Projects />
          </section>
          <section id="resume">
            <ResumeSection />
          </section>
          <section id="experience">
            <Experience />
          </section>
        </ErrorBoundary>
      </main>
      <Footer />
    </ErrorBoundary>
  );
}
