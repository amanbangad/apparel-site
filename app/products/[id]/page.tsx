"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Heart, Share2, ShoppingCart } from "lucide-react"
import { type Product, getProductById } from "@/lib/data"
import { useCart } from "@/context/cart-context"
import { trackFbEvent } from "@/lib/analytics"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductPage({ params }: any) {
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    const foundProduct = getProductById(params.id)
    if (!foundProduct) {
      notFound()
    }
    setProduct(foundProduct)

    // Set default selections
    if (foundProduct.sizes?.length) {
      setSelectedSize(foundProduct.sizes[0])
    }
    if (foundProduct.colors?.length) {
      setSelectedColor(foundProduct.colors[0])
    }
  }, [params.id])

  if (!product) {
    return <div>Loading...</div>
  }

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert("Please select a size")
      return
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      alert("Please select a color")
      return
    }

    addItem(product, 1, selectedSize, selectedColor)
    
    // Track AddToCart event
    trackFbEvent("AddToCart", {
      content_name: product.name,
      content_ids: [product.id],
      content_type: "product",
      value: product.price,
      currency: "USD",
      contents: [
        {
          id: product.id,
          quantity: 1,
          item_price: product.price,
          name: product.name,
          category: product.category,
          variant: selectedColor || "",
          brand: "Moo Deng",
          size: selectedSize || "",
        },
      ],
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.rating || 0}) • {Math.floor(Math.random() * 100) + 50} reviews
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold">${product.price}</span>
            {product.originalPrice && (
              <span className="text-xl text-muted-foreground line-through">${product.originalPrice}</span>
            )}
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Size</label>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Color</label>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <Button onClick={handleAddToCart} className="flex-1">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" size="icon" onClick={() => setIsWishlisted(!isWishlisted)}>
              <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Separator className="my-12" />

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-6">
          <div className="prose max-w-none">
            <p>{product.description}</p>
            <p>
              This premium {product.category} item is crafted with attention to detail and quality materials. Perfect
              for everyday wear or special occasions, it combines comfort with style.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="specifications" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Material</h4>
              <p className="text-muted-foreground">100% Premium Cotton</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Care Instructions</h4>
              <p className="text-muted-foreground">Machine wash cold, tumble dry low</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Origin</h4>
              <p className="text-muted-foreground">Made in USA</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Fit</h4>
              <p className="text-muted-foreground">True to size</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
