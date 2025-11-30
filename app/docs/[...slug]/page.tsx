import { notFound } from 'next/navigation';
import { getDocContent, getAllDocPaths } from '@/lib/docs';

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
    description: `Documentation for ${doc.title}`,
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const resolvedParams = await params;
  const slugPath = resolvedParams.slug.join('/');
  const doc = await getDocContent(slugPath);

  if (!doc) {
    notFound();
  }

  return (
    <article className="max-w-4xl">
      <div className="doc-content" dangerouslySetInnerHTML={{ __html: doc.content }} />
    </article>
  );
}
