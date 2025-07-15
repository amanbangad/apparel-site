"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Wifi, RefreshCw } from "lucide-react"

export default function OfflinePage() {
  return (
    <div className="container py-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <Wifi className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-3xl font-bold mb-4">You&apos;re Offline</h1>
          <p className="text-muted-foreground mb-6">
            It looks like you&apos;ve lost your internet connection. Don&apos;t worry, you can still browse some of our cached
            content.
          </p>
        </div>

        <div className="space-y-4">
          <Button onClick={() => window.location.reload()} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>

          <div className="text-sm text-muted-foreground">
            <p>While offline, you can:</p>
            <ul className="mt-2 space-y-1">
              <li>• Browse previously viewed products</li>
              <li>• View your cart and wishlist</li>
              <li>• Read cached content</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <h2 className="font-semibold mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/shop">Shop</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/cart">Cart</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/categories">Categories</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
