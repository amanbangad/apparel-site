"use client"

import { Button } from "@/components/ui/button"
import { trackFbEvent } from "@/lib/analytics"
import { checkPixelStatus, initializePixel } from "@/lib/pixel-debug"

export default function PixelDebugButton() {
  const testPixel = () => {
    const isLoaded = checkPixelStatus()

    if (!isLoaded) {
      console.log("Attempting to initialize pixel manually...")
      initializePixel()

      setTimeout(() => {
        const nowLoaded = checkPixelStatus()
        if (nowLoaded) {
          console.log("Pixel initialized successfully, sending test event")
          trackFbEvent("DebugTest", { test_value: 123 })
        } else {
          console.error("Failed to initialize pixel")
        }
      }, 1000)
    } else {
      console.log("Pixel already loaded, sending test event")
      trackFbEvent("DebugTest", { test_value: 123 })
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button onClick={testPixel} variant="outline" size="sm">
        Test Pixel
      </Button>
    </div>
  )
}
