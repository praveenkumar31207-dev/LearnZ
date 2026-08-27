'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import {
  Bot,
  Send,
  Sparkles,
  Plus,
  Code2,
  HelpCircle,
  Zap,
  BookOpen,
  MessageSquare,
} from 'lucide-react';
import { AITutor } from '@/types';

export default function TutorsPage() {
  const { aiTutors, addCustomTutor, subjects } = useAppStore();
  const [selectedTutorId, setSelectedTutorId] = useState(aiTutors[0]?.id || '');
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Custom Tutor Form
  const [customName, setCustomName] = useState('');
  const [customEmoji, setCustomEmoji] = useState('🤖');
  const [customPersonality, setCustomPersonality] = useState('Socratic & Code-Centric');
  const [customPrompt, setCustomPrompt] = useState('');
  const [customSubjectId, setCustomSubjectId] = useState(subjects[0]?.id || '');

  const activeTutor = aiTutors.find((t) => t.id === selectedTutorId) || aiTutors[0];

  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content: `Hello! I'm **${activeTutor?.name}**. I'm tuned to your syllabus. How can I help you master your concepts today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    `Explain the hardest concept in ${activeTutor?.subjectName || 'this subject'} with an intuitive analogy.`,
    `Give me 3 high-yield exam questions likely to appear on test day.`,
    `Test my understanding with a diagnostic multiple-choice question.`,
    `What are the most frequent runtime errors or traps students encounter?`,
  ];

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
          topicContext: activeTutor.subjectName || 'Academic Course',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.reply || 'Let me know if you need more depth!' },
        ]);
      }
    } catch (err) {
      console.warn('Tutor chat error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomTutor = () => {
    if (!customName.trim()) return;
    const subj = subjects.find((s) => s.id === customSubjectId);
    addCustomTutor({
      name: customName,
      avatarEmoji: customEmoji,
      personality: customPersonality,
      systemPrompt:
        customPrompt ||
        `You are ${customName}, an expert academic tutor in ${subj?.name || 'General Studies'}. Teach clearly and concisely.`,
      subjectId: customSubjectId,
      subjectName: subj?.name,
      isDefault: false,
    });
    setCustomName('');
    setShowCustomModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Bot className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Specialized AI Academic Tutors
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Persona-driven study assistants grounded in your specific coursework and difficulty levels.
          </p>
        </div>

        <button
          onClick={() => setShowCustomModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Create Custom Tutor</span>
        </button>
      </div>

      {/* Tutor Selection Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
        {aiTutors.map((tutor) => {
          const isSelected = tutor.id === activeTutor?.id;
          return (
            <button
              key={tutor.id}
              onClick={() => {
                setSelectedTutorId(tutor.id);
                setMessages([
                  {
                    role: 'assistant',
                    content: `Hello! I'm **${tutor.name}**. I'm tuned to your syllabus. How can I help you master your concepts today?`,
                  },
                ]);
              }}
              className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
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
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[580px]">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-xl">
              {activeTutor?.avatarEmoji}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {activeTutor?.name}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Style: {activeTutor?.personality} • Focus: {activeTutor?.subjectName || 'General'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-2.5 border-b border-slate-100 dark:border-slate-800 bg-indigo-50/30 dark:bg-indigo-950/20 overflow-x-auto flex gap-2 no-scrollbar">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp)}
              className="shrink-0 text-[11px] px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-indigo-50 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Sparkles className="w-3 h-3 text-teal-500" />
              <span>{qp}</span>
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
                className={`max-w-[80%] p-4 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-sm'
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
                <Sparkles className="w-4 h-4 animate-spin text-indigo-500" />
                <span>{activeTutor?.name} is thinking...</span>
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
            placeholder={`Type a question, doubt, or message for ${activeTutor?.name}...`}
            className="flex-1 px-4 py-3.5 rounded-2xl bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-950 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/25 shadow-xs"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white shadow-md shadow-indigo-600/30 transition-all hover:scale-105 shrink-0"
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Custom Tutor Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Create Specialized AI Tutor
            </h3>

            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-3">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Tutor Name
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Athena — Physics Wizard"
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
                  Target Subject
                </label>
                <select
                  value={customSubjectId}
                  onChange={(e) => setCustomSubjectId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Teaching Style / Personality
                </label>
                <select
                  value={customPersonality}
                  onChange={(e) => setCustomPersonality(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                >
                  <option value="Socratic & Question-Driven">Socratic (Guides you with hints)</option>
                  <option value="Code-Centric & Pragmatic">Code-Centric & Practical</option>
                  <option value="Step-by-Step Mathematical">Step-by-Step Derivations</option>
                  <option value="Ultra-Concise & Direct">Ultra-Concise (Rapid Doubt Solver)</option>
                  <option value="Exam Strategy & High-Yield">Exam Strategy & Marking Scheme</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Custom System Prompt (Optional)
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g. Always ask a verification question at the end of each explanation..."
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
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm"
              >
                Create Tutor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
