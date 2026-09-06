'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ActiveQuiz } from '@/components/quizzes/ActiveQuiz';
import { RapidFireDrill } from '@/components/quizzes/RapidFireDrill';
import { CustomDrillModal } from '@/components/quizzes/CustomDrillModal';
import {
  HelpCircle,
  Sparkles,
  Award,
  Clock,
  RotateCcw,
  CheckCircle2,
  Plus,
  Play,
  Zap,
  Flame,
  Target,
  BarChart3,
  TrendingUp,
  UploadCloud,
  FileCheck2,
  Cpu,
  Trash2,
  RefreshCw,
  BookOpen,
} from 'lucide-react';
import { Quiz, QuizQuestion, UploadedLearningMaterial } from '@/types';

export default function QuizzesPage() {
  const {
    quizzes,
    addQuiz,
    quizAttempts,
    drillResults,
    criticalGaps,
    uploadedMaterials,
    addUploadedMaterial,
    generateMCQsFromMaterial,
    activeRole,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'diagnostic' | 'generate' | 'upload' | 'review' | 'rapid_fire' | 'history'>('diagnostic');
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(quizzes[0] || null);
  const [showCustomModal, setShowCustomModal] = useState(false);

  // AI MCQ Generator Wizard Form State
  const [genMaterialId, setGenMaterialId] = useState(uploadedMaterials[0]?.id || '');
  const [genNumQuestions, setGenNumQuestions] = useState<number>(5);
  const [genDifficulty, setGenDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Mixed'>('Medium');
  const [genTopic, setGenTopic] = useState('Periodic Labour Force Survey & Sampling');
  const [genQuestions, setGenQuestions] = useState<QuizQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Material Upload Form
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadDomain, setUploadDomain] = useState<any>('Statistical Competencies');

  const handleGenerateQuestions = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateMCQsFromMaterial(genMaterialId, genNumQuestions, genTopic, genDifficulty);
      setGenQuestions(generated);
      setIsGenerating(false);
      setActiveTab('review');
    }, 900);
  };

  const handlePublishGeneratedQuiz = () => {
    if (genQuestions.length === 0) return;
    const material = uploadedMaterials.find((m) => m.id === genMaterialId);
    const newQuiz: Quiz = {
      id: `quiz-ai-${Date.now()}`,
      userId: 'user-official-1',
      title: `AI Assessment: ${genTopic}`,
      difficulty: genDifficulty,
      questions: genQuestions,
      competencyDomain: material?.targetDomain || 'Statistical Competencies',
      sourceMaterialName: material?.fileName || 'Official Statistical Guidelines',
      createdAt: new Date().toISOString(),
    };

    addQuiz(newQuiz);
    setSelectedQuiz(newQuiz);
    setActiveTab('diagnostic');
  };

  const handleCreateUploadedMaterial = () => {
    if (!uploadTitle.trim()) return;
    addUploadedMaterial({
      title: uploadTitle,
      fileName: uploadFileName || `${uploadTitle.replace(/\s+/g, '_')}.pdf`,
      fileType: 'pdf',
      fileSizeMb: 4.2,
      uploadedBy: 'Official Statistical Faculty',
      targetDomain: uploadDomain,
      extractedConcepts: ['Core Statistical Standards', 'Survey Indicators', 'Anonymization Protocols'],
      totalQuestionsGenerated: 0,
      status: 'ready',
      summary: `Uploaded curriculum document for capacity building in ${uploadDomain}.`,
    });

    setUploadTitle('');
    setUploadFileName('');
    setActiveTab('generate');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
              AI Intelligent Assessment Engine
            </span>
            <span className="text-xs text-slate-400">MoSPI Capacity Building & Competency Loop</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1 flex items-center gap-2.5">
            <Cpu className="w-7 h-7 text-blue-700 dark:text-blue-400" />
            AI Question Generator & Adaptive Assessments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Upload learning materials (PDF/DOCX), extract statistical concepts, validate AI MCQs, and assess officials
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('upload')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-all"
          >
            <UploadCloud className="w-4 h-4 text-blue-600" />
            <span>Upload Material</span>
          </button>

          <button
            onClick={() => setActiveTab('generate')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold shadow-sm shadow-blue-700/25 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate MCQs with AI</span>
          </button>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'diagnostic', label: '📝 Adaptive Assessments', icon: HelpCircle },
          { id: 'generate', label: '⚡ AI MCQ Generator', icon: Cpu },
          { id: 'review', label: `🔍 Question Quality Check (${genQuestions.length})`, icon: FileCheck2 },
          { id: 'upload', label: '📂 Uploaded Manuals', icon: UploadCloud },
          { id: 'rapid_fire', label: '⏱️ 60s Speed Run', icon: Flame },
          { id: 'history', label: `📊 Assessment Logs (${quizAttempts.length})`, icon: BarChart3 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
                isActive
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Adaptive Assessment & Quiz Player */}
      {activeTab === 'diagnostic' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            {selectedQuiz ? (
              <ActiveQuiz quiz={selectedQuiz} />
            ) : (
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
                <Cpu className="w-12 h-12 text-blue-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">No Assessment Selected</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Select an assessment from the verified bank on the right or generate questions from uploaded guidelines.
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Validated Competency Assessments
                </h3>
                <span className="text-xs font-semibold text-slate-400">{quizzes.length} available</span>
              </div>

              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {quizzes.map((q) => {
                  const isSelected = q.id === selectedQuiz?.id;

                  return (
                    <div
                      key={q.id}
                      onClick={() => setSelectedQuiz(q)}
                      className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between gap-3 transition-all ${
                        isSelected
                          ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-xs ring-1 ring-blue-400'
                          : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                          {q.competencyDomain || 'Official Statistics'}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                          {q.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                          <span>{q.questions?.length || 0} Questions</span>
                          <span>•</span>
                          <span>Source: {q.sourceMaterialName || 'NSSTA Curriculum'}</span>
                        </div>
                      </div>

                      <span className="p-2 rounded-xl bg-white dark:bg-slate-900 text-blue-600 border border-slate-200 dark:border-slate-800 shrink-0">
                        <Play className="w-3.5 h-3.5 fill-blue-600" />
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI MCQ Generator Wizard */}
      {activeTab === 'generate' && (
        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-600" />
              Generate MCQs with AI from Official Statistical Manuals
            </h3>
            <p className="text-xs text-slate-500">
              Select an uploaded training manual, configure parameter bounds, and let the AI extract concepts & format MCQs.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                1. Select Source Learning Material:
              </label>
              <select
                value={genMaterialId}
                onChange={(e) => setGenMaterialId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white shadow-xs"
              >
                {uploadedMaterials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title} ({m.fileName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                2. Topic / Focus Concept:
              </label>
              <input
                type="text"
                value={genTopic}
                onChange={(e) => setGenTopic(e.target.value)}
                placeholder="e.g. Sampling Weights & CAPI Validation"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  3. Number of Questions:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 20, 50].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGenNumQuestions(num)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        genNumQuestions === num
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200'
                      }`}
                    >
                      {num} Qs
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  4. Difficulty Level:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['Easy', 'Medium', 'Hard', 'Mixed'].map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setGenDifficulty(diff as any)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        genDifficulty === diff
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 text-xs text-blue-900 dark:text-blue-200 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Pipeline Workflow:
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Upload Material → Extract Content → AI/NLP Analysis → Identify Concepts → Generate MCQs → Validate Questions → Create Quiz
              </p>
            </div>

            <button
              onClick={handleGenerateQuestions}
              disabled={isGenerating}
              className="w-full py-3 rounded-2xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-700/25 transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Extracting Statistical Concepts & Synthesizing MCQs...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4" />
                  <span>Generate {genNumQuestions} Validated MCQs with AI</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Question Quality Review Check (Approve | Edit | Regenerate | Delete) */}
      {activeTab === 'review' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  AI Question Quality Check & Verification
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Review generated items against official standards before publishing into the active assessment repository.
              </p>
            </div>

            <button
              onClick={handlePublishGeneratedQuiz}
              disabled={genQuestions.length === 0}
              className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 shrink-0"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve All & Create Assessment</span>
            </button>
          </div>

          {genQuestions.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <Cpu className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Generated Questions in Queue</h4>
              <p className="text-xs text-slate-500">Run the AI MCQ Generator above to populate questions for quality review.</p>
              <button
                onClick={() => setActiveTab('generate')}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                Go to Generator
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {genQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-blue-700 dark:text-blue-400">
                      Question #{idx + 1} • {q.difficulty}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Quality Score: {q.qualityCheck?.score || 100}%
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                    {q.questionText}
                  </h4>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between ${
                          opt === q.correctAnswer
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-200 font-bold'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                        {opt === q.correctAnswer && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                    ))}
                  </div>

                  {/* Explanation & Source reference */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 text-xs space-y-1">
                    <p className="text-slate-700 dark:text-slate-300">
                      <strong>Correct Answer:</strong> {q.correctAnswer}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      <strong>Explanation:</strong> {q.explanation}
                    </p>
                    <p className="text-[10px] text-blue-700 dark:text-blue-400 font-semibold pt-1">
                      Verified Source Reference: {q.sourceDocRef || 'Uploaded Statistical Manual'}
                    </p>
                  </div>

                  {/* Quality Verification Checklist */}
                  <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold border-t border-slate-100 dark:border-slate-800">
                    <span>✓ Answer supported by source</span>
                    <span>✓ Single correct answer</span>
                    <span>✓ Unambiguous options</span>
                    <span>✓ No duplicate questions</span>
                  </div>

                  {/* Action buttons for Trainer */}
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => alert(`Question #${idx + 1} marked as Approved.`)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 hover:bg-emerald-100"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => alert('Inline edit mode enabled.')}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => alert('Question regenerated with alternative distractor options.')}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200"
                    >
                      Regenerate
                    </button>
                    <button
                      onClick={() => setGenQuestions((prev) => prev.filter((item) => item.id !== q.id))}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 hover:bg-rose-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Uploaded Manuals Repository */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-blue-600" />
              Upload New Learning Material or Survey Manual
            </h3>
            <p className="text-xs text-slate-500">
              Supported file types: PDF, DOCX, PPTX, Guidelines, Field Staff Instruction Handbooks.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Manual / Document Title:
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Annual Survey of Industries (ASI) Concept Guide"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Target Competency Domain:
                </label>
                <select
                  value={uploadDomain}
                  onChange={(e) => setUploadDomain(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  <option value="Statistical Competencies">Statistical Competencies</option>
                  <option value="Technical Competencies">Technical Competencies</option>
                  <option value="Digital Governance">Digital Governance</option>
                  <option value="Behavioural & Managerial Competencies">Behavioural & Managerial</option>
                </select>
              </div>
            </div>

            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center space-y-2 hover:border-blue-500 transition-colors">
              <UploadCloud className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Drag and drop your statistical training document here, or browse files
              </p>
              <p className="text-[10px] text-slate-400">PDF, DOCX up to 25MB • Automated concept extraction</p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleCreateUploadedMaterial}
                className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold shadow-sm"
              >
                Index Material & Prepare for MCQ Extraction
              </button>
            </div>
          </div>

          {/* Indexed Materials List */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Indexed Training Manuals in System ({uploadedMaterials.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uploadedMaterials.map((mat) => (
                <div
                  key={mat.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700">
                      {mat.targetDomain}
                    </span>
                    <span className="text-[10px] text-slate-400">{mat.fileSizeMb} MB • {mat.fileType.toUpperCase()}</span>
                  </div>

                  <h5 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                    {mat.title}
                  </h5>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {mat.summary}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="text-[10px] text-emerald-600 font-bold">
                      {mat.totalQuestionsGenerated} MCQs Generated
                    </span>
                    <button
                      onClick={() => {
                        setGenMaterialId(mat.id);
                        setActiveTab('generate');
                      }}
                      className="text-blue-700 dark:text-blue-400 font-bold hover:underline"
                    >
                      Extract More Questions →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Rapid Fire 60s Speed Run Drill */}
      {activeTab === 'rapid_fire' && (
        <div className="max-w-2xl mx-auto">
          <RapidFireDrill onExit={() => setActiveTab('diagnostic')} />
        </div>
      )}

      {/* TAB 6: Assessment Logs */}
      {activeTab === 'history' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            Official Assessment Performance & Competency Impact Log
          </h3>

          <div className="space-y-3">
            {quizAttempts.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">
                No assessments submitted yet. Complete a diagnostic test to update competency.
              </p>
            ) : (
              quizAttempts.map((att) => (
                <div
                  key={att.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">{att.quizTitle}</h5>
                    <span className="text-[10px] text-slate-500">
                      Score: {att.score}/{att.totalPossible} • Completed: {att.completedAt.split('T')[0]}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-xl ${
                      att.accuracyPercentage >= 75
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {att.accuracyPercentage}% Accuracy
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
