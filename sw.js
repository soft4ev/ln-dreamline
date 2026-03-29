const CACHE_NAME = 'light-night-dreamline-v5';

    const ASSETS_TO_CACHE = [
      './index.html',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css'
      'https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js'
    ];

      './',                 // 缓存根目录
      './index.html',       // 缓存主页面

      './assets/sounds/send.mp3',
      './assets/sounds/receive.mp3',

      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js'
    ];

    // 安装阶段：缓存核心资源
    self.addEventListener('install', (event) => {
      // 强制跳过等待，让新版本立即生效
      self.skipWaiting(); 
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
              // 如果缓存名不是当前的 v5，就删掉它
              if (name !== CACHE_NAME) {
                console.log('正在清理旧缓存:', name);
                return caches.delete(name);
              }
            })
          );
        }).then(() => self.clients.claim()) // 让新 Service Worker 立即接管页面
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

    // 监听通知点击事件
    self.addEventListener('notificationclick', (event) => {
      event.notification.close(); // 点击后关闭通知点
    // 逻辑：如果页面已经打开则聚焦，否则打开新窗口
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) {
                return clientList[0].focus();
            }
            return clients.openWindow('./');
        })
    );
});