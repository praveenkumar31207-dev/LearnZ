'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  RotateCcw,
  Bot,
  Layers,
  Target,
  Compass,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  TrendingUp,
  Brain,
  Send,
  MessageSquare,
  HelpCircle,
  FileText,
  ArrowRight,
} from 'lucide-react';

const SOCRATIC_DEMOS = [
  {
    topic: 'Computer Science',
    question: 'How do B-Trees optimize disk I/O compared to Binary Search Trees?',
    tutorName: 'Alan (Algorithms Mentor)',
    response:
      'Great question! Let’s think from first principles: A standard Binary Search Tree has branching factor 2, which creates a very deep tree. When data lives on physical disk or SSD, random block reads are very slow compared to sequential memory access.\n\nWhat happens if we increase the branching factor to 1,000 nodes per block? Each node read now loads an entire disk page into cache at once, shrinking tree depth from 30 levels down to just 3! Which operations would benefit most from this shallow depth?',
  },
  {
    topic: 'Medicine & Biology',
    question: 'Why does severe hyperkalemia cause cardiac arrest?',
    tutorName: 'Dr. Rosalind (Biochemistry)',
    response:
      'Let’s trace the resting membrane potential! Normal extracellular potassium is low (3.5–5.0 mEq/L). When extracellular K+ spikes, the chemical gradient for K+ efflux decreases according to the Nernst equation.\n\nThis partially depolarizes the resting myocardial cell membrane. Initially this sounds excitable, but what happens to the voltage-gated Na+ channels when the resting membrane remains continuously depolarized? (Hint: Think inactivation gates!)',
  },
  {
    topic: 'Physics & Engineering',
    question: 'Why can’t a heat engine achieve 100% Carnot efficiency?',
    tutorName: 'Prof. Richard (Thermodynamics)',
    response:
      'Consider the Second Law of Thermodynamics and the Kelvin-Planck statement: For a continuous cycle to perform net mechanical work, heat must be absorbed from a high-temperature reservoir and SOME heat MUST be rejected to a low-temperature sink.\n\nTo reach 100% efficiency, what would the cold sink temperature (T_cold) have to be in Kelvin? Is that attainable in the real universe?',
  },
  {
    topic: 'Law & Jurisprudence',
    question: 'What separates Strict Liability from Negligence in Tort law?',
    tutorName: 'Justice Elena (Legal Theory)',
    response:
      'In a traditional negligence claim, the plaintiff must prove the defendant breached a "duty of reasonable care" (fault-based liability).\n\nIn strict liability (e.g., abnormally dangerous activities, wild animal keeping, manufacturing defects), the law shifts the cost of harm to the actor regardless of how much care was exercised. Why do you think policy makers designed this risk-allocation rule for ultra-hazardous activities?',
  },
];

export const FeatureDeepDives: React.FC = () => {
  // Spaced Repetition Interactive Slider State
  const [spacedDay, setSpacedDay] = useState<number>(7);

  // Socratic Demo Active Tab
  const [activeTutorIndex, setActiveTutorIndex] = useState<number>(0);
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'user', text: SOCRATIC_DEMOS[0].question },
    { sender: 'ai', text: SOCRATIC_DEMOS[0].response },
  ]);
  const [customInput, setCustomInput] = useState('');

  const handleTutorChange = (index: number) => {
    setActiveTutorIndex(index);
    setChatMessages([
      { sender: 'user', text: SOCRATIC_DEMOS[index].question },
      { sender: 'ai', text: SOCRATIC_DEMOS[index].response },
    ]);
  };

  const handleSendCustomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const userText = customInput;
    setCustomInput('');
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText },
      {
        sender: 'ai',
        text: `That is an insightful angle on "${userText}". Let’s break it into core assumptions. If you examine the primary constraint, what would happen if the boundary condition fails?`,
      },
    ]);
  };

  // Retention calculation based on day
  const withoutRevisionRetention = Math.max(15, Math.round(100 / (1 + 0.5 * spacedDay)));
  const withCogniStudyRetention = Math.min(98, Math.round(100 - (spacedDay > 14 ? 6 : 2)));

  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            The 5 Cognitive Pillars
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Engineered for Unmatched Retention & Academic Agility
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            CogniStudy unites cognitive psychology principles (Ebbinghaus Forgetting Curve, Active Recall) with real-time algorithmic rescheduling and 24/7 Socratic mentors.
          </p>
        </div>

        {/* Pillar 1: Dynamic Continuous Rescheduling */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Pillar 1 • Autonomous Adaptability
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
                Never Fall Behind. Never Feel Backlog Guilt.
              </h3>
            </div>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              When unexpected assignments, social events, or illness disrupt your study routine, traditional calendars turn into an intimidating mountain of overdue red tasks.
            </p>
            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-teal-400 mt-1 shrink-0" />
                <span>
                  <strong>Buffer Slot Absorption:</strong> Auto-allocates non-cramming weekend catch-up zones without overloading your weekdays.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-teal-400 mt-1 shrink-0" />
                <span>
                  <strong>Dynamic Difficulty Multipliers:</strong> Topics with low user confidence receive 1.4x higher weightage and earlier review slots.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-teal-400 mt-1 shrink-0" />
                <span>
                  <strong>1-Click Undo Reschedule:</strong> Full transparency with explanatory audit logs showing why each session was re-timed.
                </span>
              </div>
            </div>
            <Link
              href="/schedule"
              className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300"
            >
              <span>Explore Adaptive Calendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="lg:col-span-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Real-Time Reschedule Logic Flow
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Auto-Optimizing
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">
                    1. Trigger Event Detected
                  </div>
                  <p className="text-slate-200">
                    Student paused session on <strong>"Operating Systems: Deadlock Avoidance"</strong> after 30m due to high complexity.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-900/60 space-y-1">
                  <div className="text-[10px] text-indigo-400 uppercase font-bold">
                    2. Cognitive Engine Evaluation
                  </div>
                  <p className="text-slate-200">
                    Remaining duration (45m) split into 2 micro-sessions + paired with Socratic AI Tutor drill.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-teal-950/40 border border-teal-900/60 space-y-1">
                  <div className="text-[10px] text-teal-400 uppercase font-bold">
                    3. Balanced Output
                  </div>
                  <p className="text-slate-200">
                    Next 3 days adjusted. Low-yield review deferred. Target exam readiness maintained at 98%.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 2: Spaced Repetition Retention Curve Interactive Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 lg:order-2 space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Brain className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                Pillar 2 • Memory Science
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
                Beat the Ebbinghaus Forgetting Curve Automatically.
              </h3>
            </div>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Without scheduled review, human memory loses up to 80% of newly learned facts within 7 days. CogniStudy injects automated flash-reviews at optimal mathematical intervals: Day 1, Day 3, Day 7, Day 14, and Day 30.
            </p>
            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-teal-400 mt-1 shrink-0" />
                <span>
                  <strong>Zero Manual Card Scheduling:</strong> The system extracts revision tasks automatically as you complete syllabus chapters.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-teal-400 mt-1 shrink-0" />
                <span>
                  <strong>Confidence-Rated Intervals:</strong> Rate your recall from 1 (Struggled) to 5 (Mastered) to dynamically contract or expand revision spacing.
                </span>
              </div>
            </div>
            <Link
              href="/revisions"
              className="inline-flex items-center gap-2 text-xs font-bold text-teal-400 hover:text-teal-300"
            >
              <span>View Spaced Revisions Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="lg:col-span-6 lg:order-1">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-teal-400" />
                  Interactive Memory Retention Visualizer
                </span>
                <span className="text-xs font-mono text-teal-400 font-bold">
                  Day {spacedDay} Post-Learning
                </span>
              </div>

              {/* Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Days Passed Since First Lecture:</span>
                  <span className="text-white font-bold">{spacedDay} Days</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={spacedDay}
                  onChange={(e) => setSpacedDay(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Day 1</span>
                  <span>Day 7 (Drop Peak)</span>
                  <span>Day 14</span>
                  <span>Day 30 (Mastery)</span>
                </div>
              </div>

              {/* Comparison Bars */}
              <div className="space-y-4 pt-2">
                {/* Traditional Cramming Decay */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                      ❌ Without Spaced Repetition (Cramming)
                    </span>
                    <span className="font-mono font-bold text-rose-400">
                      {withoutRevisionRetention}% Retained
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-300"
                      style={{ width: `${withoutRevisionRetention}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {withoutRevisionRetention < 30
                      ? 'Severe memory degradation. Requires re-learning almost the entire topic before exams.'
                      : 'Rapid forgetting underway.'}
                  </p>
                </div>

                {/* CogniStudy Spaced Curve */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-teal-400 font-semibold flex items-center gap-1.5">
                      ✅ With CogniStudy Adaptive Spaced Intervals
                    </span>
                    <span className="font-mono font-bold text-teal-400">
                      {withCogniStudyRetention}% Retained
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-indigo-500 transition-all duration-300"
                      style={{ width: `${withCogniStudyRetention}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Automated micro-retrieval checkpoints solidify knowledge into long-term neural recall.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 3: Interactive Live Socratic AI Tutor Demo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Bot className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                Pillar 3 • 24/7 AI Socratic Mentorship
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
                Learn By Reasoning, Not Just Copy-Pasting.
              </h3>
            </div>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Most generic chatbots just regurgitate raw answers, depriving students of deep synthesis. CogniStudy AI Tutors use the Socratic method—guiding you step-by-step through first principles until you reach the breakthrough yourself.
            </p>

            {/* Persona Chips */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Choose Subject Persona for Live Demo:
              </span>
              <div className="flex flex-wrap gap-2">
                {SOCRATIC_DEMOS.map((demo, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleTutorChange(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      activeTutorIndex === idx
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {demo.topic}
                  </button>
                ))}
              </div>
            </div>

            <Link
              href="/tutors"
              className="inline-flex items-center gap-2 text-xs font-bold text-purple-400 hover:text-purple-300"
            >
              <span>Explore AI Tutors in App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-slate-950/95 border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[460px]">
              {/* Tutor Header */}
              <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {SOCRATIC_DEMOS[activeTutorIndex].tutorName}
                    </h4>
                    <span className="text-[10px] text-teal-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                      Socratic Active Listening Mode
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded-full bg-slate-800">
                  {SOCRATIC_DEMOS[activeTutorIndex].topic}
                </span>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input Box */}
              <form
                onSubmit={handleSendCustomMessage}
                className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Ask a follow-up doubt or reply to the tutor..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Pillars 4 & 5 Grid: Syllabus Breakdown & Exam War-Room */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pillar 4: Syllabus & Weightage Tree */}
          <div className="p-8 rounded-3xl bg-slate-950/90 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
              Pillar 4 • Hierarchical Knowledge Trees
            </span>
            <h4 className="text-xl font-bold text-white">
              Smart Syllabus Parsing & Weightage Mapping
            </h4>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Upload your syllabus or paste your lecture list. CogniStudy extracts modular sub-topics, associates historical exam weightage percentages, and tracks your master completion rate node-by-node.
            </p>
            <div className="pt-2">
              <Link
                href="/subjects"
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>Manage Subjects & Syllabi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Pillar 5: Exam War-Room */}
          <div className="p-8 rounded-3xl bg-slate-950/90 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 block">
              Pillar 5 • Exam Countdown Strategy
            </span>
            <h4 className="text-xl font-bold text-white">
              Exam War-Room & Burn-Down Tracker
            </h4>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              When finals approach, generic study plans fail because every hour counts. War-Room mode re-ranks your entire curriculum, directing 80% of your focus to high-yield weak topics for maximum GPA boost.
            </p>
            <div className="pt-2">
              <Link
                href="/exams"
                className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
              >
                <span>Enter Exam War-Room</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
