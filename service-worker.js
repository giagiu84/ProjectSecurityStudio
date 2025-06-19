self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("gg84-store").then(cache => cache.addAll([
      "/",
      "/index.html",
      "/app.html",
      "/pro.html",
      "/messaggistica_pro.html",
      "/manifest.json",
      "/logo.png"
    ]))
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});