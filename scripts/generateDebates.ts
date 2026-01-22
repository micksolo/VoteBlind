/**
 * Generate balanced policy debates using Claude Haiku
 *
 * Run with: ANTHROPIC_API_KEY=sk-ant-... npm run generate-debates
 * Dry run:  DRY_RUN=true npm run generate-debates
 *
 * Safeguards:
 * - Cost ceiling: $1.00 (aborts if exceeded)
 * - Max retries per topic: 3
 * - Detailed cost logging
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============ CONFIGURATION ============
const MODEL = 'claude-3-5-haiku-20241022';
const MAX_RETRIES = 3;
const COST_CEILING = 1.00; // USD - abort if exceeded
const DELAY_BETWEEN_TOPICS = 500; // ms

// Haiku pricing (per million tokens)
const PRICE_INPUT = 0.80;   // $0.80 per 1M input tokens
const PRICE_OUTPUT = 4.00;  // $4.00 per 1M output tokens

// ============ TYPES ============
interface TopicMetadata {
  id: string;
  name: string;
  icon: string;
  leftLabel: string;
  leftGain: string;
  leftCost: string;
  rightLabel: string;
  rightGain: string;
  rightCost: string;
}

interface DebateMessage {
  side: 'left' | 'right' | 'center';
  text: string;
}

interface GeneratedDebate {
  topicId: string;
  messages: DebateMessage[];
  generatedAt: string;
}

// ============ TOPIC DEFINITIONS ============
const TOPICS: TopicMetadata[] = [
  {
    id: 'climate',
    name: 'Climate & Energy',
    icon: '🌱',
    leftLabel: 'Green transition',
    leftGain: 'Clean energy, green jobs',
    leftCost: 'Higher transition costs',
    rightLabel: 'Market solutions',
    rightGain: 'Cheaper energy, choice',
    rightCost: 'Slower emission cuts',
  },
  {
    id: 'housing',
    name: 'Housing',
    icon: '🏠',
    leftLabel: 'Public housing',
    leftGain: 'Affordable homes guaranteed',
    leftCost: 'Higher public debt',
    rightLabel: 'Deregulate building',
    rightGain: 'More homes, lower prices',
    rightCost: 'Less planning control',
  },
  {
    id: 'economy',
    name: 'Economy & Tax',
    icon: '💼',
    leftLabel: 'Tax & invest',
    leftGain: 'Better public services',
    leftCost: 'Higher taxes',
    rightLabel: 'Cut taxes',
    rightGain: 'Keep more of your money',
    rightCost: 'Fewer public services',
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: '🏥',
    leftLabel: 'Universal public',
    leftGain: 'Free care for all',
    leftCost: 'Longer waits possible',
    rightLabel: 'Private choice',
    rightGain: 'No wait times, choice',
    rightCost: 'Pay out of pocket',
  },
  {
    id: 'immigration',
    name: 'Immigration',
    icon: '🌏',
    leftLabel: 'Higher intake',
    leftGain: 'Larger workforce',
    leftCost: 'More demand on services',
    rightLabel: 'Lower intake',
    rightGain: 'Less strain on infrastructure',
    rightCost: 'Slower economic growth',
  },
  {
    id: 'welfare',
    name: 'Welfare',
    icon: '🤝',
    leftLabel: 'Increase benefits',
    leftGain: 'Reduced poverty',
    leftCost: 'Higher government spending',
    rightLabel: 'Tighten eligibility',
    rightGain: 'Lower taxes, work incentives',
    rightCost: 'Some may fall through cracks',
  },
  {
    id: 'education',
    name: 'Education',
    icon: '📚',
    leftLabel: 'Public investment',
    leftGain: 'Equal opportunity',
    leftCost: 'Higher taxes',
    rightLabel: 'School choice',
    rightGain: 'Competition, parent choice',
    rightCost: 'Unequal outcomes',
  },
  {
    id: 'defense',
    name: 'Defence',
    icon: '🛡️',
    leftLabel: 'Diplomacy first',
    leftGain: 'Peace, lower spending',
    leftCost: 'Perceived as weak',
    rightLabel: 'Strong military',
    rightGain: 'Security, deterrence',
    rightCost: 'High costs, risk of conflict',
  },
  {
    id: 'indigenous',
    name: 'Indigenous Affairs',
    icon: '🪃',
    leftLabel: 'Self-determination',
    leftGain: 'Cultural preservation',
    leftCost: 'Complex implementation',
    rightLabel: 'Equal treatment',
    rightGain: 'Unified approach',
    rightCost: 'May ignore unique needs',
  },
  {
    id: 'cost-of-living',
    name: 'Cost of Living',
    icon: '💰',
    leftLabel: 'Government support',
    leftGain: 'Immediate relief',
    leftCost: 'May fuel inflation',
    rightLabel: 'Let markets adjust',
    rightGain: 'Long-term stability',
    rightCost: 'Short-term pain',
  },
];

// ============ SYSTEM PROMPT ============
const SYSTEM_PROMPT = `You generate balanced political debates for Informed Vote, an Australian voter education app.

THREE CHARACTERS:
- PROGRESSIVE (left): Advocates collective action, government solutions. Passionate but evidence-based. Uses "we" language.
- LIBERTARIAN (right): Advocates individual freedom, market solutions. Practical and principled. Uses "you" language.
- CENTRIST (center): Bridges perspectives, adds nuance. Thoughtful, acknowledges trade-offs. Uses "both sides have a point" framing.

CRITICAL RULES:
1. STEELMAN both sides - give each the STRONGEST possible argument
2. NO loaded language: avoid "handouts", "greedy", "nanny state", "bureaucrats"
3. Each side must acknowledge ONE weakness of their position
4. Use AUSTRALIAN context: Medicare, HECS, Australian dollar figures
5. Use AUSTRALIAN spelling: favour, colour, organisation
6. Keep messages SHORT: 1-2 sentences, 60-100 characters ideal, 150 max
7. Be ADVERSARIAL but never personal - attack ideas, not people
8. The centrist should add GENUINE value, not just "both sides have merit"

MESSAGE STRUCTURE (6 messages total):
1. Progressive: Opening argument
2. Libertarian: Counter-argument
3. Progressive: Rebuttal with evidence
4. Libertarian: Rebuttal with evidence
5. Centrist: Bridge or reframe the debate
6. Centrist: Honest articulation of the real trade-off

OUTPUT FORMAT:
Return ONLY a JSON array, no other text:
[
  {"side": "left", "text": "..."},
  {"side": "right", "text": "..."},
  {"side": "left", "text": "..."},
  {"side": "right", "text": "..."},
  {"side": "center", "text": "..."},
  {"side": "center", "text": "..."}
]`;

// ============ COST TRACKING ============
let totalInputTokens = 0;
let totalOutputTokens = 0;

function calculateCost(): number {
  const inputCost = (totalInputTokens / 1_000_000) * PRICE_INPUT;
  const outputCost = (totalOutputTokens / 1_000_000) * PRICE_OUTPUT;
  return inputCost + outputCost;
}

function logCost(label: string): void {
  const cost = calculateCost();
  console.log(`  💰 ${label}: $${cost.toFixed(4)} (${totalInputTokens} in / ${totalOutputTokens} out)`);
}

// ============ GENERATION ============
function buildTopicPrompt(topic: TopicMetadata): string {
  return `Generate a balanced 6-message debate for this Australian policy topic:

TOPIC: ${topic.name} ${topic.icon}

PROGRESSIVE POSITION: "${topic.leftLabel}"
- What you gain: ${topic.leftGain}
- What you trade: ${topic.leftCost}

LIBERTARIAN POSITION: "${topic.rightLabel}"
- What you gain: ${topic.rightGain}
- What you trade: ${topic.rightCost}

Remember:
- Steelman BOTH sides equally
- Include Australian-specific examples
- Centrist messages should add real insight, not fence-sit
- Keep each message punchy (1-2 sentences)`;
}

async function generateDebate(
  client: Anthropic,
  topic: TopicMetadata,
  isDryRun: boolean
): Promise<DebateMessage[]> {
  if (isDryRun) {
    console.log(`  [DRY RUN] Would generate debate for ${topic.name}`);
    return [
      { side: 'left', text: '[DRY RUN] Progressive opening...' },
      { side: 'right', text: '[DRY RUN] Libertarian counter...' },
      { side: 'left', text: '[DRY RUN] Progressive rebuttal...' },
      { side: 'right', text: '[DRY RUN] Libertarian rebuttal...' },
      { side: 'center', text: '[DRY RUN] Centrist bridge...' },
      { side: 'center', text: '[DRY RUN] Centrist conclusion...' },
    ];
  }

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildTopicPrompt(topic) }],
  });

  // Track tokens
  totalInputTokens += response.usage.input_tokens;
  totalOutputTokens += response.usage.output_tokens;

  // Check cost ceiling
  const currentCost = calculateCost();
  if (currentCost > COST_CEILING) {
    throw new Error(`COST CEILING EXCEEDED: $${currentCost.toFixed(4)} > $${COST_CEILING}`);
  }

  // Parse response
  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  // Extract JSON from response (handle potential markdown code blocks)
  let jsonText = content.text.trim();
  if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/```json?\n?/g, '').replace(/```$/g, '').trim();
  }

  const messages: DebateMessage[] = JSON.parse(jsonText);

  // Validate structure
  if (!Array.isArray(messages) || messages.length !== 6) {
    throw new Error(`Invalid message count: expected 6, got ${messages.length}`);
  }

  const expectedSides = ['left', 'right', 'left', 'right', 'center', 'center'];
  for (let i = 0; i < messages.length; i++) {
    if (messages[i].side !== expectedSides[i]) {
      throw new Error(`Message ${i} has wrong side: expected ${expectedSides[i]}, got ${messages[i].side}`);
    }
    if (typeof messages[i].text !== 'string' || messages[i].text.length < 20) {
      throw new Error(`Message ${i} has invalid text`);
    }
  }

  return messages;
}

async function generateWithRetry(
  client: Anthropic,
  topic: TopicMetadata,
  isDryRun: boolean
): Promise<DebateMessage[]> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`  Attempt ${attempt}/${MAX_RETRIES}...`);
      const messages = await generateDebate(client, topic, isDryRun);
      console.log(`  ✅ Success!`);
      return messages;
    } catch (error) {
      lastError = error as Error;
      console.log(`  ❌ Failed: ${lastError.message}`);

      if (lastError.message.includes('COST CEILING')) {
        throw lastError; // Don't retry cost ceiling errors
      }

      if (attempt < MAX_RETRIES) {
        console.log(`  Waiting before retry...`);
        await sleep(1000 * attempt); // Exponential backoff
      }
    }
  }

  throw lastError || new Error('Unknown error');
}

// ============ UTILITIES ============
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============ MAIN ============
async function main() {
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║  Informed Vote - Debate Generator                  ║');
  console.log('╚════════════════════════════════════════════════════╝');
  console.log('');

  const isDryRun = process.env.DRY_RUN === 'true';
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (isDryRun) {
    console.log('🔵 DRY RUN MODE - No API calls will be made');
    console.log('');
  } else {
    if (!apiKey) {
      console.error('❌ ERROR: ANTHROPIC_API_KEY environment variable is required');
      console.error('');
      console.error('Usage:');
      console.error('  ANTHROPIC_API_KEY=sk-ant-... npm run generate-debates');
      console.error('');
      console.error('For dry run (no API calls):');
      console.error('  DRY_RUN=true npm run generate-debates');
      process.exit(1);
    }
    console.log('🟢 LIVE MODE - API calls will be made');
    console.log(`   Model: ${MODEL}`);
    console.log(`   Cost ceiling: $${COST_CEILING.toFixed(2)}`);
    console.log(`   Max retries: ${MAX_RETRIES}`);
    console.log('');
  }

  const client = new Anthropic({ apiKey: apiKey || 'dry-run' });
  const debates: GeneratedDebate[] = [];
  const failed: string[] = [];

  console.log(`Generating debates for ${TOPICS.length} topics...`);
  console.log('');

  for (const topic of TOPICS) {
    console.log(`📝 ${topic.icon} ${topic.name} (${topic.id})`);

    try {
      const messages = await generateWithRetry(client, topic, isDryRun);
      debates.push({
        topicId: topic.id,
        messages,
        generatedAt: new Date().toISOString(),
      });
      logCost('Running total');
    } catch (error) {
      const err = error as Error;
      console.log(`  ⛔ FAILED: ${err.message}`);
      failed.push(topic.id);

      if (err.message.includes('COST CEILING')) {
        console.log('');
        console.log('🛑 ABORTING: Cost ceiling exceeded');
        break;
      }
    }

    console.log('');

    // Rate limiting delay
    if (TOPICS.indexOf(topic) < TOPICS.length - 1) {
      await sleep(DELAY_BETWEEN_TOPICS);
    }
  }

  // Summary
  console.log('════════════════════════════════════════════════════');
  console.log('SUMMARY');
  console.log('════════════════════════════════════════════════════');
  console.log(`✅ Successful: ${debates.length}/${TOPICS.length}`);
  console.log(`❌ Failed: ${failed.length} ${failed.length > 0 ? `(${failed.join(', ')})` : ''}`);
  logCost('Total cost');
  console.log('');

  if (debates.length === 0) {
    console.error('No debates generated. Exiting.');
    process.exit(1);
  }

  // Write output
  const outputPath = path.join(__dirname, '../src/data/generatedDebates.ts');
  const output = `// Auto-generated by scripts/generateDebates.ts
// Generated: ${new Date().toISOString()}
// Model: ${MODEL}
// Topics: ${debates.length}/${TOPICS.length}
// Cost: $${calculateCost().toFixed(4)}

import type { DebateMessage } from '../types';

export interface GeneratedDebate {
  topicId: string;
  messages: DebateMessage[];
  generatedAt: string;
}

export const GENERATED_DEBATES: GeneratedDebate[] = ${JSON.stringify(debates, null, 2)};

// Quick lookup by topic ID
export const DEBATES_BY_TOPIC: Record<string, DebateMessage[]> = {
${debates.map(d => `  '${d.topicId}': GENERATED_DEBATES.find(d => d.topicId === '${d.topicId}')!.messages,`).join('\n')}
};
`;

  fs.writeFileSync(outputPath, output);
  console.log(`📁 Output written to: ${outputPath}`);
  console.log('');
  console.log('✨ Done!');
}

main().catch((error) => {
  console.error('');
  console.error('💥 FATAL ERROR:', error.message);
  process.exit(1);
});
