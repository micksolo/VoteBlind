import { useState, useCallback } from 'react';
import type { DebateMessage, PolicyTopic } from '../types';

interface UseDebateConversationOptions {
  topic: PolicyTopic;
  initialMessages: DebateMessage[];
  maxMessages?: number;
}

interface UseDebateConversationReturn {
  messages: DebateMessage[];
  isGenerating: boolean;
  streamingText: string;
  error: string | null;
  canContinue: boolean;
  continueDebate: (userQuestion?: string) => Promise<void>;
  resetConversation: () => void;
}

export function useDebateConversation({
  topic,
  initialMessages,
  maxMessages = 20,
}: UseDebateConversationOptions): UseDebateConversationReturn {
  const [messages, setMessages] = useState<DebateMessage[]>(initialMessages);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const canContinue = messages.length < maxMessages && !isGenerating;

  const continueDebate = useCallback(async (userQuestion?: string) => {
    if (!canContinue) return;

    setIsGenerating(true);
    setStreamingText('');
    setError(null);

    try {
      const response = await fetch('/api/debate-continue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId: topic.id,
          topicName: topic.name,
          leftLabel: topic.leftLabel,
          rightLabel: topic.rightLabel,
          messages,
          userQuestion,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to continue debate');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response stream');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process SSE messages
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === 'text') {
                setStreamingText(prev => prev + data.content);
              } else if (data.type === 'messages') {
                // Add new messages to conversation
                const newMessages = data.content as DebateMessage[];
                setMessages(prev => [...prev, ...newMessages]);
                setStreamingText('');
              } else if (data.type === 'error') {
                setError(data.content);
              }
            } catch {
              // Ignore JSON parse errors for incomplete messages
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsGenerating(false);
      setStreamingText('');
    }
  }, [canContinue, topic, messages]);

  const resetConversation = useCallback(() => {
    setMessages(initialMessages);
    setError(null);
    setStreamingText('');
  }, [initialMessages]);

  return {
    messages,
    isGenerating,
    streamingText,
    error,
    canContinue,
    continueDebate,
    resetConversation,
  };
}
