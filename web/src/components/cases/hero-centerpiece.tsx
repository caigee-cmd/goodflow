"use client"

import { useSyncExternalStore } from "react"
import dynamic from "next/dynamic"

// 首屏标题上方的品牌叶片：glass / particle 两种 Canvas UI 变体或 none
const LEAF = "/brand/leaf.svg"

function StaticLeaf() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={LEAF} alt="" aria-hidden className="h-full w-full object-contain p-10 opacity-90" />
}

// three.js 很重：只在支持时按需加载，且两个变体各自独立成 chunk
const GlassObject = dynamic(() => import("@/components/canvasui/GlassObject").then((m) => m.GlassObject), {
  ssr: false,
  loading: StaticLeaf,
})
const ParticleObject = dynamic(() => import("@/components/canvasui/ParticleObject").then((m) => m.ParticleObject), {
  ssr: false,
  loading: StaticLeaf,
})

type Variant = "glass" | "particle" | "none"

// 构建时通过 NEXT_PUBLIC_HERO_VARIANT 选择（glass | particle | none，默认 none），URL ?hero= 可覆盖
const parseVariant = (v: string | null | undefined): Variant | null =>
  v === "glass" || v === "particle" || v === "none" ? v : null
const BUILD_VARIANT: Variant = parseVariant(process.env.NEXT_PUBLIC_HERO_VARIANT) ?? "none"

let capable: boolean | undefined
/** 桌面（精确鼠标 + lg 以上）、未开启减少动态、WebGL2 可用 */
function detectCapable(): boolean {
  if (capable !== undefined) return capable
  capable = false
  try {
    if (!window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)").matches) return false
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false
    const gl = document.createElement("canvas").getContext("webgl2")
    if (!gl) return false
    gl.getExtension("WEBGL_lose_context")?.loseContext()
    capable = true
  } catch {
    capable = false
  }
  return capable
}

const noopSubscribe = () => () => {}
const readVariant = (): Variant =>
  parseVariant(new URLSearchParams(window.location.search).get("hero")) ?? BUILD_VARIANT

export function HeroCenterpiece() {
  const on = useSyncExternalStore(noopSubscribe, detectCapable, () => false)
  const variant = useSyncExternalStore(noopSubscribe, readVariant, () => BUILD_VARIANT)
  if (variant === "none") return null

  return (
    <div aria-hidden className="pointer-events-auto size-[220px] xl:size-[240px]">
      {!on ? (
        <StaticLeaf />
      ) : variant === "particle" ? (
        <ParticleObject
          key="particle"
          src={LEAF}
          className="h-full w-full"
          color="#C4A574"
          count={6000}
          size={2}
          sizeVariance={0.5}
          radius={70}
          strength={1.2}
          swirl={0.8}
          drift={0.5}
          scale={2.7}
          floatIntensity={0.6}
          rotationIntensity={0.5}
          floatSpeed={1.2}
          orbit={false}
          zoom={false}
        />
      ) : (
        <GlassObject
          key="glass"
          src={LEAF}
          className="h-full w-full"
          ior={1.6}
          thickness={2.5}
          roughness={0.08}
          dispersion={0.8}
          tint="#C4A574"
          tintDensity={0.9}
          depth={0.16}
          bevel={0.55}
          highlight="#E8D4B0"
          environmentIntensity={0.7}
          scale={2.7}
          floatIntensity={0.5}
          rotationIntensity={0.6}
          floatSpeed={1.1}
          orbit={false}
          zoom={false}
        />
      )}
    </div>
  )
}
