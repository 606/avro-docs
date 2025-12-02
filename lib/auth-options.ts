import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

// Конфігурація доступу
const REQUIRED_ORG = process.env.REQUIRED_GITHUB_ORG || "avrocc";
const PRIVILEGED_ROLES = ["admin", "maintainer"]; // Ролі з повним доступом

console.log("Auth config:", { REQUIRED_ORG, PRIVILEGED_ROLES });

// Типи для розширеного профілю
interface GitHubOrgMembership {
  login: string;
  role: "admin" | "member";
}

// Системні ролі в додатку
type AppRole = "admin" | "member" | "guest";

interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  login?: string;
  orgs?: GitHubOrgMembership[];
  orgRole?: string;        // Роль в GitHub org
  appRole?: AppRole;       // Роль в додатку
  isPrivileged?: boolean;  // Чи має привілейований доступ
}

async function getGitHubOrgs(accessToken: string): Promise<GitHubOrgMembership[]> {
  try {
    // Отримуємо список організацій користувача
    const orgsResponse = await fetch("https://api.github.com/user/orgs", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    
    if (!orgsResponse.ok) return [];
    
    const orgs = await orgsResponse.json();
    
    // Для кожної організації отримуємо роль користувача
    const orgsWithRoles: GitHubOrgMembership[] = await Promise.all(
      orgs.map(async (org: { login: string }) => {
        try {
          const membershipResponse = await fetch(
            `https://api.github.com/user/memberships/orgs/${org.login}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/vnd.github.v3+json",
              },
            }
          );
          
          if (membershipResponse.ok) {
            const membership = await membershipResponse.json();
            return {
              login: org.login,
              role: membership.role as "admin" | "member",
            };
          }
        } catch {
          // Ігноруємо помилки для окремих організацій
        }
        return { login: org.login, role: "member" as const };
      })
    );
    
    return orgsWithRoles;
  } catch (error) {
    console.error("Error fetching GitHub orgs:", error);
    return [];
  }
}

async function getGitHubUsername(accessToken: string): Promise<string | null> {
  try {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    
    if (response.ok) {
      const user = await response.json();
      return user.login;
    }
  } catch (error) {
    console.error("Error fetching GitHub user:", error);
  }
  return null;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      // Додаткові scopes для доступу до організацій
      authorization: {
        params: {
          scope: "read:user user:email read:org",
          prompt: "consent", // Завжди показувати вибір акаунта
        },
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "select_account", // Завжди показувати вибір акаунта Google
        },
      },
    }),
  ],
  pages: {
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      // Всі можуть логінитись - роль визначається пізніше
      return true;
    },
    
    async jwt({ token, account, user }) {
      // Зберігаємо access token та організації при першому логіні
      if (account && user) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
        
        if (account.provider === "github" && account.access_token) {
          const orgs = await getGitHubOrgs(account.access_token);
          const username = await getGitHubUsername(account.access_token);
          token.orgs = orgs;
          token.login = username || undefined;
          
          // Знаходимо membership в потрібній організації
          const targetOrgMembership = orgs.find(org => 
            org.login.toLowerCase() === REQUIRED_ORG.toLowerCase()
          );
          
          token.orgRole = targetOrgMembership?.role || null;
          
          // Визначаємо роль в додатку
          if (targetOrgMembership) {
            // Член організації
            if (PRIVILEGED_ROLES.includes(targetOrgMembership.role)) {
              token.appRole = "admin";
              token.isPrivileged = true;
            } else {
              token.appRole = "member";
              token.isPrivileged = false;
            }
          } else {
            // Не член організації = гість
            token.appRole = "guest";
            token.isPrivileged = false;
          }
          
          console.log(`User ${username}: org=${targetOrgMembership?.login}, role=${targetOrgMembership?.role}, appRole=${token.appRole}`);
        } else {
          // Google або інший провайдер = гість
          token.appRole = "guest";
          token.isPrivileged = false;
        }
      }
      
      return token;
    },
    
    async session({ session, token }) {
      // Додаємо розширену інформацію в сесію
      return {
        ...session,
        user: {
          ...session.user,
          login: token.login,
          orgs: token.orgs,
          orgRole: token.orgRole,
          appRole: token.appRole,
          isPrivileged: token.isPrivileged,
        } as ExtendedUser,
        accessToken: token.accessToken,
      };
    },
  },
};
