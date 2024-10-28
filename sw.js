const CSS_DIR = "css";

const resources = [
  `/${CSS_DIR}/marx.min.css`,
  `/${CSS_DIR}/katex.min.css`,
  `/${CSS_DIR}/github.markdown.css`,
  `/${CSS_DIR}/marx.min.css`,
  `/${CSS_DIR}/style.css`,
  `/${CSS_DIR}/prism-laserwave.css`,
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open("sw-cache").then(function (cache) {
      return Promise.all(resources.map((resource) => cache.add(resource)));
    }),
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    }),
  );
});
