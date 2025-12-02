import { Session } from "next-auth";

export type AppRole = "admin" | "member" | "guest";

/**
 * Перевіряє чи користувач має привілейований доступ (admin/maintainer в avrocc)
 */
export function isPrivileged(session: Session | null): boolean {
  return session?.user?.isPrivileged === true;
}

/**
 * Перевіряє чи користувач є адміном
 */
export function isAdmin(session: Session | null): boolean {
  return session?.user?.appRole === "admin";
}

/**
 * Перевіряє чи користувач є членом організації
 */
export function isMember(session: Session | null): boolean {
  return session?.user?.appRole === "member" || session?.user?.appRole === "admin";
}

/**
 * Перевіряє чи користувач є гостем
 */
export function isGuest(session: Session | null): boolean {
  return !session || session?.user?.appRole === "guest";
}

/**
 * Повертає роль користувача
 */
export function getAppRole(session: Session | null): AppRole {
  return session?.user?.appRole || "guest";
}

/**
 * Повертає інформацію про користувача для відображення
 */
export function getUserInfo(session: Session | null) {
  if (!session?.user) {
    return {
      isAuthenticated: false,
      name: "Guest",
      role: "guest" as AppRole,
      isPrivileged: false,
    };
  }

  return {
    isAuthenticated: true,
    name: session.user.name || session.user.login || session.user.email || "User",
    email: session.user.email,
    image: session.user.image,
    login: session.user.login,
    role: session.user.appRole || "guest",
    orgRole: session.user.orgRole,
    isPrivileged: session.user.isPrivileged || false,
    orgs: session.user.orgs || [],
  };
}

/**
 * Перевіряє чи користувач належить до організації
 */
export function isOrgMember(session: Session | null, orgName: string): boolean {
  return session?.user?.orgs?.some(
    org => org.login.toLowerCase() === orgName.toLowerCase()
  ) || false;
}

/**
 * Повертає роль користувача в конкретній організації
 */
export function getOrgRole(session: Session | null, orgName: string): "admin" | "member" | null {
  const org = session?.user?.orgs?.find(
    o => o.login.toLowerCase() === orgName.toLowerCase()
  );
  return org?.role || null;
}
