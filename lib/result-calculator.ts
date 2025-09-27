import type { Question, VillainKey } from "@/lib/types";

export interface AnswerMeta {
  seq: number; // sequence number of when it was answered
  answerIndex: number;
}

export interface ScoreResult {
  scores: Record<VillainKey, number>;
  earliestSeqForVillain: Record<VillainKey, number>;
  winningVillain: VillainKey;
  resultPath: string;
}

export type TieBreaker = "earliest" | "random";

/**
 * ResultCalculator service for efficient score computation with memoization
 * Handles both legacy and new data formats with proper type safety
 */
export class ResultCalculator {
  private memoizedResults = new Map<string, ScoreResult>();
  private questions: readonly Question[];
  private tieBreaker: TieBreaker;

  constructor(
    questions: readonly Question[],
    tieBreaker: TieBreaker = "earliest"
  ) {
    this.questions = questions;
    this.tieBreaker = tieBreaker;
  }

  /**
   * Calculate the final result with memoization
   * Returns the winning villain and result path
   */
  calculateResult(
    selectedAnswers: Record<number, AnswerMeta>
  ): ScoreResult | null {
    // Create cache key from selected answers
    const cacheKey = this.createCacheKey(selectedAnswers);

    // Check memoized results first
    if (this.memoizedResults.has(cacheKey)) {
      return this.memoizedResults.get(cacheKey)!;
    }

    // Compute scores if not cached
    const { scores, earliestSeqForVillain } =
      this.computeScores(selectedAnswers);

    if (Object.keys(scores).length === 0) {
      return null;
    }

    // Find winning villain
    const winningVillain = this.resolveTie(scores, earliestSeqForVillain);

    const resultPath = `/quiz/results/${winningVillain}`;

    const result: ScoreResult = {
      scores,
      earliestSeqForVillain,
      winningVillain,
      resultPath,
    };

    // Cache the result
    this.memoizedResults.set(cacheKey, result);

    return result;
  }

  /**
   * Compute scores from selected answers with runtime validation
   * Handles both legacy and new data formats
   */
  computeScores(answersMap: Record<number, AnswerMeta>): {
    scores: Record<VillainKey, number>;
    earliestSeqForVillain: Record<VillainKey, number>;
  } {
    const scores: Record<VillainKey, number> = {} as Record<VillainKey, number>;
    const earliestSeqForVillain: Record<VillainKey, number> = {} as Record<
      VillainKey,
      number
    >;

    Object.entries(answersMap).forEach(([qIndexStr, meta]) => {
      if (!meta) return;

      const questionIndex = Number(qIndexStr);
      const question = this.questions[questionIndex];

      if (!question) {
        console.warn(`Question not found for index ${questionIndex}`);
        return;
      }

      const answer = question.answers[meta.answerIndex];
      if (!answer) {
        console.warn(
          `Answer not found for question ${questionIndex}, answer index ${meta.answerIndex}`
        );
        return;
      }

      // Runtime validation for villain data - handle both legacy and new formats
      const villainsArray = this.extractVillains(
        answer,
        questionIndex,
        meta.answerIndex
      );

      if (!villainsArray || villainsArray.length === 0) {
        return;
      }

      // Process each villain in the answer
      villainsArray.forEach((villain) => {
        if (!villain) {
          console.warn(
            `Empty villain key found in question ${questionIndex}, answer ${meta.answerIndex}`
          );
          return;
        }

        // Increment score
        scores[villain] = (scores[villain] || 0) + 1;

        // Track earliest sequence for tie-breaking
        const existingSeq = earliestSeqForVillain[villain];
        if (existingSeq === undefined || meta.seq < existingSeq) {
          earliestSeqForVillain[villain] = meta.seq;
        }
      });
    });

    return { scores, earliestSeqForVillain };
  }

  /**
   * Extract villains array from answer, handling both legacy and new formats
   */
  private extractVillains(
    answer: any,
    questionIndex: number,
    answerIndex: number
  ): VillainKey[] | null {
    // New format: villains array
    if (answer.villains && Array.isArray(answer.villains)) {
      return answer.villains as VillainKey[];
    }

    // Legacy format: single villain property
    if (answer.villain && typeof answer.villain === "string") {
      console.warn(
        `Legacy villain format detected in question ${questionIndex}, answer ${answerIndex}. Consider updating to villains array.`
      );
      return [answer.villain as VillainKey];
    }

    // Invalid format
    console.warn(
      `Invalid villains data for question ${questionIndex}, answer ${answerIndex}:`,
      answer
    );
    return null;
  }

  /**
   * Resolve ties using the configured tie-breaking strategy
   */
  private resolveTie(
    scores: Record<VillainKey, number>,
    earliestSeqForVillain: Record<VillainKey, number>
  ): VillainKey {
    const entries = Object.entries(scores) as [VillainKey, number][];

    if (entries.length === 0) {
      throw new Error("No scores available for tie resolution");
    }

    // Find maximum score
    const maxScore = Math.max(...entries.map(([, score]) => score));

    // Get all villains with the maximum score
    const topVillains = entries
      .filter(([, score]) => score === maxScore)
      .map(([villain]) => villain);

    // If only one winner, return immediately
    if (topVillains.length === 1) {
      return topVillains[0];
    }

    // Handle tie-breaking
    if (this.tieBreaker === "earliest") {
      return this.resolveEarliestTie(topVillains, earliestSeqForVillain);
    } else {
      return this.resolveRandomTie(topVillains);
    }
  }

  /**
   * Resolve tie by selecting villain with earliest sequence number
   */
  private resolveEarliestTie(
    topVillains: VillainKey[],
    earliestSeqForVillain: Record<VillainKey, number>
  ): VillainKey {
    let bestVillain = topVillains[0];
    let bestSeq =
      earliestSeqForVillain[bestVillain] ?? Number.POSITIVE_INFINITY;

    for (let i = 1; i < topVillains.length; i++) {
      const villain = topVillains[i];
      const seq = earliestSeqForVillain[villain] ?? Number.POSITIVE_INFINITY;

      if (seq < bestSeq) {
        bestSeq = seq;
        bestVillain = villain;
      }
    }

    return bestVillain;
  }

  /**
   * Resolve tie by random selection
   */
  private resolveRandomTie(topVillains: VillainKey[]): VillainKey {
    const randomIndex = Math.floor(Math.random() * topVillains.length);
    return topVillains[randomIndex];
  }

  /**
   * Create a cache key from selected answers for memoization
   */
  private createCacheKey(selectedAnswers: Record<number, AnswerMeta>): string {
    const sortedEntries = Object.entries(selectedAnswers)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([qIndex, meta]) => `${qIndex}:${meta.answerIndex}:${meta.seq}`);

    return `${this.tieBreaker}|${sortedEntries.join("|")}`;
  }

  /**
   * Clear memoization cache (useful for testing or memory management)
   */
  clearCache(): void {
    this.memoizedResults.clear();
  }

  /**
   * Get cache statistics for monitoring
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.memoizedResults.size,
      keys: Array.from(this.memoizedResults.keys()),
    };
  }
}
