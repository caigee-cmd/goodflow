"use client"

import { useState } from "react"
import { PRODUCTS } from "@/data"
import { featuredProducts } from "@/lib/catalog"
import { PlaceholderImage } from "@/components/media/placeholder-image"
import { useOpenAdvisor } from "@/components/brand/advisor-context"
import { useRfq } from "@/stores/rfq"

export function ArchiveRail({ onOpenProduct }: { onOpenProduct: (id: string) => void }) {
  const onAsk = useOpenAdvisor()
  const add = useRfq((state) => state.add)
  const featured = featuredProducts(PRODUCTS)
  const [selectedId, setSelectedId] = useState(featured[0]?.id ?? "")
  const selected = featured.find((item) => item.id === selectedId) ?? featured[0]

  return (
    <aside className="sticky top-24 w-[320px] shrink-0 self-start">
      <section className="rounded-[10px] bg-el-paper p-5">
        <h2 className="text-[11px] leading-4 font-semibold tracking-[0.16em] text-el-taupe-ink uppercase">Details</h2>
        <ul className="mt-4">
          {featured.map((item) => {
            const active = item.id === selected?.id
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(item.id)
                    onOpenProduct(item.id)
                  }}
                  aria-pressed={active}
                  className={
                    active
                      ? "-mx-2 flex w-[calc(100%+16px)] items-center gap-3 rounded-md bg-el-cream px-2 py-2 text-left"
                      : "-mx-2 flex w-[calc(100%+16px)] items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-el-cream"
                  }
                >
                  <span className="size-[72px] shrink-0 overflow-hidden rounded-md bg-el-cream">
                    <PlaceholderImage label={item.name} src={item.images[0]} className="text-[28px]" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] leading-5 tracking-[0.04em] uppercase">{item.name}</span>
                    <span className="mt-0.5 line-clamp-2 block text-[12px] leading-[18px] text-el-taupe-ink">{item.material}</span>
                    <span className="mt-0.5 block text-[12px] leading-[18px] text-el-taupe-ink">{item.size}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
        {selected ? (
          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={onAsk}
              className="flex h-11 items-center justify-center rounded-md bg-el-black text-[12px] font-semibold tracking-[0.12em] text-el-ivory uppercase"
            >
              Contact Sales
            </button>
            <button
              type="button"
              onClick={() => add([selected.id])}
              className="flex h-11 items-center justify-center rounded-md border border-el-line text-[12px] font-semibold tracking-[0.12em] uppercase"
            >
              Add to My Picks
            </button>
            <button
              type="button"
              className="flex h-11 items-center justify-center rounded-md border border-el-line text-[12px] font-semibold tracking-[0.12em] uppercase"
            >
              Download Intent PDF
            </button>
          </div>
        ) : null}
      </section>
    </aside>
  )
}
