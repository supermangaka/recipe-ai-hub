'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { RecipeForm } from '@/components/RecipeForm';
import { RecipeCard } from '@/components/RecipeCard';
import { RecipeVariants } from '@/components/RecipeVariants';
import { Recipe, RecipeFormValues, RecipeVersion, RefineVariant } from '@/types/recipe';

export default function GeneratePage() {
  const t = useTranslations('GeneratePage');
  const locale = useLocale();
  const [versions, setVersions] = useState<RecipeVersion[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lastPrompt, setLastPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isSavingFavorite, setIsSavingFavorite] = useState(false);

  const activeRecipe: Recipe | null = versions[activeIndex]?.recipe ?? null;

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
      setVersions([{ label: 'original', recipe: data.recipe }]);
      setActiveIndex(0);
      setLastPrompt(values.mode === 'list' ? values.ingredients.join(', ') : values.description);
    } catch {
      setError(t('errorGeneration'));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRefine(variant: RefineVariant) {
    if (!activeRecipe) return;
    setIsRefining(true);
    setError(null);

    try {
      const response = await fetch('/api/recipes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'refine', baseRecipe: activeRecipe, variant, locale }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? 'Something went wrong');
      }

      const data = await response.json();
      setVersions((prev) => {
        const next = [...prev, { label: variant, recipe: data.recipe }];
        setActiveIndex(next.length - 1);
        return next;
      });
      setIsFavorited(false);
    } catch {
      setError(t('errorRefine'));
    } finally {
      setIsRefining(false);
    }
  }

  async function handleFavorite() {
    if (!activeRecipe) return;
    setIsSavingFavorite(true);

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: activeRecipe.title,
          ingredients: activeRecipe.ingredients,
          instructions: activeRecipe.instructions,
          cookTimeMinutes: activeRecipe.cookTimeMinutes,
          servings: activeRecipe.servings,
          cuisine: activeRecipe.cuisine,
          difficulty: activeRecipe.difficulty,
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

        {activeRecipe && (
          <div className="flex flex-col gap-4">
            <RecipeVariants
              versions={versions}
              activeIndex={activeIndex}
              onSelectVersion={setActiveIndex}
              onRefine={handleRefine}
              isRefining={isRefining}
            />
            <RecipeCard
              recipe={activeRecipe}
              onFavorite={handleFavorite}
              isFavorited={isFavorited}
              isSavingFavorite={isSavingFavorite}
            />
          </div>
        )}
      </div>
    </main>
  );
}