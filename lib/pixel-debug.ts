// Debug helper for Facebook Pixel
export function checkPixelStatus() {
  if (typeof window === "undefined") return false

  console.log("Checking Facebook Pixel status...")

  if (window.fbq) {
    console.log("✅ Facebook Pixel is loaded and available")
    return true
  } else {
    console.warn("❌ Facebook Pixel is not available")
    return false
  }
}

// Function to manually initialize pixel if needed
export function initializePixel(pixelId = "614139101427697") {
  if (typeof window === "undefined") return false

  if (!window.fbq) {
    console.log("Manually initializing Facebook Pixel...")

    // Create fbq function if it doesn't exist
    window.fbq = (...args: any[]) => {
      // @ts-ignore
      window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, args) : window.fbq.queue.push(args)
    }

    // Initialize fbq
    if (!window._fbq) window._fbq = window.fbq
    window.fbq.push = window.fbq
    window.fbq.loaded = true
    window.fbq.version = "2.0"
    window.fbq.queue = []

    // Load the pixel script
    const script = document.createElement("script")
    script.async = true
    script.src = "https://connect.facebook.net/en_US/fbevents.js"
    document.head.appendChild(script)

    // Initialize the pixel
    window.fbq("init", pixelId)
    window.fbq("track", "PageView")

    return true
  }

  return false
}

// Add TypeScript declaration for fbq and _fbq
declare global {
  interface Window {
    fbq: any
    _fbq: any
  }
}
