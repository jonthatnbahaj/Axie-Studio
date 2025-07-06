// Enhanced Service Worker for Axie Studio PWA
// Version 2.0 - Advanced PWA Features

const CACHE_NAME = 'axie-studio-v2.0';
const OFFLINE_URL = '/offline.html';
const CACHE_STRATEGY_TIMEOUT = 3000; // 3 seconds timeout for network requests

// Enhanced asset caching with versioning
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/Axiestudiologo.jpg',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
];

// Critical resources that should always be cached
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\//,
  /\/functions\//
];

// Install event - Enhanced caching strategy
self.addEventListener('install', (event) => {
  console.log('🚀 Service Worker: Installing v2.0...');
  
  event.waitUntil(
    Promise.all([
      // Cache critical resources first
      caches.open(CACHE_NAME).then((cache) => {
        console.log('📦 Service Worker: Caching critical resources');
        return cache.addAll(CRITICAL_RESOURCES);
      }),
      // Cache additional assets
      caches.open(CACHE_NAME).then((cache) => {
        console.log('📦 Service Worker: Caching additional assets');
        return Promise.allSettled(
          ASSETS_TO_CACHE.map(url => 
            cache.add(url).catch(err => {
              console.warn(`Failed to cache ${url}:`, err);
              return null;
            })
          )
        );
      })
    ]).then(() => {
      console.log('✅ Service Worker: Install completed');
      return self.skipWaiting();
    })
  );
});

// Activate event - Enhanced cleanup
self.addEventListener('activate', (event) => {
  console.log('🔧 Service Worker: Activating v2.0...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => {
              console.log('🧹 Service Worker: Clearing old cache', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      // Claim all clients
      self.clients.claim()
    ]).then(() => {
      console.log('✅ Service Worker: Activate completed');
    })
  );
});

// Enhanced fetch strategy with multiple fallbacks
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip cross-origin requests except for known resources
  if (!url.origin.includes(self.location.origin) && 
      !url.hostname.includes('fonts.googleapis.com') &&
      !url.hostname.includes('fonts.gstatic.com') &&
      !url.hostname.includes('kt5xwoxw7ivvaxql.public.blob.vercel-storage.com')) {
    return;
  }
  
  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }
  
  // Handle API requests
  if (API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // Handle static assets
  event.respondWith(handleStaticAssetRequest(request));
});

// Navigation request handler with offline fallback
async function handleNavigationRequest(request) {
  try {
    // Try network first with timeout
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), CACHE_STRATEGY_TIMEOUT)
      )
    ]);
    
    if (networkResponse.ok) {
      // Cache successful navigation responses
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('🌐 Service Worker: Network failed for navigation, trying cache');
  }
  
  // Try cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Fallback to offline page
  return caches.match(OFFLINE_URL);
}

// API request handler with cache-first strategy for GET requests
async function handleApiRequest(request) {
  if (request.method === 'GET') {
    // For GET requests, try cache first, then network
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Serve from cache and update in background
      updateCacheInBackground(request);
      return cachedResponse;
    }
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // For GET requests, try to serve stale cache
    if (request.method === 'GET') {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }
    throw error;
  }
}

// Static asset handler with stale-while-revalidate
async function handleStaticAssetRequest(request) {
  const cachedResponse = await caches.match(request);
  
  // Serve from cache immediately if available
  if (cachedResponse) {
    // Update cache in background
    updateCacheInBackground(request);
    return cachedResponse;
  }
  
  // If not in cache, fetch from network
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('❌ Service Worker: Failed to fetch asset:', error);
    throw error;
  }
}

// Background cache update
async function updateCacheInBackground(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, networkResponse);
    }
  } catch (error) {
    console.log('🔄 Service Worker: Background update failed:', error);
  }
}

// Enhanced push notification handling
self.addEventListener('push', (event) => {
  console.log('📬 Service Worker: Push received');
  
  let notificationData = {
    title: 'Axie Studio',
    body: 'You have a new notification',
    icon: 'https://kt5xwoxw7ivvaxql.public.blob.vercel-storage.com/axie-studio-logo.png-KXUZ7kPWDExqtd3vBbevDyEnUzu8Il.jpeg',
    badge: 'https://kt5xwoxw7ivvaxql.public.blob.vercel-storage.com/axie-studio-logo.png-KXUZ7kPWDExqtd3vBbevDyEnUzu8Il.jpeg',
    tag: 'axie-studio-notification',
    requireInteraction: false,
    silent: false
  };
  
  try {
    if (event.data) {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    }
  } catch (error) {
    console.warn('Failed to parse push data:', error);
  }
  
  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    tag: notificationData.tag,
    requireInteraction: notificationData.requireInteraction,
    silent: notificationData.silent,
    vibrate: [100, 50, 100],
    data: {
      url: notificationData.url || '/',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'open',
        title: 'Open',
        icon: notificationData.icon
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

// Enhanced notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('🖱️ Service Worker: Notification clicked');
  
  event.notification.close();
  
  const action = event.action;
  const url = event.notification.data?.url || '/';
  
  if (action === 'close') {
    return;
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If no window/tab is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  console.log('🔄 Service Worker: Background sync triggered');
  
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForms());
  } else if (event.tag === 'booking-sync') {
    event.waitUntil(syncBookings());
  }
});

// Sync contact forms
async function syncContactForms() {
  try {
    const db = await openIndexedDB();
    const transaction = db.transaction(['contact-forms'], 'readonly');
    const store = transaction.objectStore('contact-forms');
    const forms = await getAllFromStore(store);
    
    for (const form of forms) {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form.data)
        });
        
        if (response.ok) {
          // Remove from IndexedDB after successful sync
          const deleteTransaction = db.transaction(['contact-forms'], 'readwrite');
          const deleteStore = deleteTransaction.objectStore('contact-forms');
          await deleteFromStore(deleteStore, form.id);
          
          // Show success notification
          self.registration.showNotification('Form Submitted', {
            body: 'Your contact form has been submitted successfully.',
            icon: 'https://kt5xwoxw7ivvaxql.public.blob.vercel-storage.com/axie-studio-logo.png-KXUZ7kPWDExqtd3vBbevDyEnUzu8Il.jpeg',
            tag: 'form-success'
          });
        }
      } catch (error) {
        console.error('Failed to sync contact form:', error);
      }
    }
  } catch (error) {
    console.error('Error in syncContactForms:', error);
  }
}

// Sync bookings
async function syncBookings() {
  try {
    const db = await openIndexedDB();
    const transaction = db.transaction(['bookings'], 'readonly');
    const store = transaction.objectStore('bookings');
    const bookings = await getAllFromStore(store);
    
    for (const booking of bookings) {
      try {
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(booking.data)
        });
        
        if (response.ok) {
          const deleteTransaction = db.transaction(['bookings'], 'readwrite');
          const deleteStore = deleteTransaction.objectStore('bookings');
          await deleteFromStore(deleteStore, booking.id);
          
          self.registration.showNotification('Booking Confirmed', {
            body: 'Your booking has been confirmed successfully.',
            icon: 'https://kt5xwoxw7ivvaxql.public.blob.vercel-storage.com/axie-studio-logo.png-KXUZ7kPWDExqtd3vBbevDyEnUzu8Il.jpeg',
            tag: 'booking-success'
          });
        }
      } catch (error) {
        console.error('Failed to sync booking:', error);
      }
    }
  } catch (error) {
    console.error('Error in syncBookings:', error);
  }
}

// Enhanced IndexedDB helpers
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('axie-studio-db', 2);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains('contact-forms')) {
        db.createObjectStore('contact-forms', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('bookings')) {
        db.createObjectStore('bookings', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('cache-metadata')) {
        db.createObjectStore('cache-metadata', { keyPath: 'url' });
      }
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    request.onerror = (event) => {
      reject('IndexedDB error: ' + event.target.errorCode);
    };
  });
}

function getAllFromStore(store) {
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function deleteFromStore(store, id) {
  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  console.log('⏰ Service Worker: Periodic sync triggered');
  
  if (event.tag === 'update-content') {
    event.waitUntil(updateContentInBackground());
  }
});

// Update content in background
async function updateContentInBackground() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedRequests = await cache.keys();
    
    // Update cached pages
    for (const request of cachedRequests) {
      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.put(request, response);
        }
      } catch (error) {
        console.log('Failed to update cached resource:', request.url);
      }
    }
    
    console.log('✅ Service Worker: Content updated in background');
  } catch (error) {
    console.error('❌ Service Worker: Failed to update content:', error);
  }
}

// Handle app installation
self.addEventListener('appinstalled', (event) => {
  console.log('📱 Service Worker: App installed successfully');
  
  // Track installation
  self.registration.showNotification('Welcome to Axie Studio!', {
    body: 'The app has been installed successfully. You can now access it from your home screen.',
    icon: 'https://kt5xwoxw7ivvaxql.public.blob.vercel-storage.com/axie-studio-logo.png-KXUZ7kPWDExqtd3vBbevDyEnUzu8Il.jpeg',
    tag: 'app-installed',
    requireInteraction: true
  });
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  console.log('💬 Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  } else if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(event.data.urls);
      })
    );
  } else if (event.data && event.data.type === 'TRIGGER_SYNC') {
    // Handle sync trigger from main thread
    console.log('🔄 Service Worker: Sync triggered from main thread');
    if ('sync' in self.registration) {
      try {
        self.registration.sync.register('contact-form-sync');
        self.registration.sync.register('booking-sync');
        console.log('✅ Service Worker: Background sync registered successfully');
      } catch (error) {
        console.error('❌ Service Worker: Failed to register background sync:', error);
      }
    }
  }
});

// Error handling
self.addEventListener('error', (event) => {
  console.error('❌ Service Worker: Error occurred', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Service Worker: Unhandled promise rejection', event.reason);
});

console.log('🚀 Service Worker: Enhanced v2.0 initialized with advanced PWA features');