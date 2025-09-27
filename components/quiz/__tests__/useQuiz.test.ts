import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useQuiz } from "../useQuiz";
import type { Question } from "../../../lib/types";

// Mock the audio context
vi.mock("../../../context/sound-context", () => ({
  useAudio: () => ({
    playSlideSound: vi.fn(),
  }),
}));

// Mock result calculator
vi.mock("../../../lib/result-calculator", () => ({
  ResultCalculator: vi.fn().mockImplementation(() => ({
    calculateResult: vi.fn().mockReturnValue({
      winningVillain: "jarvan",
      resultPath: "/quiz/results/jarvan",
      scores: { jarvan: 2, valeon: 1 },
      earliestSeqForVillain: { jarvan: 0, valeon: 1 },
    }),
  })),
}));

const mockQuestions: Question[] = [
  {
    id: 1,
    text: "Test question 1",
    answers: [
      { text: "Answer 1", villains: ["jarvan"] },
      { text: "Answer 2", villains: ["valeon"] },
    ],
  },
  {
    id: 2,
    text: "Test question 2",
    answers: [
      { text: "Answer 1", villains: ["jarvan"] },
      { text: "Answer 2", villains: ["leticia"] },
    ],
  },
  {
    id: 3,
    text: "Test question 3",
    answers: [
      { text: "Answer 1", villains: ["isolde"] },
      { text: "Answer 2", villains: ["agon"] },
    ],
  },
];

describe("useQuiz Hook - Result Calculation Focus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Result Calculation Integration", () => {
    it("should use ResultCalculator for final result", () => {
      const { result } = renderHook(() => useQuiz(mockQuestions));

      // Navigate to last question
      act(() => {
        result.current.goToQuestion(2);
      });

      // Answer final question
      act(() => {
        result.current.handleAnswer(0);
      });

      expect(result.current.result.open).toBe(true);
      expect(result.current.result.href).toBe("/quiz/results/jarvan");
    });

    it("should calculate result only when quiz is complete", () => {
      const { result } = renderHook(() => useQuiz(mockQuestions));

      // Answer first two questions
      act(() => {
        result.current.handleAnswer(0);
        result.current.goToQuestion(1);
        result.current.handleAnswer(1);
      });

      expect(result.current.quizResult).toBeNull();

      // Answer final question
      act(() => {
        result.current.goToQuestion(2);
        result.current.handleAnswer(0);
      });

      expect(result.current.quizResult).not.toBeNull();
    });

    it("should use correct tie breaker configuration", () => {
      const { result } = renderHook(() => useQuiz(mockQuestions, "random"));
      expect(result.current).toBeDefined();
    });
  });

  describe("Basic Functionality", () => {
    it("should handle answer selection correctly", () => {
      const { result } = renderHook(() => useQuiz(mockQuestions));

      act(() => {
        result.current.handleAnswer(0);
      });

      expect(result.current.selectedAnswers[0]).toEqual({
        answerIndex: 0,
        seq: 0,
      });
    });

    it("should navigate between questions", () => {
      const { result } = renderHook(() => useQuiz(mockQuestions));

      act(() => {
        result.current.goToQuestion(1);
      });

      expect(result.current.currentQuestionIndex).toBe(1);
    });

    it("should reset quiz state", () => {
      const { result } = renderHook(() => useQuiz(mockQuestions));

      act(() => {
        result.current.handleAnswer(0);
        result.current.resetQuiz();
      });

      expect(result.current.currentQuestionIndex).toBe(0);
      expect(result.current.selectedAnswers).toEqual({});
    });
  });
});
