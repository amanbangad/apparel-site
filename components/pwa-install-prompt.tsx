"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

/**
 * The real `BeforeInstallPromptEvent` isn’t in the DOM lib, so we define
 * what we need here.
 */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    /* ----------------------------------------------------------- helpers -- */
    const checkIfInstalled = () => {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        // iOS Safari
        (window.navigator as unknown as { standalone?: boolean }).standalone === true
      if (isStandalone) setIsInstalled(true)
    }

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setDeferredPrompt(e)

      // delay the toast a little bit
      setTimeout(() => {
        if (!isInstalled && !localStorage.getItem("pwa-prompt-dismissed")) {
          setShowPrompt(true)
        }
      }, 10_000)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
    }

    /* ----------------------------------------------------------- effects -- */
    checkIfInstalled()

    // cast the listener so TS uses the `(type: string, listener: …)` overload
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener)
    window.addEventListener("appinstalled", handleAppInstalled as EventListener)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener)
      window.removeEventListener("appinstalled", handleAppInstalled as EventListener)
    }
  }, [isInstalled])

  /* ------------------------------------------------------------- actions -- */
  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    try {
      await deferredPrompt.prompt()
      await deferredPrompt.userChoice
    } finally {
      setDeferredPrompt(null)
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem("pwa-prompt-dismissed", "true")
  }

  /* ----------------------------------------------------------------  UI -- */
  if (isInstalled || !showPrompt) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
      >
        <div className="rounded-lg border bg-background p-4 shadow-lg">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center">
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Download className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Install StyleHub</h3>
                <p className="text-xs text-muted-foreground">Get the app experience</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleDismiss}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <p className="mb-4 text-sm text-muted-foreground">
            Install our app for faster loading, offline access, and a better shopping experience.
          </p>

          <div className="flex gap-2">
            <Button onClick={handleInstallClick} size="sm" className="flex-1">
              Install
            </Button>
            <Button variant="outline" size="sm" onClick={handleDismiss}>
              Not now
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
