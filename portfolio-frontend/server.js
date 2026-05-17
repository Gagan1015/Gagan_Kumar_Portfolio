import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production' || process.argv.includes('--production');
const port = Number(process.env.PORT || 3000);
const base = process.env.BASE || '/';

const resolve = (filePath) => path.resolve(__dirname, filePath);
const serialize = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

const app = express();

let vite;
let template;
let render;

app.get('/env-config.js', (_req, res) => {
  res
    .type('application/javascript')
    .send(`window._env_ = ${serialize({
      VITE_API_URL: process.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
      VITE_API_TIMEOUT: process.env.VITE_API_TIMEOUT || '30000',
    })};`);
});

if (isProduction) {
  template = await fs.readFile(resolve('dist/client/index.html'), 'utf-8');
  render = (await import('./dist/server/entry-server.js')).render;

  app.use(base, express.static(resolve('dist/client'), {
    index: false,
    maxAge: '1y',
    immutable: true,
  }));
} else {
  const { createServer } = await import('vite');
  vite = await createServer({
    appType: 'custom',
    base,
    server: {
      middlewareMode: true,
    },
  });
  app.use(vite.middlewares);
}

app.use(async (req, res, next) => {
  try {
    const url = req.originalUrl.replace(base, '/');
    let htmlTemplate = template;
    let renderRequest = render;

    if (!isProduction) {
      htmlTemplate = await fs.readFile(resolve('index.html'), 'utf-8');
      htmlTemplate = await vite.transformIndexHtml(url, htmlTemplate);
      renderRequest = (await vite.ssrLoadModule('/entry-server.tsx')).render;
    }

    const rendered = await renderRequest(url);
    const html = htmlTemplate
      .replace('<!--app-head-->', rendered.head)
      .replace('<!--app-html-->', rendered.html)
      .replace('<!--app-state-->', `<script>window.__REACT_QUERY_STATE__=${serialize(rendered.dehydratedState)}</script>`);

    res.status(rendered.statusCode).type('text/html').send(html);
  } catch (error) {
    vite?.ssrFixStacktrace(error);
    next(error);
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`SSR server running at http://localhost:${port}`);
});
