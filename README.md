# Avro Docs

A modern documentation site built with Next.js, featuring a flexible treeview sidebar for easy navigation.

## Features

- 📚 **Markdown Support** - Write documentation in Markdown with full GitHub Flavored Markdown support
- 🌲 **Tree View Sidebar** - Collapsible folder structure for easy navigation
- 🔍 **Search** - Filter documents by name
- 🌙 **Dark Theme** - Easy on the eyes with a beautiful dark theme
- 📱 **Responsive** - Works great on desktop and mobile
- ⚡ **Static Export** - Deploys to GitHub Pages

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Development

Open [http://localhost:3000](http://localhost:3000) to view the documentation site.

## Project Structure

```
avro-docs/
├── app/                    # Next.js app directory
│   ├── docs/[...slug]/    # Dynamic documentation pages
│   ├── layout.tsx         # Root layout with sidebar
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/
│   └── Sidebar.tsx        # Tree view sidebar component
├── lib/
│   └── docs.ts            # Markdown processing utilities
├── avro-cc-github-606/    # Documentation content (Markdown files)
├── next.config.js         # Next.js configuration
└── package.json
```

## Adding Documentation

1. Add Markdown files to the `avro-cc-github-606/` directory
2. Use subdirectories to organize content
3. Use `index.md` for folder landing pages
4. The sidebar automatically reflects the folder structure

## Deployment

This project is configured for GitHub Pages deployment using GitHub Actions.

The workflow in `.github/workflows/nextjs.yml` will automatically build and deploy when pushing to the `main` branch.

## License

MIT