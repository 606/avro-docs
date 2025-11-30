"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BookOpen,
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
  Home,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Sun,
} from "lucide-react"

import { TreeNode } from "@/lib/docs"
import { cn } from "@/lib/utils"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

interface ResizableLayoutProps {
  tree: TreeNode[]
  children: React.ReactNode
}

export function ResizableLayout({ tree, children }: ResizableLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [commandOpen, setCommandOpen] = React.useState(false)
  const [isDark, setIsDark] = React.useState(true)
  const router = useRouter()
  const allDocs = React.useMemo(() => flattenTree(tree), [tree])

  // Toggle dark mode class on html element
  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSelect = (path: string) => {
    router.push(`/docs/${path}`)
    setCommandOpen(false)
  }

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-screen"
      >
        <ResizablePanel
          defaultSize={20}
          minSize={15}
          maxSize={40}
          collapsible
          collapsedSize={4}
          onCollapse={() => setIsCollapsed(true)}
          onExpand={() => setIsCollapsed(false)}
          className={cn(
            "bg-sidebar transition-all duration-300",
            isCollapsed && "min-w-[50px] max-w-[50px]"
          )}
        >
          <div className="flex h-screen flex-col">
            {/* Header */}
            <div className={cn(
              "flex h-14 items-center border-b border-sidebar-border px-4",
              isCollapsed && "justify-center px-2"
            )}>
              {isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/" className="flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-sidebar-primary" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Avro Docs</TooltipContent>
                </Tooltip>
              ) : (
                <Link href="/" className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sidebar-foreground">Avro Docs</span>
                    <span className="text-xs text-muted-foreground">v1.0.0</span>
                  </div>
                </Link>
              )}
            </div>

            {/* Search */}
            {!isCollapsed && (
              <div className="p-3 border-b border-sidebar-border">
                <Button
                  variant="outline"
                  className="relative w-full justify-start text-sm text-muted-foreground"
                  onClick={() => setCommandOpen(true)}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search docs...
                  <kbd className="pointer-events-none absolute right-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:flex">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </Button>
              </div>
            )}

            {isCollapsed && (
              <div className="p-2 border-b border-sidebar-border flex justify-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCommandOpen(true)}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Search (⌘K)</TooltipContent>
                </Tooltip>
              </div>
            )}

            {/* Navigation */}
            <ScrollArea className="flex-1">
              <div className={cn("p-2", isCollapsed && "px-1")}>
                {/* Home link */}
                {isCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/"
                        className="flex h-8 w-full items-center justify-center rounded-md hover:bg-sidebar-accent"
                      >
                        <Home className="h-4 w-4" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Home</TooltipContent>
                  </Tooltip>
                ) : (
                  <Link
                    href="/"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent"
                  >
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>
                )}

                {!isCollapsed && (
                  <div className="mt-4">
                    <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                      Documentation
                    </div>
                    <nav className="space-y-1">
                      {tree.map((node) => (
                        <TreeItem key={node.path} node={node} depth={0} />
                      ))}
                    </nav>
                  </div>
                )}

                {isCollapsed && (
                  <div className="mt-2 space-y-1">
                    {tree.slice(0, 10).map((node) => (
                      <Tooltip key={node.path}>
                        <TooltipTrigger asChild>
                          <Link
                            href={`/docs/${node.path}`}
                            className="flex h-8 w-full items-center justify-center rounded-md hover:bg-sidebar-accent"
                          >
                            {node.type === "folder" ? (
                              <Folder className="h-4 w-4" />
                            ) : (
                              <FileText className="h-4 w-4" />
                            )}
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">{node.name}</TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className={cn(
              "border-t border-sidebar-border p-3",
              isCollapsed && "p-2"
            )}>
              {isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 w-full"
                      onClick={() => setIsDark(!isDark)}
                    >
                      {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Toggle theme</TooltipContent>
                </Tooltip>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    <span>Dark Mode</span>
                  </div>
                  <Switch checked={isDark} onCheckedChange={setIsDark} />
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={80} minSize={50}>
          <div className="flex h-screen flex-col">
            <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                  >
                    {isCollapsed ? (
                      <PanelLeftOpen className="h-4 w-4" />
                    ) : (
                      <PanelLeftClose className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                </TooltipContent>
              </Tooltip>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-sm text-muted-foreground">Documentation</span>
            </header>
            <main className="flex-1 overflow-auto p-6">
              {children}
            </main>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Search documentation..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            {allDocs.slice(0, 20).map((doc) => (
              <CommandItem
                key={doc.path}
                value={`${doc.name} ${doc.path}`}
                onSelect={() => handleSelect(doc.path)}
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>{doc.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {doc.path}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </TooltipProvider>
  )
}

function TreeItem({ node, depth }: { node: TreeNode; depth: number }) {
  const pathname = usePathname()
  const isInPath = pathname?.startsWith(`/docs/${node.path}`)
  const isActive = pathname === `/docs/${node.path}/` || pathname === `/docs/${node.path}`
  const hasChildren = node.type === "folder" && node.children && node.children.length > 0

  // Відступ для папок
  const folderPaddingLeft = 8 + depth * 20
  // Відступ для файлів - додатковий відступ щоб вони були правіше від папок
  const filePaddingLeft = 8 + depth * 20 + 24

  if (node.type === "file") {
    return (
      <div className="relative">
        {depth > 0 && (
          <div 
            className="absolute left-0 top-0 bottom-0 w-px bg-sidebar-border" 
            style={{ left: `${8 + (depth - 1) * 20 + 6}px` }}
          />
        )}
        <Link
          href={`/docs/${node.path}/`}
          className={cn(
            "flex items-center gap-2 rounded-md py-1.5 text-sm transition-colors",
            "hover:bg-sidebar-accent",
            isActive
              ? "bg-sidebar-primary/10 text-sidebar-primary font-medium"
              : "text-sidebar-foreground/80"
          )}
          style={{ paddingLeft: filePaddingLeft }}
        >
          <FileText className="h-4 w-4 shrink-0" />
          <span>{node.name}</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="relative">
      {depth > 0 && (
        <div 
          className="absolute left-0 top-0 bottom-0 w-px bg-sidebar-border" 
          style={{ left: `${8 + (depth - 1) * 20 + 6}px` }}
        />
      )}
      <Collapsible defaultOpen={isInPath}>
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              "flex w-full items-center gap-2 rounded-md py-1.5 text-sm transition-colors",
              "hover:bg-sidebar-accent",
              isActive
                ? "bg-sidebar-primary/10 text-sidebar-primary font-medium"
                : "text-sidebar-foreground/80"
            )}
            style={{ paddingLeft: folderPaddingLeft }}
          >
            <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 [[data-state=open]>&]:rotate-90" />
            <Folder className="h-4 w-4 shrink-0 [[data-state=open]>&]:hidden" />
            <FolderOpen className="h-4 w-4 shrink-0 hidden [[data-state=open]>&]:block text-sidebar-primary" />
            <span>{node.name}</span>
          </button>
        </CollapsibleTrigger>
        {hasChildren && (
          <CollapsibleContent className="relative">
            <div 
              className="absolute top-0 bottom-2 w-px bg-sidebar-border" 
              style={{ left: `${folderPaddingLeft + 6}px` }}
            />
            {node.children!.map((child) => (
              <TreeItem key={child.path} node={child} depth={depth + 1} />
            ))}
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  )
}

function flattenTree(nodes: TreeNode[]): { name: string; path: string }[] {
  const result: { name: string; path: string }[] = []
  for (const node of nodes) {
    if (node.type === "file") {
      result.push({ name: node.name, path: node.path })
    }
    if (node.children) {
      result.push(...flattenTree(node.children))
    }
  }
  return result
}
