"use client"

import Image from "next/image"
import { useReducedMotion } from "motion/react"
import Floating, { FloatingElement } from "@/components/ui/parallax-floating"
import { cn } from "@/lib/utils"

type Item = {
  src: string
  depth: number
  pos: string
  w: number
  h?: number
  rotate: number
  card?: boolean
  far?: boolean
  mobile?: boolean
}

// 摆法 + 混入深色案例图（圆角卡片）
const ITEMS: Item[] = [
  { src: "/demo/cases/case-01/cover.jpg", depth: 1.8, pos: "top-[4%] left-[3%]", w: 220, h: 280, rotate: -7, card: true, mobile: true },
  { src: "/home-floating/cap.png", depth: 0.6, pos: "top-[8%] left-[22%]", w: 120, rotate: 6, far: true },
  { src: "/home-floating/mug.png", depth: 1, pos: "top-[4%] right-[20%]", w: 140, rotate: 5 },
  { src: "/demo/cases/case-03/cover.jpg", depth: 1.5, pos: "top-[20%] right-[3%]", w: 200, h: 250, rotate: 6, card: true, mobile: true },
  { src: "/home-floating/tumbler.png", depth: 0.8, pos: "bottom-[4%] left-[15%]", w: 130, rotate: -6 },
  { src: "/demo/cases/case-02/cover.jpg", depth: 1.2, pos: "bottom-[2%] right-[16%]", w: 170, h: 210, rotate: -4, card: true },
]

export function HomeFloatingImages() {
  const reduce = useReducedMotion()
  return (
    <Floating sensitivity={reduce ? 0 : -1} className="pointer-events-none left-1/2 w-[100vw] -translate-x-1/2 overflow-hidden">
      {ITEMS.map((it) => (
        <FloatingElement
          key={it.src}
          depth={it.depth}
          className={cn(it.pos, it.mobile ? "hidden sm:block" : "hidden lg:block")}
        >
          <div
            style={{ transform: `rotate(${it.rotate}deg)` }}
            className={cn(it.far && "opacity-60 blur-[1.5px]")}
          >
            <Image
              src={it.src}
              alt=""
              width={it.w * 2}
              height={(it.h ?? it.w) * 2}
              style={{ width: it.w, height: it.h ?? it.w }}
              className={
                it.card
                  ? "rounded-[14px] object-cover shadow-[0_24px_48px_rgb(20_20_40/0.28)] ring-1 ring-white/40"
                  : "object-contain drop-shadow-[0_18px_24px_rgb(120_90_50/0.22)]"
              }
            />
          </div>
        </FloatingElement>
      ))}
    </Floating>
  )
}
