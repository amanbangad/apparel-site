"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { fadeIn } from "@/lib/animations"

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div initial="hidden" animate="visible" exit="hidden" variants={fadeIn}>
      {children}
    </motion.div>
  )
}
