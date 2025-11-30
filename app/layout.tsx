import type { Metadata } from 'next';
import './globals.css';
import { ResizableLayout } from '@/components/resizable-layout';
import { getDocsTree } from '@/lib/docs';

export const metadata: Metadata = {
  title: 'Avro Docs',
  description: 'Documentation for Avro projects',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const docsTree = getDocsTree();

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen">
        <ResizableLayout tree={docsTree}>
          {children}
        </ResizableLayout>
      </body>
    </html>
  );
}
