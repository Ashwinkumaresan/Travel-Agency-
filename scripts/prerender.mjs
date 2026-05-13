/**
 * Pre-rendering script: Builds the SSR server bundle, then uses it to
 * generate static HTML files for public routes at build time (SSG).
 * 
 * This means Vercel can serve fully rendered HTML as static files —
 * no serverless function needed, faster and cheaper.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const clientDir = path.join(root, 'dist', 'client');

// Routes to pre-render (public/SEO-important pages)
const ROUTES_TO_PRERENDER = ['/', '/about', '/contact'];

async function prerender() {
  console.log('🔄 Pre-rendering public routes...\n');

  // Read the client HTML template
  const template = fs.readFileSync(path.join(clientDir, 'index.html'), 'utf-8');

  // Import the SSR render function from the server build
  const { render } = await import('../dist/server/entry-server.js');

  for (const route of ROUTES_TO_PRERENDER) {
    const { html: appHtml, head: appHead } = render(route);

    // Replace placeholders with SSR content
    const finalHtml = template
      .replace('<!--app-head-->', appHead)
      .replace('<!--app-html-->', appHtml);

    // Write the pre-rendered HTML
    if (route === '/') {
      // Overwrite the root index.html
      fs.writeFileSync(path.join(clientDir, 'index.html'), finalHtml);
      console.log(`  ✅ / → dist/client/index.html (${(finalHtml.length / 1024).toFixed(1)} KB)`);
    } else {
      // Create directory for the route (e.g., /about → dist/client/about/index.html)
      const dir = path.join(clientDir, route.slice(1));
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'index.html'), finalHtml);
      console.log(`  ✅ ${route} → dist/client${route}/index.html (${(finalHtml.length / 1024).toFixed(1)} KB)`);
    }
  }

  console.log('\n✨ Pre-rendering complete! All public routes have full SEO content.\n');
}

prerender().catch((err) => {
  console.error('Pre-rendering failed:', err);
  process.exit(1);
});
