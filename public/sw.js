const CACHE_NAME = "stylehub-v1"
const STATIC_CACHE = "stylehub-static-v1"
const DYNAMIC_CACHE = "stylehub-dynamic-v1"

// Assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/shop",
  "/categories",
  "/about",
  "/contact",
  "/offline",
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-512x512.png",
]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...")

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Service Worker: Caching static assets")
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log("Service Worker: Static assets cached")
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error("Service Worker: Error caching static assets", error)
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...")

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("Service Worker: Deleting old cache", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log("Service Worker: Activated")
        return self.clients.claim()
      }),
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== "GET") return

  // Skip external requests (except images)
  if (!url.origin.includes(self.location.origin) && !request.destination === "image") {
    return
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        console.log("Service Worker: Serving from cache", request.url)
        return cachedResponse
      }

      // Otherwise fetch from network
      return fetch(request)
        .then((networkResponse) => {
          // Don't cache if not a valid response
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
            return networkResponse
          }

          // Clone the response
          const responseToCache = networkResponse.clone()

          // Determine which cache to use
          const cacheToUse = STATIC_ASSETS.includes(url.pathname) ? STATIC_CACHE : DYNAMIC_CACHE

          // Cache the response
          caches.open(cacheToUse).then((cache) => {
            console.log("Service Worker: Caching new resource", request.url)
            cache.put(request, responseToCache)
          })

          return networkResponse
        })
        .catch((error) => {
          console.log("Service Worker: Fetch failed, serving offline page", error)

          // Serve offline page for navigation requests
          if (request.destination === "document") {
            return caches.match("/offline")
          }

          // Serve placeholder for images
          if (request.destination === "image") {
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" dy=".3em" fill="#9ca3af">Image unavailable</text></svg>',
              { headers: { "Content-Type": "image/svg+xml" } },
            )
          }

          throw error
        })
    }),
  )
})

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync", event.tag)

  if (event.tag === "cart-sync") {
    event.waitUntil(syncCartData())
  }
})

// Push notifications
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push received", event)

  const options = {
    body: event.data ? event.data.text() : "New notification from StyleHub",
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "View Products",
        icon: "/icon-192x192.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/icon-192x192.png",
      },
    ],
  }

  event.waitUntil(self.registration.showNotification("StyleHub", options))
})

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked", event)

  event.notification.close()

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/shop"))
  }
})

// Helper function to sync cart data
async function syncCartData() {
  try {
    // Get cart data from IndexedDB or localStorage
    const cartData = await getStoredCartData()

    if (cartData && cartData.length > 0) {
      // Send to server when online
      const response = await fetch("/api/cart/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartData),
      })

      if (response.ok) {
        console.log("Service Worker: Cart data synced successfully")
        // Clear local storage after successful sync
        await clearStoredCartData()
      }
    }
  } catch (error) {
    console.error("Service Worker: Error syncing cart data", error)
  }
}

// Helper functions for cart data management
async function getStoredCartData() {
  // Implementation would depend on your storage strategy
  return []
}

async function clearStoredCartData() {
  // Implementation would depend on your storage strategy
}
