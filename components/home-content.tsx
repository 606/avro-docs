"use client";

import Link from 'next/link';
import { Folder, FileText, Users, Shield } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { TreeNode } from '@/lib/docs';
import { Badge } from '@/components/ui/badge';
import { AuthButton } from '@/components/auth-button';
import { Logo } from '@/components/logo';

interface HomeContentProps {
  docsTree: TreeNode[];
}

export function HomeContent({ docsTree }: HomeContentProps) {
  const { data: session, status } = useSession();

  const appRole = session?.user?.appRole;
  const isPrivileged = session?.user?.isPrivileged;
  const hasDocsAccess = appRole === 'admin' || appRole === 'member' || isPrivileged === true;

  // Loading
  if (status === 'loading') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="relative">
          <div className="h-8 w-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Logo size="lg" showBadge />
          </div>

          <h1 className="text-2xl font-medium mb-8">
            avro<span className="text-muted-foreground">.cc</span>
          </h1>

          <AuthButton />

          <p className="text-xs text-muted-foreground mt-8">
            private hub
          </p>
        </div>
      </div>
    );
  }

  // Authenticated but no access
  if (!hasDocsAccess) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="border rounded-xl bg-card p-8">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Shield className="h-8 w-8 text-amber-500" />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-center mb-2">
              Access Restricted
            </h2>
            <p className="text-muted-foreground text-center text-sm mb-6">
              Organization membership required
            </p>

            {/* User info */}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 mb-6">
              {session.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt="" 
                  className="h-10 w-10 rounded-lg object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{session.user?.name || session.user?.login}</p>
                <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
              </div>
              <Badge variant="outline" className="text-xs capitalize border-amber-500/30 text-amber-600 dark:text-amber-400">
                {appRole || 'guest'}
              </Badge>
            </div>

            <div className="space-y-3 text-center">
              <p className="text-xs text-muted-foreground">
                Try a different account
              </p>
              <div className="flex justify-center">
                <AuthButton />
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Contact an admin for access
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Has access
  return (
    <div className="max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <Logo size="md" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Documentation</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
          <kbd className="inline-flex h-6 items-center gap-1 rounded border bg-muted px-2 font-mono text-xs">⌘K</kbd>
          <span>Quick search</span>
        </div>
      </div>
      
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {docsTree.map((node) => (
          <Link
            key={node.path}
            href={`/docs/${node.path}`}
            className="group block p-5 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <Folder className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="font-medium text-sm group-hover:text-foreground transition-colors">{node.name}</span>
              </div>
              {node.type === 'folder' && node.children && (
                <span className="text-xs text-muted-foreground tabular-nums">
                  {node.children.length}
                </span>
              )}
            </div>
            {node.type === 'folder' && node.children && (
              <ul className="space-y-1.5 pl-6">
                {node.children.slice(0, 3).map((child) => (
                  <li key={child.path} className="flex items-center gap-2 text-xs text-muted-foreground">
                    {child.type === 'file' ? (
                      <FileText className="h-3 w-3 flex-shrink-0" />
                    ) : (
                      <Folder className="h-3 w-3 flex-shrink-0" />
                    )}
                    <span className="truncate">{child.name}</span>
                  </li>
                ))}
                {node.children.length > 3 && (
                  <li className="text-xs text-muted-foreground/60">
                    +{node.children.length - 3} more
                  </li>
                )}
              </ul>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
