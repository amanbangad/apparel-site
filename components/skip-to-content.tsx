"use client"

import type React from "react"

/**
 * A11y helper that lets keyboard and screen-reader users
 * jump directly to the main content of the page.
 */
export default function SkipToContent(): React.JSX.Element {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only absolute left-2 top-2 z-50 rounded bg-black px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
    >
      Skip to content
    </a>
  )
}
