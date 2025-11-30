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
  Search,
  Sun,
} from "lucide-react"

import { TreeNode } from "@/lib/docs"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
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
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface AppSidebarProps {
  tree: TreeNode[]
}

export function AppSidebar({ tree }: AppSidebarProps) {
  const [open, setOpen] = React.useState(false)
  const [isDark, setIsDark] = React.useState(true)
  const router = useRouter()
  const allDocs = React.useMemo(() => flattenTree(tree), [tree])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSelect = (path: string) => {
    router.push(`/docs/${path}`)
    setOpen(false)
  }

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader className="border-b border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <BookOpen className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">Avro Docs</span>
                    <span className="text-xs text-muted-foreground">v1.0.0</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <Button
            variant="outline"
            className="relative h-9 w-full justify-start rounded-md text-sm text-muted-foreground sm:pr-12 group-data-[collapsible=icon]:hidden"
            onClick={() => setOpen(true)}
          >
            <Search className="mr-2 h-4 w-4" />
            Search docs...
            <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Home">
                  <Link href="/">
                    <Home className="size-4" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Documentation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {tree.map((node) => (
                  <TreeItem key={node.path} node={node} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex items-center justify-between px-2 py-1.5 group-data-[collapsible=icon]:hidden">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
                  <span>Dark Mode</span>
                </div>
                <Switch checked={isDark} onCheckedChange={setIsDark} />
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    className="group-data-[collapsible=icon]:flex hidden"
                    onClick={() => setIsDark(!isDark)}
                  >
                    {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent side="right">Toggle theme</TooltipContent>
              </Tooltip>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search documentation..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Documents">
            {allDocs.map((doc) => (
              <CommandItem
                key={doc.path}
                value={doc.name}
                onSelect={() => handleSelect(doc.path)}
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>{doc.name}</span>
                <span className="ml-2 text-xs text-muted-foreground truncate">
                  {doc.path}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

function TreeItem({ node }: { node: TreeNode }) {
  const pathname = usePathname()
  const isInPath = pathname?.startsWith(`/docs/${node.path}`)
  const isActive = pathname === `/docs/${node.path}/` || pathname === `/docs/${node.path}`
  const hasChildren = node.type === "folder" && node.children && node.children.length > 0

  if (node.type === "file") {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive} tooltip={node.name}>
          <Link href={`/docs/${node.path}/`}>
            <FileText className="size-4" />
            <span>{node.name}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <Collapsible asChild defaultOpen={isInPath} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={node.name}>
            <Folder className="size-4 group-data-[state=open]/collapsible:hidden" />
            <FolderOpen className="size-4 hidden group-data-[state=open]/collapsible:block text-sidebar-primary" />
            <span>{node.name}</span>
            <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        {hasChildren && (
          <CollapsibleContent>
            <SidebarMenuSub>
              {node.children!.map((child) => (
                <TreeSubItem key={child.path} node={child} />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </SidebarMenuItem>
    </Collapsible>
  )
}

function TreeSubItem({ node }: { node: TreeNode }) {
  const pathname = usePathname()
  const isInPath = pathname?.startsWith(`/docs/${node.path}`)
  const isActive = pathname === `/docs/${node.path}/` || pathname === `/docs/${node.path}`
  const hasChildren = node.type === "folder" && node.children && node.children.length > 0

  if (node.type === "file") {
    return (
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild isActive={isActive}>
          <Link href={`/docs/${node.path}/`}>
            <FileText className="size-4" />
            <span>{node.name}</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    )
  }

  return (
    <Collapsible asChild defaultOpen={isInPath} className="group/subcollapsible">
      <SidebarMenuSubItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuSubButton className="cursor-pointer">
            <Folder className="size-4 group-data-[state=open]/subcollapsible:hidden" />
            <FolderOpen className="size-4 hidden group-data-[state=open]/subcollapsible:block text-sidebar-primary" />
            <span>{node.name}</span>
            <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/subcollapsible:rotate-90" />
          </SidebarMenuSubButton>
        </CollapsibleTrigger>
        {hasChildren && (
          <CollapsibleContent>
            <SidebarMenuSub className="ml-2">
              {node.children!.map((child) => (
                <TreeSubItem key={child.path} node={child} />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </SidebarMenuSubItem>
    </Collapsible>
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
