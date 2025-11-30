import type { Metadata } from 'next';
import './globals.css';
import { ResizableLayout } from '@/components/resizable-layout';
import { getDocsTree, getAllTags } from '@/lib/docs';

export const metadata: Metadata = {
  title: 'Avro Docs',
  description: 'Documentation for Avro projects',
};

// Script to prevent theme flash - runs before page renders
const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem('avro-docs-theme') || 'dark';
    var root = document.documentElement;
    root.classList.remove('dark', 'light', 'theme-nord', 'theme-dracula', 'theme-github', 'theme-solarized-light', 'theme-rose-pine-dawn', 'theme-catppuccin-latte', 'theme-one-light', 'theme-ayu-light', 'theme-solarized-dark', 'theme-rose-pine', 'theme-catppuccin-mocha', 'theme-one-dark', 'theme-ayu-dark');
    
    var effectiveTheme = theme;
    if (theme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    if (effectiveTheme === 'light') {
      root.classList.add('light');
    } else if (effectiveTheme === 'nord') {
      root.classList.add('dark', 'theme-nord');
    } else if (effectiveTheme === 'dracula') {
      root.classList.add('dark', 'theme-dracula');
    } else if (effectiveTheme === 'github') {
      root.classList.add('dark', 'theme-github');
    } else if (effectiveTheme === 'solarized-light') {
      root.classList.add('light', 'theme-solarized-light');
    } else if (effectiveTheme === 'rose-pine-dawn') {
      root.classList.add('light', 'theme-rose-pine-dawn');
    } else if (effectiveTheme === 'catppuccin-latte') {
      root.classList.add('light', 'theme-catppuccin-latte');
    } else if (effectiveTheme === 'one-light') {
      root.classList.add('light', 'theme-one-light');
    } else if (effectiveTheme === 'ayu-light') {
      root.classList.add('light', 'theme-ayu-light');
    } else if (effectiveTheme === 'solarized-dark') {
      root.classList.add('dark', 'theme-solarized-dark');
    } else if (effectiveTheme === 'rose-pine') {
      root.classList.add('dark', 'theme-rose-pine');
    } else if (effectiveTheme === 'catppuccin-mocha') {
      root.classList.add('dark', 'theme-catppuccin-mocha');
    } else if (effectiveTheme === 'one-dark') {
      root.classList.add('dark', 'theme-one-dark');
    } else if (effectiveTheme === 'ayu-dark') {
      root.classList.add('dark', 'theme-ayu-dark');
    } else {
      root.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const docsTree = getDocsTree();
  const allTags = getAllTags();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen">
        <ResizableLayout tree={docsTree} tags={allTags}>
          {children}
        </ResizableLayout>
      </body>
    </html>
  );
}
