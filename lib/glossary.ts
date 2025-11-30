import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const GLOSSARY_DIRECTORY = path.join(process.cwd(), 'content', 'glossary');

export interface GlossaryTerm {
  term: string;
  definition: string;
  aliases: string[];
  path: string; // URL path like 'glossary/docker'
}

// Cache for glossary terms
let cachedTerms: GlossaryTerm[] | null = null;

/**
 * Scan all markdown files in content/glossary/ for terms with glossary: true
 */
export function scanGlossaryTerms(): GlossaryTerm[] {
  // Return cached if available
  if (cachedTerms) {
    return cachedTerms;
  }

  const terms: GlossaryTerm[] = [];

  if (!fs.existsSync(GLOSSARY_DIRECTORY)) {
    return terms;
  }

  function scanDir(dir: string, basePath: string = 'glossary') {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      if (item.name.startsWith('.') || item.name.startsWith('_')) continue;

      const itemPath = path.join(dir, item.name);
      const relativePath = `${basePath}/${item.name}`;

      if (item.isDirectory()) {
        // Check for index.md in folder
        const indexPath = path.join(itemPath, 'index.md');
        if (fs.existsSync(indexPath)) {
          const term = parseGlossaryFile(indexPath, relativePath);
          if (term) terms.push(term);
        }
        // Recursively scan subdirectories
        scanDir(itemPath, relativePath);
      } else if (item.name.endsWith('.md')) {
        const urlPath = relativePath.replace(/\.md$/, '');
        const term = parseGlossaryFile(itemPath, urlPath);
        if (term) terms.push(term);
      }
    }
  }

  scanDir(GLOSSARY_DIRECTORY);

  // Sort by term length (longest first) to prevent partial matches
  cachedTerms = terms.sort((a, b) => b.term.length - a.term.length);

  return cachedTerms;
}

/**
 * Parse a single markdown file for glossary term data
 */
function parseGlossaryFile(filePath: string, urlPath: string): GlossaryTerm | null {
  try {
    let fileContents = fs.readFileSync(filePath, 'utf8');

    // Fix YAML tabs
    const frontmatterMatch = fileContents.match(/^---\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
      const fixedFrontmatter = frontmatterMatch[1].replace(/\t/g, '  ');
      fileContents = fileContents.replace(frontmatterMatch[1], fixedFrontmatter);
    }

    const { data: frontmatter } = matter(fileContents);

    // Only process files with glossary: true
    if (!frontmatter.glossary) {
      return null;
    }

    const term = frontmatter.title as string;
    if (!term) {
      return null;
    }

    const definition = (frontmatter.definition as string) || '';
    const aliases = (frontmatter.aliases as string[]) || [];

    // Add the term itself and lowercase variants to aliases for matching
    const allAliases = [
      term,
      term.toLowerCase(),
      ...aliases,
      ...aliases.map(a => a.toLowerCase()),
    ];

    // Remove duplicates
    const uniqueAliases = Array.from(new Set(allAliases));

    return {
      term,
      definition,
      aliases: uniqueAliases,
      path: urlPath.replace(/\/index$/, ''), // Remove /index suffix
    };
  } catch (e) {
    console.warn(`Failed to parse glossary file: ${filePath}`, e);
    return null;
  }
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Auto-link glossary terms in HTML content
 * - Case insensitive matching
 * - Only links first occurrence of each term
 * - Skips code blocks, existing links, headings
 */
export function autoLinkGlossaryTerms(
  html: string,
  terms: GlossaryTerm[],
  currentPath: string
): string {
  if (terms.length === 0) return html;

  // Split HTML to protect code blocks and pre tags from processing
  const codeBlockPlaceholders: string[] = [];
  let protectedHtml = html;

  // Protect <pre> and <code> blocks
  protectedHtml = protectedHtml.replace(/<pre[\s\S]*?<\/pre>/gi, (match) => {
    codeBlockPlaceholders.push(match);
    return `__CODE_BLOCK_${codeBlockPlaceholders.length - 1}__`;
  });

  protectedHtml = protectedHtml.replace(/<code[^>]*>[\s\S]*?<\/code>/gi, (match) => {
    codeBlockPlaceholders.push(match);
    return `__CODE_BLOCK_${codeBlockPlaceholders.length - 1}__`;
  });

  // Protect headings
  protectedHtml = protectedHtml.replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi, (match) => {
    codeBlockPlaceholders.push(match);
    return `__CODE_BLOCK_${codeBlockPlaceholders.length - 1}__`;
  });

  // Protect existing links
  protectedHtml = protectedHtml.replace(/<a[^>]*>[\s\S]*?<\/a>/gi, (match) => {
    codeBlockPlaceholders.push(match);
    return `__CODE_BLOCK_${codeBlockPlaceholders.length - 1}__`;
  });

  // Track which terms have been linked
  const linkedTerms = new Set<string>();

  // Process each term (already sorted by length, longest first)
  for (const termData of terms) {
    // Skip if this is the current page (don't self-link)
    if (currentPath === termData.path || currentPath === `${termData.path}/`) {
      continue;
    }

    // Skip if we already linked this term
    if (linkedTerms.has(termData.term.toLowerCase())) {
      continue;
    }

    // Try each alias (sorted by length, longest first)
    const sortedAliases = [...termData.aliases].sort((a, b) => b.length - a.length);
    
    for (const alias of sortedAliases) {
      // Skip very short aliases (2 chars or less) to avoid false positives
      if (alias.length <= 2) continue;

      // Build regex for whole word matching
      const regex = new RegExp(`\\b(${escapeRegex(alias)})\\b`, 'i');

      // Check if term exists in content
      const match = protectedHtml.match(regex);
      if (match) {
        // Create the replacement link with tooltip
        const tooltipText = termData.definition || `View definition of ${termData.term}`;
        const link = `<a href="/docs/${termData.path}/" class="glossary-term" data-term="${escapeHtml(termData.term)}" title="${escapeHtml(tooltipText)}">${match[1]}</a>`;

        // Replace only the first occurrence
        protectedHtml = protectedHtml.replace(regex, link);
        linkedTerms.add(termData.term.toLowerCase());
        break; // Move to next term after first successful match
      }
    }
  }

  // Restore protected blocks
  for (let i = 0; i < codeBlockPlaceholders.length; i++) {
    protectedHtml = protectedHtml.replace(`__CODE_BLOCK_${i}__`, codeBlockPlaceholders[i]);
  }

  return protectedHtml;
}

/**
 * Escape HTML special characters for use in attributes
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Clear the cached terms (useful for development)
 */
export function clearGlossaryCache(): void {
  cachedTerms = null;
}
