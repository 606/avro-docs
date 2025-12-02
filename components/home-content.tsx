"use client";

import Link from 'next/link';
import { BookOpen, Folder, FileText, ArrowRight, Shield, LogIn } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { TreeNode } from '@/lib/docs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AuthButton } from '@/components/auth-button';

interface HomeContentProps {
  docsTree: TreeNode[];
}

export function HomeContent({ docsTree }: HomeContentProps) {
  const { data: session, status } = useSession();

  // Перевірка доступу
  const appRole = session?.user?.appRole;
  const isPrivileged = session?.user?.isPrivileged;
  const hasDocsAccess = appRole === 'admin' || appRole === 'member' || isPrivileged === true;

  return (
    <div className="max-w-5xl">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Avro Documentation</h1>
            <p className="text-muted-foreground">Knowledge base and technical documentation</p>
          </div>
        </div>
        {hasDocsAccess && (
          <p className="text-lg text-muted-foreground max-w-2xl">
            Welcome to the Avro knowledge base. Browse topics using the sidebar, use{' '}
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>{' '}
            to search, or explore categories below.
          </p>
        )}
      </div>
      
      {status === 'loading' ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      ) : !session ? (
        // Не авторизований
        <div className="flex flex-col items-center justify-center py-16 px-8 border rounded-lg bg-gradient-to-b from-muted/30 to-muted/10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Sign in to Access</h2>
          <p className="text-muted-foreground max-w-md text-center mb-6">
            Sign in with your GitHub account to access the documentation.
            Only members of the <strong>avrocc</strong> organization can view content.
          </p>
          <AuthButton />
        </div>
      ) : !hasDocsAccess ? (
        // Авторизований, але немає доступу
        <div className="flex flex-col items-center justify-center py-16 px-8 border rounded-lg bg-gradient-to-b from-amber-500/5 to-amber-500/0">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 mb-6">
            <Shield className="h-8 w-8 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Access Restricted</h2>
          <p className="text-muted-foreground max-w-md text-center mb-4">
            This documentation is only available to members of the <strong>avrocc</strong> organization.
          </p>
          <div className="bg-muted/50 rounded-lg p-4 mb-6 text-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-muted-foreground">Signed in as:</span>
              <span className="font-medium">{session.user?.login || session.user?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Current role:</span>
              <span className="font-medium capitalize">{appRole || 'Guest'}</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground">Try signing in with a different account:</p>
            <AuthButton />
          </div>
        </div>
      ) : (
        // Має доступ - показуємо контент
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {docsTree.map((node) => (
            <div 
              key={node.path} 
              className="group relative rounded-lg border bg-card p-5 hover:border-primary transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Folder className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold">{node.name}</h2>
                </div>
                {node.type === 'folder' && node.children && (
                  <Badge variant="secondary" className="text-xs">
                    {node.children.length}
                  </Badge>
                )}
              </div>
              {node.type === 'folder' && node.children && (
                <ul className="space-y-1.5 mb-4">
                  {node.children.slice(0, 4).map((child) => (
                    <li key={child.path}>
                      <Link 
                        href={`/docs/${child.path}`}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {child.type === 'file' ? (
                          <FileText className="h-3.5 w-3.5" />
                        ) : (
                          <Folder className="h-3.5 w-3.5" />
                        )}
                        <span className="truncate">{child.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {node.type === 'folder' && node.children && node.children.length > 4 && (
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link href={`/docs/${node.path}`}>
                    View all {node.children.length} items
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
