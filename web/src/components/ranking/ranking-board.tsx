"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "motion/react"
import { DRINKWARE, METRICS } from "@/data"
import type { RankingItem, RankingMetric } from "@/lib/types"
import { cn } from "@/lib/utils"
import { RankingSkeleton } from "@/components/ui/skeleton"
import { NumberTicker } from "./number-ticker"
import { ProductDialog } from "@/components/products/product-dialog"
import { PlaceholderCup } from "./placeholder-cup"

const SPRING = { type: "spring" as const, stiffness: 260, damping: 30 }

type Slot = { x: number; y: number; width: number; rotate: number; z: number }

function slotFor(rank: number, width: number): Slot {
  const center = width / 2
  if (rank === 1) return { x: center - 150, y: 0, width: 300, rotate: 0, z: 30 }
  if (rank === 2) return { x: center - 440, y: 36, width: 250, rotate: -4, z: 20 }
  if (rank === 3) return { x: center + 190, y: 48, width: 240, rotate: 4, z: 10 }
  const column = width / 7
  const index = rank - 4
  return { x: index * column, y: 640, width: column - 16, rotate: 0, z: 1 }
}

function delta(item: RankingItem, rank: number) {
  if (item.searchHeatPrevRank == null) return { label: "NEW", tone: "text-el-gold-deep" }
  const change = item.searchHeatPrevRank - rank
  if (change > 0) return { label: `▲ ${change}`, tone: "text-el-gold-deep" }
  if (change < 0) return { label: `▼ ${Math.abs(change)}`, tone: "text-el-taupe" }
  return { label: "=", tone: "text-el-taupe-ink" }
}

export function RankingBoard({ initialMetric = "searchHeat" }: { initialMetric?: RankingMetric }) {
  const stage = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [metric, setMetric] = useState<RankingMetric>(initialMetric)
  const [hovered, setHovered] = useState<string | null>(null)
  const [productId, setProductId] = useState<string | null>(null)
  const unit = METRICS.find((entry) => entry.id === metric)!.unit
  const ranked = [...DRINKWARE.items].sort((a, b) => b.metrics[metric] - a.metrics[metric])
  const rankOf = new Map(ranked.map((item, index) => [item.id, index + 1]))

  useEffect(() => {
    const node = stage.current
    if (!node) return
    const measure = () => setWidth(node.clientWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const url = new URL(window.location.href)
    if (url.searchParams.get("metric") === metric) return
    url.searchParams.set("metric", metric)
    window.history.replaceState(null, "", url)
  }, [metric])

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[11px] leading-4 font-semibold tracking-[0.16em] text-el-taupe-ink uppercase">
            GoodFlow public data · {DRINKWARE.period}
          </p>
          <h1 className="mt-2 font-serif text-[40px] leading-[48px] font-normal">Ranking</h1>
          <p className="mt-2 text-[16px] leading-6 text-el-taupe-ink">{DRINKWARE.label} · This season</p>
        </div>
        <div className="flex h-10 rounded-md border border-el-line bg-el-paper p-0.5" role="tablist" aria-label="Metric">
          {METRICS.map((entry) => {
            const selected = entry.id === metric
            return (
              <button
                key={entry.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setMetric(entry.id)}
                className={cn(
                  "relative rounded-[5px] px-4 text-[12px] font-semibold tracking-[0.1em] uppercase",
                  selected ? "text-el-ivory" : "text-el-taupe-ink",
                )}
              >
                {selected ? (
                  <motion.span
                    layoutId="metric-pill"
                    className="absolute inset-0 rounded-[5px] bg-el-black"
                    transition={SPRING}
                  />
                ) : null}
                <span className="relative">{entry.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <p className="sr-only">Number one: {ranked[0]?.name}</p>

      <div ref={stage} className="relative mt-8 h-[1040px]">
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-1/2 h-[520px] w-[72%] -translate-x-1/2"
          style={{
            background: "radial-gradient(50% 70% at 50% 40%, rgb(196 165 116 / 0.18), transparent 72%)",
          }}
        />
        {width === 0 ? <RankingSkeleton /> : null}
        {width > 0
          ? DRINKWARE.items.map((item) => {
              const rank = rankOf.get(item.id) ?? 10
              const slot = slotFor(rank, width)
              const large = rank <= 3
              const hot = hovered === item.id
              const change = delta(item, rank)
              return (
                <motion.article
                  key={item.id}
                  role={item.productId ? "button" : undefined}
                  tabIndex={item.productId ? 0 : undefined}
                  onClick={() => item.productId && setProductId(item.productId)}
                  onKeyDown={(event) => {
                    if (!item.productId) return
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      setProductId(item.productId)
                    }
                  }}
                  className={item.productId ? "absolute top-0 left-0 cursor-pointer" : "absolute top-0 left-0"}
                  initial={false}
                  animate={{
                    x: slot.x,
                    y: hot ? slot.y - (large ? 12 : 6) : slot.y,
                    rotate: hot && rank > 1 ? 0 : slot.rotate,
                    opacity: hovered && !hot && large ? 0.7 : 1,
                  }}
                  transition={SPRING}
                  style={{ zIndex: hot ? 40 : slot.z, width: slot.width }}
                  onMouseEnter={() => setHovered(item.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div
                    className={cn(
                      "overflow-hidden rounded-lg bg-el-cream",
                      rank === 1 && "ring-2 ring-el-gold ring-offset-4 ring-offset-el-canvas",
                    )}
                  >
                    {rank === 1 ? (
                      <p className="px-3 pt-3 text-[11px] leading-4 font-semibold tracking-[0.16em] text-el-gold-deep uppercase">
                        No. 1
                      </p>
                    ) : null}
                    <div className="aspect-[4/5]">
                      <PlaceholderCup name={item.name} seed={item.id} src={item.image} />
                    </div>
                  </div>
                  <p
                    className={cn(
                      "mt-3 font-serif leading-none",
                      large ? "text-[56px]" : "text-[28px]",
                      rank === 1 ? "text-el-gold-deep" : "text-el-black",
                    )}
                  >
                    {String(rank).padStart(2, "0")}
                  </p>
                  <p className={cn("mt-2", large ? "text-[14px] leading-[22px]" : "line-clamp-2 text-[13px] leading-[18px]")}>
                    {item.name}
                  </p>
                  <p className={cn("mt-1", large ? "text-[20px] leading-6" : "text-[13px] leading-[18px]")}>
                    {large ? (
                      <NumberTicker key={`${item.id}-${metric}`} value={item.metrics[metric]} />
                    ) : (
                      <span className="tabular-nums">{item.metrics[metric].toLocaleString("en-US")}</span>
                    )}
                    {large ? (
                      <span className="ml-2 align-middle text-[11px] tracking-[0.14em] text-el-taupe-ink uppercase">
                        {unit}
                      </span>
                    ) : null}
                  </p>
                  {large && metric === "searchHeat" ? (
                    <p className={cn("mt-1 text-[12px] leading-[18px] font-medium", change.tone)}>{change.label}</p>
                  ) : null}
                </motion.article>
              )
            })
          : null}
      </div>

      <p className="text-[12px] leading-[18px] text-el-taupe-ink">
        Based on GoodFlow public & anonymized data ({DRINKWARE.period}). No Estée Lauder internal data is used.
      </p>
      {productId ? <ProductDialog id={productId} onClose={() => setProductId(null)} /> : null}
    </div>
  )
}
