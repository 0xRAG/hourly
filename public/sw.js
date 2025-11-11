// Service Worker for Hourly PWA
const CACHE_NAME = 'hourly-v2';

// Install event - skip caching on install to avoid issues
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, then cache (better for development)
self.addEventListener('fetch', (event) => {
  // Skip caching for Next.js internal requests and API calls
  if (
    event.request.url.includes('/_next/') ||
    event.request.url.includes('/api/') ||
    event.request.method !== 'GET'
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Network first strategy for other requests
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response before caching
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request);
      })
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'add') {
    event.waitUntil(
      clients.openWindow('/add-hours')
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  }
});

// Background sync for notifications
self.addEventListener('sync', (event) => {
  if (event.tag === 'send-reminder') {
    event.waitUntil(sendReminder());
  }
});

async function sendReminder() {
  const permission = await self.registration.pushManager.permissionState({
    userVisibleOnly: true
  });

  if (permission === 'granted') {
    self.registration.showNotification('Time to log your hours!', {
      body: 'Don\'t forget to add your hours for today.',
      icon: '/icon.svg',
      badge: '/icon.svg',
      tag: 'hour-reminder',
      requireInteraction: false,
      actions: [
        {
          action: 'add',
          title: 'Add Hours'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    });
  }
}
