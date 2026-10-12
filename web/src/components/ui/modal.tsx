"use client"

import { motion } from "motion/react"

export function Modal({
  label,
  onClose,
  className,
  children,
}: {
  label: string
  onClose: () => void
  className: string
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-el-black/30 p-6" onClick={onClose}>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={className}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </motion.div>
    </div>
  )
}
