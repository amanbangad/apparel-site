import React from "react"
import { lazy } from "react"

// Lazy load heavy components
export const LazyProductQuickView = lazy(() => import("@/components/product-quick-view"))
export const LazyProductReviews = lazy(() => import("@/components/product-reviews"))
export const LazyRecentlyViewed = lazy(() => import("@/components/recently-viewed"))
export const LazyWishlistButton = lazy(() => import("@/components/wishlist-button"))

// Lazy load pages
export const LazyCheckoutPage = lazy(() => import("@/app/checkout/page"))
export const LazyWishlistPage = lazy(() => import("@/app/wishlist/page"))

// Create a higher-order component for lazy loading with suspense
export function withLazyLoading<T extends object>(Component: React.ComponentType<T>, fallback?: React.ReactNode) {
  return function LazyComponent(props: T) {
    return (
      <React.Suspense fallback={fallback || <div className="animate-pulse bg-muted h-32 rounded" />}>
        <Component {...props} />
      </React.Suspense>
    )
  }
}
