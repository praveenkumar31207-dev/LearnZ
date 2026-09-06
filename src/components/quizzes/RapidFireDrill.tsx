'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { QuizQuestion, DrillResult } from '@/types';
import {
  Zap,
  Flame,
  Award,
  RotateCcw,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RapidFireDrillProps {
  onFinish?: (result: DrillResult) => void;
  onExit?: () => void;
}

export const RapidFireDrill: React.FC<RapidFireDrillProps> = ({ onFinish, onExit }) => {
  const { battleQuestions, recordDrillResult, profile } = useAppStore();

  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [weakTopics, setWeakTopics] = useState<string[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});

  // Dynamic question bank based on available battle and quiz questions
  const drillQuestions: QuizQuestion[] = battleQuestions.map((bq) => ({
    id: bq.id,
    questionText: bq.questionText,
    questionType: 'mcq',
    options: bq.options,
    correctAnswer: bq.correctAnswer,
    explanation: bq.explanation,
    topic: bq.subject || 'Official Statistics',
    difficulty: bq.difficulty,
  }));

  const currentQ = drillQuestions[currentIdx % drillQuestions.length];

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleCompleteDrill();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleStart = () => {
    setTimeLeft(60);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setAnsweredCount(0);
    setCurrentIdx(0);
    setSelectedAnswers({});
    setWeakTopics([]);
    setFeedback(null);
    setIsActive(true);
    setIsFinished(false);
  };

  const handleSelectOption = (option: string) => {
    if (!isActive || feedback) return;

    const isCorrect = option === currentQ.correctAnswer;
    const newAnswered = answeredCount + 1;
    setAnsweredCount(newAnswered);
    setSelectedAnswers((prev) => ({ ...prev, [currentIdx]: option }));

    if (isCorrect) {
      setFeedback('correct');
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      const multiplier = newStreak >= 5 ? 3.0 : newStreak >= 3 ? 2.0 : newStreak >= 2 ? 1.5 : 1.0;
      const points = Math.round(100 * multiplier);
      setScore((prev) => prev + points);
      setCorrectCount((prev) => prev + 1);
    } else {
      setFeedback('wrong');
      setStreak(0);
      setWeakTopics((prev) => [...prev, currentQ.questionText]);
    }

    // Auto advance after brief animation
    setTimeout(() => {
      setFeedback(null);
      setCurrentIdx((prev) => prev + 1);
    }, 450);
  };

  const handleCompleteDrill = () => {
    setIsActive(false);
    setIsFinished(true);

    const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
    const avgSec = answeredCount > 0 ? Math.round(((60 - timeLeft) / answeredCount) * 10) / 10 : 0;
    const xpEarned = Math.round(score * 0.25);

    const drillResult: DrillResult = {
      id: `drill-${Date.now()}`,
      drillTitle: '⚡ 60-Second Rapid Recall Sprint',
      subjectName: 'Mixed Engineering Core',
      drillMode: 'rapid_fire',
      score,
      totalQuestions: answeredCount,
      accuracyPercentage: accuracy,
      avgSecondsPerQuestion: avgSec,
      maxStreak,
      xpEarned,
      completedAt: new Date().toISOString(),
      weakTopicsIdentified: weakTopics,
    };

    recordDrillResult(drillResult);
    if (accuracy >= 70 && answeredCount >= 5) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
    if (onFinish) onFinish(drillResult);
  };

  // 1. Initial Start Screen
  if (!isActive && !isFinished) {
    return (
      <div className="rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white border border-indigo-800/80 p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
          <Zap className="w-8 h-8 fill-white animate-pulse" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Speed Recall Game Mode
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">
            60-Second Rapid Fire Drill
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Answer as many high-frequency exam questions as you can in 1 minute. Build streaks to trigger up to 3.0x score multipliers!
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto text-xs font-semibold">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-amber-400 font-bold block text-base">60s</span>
            <span className="text-[10px] text-slate-400">Timer</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-rose-400 font-bold block text-base">3.0x</span>
            <span className="text-[10px] text-slate-400">Max Combo</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-emerald-400 font-bold block text-base">+XP</span>
            <span className="text-[10px] text-slate-400">Rank Bonus</span>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/30 transition-all hover:scale-105"
        >
          <Flame className="w-4 h-4 fill-slate-950" />
          <span>START 60s SPEED SPRINT</span>
        </button>
      </div>
    );
  }

  // 2. Finished Screen
  if (isFinished) {
    const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
    const avgSec = answeredCount > 0 ? Math.round(((60 - timeLeft) / answeredCount) * 10) / 10 : 0;
    const xpEarned = Math.round(score * 0.25);

    return (
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-sm text-center space-y-6 animate-in fade-in">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
          <Award className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Rapid Fire Sprint Completed
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
            {score} Points
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            +{xpEarned} XP added to your student profile
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto text-center">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Accuracy</span>
            <span className="text-lg font-black text-slate-900 dark:text-white mt-0.5 block">
              {accuracy}%
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Answered</span>
            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-0.5 block">
              {correctCount}/{answeredCount}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Max Streak</span>
            <span className="text-lg font-black text-amber-500 mt-0.5 block">
              🔥 {maxStreak}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Avg Speed</span>
            <span className="text-lg font-black text-teal-600 dark:text-teal-400 mt-0.5 block">
              {avgSec}s / Q
            </span>
          </div>
        </div>

        {weakTopics.length > 0 && (
          <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 max-w-md mx-auto text-left space-y-1.5 text-xs text-rose-900 dark:text-rose-200">
            <span className="font-bold flex items-center gap-1.5 text-rose-700 dark:text-rose-300">
              <Sparkles className="w-3.5 h-3.5" /> Weak Questions Flagged for Review:
            </span>
            <ul className="list-disc list-inside text-[11px] text-rose-800/80 dark:text-rose-300/80 space-y-0.5">
              {weakTopics.slice(0, 3).map((q, idx) => (
                <li key={idx} className="truncate">
                  {q}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-center gap-3 pt-2">
          {onExit && (
            <button
              onClick={onExit}
              className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
            >
              Back to Drill Hub
            </button>
          )}
          <button
            onClick={handleStart}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-extrabold text-xs shadow-md transition-all hover:scale-105"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Play Again</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. Active Drill Screen
  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Top Header: Timer Bar & Streaks */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black transition-colors ${
              timeLeft <= 10
                ? 'bg-rose-500 text-white animate-bounce'
                : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
            }`}
          >
            {timeLeft}s
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Time Left</span>
            <span className="text-xs font-black text-slate-900 dark:text-white">
              60s Challenge
            </span>
          </div>
        </div>

        {/* Score & Streak Multiplier */}
        <div className="flex items-center gap-4 text-right">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Current Score</span>
            <span className="text-base font-black text-indigo-600 dark:text-indigo-400">
              {score} PTS
            </span>
          </div>

          <div
            className={`px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1 transition-all ${
              streak >= 3
                ? 'bg-amber-500 text-slate-950 animate-pulse shadow-xs shadow-amber-500/30'
                : streak >= 1
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>{streak}x Combo</span>
          </div>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            timeLeft <= 10
              ? 'bg-rose-500'
              : 'bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600'
          }`}
          style={{ width: `${(timeLeft / 60) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Question #{currentIdx + 1}</span>
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            {currentQ?.difficulty}
          </span>
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug min-h-[48px]">
          {currentQ?.questionText}
        </h3>
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {currentQ?.options?.map((opt, idx) => {
          const isSelected = selectedAnswers[currentIdx] === opt;
          const isCorrect = opt === currentQ.correctAnswer;

          let btnStyle =
            'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 hover:border-indigo-400 text-slate-800 dark:text-slate-200';

          if (feedback) {
            if (isCorrect) {
              btnStyle =
                'border-emerald-500 bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20';
            } else if (isSelected && !isCorrect) {
              btnStyle = 'border-rose-500 bg-rose-500 text-white font-bold animate-shake';
            } else {
              btnStyle = 'border-slate-200 dark:border-slate-800 opacity-40 bg-slate-100 dark:bg-slate-800';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(opt)}
              disabled={Boolean(feedback)}
              className={`p-4 rounded-2xl border-2 text-left text-xs sm:text-sm font-semibold flex items-center justify-between gap-2 transition-all cursor-pointer ${btnStyle}`}
            >
              <span>{opt}</span>
              {feedback && isCorrect && <CheckCircle2 className="w-4 h-4 shrink-0" />}
              {feedback && isSelected && !isCorrect && <XCircle className="w-4 h-4 shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
