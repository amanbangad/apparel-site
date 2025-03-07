"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getProductById } from "@/lib/data"
import AddToCartButton from "@/components/add-to-cart-button"
import WishlistButton from "@/components/wishlist-button"
import SizeGuide from "@/components/size-guide"
import ProductReviews from "@/components/product-reviews"
import RecentlyViewed from "@/components/recently-viewed"
import { trackFbEvent } from "@/lib/analytics"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductById(params.id)
  const [selectedSize, setSelectedSize] = useState<string>()
  const [selectedColor, setSelectedColor] = useState<string>()
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "reviews">("description")

  if (!product) {
    notFound()
  }

  // Track ViewContent event when the product page loads
  useEffect(() => {
    trackFbEvent("ViewContent", {
      content_name: product.name,
      content_ids: [product.id],
      content_type: "product",
      value: product.price,
      currency: "USD",
      content_category: product.category,
      availability: "in stock",
      brand: "Moo Deng",
    })
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
    <div className="container py-8" itemScope itemType="http://schema.org/Product">
      <meta itemProp="productID" content={product.id} />
      <meta itemProp="sku" content={`MD-${product.id}`} />
      <meta itemProp="brand" content="Moo Deng" />
      <meta itemProp="category" content={product.category} />
      <meta itemProp="id" content={product.id} />

      <div className="mb-4">
        <Link href="/shop" className="text-muted-foreground hover:text-foreground">
          ← Back to shop
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg border">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
            priority
            itemProp="image"
          />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2" itemProp="name">
            {product.name}
          </h1>
          <div itemScope itemType="http://schema.org/Offer" itemProp="offers">
            <p className="text-2xl font-semibold mb-4">
              ${product.price.toFixed(2)}
            </p>
            <meta itemProp="price" content={String(product.price)} />
            <meta itemProp="priceCurrency" content="USD" />
            <meta itemProp="itemCondition" content="http://schema.org/NewCondition" />
            <meta itemProp="availability" content="http://schema.org/InStock" />
            <meta itemProp="url" content={`https://apparel-ecomm-website.vercel.app/products/${product.id}`} />
            <meta itemProp="priceValidUntil" content={new Date(Date.now() + 31536000000).toISOString().split('T')[0]} />
          </div>
          <p className="text-muted-foreground mb-6" itemProp="description">
            {product.description}
          </p>

          {/* Size Selection */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Size</h3>
              <SizeGuide />
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  className="h-10 px-4"
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Color</h3>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <Button
                  key={color}
                  variant={selectedColor === color ? "default" : "outline"}
                  className="h-10 px-4"
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Quantity</h3>
            <div className="flex items-center">
              <Button variant="outline" className="h-10 w-10" onClick={decreaseQuantity}>
                -
              </Button>
              <span className="mx-4">{quantity}</span>
              <Button variant="outline" className="h-10 w-10" onClick={increaseQuantity}>
                +
              </Button>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4">
            <AddToCartButton product={product} selectedSize={selectedSize} selectedColor={selectedColor} />
            <WishlistButton product={product} />
          </div>

          {/* Additional Info */}
          <div className="mt-8 border-t pt-6">
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
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <div className="border-b">
          <div className="flex overflow-x-auto">
            <button
              className={`px-4 py-2 font-medium ${activeTab === "description" ? "border-b-2 border-primary" : "text-muted-foreground"}`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === "specifications" ? "border-b-2 border-primary" : "text-muted-foreground"}`}
              onClick={() => setActiveTab("specifications")}
            >
              Specifications
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === "reviews" ? "border-b-2 border-primary" : "text-muted-foreground"}`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews
            </button>
          </div>
        </div>

        {activeTab === "description" && (
          <div className="py-6">
            <p className="text-muted-foreground">
              {product.description} Our products are designed with sustainability in mind, using eco-friendly materials
              and ethical manufacturing processes. This item is perfect for everyday wear and can be easily styled for
              various occasions.
            </p>
            <ul className="list-disc list-inside mt-4 text-muted-foreground">
              <li>100% sustainable materials</li>
              <li>Ethically manufactured</li>
              <li>Machine washable</li>
              <li>Designed for comfort and durability</li>
            </ul>
          </div>
        )}

        {activeTab === "specifications" && (
          <div className="py-6">
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
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="py-6">
            <ProductReviews productId={product.id} />
          </div>
        )}
      </div>

      {/* Recently Viewed Products */}
      <RecentlyViewed currentProductId={product.id} />
    </div>
  )
}

