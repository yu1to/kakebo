// 完全オフライン対応: 外部通信なし。初回アクセス時に全ファイルをキャッシュ
const CACHE_NAME = 'kakebo-v4';
const FILES = [
  './', 'index.html', 'chart.umd.js', 'manifest.json', 'favicon.ico',
  'icon-180.png', 'icon-192.png', 'icon-512.png',
  'splash-1170x2532.png', 'splash-1179x2556.png', 'splash-1284x2778.png', 'splash-750x1334.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// キャッシュ優先(クエリ違いも同じファイル扱い)。ネットが無くても必ず index.html を返す
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request).catch(() =>
      e.request.mode === 'navigate' ? caches.match('index.html') : Response.error()))
  );
});
