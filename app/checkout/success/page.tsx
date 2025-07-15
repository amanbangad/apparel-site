"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useRouter } from "next/navigation"
import { trackFbEvent } from "@/lib/analytics"

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

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const { items, clearCart } = useCart()
  const [orderId, setOrderId] = useState<string | null>(null)
  const [orderDate, setOrderDate] = useState<string | null>(null)
  const [checkoutDetails, setCheckoutDetails] = useState<CheckoutDetails | null>(null)

  // Calculate order total from items (fallback if checkout details aren't available)
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 5.99
  const total = subtotal + shipping

  /**
   * Handles post-purchase work (analytics + empty cart).
   * All referenced values are in the dependency list,
   * so ESLint’s `react-hooks/exhaustive-deps` rule is satisfied.
   */
  const handleOrderProcessing = useCallback(() => {
    // Only run on client
    let id = localStorage.getItem("orderId")
    let date = localStorage.getItem("orderDate")
    if (!id) {
      id = `ORD-${Math.floor(Math.random() * 1000000)}`
      localStorage.setItem("orderId", id)
    }
    if (!date) {
      date = new Date().toISOString()
      localStorage.setItem("orderDate", date)
    }
    setOrderId(id)
    setOrderDate(date)

    // Get checkout details from localStorage
    const storedDetails = localStorage.getItem("checkoutDetails")
    let details: CheckoutDetails | null = null
    if (storedDetails) {
      try {
        details = JSON.parse(storedDetails)
        setCheckoutDetails(details)
      } catch (error) {
        console.error("Failed to parse checkout details", error)
      }
    }

    // Example analytics call; wrap with safety check to satisfy eslint-no-unused-expr
    if (typeof window !== "undefined" && (window as any).fbq) {
      ;(window as any).fbq("track", "Purchase", {
        value: details?.order.total || total,
        currency: "USD",
        items:
          details?.order.items ||
          items.map((item) => ({
            id: item.product.id,
            quantity: item.quantity,
            item_price: item.product.price,
            name: item.product.name,
            category: item.product.category,
            variant: item.color || "",
            brand: "Moo Deng",
          })),
        shipping: details?.order.shipping || shipping,
      })
    }

    // Track Purchase event with enhanced details and microdata
    trackFbEvent("Purchase", {
      content_ids: items.map((item) => item.product.id),
      contents: items.map((item) => ({
        id: item.product.id,
        quantity: item.quantity,
        item_price: item.product.price,
        name: item.product.name,
        category: item.product.category,
        variant: item.color || "",
        brand: "Moo Deng",
      })),
      num_items: items.reduce((sum, item) => sum + item.quantity, 0),
      value: details?.order.total || total,
      currency: "USD",
      order_id: id,
      // Enhanced details for Meta Pixel with microdata
      content_type: "product_group",
      content_name: "Purchase Confirmation",
      shipping_tier: details?.order.shipping === 0 ? "Free Shipping" : "Standard Shipping",
      shipping_cost: details?.order.shipping || shipping,
      tax: details?.order.tax,
      customer_info: {
        email: details?.customer.email,
        phone: details?.customer.phone,
        first_name: details?.customer.firstName,
        last_name: details?.customer.lastName,
        address: {
          street: details?.shipping.address,
          city: details?.shipping.city,
          state: details?.shipping.state,
          zip: details?.shipping.zip,
          country: "US",
        },
      },
      payment_info: {
        method: details?.payment?.cardType || "Credit Card",
        last4: details?.payment?.cardLast4,
      },
      transaction_id: id,
      status: "completed",
    })

    // Empty the cart after successful purchase
    clearCart()

    // Clean up checkout details from localStorage
    localStorage.removeItem("checkoutDetails")
  }, [items, clearCart, shipping, total])

  useEffect(() => {
    handleOrderProcessing()
  }, [handleOrderProcessing])

  if (!orderId || !orderDate) return null

  return (
    <main className="container mx-auto max-w-lg px-4 py-20 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
        <CheckCircle className="h-8 w-8 text-primary" />
      </div>
      <h1 className="mb-4 text-4xl font-bold">Thank you for your purchase!</h1>
      <p className="mb-8 text-muted-foreground">
        Your order has been placed successfully. A confirmation email will arrive shortly.
      </p>

      <div className="border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order Number</span>
            <span className="font-medium" itemProp="orderNumber">
              {orderId}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date</span>
            <span itemProp="orderDate">{new Date(orderDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total</span>
            <span>${(checkoutDetails?.order.total || total).toFixed(2)}</span>
          </div>
          <meta itemProp="price" content={String(checkoutDetails?.order.total || total)} />
          <meta itemProp="priceCurrency" content="USD" />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment Method</span>
            <span itemProp="paymentMethod">
              {checkoutDetails?.payment?.cardType || "Credit Card"}
              {checkoutDetails?.payment?.cardLast4 ? ` (ending in ${checkoutDetails.payment.cardLast4})` : ""}
            </span>
          </div>
          {checkoutDetails?.customer.email && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span>{checkoutDetails.customer.email}</span>
            </div>
          )}
          {checkoutDetails?.shipping.address && (
            <div className="flex justify-between" itemScope itemType="http://schema.org/PostalAddress">
              <span className="text-muted-foreground">Shipping Address</span>
              <span className="text-right">
                <span itemProp="streetAddress">
                  {checkoutDetails.shipping.address}
                  {checkoutDetails.shipping.apartment && `, ${checkoutDetails.shipping.apartment}`}
                </span>
                <br />
                <span itemProp="addressLocality">{checkoutDetails.shipping.city}</span>,
                <span itemProp="addressRegion">{checkoutDetails.shipping.state}</span>
                <span itemProp="postalCode">{checkoutDetails.shipping.zip}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Order Items with Data Attributes */}
      <div className="border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Items Ordered</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.size}-${item.color}`}
              className="flex items-start border-b pb-4 last:border-0 last:pb-0"
              data-product-id={item.product.id}
              data-product-name={item.product.name}
              data-product-image={item.product.image}
              data-product-sku={`MD-${item.product.id}`}
            >
              <div className="flex-1">
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.size && `Size: ${item.size}`}
                  {item.size && item.color && " | "}
                  {item.color && `Color: ${item.color}`}
                </p>
                <div
                  data-offer-price={item.product.price}
                  data-offer-currency="USD"
                  data-offer-condition="NewCondition"
                  data-offer-availability="InStock"
                />
              </div>
              <div className="text-right">
                <p className="font-medium">
                  ${item.product.price.toFixed(2)} × {item.quantity}
                </p>
                <p className="font-bold">${(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={() => router.push("/")}>Continue shopping</Button>
    </main>
  )
}
