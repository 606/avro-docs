import "next-auth";
import "next-auth/jwt";

type AppRole = "admin" | "member" | "guest";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      login?: string;
      orgs?: Array<{
        login: string;
        role: "admin" | "member";
      }>;
      orgRole?: "admin" | "member" | null;  // Роль в GitHub org
      appRole?: AppRole;                     // Роль в додатку
      isPrivileged?: boolean;                // Чи має привілейований доступ
    };
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    provider?: string;
    login?: string;
    orgs?: Array<{
      login: string;
      role: "admin" | "member";
    }>;
    orgRole?: "admin" | "member" | null;
    appRole?: AppRole;
    isPrivileged?: boolean;
  }
}
