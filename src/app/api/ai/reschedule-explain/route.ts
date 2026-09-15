import { NextResponse } from 'next/server';
import { callAIModel } from '@/lib/aiClient';

export async function POST(req: Request) {
  try {
    const { taskTitle, timeDifferenceMins, nextTaskTitle, breaksPreserved } = await req.json();

    const prompt = `A student just finished studying "${taskTitle}".
Time difference: ${timeDifferenceMins > 0 ? `Finished ${timeDifferenceMins} minutes early` : `Took ${Math.abs(timeDifferenceMins)} minutes longer`}.
Next upcoming task: "${nextTaskTitle || 'Upcoming study session'}".
Breaks preserved: ${breaksPreserved ? 'Yes' : 'Adjusted'}.

Write a transparent, encouraging, 2-sentence explanation from the AI Academic Assistant explaining why the timetable was dynamically adjusted and reassuring the student.`;

    const result = await callAIModel({
      prompt,
      systemInstruction: 'You are an AI Academic Assistant specialized in adaptive schedule adjustments.',
    });

    if (result?.text) {
      return NextResponse.json({ explanation: result.text.trim(), source: `ai_${result.provider}` });
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
