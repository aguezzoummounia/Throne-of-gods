# Implementation Plan

- [x] 1. Fix data structure inconsistencies and type safety issues

  - Remove @ts-ignore comments from useQuiz.ts by fixing villain data structure handling
  - Update Answer interface to consistently use 'villains' array instead of mixed 'villain'/'villains'
  - Add runtime validation for villain data in computeScores function
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 2. Implement optimized state management with useReducer

  - Replace multiple useState calls in useQuiz hook with single useReducer
  - Create QuizState interface and QuizAction union type
  - Implement quizReducer function with batched state updates
  - Add proper action creators for type safety
  - _Requirements: 2.1, 2.2, 3.1_

- [x] 3. Create ResultCalculator service for efficient score computation

  - Implement ResultCalculator class with memoized score calculations
  - Add computeScores method that handles both legacy and new data formats
  - Implement efficient tie-breaking algorithm with earliest sequence logic
  - Create unit tests for score calculation accuracy and performance
  - _Requirements: 5.1, 5.2, 5.4, 2.4_

- [x] 4. Optimize quiz completion flow to eliminate redundant calculations

  - Modify handleAnswer function to only calculate scores on final question
  - Remove duplicate score calculation in quiz-questions.tsx component
  - Implement lazy result calculation using useMemo hook
  - Add proper state batching for final answer submission
  - _Requirements: 5.1, 5.3, 2.4_

- [x] 5. Implement AnimationManager for proper GSAP cleanup

  - Create AnimationManager class to centralize animation handling
  - Add automatic cleanup of SplitText instances and timelines
  - Implement proper ref management for animation targets
  - Add cleanup on component unmount to prevent memory leaks
  - _Requirements: 2.3, 3.2, 1.2_

- [x] 6. Add memoization to prevent unnecessary re-renders

  - Wrap expensive calculations in useMemo hooks
  - Memoize callback functions with useCallback
  - Optimize component re-renders by splitting state concerns
  - Add React.memo to child components where appropriate
  - _Requirements: 2.1, 3.1, 1.1_

- [x] 7. Optimize question navigation and indicator rendering

  - Memoize indicator calculations to prevent re-computation
  - Optimize isAccessible and isAnswered logic
  - Add proper dependency arrays to useGSAP hooks
  - Implement efficient question transition animations
  - _Requirements: 3.1, 1.2, 3.3_

- [x] 8. Remove unused imports and clean up component code

  - Remove unused useRouter import from quiz-questions.tsx
  - Remove unused isLastQuestion variable
  - Clean up commented code in useQuiz.ts
  - Optimize import statements and remove redundant dependencies
  - _Requirements: 2.1_

- [x] 9. Add performance monitoring and error boundaries

  - Implement performance metrics collection in development mode
  - Add error boundaries around animation components
  - Create graceful fallbacks for animation failures
  - Add logging for score calculation performance
  - _Requirements: 1.1, 1.3_

- [x] 10. Create comprehensive test suite for optimized components

  - Write unit tests for useQuiz hook with new reducer logic
  - Add integration tests for complete quiz flow
  - Create performance benchmarks for re-render counting
  - Implement memory leak detection tests for animations
  - Test tie-breaking scenarios and edge cases
  - _Requirements: 5.2, 2.3, 3.2_
