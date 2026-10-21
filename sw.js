/* Paskle service worker: makes practice work offline.
   App files and fonts are saved on install; language files are saved the first time they load.
   Bump VERSION whenever any file changes, so phones pick up the new version. */
const VERSION = "paskle-2026-10-21h";
const CORE = [
  "./", "index.html", "manifest.webmanifest",
  "data/hha-a.js", "data/hha-b.js", "data/hha-c.js", "data/hha-d.js", "data/hha-map.js",
  "data/cna-a.js", "data/ma-cna.js", "data/permit-a.js",
  "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png",
  "fonts/atkinson-hyperlegible-latin-400-normal.woff2", "fonts/atkinson-hyperlegible-latin-700-normal.woff2", "fonts/source-serif-4-latin-opsz-normal.woff2"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // Pages: try the network first so updates show, fall back to the saved copy offline.
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(VERSION).then(x => x.put("index.html", c)); return r; })
      .catch(() => caches.match("index.html")));
    return;
  }
  // Everything else: answer from the cache right away, refresh it in the background.
  e.respondWith(caches.open(VERSION).then(cache => cache.match(req).then(hit => {
    const net = fetch(req).then(r => { if (r && (r.ok || r.type === "opaque")) cache.put(req, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  })));
});
