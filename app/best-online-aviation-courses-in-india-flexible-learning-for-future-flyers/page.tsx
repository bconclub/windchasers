import type { Metadata } from 'next';
import ArticlePage from '@/components/ArticlePage';
import { article } from '@/content/blog/best-online-aviation-courses-in-india-flexible-learning-for-future-flyers';

export const metadata: Metadata = {
  title: 'Best Online Aviation Courses in India: Flexible Learning for Future Flyers | WindChasers',
  description:
    'The best online aviation courses in India: DGCA ground classes, aviation management, cabin crew and more — plus how to choose flexible, accredited training.',
};

export default function Page() {
  return <ArticlePage article={article} />;
}
