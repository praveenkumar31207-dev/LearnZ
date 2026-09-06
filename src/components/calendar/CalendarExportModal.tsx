'use client';

import React, { useState } from 'react';
import { ScheduleTask, AcademicEvent } from '@/types';
import { Download, Calendar, Check, X, Copy } from 'lucide-react';

interface CalendarExportModalProps {
  tasks: ScheduleTask[];
  events: AcademicEvent[];
  onClose: () => void;
}

export const CalendarExportModal: React.FC<CalendarExportModalProps> = ({
  tasks,
  events,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const generateIcsContent = () => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formatIcsDate = (dateStr: string) => {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
    };

    let ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CogniStudy AI//Study Schedule & Exams//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:CogniStudy Master Timetable',
      'X-WR-TIMEZONE:UTC',
    ];

    // Export Tasks
    tasks.forEach((task) => {
      const startIcs = formatIcsDate(task.startTime);
      const endIcs = formatIcsDate(task.endTime);
      if (!startIcs || !endIcs) return;

      ics.push('BEGIN:VEVENT');
      ics.push(`UID:task-${task.id}@cognistudy.ai`);
      ics.push(`DTSTAMP:${formatIcsDate(new Date().toISOString())}`);
      ics.push(`DTSTART:${startIcs}`);
      ics.push(`DTEND:${endIcs}`);
      ics.push(`SUMMARY:[CogniStudy] ${task.title}`);
      ics.push(`DESCRIPTION:Subject: ${task.subjectName || 'General'}\\nType: ${task.taskType}\\nPriority: ${task.priorityTag}\\nPlanned Duration: ${task.plannedDurationMins} mins`);
      ics.push(`CATEGORIES:Study,${task.subjectName || 'Academics'}`);
      ics.push(`STATUS:${task.status === 'completed' ? 'CONFIRMED' : 'TENTATIVE'}`);
      ics.push('END:VEVENT');
    });

    // Export Academic Events / Exams
    events.forEach((evt) => {
      const startIcs = formatIcsDate(evt.eventDate);
      if (!startIcs) return;
      const endD = new Date(new Date(evt.eventDate).getTime() + 3 * 3600000);
      const endIcs = formatIcsDate(endD.toISOString());

      ics.push('BEGIN:VEVENT');
      ics.push(`UID:exam-${evt.id}@cognistudy.ai`);
      ics.push(`DTSTAMP:${formatIcsDate(new Date().toISOString())}`);
      ics.push(`DTSTART:${startIcs}`);
      ics.push(`DTEND:${endIcs}`);
      ics.push(`SUMMARY:🎯 EXAM: ${evt.title} (${evt.subjectName})`);
      ics.push(`DESCRIPTION:Weightage: ${evt.weightagePercentage}% of grade\\nCoverage Needed: ${evt.syllabusCoverageNeeded}%`);
      ics.push(`CATEGORIES:Exam,${evt.subjectName}`);
      ics.push('PRIORITY:1');
      ics.push('END:VEVENT');
    });

    ics.push('END:VCALENDAR');
    return ics.join('\r\n');
  };

  const handleDownload = () => {
    const icsContent = generateIcsContent();
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `cognistudy_schedule_${new Date().toISOString().split('T')[0]}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    const icsContent = generateIcsContent();
    navigator.clipboard.writeText(icsContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Export to Calendar
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Sync your study plan with Google Calendar, Apple, or Outlook
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
          <div className="flex justify-between items-center font-medium">
            <span>📅 Study Sessions Included:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{tasks.length} slots</span>
          </div>
          <div className="flex justify-between items-center font-medium">
            <span>🎯 Exam & Midterm Milestones:</span>
            <span className="font-bold text-rose-600 dark:text-rose-400">{events.length} exams</span>
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-750 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Universal standard format (<code className="font-mono text-indigo-500">.ics</code>). Works seamlessly with Google Calendar, Apple Calendar, Microsoft Outlook, and mobile calendar apps.
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            <Download className="w-4 h-4" />
            <span>Download .ics Calendar File</span>
          </button>

          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied iCal Raw Data!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy iCal Text Data</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
