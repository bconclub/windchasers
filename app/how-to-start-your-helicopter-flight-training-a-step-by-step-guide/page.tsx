import type { Metadata } from 'next';
import ArticlePage from '@/components/ArticlePage';
import { article } from '@/content/blog/how-to-start-your-helicopter-flight-training-a-step-by-step-guide';

export const metadata: Metadata = {
  title: 'How to Start Your Helicopter Flight Training: A Step-by-Step Guide | WindChasers',
  description:
    'A step-by-step guide to starting helicopter flight training in India: requirements, choosing a school, ground school, solo hours, exams and specializations.',
};

export default function Page() {
  return <ArticlePage article={article} />;
}
