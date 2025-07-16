"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const checkIfInstalled = () => {
      // Hide prompt if the PWA is already installed
      // @ts-expect-error — non-standard navigator property
      if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone) {
        setShow(false)
      }
    }

    // --- listeners ----------------------------------------------------------
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // show prompt after slight delay so it doesn’t fight with page load
      setTimeout(() => setShow(true), 500)
    }

    const handleAppInstalled = () => {
      setShow(false)
      setDeferredPrompt(null)
    }

    // ------------------------------------------------------------------------
    checkIfInstalled()
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const install = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    setDeferredPrompt(null)
    setShow(false)
  }

  if (!show) return null

  return (
    <div className={cn("fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg border bg-card p-4 shadow-lg")}>
      <p className="mb-2 text-sm font-medium">Install our app for a faster, native-like experience</p>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => setShow(false)}>
          Not now
        </Button>
        <Button size="sm" onClick={install}>
          Install
        </Button>
      </div>
    </div>
  )
}
