"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

const ModalCloseContext = createContext<() => void>(() => {})

export function useModalClose() {
  return useContext(ModalCloseContext)
}

const EASE = [0.22, 1, 0.36, 1] as const

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
  const [open, setOpen] = useState(true)

  function close() {
    setOpen(false)
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <AnimatePresence onExitComplete={onClose}>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-el-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            onClick={close}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={label}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.32, ease: EASE }}
            className={`relative ${className}`}
            onClick={(event) => event.stopPropagation()}
          >
            <ModalCloseContext.Provider value={close}>{children}</ModalCloseContext.Provider>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
