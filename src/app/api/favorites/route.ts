import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { generateRecipe } from '@/lib/anthropic';
import { getMockRecipe } from '@/lib/mock-recipe';
import { Difficulty } from '@/types/recipe';
import { supabaseAdmin } from '@/lib/supabase-admin';

const VALID_DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];
const VALID_LOCALES = ['en', 'ru', 'pt'];

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { title, ingredients, instructions, cookTimeMinutes, servings, cuisine, difficulty, locale, rawPrompt } =
    body as Record<string, unknown>;

  if (
    typeof title !== 'string' ||
    !Array.isArray(ingredients) ||
    !Array.isArray(instructions) ||
    typeof cookTimeMinutes !== 'number' ||
    typeof servings !== 'number'
  ) {
    return NextResponse.json({ error: 'Invalid recipe payload' }, { status: 400 });
  }

  const { data: recipe, error: recipeError } = await supabaseAdmin
    .from('recipes')
    .insert({
      created_by: session.user.id,
      title,
      ingredients,
      instructions,
      cook_time_minutes: cookTimeMinutes,
      servings,
      cuisine: typeof cuisine === 'string' ? cuisine : 'any',
      difficulty: typeof difficulty === 'string' ? difficulty : 'easy',
      locale: typeof locale === 'string' ? locale : 'en',
      raw_prompt: typeof rawPrompt === 'string' ? rawPrompt : null,
    })
    .select()
    .single();

  if (recipeError || !recipe) {
    console.error('Failed to save recipe:', recipeError);
    return NextResponse.json({ error: 'Failed to save recipe' }, { status: 500 });
  }

  const { data: favorite, error: favoriteError } = await supabaseAdmin
    .from('favorites')
    .insert({
      user_id: session.user.id,
      recipe_id: recipe.id,
    })
    .select()
    .single();

  if (favoriteError) {
    console.error('Failed to add favorite:', favoriteError);
    return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
  }

  return NextResponse.json({ favorite, recipe }, { status: 201 });
}