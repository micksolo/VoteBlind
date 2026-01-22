# LLM Debate Feature - Implementation Plan

## Overview

Hybrid architecture for dynamic policy debates with 3 AI characters:
- **Progressive** (left, blue) - advocates collective/government solutions
- **Libertarian** (right, purple) - advocates individual freedom/market solutions
- **Centrist** (center, teal) - bridges perspectives, adds nuance

### User Flow
1. User loads topic → sees 6 pre-generated messages instantly
2. User can reveal messages progressively (2 at a time)
3. After viewing all 6, two options appear:
   - **"Keep debating"** → real-time LLM generates 2-3 more messages
   - **"Ask a question"** → user types question, characters respond
4. Conversation continues until 20 message limit

### Tech Stack
- Frontend: React + TypeScript + Vite + Tailwind + Framer Motion (existing)
- Backend: Netlify Edge Functions (streaming support)
- LLM: Claude Haiku (fast, cheap)
- Streaming: Server-Sent Events (SSE)

---

## Phase 1: Type & Data Structure Updates

### 1.1 Update Types (`src/types/index.ts`)

```typescript
// Extend side type to include center
export type DebateSide = 'left' | 'right' | 'center';

export interface DebateMessage {
  side: DebateSide;
  text: string;
}

// New: for real-time conversation state
export interface ConversationState {
  topicId: string;
  messages: DebateMessage[];
  isGenerating: boolean;
  error?: string;
}
```

### 1.2 Update Topic Data Structure

Keep existing `PolicyTopic` but ensure `debate` array has 6 messages:
- Messages 1-2: Progressive and Libertarian opening positions
- Messages 3-4: Rebuttals
- Messages 5-6: Centrist interjections with one response

Pattern: `left, right, left, right, center, left/right`

---

## Phase 2: Centrist Character & UI

### 2.1 New Character (`src/components/Debate/DebateCharacter.tsx`)

Add third SVG character with:
- **Hair**: Teal `#26A69A` with highlights `#4DB6AC`
- **Collar**: Teal `#00897B`
- **Expression**: Thoughtful, neutral (not spiky like Progressive, not slicked like Libertarian)
- **Aria-label**: "Centrist character"

### 2.2 Update DebateBubble (`src/components/Debate/DebateBubble.tsx`)

Center messages styled differently:
- **Layout**: `flex-col items-center` (centered, not left/right aligned)
- **Bubble**: `bg-teal-50 text-teal-900 border border-dashed border-teal-300`
- **No tail**: Fully rounded bubble (no speech pointer)
- **Animation**: Slightly slower entrance (0.4s vs 0.3s)

### 2.3 Update DebateView (`src/components/Debate/DebateView.tsx`)

- Handle `side === 'center'` in `getIsSelected()` - center never highlighted
- When `selectedSide === 0` (neutral), highlight centrist messages

---

## Phase 3: Pre-Generated Debates

### 3.1 Generation Script (`scripts/generateDebates.ts`)

```typescript
// Uses @anthropic-ai/sdk
// Generates 6 messages per topic using balanced prompts
// Outputs to src/data/generatedDebates.ts
```

### 3.2 System Prompt (for generation)

```
You generate balanced political debates for VoteBlind, an Australian voter education app.

THREE CHARACTERS:
- PROGRESSIVE: Advocates collective action, government solutions. Warm but evidence-based.
- LIBERTARIAN: Advocates individual freedom, market solutions. Practical but not callous.
- CENTRIST: Bridges perspectives, adds nuance. Thoughtful, not wishy-washy.

RULES:
1. STEELMAN both sides - strongest possible arguments
2. NO loaded language ("handouts", "greedy", "nanny state")
3. Each side acknowledges ONE weakness
4. Use Australian context and spelling
5. 1-2 sentences per message, punchy and conversational
6. Adversarial but NEVER personal

OUTPUT: 6 messages in order: left, right, left, right, center, right
```

### 3.3 Per-Topic Prompt Template

```
Topic: {name}
Left position: {leftLabel} - Gain: {leftGain}, Cost: {leftCost}
Right position: {rightLabel} - Gain: {rightGain}, Cost: {rightCost}

Generate 6 debate messages as JSON array.
```

---

## Phase 4: Netlify Edge Function (Streaming API)

### 4.1 File: `netlify/edge-functions/debate-continue.ts`

```typescript
import Anthropic from '@anthropic-ai/sdk';

export default async (request: Request) => {
  const { topicId, messages, userQuestion } = await request.json();

  // Validate
  if (messages.length >= 20) {
    return new Response(JSON.stringify({ error: 'Conversation limit reached' }), { status: 400 });
  }

  // Build prompt with conversation history
  const prompt = buildContinuationPrompt(topicId, messages, userQuestion);

  // Stream response
  const client = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') });

  const stream = await client.messages.stream({
    model: 'claude-3-5-haiku-20241022',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }],
  });

  // Return as SSE
  return new Response(stream.toReadableStream(), {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
};

export const config = { path: '/api/debate-continue' };
```

### 4.2 Continuation Prompt

```
You are continuing a political debate on "{topicName}" for VoteBlind.

PREVIOUS MESSAGES:
{formatted messages}

{userQuestion ? `USER ASKED: "${userQuestion}"` : 'Continue the debate naturally.'}

Generate 2-3 short responses from the characters (Progressive, Libertarian, or Centrist).
Keep responses to 1-2 sentences each. Be punchy and conversational.

Return JSON: [{ "side": "left"|"right"|"center", "text": "..." }, ...]
```

### 4.3 Environment Variables

In Netlify dashboard, set:
- `ANTHROPIC_API_KEY`: sk-ant-...

---

## Phase 5: Frontend Integration

### 5.1 New Hook: `useDebateConversation`

```typescript
// src/hooks/useDebateConversation.ts
export function useDebateConversation(topic: PolicyTopic) {
  const [messages, setMessages] = useState<DebateMessage[]>(topic.debate);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState('');

  const continueDebate = async (userQuestion?: string) => {
    if (messages.length >= 20) return;
    setIsGenerating(true);

    const response = await fetch('/api/debate-continue', {
      method: 'POST',
      body: JSON.stringify({ topicId: topic.id, messages, userQuestion }),
    });

    // Handle SSE streaming
    const reader = response.body.getReader();
    // ... parse and append messages
  };

  return { messages, isGenerating, streamingText, continueDebate, canContinue: messages.length < 20 };
}
```

### 5.2 Update DebateView

Add after existing messages:

```tsx
{/* Interactive section - appears after pre-gen exhausted */}
{visibleCount >= preGenCount && canContinue && (
  <div className="mt-4 space-y-3">
    <button onClick={() => continueDebate()} disabled={isGenerating}>
      {isGenerating ? 'Thinking...' : 'Keep debating'}
    </button>

    <form onSubmit={(e) => { e.preventDefault(); continueDebate(question); }}>
      <input
        placeholder="Ask a question about this topic..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button type="submit" disabled={isGenerating || !question}>Ask</button>
    </form>

    {messages.length >= 20 && (
      <p className="text-gray-400 text-xs">Conversation limit reached</p>
    )}
  </div>
)}

{/* Streaming indicator */}
{isGenerating && streamingText && (
  <DebateBubble side="..." text={streamingText} isStreaming />
)}
```

---

## Phase 6: Generation Script for Pre-Gen Debates

### 6.1 Script Structure (`scripts/generateDebates.ts`)

```typescript
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';

const TOPICS = [
  { id: 'climate', name: 'Climate & Energy', ... },
  // ... all 10 topics
];

async function generateDebate(topic: TopicMetadata): Promise<DebateMessage[]> {
  const client = new Anthropic();

  const response = await client.messages.create({
    model: 'claude-3-5-haiku-20241022',
    max_tokens: 1000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildTopicPrompt(topic) }],
  });

  return parseDebateResponse(response.content[0].text);
}

async function main() {
  const debates: Record<string, DebateMessage[]> = {};

  for (const topic of TOPICS) {
    console.log(`Generating debate for ${topic.name}...`);
    debates[topic.id] = await generateDebate(topic);
    await sleep(500); // Rate limiting
  }

  // Write output
  const output = `// Auto-generated: ${new Date().toISOString()}
import type { DebateMessage } from '../types';

export const GENERATED_DEBATES: Record<string, DebateMessage[]> = ${JSON.stringify(debates, null, 2)};
`;

  fs.writeFileSync(
    path.join(__dirname, '../src/data/generatedDebates.ts'),
    output
  );

  console.log('Done! Generated debates for', Object.keys(debates).length, 'topics');
}

main().catch(console.error);
```

### 6.2 NPM Script

Add to `package.json`:
```json
{
  "scripts": {
    "generate-debates": "npx tsx scripts/generateDebates.ts"
  },
  "devDependencies": {
    "@anthropic-ai/sdk": "^0.39.0",
    "tsx": "^4.7.0"
  }
}
```

---

## Implementation Order (for Ralph Loop)

### Batch 1: Foundation (No LLM needed)
1. Update `src/types/index.ts` - add `DebateSide`, update `DebateMessage`
2. Update `src/components/Debate/DebateCharacter.tsx` - add centrist SVG
3. Update `src/components/Debate/DebateBubble.tsx` - handle center styling
4. Update `src/components/Debate/DebateView.tsx` - handle center selection

### Batch 2: Pre-Generated Content
5. Create `scripts/generateDebates.ts` - generation script
6. Add dependencies to `package.json`
7. Run generation, review output
8. Update `src/data/topicsData.ts` - integrate generated debates

### Batch 3: Real-Time Backend
9. Create `netlify/edge-functions/debate-continue.ts`
10. Create `netlify.toml` with edge function config
11. Test locally with `netlify dev`

### Batch 4: Interactive UI
12. Create `src/hooks/useDebateConversation.ts`
13. Update `DebateView.tsx` with interactive controls
14. Add streaming message display
15. Add question input form

### Batch 5: Polish
16. Add loading states and error handling
17. Add rate limiting feedback
18. Test full flow
19. Deploy and verify

---

## File Checklist

### New Files
- [ ] `netlify/edge-functions/debate-continue.ts`
- [ ] `netlify.toml`
- [ ] `scripts/generateDebates.ts`
- [ ] `src/data/generatedDebates.ts` (generated)
- [ ] `src/hooks/useDebateConversation.ts`

### Modified Files
- [ ] `src/types/index.ts`
- [ ] `src/components/Debate/DebateCharacter.tsx`
- [ ] `src/components/Debate/DebateBubble.tsx`
- [ ] `src/components/Debate/DebateView.tsx`
- [ ] `src/data/topicsData.ts`
- [ ] `package.json`

---

## Success Criteria

1. [ ] Centrist character renders with teal styling
2. [ ] Pre-generated 6 messages load instantly
3. [ ] "Keep debating" generates 2-3 new messages via streaming
4. [ ] "Ask a question" sends user input and gets character responses
5. [ ] Conversation stops at 20 messages
6. [ ] Selecting "Neutral" highlights centrist bubbles
7. [ ] Works on Netlify deployment
