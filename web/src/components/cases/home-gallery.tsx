"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Heart, Sparkles } from "lucide-react"
import { CASES } from "@/data"
import { sortCases } from "@/lib/catalog"
import type { Case, HomeChipId } from "@/lib/types"
import { PlaceholderImage } from "@/components/media/placeholder-image"
import { Button } from "@/components/ui/button"
import { CaseGridSkeleton } from "@/components/ui/skeleton"
import { useOpenAdvisor } from "@/components/brand/advisor-context"
import { LayoutGroup, motion } from "motion/react"
import { useSaved } from "@/stores/saved"
import { ArchiveRail } from "./archive-rail"
import { CaseDialog } from "./case-dialog"
import { ProductDialog } from "@/components/products/product-dialog"

const CHIPS: { id: HomeChipId | "all"; label: string }[] = [
  { id: "all", label: "Popular" },
  { id: "heritage", label: "Holiday" },
  { id: "elevated", label: "Beauty" },
  { id: "everyday", label: "Lifestyle" },
  { id: "collab", label: "Corporate" },
]

const CHIP_SPRING = { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.7 }

function CaseCard({ item, onOpen }: { item: Case; onOpen: (id: string) => void }) {
  const saved = useSaved((state) => state.caseIds.includes(item.id))
  const toggle = useSaved((state) => state.toggle)

  return (
    <motion.article
      layout
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group w-full rounded-[10px] border border-el-line bg-el-canvas p-1.5 text-left"
    >
      <button type="button" onClick={() => onOpen(item.id)} className="block w-full px-1 pt-1 pb-2 text-left">
        <p className="font-heading line-clamp-2 text-[18px] leading-6 font-medium tracking-[0.04em] uppercase">
          {item.title.replace(/[.]+$/g, "")}
        </p>
      </button>
      <div className="relative">
        <button type="button" onClick={() => onOpen(item.id)} aria-label={item.title} className="block w-full">
          <div className="relative overflow-hidden rounded-[8px] bg-el-cream" style={{ aspectRatio: item.coverAspect }}>
            <PlaceholderImage
              label={item.title}
              src={item.cover}
              className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
            />
          </div>
        </button>
        <button
          type="button"
          aria-label={saved ? `Remove ${item.title} from favorites` : `Save ${item.title}`}
          aria-pressed={saved}
          onClick={() => toggle(item.id)}
          className={
            saved
              ? "absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-el-paper/90"
              : "absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-el-paper/90 opacity-0 transition-opacity group-hover:opacity-100"
          }
        >
          <Heart className={saved ? "size-4 fill-el-gold text-el-gold-deep" : "size-4 text-el-black"} strokeWidth={1.5} />
        </button>
      </div>
    </motion.article>
  )
}

export function HomeGallery() {
  const onAsk = useOpenAdvisor()
  const board = useRef<HTMLDivElement>(null)
  const [columns, setColumns] = useState(3)
  const [chip, setChip] = useState<HomeChipId | "all">("all")
  const [loading, setLoading] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const [productId, setProductId] = useState<string | null>(null)
  const cases = useMemo(() => sortCases(CASES, chip), [chip])
  const lanes = Array.from({ length: columns }, () => [] as Case[])
  cases.forEach((item, index) => lanes[index % columns].push(item))

  useEffect(() => {
    const node = board.current
    if (!node) return
    const measure = () => setColumns(node.clientWidth < 720 ? 2 : 3)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <LayoutGroup id="home-filters">
          <div className="flex items-center gap-2" role="tablist" aria-label="Cases">
            {CHIPS.map((item) => {
              const selected = item.id === chip
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => {
                    if (item.id === chip) return
                    setChip(item.id)
                    setLoading(true)
                    window.setTimeout(() => setLoading(false), 700)
                  }}
                  className={
                    selected
                      ? "relative h-9 rounded-full px-4 text-[12px] font-semibold tracking-[0.1em] text-el-ivory uppercase"
                      : "relative h-9 rounded-full border border-el-line px-4 text-[12px] font-semibold tracking-[0.1em] text-el-black uppercase"
                  }
                >
                  {selected ? (
                    <motion.span
                      layoutId="home-chip"
                      className="absolute inset-0 rounded-full bg-el-black"
                      transition={CHIP_SPRING}
                    />
                  ) : null}
                  <span className="relative">{item.label}</span>
                </button>
              )
            })}
          </div>
        </LayoutGroup>
        <Button
          type="button"
          variant="outline"
          onClick={onAsk}
          className="h-9 rounded-full border-el-gold bg-transparent px-4 text-[12px] font-semibold tracking-[0.1em] text-el-gold-deep uppercase hover:bg-transparent hover:text-el-gold-deep"
        >
          <Sparkles className="size-3.5" strokeWidth={1.5} />
          Ask GoodFlow
        </Button>
      </div>

      <div className="mt-10 grid grid-cols-[minmax(0,1fr)_320px] items-start gap-10">
        <div className="relative min-w-0">
          <LayoutGroup>
            <div ref={board} className="flex gap-4" style={loading ? { visibility: "hidden" } : undefined}>
              {lanes.map((lane, index) => (
                <div key={index} className="flex min-w-0 flex-1 flex-col gap-4">
                  {lane.map((item) => (
                    <CaseCard key={item.id} item={item} onOpen={setOpenId} />
                  ))}
                </div>
              ))}
            </div>
          </LayoutGroup>
          {loading ? (
            <div className="absolute inset-0">
              <CaseGridSkeleton aspects={lanes.map((lane) => lane.map((item) => item.coverAspect))} />
            </div>
          ) : null}
        </div>
        <ArchiveRail onOpenProduct={setProductId} />
      </div>

      {openId ? <CaseDialog id={openId} onClose={() => setOpenId(null)} onOpenProduct={setProductId} /> : null}
      {productId ? <ProductDialog id={productId} onClose={() => setProductId(null)} /> : null}
    </>
  )
}
