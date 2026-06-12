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
        // Pass options as the 4th fbq arg — never merge into event data.
        // Meta reads advanced matching (em, ph, fn, ln) and eventID only
        // from the 4th argument; values in the 3rd arg are silently ignored.
        options
          ? fbq("track", event, data, options)
          : fbq("track", event, data)
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
 *
 * @param event            - Event name (e.g. "Purchase", "AddToCart")
 * @param data             - Event parameters — 3rd fbq arg
 * @param advancedMatching - Raw (unhashed) user PII. Hashed here with SHA-256
 *                           and passed as the 4th fbq arg where Meta reads it.
 *                           Never put these in the event data (3rd arg) —
 *                           Meta ignores them there.
 * @param eventID          - Deduplication ID for Conversions API — also 4th arg.
 */
export const trackFbEvent = async (
  event: string,
  data?: EventOptions,
  advancedMatching?: AdvancedMatchingData,
  eventID?: string,
) => {
  if (typeof window === "undefined") return

  // Build the 4th-arg options object: hashed PII + eventID
  let fbqOptions: Record<string, string> | undefined
  if (advancedMatching || eventID) {
    fbqOptions = {}
    if (eventID) fbqOptions.eventID = eventID
    try {
      if (advancedMatching?.em) fbqOptions.em = await sha256Hex(advancedMatching.em.trim().toLowerCase())
      if (advancedMatching?.ph) fbqOptions.ph = await sha256Hex(advancedMatching.ph.replace(/\D/g, ""))
      if (advancedMatching?.fn) fbqOptions.fn = await sha256Hex(advancedMatching.fn.trim().toLowerCase())
      if (advancedMatching?.ln) fbqOptions.ln = await sha256Hex(advancedMatching.ln.trim().toLowerCase())
      if (advancedMatching?.ct) fbqOptions.ct = await sha256Hex(advancedMatching.ct.trim().toLowerCase())
      if (advancedMatching?.st) fbqOptions.st = await sha256Hex(advancedMatching.st.trim().toLowerCase())
      if (advancedMatching?.zp) fbqOptions.zp = await sha256Hex(advancedMatching.zp.replace(/\s/g, ""))
      if (advancedMatching?.country) fbqOptions.country = await sha256Hex(advancedMatching.country.trim().toLowerCase())
    } catch (error) {
      console.error("Error hashing advanced matching data:", error)
    }
  }

  // Clean contents array to only include Meta-spec fields
  const cleanedData = { ...data }
  if (cleanedData.contents && Array.isArray(cleanedData.contents)) {
    cleanedData.contents = cleanedData.contents.map((item: any) => ({
      id: item.id,
      quantity: item.quantity,
      item_price: item.item_price,
    }))
  }

  if (typeof window.fbq === "function") {
    const fbq = window.fbq as FbqFn
    try {
      fbqOptions
        ? fbq("track", event, cleanedData, fbqOptions)
        : fbq("track", event, cleanedData)
    } catch (error) {
      console.error("Facebook Pixel tracking error:", error)
    }
  } else {
    // fbq not ready — enqueue with data and options kept separate
    fbqEventQueue.push({ event, data: cleanedData, options: fbqOptions })

    // Set up retry to flush queue when fbq becomes available
    if (!flushTimeout) {
      flushTimeout = setTimeout(() => {
        flushFbqQueue()
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
