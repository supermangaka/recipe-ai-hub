'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Difficulty, RecipeFormValues } from '@/types/recipe';
import { ErrorBanner } from './ErrorBanner';
import { Spinner } from './Spinner';

type Mode = 'list' | 'freeform';

type Props = {
  onSubmit: (values: RecipeFormValues) => void;
  isLoading: boolean;
};

export function RecipeForm({ onSubmit, isLoading }: Props) {
  const t = useTranslations('GeneratePage');
  const [mode, setMode] = useState<Mode>('list');
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [description, setDescription] = useState('');
  const [cuisine, setCuisine] = useState('any');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [error, setError] = useState<string | null>(null);

  function updateIngredient(index: number, value: string) {
    setIngredients((prev) => prev.map((item, i) => (i === index ? value : item)));
  }

  function addIngredient() {
    setIngredients((prev) => [...prev, '']);
  }

  function removeIngredient(index: number) {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (mode === 'list') {
      const cleaned = ingredients.map((i) => i.trim()).filter(Boolean);
      if (cleaned.length === 0) {
        setError(t('errorEmpty'));
        return;
      }
      setError(null);
      onSubmit({ mode: 'list', ingredients: cleaned, cuisine, difficulty });
    } else {
      const cleaned = description.trim();
      if (cleaned.length === 0) {
        setError(t('errorEmptyFreeform'));
        return;
      }
      setError(null);
      onSubmit({ mode: 'freeform', description: cleaned, cuisine, difficulty });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex border-b border-[#8A8371]">
        <button
          type="button"
          onClick={() => { setMode('list'); setError(null); }}
          className={`px-4 py-2 text-sm ${mode === 'list' ? 'text-[#1F3327] border-b-2 border-[#D99A2B] -mb-px font-medium' : 'text-[#8A8371]'}`}
        >
          {t('modeListLabel')}
        </button>
        <button
          type="button"
          onClick={() => { setMode('freeform'); setError(null); }}
          className={`px-4 py-2 text-sm ${mode === 'freeform' ? 'text-[#1F3327] border-b-2 border-[#D99A2B] -mb-px font-medium' : 'text-[#8A8371]'}`}
        >
          {t('modeFreeformLabel')}
        </button>
      </div>

      {mode === 'list' ? (
        <div className="flex flex-col gap-3">
          {ingredients.map((value, index) => (
            <div key={index} className="flex gap-2">
              <label className="sr-only" htmlFor={`ingredient-${index}`}>
                {t('ingredientLabel')} {index + 1}
              </label>
              <input
                id={`ingredient-${index}`}
                type="text"
                value={value}
                onChange={(e) => updateIngredient(index, e.target.value)}
                placeholder={t('ingredientPlaceholder')}
                className="flex-1 border-b border-[#8A8371] bg-transparent px-1 py-2 text-[#1F3327] placeholder:text-[#8A8371] focus:outline-none focus:border-[#D99A2B]"
              />
              {ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="text-sm text-[#8A8371] hover:text-[#1F3327]"
                >
                  {t('removeIngredient')}
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addIngredient}
            className="self-start text-sm text-[#D99A2B] hover:underline"
          >
            + {t('addIngredient')}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-sm text-[#8A8371]">
            {t('freeformLabel')}
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('freeformPlaceholder')}
            rows={4}
            className="border border-[#8A8371] bg-transparent px-3 py-2 text-[#1F3327] placeholder:text-[#8A8371] focus:outline-none focus:border-[#D99A2B] resize-none"
          />
        </div>
      )}

      {error && <ErrorBanner message={error} />}

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="cuisine" className="text-sm text-[#8A8371]">
            {t('cuisineLabel')}
          </label>
          <select
            id="cuisine"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className="border border-[#8A8371] bg-transparent px-2 py-2 text-[#1F3327]"
          >
            <option value="any">{t('cuisineOptions.any')}</option>
            <option value="mediterranean">{t('cuisineOptions.mediterranean')}</option>
            <option value="asian">{t('cuisineOptions.asian')}</option>
            <option value="mexican">{t('cuisineOptions.mexican')}</option>
            <option value="italian">{t('cuisineOptions.italian')}</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="difficulty" className="text-sm text-[#8A8371]">
            {t('difficultyLabel')}
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className="border border-[#8A8371] bg-transparent px-2 py-2 text-[#1F3327]"
          >
            <option value="easy">{t('difficultyEasy')}</option>
            <option value="medium">{t('difficultyMedium')}</option>
            <option value="hard">{t('difficultyHard')}</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-[#1F3327] text-[#FAF6EE] py-3 font-medium hover:bg-[#16241C] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading && <Spinner />}
        {isLoading ? t('generating') : t('submit')}
      </button>
    </form>
  );
}