"use client"

import { useEffect } from "react"

export default function ResourcePreloader() {
  useEffect(() => {
    // Preload critical routes
    const criticalRoutes = ["/shop", "/categories", "/about"]

    criticalRoutes.forEach((route) => {
      const link = document.createElement("link")
      link.rel = "prefetch"
      link.href = route
      document.head.appendChild(link)
    })

    // Preload critical images
    const criticalImages = ["/placeholder.jpg", "/placeholder-logo.png"]

    criticalImages.forEach((src) => {
      const link = document.createElement("link")
      link.rel = "preload"
      link.as = "image"
      link.href = src
      document.head.appendChild(link)
    })

    // Preload fonts
    const fontLink = document.createElement("link")
    fontLink.rel = "preload"
    fontLink.as = "font"
    fontLink.type = "font/woff2"
    fontLink.href =
      "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
    fontLink.crossOrigin = "anonymous"
    document.head.appendChild(fontLink)
  }, [])

  return null
}
