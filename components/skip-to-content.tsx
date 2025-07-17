"use client"

export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only absolute top-2 left-2 z-50 rounded bg-black px-4 py-2 text-white transition-transform focus:translate-y-0"
    >
      Skip to main content
    </a>
  )
}
