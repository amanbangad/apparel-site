/* lib/analytics.ts
 * Thin wrapper around the Facebook Pixel (fbq) API that:
 * 1. Queues events until fbq is ready.
 * 2. Flushes the queue once fbq becomes available.
 * 3. Avoids ESLint `@typescript-eslint/no-unused-expressions` warnings by
 *    performing explicit function checks instead of the `win.fbq && win.fbq()` pattern.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    _fbq?: unknown
  }
}

type FbqFn = (...args: unknown[]) => void

let fbqEventQueue: Array<{ event: string; data?: unknown }> = []
let flushTimeout: NodeJS.Timeout | null = null

function flushFbqQueue() {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    const fbq = window.fbq as FbqFn
    fbqEventQueue.forEach(({ event, data }) => {
      try {
        fbq("track", event, data)
      } catch (error) {
        console.error("Facebook Pixel tracking error while flushing queue:", error)
      }
    })
    fbqEventQueue = []
    
    // Clear any pending flush attempts
    if (flushTimeout) {
      clearTimeout(flushTimeout)
      flushTimeout = null
    }
  }
}

/**
 * Track an event with Facebook Pixel, or queue it until fbq is loaded.
 */
export const trackFbEvent = (event: string, data?: unknown) => {
  if (typeof window !== "undefined") {
    if (typeof window.fbq === "function") {
      const fbq = window.fbq as FbqFn
      try {
        fbq("track", event, data)
      } catch (error) {
        console.error("Facebook Pixel tracking error:", error)
      }
    } else {
      // fbq not ready -- enqueue the event
      fbqEventQueue.push({ event, data })

      // Set up retry to flush queue when fbq becomes available
      if (!flushTimeout) {
        flushTimeout = setTimeout(() => {
          flushFbqQueue()
          // Retry up to 3 times (3 seconds total)
          let retries = 0
          const retryInterval = setInterval(() => {
            if (typeof window !== "undefined" && typeof window.fbq === "function") {
              flushFbqQueue()
              clearInterval(retryInterval)
            }
            retries++
            if (retries >= 5) {
              clearInterval(retryInterval)
            }
          }, 600)
        }, 500)
      }
    }
  }
}
