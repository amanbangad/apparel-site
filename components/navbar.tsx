"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { ShoppingCart, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SITE_NAME, ROUTES } from "@/lib/constants"
import { useCart } from "@/context/cart-context"
import { motion } from "framer-motion"

// Modern hippo icon component
const HippoIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C8.5 2 6 4.5 6 8c0 1.5.5 3 1.5 4L6 14c-.5.5-.5 1.5 0 2s1.5.5 2 0l1.5-1.5c1 .5 2.5.5 3.5.5s2.5 0 3.5-.5L18 16c.5.5 1.5.5 2 0s.5-1.5 0-2l-1.5-2c1-1 1.5-2.5 1.5-4 0-3.5-2.5-6-6-6zm-2 6c-.5 0-1-.5-1-1s.5-1 1-1 1 .5 1 1-.5 1-1 1zm4 0c-.5 0-1-.5-1-1s.5-1 1-1 1 .5 1 1-.5 1-1 1z" />
  </svg>
)

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { items } = useCart()

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const Badge = ({ count }: { count: number }) =>
    count > 0 ? (
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center font-medium"
      >
        {count > 99 ? "99+" : count}
      </motion.span>
    ) : null

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "glass-effect shadow-lg border-b"
          : "bg-background/80 backdrop-blur-sm border-b border-transparent",
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <button
            className="mr-2 md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <motion.div animate={{ rotate: isMenuOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.div>
          </button>

          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <HippoIcon className="text-white" size={20} />
            </motion.div>
            <span className="text-xl font-bold text-gradient group-hover:scale-105 transition-transform">
              {SITE_NAME}
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-1">
          {ROUTES.map((route, index) => (
            <motion.div
              key={route.href}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={route.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group",
                  pathname === route.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                )}
              >
                {route.label}
                {pathname === route.href && (
                  <motion.div
                    className="absolute bottom-0 left-1/2 w-1 h-1 bg-primary rounded-full"
                    layoutId="activeIndicator"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{ x: "-50%" }}
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative group">
              <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
              <Badge count={itemCount} />
            </Button>
          </Link>
        </div>
      </div>

      {isMenuOpen && (
        <motion.div
          className="md:hidden border-t glass-effect"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="space-y-1 px-4 pb-4 pt-2">
            {ROUTES.map((route, index) => (
              <motion.div
                key={route.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={route.href}
                  className={cn(
                    "block py-3 px-4 text-base font-medium rounded-lg transition-all",
                    pathname === route.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {route.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
