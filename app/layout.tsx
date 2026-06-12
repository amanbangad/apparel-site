import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import SkipToContent from "@/components/skip-to-content"
import { SITE_NAME } from "@/lib/constants"
import { CartProvider } from "@/context/cart-context"
import FacebookPixel from "@/components/facebook-pixel"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: `${SITE_NAME} | Modern Apparel`,
  description: "Find the latest fashion trends at StyleHub",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.fbq=function(){window.fbq.callMethod?window.fbq.callMethod.apply(window.fbq,arguments):window.fbq.queue.push(arguments)};
              window.fbq.push=window.fbq;
              window.fbq.loaded=!0;
              window.fbq.version='2.0';
              window.fbq.queue=[];
            `,
          }}
        />
        <FacebookPixel pixelId={process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID!} />
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <SkipToContent />
            <Navbar />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  )
}
