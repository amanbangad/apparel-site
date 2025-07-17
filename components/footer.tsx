import Link from "next/link"
import { Heart } from "lucide-react"
import { SITE_NAME } from "@/lib/constants"

// Modern hippo icon component
const HippoIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C8.5 2 6 4.5 6 8c0 1.5.5 3 1.5 4L6 14c-.5.5-.5 1.5 0 2s1.5.5 2 0l1.5-1.5c1 .5 2.5.5 3.5.5s2.5 0 3.5-.5L18 16c.5.5 1.5.5 2 0s.5-1.5 0-2l-1.5-2c1-1 1.5-2.5 1.5-4 0-3.5-2.5-6-6-6zm-2 6c-.5 0-1-.5-1-1s.5-1 1-1 1 .5 1 1-.5 1-1 1zm4 0c-.5 0-1-.5-1-1s.5-1 1-1 1 .5 1 1-.5 1-1 1z" />
  </svg>
)

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-secondary/50 to-secondary border-t">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center shadow-lg">
                <HippoIcon className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold text-gradient">{SITE_NAME}</span>
            </div>
            <p className="text-muted-foreground">Your one-stop shop for modern essentials.</p>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/t-shirts"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link href="/categories/hoodies" className="text-muted-foreground hover:text-primary transition-colors">
                  Hoodies
                </Link>
              </li>
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center text-sm text-muted-foreground mb-4 md:mb-0">
              <span>
                © {new Date().getFullYear()} {SITE_NAME}. Made with
              </span>
              <Heart className="h-4 w-4 mx-1 text-primary" />
              <span>for Moo Deng fans everywhere.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
