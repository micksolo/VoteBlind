// Core domain types for VoteBlind

export interface Jurisdiction {
  id: string;
  name: string;
  level: 'federal' | 'state' | 'local';
  country: string;
}

export interface Election {
  id: string;
  jurisdiction_id: string;
  name: string;
  election_date: string;
  is_active: boolean;
}

export interface Electorate {
  id: string;
  election_id: string;
  name: string;
  state: string;
  type: 'lower' | 'upper';
}

export interface Party {
  id: string;
  name: string;
  short_name: string;
  color: string;
  logo_url?: string;
  coalition_group_id?: string;
}

export interface Candidate {
  id: string;
  election_id: string;
  electorate_id: string;
  party_id?: string;
  name: string;
  incumbent: boolean;
  ballot_position?: number;
}

// Policy Topics - the core issues voters care about
export interface PolicyTopic {
  id: string;
  name: string;
  icon?: string;
  // Left position (progressive/socialist)
  leftLabel: string;
  leftGain: string;  // ✓ what you get
  leftCost: string;  // ✗ what you trade
  // Right position (libertarian)
  rightLabel: string;
  rightGain: string; // ✓ what you get
  rightCost: string; // ✗ what you trade
}

// Trade-off options for each topic
export interface TradeOffOption {
  id: string;
  label: string;
  description: string;
}

// A topic with its trade-off question
export interface TopicQuestion {
  id: string;
  topic: PolicyTopic;
  tradeOffPrompt: string; // e.g., "On climate action, which approach do you prefer?"
  options: TradeOffOption[];
}

// Party positions on the left-right spectrum for each topic
export type ConfidenceLevel = 'explicit' | 'inferred' | 'estimated' | 'unknown';

// Party position: -2 (strong left), -1 (lean left), 0 (neutral), 1 (lean right), 2 (strong right)
export interface PartyPosition {
  party_id: string;
  topic_id: string;
  position: SliderPosition; // Where this party sits on the left-right spectrum for this topic
  confidence: ConfidenceLevel;
  source_url?: string;
  source_description?: string;
}

// User quiz state (client-side only, never sent to server)
export type ImportanceLevel = 1 | 2 | 3 | 4 | 5;

export interface TopicImportance {
  topicId: string;
  importance: ImportanceLevel;
}

export interface TopicPreference {
  topicId: string;
  selectedOptionId: string | null; // null = no preference / skipped
}

// Slider position: -2 (strong left), -1 (lean left), 0 (neutral), 1 (lean right), 2 (strong right)
export type SliderPosition = -2 | -1 | 0 | 1 | 2;

export interface QuizState {
  // Single stage: slider position for each topic
  topicPositions: Record<string, SliderPosition>;

  // Progress
  currentTopicIndex: number;

  // Location
  electorate?: string;
  postcode?: string;

  completed: boolean;
}

// Results types
export interface PartyScore {
  party: Party;
  score: number; // 0-100 percentage match
  breakdown: TopicBreakdown[];
}

export interface TopicBreakdown {
  topic: PolicyTopic;
  userPosition: SliderPosition;
  partyPosition: SliderPosition;
  aligned: boolean;
  distance: number; // 0-4, lower is better
}

// Electorate lookup
export interface PostcodeMapping {
  postcode: string;
  electorates: {
    electorate_id: string;
    electorate_name: string;
    state: string;
    confidence: number;
    suburbs?: string[];
  }[];
}

// Legacy types for backward compatibility during migration
export interface Question {
  id: string;
  election_id: string;
  policy_area_id: string;
  text: string;
  description?: string;
  order: number;
}

export interface AnswerOption {
  value: 1 | 2 | 3 | 4 | 5;
  label: string;
}

export const ANSWER_OPTIONS: AnswerOption[] = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' },
];

export interface UserAnswer {
  questionId: string;
  value: 1 | 2 | 3 | 4 | 5;
  isImportant: boolean;
  skipped: boolean;
}

export interface PolicyArea {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface PartyPolicy {
  id: string;
  party_id: string;
  question_id: string;
  position: 1 | 2 | 3 | 4 | 5;
  confidence: ConfidenceLevel;
  source_url?: string;
  source_description?: string;
}

export interface QuestionBreakdown {
  question: Question;
  userAnswer: number;
  partyPosition: number;
  confidence: ConfidenceLevel;
  contribution: number;
}

// Importance labels
export const IMPORTANCE_LABELS: Record<ImportanceLevel, string> = {
  1: 'Not important',
  2: 'Slightly important',
  3: 'Moderately important',
  4: 'Very important',
  5: 'Critical to my vote',
};
