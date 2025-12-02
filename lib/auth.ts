import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import DiscordProvider from 'next-auth/providers/discord';
import CredentialsProvider from 'next-auth/providers/credentials';

// List of allowed usernames or emails
const ALLOWED_USERS = process.env.ALLOWED_USERS?.split(',').filter(Boolean) || [];

// Simple password auth (for single user)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Build providers array dynamically
const providers = [];

// GitHub OAuth
if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    })
  );
}

// Google OAuth
if (process.env.GOOGLE_ID && process.env.GOOGLE_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    })
  );
}

// Discord OAuth
if (process.env.DISCORD_ID && process.env.DISCORD_SECRET) {
  providers.push(
    DiscordProvider({
      clientId: process.env.DISCORD_ID,
      clientSecret: process.env.DISCORD_SECRET,
    })
  );
}

// Simple Password Auth (no database needed)
if (ADMIN_PASSWORD) {
  providers.push(
    CredentialsProvider({
      id: 'password',
      name: 'Password',
      credentials: {
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (credentials?.password === ADMIN_PASSWORD) {
          return {
            id: 'admin',
            name: 'Admin',
            email: 'admin@avro.cc',
          };
        }
        return null;
      },
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow all users if ALLOWED_USERS is empty
      if (ALLOWED_USERS.length === 0) {
        return true;
      }
      
      // Check if user's email or username is in allowed list
      const githubUsername = (profile as { login?: string })?.login;
      const isAllowed = 
        ALLOWED_USERS.includes(user.email || '') || 
        ALLOWED_USERS.includes(githubUsername || '') ||
        user.id === 'admin'; // Always allow password auth
      
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
  debug: process.env.NODE_ENV === 'development',
};
