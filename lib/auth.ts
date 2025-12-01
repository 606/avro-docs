import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

// List of allowed GitHub usernames or emails
const ALLOWED_USERS = process.env.ALLOWED_USERS?.split(',') || [];

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow all users if ALLOWED_USERS is empty
      if (ALLOWED_USERS.length === 0) {
        return true;
      }
      
      // Check if user's email or GitHub username is in allowed list
      const githubUsername = (profile as { login?: string })?.login;
      const isAllowed = 
        ALLOWED_USERS.includes(user.email || '') || 
        ALLOWED_USERS.includes(githubUsername || '');
      
      return isAllowed;
    },
    async session({ session, token }) {
      // Add user id to session
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
};
