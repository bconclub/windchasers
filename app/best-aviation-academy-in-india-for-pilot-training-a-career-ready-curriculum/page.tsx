import type { Metadata } from 'next';
import ArticlePage from '@/components/ArticlePage';
import { article } from '@/content/blog/best-aviation-academy-in-india-for-pilot-training-a-career-ready-curriculum';

export const metadata: Metadata = {
  title: 'Best Aviation Academy in India for Pilot Training: A Career-Ready Curriculum | WindChasers',
  description:
    'How to choose the best aviation academy in India: a career-ready pilot curriculum spanning PPL, CPL, ratings, DGCA ground classes and real flight hours.',
};

export default function Page() {
  return <ArticlePage article={article} />;
}
