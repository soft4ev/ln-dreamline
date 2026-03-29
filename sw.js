const CACHE_NAME = 'light-night-dreamline-v6';

    const ASSETS_TO_CACHE = [
        './',
        './index.html',
        './assets/sounds/send.mp3',
        './assets/sounds/receive.mp3',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js'
];

    self.addEventListener('install', (event) => {
        self.skipWaiting();
        event.waitUntil(
          caches.open(CACHE_NAME).then((cache) => {
            // 使用 map 一个个添加，防止其中一个失败导致全部失败
            return Promise.all(
              ASSETS_TO_CACHE.map(url => {
                return cache.add(url).catch(err => console.log('缓存失败的资源:', url));
        })
      );
    })
  );
});

    self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      );
    }).then(() => self.clients.claim())
  );
});

    self.addEventListener('fetch', (event) => {
        event.respondWith(
          caches.match(event.request).then((response) => {
            return response || fetch(event.request);
    })
  );
});

    self.addEventListener('notificationclick', (event) => {
        event.notification.close();
        event.waitUntil(
          clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
            if (list.length > 0) return list[0].focus();
            return clients.openWindow('./');
    })
  );
});