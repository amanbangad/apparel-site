/* lib/analytics.ts
 * Thin wrapper around the Facebook Pixel (fbq) API that:
 * 1. Queues events until fbq is ready.
 * 2. Flushes the queue once fbq becomes available.
 * 3. Supports Meta Pixel advanced matching with SHA-256 hashing.
 * 4. Ensures compliance with Meta's strict event format requirements.
 */

import { sha256Hex } from "./crypto"

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    _fbq?: unknown
  }
}

type FbqFn = (...args: unknown[]) => void

// Content item as expected by Meta Pixel (only these fields are allowed)
interface ContentItem {
  id: string
  quantity: number
  item_price: number
}

// Advanced matching data (will be SHA-256 hashed by our function)
interface AdvancedMatchingData {
  em?: string
  ph?: string
  fn?: string
  ln?: string
  ct?: string
  st?: string
  zp?: string
  country?: string
}

interface EventOptions {
  content_type?: string
  content_ids?: string[]
  contents?: ContentItem[]
  currency?: string
  value?: number
  order_id?: string
  eventID?: string
}

let fbqEventQueue: Array<{ event: string; data?: unknown; options?: Record<string, unknown> }> = []
let flushTimeout: NodeJS.Timeout | null = null

function flushFbqQueue() {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    const fbq = window.fbq as FbqFn
    fbqEventQueue.forEach(({ event, data, options }) => {
      try {
        // Combine data and options into a single object for fbq
        const mergedData = { ...data, ...options }
        fbq("track", event, mergedData)
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
 * Supports Meta Pixel advanced matching with automatic SHA-256 hashing.
 *
 * @param event - Event name (e.g., "Purchase", "AddToCart")
 * @param data - Event data (content_ids, contents, value, currency, etc.)
 * @param advancedMatching - User data for advanced matching (will be SHA-256 hashed)
 */
export const trackFbEvent = async (
  event: string,
  data?: EventOptions,
  advancedMatching?: AdvancedMatchingData,
) => {
  if (typeof window === "undefined") return

  // Hash advanced matching fields
  let hashedMatching: Record<string, string> = {}
  if (advancedMatching) {
    try {
      if (advancedMatching.em) hashedMatching.em = await sha256Hex(advancedMatching.em.toLowerCase().trim())
      if (advancedMatching.ph) hashedMatching.ph = await sha256Hex(advancedMatching.ph.replace(/\D/g, ""))
      if (advancedMatching.fn) hashedMatching.fn = await sha256Hex(advancedMatching.fn.toLowerCase().trim())
      if (advancedMatching.ln) hashedMatching.ln = await sha256Hex(advancedMatching.ln.toLowerCase().trim())
      if (advancedMatching.ct) hashedMatching.ct = await sha256Hex(advancedMatching.ct.toLowerCase().trim())
      if (advancedMatching.st) hashedMatching.st = await sha256Hex(advancedMatching.st.toLowerCase().trim())
      if (advancedMatching.zp) hashedMatching.zp = await sha256Hex(advancedMatching.zp.toLowerCase().replace(/\s/g, ""))
      if (advancedMatching.country) hashedMatching.country = await sha256Hex(advancedMatching.country.toLowerCase())
    } catch (error) {
      console.error("Error hashing advanced matching data:", error)
    }
  }

  // Clean contents array to only include allowed fields
  const cleanedData = { ...data }
  if (cleanedData.contents && Array.isArray(cleanedData.contents)) {
    cleanedData.contents = cleanedData.contents.map((item: any) => ({
      id: item.id,
      quantity: item.quantity,
      item_price: item.item_price,
    }))
  }

  // Merge hashed matching data with event data
  const eventOptions = { ...cleanedData, user_data: hashedMatching }

  if (typeof window.fbq === "function") {
    const fbq = window.fbq as FbqFn
    try {
      fbq("track", event, eventOptions)
    } catch (error) {
      console.error("Facebook Pixel tracking error:", error)
    }
  } else {
    // fbq not ready -- enqueue the event
    fbqEventQueue.push({ event, options: eventOptions })

    // Set up retry to flush queue when fbq becomes available
    if (!flushTimeout) {
      flushTimeout = setTimeout(() => {
        flushFbqQueue()
        // Retry up to 5 times
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
