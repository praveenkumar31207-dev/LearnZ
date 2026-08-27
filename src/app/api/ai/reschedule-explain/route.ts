import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { taskTitle, timeDifferenceMins, nextTaskTitle, breaksPreserved } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY;

    if (apiKey && process.env.GEMINI_API_KEY) {
      try {
        const prompt = `A student just finished studying "${taskTitle}".
Time difference: ${timeDifferenceMins > 0 ? `Finished ${timeDifferenceMins} minutes early` : `Took ${Math.abs(timeDifferenceMins)} minutes longer`}.
Next upcoming task: "${nextTaskTitle || 'Upcoming study session'}".
Breaks preserved: ${breaksPreserved ? 'Yes' : 'Adjusted'}.

Write a transparent, encouraging, 2-sentence explanation from the AI Academic Assistant explaining why the timetable was dynamically adjusted and reassuring the student.`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const explanation = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (explanation) {
            return NextResponse.json({ explanation, source: 'ai_gemini' });
          }
        }
      } catch (err) {
        console.warn('Gemini explanation failed, using fallback template', err);
      }
    }

    let explanation = '';
    if (timeDifferenceMins > 0) {
      explanation = `You completed "${taskTitle}" ${timeDifferenceMins} minutes ahead of schedule! The AI pulled forward "${nextTaskTitle || 'your next task'}" to keep momentum high while preserving all scheduled breaks.`;
    } else {
      explanation = `Session ran ${Math.abs(timeDifferenceMins)} minutes over planned duration. Upcoming lower-priority tasks have been shifted to prevent cramming and protect your evening rest.`;
    }

    return NextResponse.json({ explanation, source: 'template_fallback' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
