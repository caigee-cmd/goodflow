"use client"

import { useSyncExternalStore } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useReducedMotion } from "motion/react"
import { caseById } from "@/data"
import { CaseUnder, CornerPeel } from "./corner-peel"

// Canvas UI Peel 只在支持时按需加载（WebGL + 实验性 HTML-in-Canvas），不进首屏包
const Peel = dynamic(() => import("@/components/canvasui/Peel").then((mod) => mod.Peel), {
  ssr: false,
  loading: () => null,
})

type HtmlCanvasProbe = HTMLCanvasElement & { requestPaint?: () => void }
type HtmlCanvasContextProbe = CanvasRenderingContext2D & { drawElementImage?: unknown }

let nativePeelSupport: boolean | undefined

/** 精确鼠标 + 未开启减少动态 + 实验性 drawElementImage/requestPaint + WebGL2 才走真正的 Peel */
function detectNativePeel(): boolean {
  if (nativePeelSupport !== undefined) return nativePeelSupport
  nativePeelSupport = false
  try {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return false
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false
    const probe = document.createElement("canvas") as HtmlCanvasProbe
    const ctx = probe.getContext("2d") as HtmlCanvasContextProbe | null
    if (!ctx || typeof ctx.drawElementImage !== "function" || typeof probe.requestPaint !== "function") return false
    const gl = document.createElement("canvas").getContext("webgl2")
    if (!gl) return false
    gl.getExtension("WEBGL_lose_context")?.loseContext()
    nativePeelSupport = true
  } catch {
    nativePeelSupport = false
  }
  return nativePeelSupport
}

const noopSubscribe = () => () => {}

export function HeroPeelCard({
  caseId,
  width,
  height,
  designWidth,
  onOpen,
}: {
  caseId: string
  /** CSS 尺寸（可含 min()/vw） */
  width: string
  height: string
  /** 1440 设计稿下的像素宽度，用于 Peel 的 px 参数 */
  designWidth: number
  onOpen: (id: string) => void
}) {
  const item = caseById(caseId)
  const reduce = useReducedMotion() ?? false
  const native = useSyncExternalStore(noopSubscribe, detectNativePeel, () => false)
  const underSrc = item.images[0] ?? item.items[0]?.image
  const under = underSrc ? <CaseUnder src={underSrc} label={item.title} client={item.client} /> : null
  const cover = (
    <Image
      src={item.cover}
      alt={item.title}
      fill
      preload
      sizes={`${designWidth}px`}
      className="object-cover"
    />
  )

  return (
    <button
      type="button"
      onClick={() => onOpen(caseId)}
      aria-label={`View case: ${item.title}`}
      className="pointer-events-auto relative block cursor-pointer rounded-[14px] shadow-[0_24px_48px_rgb(20_20_40/0.28)] ring-1 ring-white/40 outline-none focus-visible:ring-2 focus-visible:ring-el-gold"
      style={{ width, height }}
    >
      {native && under ? (
        <div className="absolute inset-0 overflow-hidden rounded-[14px] bg-el-cream">
          {/* 纹理准备好之前 Peel 输出为空，底下先垫一张静态封面 */}
          {cover}
          <Peel
            side="right"
            mode="hover"
            zone={designWidth + 120}
            reveal={Math.round(designWidth * 0.5)}
            // (reveal + curl) / curl < π，卷起部分不会整段翻到背面（照片背面镜像会很怪）
            curl={Math.round(designWidth * 0.24)}
            bow={10}
            bulge={10}
            shade={0.5}
            shine={0.6}
            perspective={900}
            smoothing={0.25}
            under={under}
            className="h-full w-full"
          >
            <div className="relative h-full w-full">{cover}</div>
          </Peel>
        </div>
      ) : (
        <CornerPeel
          enabled={!reduce && Boolean(under)}
          className="h-full w-full rounded-[14px] bg-el-cream"
          size="78cqw"
          under={under}
          cover={cover}
        />
      )}
    </button>
  )
}
