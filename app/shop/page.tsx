"use client"

import { useState, useMemo } from "react"
import { products } from "@/lib/data"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { COLOR_MAP } from "@/lib/constants"

const PRICE_RANGES = [
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25 to $50", min: 25, max: 50 },
  { label: "$50 to $100", min: 50, max: 100 },
  { label: "Over $100", min: 100, max: null },
]

const CATEGORIES = ["t-shirts", "pants", "hoodies", "shirts", "jackets", "sweaters"]
const ALL_SIZES = Array.from(new Set(products.flatMap((p) => p.sizes ?? []))).sort()
const ALL_COLORS = Array.from(new Set(products.flatMap((p) => p.colors ?? []))).sort()

export default function ShopPage() {
  const [filters, setFilters] = useState({
    category: null as string | null,
    priceRanges: [] as string[],
    sizes: [] as string[],
    colors: [] as string[],
    sort: "featured",
  })

  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Apply filters
    if (filters.category) {
      result = result.filter((p) => p.category === filters.category)
    }

    if (filters.priceRanges.length > 0) {
      result = result.filter((p) =>
        filters.priceRanges.some((rangeLabel) => {
          const range = PRICE_RANGES.find((r) => r.label === rangeLabel)
          if (!range) return false
          return range.max === null ? p.price >= range.min : p.price >= range.min && p.price < range.max
        }),
      )
    }

    if (filters.sizes.length > 0) {
      result = result.filter((p) => p.sizes?.some((size) => filters.sizes.includes(size)))
    }

    if (filters.colors.length > 0) {
      result = result.filter((p) => p.colors?.some((color) => filters.colors.includes(color)))
    }

    // Apply sorting
    switch (filters.sort) {
      case "price-low-high":
        return result.sort((a, b) => a.price - b.price)
      case "price-high-low":
        return result.sort((a, b) => b.price - a.price)
      case "newest":
        return result.reverse()
      default:
        return result
    }
  }, [filters])

  function updateFilter<K extends keyof typeof filters>(key: K, value: (typeof filters)[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const toggleArrayFilter = (key: "priceRanges" | "sizes" | "colors", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((item) => item !== value) : [...prev[key], value],
    }))
  }

  const clearFilters = () => {
    setFilters({ category: null, priceRanges: [], sizes: [], colors: [], sort: "featured" })
  }

  const hasFilters =
    filters.category || filters.priceRanges.length > 0 || filters.sizes.length > 0 || filters.colors.length > 0

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <div className="w-full md:w-64 shrink-0">
          <div className="sticky top-20 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">Filters</h2>
              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              )}
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-medium mb-2">Categories</h3>
              <div className="space-y-1">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    className={`text-sm w-full text-left p-1 rounded transition-colors ${
                      filters.category === category
                        ? "text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => updateFilter("category", filters.category === category ? null : category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <h3 className="font-medium mb-2">Price</h3>
              <div className="space-y-1">
                {PRICE_RANGES.map((range) => (
                  <label key={range.label} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={filters.priceRanges.includes(range.label)}
                      onChange={() => toggleArrayFilter("priceRanges", range.label)}
                    />
                    <span className="text-sm">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <h3 className="font-medium mb-2">Size</h3>
              <div className="space-y-1">
                {ALL_SIZES.map((size) => (
                  <label key={size} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={filters.sizes.includes(size)}
                      onChange={() => toggleArrayFilter("sizes", size)}
                    />
                    <span className="text-sm">{size}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <h3 className="font-medium mb-2">Color</h3>
              <div className="flex flex-wrap gap-2">
                {ALL_COLORS.map((color) => (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded-full border relative ${COLOR_MAP?.[color] || "bg-gray-300"} ${
                      filters.colors.includes(color) ? "border-primary ring-2 ring-primary/30" : "border-gray-300"
                    }`}
                    onClick={() => toggleArrayFilter("colors", color)}
                    title={color}
                  >
                    {filters.colors.includes(color) && (
                      <Check
                        size={14}
                        className={`absolute inset-0 m-auto ${color === "White" ? "text-black" : "text-white"}`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {filteredProducts.length} Product{filteredProducts.length !== 1 ? "s" : ""}
            </h1>
            <select
              className="border rounded-md p-2"
              value={filters.sort}
              onChange={(e) => updateFilter("sort", e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <h2 className="text-xl font-semibold mb-2">No products found</h2>
              <p className="text-muted-foreground mb-6">Try adjusting your filters.</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
