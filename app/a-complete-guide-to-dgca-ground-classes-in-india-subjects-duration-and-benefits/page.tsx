import type { Metadata } from 'next';
import ArticlePage from '@/components/ArticlePage';
import { article } from '@/content/blog/a-complete-guide-to-dgca-ground-classes-in-india-subjects-duration-and-benefits';

export const metadata: Metadata = {
  title: 'A Complete Guide to DGCA Ground Classes in India: Subjects, Duration, and Benefits | WindChasers',
  description:
    'A complete guide to DGCA ground classes in India: the core subjects, course duration, classroom vs online options, and the benefits for aspiring CPL pilots.',
};

export default function Page() {
  return <ArticlePage article={article} />;
}
