"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { trackFbEvent } from "@/lib/analytics"

export default function CheckoutPage() {
  const router = useRouter()
  const { items } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  // Calculate order totals
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 5.99
  const tax = subtotal * 0.08 // 8% tax rate
  const total = subtotal + shipping + tax

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Collect form data using the form reference
    if (!formRef.current) {
      console.error("Form reference is not available")
      return
    }

    const formData = new FormData(formRef.current)
    const checkoutDetails = {
      customer: {
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
      },
      shipping: {
        address: formData.get("address") as string,
        apartment: formData.get("apartment") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        zip: formData.get("zip") as string,
      },
      payment: {
        cardLast4: (formData.get("cardNumber") as string).slice(-4),
        cardType: "Credit Card",
      },
      order: {
        subtotal,
        shipping,
        tax,
        total,
        items: items.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
      },
    }

    // Save checkout details to localStorage
    localStorage.setItem("checkoutDetails", JSON.stringify(checkoutDetails))

    // Track checkout completion with microdata
    trackFbEvent("CompleteCheckout", {
      content_ids: items.map((item) => item.product.id),
      contents: items.map((item) => ({
        id: item.product.id,
        quantity: item.quantity,
        item_price: item.product.price,
      })),
      num_items: items.reduce((sum, item) => sum + item.quantity, 0),
      value: total,
      currency: "USD",
      // Add microdata for enhanced tracking
      content_category: "checkout",
      content_type: "product_group",
      delivery_category: shipping === 0 ? "free_shipping" : "standard_shipping",
      shipping_tier: shipping === 0 ? "Free Shipping" : "Standard Shipping",
      customer_info: {
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        first_name: formData.get("firstName") as string,
        last_name: formData.get("lastName") as string,
        address: {
          city: formData.get("city") as string,
          state: formData.get("state") as string,
          zip: formData.get("zip") as string,
          country: "US",
        },
      },
    })

    // Simulate processing and redirect to success page
    setTimeout(() => {
      router.push("/checkout/success")
    }, 1500)
  }

  // Redirect to cart if no items
  if (items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Add some items to your cart before proceeding to checkout.</p>
        <Button asChild>
          <Link href="/shop">Shop Now</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8" itemScope itemType="http://schema.org/CheckoutPage">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} ref={formRef}>
            {/* Contact Information */}
            <div className="border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="border rounded-lg p-6 mb-6" itemScope itemType="http://schema.org/PostalAddress">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                      itemProp="givenName"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                      itemProp="familyName"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                    itemProp="streetAddress"
                  />
                </div>
                <div>
                  <label htmlFor="apartment" className="block text-sm font-medium mb-1">
                    Apartment, suite, etc. (optional)
                  </label>
                  <input
                    type="text"
                    id="apartment"
                    name="apartment"
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                      itemProp="addressLocality"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                      itemProp="addressRegion"
                    />
                  </div>
                  <div>
                    <label htmlFor="zip" className="block text-sm font-medium mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      id="zip"
                      name="zip"
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                      itemProp="postalCode"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="border rounded-lg p-6 mb-6" itemScope itemType="http://schema.org/PaymentMethod">
              <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="expiration" className="block text-sm font-medium mb-1">
                      Expiration Date (MM/YY)
                    </label>
                    <input
                      type="text"
                      id="expiration"
                      name="expiration"
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      placeholder="123"
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="nameOnCard" className="block text-sm font-medium mb-1">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    id="nameOnCard"
                    name="nameOnCard"
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 lg:hidden">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : `Complete Order • $${total.toFixed(2)}`}
              </Button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="border rounded-lg p-6 sticky top-20" itemScope itemType="http://schema.org/Order">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            {/* Order Items */}
            <div className="space-y-4 mb-4">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}-${item.color}`}
                  className="flex items-start"
                  itemScope
                  itemType="http://schema.org/Product"
                >
                  <meta itemProp="id" content={item.product.id} />
                  <meta itemProp="sku" content={`MD-${item.product.id}`} />
                  
                  <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.image || ""}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      itemProp="image"
                    />
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground w-5 h-5 flex items-center justify-center rounded-full text-xs">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="font-medium text-sm" itemProp="name">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {item.size && `Size: ${item.size}`}
                      {item.size && item.color && " | "}
                      {item.color && `Color: ${item.color}`}
                    </p>
                    <p className="text-sm mt-1">
                      <span>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </p>
                    <div itemScope itemType="http://schema.org/Offer" itemProp="offers">
                      <meta itemProp="price" content={String(item.product.price)} />
                      <meta itemProp="priceCurrency" content="USD" />
                      <meta itemProp="itemCondition" content="http://schema.org/NewCondition" />
                      <meta itemProp="availability" content="http://schema.org/InStock" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t my-4 pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <meta itemProp="price" content={String(total)} />
                  <meta itemProp="priceCurrency" content="USD" />
                </div>
              </div>
            </div>

            <div className="mt-6 hidden lg:block">
              <Button type="submit" className="w-full" disabled={isSubmitting} onClick={handleSubmit}>
                {isSubmitting ? "Processing..." : "Complete Order"}
              </Button>
            </div>

            <div className="mt-4 text-center">
              <Link href="/cart" className="text-sm text-muted-foreground hover:text-foreground">
                Return to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

