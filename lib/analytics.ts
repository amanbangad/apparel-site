declare global {
  interface Window {
    fbq?: (action: string, event: string, data?: any) => void
  }
}

export const trackFbEvent = (event: string, data?: any) => {
  if (typeof window !== "undefined" && window.fbq) {
    try {
      window.fbq("track", event, data)
    } catch (error) {
      console.error("Facebook Pixel tracking error:", error)
    }
  }
}
