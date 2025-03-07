// Facebook Pixel tracking helper
export function trackFbEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== "undefined" && (window as any).fbq) {
    ;(window as any).fbq("track", eventName, params)
  }
}

