const CACHE_NAME = 'accountability-tracker-v1';
const urlsToCache = [
  '/four-locks-tracker/',
  '/four-locks-tracker/index.html',
  '/four-locks-tracker/style.css',
  '/four-locks-tracker/script.js',
  '/four-locks-tracker/official-login.html',
  '/four-locks-tracker/manifest.json'
];

// Install event - cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
