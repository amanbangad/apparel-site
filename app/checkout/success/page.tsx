"use client"

/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { trackFbEvent } from "@/lib/analytics"

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type CheckoutDetails = {
  customer: {
    email: string
    phone: string
    firstName: string
    lastName: string
  }
  shipping: {
    address: string
    apartment?: string
    city: string
    state: string
    zip: string
  }
  payment: {
    cardLast4: string
    cardType: string
  }
  order: {
    subtotal: number
    shipping: number
    tax: number
    total: number
    items: Array<{
      id: string
      name: string
      price: number
      quantity: number
      size?: string
      color?: string
    }>
  }
}

/** Extra field for fbq on the global window object */
type FbqWindow = Window & {
  fbq?: (...args: unknown[]) => void
}

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

export default function CheckoutSuccessPage() {
  const router = useRouter()

  /**
   * Grab cart items **once** so that we can still render them
   * after we clear the cart.
   */
  const { items: cartItems, clearCart } = useCart()
  const [items] = useState(cartItems) // snapshot – never changes

  /* -------------------------------------------------- */
  /* Order Totals                                       */
  /* -------------------------------------------------- */
  const subtotal = useMemo(() => items.reduce((sum, it) => sum + it.product.price * it.quantity, 0), [items])
  const shipping = subtotal > 50 ? 0 : 5.99
  const total = subtotal + shipping

  // Prefer the total saved in checkoutDetails (if present) so the UI reflects any
  // discounts, tax, etc. recorded at checkout time.
  const [checkoutDetails, setCheckoutDetails] = useState<CheckoutDetails | null>(null)
  const displayTotal = checkoutDetails?.order.total ?? total

  /* -------------------------------------------------- */
  /* Local State for IDs / Dates                        */
  /* -------------------------------------------------- */
  const [orderId, setOrderId] = useState<string | null>(null)
  const [orderDate, setOrderDate] = useState<string | null>(null)

  /* -------------------------------------------------------------------------- */
  /* One-time order processing (analytics, clear cart)                           */
  /* -------------------------------------------------------------------------- */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    /* ---------------------- Generate / read order meta --------------------- */
    let id = localStorage.getItem("orderId")
    let date = localStorage.getItem("orderDate")

    if (!id) {
      id = `ORD-${Math.floor(Math.random() * 1_000_000)}`
      localStorage.setItem("orderId", id)
    }
    if (!date) {
      date = new Date().toISOString()
      localStorage.setItem("orderDate", date)
    }

    setOrderId(id)
    setOrderDate(date)

    /* -------------------------- Stored checkout info ----------------------- */
    const stored = localStorage.getItem("checkoutDetails")
    if (stored) {
      try {
        setCheckoutDetails(JSON.parse(stored) as CheckoutDetails)
      } catch (err) {
        console.error("Failed to parse checkout details", err)
      }
    }

    /* ---------------------- Meta / Facebook Pixel event -------------------- */
    if (typeof window !== "undefined") {
      const w = window as FbqWindow
      w.fbq?.("track", "Purchase", {
        value: total,
        currency: "USD",
        items: items.map((item) => ({
          id: item.product.id,
          quantity: item.quantity,
          item_price: item.product.price,
        })),
        // Customer information for advanced matching
        em: checkoutDetails?.customer.email ? btoa(checkoutDetails.customer.email) : undefined,
        ph: checkoutDetails?.customer.phone ? btoa(checkoutDetails.customer.phone) : undefined,
        fn: checkoutDetails?.customer.firstName ? btoa(checkoutDetails.customer.firstName) : undefined,
        ln: checkoutDetails?.customer.lastName ? btoa(checkoutDetails.customer.lastName) : undefined,
        // Additional customer data
        customer_information: {
          email: checkoutDetails?.customer.email,
          phone: checkoutDetails?.customer.phone,
          first_name: checkoutDetails?.customer.firstName,
          last_name: checkoutDetails?.customer.lastName,
          shipping_address: {
            address: checkoutDetails?.shipping.address,
            city: checkoutDetails?.shipping.city,
            state: checkoutDetails?.shipping.state,
            zip: checkoutDetails?.shipping.zip,
          }
        }
      })
    }

    /* ---------------------- Internal analytics helper ---------------------- */
    trackFbEvent("Purchase", {
      value: total,
      currency: "USD",
      content_ids: items.map((i) => i.product.id),
      order_id: id,
      // Customer information for advanced matching
      em: checkoutDetails?.customer.email ? btoa(checkoutDetails.customer.email) : undefined,
      ph: checkoutDetails?.customer.phone ? btoa(checkoutDetails.customer.phone) : undefined,
      fn: checkoutDetails?.customer.firstName ? btoa(checkoutDetails.customer.firstName) : undefined,
      ln: checkoutDetails?.customer.lastName ? btoa(checkoutDetails.customer.lastName) : undefined,
      // Additional customer data
      customer_information: {
        email: checkoutDetails?.customer.email,
        phone: checkoutDetails?.customer.phone,
        first_name: checkoutDetails?.customer.firstName,
        last_name: checkoutDetails?.customer.lastName,
        shipping_address: {
          address: checkoutDetails?.shipping.address,
          city: checkoutDetails?.shipping.city,
          state: checkoutDetails?.shipping.state,
          zip: checkoutDetails?.shipping.zip,
        }
      }
    })

    /* -------------------------- Clear cart & cleanup ----------------------- */
    clearCart()
    localStorage.removeItem("checkoutDetails")
  }, []) // <-- runs exactly once on mount

  if (!orderId || !orderDate) return null

  /* -------------------------------------------------------------------------- */
  /* UI                                                                         */
  /* -------------------------------------------------------------------------- */
  return (
    <main className="container mx-auto max-w-2xl px-4 py-16" data-order-id={orderId} data-order-date={orderDate}>
      <header className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mb-2 text-3xl font-bold">Order Confirmed!</h1>
        <p className="text-muted-foreground">Thank you for your purchase. Your order is being processed.</p>
      </header>

      {/* Order details */}
      <section className="mb-8 rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-semibold">Order Details</h2>
        <InfoLine label="Order Number" value={orderId} />
        <InfoLine label="Date" value={new Date(orderDate).toLocaleDateString()} />
        <InfoLine label="Total" value={`$${displayTotal.toFixed(2)}`} />
      </section>

      {/* Items */}
      <section className="mb-8 rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-semibold">Items Ordered</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex justify-between">
              <span>{item.product.name}</span>
              <span>
                ${item.product.price.toFixed(2)} × {item.quantity}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
        <Button variant="outline" onClick={() => router.push("/")}>
          Back to Home
        </Button>
      </div>
    </main>
  )
}

/* -------------------------------------------------------------------------- */
/* Helper component                                                            */
/* -------------------------------------------------------------------------- */
function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
