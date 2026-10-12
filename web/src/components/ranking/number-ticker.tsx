"use client"

import { useEffect, useState } from "react"

export function NumberTicker({ value }: { value: number }) {
  const [shown, setShown] = useState(value)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      setShown(value)
      return
    }
    const from = shown
    const start = performance.now()
    const duration = 700
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setShown(Math.round(from + (value - from) * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
    // Restart only when the target changes. Including `shown` would restart mid-count.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <span className="tabular-nums">{shown.toLocaleString("en-US")}</span>
}
