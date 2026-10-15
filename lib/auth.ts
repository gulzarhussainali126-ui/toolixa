import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt', maxAge: 60 * 60 * 8, updateAge: 60 * 30 },
  providers: [CredentialsProvider({
    name: 'TOOLIXA Admin',
    credentials: { email: { label: 'Admin email', type: 'email' }, password: { label: 'Password', type: 'password' } },
    async authorize(credentials) {
      const expectedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
      const passwordHash = process.env.ADMIN_PASSWORD_HASH;
      if (!expectedEmail || !passwordHash || !process.env.NEXTAUTH_SECRET) return null;
      const email = credentials?.email?.trim().toLowerCase();
      const password = credentials?.password;
      if (!email || !password || email !== expectedEmail) return null;
      const valid = await bcrypt.compare(password, passwordHash).catch(() => false);
      if (!valid) return null;
      return { id: 'env-super-admin', name: 'TOOLIXA Super Admin', email, role: 'SUPER_ADMIN' } as any;
    }
  })],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { (token as any).role = (user as any).role || 'USER'; (token as any).uid = user.id; }
      return token;
    },
    async session({ session, token }) {
      if (session.user) { (session.user as any).id = (token as any).uid; (session.user as any).role = (token as any).role || 'USER'; }
      return session;
    }
  },
  pages: { signIn: '/admin/login', error: '/admin/login' },
};
