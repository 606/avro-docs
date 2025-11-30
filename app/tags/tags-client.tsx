"use client"

import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Tag, FileText, ArrowLeft, Hash, Search, Sparkles, TrendingUp, FolderOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Suspense, useState, useMemo } from "react"
import { TagInfo, DocWithTags } from "@/lib/docs"
import { cn } from "@/lib/utils"

// Calculate tag size based on count
function getTagSize(count: number, maxCount: number): string {
  const ratio = count / maxCount
  if (ratio > 0.7) return "text-xl font-semibold"
  if (ratio > 0.4) return "text-base font-medium"
  if (ratio > 0.2) return "text-sm"
  return "text-xs"
}

// Get color class based on tag index for visual variety
function getTagColor(index: number): string {
  const colors = [
    "hover:bg-blue-500/20 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/50",
    "hover:bg-purple-500/20 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-500/50",
    "hover:bg-green-500/20 hover:text-green-600 dark:hover:text-green-400 hover:border-green-500/50",
    "hover:bg-orange-500/20 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-500/50",
    "hover:bg-pink-500/20 hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-500/50",
    "hover:bg-cyan-500/20 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/50",
  ]
  return colors[index % colors.length]
}

function TagsPageContent({ 
  tags, 
  docs 
}: { 
  tags: TagInfo[]
  docs: DocWithTags[]
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedTag = searchParams.get("tag")
  const [searchQuery, setSearchQuery] = useState("")

  const maxCount = Math.max(...tags.map(t => t.count))

  const filteredDocs = selectedTag 
    ? docs.filter(doc => doc.tags.includes(selectedTag.toLowerCase()))
    : []

  // Filter tags based on search
  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) return tags
    return tags.filter(tag => 
      tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [tags, searchQuery])

  // Group tags by first letter for better organization
  const groupedTags = useMemo(() => {
    return filteredTags.reduce((acc, tag) => {
      const firstLetter = tag.name[0].toUpperCase()
      if (!acc[firstLetter]) acc[firstLetter] = []
      acc[firstLetter].push(tag)
      return acc
    }, {} as Record<string, TagInfo[]>)
  }, [filteredTags])

  // Get related tags (tags that appear together with selected tag)
  const relatedTags = useMemo(() => {
    if (!selectedTag) return []
    const tagCounts = new Map<string, number>()
    filteredDocs.forEach(doc => {
      doc.tags.forEach(tag => {
        if (tag !== selectedTag.toLowerCase()) {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
        }
      })
    })
    return Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }))
  }, [selectedTag, filteredDocs])

  // Group filtered docs by folder
  const docsByFolder = useMemo(() => {
    const grouped = new Map<string, DocWithTags[]>()
    filteredDocs.forEach(doc => {
      const parts = doc.path.split('/')
      const folder = parts.length > 1 ? parts[0] : 'root'
      if (!grouped.has(folder)) grouped.set(folder, [])
      grouped.get(folder)!.push(doc)
    })
    return grouped
  }, [filteredDocs])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20">
            <Tag className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tags</h1>
            <p className="text-muted-foreground">
              Explore {tags.length} tags across {docs.length} documents
            </p>
          </div>
        </div>
      </div>

      {/* Selected Tag Results */}
      {selectedTag && (
        <div className="space-y-6">
          {/* Breadcrumb & Tag Info */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Link 
                href="/tags" 
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                All tags
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="default" className="text-base px-4 py-1.5 gap-1.5">
                <Hash className="h-4 w-4" />
                {selectedTag}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {filteredDocs.length} document{filteredDocs.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Related Tags */}
          {relatedTags.length > 0 && (
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Related tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {relatedTags.map((tag) => (
                  <Link key={tag.name} href={`/tags?tag=${encodeURIComponent(tag.name)}`}>
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                    >
                      {tag.name}
                      <span className="ml-1.5 text-[10px] opacity-50">{tag.count}</span>
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Documents grouped by folder */}
          <div className="space-y-6">
            {Array.from(docsByFolder.entries()).map(([folder, folderDocs]) => (
              <div key={folder} className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FolderOpen className="h-4 w-4" />
                  <span className="font-medium capitalize">{folder}</span>
                  <span className="text-xs">({folderDocs.length})</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {folderDocs.map((doc) => (
                    <Link
                      key={doc.path}
                      href={`/docs/${doc.path}`}
                      className="group relative flex flex-col gap-2 rounded-lg border bg-card p-4 transition-all hover:border-primary hover:shadow-md hover:shadow-primary/5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted group-hover:bg-primary/10 transition-colors">
                          <FileText className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                            {doc.title}
                          </h3>
                          {doc.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                              {doc.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {doc.tags.slice(0, 3).map((tag) => (
                          <Badge 
                            key={tag} 
                            variant={tag === selectedTag.toLowerCase() ? "default" : "secondary"}
                            className="text-[10px] px-1.5 py-0"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {doc.tags.length > 3 && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            +{doc.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Tags View */}
      {!selectedTag && (
        <div className="space-y-8">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Trending Tags */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Trending</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {tags.slice(0, 15).map((tag, index) => (
                <Link key={tag.name} href={`/tags?tag=${encodeURIComponent(tag.name)}`}>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "cursor-pointer transition-all duration-200 border-2",
                      getTagSize(tag.count, maxCount),
                      getTagColor(index),
                      "px-3 py-1.5"
                    )}
                  >
                    <Hash className="h-3 w-3 mr-1 opacity-50" />
                    {tag.name}
                    <span className="ml-2 text-[10px] opacity-40 font-normal">{tag.count}</span>
                  </Badge>
                </Link>
              ))}
            </div>
          </div>

          {/* All Tags Alphabetically */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">All Tags</h2>
            
            {/* Alphabet Quick Nav */}
            <div className="flex flex-wrap gap-1 pb-2">
              {Object.keys(groupedTags).sort().map((letter) => (
                <button
                  key={letter}
                  onClick={() => {
                    document.getElementById(`letter-${letter}`)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  {letter}
                </button>
              ))}
            </div>

            {/* Tags Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(groupedTags).sort().map(([letter, letterTags]) => (
                <div 
                  key={letter} 
                  id={`letter-${letter}`}
                  className="space-y-3 scroll-mt-4"
                >
                  <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 pb-2">
                    <h3 className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                        {letter}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {letterTags.length} tag{letterTags.length !== 1 ? 's' : ''}
                      </span>
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {letterTags.map((tag, index) => (
                      <Link key={tag.name} href={`/tags?tag=${encodeURIComponent(tag.name)}`}>
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            "cursor-pointer transition-all",
                            getTagColor(index)
                          )}
                        >
                          {tag.name}
                          <span className="ml-1.5 text-[10px] opacity-40">{tag.count}</span>
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {filteredTags.length === 0 && searchQuery && (
              <div className="text-center py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No tags found</h3>
                <p className="text-muted-foreground mt-1">
                  No tags match "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function TagsClient({ 
  tags, 
  docs 
}: { 
  tags: TagInfo[]
  docs: DocWithTags[]
}) {
  return (
    <Suspense fallback={
      <div className="space-y-8 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-muted" />
          <div className="space-y-2">
            <div className="h-8 w-32 rounded bg-muted" />
            <div className="h-4 w-48 rounded bg-muted" />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-8 w-24 rounded-full bg-muted" />
          ))}
        </div>
      </div>
    }>
      <TagsPageContent tags={tags} docs={docs} />
    </Suspense>
  )
}
