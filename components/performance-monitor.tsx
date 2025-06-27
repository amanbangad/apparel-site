"use client"

import { useEffect } from "react"

interface PerformanceMetrics {
  fcp?: number // First Contentful Paint
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay
  cls?: number // Cumulative Layout Shift
  ttfb?: number // Time to First Byte
}

export default function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === "undefined") return

    const metrics: PerformanceMetrics = {}

    // Measure Core Web Vitals
    const measureWebVitals = () => {
      // First Contentful Paint
      const fcpEntry = performance.getEntriesByName("first-contentful-paint")[0] as PerformanceEntry
      if (fcpEntry) {
        metrics.fcp = fcpEntry.startTime
      }

      // Time to First Byte
      const navigationEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
      if (navigationEntry) {
        metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart
      }

      // Largest Contentful Paint
      if ("PerformanceObserver" in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries()
            const lastEntry = entries[entries.length - 1] as any
            if (lastEntry) {
              metrics.lcp = lastEntry.startTime
            }
          })
          lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] })

          // First Input Delay
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries()
            entries.forEach((entry: any) => {
              if (entry.name === "first-input") {
                metrics.fid = entry.processingStart - entry.startTime
              }
            })
          })
          fidObserver.observe({ entryTypes: ["first-input"] })

          // Cumulative Layout Shift
          let clsValue = 0
          const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries()
            entries.forEach((entry: any) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value
              }
            })
            metrics.cls = clsValue
          })
          clsObserver.observe({ entryTypes: ["layout-shift"] })

          // Send metrics after page load
          setTimeout(() => {
            sendMetrics(metrics)
          }, 5000)
        } catch (error) {
          console.warn("Performance monitoring not supported:", error)
        }
      }
    }

    // Send metrics to analytics
    const sendMetrics = (metrics: PerformanceMetrics) => {
      if (process.env.NODE_ENV === "development") {
        console.log("Performance Metrics:", metrics)

        // Log performance grades
        const grades = {
          fcp: metrics.fcp ? (metrics.fcp < 1800 ? "Good" : metrics.fcp < 3000 ? "Needs Improvement" : "Poor") : "N/A",
          lcp: metrics.lcp ? (metrics.lcp < 2500 ? "Good" : metrics.lcp < 4000 ? "Needs Improvement" : "Poor") : "N/A",
          fid: metrics.fid ? (metrics.fid < 100 ? "Good" : metrics.fid < 300 ? "Needs Improvement" : "Poor") : "N/A",
          cls: metrics.cls ? (metrics.cls < 0.1 ? "Good" : metrics.cls < 0.25 ? "Needs Improvement" : "Poor") : "N/A",
          ttfb: metrics.ttfb
            ? metrics.ttfb < 800
              ? "Good"
              : metrics.ttfb < 1800
                ? "Needs Improvement"
                : "Poor"
            : "N/A",
        }

        console.table(grades)
      }

      // In production, send to your analytics service
      if (typeof window.gtag !== "undefined") {
        Object.entries(metrics).forEach(([key, value]) => {
          if (value !== undefined) {
            window.gtag("event", "timing_complete", {
              name: key,
              value: Math.round(value),
            })
          }
        })
      }

      // Send to Facebook Pixel
      if (typeof window.fbq !== "undefined") {
        window.fbq("trackCustom", "PerformanceMetrics", metrics)
      }
    }

    // Start measuring when DOM is ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", measureWebVitals)
    } else {
      measureWebVitals()
    }

    // Cleanup
    return () => {
      document.removeEventListener("DOMContentLoaded", measureWebVitals)
    }
  }, [])

  return null // This component doesn't render anything
}
