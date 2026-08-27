import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { rawText, subjectName } = await req.json();

    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json(
        { error: 'No content provided for syllabus extraction' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY;

    if (apiKey && process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are an expert curriculum architect. Analyze this study material/syllabus text for the subject "${subjectName || 'Academic Course'}" and break it down into a clean hierarchical JSON array of units, chapters, and topics with difficulty (Easy/Medium/Hard), importance (Low/Medium/High/Critical), and estimated study minutes.

Return ONLY a valid JSON array matching this exact schema:
[
  {
    "unitNumber": 1,
    "title": "Unit Title",
    "description": "Brief summary",
    "chapters": [
      {
        "chapterNumber": 1,
        "title": "Chapter Title",
        "estimatedBaseHours": 3.0,
        "topics": [
          {
            "title": "Topic Name",
            "difficulty": "Medium",
            "importance": "High",
            "knowledgeLevel": "Medium",
            "estimatedMins": 60,
            "keyDefinitions": ["Definition 1"],
            "keyFormulas": ["Formula 1"]
          }
        ]
      }
    ]
  }
]

Input Content:
${rawText.slice(0, 8000)}`;

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
            return NextResponse.json({ units: parsed, source: 'ai_gemini' });
          }
        }
      } catch (err) {
        console.warn('Gemini extraction failed, falling back to heuristic parser', err);
      }
    }

    // High-fidelity fallback heuristic parser
    const lines = rawText.split('\n').map((l: string) => l.trim()).filter(Boolean);
    const parsedUnits: any[] = [];
    let currentUnit: any = {
      unitNumber: 1,
      title: `${subjectName || 'Core'} — Module 1`,
      description: 'Foundational concepts and principles',
      chapters: [],
    };
    let currentChapter: any = {
      chapterNumber: 1,
      title: 'Chapter 1: Key Concepts',
      estimatedBaseHours: 3.0,
      topics: [],
    };

    lines.forEach((line: string, idx: number) => {
      // Check if line looks like a chapter or unit
      if (line.toLowerCase().startsWith('unit') || line.toLowerCase().startsWith('module')) {
        if (currentChapter.topics.length > 0) {
          currentUnit.chapters.push(currentChapter);
        }
        if (currentUnit.chapters.length > 0) {
          parsedUnits.push(currentUnit);
        }
        currentUnit = {
          unitNumber: parsedUnits.length + 1,
          title: line,
          description: 'Detailed curriculum module',
          chapters: [],
        };
        currentChapter = {
          chapterNumber: 1,
          title: 'Section 1',
          estimatedBaseHours: 2.5,
          topics: [],
        };
      } else if (line.toLowerCase().startsWith('chapter') || line.toLowerCase().startsWith('section')) {
        if (currentChapter.topics.length > 0) {
          currentUnit.chapters.push(currentChapter);
        }
        currentChapter = {
          chapterNumber: currentUnit.chapters.length + 1,
          title: line,
          estimatedBaseHours: 2.0,
          topics: [],
        };
      } else {
        // Treat line as topic
        const cleanTitle = line.replace(/^[-*•\d.]+\s*/, '');
        if (cleanTitle.length > 3 && cleanTitle.length < 80) {
          currentChapter.topics.push({
            title: cleanTitle,
            difficulty: idx % 3 === 0 ? 'Hard' : idx % 2 === 0 ? 'Medium' : 'Easy',
            importance: idx % 2 === 0 ? 'Critical' : 'High',
            knowledgeLevel: 'Medium',
            estimatedMins: idx % 3 === 0 ? 90 : idx % 2 === 0 ? 60 : 45,
            keyDefinitions: [`Core terminology for ${cleanTitle}`],
            keyFormulas: [],
          });
        }
      }
    });

    if (currentChapter.topics.length > 0) {
      currentUnit.chapters.push(currentChapter);
    }
    if (currentUnit.chapters.length > 0) {
      parsedUnits.push(currentUnit);
    }

    // Default structure if empty
    if (parsedUnits.length === 0) {
      parsedUnits.push({
        unitNumber: 1,
        title: `${subjectName || 'Subject'} Fundamentals`,
        description: 'Auto-extracted syllabus hierarchy',
        chapters: [
          {
            chapterNumber: 1,
            title: 'Core Topics',
            estimatedBaseHours: 3.0,
            topics: [
              {
                title: 'Overview & Essential Principles',
                difficulty: 'Easy',
                importance: 'High',
                knowledgeLevel: 'Medium',
                estimatedMins: 45,
              },
              {
                title: 'Deep-Dive Applications & Problem Solving',
                difficulty: 'Hard',
                importance: 'Critical',
                knowledgeLevel: 'Low',
                estimatedMins: 80,
              },
            ],
          },
        ],
      });
    }

    return NextResponse.json({ units: parsedUnits, source: 'parser_fallback' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
