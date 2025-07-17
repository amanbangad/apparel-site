"use client"
import { categories, getFeaturedProducts } from "@/lib/data"
import HeroSection from "@/components/hero-section"
import FeaturedProducts from "@/components/featured-products"
import CategoryGrid from "@/components/category-grid"

export default function Home() {
  const featuredProducts = getFeaturedProducts()

  return (
    <div className="overflow-hidden">
      <HeroSection />
      <FeaturedProducts products={featuredProducts} />
      <CategoryGrid categories={categories} />
    </div>
  )
}
