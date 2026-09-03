import { getTranslations } from 'next-intl/server';
import { auth, signIn, signOut } from '@/lib/auth';
import { Link } from '@/i18n/navigation';

export default async function HomePage() {
  const t = await getTranslations('HomePage');
  const session = await auth();

  return (
    <main className="min-h-screen bg-[#FAF6EE] flex flex-col items-center justify-center gap-6 px-4">
      <h1 className="font-serif text-4xl text-[#1F3327]">{t('title')}</h1>
      <p className="text-[#8A8371]">{t('subtitle')}</p>

      {session?.user ? (
        <div className="flex flex-col items-center gap-3">
          <p className="text-[#1F3327] text-sm">{t('loggedInAs', { email: session.user.email ?? '' })}</p>
          <Link
            href="/generate"
            className="bg-[#1F3327] text-[#FAF6EE] px-6 py-3 font-medium hover:bg-[#16241C]"
          >
            {t('startGenerating')}
          </Link>
          <form
            action={async () => {
              'use server';
              await signOut();
            }}
          >
            <button type="submit" className="text-sm text-[#8A8371] hover:text-[#1F3327] underline">
              {t('signOut')}
            </button>
          </form>
        </div>
      ) : (
        <form
          action={async () => {
            'use server';
            await signIn('google');
          }}
        >
          <button
            type="submit"
            className="bg-[#1F3327] text-[#FAF6EE] px-6 py-3 font-medium hover:bg-[#16241C]"
          >
            {t('signInWithGoogle')}
          </button>
        </form>
      )}
    </main>
  );
}