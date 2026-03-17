const CACHE_NAME = 'kushane-v3'; 
const ASSETS = [
  'index.html',
  'manifest.json',
  'kushane_icon.png',
  'birdhouse_icon.png',
  'settings_icon.png',
  'pigeon_darkened.jpg',
  'https://unpkg.com/mqtt/dist/mqtt.min.js',
  'https://fonts.googleapis.com/css2?family=Playwrite+AU+TAS:wght@100..400&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(ASSETS.map(asset => cache.add(asset)));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('hivemq.cloud') || 
      event.request.url.includes('fonts.gstatic.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
