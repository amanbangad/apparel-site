"use client"

import { useEffect } from "react"
import { checkPixelStatus, initializePixel } from "@/lib/pixel-debug"

export default function PixelChecker() {
  useEffect(() => {
    // Check pixel status after a short delay to allow for normal initialization
    const timer = setTimeout(() => {
      const isPixelLoaded = checkPixelStatus()

      // If pixel is not loaded, try to initialize it manually
      if (!isPixelLoaded) {
        initializePixel()

        // Check again after initialization
        setTimeout(checkPixelStatus, 1000)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // This component doesn't render anything
  return null
}
