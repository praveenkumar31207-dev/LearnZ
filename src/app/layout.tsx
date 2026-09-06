'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import './globals.css';
import { AuthProvider } from '@/lib/authContext';
import { AppProvider } from '@/lib/store';
import { ThemeProvider } from '@/lib/themeContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { PwaInstallPrompt } from '@/components/pwa/PwaInstallPrompt';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLandingPage = pathname === '/' || pathname === '/landing';
  const isAuthOrOnboarding =
    pathname.startsWith('/auth') || pathname === '/onboarding';

  return (
    <html lang="en" className="h-full">
      <head>
        <title>AI-Enabled Skill Intelligence & Learning Platform | India's Official Statistical System</title>
        <meta
          name="description"
          content="Personalized Competency Development for India's Official Statistical System. Integrated with iGOT Karmayogi and NSSTA to identify skill gaps and generate validated AI assessments."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />

        {/* PWA & Mobile Web App Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1d4ed8" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Skill Intelligence" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <link rel="icon" type="image/svg+xml" href="/icons/icon-192x192.svg" />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white">
        <ThemeProvider>
          <AuthProvider>
            <AppProvider>
            {isLandingPage ? (
              // Full-width Layout for Landing Showcase
              <main className="w-full min-h-screen flex-1">
                {children}
              </main>
            ) : isAuthOrOnboarding ? (
              // Focused Container for Auth & Onboarding Flows
              <div className="min-h-screen flex flex-col bg-slate-100/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
                <main className="flex-1 w-full flex items-center justify-center p-4">
                  {children}
                </main>
              </div>
            ) : (
              // Full Workspace Layout with Sidebar & Official Navbar
              <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
                <Navbar onMobileMenuToggle={() => setMobileMenuOpen(true)} />
                <div className="flex flex-1">
                  <Sidebar
                    mobileOpen={mobileMenuOpen}
                    onMobileClose={() => setMobileMenuOpen(false)}
                  />
                  <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    {children}
                  </main>
                </div>
              </div>
            )}
            {/* PWA Floating Install Prompt & Offline Detector */}
            <PwaInstallPrompt />
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
      </body>
    </html>
  );
}
