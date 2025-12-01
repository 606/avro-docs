import { notFound } from 'next/navigation';
import { getDocContent, getAllDocPaths } from '@/lib/docs';
import { Clock, BookOpen } from 'lucide-react';
import { TableOfContents } from '@/components/table-of-contents';
import { Badge } from '@/components/ui/badge';

interface DocPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateStaticParams() {
  const paths = getAllDocPaths();
  
  return paths.map((docPath) => ({
    slug: docPath.split('/'),
  }));
}

export async function generateMetadata({ params }: DocPageProps) {
  const resolvedParams = await params;
  const slugPath = resolvedParams.slug.join('/');
  const doc = await getDocContent(slugPath);

  if (!doc) {
    return {
      title: 'Not Found - Avro Docs',
    };
  }

  return {
    title: `${doc.title} - Avro Docs`,
    description: doc.frontmatter.description as string || `Documentation for ${doc.title}`,
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const resolvedParams = await params;
  const slugPath = resolvedParams.slug.join('/');
  const doc = await getDocContent(slugPath);

  if (!doc) {
    notFound();
  }

  const tags = doc.frontmatter.tags as string[] | undefined;

  return (
    <div className="flex gap-8">
      {/* Main content */}
      <article className="flex-1 min-w-0 max-w-3xl">
        {/* Meta info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{doc.readingTime} min read</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            <span>{doc.wordCount.toLocaleString()} words</span>
          </div>
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="doc-content" dangerouslySetInnerHTML={{ __html: doc.content }} />
      </article>

      {/* Table of Contents - sticky sidebar */}
      {doc.toc.length > 2 && (
        <aside className="hidden xl:block w-56 shrink-0">
          <div className="sticky top-8">
            <TableOfContents items={doc.toc} />
          </div>
        </aside>
      )}
    </div>
  );
}
