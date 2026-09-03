import { Recipe, Difficulty } from '@/types/recipe';

export type DbRecipeRow = {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  cook_time_minutes: number;
  servings: number;
  cuisine: string;
  difficulty: string;
};

export function mapDbRecipeToRecipe(row: DbRecipeRow): Recipe {
  return {
    title: row.title,
    cuisine: row.cuisine,
    difficulty: row.difficulty as Difficulty,
    cookTimeMinutes: row.cook_time_minutes,
    servings: row.servings,
    ingredients: row.ingredients,
    instructions: row.instructions,
  };
}