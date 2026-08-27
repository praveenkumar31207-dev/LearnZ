import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, tutorName, personality, systemPrompt, topicContext } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY;
    const lastUserMessage = messages[messages.length - 1]?.content || '';

    if (apiKey && process.env.GEMINI_API_KEY) {
      try {
        const fullPrompt = `${systemPrompt || 'You are an expert AI academic tutor.'}\nTutor Name: ${tutorName || 'Tutor'}\nTeaching Style: ${personality || 'Socratic and clear'}\nActive Topic Context: ${topicContext || 'General academic concepts'}\n\nStudent question: ${lastUserMessage}\n\nProvide an engaging, helpful, educational response with code snippets or step-by-step math breakdowns where relevant:`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: fullPrompt }] }],
            }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return NextResponse.json({ reply, source: 'ai_gemini' });
          }
        }
      } catch (err) {
        console.warn('Gemini chat failed, falling back to heuristic tutor engine', err);
      }
    }

    // High-quality contextual fallback responses
    const queryLower = lastUserMessage.toLowerCase();
    let reply = '';

    if (queryLower.includes('polymorphism') || queryLower.includes('override')) {
      reply = `**Polymorphism** in Java literally means "many forms" and allows an object to take on different behaviors depending on its runtime type.\n\n### 1. Two Main Types:\n- **Compile-Time (Static) Polymorphism**: Method Overloading (same method name, different signatures).\n- **Runtime (Dynamic) Polymorphism**: Method Overriding (subclass provides a specific implementation of a method defined in its superclass).\n\n\`\`\`java\nclass Animal {\n    void makeSound() {\n        System.out.println("Animal sound");\n    }\n}\nclass Dog extends Animal {\n    @Override\n    void makeSound() {\n        System.out.println("Woof! 🐶");\n    }\n}\n\nAnimal myPet = new Dog();\nmyPet.makeSound(); // Outputs: Woof! (Dynamic dispatch)\n\`\`\`\n\n💡 **Key Takeaway**: The method that gets executed is decided at **runtime** based on the actual object instance, not the reference type!`;
    } else if (queryLower.includes('differential') || queryLower.includes('integration') || queryLower.includes('calculus')) {
      reply = `Let's break down this mathematical concept step-by-step! 📐\n\n### Standard Form for First-Order Linear ODEs:\n$$\\frac{dy}{dx} + P(x)y = Q(x)$$\n\n**Step 1:** Calculate the Integrating Factor (IF):\n$$IF = e^{\\int P(x) dx}$$\n\n**Step 2:** Multiply both sides and integrate:\n$$y \\cdot (IF) = \\int \\big(Q(x) \\cdot IF\\big) dx + C$$\n\nTry applying this to $\\frac{dy}{dx} + 2y = 4$. What would your $P(x)$ and $Q(x)$ be?`;
    } else if (queryLower.includes('quiz') || queryLower.includes('test me')) {
      reply = `Here is a quick diagnostic question for you:\n\n**Question**: In Java, can a \`static\` method override an instance method defined in the parent class?\n\n*A)* Yes, using the \`@Override\` annotation.\n*B)* No, static methods are hidden (method hiding), not overridden.\n*C)* Only if both methods are \`public\`.\n\nTake a guess and I'll explain the mechanics! 🎯`;
    } else {
      reply = `Great question regarding **${topicContext || 'your study session'}**!\n\nHere is how to think about this conceptually:\n1. **Core Intuition**: Break the problem down into its fundamental building blocks.\n2. **Common Exam Trap**: Pay close attention to boundary conditions and edge cases.\n3. **Practical Application**: Try writing a small 5-line code snippet or calculating a sample problem with concrete numbers to verify your understanding.\n\nWould you like me to walk you through a specific example or generate a quick practice question? 🚀`;
    }

    return NextResponse.json({ reply, source: 'heuristic_tutor' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
