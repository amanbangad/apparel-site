"use client"

import { useEffect } from "react"

/**
 * Pre-loads small but frequently re-used static assets
 * so they appear instantly when requested later.
 * Add new URLs to the `resources` array as needed.
 */
export default function ResourcePreloader(): null {
  useEffect(() => {
    const resources: string[] = [
      "/placeholder-user.jpg",
      "/placeholder.jpg",
      "/placeholder-logo.png",
      "/placeholder-logo.svg",
    ]

    resources.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [])

  return null
}
