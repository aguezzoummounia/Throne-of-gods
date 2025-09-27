# Design Document

## Overview

The quiz optimization focuses on improving performance through better state management, eliminating redundant calculations, and optimizing React re-renders. The design addresses memory leaks, type safety issues, and inefficient score calculations while maintaining the existing user experience.

## Architecture

### Current Issues Analysis

1. **Redundant Score Calculations**: `computeScores` is called on every answer, even for non-final questions
2. **Multiple State Updates**: Sequential state setters cause unnecessary re-renders
3. **Memory Leaks**: GSAP animations and SplitText instances aren't properly cleaned up
4. **Type Safety**: `@ts-ignore` comments indicate data structure inconsistencies
5. **Inefficient Re-renders**: Components re-render on every state change

### Proposed Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    QuizQuestions Component                   │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Optimized useQuiz Hook                     │ │
│  │  ┌─────────────────┐  ┌─────────────────────────────────┐ │ │
│  │  │  State Manager  │  │     Result Calculator           │ │ │
│  │  │  - Batched      │  │     - Lazy calculation          │ │ │
│  │  │    updates      │  │     - Memoized results          │ │ │
│  │  │  - Minimal      │  │     - Type-safe operations      │ │ │
│  │  │    re-renders   │  │                                 │ │ │
│  │  └─────────────────┘  └─────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Animation Manager                          │ │
│  │  - Proper cleanup    - Ref management                  │ │
│  │  - Memory efficient  - Performance optimized           │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Enhanced useQuiz Hook

**Optimizations:**

- Use `useReducer` instead of multiple `useState` calls for batched updates
- Implement lazy score calculation only on quiz completion
- Add proper memoization with `useMemo` and `useCallback`
- Eliminate redundant state updates

**New Interface:**

```typescript
interface QuizState {
  currentQuestionIndex: number;
  selectedAnswers: Record<number, AnswerMeta>;
  isAnimating: boolean;
  result: { open: boolean; href: string };
}

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
```

### 2. Result Calculator Service

**Purpose:** Separate calculation logic from component state management

**Features:**

- Memoized score calculations
- Type-safe villain data handling
- Efficient tie-breaking algorithms
- Support for both legacy and new data formats

```typescript
class ResultCalculator {
  private memoizedScores = new Map<string, ScoreResult>();

  calculateResult(
    selectedAnswers: Record<number, AnswerMeta>,
    questions: Question[],
    tieBreaker: TieBreaker
  ): string;

  private computeScores(answersMap: Record<number, AnswerMeta>): ScoreResult;
  private resolveTie(
    topVillains: VillainKey[],
    earliestSeq: Record<VillainKey, number>
  ): VillainKey;
}
```

### 3. Animation Manager

**Purpose:** Centralize GSAP animation management with proper cleanup

**Features:**

- Automatic cleanup on component unmount
- Ref management for animation targets
- Performance-optimized animation sequences
- Memory leak prevention

```typescript
class AnimationManager {
  private animations: gsap.core.Timeline[] = [];
  private splitTexts: SplitText[] = [];

  createQuestionAnimation(refs: AnimationRefs): gsap.core.Timeline;
  createIndicatorAnimation(ref: RefObject<HTMLElement>): gsap.core.Timeline;
  cleanup(): void;
}
```

## Data Models

### Enhanced Answer Interface

```typescript
interface Answer {
  text: string;
  villains: readonly VillainKey[]; // Always array, no legacy support needed
}
```

### Quiz State Model

```typescript
interface QuizState {
  currentQuestionIndex: number;
  selectedAnswers: Record<number, AnswerMeta>;
  isAnimating: boolean;
  result: { open: boolean; href: string };
}

interface AnswerMeta {
  answerIndex: number;
  seq: number;
  timestamp?: number; // For additional tie-breaking if needed
}
```

### Score Calculation Model

```typescript
interface ScoreResult {
  scores: Record<VillainKey, number>;
  earliestSeqForVillain: Record<VillainKey, number>;
  winningVillain: VillainKey;
  resultPath: string;
}
```

## Error Handling

### Type Safety Improvements

1. **Remove @ts-ignore**: Fix data structure inconsistencies in quiz data
2. **Strict Type Checking**: Ensure all villain references are valid
3. **Runtime Validation**: Add guards for malformed data

### Animation Error Handling

1. **Graceful Degradation**: Continue without animations if GSAP fails
2. **Cleanup on Error**: Ensure resources are freed even if animations fail
3. **Performance Monitoring**: Log performance metrics in development

## Testing Strategy

### Unit Tests

1. **useQuiz Hook Tests**

   - State transitions
   - Score calculations
   - Memoization effectiveness
   - Error scenarios

2. **ResultCalculator Tests**

   - Score computation accuracy
   - Tie-breaking logic
   - Edge cases (empty answers, invalid data)
   - Performance benchmarks

3. **AnimationManager Tests**
   - Cleanup verification
   - Memory leak detection
   - Performance impact measurement

### Integration Tests

1. **Quiz Flow Tests**
   - Complete quiz scenarios
   - Navigation between questions
   - Result calculation end-to-end
   - Animation coordination

### Performance Tests

1. **Re-render Counting**: Verify minimal re-renders
2. **Memory Usage**: Monitor memory consumption over time
3. **Animation Performance**: Measure frame rates during transitions
4. **Calculation Speed**: Benchmark score calculation performance

## Implementation Phases

### Phase 1: State Management Optimization

- Implement useReducer for batched updates
- Add proper memoization
- Eliminate redundant calculations

### Phase 2: Type Safety Improvements

- Fix data structure inconsistencies
- Remove @ts-ignore comments
- Add runtime validation

### Phase 3: Animation Optimization

- Implement AnimationManager
- Add proper cleanup mechanisms
- Optimize animation performance

### Phase 4: Result Calculation Enhancement

- Create ResultCalculator service
- Add memoization for score calculations
- Optimize tie-breaking logic

### Phase 5: Testing and Validation

- Comprehensive test coverage
- Performance benchmarking
- Memory leak detection
