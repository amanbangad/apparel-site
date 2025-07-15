"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as unknown as { standalone?: boolean }).standalone === true) {
        setIsInstalled(true)
      }
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: unknown) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Show prompt after a delay
      setTimeout(() => {
        if (!isInstalled && !localStorage.getItem("pwa-prompt-dismissed")) {
          setShowPrompt(true)
        }
      }, 10000) // Show after 10 seconds
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
    }

    checkIfInstalled()
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [isInstalled])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === "accepted") {
        console.log("PWA installation accepted")
      } else {
        console.log("PWA installation dismissed")
      }

      setDeferredPrompt(null)
      setShowPrompt(false)
    } catch (error) {
      console.error("Error installing PWA:", error)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem("pwa-prompt-dismissed", "true")
  }

  if (isInstalled || !showPrompt) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
      >
        <div className="bg-background border rounded-lg shadow-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3">
                <Download className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Install StyleHub</h3>
                <p className="text-xs text-muted-foreground">Get the app experience</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleDismiss}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
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
