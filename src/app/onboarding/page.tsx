'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import {
  User,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Coffee,
  Sun,
  Moon,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EducationLevel, PreferredStudyTime } from '@/types';

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, updateProfile, availability, updateAvailability, regenerateSchedule } =
    useAppStore();

  const [step, setStep] = useState(1);

  // Step 1: Student Info
  const [fullName, setFullName] = useState(profile.fullName);
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(profile.educationLevel);
  const [courseDegree, setCourseDegree] = useState(profile.courseDegree);
  const [currentSemester, setCurrentSemester] = useState(profile.currentSemester);
  const [targetGpaGrade, setTargetGpaGrade] = useState(profile.targetGpaGrade);
  const [dailyMaxStudyHours, setDailyMaxStudyHours] = useState(profile.dailyMaxStudyHours);
  const [preferredStudyTime, setPreferredStudyTime] = useState<PreferredStudyTime>(
    profile.preferredStudyTime
  );

  // Step 2: Routine & Availability
  const [wakeTime, setWakeTime] = useState(availability.wakeTime || '07:00');
  const [sleepTime, setSleepTime] = useState(availability.sleepTime || '23:30');
  const [institutionHours, setInstitutionHours] = useState(availability.institutionHours || '09:00-16:00');
  const [studySlot1Start, setStudySlot1Start] = useState('18:00');
  const [studySlot1End, setStudySlot1End] = useState('20:00');
  const [studySlot2Start, setStudySlot2Start] = useState('20:45');
  const [studySlot2End, setStudySlot2End] = useState('23:00');

  const handleFinishOnboarding = () => {
    updateProfile({
      fullName,
      educationLevel,
      courseDegree,
      currentSemester,
      targetGpaGrade,
      dailyMaxStudyHours,
      preferredStudyTime,
      onboardingCompleted: true,
    });

    updateAvailability({
      wakeTime,
      sleepTime,
      institutionHours,
      availableStudySlots: [
        { start: studySlot1Start, end: studySlot1End },
        { start: studySlot2Start, end: studySlot2End },
      ],
    });

    regenerateSchedule();

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      router.push('/');
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-300">
      {/* Step Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center shadow-md shadow-indigo-600/30">
            {step}
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Step {step} of 3
            </span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {step === 1
                ? 'Student Profile & Goals'
                : step === 2
                ? 'Daily Availability & Routine'
                : 'Academic Deadlines & Plan'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-8 h-2 rounded-full transition-all ${
                s === step
                  ? 'bg-indigo-600 w-12'
                  : s < step
                  ? 'bg-emerald-500'
                  : 'bg-slate-200 dark:bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step 1: Student Information */}
      {step === 1 && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Tell us about your academic program
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              The AI will customize study block durations and priority algorithms accordingly.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Johnson"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Education Level
                </label>
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
                >
                  <option value="High School">High School</option>
                  <option value="Undergraduate">Undergraduate (College / B.Tech / B.Sc)</option>
                  <option value="Postgraduate">Postgraduate (Masters / Ph.D)</option>
                  <option value="Competitive Exam Prep">Competitive Exam (GATE, GRE, MCAT, JEE)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Degree / Program
                </label>
                <input
                  type="text"
                  value={courseDegree}
                  onChange={(e) => setCourseDegree(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Current Year / Semester
                </label>
                <input
                  type="text"
                  value={currentSemester}
                  onChange={(e) => setCurrentSemester(e.target.value)}
                  placeholder="e.g. Semester 4"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Target Grade / GPA Goal
                </label>
                <input
                  type="text"
                  value={targetGpaGrade}
                  onChange={(e) => setTargetGpaGrade(e.target.value)}
                  placeholder="e.g. 9.5 CGPA / Grade A+"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Daily Max Study Hours
                </label>
                <input
                  type="number"
                  value={dailyMaxStudyHours}
                  onChange={(e) => setDailyMaxStudyHours(Number(e.target.value))}
                  min={1}
                  max={14}
                  step={0.5}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Preferred Peak Focus Time
                </label>
                <select
                  value={preferredStudyTime}
                  onChange={(e) => setPreferredStudyTime(e.target.value as PreferredStudyTime)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
                >
                  <option value="morning">Morning (Early Bird)</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening (Recommended)</option>
                  <option value="night">Night (Night Owl)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <span>Next: Routine & Availability</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Routine & Availability */}
      {step === 2 && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Daily Commitments & Free Study Hours
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              The AI will strictly avoid scheduling study sessions over meals, sleep, or college hours.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Wake-Up Time
                </label>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Bedtime (Sleep)
                </label>
                <input
                  type="time"
                  value={sleepTime}
                  onChange={(e) => setSleepTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                College / Institution Hours
              </label>
              <input
                type="text"
                value={institutionHours}
                onChange={(e) => setInstitutionHours(e.target.value)}
                placeholder="e.g. 09:00-16:00"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>

            {/* Free Study Slots */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-3">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 block">
                Target Study Slots (Free Hours)
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Slot 1 (Start)</label>
                  <input
                    type="time"
                    value={studySlot1Start}
                    onChange={(e) => setStudySlot1Start(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Slot 1 (End)</label>
                  <input
                    type="time"
                    value={studySlot1End}
                    onChange={(e) => setStudySlot1End(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Slot 2 (Start)</label>
                  <input
                    type="time"
                    value={studySlot2Start}
                    onChange={(e) => setStudySlot2Start(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Slot 2 (End)</label>
                  <input
                    type="time"
                    value={studySlot2End}
                    onChange={(e) => setStudySlot2End(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <span>Next: Generate Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Generate */}
      {step === 3 && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-indigo-600 to-teal-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Ready to Generate Your Adaptive Plan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              CogniStudy will evaluate all topic dependencies, difficulty curves, and upcoming exam dates to formulate your optimized schedule.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Student:</span>
              <span className="font-bold text-slate-900 dark:text-white">{fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Program:</span>
              <span className="font-bold text-slate-900 dark:text-white">{courseDegree}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Daily Study Target:</span>
              <span className="font-bold text-slate-900 dark:text-white">{dailyMaxStudyHours} Hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Rescheduling Mode:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Continuous Dynamic Recalculation</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleFinishOnboarding}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-500 hover:to-teal-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate My Study Plan</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
