"use client"

import { motion } from "framer-motion"
import { Leaf, Shield, Truck, Heart } from "lucide-react"

const features = [
  {
    icon: Leaf,
    title: "Sustainable Materials",
    description: "All our products are made with eco-friendly materials and ethical manufacturing processes.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Shield,
    title: "Quality Guarantee",
    description: "We stand behind our products with a 100% satisfaction guarantee and easy returns.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Truck,
    title: "Fast Shipping",
    description: "Free shipping on orders over $50 and quick delivery to your doorstep.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Every piece is crafted with care and attention to detail by our passionate team.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
]

export default function FeatureCards() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/30">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose <span className="text-gradient">Moo Deng</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're committed to providing you with the best shopping experience
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, staggerChildren: 0.1 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <div className="relative p-8 rounded-2xl bg-card border border-border/50 shadow-lg card-hover">
                <div
                  className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
