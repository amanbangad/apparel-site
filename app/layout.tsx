import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import SkipToContent from "@/components/skip-to-content"
import { SITE_NAME } from "@/lib/constants"
import { CartProvider } from "@/context/cart-context"

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
      <head>
        {/* Facebook Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', 'YOUR_PIXEL_ID_HERE');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID_HERE&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body className={inter.className}>
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
