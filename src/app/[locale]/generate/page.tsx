'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { RecipeForm } from '@/components/RecipeForm';
import { RecipeCard } from '@/components/RecipeCard';
import { Recipe, RecipeFormValues } from '@/types/recipe';

export default function GeneratePage() {
  const t = useTranslations('GeneratePage');
  const locale = useLocale();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isSavingFavorite, setIsSavingFavorite] = useState(false);

  async function handleSubmit(values: RecipeFormValues) {
    setIsLoading(true);
    setError(null);
    setIsFavorited(false);

    try {
      const response = await fetch('/api/recipes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, locale }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? 'Something went wrong');
      }

      const data = await response.json();
      setRecipe(data.recipe);
      setLastPrompt(values.mode === 'list' ? values.ingredients.join(', ') : values.description);
    } catch {
      setError(t('errorGeneration'));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFavorite() {
    if (!recipe) return;
    setIsSavingFavorite(true);

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: recipe.title,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          cookTimeMinutes: recipe.cookTimeMinutes,
          servings: recipe.servings,
          cuisine: recipe.cuisine,
          difficulty: recipe.difficulty,
          locale,
          rawPrompt: lastPrompt,
        }),
      });

      if (!response.ok) throw new Error('Failed to save favorite');
      setIsFavorited(true);
    } catch {
      setError(t('errorFavorite'));
    } finally {
      setIsSavingFavorite(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF6EE] px-4 py-12">
      <div className="max-w-2xl mx-auto flex flex-col gap-10">
        <h1 className="font-serif text-3xl text-[#1F3327]">{t('heading')}</h1>
        <RecipeForm onSubmit={handleSubmit} isLoading={isLoading} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {recipe && (
          <RecipeCard
            recipe={recipe}
            onFavorite={handleFavorite}
            isFavorited={isFavorited}
            isSavingFavorite={isSavingFavorite}
          />
        )}
      </div>
    </main>
  );
}