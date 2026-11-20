"use client"

import Image from "next/image"
import { motion, useTransform, type MotionValue } from "motion/react"
import Floating, { FloatingElement } from "@/components/ui/parallax-floating"
import { cn } from "@/lib/utils"
import { caseById } from "@/data"

type Item = {
  src: string
  depth: number
  /** 图片中心点位置（视口百分比） */
  x: number
  y: number
  w: number
  h?: number
  rotate: number
  /** 深色案例卡片：hover 轻微放大，点击打开案例 */
  caseId?: string
  /** 固定卡片图，不跟随当前案例封面，也不打开案例 */
  card?: boolean
  far?: boolean
  mobile?: boolean
}

// 全屏摆法：深色案例卡片 + 产品 PNG 围绕中心标题分布
// 搜索框周围固定用换趋势案例之前的雅诗兰黛图和产品图，不跟随首页案例封面。
const ITEMS: Item[] = [
  { src: "/demo/hero/el-case-01.jpg", depth: 1.8, x: 10, y: 27, w: 230, h: 290, rotate: -7, mobile: true, card: true },
  { src: "/home-floating/cap.png", depth: 0.6, x: 29, y: 14, w: 120, rotate: 6, far: true },
  { src: "/home-floating/mug.png", depth: 1, x: 70, y: 13, w: 140, rotate: 5 },
  { src: "/demo/hero/el-case-04.jpg", depth: 1.5, x: 89, y: 30, w: 210, h: 260, rotate: 6, mobile: true, card: true },
  { src: "/home-floating/tote.png", depth: 1.1, x: 12, y: 76, w: 170, rotate: -5 },
  { src: "/home-floating/tumbler.png", depth: 0.8, x: 31, y: 85, w: 120, rotate: -6, far: true },
  { src: "/demo/hero/el-case-02.jpg", depth: 1.2, x: 72, y: 82, w: 180, h: 220, rotate: -4, card: true },
  { src: "/home-floating/notebook.png", depth: 0.9, x: 91, y: 75, w: 150, rotate: 7 },
]

function HeroCaseCard({ caseId, width, height, onOpen }: { caseId: string; width: string; height: string; onOpen: (id: string) => void }) {
  const item = caseById(caseId)
  return (
    <button
      type="button"
      onClick={() => onOpen(caseId)}
      aria-label={`View case: ${item.title}`}
      className="group pointer-events-auto relative block cursor-pointer overflow-hidden rounded-[14px] bg-el-cream shadow-[0_24px_48px_rgb(20_20_40/0.28)] ring-1 ring-white/40 outline-none focus-visible:ring-2 focus-visible:ring-el-gold"
      style={{ width, height }}
    >
      <Image
        src={item.cover}
        alt={item.title}
        fill
        preload
        sizes="240px"
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
      />
    </button>
  )
}

// 1440 设计宽度下的像素尺寸，窄屏按 vw 等比缩小
const size = (px: number) => `min(${px}px, ${(px / 14.4).toFixed(2)}vw)`

function FloatingItem({
  it,
  progress,
  reduce,
  onOpen,
}: {
  it: Item
  progress: MotionValue<number>
  reduce: boolean
  onOpen: (id: string) => void
}) {
  // 与中心的偏移决定扩散方向和距离（越靠边飞得越远）
  const dx = (it.x - 50) * 0.55
  const dy = (it.y - 50) * 0.75
  const x = useTransform(progress, [0, 1], ["0vw", reduce ? "0vw" : `${dx}vw`])
  const y = useTransform(progress, [0, 1], ["0vh", reduce ? "0vh" : `${dy}vh`])
  const scale = useTransform(progress, [0, 1], [1, reduce ? 1 : 1.2])
  const opacity = useTransform(progress, [0, 0.3, 0.95], [1, 1, reduce ? 1 : 0])
  const h = it.h ?? it.w

  return (
    <FloatingElement
      depth={it.depth}
      className={it.mobile ? "hidden sm:block" : "hidden lg:block"}
      style={{ left: `${it.x}%`, top: `${it.y}%` }}
    >
      {/* 居中锚点 → 滚动扩散层 → 旋转；与 FloatingElement 的鼠标视差 transform 分离 */}
      <div className="-translate-x-1/2 -translate-y-1/2">
        <motion.div style={{ x, y, scale, opacity }} className="will-change-transform">
          <div style={{ transform: `rotate(${it.rotate}deg)` }} className={cn(it.far && "opacity-60 blur-[1.5px]")}>
            {it.caseId ? (
              <HeroCaseCard caseId={it.caseId} width={size(it.w)} height={size(h)} onOpen={onOpen} />
            ) : it.card ? (
              <span
                aria-hidden
                className="relative block overflow-hidden rounded-[14px] bg-el-cream shadow-[0_24px_48px_rgb(20_20_40/0.28)] ring-1 ring-white/40"
                style={{ width: size(it.w), height: size(h) }}
              >
                <Image src={it.src} alt="" fill sizes="240px" className="object-cover" />
              </span>
            ) : (
              <Image
                src={it.src}
                alt=""
                aria-hidden
                width={it.w * 2}
                height={h * 2}
                style={{ width: size(it.w), height: size(h) }}
                className="object-contain drop-shadow-[0_18px_24px_rgb(120_90_50/0.22)]"
              />
            )}
          </div>
        </motion.div>
      </div>
    </FloatingElement>
  )
}

export function HomeFloatingImages({
  progress,
  reduce,
  onOpen,
}: {
  progress: MotionValue<number>
  reduce: boolean
  onOpen: (id: string) => void
}) {
  return (
    <Floating sensitivity={reduce ? 0 : -1} className="pointer-events-none">
      {ITEMS.map((it) => (
        <FloatingItem key={it.src} it={it} progress={progress} reduce={reduce} onOpen={onOpen} />
      ))}
    </Floating>
  )
}
