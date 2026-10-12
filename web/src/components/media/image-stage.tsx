"use client"

import { AnimatePresence, motion } from "motion/react"
import { PlaceholderImage } from "@/components/media/placeholder-image"

const EASE = [0.22, 1, 0.36, 1] as const

export function ImageStage({
  label,
  seed,
  src,
  direction,
  className,
}: {
  label: string
  seed?: string
  src?: string
  direction: number
  className?: string
}) {
  const incoming = direction >= 0 ? 36 : -36

  return (
    <AnimatePresence initial={false} custom={direction}>
      <motion.div
        key={src ?? seed ?? label}
        custom={direction}
        initial={{ x: incoming, opacity: 0, scale: 1.035 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        exit={{ x: -incoming, opacity: 0, scale: 0.985 }}
        transition={{ duration: 0.48, ease: EASE }}
        className="absolute inset-0"
      >
        <PlaceholderImage label={label} seed={seed} src={src} className={className} />
      </motion.div>
    </AnimatePresence>
  )
}
