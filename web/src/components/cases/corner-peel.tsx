"use client"

import type { CSSProperties, ReactNode } from "react"
import { ArrowUpRight } from "lucide-react"
import { motion, type Variants } from "motion/react"
import { PlaceholderImage } from "@/components/media/placeholder-image"
import { cn } from "@/lib/utils"

const PEEL_EASE = [0.22, 1, 0.36, 1] as const
// --t: 0 → 1 驱动卷角大小（相对容器宽度，cqw），只在鼠标 hover 时触发（motion 的 hover 手势会忽略触摸）
const PEEL: Variants = {
  rest: { "--t": 0, transition: { duration: 0.45, ease: PEEL_EASE } },
  peel: { "--t": 1, transition: { duration: 0.6, ease: PEEL_EASE } },
}

/** 卷角下露出的底层：案例下一张图 + 客户名 + VIEW CASE ↗ */
export function CaseUnder({ src, label, client }: { src: string; label: string; client: string }) {
  return (
    <div aria-hidden className="absolute inset-0 [container-type:inline-size]">
      <PlaceholderImage label={label} src={src} />
      <div className="absolute inset-0 bg-[linear-gradient(315deg,rgb(14_16_32/0.72)_0%,rgb(14_16_32/0.28)_32%,transparent_55%)]" />
      <div className="absolute right-3 bottom-3 text-right text-el-ivory">
        <p className="ml-auto max-w-[44cqw] truncate text-[10px] font-semibold tracking-[0.16em] text-el-gold uppercase">{client}</p>
        <p className="mt-1 inline-flex items-center gap-1 text-[12px] font-semibold tracking-[0.14em] uppercase">
          View case
          <ArrowUpRight className="size-3.5" strokeWidth={1.75} />
        </p>
      </div>
    </div>
  )
}

/**
 * 轻量 CSS/motion 卷角：hover 时封面沿 45° 折线从右下角翻起，露出 under。
 * enabled=false 时只渲染封面（减少动态效果 / 无底图时）。
 */
export function CornerPeel({
  cover,
  under,
  enabled,
  className,
  style,
  size = "82cqw",
}: {
  cover: ReactNode
  under?: ReactNode
  enabled: boolean
  className?: string
  style?: CSSProperties
  size?: string
}) {
  const peelSize = `calc(var(--t) * ${size})`
  return (
    <motion.div
      className={cn("relative overflow-hidden [container-type:inline-size]", className)}
      style={{ ...style, "--t": 0 } as CSSProperties}
      variants={enabled ? PEEL : undefined}
      initial="rest"
      animate="rest"
      whileHover={enabled ? "peel" : undefined}
    >
      {enabled ? under : null}
      {/* 封面：沿 45° 折线裁掉右下角 */}
      <div
        className="absolute inset-0"
        style={
          enabled
            ? { clipPath: `polygon(0 0, 100% 0, 100% calc(100% - ${peelSize}), calc(100% - ${peelSize}) 100%, 0 100%)` }
            : undefined
        }
      >
        {cover}
      </div>
      {enabled ? (
        <>
          {/* 卷起处投在底层上的阴影 */}
          <div
            aria-hidden
            className="pointer-events-none absolute right-0 bottom-0"
            style={{
              width: peelSize,
              height: peelSize,
              background:
                "linear-gradient(135deg, transparent 49.5%, rgb(10 10 25 / 0.38) 50%, rgb(10 10 25 / 0.12) 60%, transparent 74%)",
            }}
          />
          {/* 翻折过来的纸背（三角形），带高光与折痕暗部 */}
          <div
            aria-hidden
            className="pointer-events-none absolute right-0 bottom-0 drop-shadow-[-6px_-6px_10px_rgb(10_10_25/0.28)]"
            style={{ width: peelSize, height: peelSize }}
          >
            <div
              className="h-full w-full"
              style={{
                clipPath: "polygon(0 0, 100% 0, 0 100%)",
                borderTopLeftRadius: "28%",
                background: "linear-gradient(135deg, #fffdf8 0%, #f6efe2 18%, #e9dcc5 36%, #d2bf9f 46%, #b9a27c 50%)",
              }}
            />
          </div>
        </>
      ) : null}
    </motion.div>
  )
}
