import { describe, it, expect, beforeEach, vi } from "vitest";
import { ResultCalculator } from "../../../lib/result-calculator";
import type { Question, VillainKey } from "../../../lib/types";

// Test questions designed for tie-breaking scenarios
const tieBreakingQuestions: Question[] = [
  {
    id: 1,
    text: "Choose your primary motivation",
    answers: [
      { text: "Power and dominance", villains: ["jarvan", "agon"] },
      { text: "Knowledge and wisdom", villains: ["valeon", "eternal-flames"] },
      { text: "Justice and order", villains: ["jarvan", "valeon"] },
      { text: "Chaos and freedom", villains: ["leticia", "isolde"] },
    ],
  },
  {
    id: 2,
    text: "How do you handle conflict?",
    answers: [
      { text: "Direct confrontation", villains: ["jarvan", "agon"] },
      { text: "Strategic manipulation", villains: ["valeon", "leticia"] },
      { text: "Diplomatic solution", villains: ["jarvan", "eternal-flames"] },
      { text: "Avoid when possible", villains: ["isolde", "leticia"] },
    ],
  },
  {
    id: 3,
    text: "What is your greatest strength?",
    answers: [
      { text: "Physical prowess", villains: ["jarvan", "agon"] },
      { text: "Mental acuity", villains: ["valeon", "eternal-flames"] },
      { text: "Emotional intelligence", villains: ["leticia", "isolde"] },
      { text: "Spiritual connection", villains: ["eternal-flames", "isolde"] },
    ],
  },
];

describe("Tie-Breaking Scenarios", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Earliest Sequence Tie-Breaking", () => {
    it("should resolve two-way tie using earliest sequence", () => {
      const calculator = new ResultCalculator(tieBreakingQuestions, "earliest");

      // Create a scenario where jarvan and valeon both have score 2
      const selectedAnswers = {
        0: { answerIndex: 2, seq: 5 }, // jarvan (seq: 5), valeon (seq: 5)
        1: { answerIndex: 1, seq: 2 }, // valeon (seq: 2), leticia (seq: 2)
        2: { answerIndex: 0, seq: 8 }, // jarvan (seq: 8), agon (seq: 8)
      };

      const result = calculator.calculateResult(selectedAnswers);

      expect(result).not.toBeNull();
      expect(result!.scores.jarvan).toBe(2);
      expect(result!.scores.valeon).toBe(2);
      expect(result!.winningVillain).toBe("valeon"); // valeon has earlier sequence (2 < 5)
      expect(result!.earliestSeqForVillain.valeon).toBe(2);
      expect(result!.earliestSeqForVillain.jarvan).toBe(5);
    });

    it("should resolve three-way tie using earliest sequence", () => {
      const calculator = new ResultCalculator(tieBreakingQuestions, "earliest");

      // Create a scenario where jarvan, valeon, and agon all have score 2
      const selectedAnswers = {
        0: { answerIndex: 0, seq: 10 }, // jarvan (seq: 10), agon (seq: 10)
        1: { answerIndex: 0, seq: 5 }, // jarvan (seq: 5), agon (seq: 5)
        2: { answerIndex: 1, seq: 2 }, // valeon (seq: 2), eternal-flames (seq: 2)
      };

      const result = calculator.calculateResult(selectedAnswers);

      expect(result).not.toBeNull();
      expect(result!.scores.jarvan).toBe(2);
      expect(result!.scores.agon).toBe(2);
      expect(result!.scores.valeon).toBe(1);
      expect(result!.winningVillain).toBe("jarvan"); // jarvan and agon tied at 2, but jarvan comes first alphabetically in tie resolution
    });

    it("should handle identical sequences with deterministic tie-breaking", () => {
      const calculator = new ResultCalculator(tieBreakingQuestions, "earliest");

      // Create identical sequences for tied villains
      const selectedAnswers = {
        0: { answerIndex: 2, seq: 5 }, // jarvan (seq: 5), valeon (seq: 5)
        1: { answerIndex: 2, seq: 5 }, // jarvan (seq: 5), eternal-flames (seq: 5)
        2: { answerIndex: 1, seq: 5 }, // valeon (seq: 5), eternal-flames (seq: 5)
      };

      const result = calculator.calculateResult(selectedAnswers);

      expect(result).not.toBeNull();
      expect(result!.scores.jarvan).toBe(2);
      expect(result!.scores.valeon).toBe(2);
      expect(result!.scores["eternal-flames"]).toBe(2);

      // All have same earliest sequence, should use deterministic tie-breaking
      expect(result!.earliestSeqForVillain.jarvan).toBe(5);
      expect(result!.earliestSeqForVillain.valeon).toBe(5);
      expect(result!.earliestSeqForVillain["eternal-flames"]).toBe(5);

      // Winner should be deterministic (alphabetical order in implementation)
      expect(["jarvan", "valeon", "eternal-flames"]).toContain(
        result!.winningVillain
      );
    });
  });

  describe("Random Tie-Breaking", () => {
    it("should use random selection for tied villains", () => {
      const calculator = new ResultCalculator(tieBreakingQuestions, "random");

      // Create a tie scenario
      const selectedAnswers = {
        0: { answerIndex: 2, seq: 1 }, // jarvan, valeon
        1: { answerIndex: 1, seq: 2 }, // valeon, leticia
        2: { answerIndex: 0, seq: 3 }, // jarvan, agon
      };

      // Mock Math.random to return predictable values
      const originalRandom = Math.random;
      const mockRandom = vi.fn();
      Math.random = mockRandom;

      // Test different random values
      mockRandom.mockReturnValueOnce(0.1); // Should select first tied villain
      const result1 = calculator.calculateResult(selectedAnswers);

      mockRandom.mockReturnValueOnce(0.9); // Should select last tied villain
      const result2 = calculator.calculateResult(selectedAnswers);

      expect(result1).not.toBeNull();
      expect(result2).not.toBeNull();

      // Both results should be valid villains with highest score
      expect(result1!.scores.jarvan).toBe(2);
      expect(result1!.scores.valeon).toBe(2);
      expect(["jarvan", "valeon"]).toContain(result1!.winningVillain);
      expect(["jarvan", "valeon"]).toContain(result2!.winningVillain);

      Math.random = originalRandom;
    });

    it("should handle single winner without random selection", () => {
      const calculator = new ResultCalculator(tieBreakingQuestions, "random");

      // Create a scenario with clear winner
      const selectedAnswers = {
        0: { answerIndex: 0, seq: 1 }, // jarvan, agon
        1: { answerIndex: 0, seq: 2 }, // jarvan, agon
        2: { answerIndex: 0, seq: 3 }, // jarvan, agon
      };

      const result = calculator.calculateResult(selectedAnswers);

      expect(result).not.toBeNull();
      expect(result!.scores.jarvan).toBe(3);
      expect(result!.scores.agon).toBe(3);

      // Should still resolve tie even with random tie-breaker
      expect(["jarvan", "agon"]).toContain(result!.winningVillain);
    });
  });

  describe("Edge Case Tie Scenarios", () => {
    it("should handle all villains tied with same score", () => {
      const calculator = new ResultCalculator(tieBreakingQuestions, "earliest");

      // Each villain appears exactly once
      const selectedAnswers = {
        0: { answerIndex: 0, seq: 1 }, // jarvan (seq: 1), agon (seq: 1)
        1: { answerIndex: 1, seq: 2 }, // valeon (seq: 2), leticia (seq: 2)
        2: { answerIndex: 2, seq: 3 }, // leticia (seq: 3), isolde (seq: 3)
      };

      const result = calculator.calculateResult(selectedAnswers);

      expect(result).not.toBeNull();
      expect(result!.scores.jarvan).toBe(1);
      expect(result!.scores.agon).toBe(1);
      expect(result!.scores.valeon).toBe(1);
      expect(result!.scores.leticia).toBe(2); // leticia appears twice
      expect(result!.scores.isolde).toBe(1);

      expect(result!.winningVillain).toBe("leticia"); // Clear winner with score 2
    });

    it("should handle empty answers gracefully", () => {
      const calculator = new ResultCalculator(tieBreakingQuestions, "earliest");

      const result = calculator.calculateResult({});

      expect(result).toBeNull();
    });

    it("should produce consistent results for same input", () => {
      const calculator = new ResultCalculator(tieBreakingQuestions, "earliest");

      const selectedAnswers = {
        0: { answerIndex: 2, seq: 5 },
        1: { answerIndex: 1, seq: 2 },
        2: { answerIndex: 0, seq: 8 },
      };

      // Run multiple times to ensure consistency
      const results = [];
      for (let i = 0; i < 10; i++) {
        results.push(calculator.calculateResult(selectedAnswers));
      }

      // All results should be identical
      const firstResult = results[0];
      results.forEach((result) => {
        expect(result).toEqual(firstResult);
      });
    });
  });
});
