"use client"

import * as React from "react"
import { Check, Copy, File } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  highlightedHtml?: string
  showLineNumbers?: boolean
  className?: string
}

export function CodeBlock({
  code,
  language = "text",
  filename,
  highlightedHtml,
  showLineNumbers = true,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lines = code.split("\n")

  return (
    <div className={cn("group relative rounded-lg border bg-muted/50 overflow-hidden", className)}>
      {/* Header */}
      {(filename || language) && (
        <div className="flex items-center justify-between border-b bg-muted/80 px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <File className="h-4 w-4" />
            {filename && <span className="font-medium">{filename}</span>}
            {language && !filename && <span className="font-mono text-xs">{language}</span>}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={copyToClipboard}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      )}

      {/* Code content */}
      <div className="relative overflow-x-auto">
        {/* Copy button if no header */}
        {!filename && !language && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            onClick={copyToClipboard}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        )}

        <div className="flex">
          {/* Line numbers */}
          {showLineNumbers && (
            <div className="flex-shrink-0 select-none border-r bg-muted/30 px-3 py-4 text-right font-mono text-xs text-muted-foreground">
              {lines.map((_, i) => (
                <div key={i} className="leading-6">
                  {i + 1}
                </div>
              ))}
            </div>
          )}

          {/* Code */}
          <div className="flex-1 overflow-x-auto">
            {highlightedHtml ? (
              <div
                className="p-4 font-mono text-sm leading-6 [&>pre]:!bg-transparent [&>pre]:!p-0 [&>pre]:!m-0 [&_code]:!bg-transparent"
                dangerouslySetInnerHTML={{ __html: highlightedHtml }}
              />
            ) : (
              <pre className="p-4 font-mono text-sm leading-6">
                <code>{code}</code>
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Server-side highlighting function
export async function highlightCode(code: string, language: string) {
  const { codeToHtml } = await import("shiki")
  
  try {
    const html = await codeToHtml(code, {
      lang: language,
      theme: "github-dark",
    })
    return html
  } catch {
    // Fallback for unsupported languages
    return null
  }
}
