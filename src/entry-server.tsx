import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App.tsx';

// Route-specific SEO data
const SEO_DATA: Record<string, { title: string; description: string; canonical: string }> = {
  '/': {
    title: 'S A Salem Super Service | Reliable Parcel & Cargo Logistics in Tamil Nadu',
    description: 'S A Salem Super Service — Leading parcel and cargo service in Tamil Nadu since 2000. Door-to-door delivery, express cargo, packers & movers across Coimbatore, Salem, Chennai, Vellore & more.',
    canonical: 'https://travel-agency-three-kappa.vercel.app/',
  },
  '/about': {
    title: 'About Us | S A Salem Super Service',
    description: 'Learn about S A Salem Super Service — a legacy of reliable logistics since 2000, serving Tamil Nadu with dedication and cutting-edge technology.',
    canonical: 'https://travel-agency-three-kappa.vercel.app/about',
  },
  '/contact': {
    title: 'Contact Us | S A Salem Super Service',
    description: 'Get in touch with S A Salem Super Service. Reach our branches in Mettur, Chennai, Bangalore, and Hyderabad for parcel and cargo bookings.',
    canonical: 'https://travel-agency-three-kappa.vercel.app/contact',
  },
};

// JSON-LD Structured Data for the home page
const HOME_JSONLD = {
  "@context": "https://schema.org",
  "@type": "LogisticsService",
  "name": "S A Salem Super Service",
  "description": "Leading Parcel and Cargo Service Company in Tamil Nadu",
  "url": "https://travel-agency-three-kappa.vercel.app",
  "logo": "https://travel-agency-three-kappa.vercel.app/logo.png",
  "areaServed": [
    "Coimbatore", "Salem", "Chennai", "Vellore",
    "Mettur", "Bangalore", "Hyderabad", "Pondicherry"
  ],
  "foundingDate": "2000",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "No:160, East Main Road",
    "addressLocality": "Mettur Dam",
    "addressRegion": "Tamil Nadu",
    "postalCode": "636401",
    "addressCountry": "IN"
  },
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+91-9788321354",
      "contactType": "Customer Service"
    },
    {
      "@type": "ContactPoint",
      "telephone": "+91-04298-297784",
      "contactType": "Head Office"
    }
  ],
  "sameAs": []
};

export function render(url: string) {
  // Render the app HTML
  const html = renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );

  // Build head tags based on route
  const seo = SEO_DATA[url] || SEO_DATA['/'];
  const headTags = [
    `<title>${seo.title}</title>`,
    `<meta name="description" content="${seo.description}" />`,
    `<link rel="canonical" href="${seo.canonical}" />`,
    `<meta property="og:title" content="${seo.title}" />`,
    `<meta property="og:description" content="${seo.description}" />`,
    `<meta property="og:url" content="${seo.canonical}" />`,
  ];

  // Add JSON-LD only for the home page
  if (url === '/') {
    headTags.push(
      `<script type="application/ld+json">${JSON.stringify(HOME_JSONLD)}</script>`
    );
  }

  return { html, head: headTags.join('\n    ') };
}
