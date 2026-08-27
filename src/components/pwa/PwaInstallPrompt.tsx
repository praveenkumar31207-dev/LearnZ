'use client';

import React, { useState, useEffect } from 'react';
import { Download, Sparkles, X, Smartphone, CheckCircle2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('CogniStudy PWA Service Worker Registered:', reg.scope);
        })
        .catch((err) => {
          console.warn('PWA Service Worker Registration Failed:', err);
        });
    }

    // 2. Check if already running in standalone mode (installed PWA)
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
    }

    // 3. Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt if not dismissed previously
      const dismissed = localStorage.getItem('cognistudy_pwa_dismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. Online/Offline status detection
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback for browsers that don't support beforeinstallprompt (e.g. iOS Safari)
      alert(
        'To install on iPhone/iPad:\n1. Tap the Share button at the bottom of Safari (square with arrow up)\n2. Select "Add to Home Screen"'
      );
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('cognistudy_pwa_dismissed', 'true');
  };

  if (isInstalled) return null;

  return (
    <>
      {/* Offline Status Badge */}
      {isOffline && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-amber-500 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-2 animate-bounce">
          <span>⚡ You are currently working offline (Cached data active)</span>
        </div>
      )}

      {/* Floating Bottom PWA Install Banner */}
      {showPrompt && (
        <div className="fixed bottom-5 right-5 left-5 sm:left-auto sm:w-[420px] z-50 p-4 rounded-3xl bg-slate-900 text-white border-2 border-indigo-500/40 shadow-2xl shadow-indigo-950/80 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-teal-400 p-0.5 shrink-0 shadow-md">
                <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-indigo-400" />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Install CogniStudy App
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/40">
                    PWA
                  </span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Install to your home screen for instant offline access, fullscreen focus timer, and faster load times!
                </p>

                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={handleInstallClick}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/40 transition-all hover:scale-105"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install App</span>
                  </button>

                  <button
                    onClick={handleDismiss}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
