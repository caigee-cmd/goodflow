"use client"

import { usePathname } from "next/navigation"
import { motion } from "motion/react"

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <motion.div
      key={pathname}
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
