import { quizData } from "./data";
/**
 * Creates a union type of all available villain keys from your JSON file.
 * This will automatically become: "joker" | "magneto" | "thanos" | "lex-luthor"
 */
export type VillainKey = keyof typeof quizData.villains;

/**
 * Describes the profile of a single villain.
 * We ensure the slug is one of the valid villain keys.
 */
export interface VillainProfile {
  name: string;
  slug: VillainKey;
  image: string;
  description: string;
}

/**
 * Describes a single answer option.
 * The `villain` property is now strongly typed to be one of the `VillainKey`s.
 */
export interface Answer {
  text: string;
  villain: VillainKey; // <-- The key improvement!
}

/**
 * Describes a single quiz question.
 */
export interface Question {
  id: number;
  text: string;
  answers: readonly Answer[];
}

/**
 * The shape of the entire quiz data object, using the strongly-typed keys.
 * `Record<Key, Type>` is a utility type for objects with specific keys.
 */
export interface QuizData {
  questions: Question[];
  villains: Record<VillainKey, VillainProfile>;
}
