import { Hero } from '@/components/home/Hero';
import { HowItWorks } from '@/components/home/HowItWorks';
import { Tools } from '@/components/home/Tools';
import { usePageTitle } from '@/lib/usePageTitle';

export default function Home() {
  usePageTitle();
  return (
    <>
      <Hero />
      <Tools />
      <HowItWorks />
    </>
  );
}
