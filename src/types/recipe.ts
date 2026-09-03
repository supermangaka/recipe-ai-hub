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

export type RecipeFormValues =
  | { mode: 'list'; ingredients: string[]; cuisine: string; difficulty: Difficulty }
  | { mode: 'freeform'; description: string; cuisine: string; difficulty: Difficulty };