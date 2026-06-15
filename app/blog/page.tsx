import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Manrope } from 'next/font/google';

const manrope = Manrope({ subsets: ['latin'], weight: ['700', '800'], variable: '--font-headline' });

export const metadata: Metadata = {
  title: 'Aviation Blog | WindChasers Aviation Academy',
  description:
    'Insights and guides on pilot training, DGCA ground classes, helicopter flight training and online aviation courses in India from the WindChasers team.',
};

type Post = {
  title: string;
  excerpt: string;
  date: string;
  href: string;
  cover: string;
  kicker: string;
};

const posts: Post[] = [
  {
    title: 'Best Aviation Academy in India for Pilot Training: A Career-Ready Curriculum',
    excerpt:
      'How to choose the right flight school, a curriculum that goes beyond theory to prepare you to lead cockpits, from PPL and CPL to advanced ratings.',
    date: 'June 8, 2025',
    href: '/best-aviation-academy-in-india-for-pilot-training-a-career-ready-curriculum',
    cover: '/migrated/best-aviation-academy-in-india-for-pilot-training-a-career-ready-curriculum/maxresdefault-22.webp',
    kicker: 'Pilot Training',
  },
  {
    title: 'How to Start Your Helicopter Flight Training: A Step-by-Step Guide',
    excerpt:
      'From basic requirements to choosing a school, ground school, solo hours and exams, every step of how to begin your helicopter flight training.',
    date: 'June 9, 2025',
    href: '/how-to-start-your-helicopter-flight-training-a-step-by-step-guide',
    cover: '/migrated/how-to-start-your-helicopter-flight-training-a-step-by-step-guide/obuka_helikopteri_gama_2_1648052846.webp',
    kicker: 'Helicopter Training',
  },
  {
    title: 'A Complete Guide to DGCA Ground Classes in India: Subjects, Duration, and Benefits',
    excerpt:
      'Everything you need to know about DGCA ground classes, the core subjects, course duration, classroom vs online options, and key benefits.',
    date: 'June 7, 2025',
    href: '/a-complete-guide-to-dgca-ground-classes-in-india-subjects-duration-and-benefits',
    cover: '/migrated/a-complete-guide-to-dgca-ground-classes-in-india-subjects-duration-and-benefits/BAA-Training-students-Theory-class.webp',
    kicker: 'Ground School',
  },
  {
    title: 'Best Online Aviation Courses in India: Flexible Learning for Future Flyers',
    excerpt:
      'Online learning has revolutionized aviation education. Explore the best online aviation courses in India and how to choose the right one.',
    date: 'June 6, 2025',
    href: '/best-online-aviation-courses-in-india-flexible-learning-for-future-flyers',
    cover: '/migrated/best-online-aviation-courses-in-india-flexible-learning-for-future-flyers/skynews-pilot-uk-no-deal-brexit_4417331.webp',
    kicker: 'Online Learning',
  },
];

export default function BlogIndexPage() {
  return (
    <div className={manrope.variable} style={{ backgroundColor: '#131313', color: '#fff' }}>
      {/* Hero */}
      <section className="relative pt-36 pb-20 px-6 md:px-12 text-center overflow-hidden" style={{ backgroundColor: '#131313' }}>
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: 'url(/WC HEro.webp)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#131313]/70 via-[#131313]/85 to-[#131313]" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="text-[#C5A572] font-bold tracking-[0.2em] uppercase text-xs mb-5 block">WindChasers Journal</span>
          <h1 className="font-[family-name:var(--font-headline)] text-4xl md:text-6xl font-extrabold tracking-tighter text-white leading-tight mb-5">
            Aviation <span className="text-[#C5A572] italic">Insights</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Guides and perspectives on pilot training, DGCA ground classes, helicopter flying and online aviation courses in India.
          </p>
        </div>
      </section>

      {/* Post cards */}
      <section className="py-20 px-6 md:px-12" style={{ backgroundColor: '#0e0e0e' }}>
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Link key={post.href} href={post.href}
              className="group flex flex-col rounded-2xl overflow-hidden bg-[#1A1A1A] border border-white/10 hover:border-[#C5A572]/50 transition-all hover:-translate-y-1">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image src={post.cover} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:768px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/60 to-transparent" />
              </div>
              <div className="flex flex-col flex-1 p-7">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[#C5A572] font-bold tracking-[0.2em] uppercase text-xs">{post.kicker}</span>
                  <span className="text-white/40 text-xs">{post.date}</span>
                </div>
                <h2 className="font-[family-name:var(--font-headline)] text-xl md:text-2xl font-bold tracking-tight text-white mb-3 leading-snug group-hover:text-[#C5A572] transition-colors">
                  {post.title}
                </h2>
                <p className="text-white/60 text-sm leading-relaxed mb-5 flex-1">{post.excerpt}</p>
                <span className="text-[#C5A572] text-sm font-bold uppercase tracking-wider">Read More →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
