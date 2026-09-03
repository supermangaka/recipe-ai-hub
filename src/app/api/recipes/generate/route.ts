import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { generateRecipe, REFINEMENT_INSTRUCTIONS } from '@/lib/anthropic';
import { getMockRecipe } from '@/lib/mock-recipe';
import { Difficulty, RefineVariant, Recipe } from '@/types/recipe';

const VALID_DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];
const VALID_LOCALES = ['en', 'ru', 'pt'];
const VALID_VARIANTS = Object.keys(REFINEMENT_INSTRUCTIONS) as RefineVariant[];

function isValidBaseRecipe(value: unknown): value is Recipe {
  if (typeof value !== 'object' || value === null) return false;
  const r = value as Record<string, unknown>;
  return (
    typeof r.title === 'string' &&
    typeof r.cuisine === 'string' &&
    typeof r.difficulty === 'string' &&
    typeof r.cookTimeMinutes === 'number' &&
    typeof r.servings === 'number' &&
    Array.isArray(r.ingredients) &&
    Array.isArray(r.instructions)
  );
}

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

  const { mode, ingredients, description, cuisine, difficulty, locale, baseRecipe, variant } =
    body as Record<string, unknown>;

  if (mode !== 'list' && mode !== 'freeform' && mode !== 'refine') {
    return NextResponse.json({ error: 'mode must be "list", "freeform", or "refine"' }, { status: 400 });
  }

  if (typeof locale !== 'string' || !VALID_LOCALES.includes(locale)) {
    return NextResponse.json({ error: 'locale must be en, ru, or pt' }, { status: 400 });
  }

  if (mode === 'refine') {
    if (!isValidBaseRecipe(baseRecipe)) {
      return NextResponse.json({ error: 'baseRecipe is invalid or missing' }, { status: 400 });
    }
    if (typeof variant !== 'string' || !VALID_VARIANTS.includes(variant as RefineVariant)) {
      return NextResponse.json({ error: 'variant must be one of: ' + VALID_VARIANTS.join(', ') }, { status: 400 });
    }

    if (process.env.USE_MOCK_RECIPES === 'true') {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mocked = getMockRecipe(baseRecipe.ingredients, locale);
      return NextResponse.json({ recipe: { ...mocked, title: `${mocked.title} (${variant})` } });
    }

    try {
      const recipe = await generateRecipe({
        mode: 'refine',
        baseRecipe,
        variant: variant as RefineVariant,
        locale,
      });
      return NextResponse.json({ recipe });
    } catch (error) {
      console.error('Recipe refinement failed:', error);
      return NextResponse.json({ error: 'Failed to refine recipe. Please try again.' }, { status: 502 });
    }
  }

  // mode === 'list' | 'freeform'
  if (typeof cuisine !== 'string' || cuisine.trim().length === 0) {
    return NextResponse.json({ error: 'cuisine is required' }, { status: 400 });
  }

  if (typeof difficulty !== 'string' || !VALID_DIFFICULTIES.includes(difficulty as Difficulty)) {
    return NextResponse.json({ error: 'difficulty must be easy, medium, or hard' }, { status: 400 });
  }

  if (mode === 'list') {
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
  } else {
    if (typeof description !== 'string' || description.trim().length === 0) {
      return NextResponse.json({ error: 'description must be a non-empty string' }, { status: 400 });
    }
  }

  if (process.env.USE_MOCK_RECIPES === 'true') {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const mockIngredients = mode === 'list' ? (ingredients as string[]).map((i) => i.trim()) : null;
    return NextResponse.json({ recipe: getMockRecipe(mockIngredients, locale) });
  }

  try {
    const recipe =
      mode === 'list'
        ? await generateRecipe({
            mode: 'list',
            ingredients: (ingredients as string[]).map((i) => i.trim()),
            cuisine,
            difficulty: difficulty as Difficulty,
            locale,
          })
        : await generateRecipe({
            mode: 'freeform',
            description: (description as string).trim(),
            cuisine,
            difficulty: difficulty as Difficulty,
            locale,
          });

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error('Recipe generation failed:', error);
    return NextResponse.json({ error: 'Failed to generate recipe. Please try again.' }, { status: 502 });
  }
}