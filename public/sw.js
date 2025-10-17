const CACHE_NAME = 'inked-cache-v2'; // Increment cache version
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx',
  '/icon.svg',
  '/App.tsx',
  '/types.ts',
  '/components/PenItem.tsx',
  '/components/Modal.tsx',
  '/components/icons.tsx',
  '/components/BrandLogo.tsx',
  '/components/ImageUploader.tsx',
  '/components/ThemeSwitcher.tsx'
];

// Install: Cache all core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching core assets');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Use "Network first, falling back to cache" strategy
self.addEventListener('fetch', event => {
  // For navigation requests, always try network first.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If fetch is successful, clone it and cache it.
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // If fetch fails (offline), return the cached page.
          return caches.match(event.request);
        })
    );
    return;
  }

  // For other requests (assets), use cache first for speed.
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
