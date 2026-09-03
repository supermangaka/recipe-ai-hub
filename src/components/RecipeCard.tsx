import { useTranslations } from 'next-intl';
import { Recipe } from '@/types/recipe';

type Props = {
  recipe: Recipe;
  onFavorite?: () => void;
  isFavorited?: boolean;
  isSavingFavorite?: boolean;
};

export function RecipeCard({ recipe, onFavorite, isFavorited, isSavingFavorite }: Props) {
  const t = useTranslations('Recipe');

  return (
    <div className="border border-dashed border-[#8A8371] p-6 flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-[#1F3327]">{recipe.title}</h2>
          <div className="flex gap-4 mt-2 text-sm text-[#8A8371]">
            <span>{t('servings')}: {recipe.servings}</span>
            <span>{t('cookTime')}: {recipe.cookTimeMinutes} {t('minutes')}</span>
          </div>
        </div>

        {onFavorite && (
          <button
            type="button"
            onClick={onFavorite}
            disabled={isFavorited || isSavingFavorite}
            className="shrink-0 text-sm border border-[#8A8371] px-3 py-1.5 text-[#1F3327] hover:border-[#D99A2B] disabled:opacity-50 disabled:cursor-default"
          >
            {isFavorited ? t('favorited') : isSavingFavorite ? t('saving') : t('addToFavorites')}
          </button>
        )}
      </div>

      <div>
        <h3 className="font-serif text-lg text-[#1F3327] mb-2">{t('ingredientsTitle')}</h3>
        <ul className="flex flex-col gap-1">
          {recipe.ingredients.map((item, i) => (
            <li key={i} className="text-[#1F3327] before:content-['—_'] before:text-[#D99A2B]">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-serif text-lg text-[#1F3327] mb-2">{t('instructionsTitle')}</h3>
        <ol className="flex flex-col gap-2 list-decimal list-inside">
          {recipe.instructions.map((step, i) => (
            <li key={i} className="text-[#1F3327]">{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}