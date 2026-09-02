import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage');
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-2">
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <p className="text-gray-500">{t('subtitle')}</p>
    </main>
  );
}