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
    document.title = 'Mettur Transports | Leading Parcel & Cargo Services in South India Since 1993';
    
    // SEO Meta Tags
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Mettur Transports (mSs) provides reliable door-to-door parcel, cargo, and logistic services across Tamilnadu, Pondicherry, Karnataka, and more since 1993.');
    }

    // JSON-LD Schema for SEO
    const schema = {
      "@context": "https://schema.org",
      "@type": "LogisticsService",
      "name": "Mettur Transports",
      "description": "Leading Parcel and Cargo Service Company in South India since 1993.",
      "url": window.location.origin,
      "logo": `${window.location.origin}/logo.png`,
      "areaServed": ["Tamilnadu", "Pondicherry", "Karnataka", "Andhra", "Hyderabad", "Telangana"],
      "foundingDate": "1993",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "9443312370",
        "contactType": "Customer Service"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    // Hide scrollbar for this page
    document.documentElement.classList.add('no-scrollbar');

    return () => {
      document.head.removeChild(script);
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
