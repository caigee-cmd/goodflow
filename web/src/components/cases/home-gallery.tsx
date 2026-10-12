"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Heart, Sparkles } from "lucide-react"
import { CASES, HOME_CHIPS } from "@/data"
import { sortCases } from "@/lib/catalog"
import type { Case, HomeChipId } from "@/lib/types"
import { PlaceholderImage } from "@/components/media/placeholder-image"
import { CaseGridSkeleton } from "@/components/ui/skeleton"
import { useOpenAdvisor } from "@/components/brand/advisor-context"
import { LayoutGroup, motion } from "motion/react"
import { useSaved } from "@/stores/saved"
import { ArchiveRail } from "./archive-rail"
import { CaseDialog } from "./case-dialog"
import { FavoritesDialog } from "@/components/account/favorites-dialog"
import { ProductDialog } from "@/components/products/product-dialog"

const CHIPS: { id: HomeChipId | "all"; label: string }[] = [
  { id: "all", label: "For You" },
  ...HOME_CHIPS.map((item) => ({ id: item.id, label: item.label })),
]

function CaseCard({
  item,
  onOpen,
}: {
  item: Case
  onOpen: (id: string) => void
}) {
  const saved = useSaved((state) => state.caseIds.includes(item.id))
  const toggle = useSaved((state) => state.toggle)

  return (
    <motion.article
      layout
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group w-full overflow-hidden rounded-lg bg-el-cream text-left"
    >
      <div className="relative">
        <button type="button" onClick={() => onOpen(item.id)} aria-label={item.title} className="block w-full">
          <div className="overflow-hidden" style={{ aspectRatio: item.coverAspect }}>
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
          className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-el-paper/90"
        >
          <Heart className={saved ? "size-4 fill-el-gold text-el-gold-deep" : "size-4 text-el-black"} strokeWidth={1.5} />
        </button>
      </div>
      <button type="button" onClick={() => onOpen(item.id)} className="block w-full px-3 pt-3 text-left">
        <p className="line-clamp-2 text-[14px] leading-5 tracking-[0.02em]">{item.title}</p>
        <p className="mt-1 line-clamp-2 text-[12px] leading-[18px] text-el-taupe-ink">{item.description}</p>
      </button>
      <div className="flex gap-2 overflow-x-auto px-3 pt-3 pb-3">
        {item.items.map((piece) => (
          <span key={piece.name} className="size-12 shrink-0 overflow-hidden rounded-md bg-el-paper">
            <PlaceholderImage label={piece.name} src={piece.image} className="text-[16px]" />
          </span>
        ))}
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
  const [favorites, setFavorites] = useState(false)
  const [productId, setProductId] = useState<string | null>(null)
  const savedCount = useSaved((state) => state.caseIds.length)
  const cases = useMemo(() => sortCases(CASES, chip), [chip])
  const lanes = Array.from({ length: columns }, () => [] as Case[])
  cases.forEach((item, index) => lanes[index % columns].push(item))

  useEffect(() => {
    const node = board.current
    if (!node) return
    const measure = () => setColumns(node.clientWidth < 640 ? 2 : 3)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {CHIPS.map((item) => {
          const selected = item.id === chip
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (item.id === chip) return
                setChip(item.id)
                setLoading(true)
                window.setTimeout(() => setLoading(false), 700)
              }}
              className={
                selected
                  ? "h-9 rounded-full bg-el-black px-4 text-[12px] font-semibold tracking-[0.1em] text-el-ivory uppercase"
                  : "h-9 rounded-full border border-el-line px-4 text-[12px] font-semibold tracking-[0.1em] text-el-black uppercase"
              }
            >
              {item.label}
            </button>
          )
        })}
        <button
          type="button"
          onClick={() => setFavorites(true)}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-el-line px-4 text-[12px] font-semibold tracking-[0.1em] text-el-black uppercase"
        >
          <Heart className="size-3.5" strokeWidth={1.5} />
          Favorites{savedCount > 0 ? ` ${savedCount}` : ""}
        </button>
        <button
          type="button"
          onClick={onAsk}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-el-gold px-4 text-[12px] font-semibold tracking-[0.1em] text-el-gold-deep uppercase"
        >
          <Sparkles className="size-3.5" strokeWidth={1.5} />
          Ask GoodFlow
        </button>
      </div>

      <div className="mt-10 grid grid-cols-[minmax(0,1fr)_320px] items-start gap-10">
        <div className="relative min-w-0">
          <LayoutGroup>
            <div ref={board} className="flex gap-6" style={loading ? { visibility: "hidden" } : undefined}>
              {lanes.map((lane, index) => (
                <div key={index} className="flex min-w-0 flex-1 flex-col gap-6">
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
      {favorites ? (
        <FavoritesDialog
          onClose={() => setFavorites(false)}
          onOpenCase={(id) => {
            setFavorites(false)
            setOpenId(id)
          }}
        />
      ) : null}
      {productId ? <ProductDialog id={productId} onClose={() => setProductId(null)} /> : null}
    </>
  )
}
