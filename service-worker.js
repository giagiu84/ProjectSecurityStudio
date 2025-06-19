
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("gg84-cache").then(cache => {
      return cache.addAll(["index.html", "app.html", "manifest.json", "logo.png"]);
    })
  );
});
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
