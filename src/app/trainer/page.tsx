'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/lib/authContext';
import {
  UploadCloud,
  FileCheck2,
  Cpu,
  HelpCircle,
  BarChart3,
  Award,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Plus,
  Play,
  Trash2,
  RefreshCw,
  BookOpen,
} from 'lucide-react';
import Link from 'next/link';

export default function TrainerDashboardPage() {
  const { profile } = useAuth();
  const {
    uploadedMaterials,
    addUploadedMaterial,
    generateMCQsFromMaterial,
    addQuiz,
    quizzes,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'upload' | 'generator' | 'review'>('overview');

  // Generator form
  const [targetTopic, setTargetTopic] = useState('Survey Sampling & Stratification Protocol');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Mixed'>('Medium');
  const [numQuestions, setNumQuestions] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  // Material upload state
  const [newTitle, setNewTitle] = useState('');
  const [newDomain, setNewDomain] = useState<any>('Statistical Competencies');

  const handleRunGenerator = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const qs = generateMCQsFromMaterial(
        uploadedMaterials[0]?.id || 'mat-1',
        numQuestions,
        targetTopic,
        difficulty
      );
      setGeneratedQuestions(qs);
      setIsGenerating(false);
      setActiveTab('review');
    }, 800);
  };

  const handlePublishAssessment = () => {
    if (generatedQuestions.length === 0) return;
    addQuiz({
      title: `Trainer Approved Assessment: ${targetTopic}`,
      difficulty,
      questions: generatedQuestions,
      competencyDomain: newDomain,
      sourceMaterialName: 'NSSTA Curated Faculty Manual',
      createdAt: new Date().toISOString(),
    });
    alert('Assessment approved and published to the Learner testing bank!');
    setGeneratedQuestions([]);
    setActiveTab('overview');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Faculty Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-900 p-6 sm:p-8 text-white shadow-md space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/40">
            Faculty & Assessment Architect Module
          </span>
          <span className="text-xs text-indigo-200">
            {profile.department || 'National Statistical Systems Training Academy'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Welcome, {profile.fullName}
        </h1>
        <p className="text-xs sm:text-sm text-indigo-100 max-w-2xl">
          Curate official statistical training syllabi, ingest course manuals, generate validated AI assessments, and review officer question comprehension.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Faculty Overview
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'upload'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Ingest Learning Materials
        </button>
        <button
          onClick={() => setActiveTab('generator')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'generator'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          AI Assessment Generator
        </button>
        <button
          onClick={() => setActiveTab('review')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'review'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Question Quality Review ({generatedQuestions.length})
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-500 font-bold uppercase">Uploaded Syllabus Materials</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {uploadedMaterials.length} Documents
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Ready for semantic MCQ extraction</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-500 font-bold uppercase">Active Assessment Tests</span>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
                {quizzes.length} Tests
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Published to MoSPI officer cohorts</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-500 font-bold uppercase">AI Validation Accuracy</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                98.4%
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Automated fact & syllabus verification</p>
            </div>
          </div>

          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Published Cohort Assessments
            </h3>
            <div className="space-y-2.5">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {quiz.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {quiz.questions.length} Questions • {quiz.difficulty} Difficulty • Domain: {quiz.competencyDomain}
                    </p>
                  </div>
                  <Link
                    href="/quizzes"
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                  >
                    View Test
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Upload Materials */}
      {activeTab === 'upload' && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-indigo-600" />
              Upload Official Syllabus & Training Documentation
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Ingest PDF manuals, circulars, or lecture slide decks to automatically generate diagnostic MCQs with YouTube & web references.
            </p>
          </div>

          <div className="space-y-3 max-w-lg">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Document Title
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. CPI Methodological Handbook 2025"
                className="w-full px-3 py-2 rounded-xl border text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target Competency Domain
              </label>
              <select
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border text-xs"
              >
                <option value="Statistical Competencies">Statistical Competencies</option>
                <option value="Technical Competencies">Technical Competencies</option>
                <option value="Digital Governance">Digital Governance</option>
                <option value="Behavioural & Managerial Competencies">Behavioural & Managerial</option>
              </select>
            </div>

            <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center space-y-2 bg-slate-50 dark:bg-slate-850">
              <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Drag and drop PDF/DOCX here, or browse
              </p>
              <p className="text-[10px] text-slate-400">Supported formats: PDF, DOCX, TXT (Max 50MB)</p>
            </div>

            <button
              onClick={() => {
                if (!newTitle.trim()) return;
                addUploadedMaterial({
                  title: newTitle,
                  fileName: `${newTitle.replace(/\s+/g, '_')}.pdf`,
                  fileType: 'pdf',
                  fileSizeMb: 5.4,
                  uploadedBy: profile.fullName,
                  targetDomain: newDomain,
                  extractedConcepts: ['Core Formulas', 'Field Operational Guidelines'],
                  summary: 'Comprehensive guidelines and operational standards for statistical enumeration and validation.',
                  totalQuestionsGenerated: 0,
                  status: 'processing',
                });
                alert('Training document indexed successfully!');
                setNewTitle('');
                setActiveTab('generator');
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm"
            >
              Ingest Document for AI Extraction
            </button>
          </div>
        </div>
      )}

      {/* Tab: Generator */}
      {activeTab === 'generator' && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-600" />
              AI MCQ & Assessment Generator
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Select topic and difficulty to automatically compose fact-validated diagnostic questions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target Topic
              </label>
              <input
                type="text"
                value={targetTopic}
                onChange={(e) => setTargetTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border text-xs"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Number of Questions
              </label>
              <input
                type="number"
                min={3}
                max={15}
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border text-xs"
              />
            </div>
          </div>

          <button
            onClick={handleRunGenerator}
            disabled={isGenerating}
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/25 flex items-center gap-2"
          >
            {isGenerating ? (
              <span>Synthesizing Questions via AI...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Questions for Review</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Tab: Review */}
      {activeTab === 'review' && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-600" />
                Review & Approve Questions
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Validate each question before releasing to officers on the testing portal.
              </p>
            </div>

            {generatedQuestions.length > 0 && (
              <button
                onClick={handlePublishAssessment}
                className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Publish to Learner Portal</span>
              </button>
            )}
          </div>

          {generatedQuestions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No questions generated yet. Go to "AI Assessment Generator" tab to build a new set.
            </div>
          ) : (
            <div className="space-y-4">
              {generatedQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2 text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-600">Question {idx + 1}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Quality Score: {q.qualityCheck?.score || 98}%
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {q.questionText}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {q.options?.map((opt: string, oIdx: number) => (
                      <div
                        key={oIdx}
                        className={`p-2 rounded-xl border text-[11px] ${
                          opt === q.correctAnswer
                            ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600'
                        }`}
                      >
                        {opt} {opt === q.correctAnswer && '✓ (Correct)'}
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    💡 <span className="font-semibold">Explanation:</span> {q.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
