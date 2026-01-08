"use client";

// React imports
import { useRef, useMemo, useCallback } from "react";

// GSAP imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";

// Context imports
import { usePageTransition } from "@/components/global/page-transition";

// Local component imports
import Text from "../ui/text";
import LabelText from "../ui/label-text";
import Portal from "../global/portal";
import Indicator from "./step-indicator";
import AnswerButton from "./answer-button";
import BackgroundSvg from "./quiz-question-background-svg";
import QuizResultPreloader from "./quiz-result-preloader";
import { useQuiz } from "./useQuiz";

// Context imports
import { useAudio } from "@/context/sound-context";
import { cn } from "@/lib/utils";

// Type imports
import type { Question } from "@/lib/types";

gsap.registerPlugin(useGSAP, SplitText);

type TieBreaker = "earliest" | "random";
interface QuizClientProps {
	tieBreaker?: TieBreaker;
	questions: readonly Question[];
}

export function QuizQuestions({
	questions,
	tieBreaker = "earliest",
}: QuizClientProps) {
	const { playSlideSound } = useAudio();

	const h4Ref = useRef<HTMLHeadingElement>(null);
	const h2Ref = useRef<HTMLHeadingElement>(null);
	const buttonsRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const indicatorsRef = useRef<HTMLDivElement>(null);

	const {
		result,
		isAnimating,
		isLastQuestion,
		currentQuestion,
		selectedAnswers,
		lastAnsweredIndex,
		currentQuestionIndex,
		goBack,
		goToQuestion,
		setIsAnimating,
		handleAnswer: hookHandleAnswer,
	} = useQuiz(questions, tieBreaker);

	const { triggerTransition } = usePageTransition();

	// Question animation
	useGSAP(
		() => {
			if (isAnimating) return;

			const h4 = h4Ref.current;
			const h2 = h2Ref.current;
			const buttons = buttonsRef.current;

			if (!h4 || !h2 || !buttons) return;

			// Create SplitText instances
			const h4Split = new SplitText(h4, {
				type: "chars",
				autoSplit: true,
				smartWrap: true,
			});
			const h2Split = new SplitText(h2, {
				type: "chars",
				autoSplit: true,
				smartWrap: true,
			});

			// Create timeline
			const tl = gsap.timeline({ paused: true });

			// Animate question number
			tl.from(h4Split.chars, {
				opacity: 0,
				y: 20,
				duration: 0.6,
				stagger: 0.02,
				ease: "power2.out",
			});

			// Animate question text
			tl.from(
				h2Split.chars,
				{
					opacity: 0,
					y: 30,
					duration: 0.8,
					stagger: 0.01,
					ease: "power2.out",
				},
				"-=0.3",
			);

			// Animate buttons
			tl.from(
				gsap.utils.toArray(buttons.children),
				{
					opacity: 0,
					y: 40,
					duration: 0.6,
					stagger: 0.1,
					ease: "power2.out",
				},
				"-=0.4",
			);

			// Play animation
			tl.play();

			// Cleanup function
			return () => {
				h4Split.revert();
				h2Split.revert();
				tl.kill();
			};
		},
		{
			scope: containerRef,
			dependencies: [currentQuestionIndex],
			revertOnUpdate: true,
		},
	);

	// Indicator animation - only runs once on mount
	useGSAP(
		() => {
			if (!indicatorsRef.current) return;

			const indicators = gsap.utils.toArray(indicatorsRef.current.children);

			gsap.from(indicators, {
				opacity: 0,
				scale: 0.8,
				duration: 0.4,
				stagger: 0.05,
				ease: "back.out(1.7)",
			});
		},
		{
			scope: containerRef,
			dependencies: [], // Empty dependencies - only run once on mount
			revertOnUpdate: false,
		},
	);

	/**
	 * handleAnswer: user selects an answer (answerIndex)
	 * - Uses the hook's handleAnswer for state management
	 * - Handles animations for non-final questions
	 * - Automatically progresses to next question
	 */
	const handleAnswer = useCallback(
		(answerIndex: number) => {
			if (isAnimating) return;

			if (isLastQuestion) {
				// Skip exit animations entirely for the final answer
				setIsAnimating(true);
				playSlideSound();
				hookHandleAnswer(answerIndex);
				setIsAnimating(false);
				return;
			}

			// For non-final questions, animate out and then proceed to next question
			setIsAnimating(true);
			playSlideSound();

			const h2 = h2Ref.current;
			const buttons = buttonsRef.current;

			if (!h2 || !buttons) {
				hookHandleAnswer(answerIndex);
				// Automatically go to next question
				setTimeout(() => {
					goToQuestion(currentQuestionIndex + 1);
					setIsAnimating(false);
				}, 100);
				return;
			}

			// Create exit animation
			const tl = gsap.timeline();

			tl.to([h2, ...gsap.utils.toArray(buttons.children)], {
				opacity: 0,
				y: -20,
				duration: 0.3,
				stagger: 0.05,
				ease: "power2.in",
			});

			tl.call(() => {
				hookHandleAnswer(answerIndex);
				// Automatically go to next question after animation
				goToQuestion(currentQuestionIndex + 1);
				setIsAnimating(false);
			});

			tl.play();
		},
		[
			isAnimating,
			isLastQuestion,
			setIsAnimating,
			playSlideSound,
			hookHandleAnswer,
			goToQuestion,
			currentQuestionIndex,
		],
	);

	// Memoize indicator calculations to prevent re-computation
	const indicatorCalculations = useMemo(() => {
		return questions.map((_, index) => {
			const isAnswered = index in selectedAnswers;
			const isAccessible =
				index <= lastAnsweredIndex || index === currentQuestionIndex;
			const isActive = currentQuestionIndex >= index;
			const inLineActive = currentQuestionIndex > index;
			const isLast = index + 1 === questions.length;
			const disabled = !isAccessible || isAnimating;

			return {
				index,
				isAnswered,
				isAccessible,
				isActive,
				inLineActive,
				isLast,
				disabled,
			};
		});
	}, [
		questions,
		selectedAnswers,
		lastAnsweredIndex,
		currentQuestionIndex,
		isAnimating,
	]);

	// Memoize indicator click handlers to prevent re-creation
	const indicatorHandlers = useMemo(() => {
		return questions.map((_, index) => () => goToQuestion(index));
	}, [questions, goToQuestion]);

	// Memoize indicator elements with optimized calculations
	const indicatorElements = useMemo(() => {
		return indicatorCalculations.map((calc, index) => (
			<Indicator
				number={calc.index + 1}
				isAccessible={calc.isAnswered}
				key={`indicator-${calc.index}`}
				isLast={calc.isLast}
				isActive={calc.isActive}
				inLineActive={calc.inLineActive}
				handleClick={indicatorHandlers[index]}
				disabled={calc.disabled}
			/>
		));
	}, [indicatorCalculations, indicatorHandlers]);

	return (
		<div
			ref={containerRef}
			className="h-full w-full relative flex items-center justify-center"
		>
			<BackgroundSvg />
			<div className="flex flex-col items-center justify-center md:gap-10 gap-10 md:w-[65%] w-full max-md:pb-8">
				<div className="w-full h-full flex flex-col items-center justify-center gap-4">
					<LabelText>
						<h4
							ref={h4Ref}
							className="font-alegreya uppercase"
							key={`question-number-${currentQuestionIndex}`}
						>
							Question
							<span className="pl-2 text-4l">{currentQuestionIndex + 1}</span>
						</h4>
					</LabelText>

					<Text
						ref={h2Ref}
						as="h2"
						variant="title"
						className="text-center"
						key={`question-text-${currentQuestionIndex}`}
					>
						{currentQuestion.text}
					</Text>
				</div>

				<div
					ref={buttonsRef}
					key={`buttons-container-${currentQuestionIndex}`}
					className="flex items-stretch justify-center flex-wrap md:gap-6 gap-2 md:max-w-[55rem]"
				>
					{currentQuestion.answers.map((answer, index) => {
						const meta = selectedAnswers[currentQuestionIndex];
						const isSelected = !!meta && meta.answerIndex === index;

						return (
							<AnswerButton
								isActive={isSelected}
								animated={true}
								disabled={isAnimating}
								aria-pressed={isSelected}
								key={`response-button-${index}`}
								onClick={() => handleAnswer(index)}
								className={cn("lg:w-60 md:w-52 w-full uppercase")}
							>
								{answer.text}
							</AnswerButton>
						);
					})}
				</div>
			</div>

			{/* navigation indicators */}
			<div className="absolute md:inset-[auto_0%_1rem] inset-[auto_0%_0%] lg:w-[65%] md:w-[80%] w-full mx-auto">
				<div
					ref={indicatorsRef}
					className="grid grid-rows-1 grid-cols-[repeat(5,1fr)_auto] w-full"
				>
					{indicatorElements}
				</div>
			</div>
			{result.open && (
				<Portal>
					<QuizResultPreloader
						open={result.open}
						onFinish={() => {
							triggerTransition(result.href);
						}}
						goBack={() => goBack()}
					/>
				</Portal>
			)}
		</div>
	);
}
