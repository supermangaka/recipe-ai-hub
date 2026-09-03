import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { Bitter, Inter } from 'next/font/google';
import { auth } from '@/lib/auth';
import { Navbar } from '@/components/Navbar';
import '../globals.css';

const bitter = Bitter({ subsets: ['latin', 'cyrillic'], variable: '--font-serif' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const session = await auth();

  return (
    <html lang={locale} className={`${bitter.variable} ${inter.variable}`}>
      <body className="font-sans">
        <NextIntlClientProvider messages={messages}>
          <Navbar isAuthenticated={!!session?.user} />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}