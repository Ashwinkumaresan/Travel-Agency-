import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import HomeHero from '@/components/home/HomeHero';
import WhoWeAre from '@/components/home/WhoWeAre';
import OurServices from '@/components/home/OurServices';
import ExpressFeatures from '@/components/home/ExpressFeatures';
import InfoBlocks from '@/components/home/InfoBlocks';
import FeedbackSection from '@/components/home/FeedbackSection';
import HomeFooter from '@/components/home/HomeFooter';

export default function Home() {
  useEffect(() => {
    // Hide scrollbar for this page (client-only effect)
    document.documentElement.classList.add('no-scrollbar');

    return () => {
      document.documentElement.classList.remove('no-scrollbar');
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary selection:text-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Dynamic & SEO Optimized Home Page Structure */}
        <HomeHero />
        
        <article>
          <WhoWeAre />
          <OurServices />
          <ExpressFeatures />
          <InfoBlocks />
          <FeedbackSection />
        </article>
      </main>

      <HomeFooter />
    </div>
  );
}
