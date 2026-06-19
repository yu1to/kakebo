const CACHE_NAME = 'kakebo-v2';
const URLS = [
  '/kakebo/',
  '/kakebo/index.html',
  '/kakebo/favicon.ico',
  '/kakebo/manifest.json',
  '/kakebo/icon-180.png',
  '/kakebo/icon-192.png',
  '/kakebo/icon-512.png',
  '/kakebo/splash-1170x2532.png',
  '/kakebo/splash-1179x2556.png',
  '/kakebo/splash-1284x2778.png',
  '/kakebo/splash-750x1334.png',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js'
];

// インストール: キャッシュに保存
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS)).then(() => self.skipWaiting())
  );
});

// アクティベート: 古いキャッシュを削除
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// フェッチ: キャッシュ優先、なければネット
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
