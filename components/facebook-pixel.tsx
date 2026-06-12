'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    fbq: any
  }
}

interface FacebookPixelProps {
  pixelId: string
}

export default function FacebookPixel({ pixelId }: FacebookPixelProps) {
  const pathname = usePathname()

  useEffect(() => {
    // Load Facebook Pixel script only once
    if (typeof window !== 'undefined' && !window.fbq) {
      const script = document.createElement('script')
      script.async = true
      script.src = 'https://connect.facebook.net/en_US/fbevents.js'
      
      script.onload = () => {
        // Initialize pixel only after script loads
        if (window.fbq) {
          window.fbq('init', pixelId)
          window.fbq('track', 'PageView')
        }
      }
      
      document.head.appendChild(script)

      // Create the fbq stub if not already present
      if (!window.fbq) {
        window.fbq = function() {
          window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments)
        }
        window.fbq.push = window.fbq
        window.fbq.loaded = true
        window.fbq.version = '2.0'
        window.fbq.queue = []
      }
    }
  }, [pixelId])

  useEffect(() => {
    // Track page views on route changes
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView')
    }
  }, [pathname])

  return (
    <>
      {/* Facebook Pixel noscript fallback */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
} 
