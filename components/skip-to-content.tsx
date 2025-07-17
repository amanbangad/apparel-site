import { cn } from "@/lib/utils"

/**
 * Renders a visually-hidden “Skip to content” link that becomes visible
 * when focused, allowing keyboard users and screen-readers to jump
 * directly to the <main id="main-content"> element.
 *
 * Place <SkipToContent /> near the top of app/layout.tsx.
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className={cn(
        "sr-only",
        "absolute left-2 top-2 z-50 rounded bg-black px-4 py-2 text-white",
        "focus:not-sr-only focus:outline-none focus:ring focus:ring-white/50",
      )}
    >
      Skip to main content
    </a>
  )
}
