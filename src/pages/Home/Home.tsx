import { Hero } from '@/components/home/Hero';
import { usePageTitle } from '@/lib/usePageTitle';

export default function Home() {
  usePageTitle();
  return <Hero />;
}
