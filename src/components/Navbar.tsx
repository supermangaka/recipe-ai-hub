'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useState } from 'react';

const LOCALES = ['en', 'ru', 'pt'] as const;

export function Navbar({ isAuthenticated }: { isAuthenticated: boolean }) {
  const t = useTranslations('Nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function switchLocale(newLocale: string) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <nav className="border-b border-[#8A8371] bg-[#FAF6EE]">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-lg text-[#1F3327]">
          Recipe AI Hub
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-6">
          {isAuthenticated && (
            <>
              <Link href="/generate" className="text-sm text-[#1F3327] hover:text-[#D99A2B]">
                {t('generate')}
              </Link>
              <Link href="/favorites" className="text-sm text-[#1F3327] hover:text-[#D99A2B]">
                {t('favorites')}
              </Link>
            </>
          )}
          <select
            value={locale}
            onChange={(e) => switchLocale(e.target.value)}
            className="text-sm border border-[#8A8371] bg-transparent px-2 py-1 text-[#1F3327]"
            aria-label={t('languageLabel')}
          >
            {LOCALES.map((l) => (
              <option key={l} value={l}>
                {l.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="sm:hidden text-[#1F3327]"
          aria-label={t('menuLabel')}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden border-t border-[#8A8371] px-4 py-4 flex flex-col gap-4">
          {isAuthenticated && (
            <>
              <Link
                href="/generate"
                className="text-sm text-[#1F3327]"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('generate')}
              </Link>
              <Link
                href="/favorites"
                className="text-sm text-[#1F3327]"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('favorites')}
              </Link>
            </>
          )}
          <select
            value={locale}
            onChange={(e) => switchLocale(e.target.value)}
            className="text-sm border border-[#8A8371] bg-transparent px-2 py-1 text-[#1F3327] self-start"
            aria-label={t('languageLabel')}
          >
            {LOCALES.map((l) => (
              <option key={l} value={l}>
                {l.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      )}
    </nav>
  );
}