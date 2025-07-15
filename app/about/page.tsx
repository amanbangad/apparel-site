import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SITE_NAME } from "@/lib/constants"

export default function AboutPage() {
  return (
    <div className="container py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Our Story</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover the journey behind Moo Deng, our beloved brand and mascot.
        </p>
      </div>

      {/* About the Brand */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h2 className="text-3xl font-bold mb-4">About {SITE_NAME}</h2>
          <p className="text-muted-foreground mb-4">
            Founded in 2020, Moo Deng was born from a passion for sustainable fashion and a desire to create apparel
            that doesn&apos;t compromise on style or ethics. We believe that clothing should be made to last, with materials
            that respect our planet.
          </p>
          <p className="text-muted-foreground mb-4">
            Our team of designers works tirelessly to create pieces that are both timeless and contemporary, ensuring
            that your wardrobe remains stylish season after season.
          </p>
          <p className="text-muted-foreground">
            Every item in our collection is crafted with attention to detail and a commitment to quality, because we
            believe that good fashion should feel as good as it looks.
          </p>
        </div>
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image
            src="https://animalfactguide.com/wp-content/uploads/2020/12/hippo.jpg"
            alt="Moo Deng studio"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Moo Deng Section */}
      <div className="bg-secondary rounded-xl p-8 md:p-12 mb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold mb-4">Meet Moo Deng</h2>
            <p className="text-muted-foreground mb-4">
              Moo Deng, our adorable hippo mascot, has become the heart and soul of our brand. With her charming pink
              hue and playful personality, she represents our brand&apos;s commitment to bringing joy and comfort to everyday
              fashion.
            </p>
            <p className="text-muted-foreground mb-4">
              Born in Thailand, Moo Deng (which translates to &quot;bouncy pig&quot; in Thai) quickly captured hearts worldwide
              with her cute appearance and gentle demeanor. She embodies our values of kindness, authenticity, and
              embracing one&apos;s unique style.
            </p>
            <p className="text-muted-foreground mb-6">
              Moo Deng inspires many of our designs, bringing playful elements and a touch of whimsy to our collections.
              Look for her signature motifs throughout our special edition pieces!
            </p>
            <Button asChild>
              <Link href="/shop">Shop Our Collection</Link>
            </Button>
          </div>
          <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden order-1 md:order-2">
            <Image
              src="https://i.natgeofe.com/n/51e55eeb-dfbe-4b43-9079-685ee97c449d/naturepl_01154678_2x3.jpg"
              alt="Moo Deng, the brand mascot"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
