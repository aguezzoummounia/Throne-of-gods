// React imports
import { useReducer, useCallback, useRef, useMemo } from "react";

// Context imports
import { useAudio } from "../../context/sound-context";

// Local imports
import { ResultCalculator } from "../../lib/result-calculator";

// Type imports
import type { Question } from "../../lib/types";

type TieBreaker = "earliest" | "random";

interface AnswerMeta {
  seq: number; // sequence number of when it was answered
  answerIndex: number;
}

// QuizState interface for useReducer
interface QuizState {
  currentQuestionIndex: number;
  selectedAnswers: Record<number, AnswerMeta>;
  isAnimating: boolean;
  result: { open: boolean; href: string };
}

// QuizAction union type for type-safe actions
type QuizAction =
  | {
      type: "SELECT_ANSWER";
      payload: { questionIndex: number; answerIndex: number; seq: number };
    }
  | { type: "NEXT_QUESTION" }
  | { type: "GO_TO_QUESTION"; payload: number }
  | { type: "SET_ANIMATING"; payload: boolean }
  | { type: "SET_RESULT"; payload: { open: boolean; href: string } }
  | { type: "RESET_QUIZ" };

// Action creators for type safety
export const quizActions = {
  selectAnswer: (
    questionIndex: number,
    answerIndex: number,
    seq: number
  ): QuizAction => ({
    type: "SELECT_ANSWER",
    payload: { questionIndex, answerIndex, seq },
  }),
  nextQuestion: (): QuizAction => ({
    type: "NEXT_QUESTION",
  }),
  goToQuestion: (index: number): QuizAction => ({
    type: "GO_TO_QUESTION",
    payload: index,
  }),
  setAnimating: (isAnimating: boolean): QuizAction => ({
    type: "SET_ANIMATING",
    payload: isAnimating,
  }),
  setResult: (result: { open: boolean; href: string }): QuizAction => ({
    type: "SET_RESULT",
    payload: result,
  }),
  resetQuiz: (): QuizAction => ({
    type: "RESET_QUIZ",
  }),
};

// Quiz reducer function with batched state updates
function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "SELECT_ANSWER":
      return {
        ...state,
        selectedAnswers: {
          ...state.selectedAnswers,
          [action.payload.questionIndex]: {
            answerIndex: action.payload.answerIndex,
            seq: action.payload.seq,
          },
        },
      };
    case "NEXT_QUESTION":
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
      };
    case "GO_TO_QUESTION":
      return {
        ...state,
        currentQuestionIndex: action.payload,
      };
    case "SET_ANIMATING":
      return {
        ...state,
        isAnimating: action.payload,
      };
    case "SET_RESULT":
      return {
        ...state,
        result: action.payload,
      };
    case "RESET_QUIZ":
      return {
        currentQuestionIndex: 0,
        selectedAnswers: {},
        isAnimating: false,
        result: { open: false, href: "" },
      };
    default:
      return state;
  }
}

export const useQuiz = (
  questions: readonly Question[],
  tieBreaker: TieBreaker = "earliest"
) => {
  const { playSlideSound } = useAudio();
  const seqRef = useRef(0);

  // Initial state for useReducer
  const initialState: QuizState = {
    currentQuestionIndex: 0,
    selectedAnswers: {},
    isAnimating: false,
    result: { open: false, href: "" },
  };

  // Replace multiple useState calls with single useReducer
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const { currentQuestionIndex, selectedAnswers, isAnimating, result } = state;

  // Memoize current question and last question check
  const currentQuestion = useMemo(
    () => questions[currentQuestionIndex],
    [questions, currentQuestionIndex]
  );
  const isLastQuestion = useMemo(
    () => currentQuestionIndex === questions.length - 1,
    [currentQuestionIndex, questions.length]
  );

  // Create ResultCalculator instance with memoization
  const resultCalculator = useMemo(
    () => new ResultCalculator(questions, tieBreaker),
    [questions, tieBreaker]
  );

  // Memoize navigation calculations to prevent re-computation
  const lastAnsweredIndex = useMemo(() => {
    const answeredIndices = Object.keys(selectedAnswers).length
      ? Object.keys(selectedAnswers).map((k) => Number(k))
      : [];
    return answeredIndices.length > 0 ? Math.max(...answeredIndices) : -1;
  }, [selectedAnswers]);

  // Action dispatchers using the action creators
  const goToQuestion = useCallback(
    (index: number) => {
      if (isAnimating) return;
      playSlideSound();
      dispatch(quizActions.goToQuestion(index));
    },
    [isAnimating, playSlideSound]
  );

  const goBack = useCallback(() => {
    dispatch(quizActions.setResult({ open: false, href: "" }));
  }, []);

  const setIsAnimating = useCallback((animating: boolean) => {
    dispatch(quizActions.setAnimating(animating));
  }, []);

  const setResult = useCallback(
    (resultData: { open: boolean; href: string }) => {
      dispatch(quizActions.setResult(resultData));
    },
    []
  );

  // Lazy result calculation using useMemo - only calculates when quiz is complete
  const quizResult = useMemo(() => {
    // Only calculate if all questions are answered
    const totalQuestions = questions.length;
    const answeredQuestions = Object.keys(selectedAnswers).length;

    if (answeredQuestions < totalQuestions) {
      return null;
    }

    return resultCalculator.calculateResult(selectedAnswers);
  }, [selectedAnswers, questions.length, resultCalculator]);

  const handleAnswer = useCallback(
    (answerIndex: number) => {
      if (isAnimating) return;

      const seq = seqRef.current++;

      if (isLastQuestion) {
        // Batch state updates for final answer submission
        const updatedAnswers = {
          ...selectedAnswers,
          [currentQuestionIndex]: { answerIndex, seq },
        };

        // Calculate result immediately for final question
        const finalResult = resultCalculator.calculateResult(updatedAnswers);

        if (finalResult) {
          // Batch both answer selection and result setting
          dispatch(
            quizActions.selectAnswer(currentQuestionIndex, answerIndex, seq)
          );
          dispatch(
            quizActions.setResult({ open: true, href: finalResult.resultPath })
          );
        }
      } else {
        // For non-final questions, just update the answer
        dispatch(
          quizActions.selectAnswer(currentQuestionIndex, answerIndex, seq)
        );
      }
    },
    [
      isAnimating,
      currentQuestionIndex,
      isLastQuestion,
      selectedAnswers,
      resultCalculator,
    ]
  );

  const resetQuiz = useCallback(() => {
    seqRef.current = 0;
    dispatch(quizActions.resetQuiz());
  }, []);

  return {
    // State values
    result,
    isAnimating,
    isLastQuestion,
    selectedAnswers,
    currentQuestion,
    lastAnsweredIndex,
    currentQuestionIndex,

    // Action dispatchers
    goBack,
    setResult,
    goToQuestion,
    setIsAnimating,
    handleAnswer,
    resetQuiz,

    // Computed values
    quizResult,
  };
};
