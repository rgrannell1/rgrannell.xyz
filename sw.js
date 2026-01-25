// Cache-first for versioned assets (CSS with ?v=hash), network-first for everything else
self.addEventListener("fetch", function (event) {
  const url = new URL(event.request.url);

  // Versioned assets can be cached indefinitely
  if (url.search.includes("v=")) {
    event.respondWith(
      caches.match(event.request).then(function (cached) {
        return cached || fetch(event.request).then(function (response) {
          return caches.open("v1").then(function (cache) {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  }
});
