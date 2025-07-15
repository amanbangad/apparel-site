"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { trackFbEvent } from "@/lib/analytics"
import { motion, AnimatePresence } from "framer-motion"
import PageTransition from "@/components/page-transition"
import { fadeIn, slideUp } from "@/lib/animations"

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
    <PageTransition>
      <div
        className="container py-8"
        data-item-list-name="Shopping Cart"
        data-item-list-order="Unordered"
        data-number-of-items={items.length}
      >
        <motion.h1 className="text-3xl font-bold mb-8" variants={fadeIn} initial="hidden" animate="visible">
          Your Cart
        </motion.h1>

        {items.length === 0 ? (
          <motion.div
            className="text-center py-12"
            variants={slideUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Looks like you haven&apos;t added anything to your cart yet.</p>
            <Button asChild className="transition-transform hover:scale-105">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <motion.div
              className="lg:col-span-2"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
            >
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
                    <AnimatePresence>
                      {items.map((item, index) => (
                        <motion.tr
                          key={`${item.product.id}-${item.size}-${item.color}`}
                          className="border-t"
                          data-item-id={item.product.id}
                          data-item-sku={`MD-${item.product.id}`}
                          data-item-position={index + 1}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <td className="p-4">
                            <div className="flex items-center">
                              <div className="relative w-16 h-16 mr-4 overflow-hidden rounded">
                                <Image
                                  src={item.product.image || ""}
                                  alt={item.product.name}
                                  fill
                                  className="object-cover transition-transform hover:scale-110 duration-300"
                                />
                              </div>
                              <div>
                                <h3 className="font-medium">{item.product.name}</h3>
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
                                className="h-8 w-8 transition-transform hover:scale-110"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="mx-2 w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 transition-transform hover:scale-110"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div data-price={item.product.price} data-currency="USD">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </div>
                          </td>
                          <td className="p-4">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.product.id)}
                              className="text-muted-foreground hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div variants={slideUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
              <div className="border rounded-lg p-6 shadow-sm" data-invoice-id={`cart-${Date.now()}`}>
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <motion.div
                    className="border-t my-4 pt-4"
                    initial={{ opacity: 0, scaleX: 0.9 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex justify-between font-semibold" data-total-price={total} data-currency="USD">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                  <Button className="w-full mb-4 transition-transform hover:scale-105" onClick={handleCheckout}>
                    Proceed to Checkout
                  </Button>

                  <div className="text-center">
                    <Link
                      href="/shop"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
