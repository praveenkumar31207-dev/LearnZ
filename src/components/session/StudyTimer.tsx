'use client';

import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Coffee,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { formatMinutes } from '@/lib/utils';

interface StudyTimerProps {
  initialMinutes: number;
  onFinish: (actualMinutes: number) => void;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({
  initialMinutes,
  onFinish,
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [secondsRemaining, setSecondsRemaining] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreakMode, setIsBreakMode] = useState(false);

  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isRunning) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsRemaining(totalSeconds);
  };

  const addTime = (mins: number) => {
    setSecondsRemaining((prev) => prev + mins * 60);
    setTotalSeconds((prev) => prev + mins * 60);
  };

  const handleFinishEarly = () => {
    setIsRunning(false);
    const elapsedSeconds = totalSeconds - secondsRemaining;
    const elapsedMinutes = Math.max(1, Math.round(elapsedSeconds / 60));
    onFinish(elapsedMinutes);
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const progress = totalSeconds > 0 ? (secondsRemaining / totalSeconds) * 100 : 0;

  // SVG Circular Gauge Calculations
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
      {/* Timer Circular Gauge */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center mb-6">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 260 260">
          <circle
            cx="130"
            cy="130"
            r={radius}
            className="stroke-slate-100 dark:stroke-slate-800"
            strokeWidth="12"
            fill="transparent"
          />
          <circle
            cx="130"
            cy="130"
            r={radius}
            className="stroke-indigo-600 dark:stroke-indigo-500 transition-all duration-1000 ease-linear"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute flex flex-col items-center">
          <span className="font-mono text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </span>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
            {isRunning ? 'FOCUS MODE ACTIVE' : 'TIMER PAUSED'}
          </span>
        </div>
      </div>

      {/* Primary Play / Pause / Reset Controls */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={resetTimer}
          className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          title="Reset timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={toggleTimer}
          className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-white font-bold text-sm shadow-lg transition-all ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30'
              : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30 hover:scale-105'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 fill-white" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-white" />
              <span>{secondsRemaining === totalSeconds ? 'Start Session' : 'Resume'}</span>
            </>
          )}
        </button>

        <button
          onClick={() => addTime(10)}
          className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          title="Extend by 10 minutes"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Complete Session Button */}
      <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-3">
        <button
          onClick={handleFinishEarly}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Mark Task Completed</span>
        </button>
      </div>
    </div>
  );
};
