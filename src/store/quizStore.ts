import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  PolicyTopic,
  Party,
  PartyPosition,
  PartyScore,
  TopicBreakdown,
  SliderPosition,
} from '../types';

interface QuizStore {
  // Single stage: slider positions (-2 to +2)
  topicPositions: Record<string, SliderPosition>;

  // Progress
  currentTopicIndex: number;

  // Data (loaded from sample or Supabase)
  topics: PolicyTopic[];
  parties: Party[];
  partyPositions: PartyPosition[];

  // Location
  postcode: string;
  electorate: string | null;

  // Results
  results: PartyScore[] | null;
  completed: boolean;

  // Actions
  setTopicPosition: (topicId: string, position: SliderPosition) => void;
  nextTopic: () => void;
  previousTopic: () => void;
  goToTopic: (index: number) => void;
  finishQuiz: () => void;
  setPostcode: (postcode: string) => void;
  setElectorate: (electorate: string) => void;
  setTopics: (topics: PolicyTopic[]) => void;
  setParties: (parties: Party[]) => void;
  setPartyPositions: (positions: PartyPosition[]) => void;
  calculateResults: () => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      // Initial state
      topicPositions: {},
      currentTopicIndex: 0,
      topics: [],
      parties: [],
      partyPositions: [],
      postcode: '',
      electorate: null,
      results: null,
      completed: false,

      setTopicPosition: (topicId, position) => {
        set((state) => ({
          topicPositions: {
            ...state.topicPositions,
            [topicId]: position,
          },
        }));
      },

      nextTopic: () => {
        const { currentTopicIndex, topics } = get();
        if (currentTopicIndex < topics.length - 1) {
          set({ currentTopicIndex: currentTopicIndex + 1 });
        }
      },

      previousTopic: () => {
        set((state) => ({
          currentTopicIndex: Math.max(state.currentTopicIndex - 1, 0),
        }));
      },

      goToTopic: (index) => {
        set({ currentTopicIndex: Math.max(0, index) });
      },

      finishQuiz: () => {
        set({ completed: true });
        get().calculateResults();
      },

      setPostcode: (postcode) => set({ postcode }),
      setElectorate: (electorate) => set({ electorate }),
      setTopics: (topics) => set({ topics }),
      setParties: (parties) => set({ parties }),
      setPartyPositions: (positions) => set({ partyPositions: positions }),

      calculateResults: () => {
        const { topicPositions, topics, parties, partyPositions } = get();

        // Build position lookup: party_id-topic_id -> position
        const positionMap = new Map<string, SliderPosition>();
        for (const pos of partyPositions) {
          positionMap.set(`${pos.party_id}-${pos.topic_id}`, pos.position);
        }

        const partyScores: PartyScore[] = [];

        for (const party of parties) {
          let totalScore = 0;
          let totalTopics = 0;
          const breakdown: TopicBreakdown[] = [];

          for (const topic of topics) {
            const userPosition = topicPositions[topic.id];
            if (userPosition === undefined) continue;

            const partyPosition = positionMap.get(`${party.id}-${topic.id}`) ?? 0;

            // Calculate distance (0-4 scale)
            let distance: number;

            if (userPosition === 0) {
              // User neutral - partial match to everything (distance = 1)
              distance = 1;
            } else {
              // Direct distance calculation
              distance = Math.abs(userPosition - partyPosition);
            }

            // Convert to score: 0 distance = 100%, 4 distance = 0%
            const topicScore = 1 - distance / 4;
            totalScore += topicScore;
            totalTopics += 1;

            // Aligned if within 1 step and both on same side (or user neutral)
            const aligned = userPosition === 0 ||
              (Math.sign(userPosition) === Math.sign(partyPosition) && distance <= 1);

            breakdown.push({
              topic,
              userPosition,
              partyPosition,
              aligned,
              distance,
            });
          }

          const score = totalTopics > 0 ? (totalScore / totalTopics) * 100 : 50;

          partyScores.push({
            party,
            score: Math.round(score),
            breakdown: breakdown.sort((a, b) => a.distance - b.distance),
          });
        }

        // Sort by score
        partyScores.sort((a, b) => b.score - a.score);

        set({ results: partyScores });
      },

      resetQuiz: () => {
        set({
          topicPositions: {},
          currentTopicIndex: 0,
          postcode: '',
          electorate: null,
          results: null,
          completed: false,
        });
      },
    }),
    {
      name: 'voteblind-quiz-v3',
      partialize: (state) => ({
        topicPositions: state.topicPositions,
        postcode: state.postcode,
        electorate: state.electorate,
        currentTopicIndex: state.currentTopicIndex,
        completed: state.completed,
      }),
    }
  )
);
