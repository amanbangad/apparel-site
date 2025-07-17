"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

/**
 * A lightweight client-side preloader for routes, images and fonts
 * used frequently across the storefront. It waits 2 seconds so it
 * never blocks critical rendering, then injects <link> tags.
 */

const CRITICAL_ROUTES = ["/shop", "/categories", "/cart"]
const CRITICAL_IMAGES = [
  "https://www.american-giant.com/cdn/shop/products/W2-2P-1-WH_0605.jpg?v=1653598909",
  "https://s7d2.scene7.com/is/image/aeo/0116_6494_432_of?$pdp-m-opt$",
  "https://gwestblanks.com/cdn/shop/files/g-west-classic-comfort-oversized-hoodie-gwpchd430-681485.png?v=1735969093",
]
const FONT_URL = "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"

export default function ResourcePreloader() {
  const pathname = usePathname()

  useEffect(() => {
    const timer = setTimeout(() => {
      // Prefetch internal routes
      CRITICAL_ROUTES.forEach((route) => {
        if (route !== pathname) {
          const link = document.createElement("link")
          link.rel = "prefetch"
          link.href = route
          document.head.appendChild(link)
        }
      })

      // Preload frequently-shown product images
      CRITICAL_IMAGES.forEach((src) => {
        const link = document.createElement("link")
        link.rel = "preload"
        link.as = "image"
        link.href = src
        document.head.appendChild(link)
      })

      // Preload Inter font
      const fontLink = document.createElement("link")
      fontLink.rel = "preload"
      fontLink.as = "font"
      fontLink.type = "font/woff2"
      fontLink.href = FONT_URL
      fontLink.crossOrigin = "anonymous"
      document.head.appendChild(fontLink)
    }, 2000)

    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
