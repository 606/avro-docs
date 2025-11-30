import Link from 'next/link';
import { BookOpen, Folder, FileText, ArrowRight } from 'lucide-react';
import { getDocsTree, TreeNode } from '@/lib/docs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function Home() {
  const docsTree = getDocsTree();

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
        <p className="text-lg text-muted-foreground max-w-2xl">
          Welcome to the Avro knowledge base. Browse topics using the sidebar, use{' '}
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>{' '}
          to search, or explore categories below.
        </p>
      </div>
      
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
    </div>
  );
}
