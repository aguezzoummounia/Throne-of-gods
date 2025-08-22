import { quizData } from "./data";
/**
 * Creates a union type of all available villain keys from your JSON file.
 * This will automatically become: "joker" | "magneto" | "thanos" | "lex-luthor"
 */
export type VillainKey = keyof typeof quizData.villains;

export interface VillainStats {
  age: string;
  race: string;
  role: string;
  status: string;
  faction: string;
  location: string;
  alignment: string;
}

/**
 * Describes the profile of a single villain.
 * We ensure the slug is one of the valid villain keys.
 */
export interface VillainProfile {
  name: string;
  quote: string;
  image: string;
  powers: readonly string[];
  trivia: readonly string[];
  overview: string;
  nickname: string;
  slug: VillainKey;
  backstory: string;
  stats: VillainStats;
  relations: {
    allies: string;
    enemies: string;
  };
}

/**
 * Describes a single answer option.
 * The `villain` property is now strongly typed to be one of the `VillainKey`s.
 */
export interface Answer {
  text: string;
  villains?: readonly VillainKey[];
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
