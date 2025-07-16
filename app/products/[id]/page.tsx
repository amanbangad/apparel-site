"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getProductById } from "@/lib/data"
import AddToCartButton from "@/components/add-to-cart-button"
import SizeGuide from "@/components/size-guide"
import RecentlyViewed from "@/components/recently-viewed"
import { trackFbEvent } from "@/lib/analytics"
import { motion } from "framer-motion"
import { fadeIn, slideUp } from "@/lib/animations"
import { Spinner } from "@/components/ui/spinner"
import PageTransition from "@/components/page-transition"
import { AnimatePresence } from "framer-motion"

export default function ProductPage({ params }: any) {
  const { id } = params
  const product = getProductById(id)
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes?.[0] || "")
  const [selectedColor, setSelectedColor] = useState<string>(product?.colors?.[0] || "")
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<"description" | "specifications">("description")
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  if (!product) {
    notFound()
  }

  // Track ViewContent event when the product page loads
  useEffect(() => {
    if (typeof window !== "undefined" && window.fbq) {
      trackFbEvent("ViewContent", {
        content_name: product.name,
        content_ids: [product.id],
        content_type: "product",
        value: product.price,
        currency: "USD",
      })
    }
  }, [product])

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  return (
    <PageTransition>
      <div
        className="container py-8"
        data-product-id={product.id}
        data-product-sku={`MD-${product.id}`}
        data-product-brand="Moo Deng"
        data-product-category={product.category}
      >
        <motion.div className="mb-4" variants={fadeIn} initial="hidden" animate="visible">
          <Link href="/shop" className="text-muted-foreground hover:text-foreground transition-colors">
            ← Back to shop
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <motion.div
            className="relative aspect-square overflow-hidden rounded-lg border"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <div
              className={`absolute inset-0 bg-muted flex items-center justify-center z-10 transition-opacity duration-500 ${isImageLoaded ? "opacity-0" : "opacity-100"}`}
            >
              <Spinner size="lg" />
            </div>
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className={`object-cover transition-opacity duration-500 ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
              priority
              onLoad={() => setIsImageLoaded(true)}
            />
          </motion.div>

          {/* Product Details */}
          <motion.div variants={slideUp} initial="hidden" animate="visible">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div
              data-offer-price={product.price}
              data-offer-currency="USD"
              data-offer-condition="NewCondition"
              data-offer-availability="InStock"
              data-offer-url={`https://apparel-ecomm-website.vercel.app/products/${product.id}`}
              data-offer-valid-until={new Date(Date.now() + 31536000000).toISOString().split("T")[0]}
            >
              <p className="text-2xl font-semibold mb-4">${product.price.toFixed(2)}</p>
            </div>
            <p className="text-muted-foreground mb-6">{product.description}</p>

            {/* Size Selection */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Size</h3>
                <SizeGuide />
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, index) => (
                  <motion.div
                    key={size}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Button
                      variant={selectedSize === size ? "default" : "outline"}
                      className="h-10 px-4 transition-transform hover:scale-105"
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Color Selection */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-medium mb-2">Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color, index) => (
                  <motion.div
                    key={color}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                  >
                    <Button
                      variant={selectedColor === color ? "default" : "outline"}
                      className="h-10 px-4 transition-transform hover:scale-105"
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quantity */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="font-medium mb-2">Quantity</h3>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  className="h-10 w-10 transition-transform hover:scale-105 bg-transparent"
                  onClick={decreaseQuantity}
                >
                  -
                </Button>
                <span className="mx-4 w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  className="h-10 w-10 transition-transform hover:scale-105 bg-transparent"
                  onClick={increaseQuantity}
                >
                  +
                </Button>
              </div>
            </motion.div>

            {/* Add to Cart */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <AddToCartButton product={product} selectedSize={selectedSize} selectedColor={selectedColor} />
            </motion.div>

            {/* Additional Info */}
            <motion.div
              className="mt-8 border-t pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="font-medium">Shipping</h3>
                  <p className="text-muted-foreground">Free shipping on orders over $50</p>
                </div>
                <div>
                  <h3 className="font-medium">Returns</h3>
                  <p className="text-muted-foreground">Free 30-day returns</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="border-b">
            <div className="flex overflow-x-auto">
              <button
                className={`px-4 py-2 font-medium transition-all ${activeTab === "description" ? "border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                className={`px-4 py-2 font-medium transition-all ${activeTab === "specifications" ? "border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setActiveTab("specifications")}
              >
                Specifications
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "description" && (
              <motion.div
                key="description"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="py-6"
              >
                <p className="text-muted-foreground">
                  {product.description} Our products are designed with sustainability in mind, using eco-friendly
                  materials and ethical manufacturing processes. This item is perfect for everyday wear and can be
                  easily styled for various occasions.
                </p>
                <ul className="list-disc list-inside mt-4 text-muted-foreground">
                  <li>100% sustainable materials</li>
                  <li>Ethically manufactured</li>
                  <li>Machine washable</li>
                  <li>Designed for comfort and durability</li>
                </ul>
              </motion.div>
            )}

            {activeTab === "specifications" && (
              <motion.div
                key="specifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="py-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Materials</h3>
                    <p className="text-muted-foreground">100% organic cotton</p>

                    <h3 className="font-medium mt-4 mb-2">Care Instructions</h3>
                    <ul className="list-disc list-inside text-muted-foreground">
                      <li>Machine wash cold</li>
                      <li>Tumble dry low</li>
                      <li>Do not bleach</li>
                      <li>Iron on low heat if needed</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Dimensions</h3>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 font-medium">Weight</td>
                          <td className="py-2 text-muted-foreground">0.3 kg</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 font-medium">Fabric Weight</td>
                          <td className="py-2 text-muted-foreground">180 gsm</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 font-medium">Country of Origin</td>
                          <td className="py-2 text-muted-foreground">Portugal</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium">SKU</td>
                          <td className="py-2 text-muted-foreground">
                            MD-{product.id}-{product.category}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Recently Viewed Products */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <RecentlyViewed currentProductId={product.id} />
        </motion.div>
      </div>
    </PageTransition>
  )
}
