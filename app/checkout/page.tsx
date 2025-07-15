"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FormInput } from "@/components/ui/form-input"
import { useCart } from "@/context/cart-context"
import { trackFbEvent } from "@/lib/analytics"

export default function CheckoutPage() {
  const router = useRouter()
  const { items } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate totals
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 5.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  // Track InitiateCheckout event when page loads
  useEffect(() => {
    if (items.length > 0) {
      trackFbEvent("InitiateCheckout", {
        content_ids: items.map((item) => item.product.id),
        contents: items.map((item) => ({
          id: item.product.id,
          quantity: item.quantity,
          item_price: item.product.price,
          name: item.product.name,
          category: item.product.category,
          variant: item.color || "",
          brand: "Moo Deng",
          size: item.size || "",
        })),
        num_items: items.reduce((sum, item) => sum + item.quantity, 0),
        value: total,
        currency: "USD",
      })
    }
  }, [items, total])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    // Save to localStorage
    localStorage.setItem(
      "checkoutDetails",
      JSON.stringify({
        customer: {
          email: data.email,
          phone: data.phone,
          firstName: data.firstName,
          lastName: data.lastName,
        },
        shipping: {
          address: data.address,
          apartment: data.apartment,
          city: data.city,
          state: data.state,
          zip: data.zip,
        },
        order: { subtotal, shipping, tax, total, items },
      }),
    )

    // Track event
    trackFbEvent("InitiateCheckout", {
      content_ids: items.map((item) => item.product.id),
      contents: items.map((item) => ({
        id: item.product.id,
        quantity: item.quantity,
        item_price: item.product.price,
        name: item.product.name,
        category: item.product.category,
        variant: item.color || "",
        brand: "Moo Deng",
        size: item.size || "",
      })),
      num_items: items.reduce((sum, item) => sum + item.quantity, 0),
      value: total,
      currency: "USD",
    })

    setTimeout(() => router.push("/checkout/success"), 1500)
  }

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
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact */}
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Email" type="email" name="email" defaultValue="john.doe@example.com" required />
                <FormInput label="Phone" type="tel" name="phone" defaultValue="(555) 123-4567" required />
              </div>
            </div>

            {/* Shipping */}
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput label="First Name" name="firstName" defaultValue="John" required />
                  <FormInput label="Last Name" name="lastName" defaultValue="Doe" required />
                </div>
                <FormInput label="Street Address" name="address" defaultValue="123 Main Street" required />
                <FormInput label="Apartment (optional)" name="apartment" defaultValue="Apt 4B" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormInput label="City" name="city" defaultValue="New York" required />
                  <FormInput label="State" name="state" defaultValue="NY" required />
                  <FormInput label="ZIP Code" name="zip" defaultValue="10001" required />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
              <div className="space-y-4">
                <FormInput
                  label="Card Number"
                  name="cardNumber"
                  defaultValue="4532 1234 5678 9012"
                  placeholder="1234 5678 9012 3456"
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <FormInput
                      label="Expiration (MM/YY)"
                      name="expiration"
                      defaultValue="12/28"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <FormInput label="CVV" name="cvv" defaultValue="123" placeholder="123" required />
                </div>
                <FormInput label="Name on Card" name="nameOnCard" defaultValue="John Doe" required />
              </div>
            </div>

            <Button type="submit" className="w-full lg:hidden" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : `Complete Order • $${total.toFixed(2)}`}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="border rounded-lg p-6 sticky top-20">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-4 mb-4">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex items-start">
                  <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground w-5 h-5 flex items-center justify-center rounded-full text-xs">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="font-medium text-sm">{item.product.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`]
                        .filter(Boolean)
                        .join(" | ")}
                    </p>
                    <p className="text-sm mt-1">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
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
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-6 hidden lg:block"
              disabled={isSubmitting}
              onClick={(e) => {
                e.preventDefault()
                document.querySelector("form")?.requestSubmit()
              }}
            >
              {isSubmitting ? "Processing..." : "Complete Order"}
            </Button>

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
