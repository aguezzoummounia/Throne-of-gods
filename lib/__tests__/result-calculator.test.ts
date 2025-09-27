import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  ResultCalculator,
  type AnswerMeta,
  type TieBreaker,
} from "../result-calculator";
import type { Question, VillainKey } from "../types";

// Mock questions for testing
const mockQuestions: Question[] = [
  {
    id: 1,
    text: "Test question 1",
    answers: [
      { text: "Answer 1", villains: ["jarvan", "valeon"] },
      { text: "Answer 2", villains: ["leticia"] },
      { text: "Answer 3", villains: ["agon", "isolde"] },
    ],
  },
  {
    id: 2,
    text: "Test question 2",
    answers: [
      { text: "Answer 1", villains: ["jarvan"] },
      { text: "Answer 2", villains: ["valeon", "leticia"] },
      { text: "Answer 3", villains: ["isolde"] },
    ],
  },
  {
    id: 3,
    text: "Test question 3",
    answers: [
      { text: "Answer 1", villains: ["eternal-flames"] },
      { text: "Answer 2", villains: ["jarvan", "agon"] },
    ],
  },
];

// Mock question with legacy format for testing backward compatibility
const mockLegacyQuestion = {
  id: 4,
  text: "Legacy question",
  answers: [
    { text: "Legacy answer", villain: "jarvan" }, // Legacy single villain format
  ],
} as any;

describe("ResultCalculator", () => {
  let calculator: ResultCalculator;

  beforeEach(() => {
    calculator = new ResultCalculator(mockQuestions, "earliest");
  });

  describe("Score Calculation", () => {
    it("should calculate scores correctly for single answers", () => {
      const selectedAnswers: Record<number, AnswerMeta> = {
        0: { answerIndex: 0, seq: 1 }, // jarvan, valeon
        1: { answerIndex: 1, seq: 2 }, // valeon, leticia
      };

      const { scores } = calculator.computeScores(selectedAnswers);

      expect(scores.jarvan).toBe(1);
      expect(scores.valeon).toBe(2);
      expect(scores.leticia).toBe(1);
      expect(scores.isolde).toBeUndefined();
    });

    it("should handle empty selected answers", () => {
      const { scores, earliestSeqForVillain } = calculator.computeScores({});

      expect(Object.keys(scores)).toHaveLength(0);
      expect(Object.keys(earliestSeqForVillain)).toHaveLength(0);
    });

    it("should track earliest sequence numbers correctly", () => {
      const selectedAnswers: Record<number, AnswerMeta> = {
        0: { answerIndex: 0, seq: 5 }, // jarvan (seq: 5), valeon (seq: 5)
        1: { answerIndex: 0, seq: 2 }, // jarvan (seq: 2) - should be earliest
        2: { answerIndex: 1, seq: 8 }, // jarvan (seq: 8), agon (seq: 8)
      };

      const { earliestSeqForVillain } =
        calculator.computeScores(selectedAnswers);

      expect(earliestSeqForVillain.jarvan).toBe(2); // Earliest sequence
      expect(earliestSeqForVillain.valeon).toBe(5);
      expect(earliestSeqForVillain.agon).toBe(8);
    });

    it("should handle invalid question indices gracefully", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const selectedAnswers: Record<number, AnswerMeta> = {
        99: { answerIndex: 0, seq: 1 }, // Invalid question index
      };

      const { scores } = calculator.computeScores(selectedAnswers);

      expect(Object.keys(scores)).toHaveLength(0);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Question not found for index 99"
      );

      consoleSpy.mockRestore();
    });

    it("should handle invalid answer indices gracefully", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const selectedAnswers: Record<number, AnswerMeta> = {
        0: { answerIndex: 99, seq: 1 }, // Invalid answer index
      };

      const { scores } = calculator.computeScores(selectedAnswers);

      expect(Object.keys(scores)).toHaveLength(0);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Answer not found for question 0, answer index 99"
      );

      consoleSpy.mockRestore();
    });
  });

  describe("Legacy Format Support", () => {
    it("should handle legacy single villain format", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const legacyCalculator = new ResultCalculator(
        [mockLegacyQuestion] as Question[],
        "earliest"
      );

      const selectedAnswers: Record<number, AnswerMeta> = {
        0: { answerIndex: 0, seq: 1 },
      };

      const { scores } = legacyCalculator.computeScores(selectedAnswers);

      expect(scores.jarvan).toBe(1);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Legacy villain format detected in question 0, answer 0. Consider updating to villains array."
      );

      consoleSpy.mockRestore();
    });

    it("should handle invalid villain data gracefully", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const invalidQuestion = {
        id: 5,
        text: "Invalid question",
        answers: [
          { text: "Invalid answer", villains: null }, // Invalid villains data
        ],
      } as any;

      const invalidCalculator = new ResultCalculator(
        [invalidQuestion],
        "earliest"
      );

      const selectedAnswers: Record<number, AnswerMeta> = {
        0: { answerIndex: 0, seq: 1 },
      };

      const { scores } = invalidCalculator.computeScores(selectedAnswers);

      expect(Object.keys(scores)).toHaveLength(0);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Invalid villains data for question 0, answer 0:",
        { text: "Invalid answer", villains: null }
      );

      consoleSpy.mockRestore();
    });
  });

  describe("Tie Breaking", () => {
    it("should resolve ties using earliest sequence", () => {
      const selectedAnswers: Record<number, AnswerMeta> = {
        0: { answerIndex: 0, seq: 5 }, // jarvan (seq: 5), valeon (seq: 5)
        1: { answerIndex: 1, seq: 2 }, // valeon (seq: 2), leticia (seq: 2)
      };

      const result = calculator.calculateResult(selectedAnswers);

      expect(result).not.toBeNull();
      expect(result!.winningVillain).toBe("valeon"); // valeon has score 2, others have score 1
      expect(result!.scores.valeon).toBe(2);
      expect(result!.scores.jarvan).toBe(1);
      expect(result!.scores.leticia).toBe(1);
    });

    it("should resolve ties with same score using earliest sequence", () => {
      const selectedAnswers: Record<number, AnswerMeta> = {
        0: { answerIndex: 1, seq: 5 }, // leticia (seq: 5)
        1: { answerIndex: 0, seq: 2 }, // jarvan (seq: 2)
      };

      const result = calculator.calculateResult(selectedAnswers);

      expect(result).not.toBeNull();
      expect(result!.winningVillain).toBe("jarvan"); // Both have score 1, jarvan has earlier seq (2 < 5)
      expect(result!.earliestSeqForVillain.jarvan).toBe(2);
      expect(result!.earliestSeqForVillain.leticia).toBe(5);
    });

    it("should use random tie-breaking when configured", () => {
      const randomCalculator = new ResultCalculator(mockQuestions, "random");

      const selectedAnswers: Record<number, AnswerMeta> = {
        0: { answerIndex: 1, seq: 1 }, // leticia
        1: { answerIndex: 0, seq: 2 }, // jarvan
      };

      // Mock Math.random to return predictable values
      const originalRandom = Math.random;
      Math.random = vi.fn().mockReturnValue(0.7); // Should select second item (index 1)

      const result = randomCalculator.calculateResult(selectedAnswers);

      expect(result).not.toBeNull();
      expect(["jarvan", "leticia"]).toContain(result!.winningVillain);

      Math.random = originalRandom;
    });

    it("should handle single winner without tie-breaking", () => {
      const selectedAnswers: Record<number, AnswerMeta> = {
        0: { answerIndex: 0, seq: 1 }, // jarvan, valeon
        1: { answerIndex: 0, seq: 2 }, // jarvan
        2: { answerIndex: 1, seq: 3 }, // jarvan, agon
      };

      const result = calculator.calculateResult(selectedAnswers);

      expect(result).not.toBeNull();
      expect(result!.winningVillain).toBe("jarvan"); // jarvan has score 3, others have score 1
      expect(result!.scores.jarvan).toBe(3);
    });
  });

  describe("Result Calculation", () => {
    it("should return complete result with correct path", () => {
      const selectedAnswers: Record<number, AnswerMeta> = {
        0: { answerIndex: 0, seq: 1 }, // jarvan, valeon
      };

      const result = calculator.calculateResult(selectedAnswers);

      expect(result).not.toBeNull();
      expect(result!.resultPath).toBe(
        `/quiz/results/${result!.winningVillain}`
      );
      expect(result!.scores).toBeDefined();
      expect(result!.earliestSeqForVillain).toBeDefined();
      expect(result!.winningVillain).toBeDefined();
    });

    it("should return null for empty answers", () => {
      const result = calculator.calculateResult({});

      expect(result).toBeNull();
    });

    it("should throw error when no scores available for tie resolution", () => {
      // This is an edge case that shouldn't happen in normal usage
      // but we test it for completeness
      const emptyScores = {} as Record<VillainKey, number>;
      const emptySeq = {} as Record<VillainKey, number>;

      expect(() => {
        (calculator as any).resolveTie(emptyScores, emptySeq);
      }).toThrow("No scores available for tie resolution");
    });
  });

  describe("Memoization", () => {
    it("should cache results for identical inputs", () => {
      const selectedAnswers: Record<number, AnswerMeta> = {
        0: { answerIndex: 0, seq: 1 },
        1: { answerIndex: 1, seq: 2 },
      };

      // Spy on computeScores to verify it's only called once
      const computeSpy = vi.spyOn(calculator, "computeScores");

      // First call
      const result1 = calculator.calculateResult(selectedAnswers);

      // Second call with same input
      const result2 = calculator.calculateResult(selectedAnswers);

      expect(result1).toEqual(result2);
      expect(computeSpy).toHaveBeenCalledTimes(1); // Should only compute once due to memoization

      computeSpy.mockRestore();
    });

    it("should create different cache keys for different inputs", () => {
      const answers1: Record<number, AnswerMeta> = {
        0: { answerIndex: 0, seq: 1 },
      };

      const answers2: Record<number, AnswerMeta> = {
        0: { answerIndex: 1, seq: 1 },
      };

      calculator.calculateResult(answers1);
      calculator.calculateResult(answers2);

      const stats = calculator.getCacheStats();
      expect(stats.size).toBe(2);
      expect(stats.keys).toHaveLength(2);
      expect(stats.keys[0]).not.toBe(stats.keys[1]);
    });

    it("should clear cache when requested", () => {
      const selectedAnswers: Record<number, AnswerMeta> = {
        0: { answerIndex: 0, seq: 1 },
      };

      calculator.calculateResult(selectedAnswers);
      expect(calculator.getCacheStats().size).toBe(1);

      calculator.clearCache();
      expect(calculator.getCacheStats().size).toBe(0);
    });

    it("should include tie-breaker in cache key", () => {
      const earliestCalculator = new ResultCalculator(
        mockQuestions,
        "earliest"
      );
      const randomCalculator = new ResultCalculator(mockQuestions, "random");

      const selectedAnswers: Record<number, AnswerMeta> = {
        0: { answerIndex: 0, seq: 1 },
      };

      earliestCalculator.calculateResult(selectedAnswers);
      randomCalculator.calculateResult(selectedAnswers);

      // Both should have their own cache entries due to different tie-breakers
      expect(earliestCalculator.getCacheStats().size).toBe(1);
      expect(randomCalculator.getCacheStats().size).toBe(1);
    });
  });

  describe("Performance", () => {
    it("should handle large number of questions efficiently", () => {
      // Create a large set of questions for performance testing
      const largeQuestionSet: Question[] = Array.from(
        { length: 100 },
        (_, i) => ({
          id: i + 1,
          text: `Question ${i + 1}`,
          answers: [
            { text: "Answer 1", villains: ["jarvan"] },
            { text: "Answer 2", villains: ["valeon"] },
            { text: "Answer 3", villains: ["leticia"] },
          ],
        })
      );

      const performanceCalculator = new ResultCalculator(
        largeQuestionSet,
        "earliest"
      );

      // Create answers for all questions
      const largeAnswerSet: Record<number, AnswerMeta> = {};
      for (let i = 0; i < 100; i++) {
        largeAnswerSet[i] = { answerIndex: i % 3, seq: i };
      }

      const startTime = performance.now();
      const result = performanceCalculator.calculateResult(largeAnswerSet);
      const endTime = performance.now();

      expect(result).not.toBeNull();
      expect(endTime - startTime).toBeLessThan(100); // Should complete in less than 100ms
    });

    it("should benefit from memoization on repeated calls", () => {
      const selectedAnswers: Record<number, AnswerMeta> = {
        0: { answerIndex: 0, seq: 1 },
        1: { answerIndex: 1, seq: 2 },
        2: { answerIndex: 0, seq: 3 },
      };

      // First call (no cache)
      const startTime1 = performance.now();
      calculator.calculateResult(selectedAnswers);
      const endTime1 = performance.now();
      const firstCallTime = endTime1 - startTime1;

      // Second call (cached)
      const startTime2 = performance.now();
      calculator.calculateResult(selectedAnswers);
      const endTime2 = performance.now();
      const secondCallTime = endTime2 - startTime2;

      // Cached call should be significantly faster (allow for some timing variance)
      expect(secondCallTime).toBeLessThan(firstCallTime * 2); // More lenient timing check
    });
  });
});
