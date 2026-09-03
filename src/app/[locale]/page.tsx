
import { auth, signIn, signOut } from '@/lib/auth';

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Recipe AI Hub</h1>

      {session?.user ? (
        <div className="flex flex-col items-center gap-2">
          <p>Вошёл как: {session.user.email}</p>
          <form
            action={async () => {
              'use server';
              await signOut();
            }}
          >
            <button type="submit" className="underline">Выйти</button>
          </form>
        </div>
      ) : (
        <form
          action={async () => {
            'use server';
            await signIn('google');
          }}
        >
          <button type="submit" className="bg-[#1F3327] text-white px-4 py-2">
            Войти через Google
          </button>
        </form>
      )}
    </main>
  );
}