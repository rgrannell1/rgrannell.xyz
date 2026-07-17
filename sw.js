// Retire the old asset cache. Versioned URLs are cached by the browser/CDN.
self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    Promise.all(["sw-cache", "v1"].map(function (name) {
      return caches.delete(name);
    })).then(function () {
      return self.registration.unregister();
    })
  );
});
