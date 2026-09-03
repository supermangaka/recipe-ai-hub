import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { generateRecipe } from '@/lib/anthropic';
import { getMockRecipe } from '@/lib/mock-recipe';
import { Difficulty } from '@/types/recipe';

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

  const { ingredients, cuisine, difficulty, locale } = body as Record<string, unknown>;

  if (
    !Array.isArray(ingredients) ||
    ingredients.length === 0 ||
    !ingredients.every((i) => typeof i === 'string' && i.trim().length > 0)
  ) {
    return NextResponse.json(
      { error: 'ingredients must be a non-empty array of non-empty strings' },
      { status: 400 }
    );
  }

  if (typeof cuisine !== 'string' || cuisine.trim().length === 0) {
    return NextResponse.json({ error: 'cuisine is required' }, { status: 400 });
  }

  if (typeof difficulty !== 'string' || !VALID_DIFFICULTIES.includes(difficulty as Difficulty)) {
    return NextResponse.json({ error: 'difficulty must be easy, medium, or hard' }, { status: 400 });
  }

  if (typeof locale !== 'string' || !VALID_LOCALES.includes(locale)) {
    return NextResponse.json({ error: 'locale must be en, ru, or pt' }, { status: 400 });
  }

  const cleanedIngredients = ingredients.map((i) => i.trim());

  if (process.env.USE_MOCK_RECIPES === 'true') {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return NextResponse.json({ recipe: getMockRecipe(cleanedIngredients, locale) });
  }

  try {
    const recipe = await generateRecipe({
      ingredients: cleanedIngredients,
      cuisine,
      difficulty: difficulty as Difficulty,
      locale,
    });

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error('Recipe generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate recipe. Please try again.' },
      { status: 502 }
    );
  }
}