"use client"

import { useEffect } from "react"

type PreloadAsset = { href: string; as: "script" | "style" | "image" | "font" } | string // shorthand – infer `as` from extension

interface ResourcePreloaderProps {
  /**
   * List of assets to preload.
   * Provide either a string (the href, we’ll infer the type)
   * or an object with `{ href, as }` for full control.
   */
  assets?: PreloadAsset[]
}

/**
 * Injects `<link rel="preload">` tags into `<head>` for the supplied assets.
 * Called once on mount; does nothing on the server.
 */
export default function ResourcePreloader({ assets = [] }: ResourcePreloaderProps) {
  useEffect(() => {
    const links: HTMLLinkElement[] = []

    assets.forEach((asset) => {
      const href = typeof asset === "string" ? asset : asset.href
      const as = typeof asset === "string" ? guessAsType(href) : (asset.as ?? guessAsType(asset.href))

      if (!as) return

      // Skip if already present
      if (document.querySelector(`link[rel="preload"][href="${href}"]`)) return

      const link = document.createElement("link")
      link.rel = "preload"
      link.href = href
      link.as = as
      if (as === "font") link.crossOrigin = "anonymous"

      document.head.appendChild(link)
      links.push(link)
    })

    return () => {
      // Clean up on unmount (mostly useful in dev / Hot-Reload)
      links.forEach((l) => l.remove())
    }
  }, [assets])

  return null
}

/* -------------------------------------------------------------------------- */

function guessAsType(
  href: string,
): ResourcePreloaderProps["assets"][number] extends string ? never : "script" | "style" | "image" | "font" {
  if (href.endsWith(".js")) return "script"
  if (href.endsWith(".css")) return "style"
  if (href.match(/\.(png|jpg|jpeg|gif|webp|avif)$/)) return "image"
  if (href.match(/\.(woff2?|ttf|otf)$/)) return "font"
  return "script"
}
