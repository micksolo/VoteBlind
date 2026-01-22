/**
 * Scoring utilities for VoteBlind
 *
 * The main scoring logic is now in the store (quizStore.ts).
 * This file contains helper functions for displaying results.
 */

/**
 * Get a human-readable description of alignment level
 */
export function getAlignmentDescription(score: number): string {
  if (score >= 80) return 'Strongly aligned';
  if (score >= 65) return 'Well aligned';
  if (score >= 50) return 'Moderately aligned';
  if (score >= 35) return 'Somewhat aligned';
  return 'Weakly aligned';
}

/**
 * Get Tailwind color class for alignment score
 */
export function getAlignmentColor(score: number): string {
  if (score >= 70) return 'text-green-600';
  if (score >= 50) return 'text-yellow-600';
  return 'text-red-600';
}

/**
 * Get background color class for alignment score
 */
export function getAlignmentBgColor(score: number): string {
  if (score >= 70) return 'bg-green-100';
  if (score >= 50) return 'bg-yellow-100';
  return 'bg-red-100';
}
