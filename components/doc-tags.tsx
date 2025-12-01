"use client"

import * as React from "react"
import Link from "next/link"
import { Tag, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

interface DocTagsProps {
  tags: string[]
}

export function DocTags({ tags }: DocTagsProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  if (tags.length === 0) return null

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-6">
      <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
        <Tag className="h-3.5 w-3.5" />
        <span>{tags.length} tag{tags.length !== 1 ? 's' : ''}</span>
        <ChevronDown className={cn(
          "h-3.5 w-3.5 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link key={tag} href={`/tags?tag=${encodeURIComponent(tag)}`}>
              <Badge 
                variant="secondary" 
                className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
