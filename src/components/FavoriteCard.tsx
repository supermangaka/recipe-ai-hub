'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { RecipeCard } from './RecipeCard';
import { Recipe } from '@/types/recipe';
import { ErrorBanner } from './ErrorBanner';

export function FavoriteCard({ favoriteId, recipe }: { favoriteId: string; recipe: Recipe }) {
  const t = useTranslations('FavoritesPage');
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState(false);

  async function handleRemove() {
    setIsRemoving(true);
    setError(false);

    try {
      const response = await fetch(`/api/favorites/${favoriteId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to remove');
      router.refresh();
    } catch {
      setError(true);
      setIsRemoving(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <RecipeCard recipe={recipe} />
      <button
        type="button"
        onClick={handleRemove}
        disabled={isRemoving}
        className="self-start text-sm text-[#8A8371] hover:text-red-600 disabled:opacity-50"
      >
        {isRemoving ? t('removing') : t('remove')}
      </button>
      {error && <ErrorBanner message={t('errorRemove')} />}
    </div>
  );
}