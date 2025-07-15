;/>
\
1. Replace every use of the `window.fbq && window.fbq("track" …)\` pattern
with an explicit
\
function check
+ call.

\`\``ts
declare global {
  interface Window {
    fbq?: unknown
    _fbq?: unknown
  }
}

type FbqFn = (...args: unknown[]) => void

let fbqEventQueue: Array<{ event: string; data?: unknown }> = []

function flushFbqQueue() {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    const fbq = window.fbq as FbqFn
    fbqEventQueue.forEach(({ event, data }) => {
      try {
        fbq("track", event, data)
      } catch (error) {
        console.error("Facebook Pixel tracking error (flushing queue):", error)
      }
    })
    fbqEventQueue = []
  }
}

export const trackFbEvent = (event: string, data?: unknown) => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    const fbq = window.fbq as FbqFn
    try {
      fbq("track", event, data)
    } catch (error) {
      console.error("Facebook Pixel tracking error:", error)
    }
    flushFbqQueue()
  } else {
    // Queue the event if fbq is not ready
    fbqEventQueue.push({ event, data })

    if (typeof window !== "undefined") {
      if (!window.fbq) {
        console.warn("Facebook Pixel (fbq) not ready, event queued:", event)
      }
      // Try to flush the queue after a short delay
      setTimeout(flushFbqQueue, 1000)
    }
  }
}
