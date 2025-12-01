"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { TocItem } from "@/lib/docs"
import { List, ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface TableOfContentsProps {
  items: TocItem[]
  className?: string
}

export function TableOfContents({ items, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = React.useState<string>("")
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: "-80px 0px -80% 0px",
        threshold: 0,
      }
    )

    // Observe all headings
    items.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={cn("", className)}>
      <CollapsibleTrigger className="flex items-center justify-between w-full group">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <List className="h-4 w-4" />
          <span>On this page</span>
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 text-muted-foreground transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3">
        <ul className="space-y-1 text-sm">
          {items.map((item) => (
            <li
              key={item.id}
              style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
            >
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  const element = document.getElementById(item.id)
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" })
                    setActiveId(item.id)
                    // Update URL without scrolling
                    window.history.pushState(null, "", `#${item.id}`)
                  }
                }}
                className={cn(
                  "block py-1 text-muted-foreground hover:text-foreground transition-colors border-l-2 pl-3 -ml-px",
                  activeId === item.id
                    ? "border-primary text-foreground font-medium"
                    : "border-transparent"
                )}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}
