'use client';

import React, { useState } from 'react';
import { Quiz, QuizQuestion, ReferenceVideo, ReferenceWebsite } from '@/types';
import { useAppStore } from '@/lib/store';
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Award,
  HelpCircle,
  Video,
  Globe,
  ExternalLink,
  BookOpen,
  Compass,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Link from 'next/link';

interface ActiveQuizProps {
  quiz: Quiz;
  onFinish?: () => void;
}

// Fallback curated video & website references for official competencies
const DEFAULT_TOPIC_RESOURCES: Record<
  string,
  { videos: ReferenceVideo[]; websites: ReferenceWebsite[] }
> = {
  default: {
    videos: [
      {
        title: 'Sampling Methods & Stratification in Practice',
        url: 'https://www.youtube.com/watch?v=pTuj57uXWiI',
        channel: 'Khan Academy Statistics',
        duration: '14 mins',
      },
      {
        title: 'National Accounts & Gross Value Added (GVA) Explained',
        url: 'https://www.youtube.com/watch?v=mjJmo5mLUc4',
        channel: 'Economics Explained',
        duration: '18 mins',
      },
    ],
    websites: [
      {
        title: 'Ministry of Statistics & Programme Implementation (MoSPI) Official Portal',
        url: 'https://www.mospi.gov.in',
        source: 'MoSPI National Portal',
        description: 'Access official methodological notes, statistical releases, and PLFS documentation.',
      },
      {
        title: 'iGOT Karmayogi Bharat Learning Portal',
        url: 'https://igotkarmayogi.gov.in',
        source: 'iGOT Karmayogi Bharat',
        description: 'Explore accredited civil services competency modules and statistical certifications.',
      },
      {
        title: 'Reserve Bank of India - Database on Indian Economy (DBIE)',
        url: 'https://dbie.rbi.org.in',
        source: 'RBI DBIE',
        description: 'High-frequency time-series datasets and macroeconomic indicators.',
      },
    ],
  },
};

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

      const accuracy = Math.round((correctCount === 0 && questions.length === 0 ? 0 : correctCount / questions.length) * 100);

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

  // Extract all video and website recommendations from the quiz questions + defaults
  const collectedVideos: ReferenceVideo[] = [
    ...(quiz.referenceVideos || []),
    ...questions.flatMap((q) => q.referenceVideos || []),
    ...DEFAULT_TOPIC_RESOURCES.default.videos,
  ].filter((v, index, self) => index === self.findIndex((t) => t.url === v.url));

  const collectedWebsites: ReferenceWebsite[] = [
    ...(quiz.referenceWebsites || []),
    ...questions.flatMap((q) => q.referenceWebsites || []),
    ...DEFAULT_TOPIC_RESOURCES.default.websites,
  ].filter((w, index, self) => index === self.findIndex((t) => t.url === w.url));

  if (isCompleted) {
    let correctCount = 0;
    const incorrectQuestions: { q: QuizQuestion; given: string }[] = [];

    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      } else {
        incorrectQuestions.push({ q, given: selectedAnswers[idx] });
      }
    });

    const accuracy = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-8 animate-in fade-in duration-300">
        {/* Test Result Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Official Diagnostic Assessment Completed
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {quiz.title}
            </h2>
          </div>

          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400">
              {accuracy}%
            </div>
            <div className="text-left text-xs text-slate-500 dark:text-slate-400">
              <p className="font-bold text-slate-900 dark:text-white">
                {correctCount} / {questions.length} Correct
              </p>
              <p>{accuracy >= 75 ? 'Competency Target Achieved' : 'Refinement Recommended'}</p>
            </div>
          </div>
        </div>

        {/* Detailed Question Review & Corrections */}
        {incorrectQuestions.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Focus Areas for Review ({incorrectQuestions.length} Questions Flagged)
            </h3>
            <div className="space-y-3">
              {incorrectQuestions.map(({ q, given }, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/50 space-y-2 text-left"
                >
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {idx + 1}. {q.questionText}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300">
                      <span className="font-bold">Your Selection:</span> {given || 'Unanswered'}
                    </div>
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
                      <span className="font-bold">Correct Answer:</span> {q.correctAnswer}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-slate-900/70 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span><strong className="font-semibold">Explanation:</strong> {q.explanation}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Curation of Reference Links: YouTube Videos & Official Websites */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-6 text-left">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Recommended Study References & Video Tutorials
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Targeted external video lectures & government portals to close identified skill gaps
              </p>
            </div>
          </div>

          {/* YouTube Videos Grid */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <Video className="w-4 h-4" /> Curated YouTube Video Lectures
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {collectedVideos.map((video, vIdx) => (
                <a
                  key={vIdx}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 hover:bg-rose-50/50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-700 transition-all flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                    <Video className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 line-clamp-2">
                      {video.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                      <span>{video.channel}</span>
                      {video.duration && <span>• {video.duration}</span>}
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-500 shrink-0" />
                </a>
              ))}
            </div>
          </div>

          {/* Official Websites Grid */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Globe className="w-4 h-4" /> Official Portals & Authoritative Documentation
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {collectedWebsites.map((web, wIdx) => (
                <a
                  key={wIdx}
                  href={web.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 hover:bg-emerald-50/40 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 truncate">
                        {web.source}
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-500" />
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 line-clamp-2">
                      {web.title}
                    </div>
                    {web.description && (
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {web.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <span>Visit Reference</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => {
              setCurrentIdx(0);
              setSelectedAnswers({});
              setShowExplanation(false);
              setIsCompleted(false);
              if (onFinish) onFinish();
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Assessment</span>
          </button>

          <Link
            href="/schedule"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all hover:scale-105"
          >
            <Compass className="w-4 h-4" />
            <span>View AI Learning Path</span>
          </Link>
        </div>
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
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
          Difficulty: {currentQ?.difficulty || 'Medium'}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Text */}
      <div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
          {currentQ?.questionText}
        </h3>
        {currentQ?.sourceDocRef && (
          <span className="inline-block mt-2 text-[10px] font-medium text-slate-400 dark:text-slate-500">
            Reference Document: {currentQ.sourceDocRef}
          </span>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        {(currentQ?.options || ['True', 'False']).map((opt, idx) => {
          const isSelected = selectedAnswer === opt;
          const isCorrect = opt === currentQ.correctAnswer;

          let btnStyle =
            'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-200 hover:border-blue-300';

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
        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 space-y-1.5 animate-in fade-in">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-teal-500" /> Explanation & Methodology:
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all hover:scale-105"
          >
            <span>{currentIdx < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
