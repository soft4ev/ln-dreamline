const CACHE_NAME = 'light-night-dreamline-v1';
    const ASSETS_TO_CACHE = [
      './index.html',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css'
      'https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js'
    ];

    // 安装阶段：缓存核心资源
    self.addEventListener('install', (event) => {
      event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
          return cache.addAll(ASSETS_TO_CACHE);
        })
      );
    });

    // 激活阶段：清理旧缓存
    self.addEventListener('activate', (event) => {
      event.waitUntil(
        caches.keys().then((cacheNames) => {
          return Promise.all(
            cacheNames.map((name) => {
              if (name !== CACHE_NAME) return caches.delete(name);
            })
          );
        })
      );
    });

    // 拦截请求：优先从缓存读取
    self.addEventListener('fetch', (event) => {
      event.respondWith(
        caches.match(event.request).then((response) => {
          return response || fetch(event.request);
        })
      );
    });