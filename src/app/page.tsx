import dynamic from 'next/dynamic';
import Hero from '@/components/sections/Hero';
import Marquee from '@/components/sections/Marquee';

// ─── Below-the-fold components: lazy-loaded to reduce initial JS ───
const Products = dynamic(() => import('@/components/sections/Products'), {
  loading: () => <div className="min-h-[400px]" />,
});
const HowItWorks = dynamic(() => import('@/components/sections/HowItWorks'), {
  loading: () => <div className="min-h-[300px]" />,
});
const Testimonials = dynamic(() => import('@/components/sections/Testimonials'), {
  loading: () => <div className="min-h-[300px]" />,
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Products />
      <HowItWorks />
      <Testimonials />
    </>
  );
}
