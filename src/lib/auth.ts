import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      const { error } = await supabaseAdmin
        .from('users')
        .upsert(
          {
            email: user.email,
            name: user.name,
            image: user.image,
          },
          { onConflict: 'email' }
        );

      if (error) {
        console.error('Failed to upsert user:', error);
        return false; // не пускаем логин, если запись в БД не удалась
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const { data } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', user.email)
          .single();

        if (data) {
          token.userId = data.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.userId) {
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
});