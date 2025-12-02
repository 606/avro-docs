import Link from 'next/link';
import { BookOpen, Folder, FileText, ArrowRight } from 'lucide-react';
import { getDocsTree, TreeNode } from '@/lib/docs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HomeContent } from '@/components/home-content';

export default function Home() {
  const docsTree = getDocsTree();

  return <HomeContent docsTree={docsTree} />;
}
