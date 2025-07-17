import HeroSection from "@/components/hero-section"
import ProductsSection from "@/components/featured-products"
import CategoryGrid from "@/components/category-grid"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <ProductsSection />
    </>
  )
}
