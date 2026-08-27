import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { topicTitle, subjectName, difficulty } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY;

    if (apiKey && process.env.GEMINI_API_KEY) {
      try {
        const prompt = `Generate a 4-question diagnostic quiz for the topic "${topicTitle}" in "${subjectName || 'Computer Science'}" with difficulty level "${difficulty || 'Medium'}".
Include a mix of MCQs, conceptual questions, and code/numerical problems.

Return ONLY a valid JSON array of questions with this exact structure:
[
  {
    "questionText": "What is ...?",
    "questionType": "mcq",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "Detailed explanation...",
    "difficulty": "Medium"
  }
]`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: 'application/json' },
            }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (jsonText) {
            const parsed = JSON.parse(jsonText);
            return NextResponse.json({ questions: parsed, source: 'ai_gemini' });
          }
        }
      } catch (err) {
        console.warn('Gemini quiz generation failed, falling back to deterministic quiz generator', err);
      }
    }

    // High-quality fallback questions
    const fallbackQuestions = [
      {
        id: `q-${Date.now()}-1`,
        questionText: `Which fundamental principle is demonstrated when applying ${topicTitle || 'this concept'}?`,
        questionType: 'mcq',
        options: [
          'Encapsulation of state and separation of concerns',
          'Linear memory allocation in contiguous blocks',
          'Implicit conversion between incompatible types',
          'Non-deterministic runtime compilation',
        ],
        correctAnswer: 'Encapsulation of state and separation of concerns',
        explanation: `${topicTitle} relies on clean architectural abstraction and encapsulation to guarantee robust execution and maintainability.`,
        difficulty: 'Easy',
      },
      {
        id: `q-${Date.now()}-2`,
        questionText: `What is the primary operational trade-off when optimizing ${topicTitle || 'this module'}?`,
        questionType: 'mcq',
        options: [
          'Time Complexity vs Space Complexity overhead',
          'Hardware clock cycle degradation',
          'Loss of compile-time type safety',
          'Permanent network socket locking',
        ],
        correctAnswer: 'Time Complexity vs Space Complexity overhead',
        explanation: 'In academic computer science, optimization almost invariably balances execution speed against supplementary memory caching.',
        difficulty: 'Medium',
      },
      {
        id: `q-${Date.now()}-3`,
        questionText: `Is ${topicTitle || 'this concept'} evaluated at compile-time or dynamic runtime in modern architectures?`,
        questionType: 'true_false',
        options: ['Compile-Time', 'Dynamic Runtime'],
        correctAnswer: 'Dynamic Runtime',
        explanation: 'Most modern execution environments resolve polymorphic method tables and virtual dispatch tables dynamically at runtime.',
        difficulty: 'Medium',
      },
      {
        id: `q-${Date.now()}-4`,
        questionText: `In an exam setting, what is the most critical edge-case to verify when dealing with ${topicTitle || 'this topic'}?`,
        questionType: 'mcq',
        options: [
          'Null references, empty collections, and zero-boundary inputs',
          'System font rendering parameters',
          'Default IDE theme configurations',
          'External monitor refresh rates',
        ],
        correctAnswer: 'Null references, empty collections, and zero-boundary inputs',
        explanation: 'Edge cases such as null guards, off-by-one errors, and division-by-zero are high-frequency targets for exam graders.',
        difficulty: 'Hard',
      },
    ];

    return NextResponse.json({ questions: fallbackQuestions, source: 'heuristic_quiz' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
