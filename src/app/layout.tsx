'use client';

import React, { useState } from 'react';
import './globals.css';
import { AuthProvider } from '@/lib/authContext';
import { AppProvider } from '@/lib/store';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <html lang="en" className="h-full">
      <head>
        <title>CogniStudy — Intelligent AI Study Planner & Learning Tracker</title>
        <meta
          name="description"
          content="Continuous adaptive AI study management system that analyzes progress and dynamically reschedules in real time."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-full flex flex-col bg-slate-100/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
        <AuthProvider>
          <AppProvider>
            <div className="flex flex-col min-h-screen">
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
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
