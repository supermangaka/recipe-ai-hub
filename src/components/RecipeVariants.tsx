'use client';

import { useTranslations } from 'next-intl';
import { RecipeVersion, RefineVariant } from '@/types/recipe';
import { Spinner } from './Spinner';

const VARIANTS: RefineVariant[] = ['spicier', 'simpler', 'faster', 'healthier'];

type Props = {
  versions: RecipeVersion[];
  activeIndex: number;
  onSelectVersion: (index: number) => void;
  onRefine: (variant: RefineVariant) => void;
  isRefining: boolean;
};

export function RecipeVariants({ versions, activeIndex, onSelectVersion, onRefine, isRefining }: Props) {
  const t = useTranslations('GeneratePage');

  return (
    <div className="flex flex-col gap-3 min-w-0">
      {versions.length > 1 && (
        <div className="flex flex-wrap gap-2 border-b border-[#8A8371] pb-2">
          {versions.map((version, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onSelectVersion(index)}
              className={`px-3 py-1 text-sm ${index === activeIndex
                  ? 'bg-[#1F3327] text-[#FAF6EE]'
                  : 'text-[#8A8371] hover:text-[#1F3327]'
                }`}
            >
              {version.label === 'original' ? t('versionOriginal') : t(`variant_${version.label}`)}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {VARIANTS.map((variant) => (
          <button
            key={variant}
            type="button"
            onClick={() => onRefine(variant)}
            disabled={isRefining}
            className="text-sm border border-[#8A8371] px-3 py-1.5 text-[#1F3327] hover:border-[#D99A2B] disabled:opacity-50 flex items-center gap-2"
          >
            {isRefining && <Spinner />}
            {isRefining ? t('refining') : t(`variant_${variant}`)}
          </button>
        ))}
      </div>
    </div>
  );
}