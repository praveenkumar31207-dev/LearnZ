'use client';

import React, { useState } from 'react';
import { Quiz, QuizQuestion } from '@/types';
import { useAppStore } from '@/lib/store';
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Award,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ActiveQuizProps {
  quiz: Quiz;
  onFinish?: () => void;
}

export const ActiveQuiz: React.FC<ActiveQuizProps> = ({ quiz, onFinish }) => {
  const { submitQuizAttempt } = useAppStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const questions = quiz.questions || [];
  const currentQ: QuizQuestion = questions[currentIdx];

  const handleSelectOption = (option: string) => {
    if (selectedAnswers[currentIdx]) return; // Answer already selected
    setSelectedAnswers((prev) => ({ ...prev, [currentIdx]: option }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Finish Quiz
      let correctCount = 0;
      const weakAreas: string[] = [];

      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctAnswer) {
          correctCount++;
        } else {
          weakAreas.push(q.questionText);
        }
      });

      const accuracy = Math.round((correctCount / questions.length) * 100);

      submitQuizAttempt({
        quizId: quiz.id,
        quizTitle: quiz.title,
        score: correctCount,
        totalPossible: questions.length,
        accuracyPercentage: accuracy,
        answers: Object.fromEntries(
          Object.entries(selectedAnswers).map(([k, v]) => [questions[Number(k)]?.id || k, v])
        ),
        weakAreasIdentified: weakAreas,
      });

      if (accuracy >= 75) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      }

      setIsCompleted(true);
    }
  };

  if (isCompleted) {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) correctCount++;
    });
    const accuracy = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 to-teal-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
          <Award className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Diagnostic Test Results
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {quiz.title}
          </h2>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 max-w-sm mx-auto">
          <div className="text-4xl font-extrabold text-slate-900 dark:text-white">
            {accuracy}%
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {correctCount} of {questions.length} questions correct
          </p>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          {accuracy >= 80
            ? 'Outstanding mastery! Your spaced review intervals have been boosted.'
            : accuracy >= 50
            ? 'Good attempt! Review the questions you missed to reinforce core concepts.'
            : 'Topic flagged in Weak Areas radar. An active review session is scheduled for tomorrow.'}
        </p>

        <button
          onClick={() => {
            setCurrentIdx(0);
            setSelectedAnswers({});
            setShowExplanation(false);
            setIsCompleted(false);
            if (onFinish) onFinish();
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Take Another Quiz</span>
        </button>
      </div>
    );
  }

  const selectedAnswer = selectedAnswers[currentIdx];
  const isAnswered = Boolean(selectedAnswer);

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Top Progress */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Question {currentIdx + 1} of {questions.length}
        </span>
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
          Difficulty: {currentQ?.difficulty || 'Medium'}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-indigo-600 rounded-full transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Text */}
      <div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
          {currentQ?.questionText}
        </h3>
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        {(currentQ?.options || ['True', 'False']).map((opt, idx) => {
          const isSelected = selectedAnswer === opt;
          const isCorrect = opt === currentQ.correctAnswer;

          let btnStyle =
            'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-200 hover:border-indigo-300';

          if (isAnswered) {
            if (isCorrect) {
              btnStyle =
                'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-bold';
            } else if (isSelected && !isCorrect) {
              btnStyle =
                'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 font-bold';
            } else {
              btnStyle =
                'border-slate-200 dark:border-slate-800 opacity-50 bg-slate-50 dark:bg-slate-850 text-slate-500';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(opt)}
              disabled={isAnswered}
              className={`w-full p-4 rounded-2xl border-2 text-left text-xs sm:text-sm flex items-center justify-between gap-3 transition-all ${btnStyle}`}
            >
              <span>{opt}</span>
              {isAnswered && isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              )}
              {isAnswered && isSelected && !isCorrect && (
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Box */}
      {showExplanation && (
        <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 space-y-1.5 animate-in fade-in">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-teal-500" /> Explanation & Insight:
          </span>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {currentQ?.explanation}
          </p>
        </div>
      )}

      {/* Next Button */}
      {isAnswered && (
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <span>{currentIdx < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
