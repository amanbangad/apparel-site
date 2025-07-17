"use client"

/**
 * Renders an accessible “Skip to main content” link.
 * It remains visually hidden until focused (e.g. via Tab key),
 * then appears in the top-left corner to let keyboard and screen-reader
 * users bypass repetitive navigation.
 */
export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="
        sr-only
        focus:not-sr-only focus:absolute focus:top-2 focus:left-2
        z-50 rounded bg-black px-4 py-2 text-white
      "
    >
      Skip to main content
    </a>
  )
}
