import { NextResponse } from 'next/server';
import { callAIModel } from '@/lib/aiClient';

export async function POST(req: Request) {
  try {
    const { messages, tutorName, personality, systemPrompt, topicContext } = await req.json();

    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const sysInstruction = `${systemPrompt || 'You are an expert AI academic tutor.'}\nTutor Name: ${tutorName || 'Tutor'}\nTeaching Style: ${personality || 'Socratic and clear'}\nActive Topic Context: ${topicContext || 'General academic concepts'}`;

    const result = await callAIModel({
      messages: (messages || []).map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content || '',
      })),
      systemInstruction: sysInstruction,
    });

    if (result?.text) {
      return NextResponse.json({ reply: result.text, source: `ai_${result.provider}` });
    }

    // High-quality contextual fallback responses
    const queryLower = lastUserMessage.toLowerCase();
    let reply = '';

    if (queryLower.includes('two sum') || (queryLower.includes('hash map') && queryLower.includes('array'))) {
      reply = `### Two Sum — Optimal $O(N)$ Hash Map Pattern ⚡\n\n**Problem**: Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to target.\n\n#### 1. Intuition:\nFor every element $x$, the required partner value is $complement = target - x$. We store each visited number along with its index in a hash map for $O(1)$ lookup.\n\n#### 2. Clean Implementation (TypeScript / Python):\n\`\`\`typescript\nfunction twoSum(nums: number[], target: number): number[] {\n  const seen = new Map<number, number>(); // num -> index\n  \n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (seen.has(complement)) {\n      return [seen.get(complement)!, i];\n    }\n    seen.set(nums[i], i);\n  }\n  return [];\n}\n\`\`\`\n\n- **Time Complexity**: $O(N)$ — Single pass through array.\n- **Space Complexity**: $O(N)$ — In worst case, storing $N$ entries in the hash map.`;
    } else if (queryLower.includes('dijkstra') || (queryLower.includes('shortest path') && queryLower.includes('graph'))) {
      reply = `### Dijkstra's Shortest Path Algorithm 🧭\n\n**Goal**: Find the shortest path from a single source node to all other vertices in a weighted graph with non-negative edge weights.\n\n#### Core Mechanism:\n1. Maintain a min-heap (priority queue) of \`(distance, vertex)\` pairs.\n2. Initialize source distance as \`0\` and all other vertices as \`Infinity\`.\n3. Greedily extract the vertex with minimum distance and relax all outgoing edges:\n$$\\text{If } dist[u] + weight(u, v) < dist[v] \\implies dist[v] = dist[u] + weight(u, v)$$\n\n- **Time Complexity**: $O((V + E) \\log V)$ using a Binary Min-Heap.\n- **Space Complexity**: $O(V + E)$ for adjacency list and distance array.\n- **Constraint Warning**: Dijkstra fails with **negative weight cycles**; use **Bellman-Ford** if negative weights exist!`;
    } else if (queryLower.includes('knapsack') || queryLower.includes('dynamic programming')) {
      reply = `### 0/1 Knapsack Dynamic Programming Blueprint 🎒\n\n**State Definition**: Let \`dp[i][w]\` be the maximum value attainable using a subset of the first \`i\` items with knapsack capacity \`w\`.\n\n#### State Transition Equation:\n$$\\text{dp}[i][w] = \\max\\Big(\\text{dp}[i-1][w], \\quad \\text{values}[i-1] + \\text{dp}[i-1][w - \\text{weights}[i-1]]\\Big)$$\n*(Only include item if $weights[i-1] \\le w$)*\n\n#### Space Optimization to $O(W)$:\nBecause each row only relies on the row directly above it, we can collapse the matrix to a 1D array by iterating backwards from $W$ down to $weight$ to prevent using the same item multiple times:\n\`\`\`python\nfor weight, val in items:\n    for w in range(W, weight - 1, -1):\n        dp[w] = max(dp[w], dp[w - weight] + val)\n\`\`\``;
    } else if (queryLower.includes('polymorphism') || queryLower.includes('override')) {
      reply = `**Polymorphism** in Java/OOP literally means "many forms" and allows an object to take on different behaviors depending on its runtime type.\n\n### Two Main Types:\n- **Compile-Time (Static) Polymorphism**: Method Overloading (same method name, different signatures).\n- **Runtime (Dynamic) Polymorphism**: Method Overriding (subclass provides a specific implementation).\n\n💡 **Key Takeaway**: The method that gets executed is decided at **runtime** based on the actual object instance!`;
    } else if (queryLower.includes('differential') || queryLower.includes('integration') || queryLower.includes('calculus')) {
      reply = `Let's break down this mathematical concept step-by-step! 📐\n\n### Standard Form for First-Order Linear ODEs:\n$$\\frac{dy}{dx} + P(x)y = Q(x)$$\n\n**Step 1:** Calculate Integrating Factor: $IF = e^{\\int P(x) dx}$\n**Step 2:** Integrate: $y \\cdot (IF) = \\int (Q(x) \\cdot IF) dx + C$`;
    } else if (queryLower.includes('quiz') || queryLower.includes('test me')) {
      reply = `Here is a quick diagnostic DSA question for you:\n\n**Question**: What is the worst-case time complexity of searching for an element in an unbalanced Binary Search Tree (BST)?\n\n*A)* $O(1)$\n*B)* $O(\\log N)$\n*C)* $O(N)$\n*D)* $O(N \\log N)$\n\nTake a guess and I'll break down how self-balancing trees (AVL / Red-Black) prevent degradation! 🎯`;
    } else {
      reply = `Great question regarding **${topicContext || 'your study session'}**!\n\nHere is how to think about this conceptually:\n1. **Core Intuition**: Break the problem down into its fundamental building blocks.\n2. **Common Trap**: Pay close attention to edge cases (e.g. empty arrays, $O(N^2)$ vs $O(N \\log N)$ constraints, off-by-one errors).\n3. **Active Practice**: Trace the algorithm on a small example with pencil and paper.\n\nWould you like me to walk through a concrete code implementation or provide a visual dry-run? 🚀`;
    }

    return NextResponse.json({ reply, source: 'heuristic_tutor' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
