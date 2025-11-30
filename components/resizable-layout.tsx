"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
  Hash,
  Home,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Sun,
  X,
  ExternalLink,
  Link2,
} from "lucide-react"

import { TreeNode, TagInfo } from "@/lib/docs"
import { cn } from "@/lib/utils"
import { getFolderIcon } from "@/lib/folder-icons"
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
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Palette, Check, Monitor, Tag } from "lucide-react"

interface ResizableLayoutProps {
  tree: TreeNode[]
  tags: TagInfo[]
  children: React.ReactNode
}

// Count files in tree recursively
function countFiles(nodes: TreeNode[]): number {
  return nodes.reduce((acc, node) => {
    if (node.type === "file") return acc + 1
    if (node.children) return acc + countFiles(node.children)
    return acc
  }, 0)
}

export function ResizableLayout({ tree, tags, children }: ResizableLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [commandOpen, setCommandOpen] = React.useState(false)
  const [theme, setTheme] = React.useState<'dark' | 'light' | 'nord' | 'dracula' | 'github' | 'system' | 'solarized-light' | 'rose-pine-dawn' | 'catppuccin-latte' | 'one-light' | 'ayu-light' | 'solarized-dark' | 'rose-pine' | 'catppuccin-mocha' | 'one-dark' | 'ayu-dark'>('dark')
  const [mounted, setMounted] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const router = useRouter()
  const pathname = usePathname()
  const allDocs = React.useMemo(() => flattenTree(tree), [tree])

  // Load saved state from localStorage on mount
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('avro-docs-theme') as typeof theme
    const savedCollapsed = localStorage.getItem('avro-docs-sidebar-collapsed') === 'true'
    if (savedTheme) setTheme(savedTheme)
    setIsCollapsed(savedCollapsed)
    setMounted(true)
  }, [])

  // Save theme to localStorage when it changes
  React.useEffect(() => {
    if (mounted) {
      localStorage.setItem('avro-docs-theme', theme)
    }
  }, [theme, mounted])

  // Save sidebar collapsed state
  React.useEffect(() => {
    if (mounted) {
      localStorage.setItem('avro-docs-sidebar-collapsed', String(isCollapsed))
    }
  }, [isCollapsed, mounted])

  // Filter tree based on search
  const filteredTree = React.useMemo(() => {
    if (!searchQuery.trim()) return tree
    return filterTree(tree, searchQuery.toLowerCase())
  }, [tree, searchQuery])

  // Toggle dark mode class on html element based on theme
  React.useEffect(() => {
    if (!mounted) return
    
    const root = document.documentElement
    // Remove all theme classes
    root.classList.remove('dark', 'light', 'theme-nord', 'theme-dracula', 'theme-github', 'theme-solarized-light', 'theme-rose-pine-dawn', 'theme-catppuccin-latte', 'theme-one-light', 'theme-ayu-light', 'theme-solarized-dark', 'theme-rose-pine', 'theme-catppuccin-mocha', 'theme-one-dark', 'theme-ayu-dark')
    
    let effectiveTheme = theme
    if (theme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    
    if (effectiveTheme === 'light') {
      root.classList.add('light')
    } else if (effectiveTheme === 'nord') {
      root.classList.add('dark', 'theme-nord')
    } else if (effectiveTheme === 'dracula') {
      root.classList.add('dark', 'theme-dracula')
    } else if (effectiveTheme === 'github') {
      root.classList.add('dark', 'theme-github')
    } else if (effectiveTheme === 'solarized-light') {
      root.classList.add('light', 'theme-solarized-light')
    } else if (effectiveTheme === 'rose-pine-dawn') {
      root.classList.add('light', 'theme-rose-pine-dawn')
    } else if (effectiveTheme === 'catppuccin-latte') {
      root.classList.add('light', 'theme-catppuccin-latte')
    } else if (effectiveTheme === 'one-light') {
      root.classList.add('light', 'theme-one-light')
    } else if (effectiveTheme === 'ayu-light') {
      root.classList.add('light', 'theme-ayu-light')
    } else if (effectiveTheme === 'solarized-dark') {
      root.classList.add('dark', 'theme-solarized-dark')
    } else if (effectiveTheme === 'rose-pine') {
      root.classList.add('dark', 'theme-rose-pine')
    } else if (effectiveTheme === 'catppuccin-mocha') {
      root.classList.add('dark', 'theme-catppuccin-mocha')
    } else if (effectiveTheme === 'one-dark') {
      root.classList.add('dark', 'theme-one-dark')
    } else if (effectiveTheme === 'ayu-dark') {
      root.classList.add('dark', 'theme-ayu-dark')
    } else {
      root.classList.add('dark')
    }
  }, [theme, mounted])

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
          defaultSize={25}
          minSize={15}
          maxSize={60}
          collapsible
          collapsedSize={4}
          onCollapse={() => setIsCollapsed(true)}
          onExpand={() => setIsCollapsed(false)}
          className={cn(
            "bg-sidebar transition-all duration-300 !overflow-visible",
            isCollapsed && "min-w-[50px] max-w-[50px]"
          )}
        >
          <div className="flex h-screen flex-col">
            {/* Header */}
            <div className={cn(
              "flex h-14 items-center border-b border-sidebar-border px-4 shrink-0",
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
                <Link href="/" className="flex items-center gap-2 group">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sidebar-primary to-sidebar-primary/80 text-sidebar-primary-foreground shadow-sm group-hover:shadow-md transition-shadow">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sidebar-foreground">Avro Docs</span>
                    <span className="text-[10px] text-muted-foreground">{allDocs.length} documents</span>
                  </div>
                </Link>
              )}
            </div>

            {/* Search */}
            {!isCollapsed && (
              <div className="p-3 border-b border-sidebar-border shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Filter docs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-8 h-9 bg-sidebar-accent/50 border-sidebar-border focus-visible:ring-sidebar-primary"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <Button
                  variant="ghost"
                  className="w-full mt-2 justify-between text-xs text-muted-foreground h-8"
                  onClick={() => setCommandOpen(true)}
                >
                  <span>Quick search...</span>
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </Button>
              </div>
            )}

            {isCollapsed && (
              <div className="p-2 border-b border-sidebar-border flex justify-center shrink-0">
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
            <ScrollArea className="flex-1" type="always">
              <div className={cn("p-2 min-w-max", isCollapsed && "px-1")}>
                {/* Home link */}
                {isCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/"
                        className={cn(
                          "flex h-8 w-full items-center justify-center rounded-md transition-colors",
                          pathname === "/" 
                            ? "bg-sidebar-primary/10 text-sidebar-primary" 
                            : "hover:bg-sidebar-accent"
                        )}
                      >
                        <Home className="h-4 w-4" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Home</TooltipContent>
                  </Tooltip>
                ) : (
                  <Link
                    href="/"
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                      pathname === "/" 
                        ? "bg-sidebar-primary/10 text-sidebar-primary font-medium" 
                        : "hover:bg-sidebar-accent text-sidebar-foreground/80"
                    )}
                  >
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>
                )}

                {!isCollapsed && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Documentation
                      </span>
                      {searchQuery && (
                        <Badge variant="secondary" className="text-[10px] h-5">
                          {countFiles(filteredTree)} results
                        </Badge>
                      )}
                    </div>
                    <nav className="space-y-0.5">
                      {filteredTree.map((node) => (
                        <TreeItem key={node.path} node={node} depth={0} />
                      ))}
                      {filteredTree.length === 0 && searchQuery && (
                        <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                          No documents found
                        </div>
                      )}
                    </nav>
                  </div>
                )}

                {isCollapsed && (
                  <div className="mt-2 space-y-1">
                    {tree.slice(0, 10).map((node) => {
                      const FolderIcon = node.type === "folder" ? getFolderIcon(node.name) : FileText;
                      return (
                        <Tooltip key={node.path}>
                          <TooltipTrigger asChild>
                            <Link
                              href={`/docs/${node.path}`}
                              className={cn(
                                "flex h-8 w-full items-center justify-center rounded-md transition-colors",
                                pathname?.startsWith(`/docs/${node.path}`)
                                  ? "bg-sidebar-primary/10 text-sidebar-primary"
                                  : "hover:bg-sidebar-accent"
                              )}
                            >
                              <FolderIcon className="h-4 w-4" />
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="right">{node.name}</TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Tags Link */}
            {tags.length > 0 && (
              <Link
                href="/tags"
                className={cn(
                  "flex items-center gap-2 border-t border-sidebar-border p-3 hover:bg-sidebar-accent/50 transition-colors text-muted-foreground hover:text-foreground",
                  isCollapsed && "justify-center p-2"
                )}
              >
                <Tag className="h-4 w-4" />
                {!isCollapsed && (
                  <>
                    <span className="text-sm font-medium">Browse Tags</span>
                    <Badge variant="outline" className="ml-auto text-[10px] h-5 px-1.5">
                      {tags.length}
                    </Badge>
                  </>
                )}
              </Link>
            )}

            {/* Footer - Theme Selector */}
            <div className={cn(
              "border-t border-sidebar-border p-3 shrink-0",
              isCollapsed && "p-2"
            )}>
              {isCollapsed ? (
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 w-full"
                        >
                          <Palette className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right">Choose theme</TooltipContent>
                  </Tooltip>
                  <DropdownMenuContent side="right" align="end" className="w-48">
                    <DropdownMenuLabel>Choose Theme</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setTheme('light')} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        <span>Light</span>
                      </div>
                      {theme === 'light' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('dark')} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        <span>Dark</span>
                      </div>
                      {theme === 'dark' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('system')} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        <span>System</span>
                      </div>
                      {theme === 'system' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-[10px] font-normal text-muted-foreground">Color Schemes</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setTheme('nord')} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#5E81AC]" />
                        <span>Nord</span>
                      </div>
                      {theme === 'nord' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('dracula')} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#BD93F9]" />
                        <span>Dracula</span>
                      </div>
                      {theme === 'dracula' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('github')} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#58A6FF]" />
                        <span>GitHub Dark</span>
                      </div>
                      {theme === 'github' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-[10px] font-normal text-muted-foreground">Light Themes</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setTheme('solarized-light')} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#B58900]" />
                        <span>Solarized Light</span>
                      </div>
                      {theme === 'solarized-light' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('rose-pine-dawn')} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#D7827E]" />
                        <span>Rosé Pine Dawn</span>
                      </div>
                      {theme === 'rose-pine-dawn' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('catppuccin-latte')} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#8839EF]" />
                        <span>Catppuccin Latte</span>
                      </div>
                      {theme === 'catppuccin-latte' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('one-light')} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#4078F2]" />
                        <span>One Light</span>
                      </div>
                      {theme === 'one-light' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('ayu-light')} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#FF9940]" />
                        <span>Ayu Light</span>
                      </div>
                      {theme === 'ayu-light' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-[10px] font-normal text-muted-foreground">Dark Variants</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setTheme('solarized-dark')} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#268BD2]" />
                        <span>Solarized Dark</span>
                      </div>
                      {theme === 'solarized-dark' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('rose-pine')} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#EB6F92]" />
                        <span>Rosé Pine</span>
                      </div>
                      {theme === 'rose-pine' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('catppuccin-mocha')} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#CBA6F7]" />
                        <span>Catppuccin Mocha</span>
                      </div>
                      {theme === 'catppuccin-mocha' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('one-dark')} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#61AFEF]" />
                        <span>One Dark</span>
                      </div>
                      {theme === 'one-dark' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('ayu-dark')} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#FFCC66]" />
                        <span>Ayu Dark</span>
                      </div>
                      {theme === 'ayu-dark' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between h-9 px-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Palette className="h-4 w-4" />
                        <span>Theme{mounted ? `: ${theme.charAt(0).toUpperCase() + theme.slice(1).replace(/-/g, ' ')}` : ''}</span>
                      </div>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width]">
                    <DropdownMenuLabel>Choose Theme</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setTheme('light')} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        <span>Light</span>
                      </div>
                      {theme === 'light' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('dark')} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        <span>Dark</span>
                      </div>
                      {theme === 'dark' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('system')} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        <span>System</span>
                      </div>
                      {theme === 'system' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-[10px] font-normal text-muted-foreground">Color Schemes</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setTheme('nord')} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#5E81AC]" />
                        <span>Nord</span>
                      </div>
                      {theme === 'nord' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('dracula')} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#BD93F9]" />
                        <span>Dracula</span>
                      </div>
                      {theme === 'dracula' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('github')} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#58A6FF]" />
                        <span>GitHub Dark</span>
                      </div>
                      {theme === 'github' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-[10px] font-normal text-muted-foreground">Light Themes</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setTheme('solarized-light')} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#B58900]" />
                        <span>Solarized Light</span>
                      </div>
                      {theme === 'solarized-light' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('rose-pine-dawn')} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#D7827E]" />
                        <span>Rosé Pine Dawn</span>
                      </div>
                      {theme === 'rose-pine-dawn' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('catppuccin-latte')} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#8839EF]" />
                        <span>Catppuccin Latte</span>
                      </div>
                      {theme === 'catppuccin-latte' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('one-light')} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#4078F2]" />
                        <span>One Light</span>
                      </div>
                      {theme === 'one-light' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('ayu-light')} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#FF9940]" />
                        <span>Ayu Light</span>
                      </div>
                      {theme === 'ayu-light' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-[10px] font-normal text-muted-foreground">Dark Variants</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setTheme('solarized-dark')} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#268BD2]" />
                        <span>Solarized Dark</span>
                      </div>
                      {theme === 'solarized-dark' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('rose-pine')} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#EB6F92]" />
                        <span>Rosé Pine</span>
                      </div>
                      {theme === 'rose-pine' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('catppuccin-mocha')} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#CBA6F7]" />
                        <span>Catppuccin Mocha</span>
                      </div>
                      {theme === 'catppuccin-mocha' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('one-dark')} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#61AFEF]" />
                        <span>One Dark</span>
                      </div>
                      {theme === 'one-dark' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('ayu-dark')} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-[#FFCC66]" />
                        <span>Ayu Dark</span>
                      </div>
                      {theme === 'ayu-dark' && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={80} minSize={50}>
          <div className="flex h-screen flex-col">
            <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
              <Breadcrumbs />
            </header>
            <main className="flex-1 overflow-auto">
              <div className="max-w-4xl mx-auto p-6">
                {children}
              </div>
            </main>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Search documentation..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            {allDocs.slice(0, 30).map((doc) => (
              <CommandItem
                key={doc.path}
                value={`${doc.name} ${doc.path}`}
                onSelect={() => handleSelect(doc.path)}
                className="flex items-center gap-2 aria-selected:bg-secondary aria-selected:text-secondary-foreground"
              >
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="flex flex-col">
                  <span>{doc.title || doc.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {doc.path}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </TooltipProvider>
  )
}

function Breadcrumbs() {
  const pathname = usePathname()
  
  if (!pathname || pathname === "/") {
    return <span className="text-sm text-muted-foreground">Home</span>
  }
  
  const parts = pathname.split("/").filter(Boolean)
  
  return (
    <nav className="flex items-center gap-1 text-sm overflow-hidden">
      <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors shrink-0 flex items-center gap-1">
        <Home className="h-3.5 w-3.5" />
        Home
      </Link>
      {parts.map((part, index) => {
        const href = "/" + parts.slice(0, index + 1).join("/")
        const isLast = index === parts.length - 1
        const name = part.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
        const BreadcrumbIcon = getFolderIcon(part)
        
        return (
          <React.Fragment key={href}>
            <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
            {isLast ? (
              <span className="text-foreground font-medium truncate flex items-center gap-1">
                <BreadcrumbIcon className="h-3.5 w-3.5 shrink-0" />
                {name}
              </span>
            ) : (
              <Link href={href} className="text-muted-foreground hover:text-foreground transition-colors truncate flex items-center gap-1">
                <BreadcrumbIcon className="h-3.5 w-3.5 shrink-0" />
                {name}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

function TreeItem({ node, depth }: { node: TreeNode; depth: number }) {
  const pathname = usePathname()
  const isInPath = pathname?.startsWith(`/docs/${node.path}`)
  const isActive = pathname === `/docs/${node.path}/` || pathname === `/docs/${node.path}`
  const hasChildren = node.type === "folder" && node.children && node.children.length > 0
  const [isOpen, setIsOpen] = React.useState(isInPath)

  const paddingLeft = 12 + depth * 16

  if (node.type === "file") {
    return (
      <Link
        href={`/docs/${node.path}/`}
        className={cn(
          "group flex items-center gap-2 rounded-md py-1.5 pr-2 text-sm transition-all",
          "hover:bg-sidebar-accent",
          isActive
            ? "bg-sidebar-primary/10 text-sidebar-primary font-medium"
            : "text-sidebar-foreground/70 hover:text-sidebar-foreground"
        )}
        style={{ paddingLeft }}
      >
        <Hash className={cn(
          "h-3.5 w-3.5 shrink-0 transition-colors",
          isActive ? "text-sidebar-primary" : "text-muted-foreground group-hover:text-sidebar-foreground"
        )} />
        <span className="whitespace-nowrap">{node.title || node.name}</span>
      </Link>
    )
  }

  const fileCount = node.children ? countFiles(node.children) : 0

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            "group flex w-full items-center gap-2 rounded-md py-1.5 pr-2 text-sm transition-all",
            "hover:bg-sidebar-accent",
            isActive
              ? "bg-sidebar-primary/10 text-sidebar-primary font-medium"
              : "text-sidebar-foreground/80 hover:text-sidebar-foreground"
          )}
          style={{ paddingLeft }}
        >
          <ChevronDown className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-200",
            !isOpen && "-rotate-90"
          )} />
          {(() => {
            const FolderIcon = getFolderIcon(node.name)
            return (
              <FolderIcon className={cn(
                "h-4 w-4 shrink-0",
                isOpen ? "text-sidebar-primary" : "text-muted-foreground group-hover:text-sidebar-foreground"
              )} />
            )
          })()}
          <span className="whitespace-nowrap flex-1 text-left">{node.name}</span>
          <span className="text-[10px] text-muted-foreground tabular-nums ml-2">{fileCount}</span>
        </button>
      </CollapsibleTrigger>
      {hasChildren && (
        <CollapsibleContent className="relative">
          <div 
            className="absolute top-0 bottom-2 w-px bg-sidebar-border/50" 
            style={{ left: `${paddingLeft + 7}px` }}
          />
          {node.children!.map((child) => (
            <TreeItem key={child.path} node={child} depth={depth + 1} />
          ))}
        </CollapsibleContent>
      )}
    </Collapsible>
  )
}

function filterTree(nodes: TreeNode[], query: string): TreeNode[] {
  return nodes
    .map((node) => {
      if (node.type === "folder" && node.children) {
        const filteredChildren = filterTree(node.children, query)
        if (filteredChildren.length > 0) {
          return { ...node, children: filteredChildren }
        }
      }
      if (node.name.toLowerCase().includes(query)) {
        return node
      }
      return null
    })
    .filter(Boolean) as TreeNode[]
}

function flattenTree(nodes: TreeNode[]): { name: string; title?: string; path: string }[] {
  const result: { name: string; title?: string; path: string }[] = []
  for (const node of nodes) {
    if (node.type === "file") {
      result.push({ name: node.name, title: node.title, path: node.path })
    }
    if (node.children) {
      result.push(...flattenTree(node.children))
    }
  }
  return result
}
