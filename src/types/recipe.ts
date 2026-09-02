export type Difficulty = 'easy' | 'medium' | 'hard';

export type Recipe = {
  title: string;
  cuisine: string;
  difficulty: Difficulty;
  cookTimeMinutes: number;
  servings: number;
  ingredients: string[];
  instructions: string[];
};