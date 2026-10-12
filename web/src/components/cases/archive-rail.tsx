"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { PRODUCTS } from "@/data"
import { campaignShort, featuredProducts } from "@/lib/catalog"
import { PlaceholderImage } from "@/components/media/placeholder-image"
import { useSaved } from "@/stores/saved"

export function ArchiveRail({ onOpenProduct }: { onOpenProduct: (id: string) => void }) {
  const featured = featuredProducts(PRODUCTS)
  const count = useSaved((state) => state.caseIds.length + state.productIds.length)

  return (
    <aside className="sticky top-24 w-[320px] shrink-0 self-start">
      <section className="rounded-[10px] bg-el-paper p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[11px] leading-4 font-semibold tracking-[0.16em] text-el-taupe-ink uppercase">Details</h2>
          <Link
            href="/account"
            aria-label={count > 0 ? `Favorites, ${count} saved` : "Favorites"}
            className="group/fav inline-flex h-8 items-center gap-1.5 rounded-full border border-el-gold/70 bg-el-cream/40 px-2.5 text-el-gold-deep transition-colors hover:border-el-gold hover:bg-el-cream"
          >
            <Heart className="size-3.5 fill-el-gold text-el-gold-deep transition-transform group-hover/fav:scale-110" strokeWidth={1.5} />
            <span className="text-[11px] leading-none font-semibold tracking-[0.12em] uppercase">Favorites</span>
            {count > 0 ? (
              <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-el-gold px-1 text-[10px] leading-none font-semibold text-el-black tabular-nums">
                {count}
              </span>
            ) : null}
          </Link>
        </div>
        <ul className="mt-4">
          {featured.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onOpenProduct(item.id)}
                className="-mx-2 flex w-[calc(100%+16px)] items-center gap-3 rounded-[10px] px-2 py-2 text-left hover:bg-el-cream"
              >
                <span className="size-[72px] shrink-0 overflow-hidden rounded-[10px] bg-el-cream">
                  <PlaceholderImage label={item.name} src={item.images[0]} className="text-[28px]" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-heading text-[15px] leading-5 font-medium tracking-[0.04em] uppercase">
                    {item.name}
                  </span>
                  <span className="mt-1 block truncate text-[10px] leading-[14px] font-semibold tracking-[0.12em] text-el-gold-deep uppercase">
                    {campaignShort(item)}
                  </span>
                  <span className="mt-1 block truncate text-[12px] leading-[18px] text-el-taupe-ink">
                    {[item.material, item.size].filter(Boolean).join(" · ")}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  )
}
