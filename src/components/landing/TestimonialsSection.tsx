'use client';

import React from 'react';
import { Star, GraduationCap, Quote, Sparkles, CheckCircle2 } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Dev Agarwal',
    degree: 'B.Tech Computer Science (Sem 4)',
    university: 'IIT Delhi',
    avatar: '💻',
    stars: 5,
    gpaChange: '3.2 ➔ 3.9 GPA',
    quote:
      'Before CogniStudy, skipping one 2-hour DSA lecture would throw my entire month off track. The dynamic catch-up engine re-balances everything into low-intensity buffer slots automatically. Zero backlog anxiety.',
  },
  {
    name: 'Maya Patel',
    degree: 'Pre-Med & Cellular Biology',
    university: 'Johns Hopkins University',
    avatar: '🩺',
    stars: 5,
    gpaChange: 'Top 5% Class Rank',
    quote:
      'The spaced repetition curve for pharmacology and human anatomy is uncanny. The Socratic AI tutor walked me through the cardiac membrane action potential from first principles instead of spoon-feeding me.',
  },
  {
    name: 'Marcus Vance',
    degree: 'Law / Jurisprudence (Year 3)',
    university: 'Oxford University',
    avatar: '⚖️',
    stars: 5,
    gpaChange: 'First Class Honours',
    quote:
      'The Exam War-Room countdown mode gave me crystal clarity. It re-ordered my entire syllabus by historical case law weightage 3 weeks before finals so I focused 80% of my time where it actually counted.',
  },
  {
    name: 'Elena Rostova',
    degree: 'Robotics & Control Systems Eng.',
    university: 'ETH Zürich',
    avatar: '📐',
    stars: 5,
    gpaChange: '+14 hrs saved / wk',
    quote:
      'The PWA works completely offline on my tablet in the library basement. As soon as I get home, it synchronizes my focus logs and XP progression seamlessly. Easily the best academic tool I have used.',
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-teal-400" />
            Student Proven Results
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Loved by 12,000+ High-Achieving Students
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            See how undergraduates, medical scholars, and engineering candidates transformed their daily study habits and GPA scores.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="p-7 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-xl flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all hover:scale-[1.01]"
            >
              <div className="space-y-4">
                {/* Top Rating & GPA Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(t.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">
                    {t.gpaChange}
                  </span>
                </div>

                {/* Quote */}
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              {/* Student Profile Footer */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{t.avatar}</span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                      {t.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">{t.degree}</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-slate-400 font-mono">
                  {t.university}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
