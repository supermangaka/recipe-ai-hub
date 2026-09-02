'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { RecipeForm, RecipeFormValues } from '@/components/RecipeForm';
import { RecipeCard } from '@/components/RecipeCard';
import { getMockRecipe } from '@/lib/mock-recipe';
import { Recipe } from '@/types/recipe';

export default function GeneratePage() {
  const t = useTranslations('GeneratePage');
  const locale = useLocale();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(values: RecipeFormValues) {
    setIsLoading(true);
    setTimeout(() => {
      setRecipe(getMockRecipe(values.ingredients, locale));
      setIsLoading(false);
    }, 800);
  }

  return (
    <main className="min-h-screen bg-[#FAF6EE] px-4 py-12">
      <div className="max-w-2xl mx-auto flex flex-col gap-10">
        <h1 className="font-serif text-3xl text-[#1F3327]">{t('heading')}</h1>
        <RecipeForm onSubmit={handleSubmit} isLoading={isLoading} />
        {recipe && <RecipeCard recipe={recipe} />}
      </div>
    </main>
  );
}