import { defineConfig } from 'vite';
import { resolve } from 'path';
import { messageHandler, messagesHandler } from './lib/store.js';

// In `npm run dev`, serve the same /api handlers Vercel runs in production
// (messages are stored in data/messages.json locally).
function localApi() {
  const wrap = (handler) => async (req, res) => {
    let raw = '';
    for await (const chunk of req) raw += chunk;
    try { req.body = raw ? JSON.parse(raw) : {}; } catch { req.body = {}; }
    req.query = Object.fromEntries(new URL(req.url, 'http://x').searchParams);
    res.status = (code) => { res.statusCode = code; return res; };
    res.json = (v) => { res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.end(JSON.stringify(v)); };
    await handler(req, res);
  };
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use('/api/messages', wrap(messagesHandler));
      server.middlewares.use('/api/message', wrap(messageHandler));
      server.middlewares.use((req, res, next) => {
        if (req.url === '/messages' || req.url === '/messages/') req.url = '/messages.html';
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [localApi()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        messages: resolve(import.meta.dirname, 'messages.html'),
      },
    },
  },
});
