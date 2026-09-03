import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { mapDbRecipeToRecipe, DbRecipeRow } from '@/lib/map-recipe';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { FavoriteCard } from '@/components/FavoriteCard';

type FavoriteRow = {
  id: string;
  recipes: DbRecipeRow;
};

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/signin');
  }

  const t = await getTranslations('FavoritesPage');

  const { data, error } = await supabaseAdmin
    .from('favorites')
    .select('id, recipes(*)')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to load favorites:', error);
  }

  const favorites = ((data as unknown as FavoriteRow[]) ?? []).map((row) => ({
    favoriteId: row.id,
    recipe: mapDbRecipeToRecipe(row.recipes),
  }));

  return (
    <main className="min-h-screen bg-[#FAF6EE] px-4 py-12">
      <div className="max-w-2xl mx-auto flex flex-col gap-10">
        <h1 className="font-serif text-3xl text-[#1F3327]">{t('heading')}</h1>

        {favorites.length === 0 ? (
          <p className="text-[#8A8371]">{t('empty')}</p>
        ) : (
          <div className="flex flex-col gap-8">
            {favorites.map(({ favoriteId, recipe }) => (
              <FavoriteCard key={favoriteId} favoriteId={favoriteId} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}