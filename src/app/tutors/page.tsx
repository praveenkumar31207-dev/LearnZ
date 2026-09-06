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
  const { aiTutors, addCustomTutor, subjects } = useAppStore();
  const [selectedTutorId, setSelectedTutorId] = useState(aiTutors[0]?.id || '');
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Custom Assistant Form
  const [customName, setCustomName] = useState('');
  const [customEmoji, setCustomEmoji] = useState('📊');
  const [customPersonality, setCustomPersonality] = useState('Rigorous & Methodical');
  const [customPrompt, setCustomPrompt] = useState('');

  const activeTutor = aiTutors.find((t) => t.id === selectedTutorId) || aiTutors[0];

  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content: `Namaste! I am **${activeTutor?.name}**, your AI Statistical Learning Assistant for India's Official Statistical System.\n\nI can explain survey concepts (NSS, PLFS, ASI), verify National Accounts formulas, guide your iGOT Karmayogi capacity building, and analyze uploaded field manuals.\n\nHow may I assist your professional capacity building today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    'Explain the difference between Usual Status (ps+ss) and Current Weekly Status (CWS) in PLFS.',
    'How is Gross Value Added (GVA) at Basic Prices derived from GDP at Market Prices in SNA 2008?',
    'What is the formula for deriving multipliers in a two-stage stratified cluster sample?',
    'What are the mandatory data fiduciary compliance obligations under the DPDP Act 2023 for survey officers?',
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
          topicContext: activeTutor.domainFocus || 'Official Statistics of India',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.reply || 'Let me know if you need more depth on this statistical standard!' },
        ]);
      }
    } catch (err) {
      console.warn('Statistical Assistant chat error', err);
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
        `You are ${customName}, a specialized AI advisor in Indian official statistics. Ground all replies in MoSPI, NSSTA, and UN statistical guidelines.`,
      isDefault: false,
      domainFocus: 'Statistical Competencies',
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
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
              National Statistical Advisory AI
            </span>
            <span className="text-xs text-slate-400">Grounded in MoSPI & NSSTA Manuals</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1 flex items-center gap-2.5">
            <Bot className="w-7 h-7 text-blue-700 dark:text-blue-400" />
            AI Statistical Learning Assistant (Sankhyiki)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time conversational mentor for official statistical standards, survey manuals, coding, and DPDP governance
          </p>
        </div>

        <button
          onClick={() => setShowCustomModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold shadow-sm shadow-blue-700/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Statistical Persona</span>
        </button>
      </div>

      {/* Assistant Selection Pills */}
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
                    content: `Hello! I am **${tutor.name}**. I am specialized in **${tutor.domainFocus || 'Official Statistics'}**. How can I assist your capacity development?`,
                  },
                ]);
              }}
              className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-blue-700 text-white shadow-md shadow-blue-700/30'
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
                <span>{activeTutor?.name} is referencing official statistical manuals...</span>
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
            placeholder={`Ask ${activeTutor?.name} about survey design, national accounts, formulas, or iGOT courses...`}
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
              Add Custom Statistical AI Persona
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
                    placeholder="e.g. PriceIndex — CPI Analyst"
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
                  <option value="Rigorous & Methodical">Rigorous & Methodical (Cites MoSPI Manuals)</option>
                  <option value="Code-Centric Python/R">Code-Centric (Python/R Microdata Scripts)</option>
                  <option value="Concise Doubt Solver">Concise & Direct (Rapid Field Query Resolver)</option>
                  <option value="Governance & DPDP Compliance">Governance & Data Privacy Legal Advisor</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Custom System Instructions
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g. Focus on Agricultural Statistics, Crop Cutting Experiments, and Village Frame surveys..."
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
