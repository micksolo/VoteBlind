/**
 * Netlify Edge Function: Continue debate conversation
 *
 * POST /api/debate-continue
 * Body: { topicId, topicName, messages, userQuestion? }
 * Response: Server-Sent Events stream with new messages
 */

import Anthropic from 'npm:@anthropic-ai/sdk@0.39.0';

const MAX_MESSAGES = 20;
const MODEL = 'claude-3-5-haiku-20241022';

interface DebateMessage {
  side: 'left' | 'right' | 'center';
  text: string;
}

interface RequestBody {
  topicId: string;
  topicName: string;
  leftLabel: string;
  rightLabel: string;
  messages: DebateMessage[];
  userQuestion?: string;
}

const SYSTEM_PROMPT = `You continue political debates for Informed Vote, an Australian voter education app.

THREE CHARACTERS:
- PROGRESSIVE (left): Advocates collective action, government solutions. Passionate but evidence-based.
- LIBERTARIAN (right): Advocates individual freedom, market solutions. Practical and principled.
- CENTRIST (center): Bridges perspectives, adds nuance. Thoughtful, acknowledges trade-offs.

RULES:
1. Continue naturally from the conversation
2. If the user asked a question, have characters respond to it
3. Generate 2-3 short messages (1-2 sentences each)
4. Be adversarial but never personal
5. Use Australian context and spelling
6. Steelman both sides - give each strong arguments

OUTPUT FORMAT:
Return ONLY a JSON array, no other text:
[{"side": "left"|"right"|"center", "text": "..."}]`;

function buildContinuationPrompt(body: RequestBody): string {
  const { topicName, leftLabel, rightLabel, messages, userQuestion } = body;

  const formattedMessages = messages
    .map((m, i) => {
      const speaker = m.side === 'left' ? 'PROGRESSIVE' : m.side === 'right' ? 'LIBERTARIAN' : 'CENTRIST';
      return `${i + 1}. ${speaker}: "${m.text}"`;
    })
    .join('\n');

  let prompt = `Topic: ${topicName}
Progressive position: ${leftLabel}
Libertarian position: ${rightLabel}

CONVERSATION SO FAR:
${formattedMessages}

`;

  if (userQuestion) {
    prompt += `USER QUESTION: "${userQuestion}"

Generate 2-3 responses where the characters address this question from their perspectives.`;
  } else {
    prompt += `Continue the debate naturally with 2-3 more messages. Mix up which characters speak.`;
  }

  prompt += `

Remember: Return ONLY a valid JSON array like [{"side": "left", "text": "..."}, ...]`;

  return prompt;
}

export default async function handler(request: Request): Promise<Response> {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body: RequestBody = await request.json();
    const { messages, topicId, topicName } = body;

    // Validate
    if (!topicId || !topicName || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check conversation limit
    if (messages.length >= MAX_MESSAGES) {
      return new Response(JSON.stringify({
        error: 'Conversation limit reached',
        maxMessages: MAX_MESSAGES
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const client = new Anthropic({ apiKey });

    // Create streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          const response = await client.messages.create({
            model: MODEL,
            max_tokens: 500,
            system: SYSTEM_PROMPT,
            messages: [{ role: 'user', content: buildContinuationPrompt(body) }],
            stream: true,
          });

          let fullText = '';

          for await (const event of response) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              const text = event.delta.text;
              fullText += text;

              // Send the text chunk as SSE
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'text', content: text })}\n\n`));
            }
          }

          // Try to parse the final JSON and send structured messages
          try {
            // Clean up the response - handle markdown code blocks
            let jsonText = fullText.trim();
            if (jsonText.startsWith('```')) {
              jsonText = jsonText.replace(/```json?\n?/g, '').replace(/```$/g, '').trim();
            }

            const newMessages: DebateMessage[] = JSON.parse(jsonText);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'messages', content: newMessages })}\n\n`));
          } catch {
            // If JSON parsing fails, send error
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', content: 'Failed to parse response' })}\n\n`));
          }

          // Send done signal
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
          controller.close();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', content: errorMessage })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const config = {
  path: '/api/debate-continue',
};
