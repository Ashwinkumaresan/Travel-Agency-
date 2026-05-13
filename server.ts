import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;

async function createServer() {
  const app = express();

  let vite: any;
  let template: string;
  let render: (url: string) => { html: string; head: string };

  if (isProduction) {
    // Production: use compression + serve built client assets
    const compression = (await import('compression')).default;
    const sirv = (await import('sirv')).default;
    app.use(compression());
    app.use(sirv(path.resolve(__dirname, 'dist/client'), { extensions: [] }));

    template = fs.readFileSync(
      path.resolve(__dirname, 'dist/client/index.html'),
      'utf-8'
    );
    const serverModule = await import('./dist/server/entry-server.js');
    render = serverModule.render;
  } else {
    // Development: use Vite dev server as middleware
    const { createServer: createViteServer } = await import('vite');
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
  }

  // Handle all routes with SSR
  app.use('*', async (req, res) => {
    const url = req.originalUrl;

    try {
      let processedTemplate: string;
      let ssrRender: typeof render;

      if (isProduction) {
        processedTemplate = template;
        ssrRender = render;
      } else {
        // In dev, Vite transforms the HTML and loads the entry-server module on the fly
        processedTemplate = await vite.transformIndexHtml(url, template);
        const mod = await vite.ssrLoadModule('/src/entry-server.tsx');
        ssrRender = mod.render;
      }

      const { html: appHtml, head: appHead } = ssrRender(url);

      // Replace placeholders in the HTML template
      const finalHtml = processedTemplate
        .replace('<!--app-head-->', appHead)
        .replace('<!--app-html-->', appHtml);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);
    } catch (e: any) {
      // In dev, let Vite fix the stack trace
      if (!isProduction && vite) {
        vite.ssrFixStacktrace(e);
      }
      console.error(e.stack);
      res.status(500).end(e.stack);
    }
  });

  app.listen(port, () => {
    console.log(`SSR server running at http://localhost:${port}`);
  });
}

createServer();
