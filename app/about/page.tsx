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
          Discover the journey behind StyleHub and our beloved mascot, Moo Deng.
        </p>
      </div>

      {/* About the Brand */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h2 className="text-3xl font-bold mb-4">About {SITE_NAME}</h2>
          <p className="text-muted-foreground mb-4">
            Founded in 2020, StyleHub was born from a passion for sustainable fashion and a desire to create apparel
            that doesn't compromise on style or ethics. We believe that clothing should be made to last, with materials
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
            alt="StyleHub studio"
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
              Moo Deng, our adorable hippo mascot, has become the heart and soul of StyleHub. With her charming pink hue
              and playful personality, she represents our brand's commitment to bringing joy and comfort to everyday
              fashion.
            </p>
            <p className="text-muted-foreground mb-4">
              Born in Thailand, Moo Deng (which translates to "bouncy pig" in Thai) quickly captured hearts worldwide
              with her cute appearance and gentle demeanor. She embodies our values of kindness, authenticity, and
              embracing one's unique style.
            </p>
            <p className="text-muted-foreground mb-6">
              Moo Deng inspires many of our designs, bringing playful elements and a touch of whimsy to our collections.
              Look for her signature motifs throughout our special edition pieces!
            </p>
            <Button asChild>
              <Link href="/categories/moo-deng-collection">Shop Moo Deng Collection</Link>
            </Button>
          </div>
          <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden order-1 md:order-2">
            <Image
              src="https://i.natgeofe.com/n/51e55eeb-dfbe-4b43-9079-685ee97c449d/naturepl_01154678_2x3.jpg"
              alt="Moo Deng, the StyleHub mascot"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-lg border">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <path d="M7 14.5s0 4 5 4 5-4 5-4"></path>
                <path d="M7 9h.01"></path>
                <path d="M17 9h.01"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Playfulness</h3>
            <p className="text-muted-foreground">
              Like Moo Deng, we believe fashion should be fun. We incorporate playful elements into our designs while
              maintaining sophistication.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
            <p className="text-muted-foreground">
              We're committed to ethical production and sustainable materials, ensuring our fashion doesn't come at the
              expense of our planet.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Inclusivity</h3>
            <p className="text-muted-foreground">
              Just as Moo Deng has won hearts worldwide, we design for everyone. Our clothing celebrates diversity in
              all its forms.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center">
              <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={`https://thumbs.dreamstime.com/b/unhappy-sad-developer-programmer-man-stress-coding-software-unhappy-sad-developer-programmer-man-stress-coding-software-348706138.jpg`}
                  alt={`Team member ${i}`}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-semibold">Team Member {i}</h3>
              <p className="text-muted-foreground">Position</p>
            </div>
          ))}
        </div>
      </div>

      {/* Moo Deng's Impact */}
      <div className="bg-muted p-8 rounded-xl mb-20">
        <h2 className="text-3xl font-bold mb-6 text-center">Moo Deng's Impact</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-3">Charity Initiatives</h3>
            <p className="text-muted-foreground mb-4">
              Inspired by Moo Deng's gentle nature, we donate 5% of profits from our Moo Deng collection to wildlife
              conservation efforts, with a special focus on protecting endangered hippo populations.
            </p>
            <p className="text-muted-foreground">
              Each purchase from this collection helps support these important conservation initiatives and spreads Moo
              Deng's message of kindness and care.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">Community Building</h3>
            <p className="text-muted-foreground mb-4">
              Moo Deng has helped us build a community of fashion enthusiasts who share our values. Our #MooDengStyle
              hashtag has created a space where customers can connect and share their StyleHub looks.
            </p>
            <p className="text-muted-foreground">
              Join our community events and Moo Deng meet-ups happening throughout the year in select locations!
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Join the {SITE_NAME} Family</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Become part of our story and discover apparel that combines style, comfort, and the playful spirit of Moo
          Deng.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/shop">Shop Now</Link>
          </Button>
          <Button variant="outline" size="lg">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

