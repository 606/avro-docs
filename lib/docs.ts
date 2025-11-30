import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';
import { createHighlighter, bundledLanguages, type BundledLanguage } from 'shiki';

const DOCS_DIRECTORY = path.join(process.cwd(), 'content');

// Shiki highlighter singleton
let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: Object.keys(bundledLanguages) as BundledLanguage[],
    });
  }
  return highlighterPromise;
}

export interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: TreeNode[];
}

export interface DocContent {
  title: string;
  content: string;
  frontmatter: Record<string, unknown>;
  breadcrumbs: { name: string; path: string }[];
}

function formatName(name: string): string {
  // Remove file extension
  const baseName = name.replace(/\.md$/, '');
  
  // Convert kebab-case or snake_case to Title Case
  return baseName
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

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
      tree.push({
        name: formatName(item.name),
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
    // Handle Obsidian callouts > [!note], > [!warning], etc.
    .replace(/^>\s*\[!(\w+)\]\s*(.*)$/gm, (_, type, title) => {
      const icons: Record<string, string> = {
        note: '📝',
        tip: '💡',
        warning: '⚠️',
        danger: '🚨',
        info: '📌',
        example: '📋',
        question: '❓',
        quote: '💬',
        success: '✅',
        failure: '❌',
        bug: '🐛',
      };
      const icon = icons[type.toLowerCase()] || '📝';
      return `> **${icon} ${title || type.charAt(0).toUpperCase() + type.slice(1)}**`;
    })
    // Clean up Obsidian-style embeds ![[file]]
    .replace(/!\[\[([^\]]+)\]\]/g, (_, file) => {
      return `*[Embedded: ${file}]*`;
    })
    // Handle #tags by converting to styled spans (will be rendered as text)
    .replace(/(?<!\S)#([a-zA-Z][a-zA-Z0-9-_]*)/g, '`#$1`');

  // Process markdown to HTML
  const processedContent = await remark()
    .use(gfm)
    .use(html, { sanitize: false })
    .process(markdownContent);

  let content = processedContent.toString();

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
  };
}
