"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Minus } from 'lucide-react'
import { useCart } from "@/context/cart-context"
import { trackFbEvent } from "@/lib/analytics"

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem } = useCart()

  const subtotal = items.reduce((total, item) => {
    return total + item.product.price * item.quantity
  }, 0)

  const shipping = subtotal > 50 ? 0 : 5.99
  const total = subtotal + shipping

  const handleCheckout = () => {
    // Track InitiateCheckout event
    trackFbEvent("InitiateCheckout", {
      content_ids: items.map((item) => item.product.id),
      contents: items.map((item) => ({
        id: item.product.id,
        quantity: item.quantity,
        item_price: item.product.price,
      })),
      num_items: items.reduce((sum, item) => sum + item.quantity, 0),
      value: total,
      currency: "USD",
    })

    // Navigate to checkout page
    router.push("/checkout")
  }

  return (
    <div className="container py-8" itemScope itemType="http://schema.org/ItemList">
      <meta itemProp="name" content="Shopping Cart" />
      <meta itemProp="itemListOrder" content="http://schema.org/ItemListUnordered" />
      <meta itemProp="numberOfItems" content={String(items.length)} />
      
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Button asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4">Product</th>
                    <th className="text-center p-4">Quantity</th>
                    <th className="text-right p-4">Price</th>
                    <th className="p-4 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={`${item.product.id}-${item.size}-${item.color}`} className="border-t" itemScope itemType="http://schema.org/Product" itemProp="itemListElement">
                      <meta itemProp="position" content={String(index + 1)} />
                      <meta itemProp="id" content={item.product.id} />
                      <meta itemProp="sku" content={`MD-${item.product.id}`} />
                      
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="relative w-16 h-16 mr-4">
                            <Image
                              src={item.product.image || ""}
                              alt={item.product.name}
                              fill
                              className="object-cover rounded"
                              itemProp="image"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium" itemProp="name">{item.product.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {item.size && `Size: ${item.size}`}
                              {item.size && item.color && " | "}
                              {item.color && `Color: ${item.color}`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="mx-2 w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div itemScope itemType="http://schema.org/Offer" itemProp="offers">
                          <meta itemProp="price" content={String(item.product.price)} />
                          <meta itemProp="priceCurrency" content="USD" />
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </td>
                      <td className="p-4">
                        <Button variant="ghost" size="icon" onClick={() => removeItem(item.product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="border rounded-lg p-6" itemScope itemType="http://schema.org/Invoice">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <meta itemProp="id" content={`cart-${Date.now()}`} />

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
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

              <Button className="w-full mb-4" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>

              <div className="text-center">
                <Link href="/shop" className="text-sm text-muted-foreground hover:text-foreground">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

