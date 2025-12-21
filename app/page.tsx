'use client';

import React from 'react';
import { Navbar } from '@/components/NavbarClient';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Projects } from '@/components/Projects';
import { Experience } from '@/components/Experience';
import { AIHub } from '@/components/AIHub';
import { ResumeSection } from '@/components/ResumeSection';
import { Footer } from '@/components/Footer';
import { ErrorBoundary } from '@/components/ErrorBoundary';

/**
 * Home Page - Main portfolio page with all sections
 * Displays the hero section, about, projects, experience, and AI hub
 */
export default function HomePage() {
  return (
    <ErrorBoundary>
      <Navbar />
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
          <section id="experience">
            <Experience />
          </section>
          <section id="ai">
            <AIHub />
          </section>
          <section id="resume">
            <ResumeSection />
          </section>
        </ErrorBoundary>
      </main>
      <Footer />
    </ErrorBoundary>
  );
}
