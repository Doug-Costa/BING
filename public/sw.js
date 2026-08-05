const CACHE = "bingo-show-v2";
const STATIC = ["/assets/bingo-hero.png"];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(STATIC))));
self.addEventListener("activate", event => event.waitUntil(
  caches.keys()
    .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
    .then(() => self.clients.claim())
));
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || event.request.destination !== "image") return;
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
