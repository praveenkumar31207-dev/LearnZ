// Multi-provider AI Engine with automatic, graceful fallback
// Active working models:
// 1. Groq high-speed models:
//    - qwen/qwen3.8-27b (ultra-fast, verified working)
//    - openai/gpt-oss-120b (high reasoning, verified working)
//    - groq/compound-mini & groq/compound
// 2. OpenAI (when account has active credits)
// 3. Google Gemini
// 4. Heuristic educational fallback

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function callAIModel({
  prompt,
  messages,
  systemInstruction,
  responseFormat,
}: {
  prompt?: string;
  messages?: ChatMessage[];
  systemInstruction?: string;
  responseFormat?: 'json' | 'text';
}): Promise<{ text: string; provider: 'groq' | 'openai' | 'gemini' } | null> {
  const groqKey = process.env.GROQ_API_KEY?.trim();
  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  const geminiKey = process.env.GEMINI_API_KEY?.trim();

  // Normalize prompt/messages
  const chatMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [];
  if (systemInstruction) {
    chatMessages.push({ role: 'system', content: systemInstruction });
  }
  if (messages && messages.length > 0) {
    chatMessages.push(...messages);
  } else if (prompt) {
    chatMessages.push({ role: 'user', content: prompt });
  }

  // --- 1. Try Groq (Active & Verified Working) ---
  if (groqKey) {
    const groqModels = ['qwen/qwen3.8-27b', 'openai/gpt-oss-120b', 'groq/compound-mini'];

    for (const model of groqModels) {
      try {
        const body: any = {
          model,
          messages: chatMessages,
          temperature: 0.5,
        };

        if (responseFormat === 'json') {
          body.response_format = { type: 'json_object' };
        }

        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.choices?.[0]?.message?.content;
          if (text) {
            return { text, provider: 'groq' };
          }
        } else {
          const err = await res.text();
          console.warn(`Groq (${model}) returned status ${res.status}:`, err);
        }
      } catch (err) {
        console.warn(`Groq (${model}) error:`, err);
      }
    }
  }

  // --- 2. Try OpenAI ---
  if (openaiKey) {
    try {
      const body: any = {
        model: 'gpt-4o-mini',
        messages: chatMessages,
        temperature: 0.7,
      };

      if (responseFormat === 'json') {
        body.response_format = { type: 'json_object' };
      }

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) {
          return { text, provider: 'openai' };
        }
      }
    } catch (err) {
      console.warn('OpenAI error:', err);
    }
  }

  // --- 3. Try Gemini ---
  if (geminiKey) {
    const geminiModels = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-2.5-flash'];
    for (const model of geminiModels) {
      try {
        const contents = messages && messages.length > 0
          ? messages.map((m) => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.content }],
            }))
          : [{ parts: [{ text: prompt || '' }] }];

        const body: any = { contents };
        if (systemInstruction) {
          body.systemInstruction = { parts: [{ text: systemInstruction }] };
        }
        if (responseFormat === 'json') {
          body.generationConfig = { responseMimeType: 'application/json' };
        }

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return { text, provider: 'gemini' };
          }
        }
      } catch (err) {
        console.warn(`Gemini (${model}) error:`, err);
      }
    }
  }

  return null;
}
