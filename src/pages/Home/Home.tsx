import { Compare } from '@/components/home/Compare';
import { FaqChat } from '@/components/home/FaqChat';
import { Hero } from '@/components/home/Hero';
import { HowItWorks } from '@/components/home/HowItWorks';
import { MoodCloud } from '@/components/home/MoodCloud';
import { Stories } from '@/components/home/Stories';
import { Ticket } from '@/components/home/Ticket';
import { Tools } from '@/components/home/Tools';
import { usePageTitle } from '@/lib/usePageTitle';

export default function Home() {
  usePageTitle();
  return (
    <>
      <Hero />
      <Tools />
      <HowItWorks />
      <MoodCloud />
      <Compare />
      <Stories />
      <FaqChat />
      <Ticket />
    </>
  );
}
