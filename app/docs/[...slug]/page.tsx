import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Home } from 'lucide-react';
import { getDocContent, getAllDocPaths } from '@/lib/docs';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

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
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {doc.breadcrumbs.map((crumb, index) => (
            <>
              <BreadcrumbSeparator key={`sep-${crumb.path}`} />
              <BreadcrumbItem key={crumb.path}>
                {index === doc.breadcrumbs.length - 1 ? (
                  <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={`/docs/${crumb.path}`}>{crumb.name}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="doc-content" dangerouslySetInnerHTML={{ __html: doc.content }} />
    </article>
  );
}
