"use client";

import { useSession } from "next-auth/react";
import { ReactNode } from "react";
import { Lock, Shield, LogIn, BookOpen } from "lucide-react";
import { AuthButton } from "@/components/auth-button";

interface DocContentWrapperProps {
  children: ReactNode;
  title?: string;
}

export function DocContentWrapper({ children, title }: DocContentWrapperProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="max-w-4xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-5/6" />
          <div className="h-4 bg-muted rounded w-4/5" />
        </div>
      </div>
    );
  }

  // Перевірка доступу
  const appRole = session?.user?.appRole;
  const isPrivileged = session?.user?.isPrivileged;
  const hasAccess = appRole === "admin" || appRole === "member" || isPrivileged === true;

  if (!session) {
    return (
      <div className="max-w-4xl">
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 space-y-6 border rounded-lg bg-gradient-to-b from-muted/30 to-muted/10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold">Documentation Access</h2>
            <p className="text-muted-foreground max-w-md">
              Sign in to access the Avro documentation. 
              Only members of the <strong>avrocc</strong> organization can view this content.
            </p>
          </div>
          <AuthButton />
          <p className="text-xs text-muted-foreground mt-4">
            Need access? Contact an administrator to be added to the organization.
          </p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="max-w-4xl">
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 space-y-6 border rounded-lg bg-gradient-to-b from-amber-500/5 to-amber-500/0">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
            <Shield className="h-8 w-8 text-amber-500" />
          </div>
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold">Access Restricted</h2>
            <p className="text-muted-foreground max-w-md">
              This documentation is only available to members of the <strong>avrocc</strong> organization.
            </p>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Signed in as:</span>
              <span className="font-medium">{session.user?.login || session.user?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Current role:</span>
              <span className="font-medium capitalize">{appRole || "Guest"}</span>
            </div>
            {session.user?.orgs && session.user.orgs.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Organizations:</span>
                <span className="font-medium">{session.user.orgs.map(o => o.login).join(", ")}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 pt-4">
            <p className="text-sm text-muted-foreground">
              Try signing in with a different account:
            </p>
            <AuthButton />
          </div>
        </div>
      </div>
    );
  }

  // Користувач має доступ - показуємо контент
  return <>{children}</>;
}
