'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import {
  Bot,
  Send,
  Sparkles,
  Plus,
  HelpCircle,
  Zap,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  Building2,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { AITutor } from '@/types';

export default function TutorsPage() {
  const { aiTutors, addCustomTutor, subjects, userTrack } = useAppStore();

  const isLearner = userTrack === 'learner';

  // Sort tutors: exam-core tutors first for exam_prep/student track, algo-first for learner
  const sortedTutors = [...aiTutors].sort((a, b) => {
    if (isLearner) {
      const learnerPriority = ['assistant-dsa-expert', 'assistant-exam-mentor', 'assistant-sys-tutor', 'assistant-db-master'];
      return learnerPriority.indexOf(a.id) - learnerPriority.indexOf(b.id);
    } else {
      const examPriority = ['assistant-exam-mentor', 'assistant-sys-tutor', 'assistant-dsa-expert', 'assistant-db-master'];
      return examPriority.indexOf(a.id) - examPriority.indexOf(b.id);
    }
  });

  const [selectedTutorId, setSelectedTutorId] = useState(sortedTutors[0]?.id || aiTutors[0]?.id || '');
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Custom Assistant Form
  const [customName, setCustomName] = useState('');
  const [customEmoji, setCustomEmoji] = useState(isLearner ? '⚡' : '🎓');
  const [customPersonality, setCustomPersonality] = useState(isLearner ? 'Problem-Solver & Code Mentor' : 'Structured & Exam-Centric');
  const [customPrompt, setCustomPrompt] = useState('');

  const activeTutor = sortedTutors.find((t) => t.id === selectedTutorId) || sortedTutors[0] || aiTutors[0];

  const getInitialGreeting = () => {
    if (activeTutor?.id === 'assistant-exam-mentor') {
      return `Hey! I'm **${activeTutor?.name}** 🎓\n\nI'm your all-round semester exam coach. Ask me to explain any concept, structure a 10-marker answer, solve PYQs, or give you a rapid revision summary for your next exam.\n\nWhich subject or topic do you want to tackle today?`;
    }
    if (activeTutor?.id === 'assistant-sys-tutor') {
      return `Hello! I'm **${activeTutor?.name}** 🖥️\n\nI specialise in **Operating Systems** (scheduling, paging, deadlocks) and **Computer Networks** (OSI/TCP-IP, subnetting, sliding window). Drop a numerical or theory doubt and I'll walk you through it step-by-step.\n\nWhat concept or problem should we crack first?`;
    }
    if (activeTutor?.id === 'assistant-dsa-expert') {
      return `Hey! I'm **${activeTutor?.name}** ⚡\n\nI'll help you master Data Structures & Algorithms — Big-O analysis, C++/Java implementations, lab practicals, and university viva questions.\n\nWhich algorithm, data structure, or coding problem would you like to conquer today?`;
    }
    if (activeTutor?.id === 'assistant-db-master') {
      return `Welcome! I'm **${activeTutor?.name}** 🗄️\n\nI specialise in **DBMS** — normalization (1NF→BCNF), relational algebra, complex SQL queries, B+ trees, and concurrency control.\n\nAsk me a numerical, theory question, or paste your SQL query and I'll debug it!`;
    }
    return `Hello! I'm **${activeTutor?.name}** 🎓\n\nI'm here to help you ace your university semester exams. Ask me any concept, PYQ, or doubt!\n\nWhat would you like to study today?`;
  };

  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content: getInitialGreeting(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const getQuickPrompts = () => {
    if (activeTutor?.id === 'assistant-exam-mentor') {
      return [
        'Write a 10-marker answer on the differences between process scheduling algorithms with examples.',
        'Explain virtual memory and demand paging with a diagram for my OS exam.',
        'Give me 5 important PYQs from Computer Networks with model answers.',
        'Summarise the key differences between TCP and UDP in 2 minutes for quick revision.',
      ];
    }
    if (activeTutor?.id === 'assistant-sys-tutor') {
      return [
        "Solve a Banker's Algorithm safety sequence problem step-by-step.",
        'Calculate Effective Access Time (EAT) with TLB hit rate 90% and given access times.',
        'Explain CIDR subnetting and solve: divide 192.168.1.0/24 into 4 equal subnets.',
        'Compare OSI vs TCP/IP model with a clean table for my exam answer.',
      ];
    }
    if (activeTutor?.id === 'assistant-dsa-expert') {
      return [
        'Explain how to solve Two Sum in O(N) using a Hash Map with a visual walkthrough.',
        "How does Dijkstra's algorithm find shortest paths using a Min-Heap priority queue?",
        'Walk through the 0/1 Knapsack DP state transition and space optimisation to O(W).',
        'Compare BFS vs DFS for finding connected components and detecting cycles in a graph.',
      ];
    }
    if (activeTutor?.id === 'assistant-db-master') {
      return [
        'Explain 1NF, 2NF, 3NF, and BCNF with an example relation and step-by-step decomposition.',
        'Write a SQL query with GROUP BY, HAVING, and a subquery for the student database.',
        'Prove lossless join decomposition for a given set of functional dependencies.',
        'Explain B+ Tree insertion with an example — how pages split at order 3.',
      ];
    }
    return [
      'Explain the most important concepts I need to know for my upcoming semester exam.',
      'Give me a 10-marker question and model answer from core computer science.',
      'What are the most common mistakes students make in university exams?',
      'Create a quick 5-point revision checklist for any topic I tell you.',
    ];
  };

  const quickPrompts = getQuickPrompts();

  const handleSendMessage = async (customText?: string) => {
    const query = customText || input;
    if (!query.trim() || loading) return;

    const newMessages = [...messages, { role: 'user' as const, content: query }];
    setMessages(newMessages);
    if (!customText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/tutor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          tutorName: activeTutor.name,
          personality: activeTutor.personality,
          systemPrompt: activeTutor.systemPrompt,
          topicContext: activeTutor.domainFocus || 'University Semester Exam Preparation',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.reply || 'Let me know if you need more clarity on this topic!' },
        ]);
      }
    } catch (err) {
      console.warn('Exam tutor chat error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomTutor = () => {
    if (!customName.trim()) return;
    addCustomTutor({
      name: customName,
      avatarEmoji: customEmoji,
      personality: customPersonality,
      systemPrompt:
        customPrompt ||
        `You are ${customName}, a specialized AI semester exam mentor for engineering students. Ground all replies in university syllabi, standard reference textbooks (Tanenbaum, Galvin, Korth, Cormen), and NPTEL course notes.`,
      isDefault: false,
      domainFocus: 'Operating Systems & Systems',
    });
    setCustomName('');
    setShowCustomModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              isLearner
                ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300'
                : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
            }`}>
              {isLearner ? 'Computer Science & AI Mentors' : 'Semester Exam AI Mentors'}
            </span>
            <span className="text-xs text-slate-400">
              {isLearner ? 'LeetCode, System Design & Full-Stack' : 'Grounded in University Syllabus & NPTEL Modules'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1 flex items-center gap-2.5">
            <Bot className={`w-7 h-7 ${isLearner ? 'text-indigo-600 dark:text-indigo-400' : 'text-blue-700 dark:text-blue-400'}`} />
            {isLearner ? 'AI Coding & Computer Science Mentors' : 'AI Semester Exam Mentor (ExamBot)'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {isLearner
              ? 'Real-time conversational mentor for DSA, algorithmic problem-solving, React/Next.js architecture, and clean code'
              : 'Real-time conversational mentor for semester exams, university syllabus, coding, and NPTEL modules'}
          </p>
        </div>

        <button
          onClick={() => setShowCustomModal(true)}
          className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-white text-xs font-bold shadow-sm transition-all ${
            isLearner
              ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/25'
              : 'bg-blue-700 hover:bg-blue-600 shadow-blue-700/25'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>{isLearner ? 'Add Custom AI Persona' : 'Add Custom Exam Tutor'}</span>
        </button>
      </div>

      {/* Assistant Selection Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
        {sortedTutors.map((tutor) => {
          const isSelected = tutor.id === activeTutor?.id;
          return (
            <button
              key={tutor.id}
              onClick={() => {
                setSelectedTutorId(tutor.id);
                setMessages([
                  {
                    role: 'assistant',
                    content: tutor.id === 'assistant-exam-mentor'
                      ? `Hey! I'm **${tutor.name}** 🎓. I'm your all-round semester exam coach — PYQs, 10-marker answers, rapid revision, you name it!`
                      : tutor.id === 'assistant-sys-tutor'
                      ? `Hello! I'm **${tutor.name}** 🖥️. Ready to solve OS scheduling, paging numericals, subnetting problems, and CN theory questions!`
                      : tutor.id === 'assistant-dsa-expert'
                      ? `Hey! I'm **${tutor.name}** ⚡. Let's crush DSA — algorithms, Big-O, C++/Java lab code, and university exam patterns!`
                      : tutor.id === 'assistant-db-master'
                      ? `Welcome! I'm **${tutor.name}** 🗄️. Let's master DBMS — normalization, SQL, relational algebra, B+ trees!`
                      : `Hello! I'm **${tutor.name}**. I specialise in **${tutor.domainFocus || 'University Exam Preparation'}**. What would you like to study?`,
                  },
                ]);
              }}
              className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                isSelected
                  ? isLearner
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-blue-700 text-white shadow-md shadow-blue-700/30'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <span>{tutor.avatarEmoji}</span>
              <span>{tutor.name}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Container */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col h-[590px]">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-xl shrink-0">
              {activeTutor?.avatarEmoji}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {activeTutor?.name}
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700">
                  {activeTutor?.domainFocus}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Persona: {activeTutor?.personality}
              </p>
            </div>
          </div>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Guidelines
          </span>
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-2.5 border-b border-slate-100 dark:border-slate-800 bg-blue-50/30 dark:bg-blue-950/20 overflow-x-auto flex gap-2 no-scrollbar">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp)}
              className="shrink-0 text-[11px] px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-900 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Sparkles className="w-3 h-3 text-blue-500" />
              <span className="truncate max-w-xs">{qp}</span>
            </button>
          ))}
        </div>

        {/* Chat History */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-blue-700 text-white rounded-br-none shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none prose prose-xs dark:prose-invert'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-blue-600" />
                <span>{activeTutor?.name} is thinking through your question...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2.5"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${activeTutor?.name} a concept, PYQ, numerical, or theory question...`}
            className="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/25 shadow-xs"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3 rounded-2xl bg-blue-700 hover:bg-blue-600 disabled:opacity-40 text-white shadow-md shadow-blue-700/25 transition-all shrink-0"
            title="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Custom Tutor Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Add Custom Exam Tutor AI Persona
            </h3>

            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-3">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Persona Title
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. MathTutor — Calculus & Linear Algebra Coach"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Emoji
                  </label>
                  <input
                    type="text"
                    value={customEmoji}
                    onChange={(e) => setCustomEmoji(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-center text-base bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Advisory Style
                </label>
                <select
                  value={customPersonality}
                  onChange={(e) => setCustomPersonality(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                >
                  <option value="Rigorous & Methodical">Rigorous & Academic (Cites Standard Engineering Textbooks)</option>
                  <option value="Code-Centric Python/R">Implementation-Focused (C/C++, Java & Python Code Snippets)</option>
                  <option value="Concise Doubt Solver">Concise & Direct (Rapid Exam Doubt Resolver)</option>
                  <option value="Governance & DPDP Compliance">High-Yield PYQ & Derivation Specialist</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Custom System Instructions
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g. Focus on Compiler Design, parsing algorithms, and LL(1)/LR(1) grammar tables for university exams..."
                  className="w-full h-20 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCustomTutor}
                className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold shadow-sm"
              >
                Save Persona
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
