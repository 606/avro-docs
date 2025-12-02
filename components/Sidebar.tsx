'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ChevronRight, FileText, Folder, FolderOpen, Search, Menu, X, Home, Lock } from 'lucide-react';
import { TreeNode } from '@/lib/docs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface SidebarProps {
  tree: TreeNode[];
}

export default function Sidebar({ tree }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTree, setFilteredTree] = useState(tree);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { data: session, status } = useSession();

  // Перевірка доступу до документації
  const appRole = session?.user?.appRole;
  const isPrivileged = session?.user?.isPrivileged;
  const hasDocsAccess = appRole === 'admin' || appRole === 'member' || isPrivileged === true;

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTree(tree);
      return;
    }

    const filterTree = (nodes: TreeNode[]): TreeNode[] => {
      return nodes
        .map((node) => {
          if (node.type === 'folder' && node.children) {
            const filteredChildren = filterTree(node.children);
            if (filteredChildren.length > 0) {
              return { ...node, children: filteredChildren };
            }
          }
          if (node.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            return node;
          }
          return null;
        })
        .filter(Boolean) as TreeNode[];
    };

    setFilteredTree(filterTree(tree));
  }, [searchQuery, tree]);

  return (
    <>
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen w-[280px] border-r border-border bg-sidebar flex flex-col",
        "transition-transform duration-300 md:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        {/* Header */}
        <div className="flex-shrink-0 border-b border-border p-4">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-lg font-semibold text-sidebar-foreground hover:text-sidebar-primary transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>Avro Docs</span>
          </Link>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search docs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-sidebar-accent border-sidebar-border"
            />
          </div>
        </div>

        {/* Tree */}
        <ScrollArea className="flex-1">
          <nav className="p-2">
            {hasDocsAccess ? (
              <TreeView nodes={filteredTree} depth={0} />
            ) : (
              <div className="px-3 py-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="h-4 w-4" />
                  <span className="font-medium">Access Restricted</span>
                </div>
                <p className="text-xs">
                  {status === 'loading'
                    ? 'Loading...'
                    : !session
                      ? 'Sign in to access documentation.'
                      : 'Join the avrocc organization to view docs.'}
                </p>
              </div>
            )}
          </nav>
        </ScrollArea>
      </aside>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full shadow-lg md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
    </>
  );
}

interface TreeViewProps {
  nodes: TreeNode[];
  depth: number;
}

function TreeView({ nodes, depth }: TreeViewProps) {
  return (
    <ul className="space-y-1">
      {nodes.map((node) => (
        <TreeItem key={node.path} node={node} depth={depth} />
      ))}
    </ul>
  );
}

interface TreeItemProps {
  node: TreeNode;
  depth: number;
}

function TreeItem({ node, depth }: TreeItemProps) {
  const pathname = usePathname();
  const isInPath = pathname?.startsWith(`/docs/${node.path}/`) || pathname === `/docs/${node.path}`;
  const [isExpanded, setIsExpanded] = useState(isInPath);
  
  const isActive = pathname === `/docs/${node.path}/` || pathname === `/docs/${node.path}`;
  const hasChildren = node.type === 'folder' && node.children && node.children.length > 0;

  const paddingLeft = 12 + depth * 12;

  if (node.type === 'file') {
    return (
      <li>
        <Link 
          href={`/docs/${node.path}/`}
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isActive 
              ? "bg-sidebar-primary/10 text-sidebar-primary font-medium" 
              : "text-sidebar-foreground/80"
          )}
          style={{ paddingLeft }}
        >
          <FileText className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{node.name}</span>
        </Link>
      </li>
    );
  }

  return (
    <li>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              isActive 
                ? "bg-sidebar-primary/10 text-sidebar-primary font-medium" 
                : "text-sidebar-foreground/80"
            )}
            style={{ paddingLeft }}
          >
            <ChevronRight 
              className={cn(
                "h-4 w-4 flex-shrink-0 transition-transform duration-200",
                isExpanded && "rotate-90"
              )} 
            />
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
            ) : (
              <Folder className="h-4 w-4 flex-shrink-0" />
            )}
            <span className="truncate">{node.name}</span>
          </button>
        </CollapsibleTrigger>
        {hasChildren && (
          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            <TreeView nodes={node.children!} depth={depth + 1} />
          </CollapsibleContent>
        )}
      </Collapsible>
    </li>
  );
}
