import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';
import { createHighlighter, bundledLanguages, type BundledLanguage } from 'shiki';
import { scanGlossaryTerms, autoLinkGlossaryTerms } from './glossary';

const DOCS_DIRECTORY = path.join(process.cwd(), 'content');

// Shiki highlighter singleton
let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-dark', 'github-light', 'nord', 'dracula'],
      langs: Object.keys(bundledLanguages) as BundledLanguage[],
    });
  }
  return highlighterPromise;
}

// Generate slug from heading text
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Spaces to dashes
    .replace(/-+/g, '-') // Multiple dashes to single
    .trim();
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface TreeNode {
  name: string;
  title?: string;
  path: string;
  type: 'file' | 'folder';
  children?: TreeNode[];
}

export interface DocContent {
  title: string;
  content: string;
  frontmatter: Record<string, unknown>;
  breadcrumbs: { name: string; path: string }[];
  toc: TocItem[];
  readingTime: number;
  wordCount: number;
}

export interface TagInfo {
  name: string;
  count: number;
}

function formatName(name: string): string {
  // Remove file extension
  const baseName = name.replace(/\.md$/, '');
  
  // Convert kebab-case or snake_case to Title Case
  return baseName
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

// Folders to hide from sidebar (but still accessible via URL)
const HIDDEN_FOLDERS = ['glossary'];

function buildTree(dir: string, basePath: string = ''): TreeNode[] {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  const tree: TreeNode[] = [];

  // Sort items: folders first, then files, alphabetically
  const sortedItems = items.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  });

  for (const item of sortedItems) {
    // Skip hidden files and non-markdown files
    if (item.name.startsWith('.')) continue;
    if (item.name.startsWith('_')) continue;
    // Skip hidden folders
    if (item.isDirectory() && HIDDEN_FOLDERS.includes(item.name)) continue;

    const itemPath = path.join(dir, item.name);
    const relativePath = basePath ? `${basePath}/${item.name}` : item.name;

    if (item.isDirectory()) {
      const children = buildTree(itemPath, relativePath);
      // Only add folders that have content
      if (children.length > 0) {
        tree.push({
          name: formatName(item.name),
          path: relativePath,
          type: 'folder',
          children,
        });
      }
    } else if (item.name.endsWith('.md')) {
      // Read frontmatter to get title
      const filePath = path.join(dir, item.name);
      let title = formatName(item.name);
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const parsed = matter(content);
        if (parsed.data.title) {
          title = parsed.data.title;
        }
      } catch (e) {
        // Use formatted name as fallback
      }
      tree.push({
        name: formatName(item.name),
        title,
        path: relativePath.replace(/\.md$/, ''),
        type: 'file',
      });
    }
  }

  return tree;
}

export function getDocsTree(): TreeNode[] {
  if (!fs.existsSync(DOCS_DIRECTORY)) {
    return [];
  }
  return buildTree(DOCS_DIRECTORY);
}

// Collect all tags from all documents
export function getAllTags(): TagInfo[] {
  const tagCounts = new Map<string, number>();

  function collectTags(dir: string) {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      if (item.name.startsWith('.') || item.name.startsWith('_')) continue;

      const itemPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        collectTags(itemPath);
      } else if (item.name.endsWith('.md')) {
        try {
          const content = fs.readFileSync(itemPath, 'utf8');
          const parsed = matter(content);
          const tags = parsed.data.tags;
          if (Array.isArray(tags)) {
            for (const tag of tags) {
              const tagName = String(tag).toLowerCase();
              tagCounts.set(tagName, (tagCounts.get(tagName) || 0) + 1);
            }
          }
        } catch (e) {
          // Skip files with parsing errors
        }
      }
    }
  }

  if (fs.existsSync(DOCS_DIRECTORY)) {
    collectTags(DOCS_DIRECTORY);
  }

  // Convert to array and sort by count (descending)
  return Array.from(tagCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export interface DocWithTags {
  title: string;
  path: string;
  tags: string[];
  description?: string;
}

// Get all documents with their tags
export function getAllDocsWithTags(): DocWithTags[] {
  const docs: DocWithTags[] = [];

  function collectDocs(dir: string, basePath: string = '') {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      if (item.name.startsWith('.') || item.name.startsWith('_')) continue;

      const itemPath = path.join(dir, item.name);
      const relativePath = basePath ? `${basePath}/${item.name}` : item.name;

      if (item.isDirectory()) {
        collectDocs(itemPath, relativePath);
      } else if (item.name.endsWith('.md')) {
        try {
          const content = fs.readFileSync(itemPath, 'utf8');
          const parsed = matter(content);
          const tags = parsed.data.tags;
          if (Array.isArray(tags) && tags.length > 0) {
            docs.push({
              title: parsed.data.title || formatName(item.name),
              path: relativePath.replace(/\.md$/, ''),
              tags: tags.map((t: unknown) => String(t).toLowerCase()),
              description: parsed.data.description,
            });
          }
        } catch (e) {
          // Skip files with parsing errors
        }
      }
    }
  }

  if (fs.existsSync(DOCS_DIRECTORY)) {
    collectDocs(DOCS_DIRECTORY);
  }

  return docs;
}

// Get documents by specific tag
export function getDocsByTag(tagName: string): DocWithTags[] {
  const allDocs = getAllDocsWithTags();
  return allDocs.filter(doc => doc.tags.includes(tagName.toLowerCase()));
}

export function getAllDocPaths(): string[] {
  const paths: string[] = [];

  function collectPaths(dir: string, basePath: string = '') {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      if (item.name.startsWith('.') || item.name.startsWith('_')) continue;

      const itemPath = path.join(dir, item.name);
      const relativePath = basePath ? `${basePath}/${item.name}` : item.name;

      if (item.isDirectory()) {
        // If folder has index.md, add the folder path (for /docs/api -> api/index.md)
        const indexPath = path.join(itemPath, 'index.md');
        if (fs.existsSync(indexPath)) {
          paths.push(relativePath);
        }
        collectPaths(itemPath, relativePath);
      } else if (item.name.endsWith('.md')) {
        paths.push(relativePath.replace(/\.md$/, ''));
      }
    }
  }

  if (fs.existsSync(DOCS_DIRECTORY)) {
    collectPaths(DOCS_DIRECTORY);
  }

  return paths;
}

export async function getDocContent(slugPath: string): Promise<DocContent | null> {
  // Try to find the markdown file
  const possiblePaths = [
    path.join(DOCS_DIRECTORY, `${slugPath}.md`),
    path.join(DOCS_DIRECTORY, slugPath, 'index.md'),
  ];

  let filePath: string | null = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      filePath = p;
      break;
    }
  }

  if (!filePath) {
    return null;
  }

  let fileContents = fs.readFileSync(filePath, 'utf8');
  
  // Fix YAML frontmatter with tabs (convert tabs to spaces)
  // This handles files that use tabs in YAML which is invalid
  const frontmatterMatch = fileContents.match(/^---\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const fixedFrontmatter = frontmatterMatch[1].replace(/\t/g, '  ');
    fileContents = fileContents.replace(frontmatterMatch[1], fixedFrontmatter);
  }

  let frontmatter: Record<string, unknown> = {};
  let markdownContent: string = fileContents;

  try {
    const parsed = matter(fileContents);
    frontmatter = parsed.data;
    markdownContent = parsed.content;
  } catch (e) {
    // If frontmatter parsing fails, just use the content as-is
    console.warn(`Warning: Failed to parse frontmatter in ${filePath}`, e);
    // Remove frontmatter manually if it exists but is malformed
    markdownContent = fileContents.replace(/^---[\s\S]*?---\n?/, '');
  }

  // Convert Obsidian-style links to standard markdown links
  // [[./path/to/file|Display Text]] -> [Display Text](/docs/path/to/file)
  // [[../path/to/file|Display Text]] -> [Display Text](/docs/path/to/file)
  // [[./path/to/file]] -> [path/to/file](/docs/path/to/file)
  // [[File Name]] -> [File Name](/docs/file-name)
  
  // Get the current directory from the slug path for resolving relative paths
  const currentDir = slugPath.split('/').slice(0, -1).join('/');
  
  markdownContent = markdownContent
    // Handle [[../path|text]] format (parent directory)
    .replace(/\[\[\.\.\/([^\]|]+)\|([^\]]+)\]\]/g, (_, linkPath, text) => {
      const cleanPath = linkPath.replace(/\.md$/, '').replace(/\/index$/, '');
      // Resolve the relative path
      const parentDir = currentDir.split('/').slice(0, -1).join('/');
      const resolvedPath = parentDir ? `${parentDir}/${cleanPath}` : cleanPath;
      return `[${text}](/docs/${resolvedPath})`;
    })
    // Handle [[../path]] format (parent directory, no display text)
    .replace(/\[\[\.\.\/([^\]|]+)\]\]/g, (_, linkPath) => {
      const cleanPath = linkPath.replace(/\.md$/, '').replace(/\/index$/, '');
      const parentDir = currentDir.split('/').slice(0, -1).join('/');
      const resolvedPath = parentDir ? `${parentDir}/${cleanPath}` : cleanPath;
      const displayText = cleanPath.split('/').pop() || cleanPath;
      return `[${displayText}](/docs/${resolvedPath})`;
    })
    // Handle [[./path|text]] format
    .replace(/\[\[\.\/([^\]|]+)\|([^\]]+)\]\]/g, (_, linkPath, text) => {
      const cleanPath = linkPath.replace(/\.md$/, '').replace(/\/index$/, '');
      const resolvedPath = currentDir ? `${currentDir}/${cleanPath}` : cleanPath;
      return `[${text}](/docs/${resolvedPath})`;
    })
    // Handle [[./path]] format (no display text)
    .replace(/\[\[\.\/([^\]|]+)\]\]/g, (_, linkPath) => {
      const cleanPath = linkPath.replace(/\.md$/, '').replace(/\/index$/, '');
      const resolvedPath = currentDir ? `${currentDir}/${cleanPath}` : cleanPath;
      const displayText = cleanPath.split('/').pop() || cleanPath;
      return `[${displayText}](/docs/${resolvedPath})`;
    })
    // Handle [[Simple Link|Display Text]] format
    .replace(/\[\[([^\]|\/\.]+)\|([^\]]+)\]\]/g, (_, link, text) => {
      const slug = link.toLowerCase().replace(/\s+/g, '-');
      return `[${text}](/docs/${slug})`;
    })
    // Handle [[Simple Link]] format
    .replace(/\[\[([^\]|\/\.]+)\]\]/g, (_, link) => {
      const slug = link.toLowerCase().replace(/\s+/g, '-');
      return `[${link}](/docs/${slug})`;
    })
    // Clean up Obsidian-style embeds ![[file]]
    .replace(/!\[\[([^\]]+)\]\]/g, (_, file) => {
      return `*[Embedded: ${file}]*`;
    })
    // Handle #tags by converting to styled spans (will be rendered as text)
    .replace(/(?<!\S)#([a-zA-Z][a-zA-Z0-9-_]*)/g, '`#$1`');

  // Handle Obsidian callouts - convert to custom HTML before markdown processing
  // Matches > [!type] optional title followed by > content lines
  const calloutRegex = /^>\s*\[!(\w+)\]\s*(.*?)$((?:\n>\s?.*$)*)/gm;
  markdownContent = markdownContent.replace(calloutRegex, (_, type, title, body) => {
    const calloutType = type.toLowerCase();
    const calloutConfig: Record<string, { icon: string; color: string; bgColor: string }> = {
      note: { icon: '📝', color: 'blue', bgColor: 'blue' },
      tip: { icon: '💡', color: 'green', bgColor: 'green' },
      hint: { icon: '💡', color: 'green', bgColor: 'green' },
      important: { icon: '❗', color: 'purple', bgColor: 'purple' },
      warning: { icon: '⚠️', color: 'yellow', bgColor: 'yellow' },
      caution: { icon: '⚠️', color: 'yellow', bgColor: 'yellow' },
      danger: { icon: '🚨', color: 'red', bgColor: 'red' },
      error: { icon: '🚨', color: 'red', bgColor: 'red' },
      info: { icon: 'ℹ️', color: 'blue', bgColor: 'blue' },
      example: { icon: '📋', color: 'purple', bgColor: 'purple' },
      question: { icon: '❓', color: 'cyan', bgColor: 'cyan' },
      quote: { icon: '💬', color: 'gray', bgColor: 'gray' },
      success: { icon: '✅', color: 'green', bgColor: 'green' },
      check: { icon: '✅', color: 'green', bgColor: 'green' },
      done: { icon: '✅', color: 'green', bgColor: 'green' },
      failure: { icon: '❌', color: 'red', bgColor: 'red' },
      fail: { icon: '❌', color: 'red', bgColor: 'red' },
      bug: { icon: '🐛', color: 'red', bgColor: 'red' },
      abstract: { icon: '📄', color: 'cyan', bgColor: 'cyan' },
      summary: { icon: '📄', color: 'cyan', bgColor: 'cyan' },
      todo: { icon: '☑️', color: 'purple', bgColor: 'purple' },
    };
    
    const config = calloutConfig[calloutType] || { icon: '📝', color: 'blue', bgColor: 'blue' };
    const displayTitle = title || calloutType.charAt(0).toUpperCase() + calloutType.slice(1);
    
    // Clean body content (remove leading > and spaces)
    const bodyContent = body
      .split('\n')
      .map((line: string) => line.replace(/^>\s?/, ''))
      .join('\n')
      .trim();
    
    return `<div class="callout callout-${calloutType}" data-callout="${calloutType}">
<div class="callout-title"><span class="callout-icon">${config.icon}</span><span class="callout-title-text">${displayTitle}</span></div>
<div class="callout-content">

${bodyContent}

</div>
</div>`;
  });

  // Calculate word count and reading time
  const plainText = markdownContent.replace(/```[\s\S]*?```/g, '').replace(/[#*`\[\]()]/g, '');
  const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // ~200 words per minute

  // Extract table of contents from headings
  const toc: TocItem[] = [];
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  let headingMatch;
  while ((headingMatch = headingRegex.exec(markdownContent)) !== null) {
    const level = headingMatch[1].length;
    const text = headingMatch[2].replace(/\*\*/g, '').replace(/`/g, '').trim();
    const id = slugify(text);
    toc.push({ id, text, level });
  }

  // Process markdown to HTML
  const processedContent = await remark()
    .use(gfm)
    .use(html, { sanitize: false })
    .process(markdownContent);

  let content = processedContent.toString();

  // Add IDs to headings for anchor links
  content = content.replace(/<(h[2-4])>(.*?)<\/\1>/g, (_, tag, text) => {
    const cleanText = text.replace(/<[^>]*>/g, '').trim();
    const id = slugify(cleanText);
    return `<${tag} id="${id}"><a href="#${id}" class="heading-anchor" aria-hidden="true">#</a>${text}</${tag}>`;
  });

  // Highlight code blocks with Shiki
  try {
    const highlighter = await getHighlighter();
    
    // Match code blocks: <pre><code class="language-xxx">...</code></pre>
    const codeBlockRegex = /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g;
    
    let match;
    const replacements: { original: string; replacement: string }[] = [];
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      const [fullMatch, lang, codeContent] = match;
      
      // Decode HTML entities
      const decodedCode = codeContent
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
      
      try {
        // Check if language is supported
        const supportedLang = Object.keys(bundledLanguages).includes(lang) ? lang : 'text';
        
        const highlighted = highlighter.codeToHtml(decodedCode.trim(), {
          lang: supportedLang as BundledLanguage,
          theme: 'github-dark',
        });
        
        // Wrap in a container with copy button support
        const wrappedCode = `<div class="code-block-wrapper group relative">
          <div class="code-block-header flex items-center justify-between border-b border-border bg-muted/80 px-4 py-2 rounded-t-lg">
            <span class="text-xs font-mono text-muted-foreground">${lang}</span>
            <button class="copy-button opacity-0 group-hover:opacity-100 transition-opacity text-xs text-muted-foreground hover:text-foreground" onclick="navigator.clipboard.writeText(this.closest('.code-block-wrapper').querySelector('pre code').textContent)">Copy</button>
          </div>
          <div class="code-block-content overflow-x-auto rounded-b-lg">${highlighted}</div>
        </div>`;
        
        content = content.replace(fullMatch, wrappedCode);
      } catch (e) {
        // Keep original if highlighting fails
        console.warn(`Failed to highlight ${lang} code block`, e);
      }
    }
    
    // Also handle code blocks without language specification
    const plainCodeBlockRegex = /<pre><code>([\s\S]*?)<\/code><\/pre>/g;
    content = content.replace(plainCodeBlockRegex, (_, codeContent) => {
      const decodedCode = codeContent
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
      
      return `<div class="code-block-wrapper group relative">
        <div class="code-block-header flex items-center justify-between border-b border-border bg-muted/80 px-4 py-2 rounded-t-lg">
          <span class="text-xs font-mono text-muted-foreground">code</span>
          <button class="copy-button opacity-0 group-hover:opacity-100 transition-opacity text-xs text-muted-foreground hover:text-foreground" onclick="navigator.clipboard.writeText(this.closest('.code-block-wrapper').querySelector('pre code').textContent)">Copy</button>
        </div>
        <div class="code-block-content overflow-x-auto rounded-b-lg"><pre class="shiki github-dark" style="background-color:#24292e"><code>${codeContent}</code></pre></div>
      </div>`;
    });
  } catch (e) {
    console.warn('Failed to initialize syntax highlighter', e);
  }

  // Auto-link glossary terms
  try {
    const glossaryTerms = scanGlossaryTerms();
    content = autoLinkGlossaryTerms(content, glossaryTerms, slugPath);
  } catch (e) {
    console.warn('Failed to auto-link glossary terms', e);
  }

  // Build breadcrumbs
  const parts = slugPath.split('/');
  const breadcrumbs = parts.map((part, index) => ({
    name: formatName(part),
    path: parts.slice(0, index + 1).join('/'),
  }));

  // Get title from frontmatter or first heading or filename
  let title = frontmatter.title as string;
  if (!title) {
    const headingMatch = markdownContent.match(/^#\s+(.+)$/m);
    if (headingMatch) {
      title = headingMatch[1];
    } else {
      title = formatName(parts[parts.length - 1]);
    }
  }

  return {
    title,
    content,
    frontmatter,
    breadcrumbs,
    toc,
    readingTime,
    wordCount,
  };
}
