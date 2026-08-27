'use client';

import React, { useState } from 'react';
import { Bot, Send, Sparkles, X, ChevronRight, HelpCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface ContextualTutorProps {
  topicTitle: string;
  subjectName?: string;
}

export const ContextualTutor: React.FC<ContextualTutorProps> = ({
  topicTitle,
  subjectName,
}) => {
  const { aiTutors } = useAppStore();
  const activeTutor = aiTutors[0]; // Default tutor

  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; content: string }[]
  >([
    {
      role: 'assistant',
      content: `Hello! I'm ${activeTutor.name}. I'm here to assist you with **${topicTitle}**. Ask me any doubt or click a quick prompt below!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    `Explain ${topicTitle} in simple terms with an intuitive analogy.`,
    `Give me 2 important exam questions from ${topicTitle}.`,
    `What are the most common pitfalls or mistakes students make in ${topicTitle}?`,
    `Give me a quick 2-minute summary of ${topicTitle}.`,
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const newMessages = [...messages, { role: 'user' as const, content: query }];
    setMessages(newMessages);
    if (!textToSend) setInput('');
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
          topicContext: `${topicTitle} (${subjectName || 'Course'})`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.reply || 'Let me know if you need more clarity!' },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `**${topicTitle}** is a core concept. Focus on understanding the syntax, runtime behavior, and memory model. Let me know which sub-part is confusing!`,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Here is a helpful tip on **${topicTitle}**: Break the concept into its input, processing, and output steps to simplify solving it in exams.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[520px] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              {activeTutor.name}
            </h4>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              Live Context: {topicTitle}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Prompts Carousel */}
      <div className="p-2.5 border-b border-slate-100 dark:border-slate-800 bg-indigo-50/30 dark:bg-indigo-950/20 overflow-x-auto flex gap-2 no-scrollbar">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(qp)}
            className="shrink-0 text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-indigo-50 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900 transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-teal-500" />
            <span className="truncate max-w-[180px]">{qp}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none prose prose-xs dark:prose-invert'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-indigo-500" />
              <span>{activeTutor.name} is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask ${activeTutor.name} about ${topicTitle}...`}
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-sm shadow-indigo-600/30 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
