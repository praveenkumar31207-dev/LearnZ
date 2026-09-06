'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

const FAQS = [
  {
    question: 'How does the Autonomous Dynamic Reschedule Engine work when I miss a study block?',
    answer:
      'Unlike static calendar apps that simply flag tasks as red/overdue, CogniStudy evaluates your entire remaining syllabus, exam deadlines, and daily maximum study capacities. It dynamically routes missed content into low-intensity buffer zones or splits long chapters into manageable micro-sessions, ensuring you hit 100% exam readiness without cramming overload.',
  },
  {
    question: 'Can I install and use CogniStudy completely offline without an active internet connection?',
    answer:
      'Yes! CogniStudy is built as a modern Progressive Web App (PWA). You can install it on iOS Safari (Add to Home Screen), Android Chrome, macOS, and Windows. All timetable state, syllabus trees, and focus timers are cached locally in your browser storage. When you reconnect to Wi-Fi, changes synchronize automatically with your Supabase cloud profile.',
  },
  {
    question: 'How does CogniStudy Spaced Repetition work with my actual university course curriculum?',
    answer:
      'As you complete lectures or mark syllabus topics as understood, CogniStudy automatically schedules active recall checkpoints along the Ebbinghaus forgetting curve: Day 1, Day 3, Day 7, Day 14, and Day 30. Your confidence rating (1 to 5) after each revision dynamically adjusts future spacing.',
  },
  {
    question: 'What makes the AI Tutors "Socratic" rather than standard chatbots?',
    answer:
      'Standard AI chatbots often output immediate complete answers, which gives students a false sense of fluency without building deep neural pathways. CogniStudy Socratic Tutors ask guiding questions, verify edge cases, and prompt you to derive equations and debug logic from first principles.',
  },
  {
    question: 'How do I synchronize my schedule across multiple devices (Laptop + Phone)?',
    answer:
      'You can create a free account with your email. CogniStudy connects to Supabase database tables for instant multi-device synchronization. If you prefer zero cloud accounts, you can also use guest demo mode with 100% local persistence.',
  },
  {
    question: 'Can I customize subject weightages, exam dates, and daily study caps?',
    answer:
      'Absolutely. Under Settings & Onboarding, you can adjust your target GPA, daily available hours, chronotype focus windows (Morning, Afternoon, Night Owl), and customize chapter weightage percentages for every subject.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            Clear Answers
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Everything you need to know about CogniStudy's adaptive algorithms, offline sync, and cognitive science foundation.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all ${
                  isOpen
                    ? 'bg-slate-950 border-indigo-500/50 shadow-lg shadow-indigo-950/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-white leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-400 border-indigo-500/40' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-4 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
