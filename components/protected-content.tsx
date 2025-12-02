"use client";

import { useSession } from "next-auth/react";
import { ReactNode } from "react";
import { Lock, Shield, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthButton } from "@/components/auth-button";

type RequiredRole = "admin" | "member" | "authenticated";

interface ProtectedContentProps {
  children: ReactNode;
  requiredRole?: RequiredRole;
  fallback?: ReactNode;
  showMessage?: boolean;
}

export function ProtectedContent({
  children,
  requiredRole = "member",
  fallback,
  showMessage = true,
}: ProtectedContentProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Не авторизований
  if (!session) {
    if (fallback) return <>{fallback}</>;
    if (!showMessage) return null;
    
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 border rounded-lg bg-muted/30">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <LogIn className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="font-semibold">Sign in required</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Please sign in to access this content.
          </p>
        </div>
        <AuthButton />
      </div>
    );
  }

  const appRole = session.user?.appRole;
  const isPrivileged = session.user?.isPrivileged;

  // Перевірка ролі
  let hasAccess = false;
  
  if (requiredRole === "authenticated") {
    hasAccess = true;
  } else if (requiredRole === "member") {
    hasAccess = appRole === "admin" || appRole === "member" || isPrivileged === true;
  } else if (requiredRole === "admin") {
    hasAccess = appRole === "admin" || isPrivileged === true;
  }

  if (!hasAccess) {
    if (fallback) return <>{fallback}</>;
    if (!showMessage) return null;
    
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 border rounded-lg bg-muted/30">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
          <Shield className="h-6 w-6 text-amber-500" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="font-semibold">Access Restricted</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {requiredRole === "admin" 
              ? "This content is only available to administrators."
              : "This content is only available to organization members."
            }
          </p>
          <p className="text-xs text-muted-foreground">
            You are signed in as <strong>{session.user?.login || session.user?.email}</strong> 
            {" "}with role <strong>{appRole || "guest"}</strong>.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Компонент для показу контенту тільки адмінам
 */
export function AdminOnly({ 
  children, 
  fallback 
}: { 
  children: ReactNode; 
  fallback?: ReactNode;
}) {
  return (
    <ProtectedContent requiredRole="admin" fallback={fallback} showMessage={false}>
      {children}
    </ProtectedContent>
  );
}

/**
 * Компонент для показу контенту членам організації
 */
export function MembersOnly({ 
  children, 
  fallback 
}: { 
  children: ReactNode; 
  fallback?: ReactNode;
}) {
  return (
    <ProtectedContent requiredRole="member" fallback={fallback} showMessage={false}>
      {children}
    </ProtectedContent>
  );
}

/**
 * Компонент для показу контенту авторизованим користувачам
 */
export function AuthenticatedOnly({ 
  children, 
  fallback 
}: { 
  children: ReactNode; 
  fallback?: ReactNode;
}) {
  return (
    <ProtectedContent requiredRole="authenticated" fallback={fallback} showMessage={false}>
      {children}
    </ProtectedContent>
  );
}
