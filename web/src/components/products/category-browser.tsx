"use client"

import { useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "motion/react"
import { ShoppingBag } from "lucide-react"
import { BRANDS, CATEGORIES, OCCASIONS, PRICE_OPTIONS, PRODUCTS } from "@/data"
import { filtersFromParams, paramsFromFilters } from "@/lib/category-query"
import { filterProducts, matches, sortProducts, type ProductFilters, type SortId } from "@/lib/filters"
import { fromLabel, occasionShort } from "@/lib/catalog"
import { hasPricing } from "@/lib/pricing"
import type { CategoryId, OccasionId, Product } from "@/lib/types"
import { PlaceholderImage } from "@/components/media/placeholder-image"
import { useRfq } from "@/stores/rfq"
import { ProductGridSkeleton } from "@/components/ui/skeleton"
import { ProductDialog } from "./product-dialog"

const SOURCES = [
  { id: "all", label: "All" },
  { id: "archive", label: "xBeauty Archive" },
  { id: "external", label: "External Picks" },
] as const

const SORTS: { id: SortId; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "clicks", label: "Most clicked" },
]

function countFor(key: "brands" | "categories" | "occasions", id: string, filters: ProductFilters) {
  const next = { ...filters, [key]: [id] }
  return PRODUCTS.filter((item) => matches(item, next)).length
}

function eyebrow(item: Product) {
  const brand = BRANDS.find((entry) => entry.id === item.brands[0])?.label ?? ""
  if (item.source === "archive") {
    return [brand, item.occasions[0] ? occasionShort(item.occasions[0]) : "", item.year].filter(Boolean).join(" · ")
  }
  return [item.maker ? `By ${item.maker}` : brand, item.theme].filter(Boolean).join(" · ")
}

export function CategoryBrowser({ query }: { query: string }) {
  const router = useRouter()
  const parsed = useMemo(() => filtersFromParams(new URLSearchParams(query)), [query])
  const { filters, sort } = parsed
  const [openId, setOpenId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const timer = useRef<number | null>(null)
  const add = useRfq((state) => state.add)
  const lines = useRfq((state) => state.lines)

  function apply(next: ProductFilters, nextSort = sort) {
    setLoading(true)
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setLoading(false), 700)
    const params = paramsFromFilters(next, nextSort)
    const search = params.toString()
    router.replace(search ? `/categories?${search}` : "/categories", { scroll: false })
  }

  function toggle<T extends string>(key: "brands" | "categories" | "occasions", id: T) {
    const current = filters[key] as string[]
    const value = current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    apply({ ...filters, [key]: value })
  }

  const visible = sortProducts(filterProducts(PRODUCTS, filters), sort)
  const anyArchive = PRODUCTS.some((item) => item.source === "archive")
  const anyPriced = PRODUCTS.some(hasPricing)
  const anyCategory = PRODUCTS.some((item) => item.category)
  const anyClicks = PRODUCTS.some((item) => (item.clicks ?? 0) > 0)
  const brandOptions = BRANDS.filter((item) => countFor("brands", item.id, { ...filters, brands: [] }))
  const occasionOptions = OCCASIONS.filter((item) => countFor("occasions", item.id, { ...filters, occasions: [] }))
  const sources = anyArchive ? SOURCES : SOURCES.filter((item) => item.id !== "archive")
  const sorts = SORTS.filter((item) => {
    if (item.id === "price-asc") return anyPriced
    if (item.id === "clicks") return anyClicks
    return true
  })

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-heading text-[40px] leading-[48px] font-normal">
            {filters.source === "archive" ? "Archive" : "Products"}
          </h1>
          <p className="mt-3 max-w-xl text-[14px] leading-[22px] text-el-taupe-ink">
            {filters.source === "archive"
              ? "Products this account has made before. Each one can be found, compared, and quoted again."
              : "Everything available for this account, including products made before and new recommendations."}
          </p>
        </div>
        {anyArchive ? (
        <div className="flex h-10 rounded-md border border-el-line bg-el-paper p-0.5" role="tablist" aria-label="Source">
          {sources.map((source) => {
            const selected = filters.source === source.id
            return (
              <button
                key={source.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => apply({ ...filters, source: source.id })}
                className={
                  selected
                    ? "rounded-[5px] bg-el-black px-4 text-[12px] font-semibold tracking-[0.08em] text-el-ivory uppercase"
                    : "px-4 text-[12px] font-semibold tracking-[0.08em] text-el-taupe-ink uppercase"
                }
              >
                {source.label}
              </button>
            )
          })}
        </div>
        ) : null}
      </header>

      <div className="mt-10 grid grid-cols-[240px_1fr] items-start gap-10">
        <aside className="sticky top-24">
          <button
            type="button"
            onClick={() => apply({ ...filters, brands: [], categories: [], occasions: [], maxPrice: null, q: undefined })}
            className="text-[13px] underline decoration-el-line underline-offset-4 hover:text-el-gold-deep"
          >
            Clear all
          </button>
          <FilterGroup title="Brands">
            {brandOptions.map((item) => (
              <FilterRow
                key={item.id}
                label={item.label}
                count={countFor("brands", item.id, filters)}
                checked={filters.brands.includes(item.id)}
                onChange={() => toggle("brands", item.id)}
              />
            ))}
          </FilterGroup>
          {anyCategory ? (
          <FilterGroup title="Category">
            {CATEGORIES.filter((item) => countFor("categories", item.id, { ...filters, categories: [] })).map((item) => (
              <FilterRow
                key={item.id}
                label={item.label}
                count={countFor("categories", item.id, filters)}
                checked={filters.categories.includes(item.id)}
                onChange={() => toggle("categories", item.id as CategoryId)}
              />
            ))}
          </FilterGroup>
          ) : null}
          {occasionOptions.length ? (
          <FilterGroup title="Occasion">
            {occasionOptions.map((item) => (
              <FilterRow
                key={item.id}
                label={item.label}
                count={countFor("occasions", item.id, filters)}
                checked={filters.occasions.includes(item.id)}
                onChange={() => toggle("occasions", item.id as OccasionId)}
              />
            ))}
          </FilterGroup>
          ) : null}
          {anyPriced ? (
          <FilterGroup title="Price per unit">
            {PRICE_OPTIONS.map((option) => (
              <FilterRow
                key={option.label}
                label={option.label}
                checked={filters.maxPrice === option.value}
                onChange={() => apply({ ...filters, maxPrice: option.value })}
              />
            ))}
          </FilterGroup>
          ) : null}
        </aside>

        <section>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {filters.brands.map((id) => (
              <FilterChip key={id} label={BRANDS.find((item) => item.id === id)?.label ?? id} onRemove={() => toggle("brands", id)} />
            ))}
            {filters.categories.map((id) => (
              <FilterChip key={id} label={CATEGORIES.find((item) => item.id === id)?.label ?? id} onRemove={() => toggle("categories", id)} />
            ))}
            {filters.occasions.map((id) => (
              <FilterChip key={id} label={OCCASIONS.find((item) => item.id === id)?.label ?? id} onRemove={() => toggle("occasions", id)} />
            ))}
            {filters.maxPrice != null ? (
              <FilterChip label={`Under $${filters.maxPrice}`} onRemove={() => apply({ ...filters, maxPrice: null })} />
            ) : null}
            <p className="ml-auto text-[13px] text-el-taupe-ink tabular-nums">{visible.length} items</p>
            <label className="text-[12px] text-el-taupe-ink">
              Sort
              <select
                value={sort}
                onChange={(event) => apply(filters, event.target.value as SortId)}
                className="ml-2 h-9 rounded-md border border-el-line bg-el-paper px-2 text-[13px] text-el-black"
              >
                {sorts.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {loading ? (
            <ProductGridSkeleton />
          ) : visible.length === 0 ? (
            <div className="py-16 text-center">
              <h2 className="font-heading text-[24px] leading-8">No items match these filters</h2>
              <p className="mt-2 text-[14px] text-el-taupe-ink">Try a wider brand, source, or price.</p>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(232px,1fr))] gap-6">
              <AnimatePresence mode="popLayout">
              {visible.map((item) => (
                <motion.div key={item.id} layout className="text-left">
                  <div className="group relative aspect-square overflow-hidden rounded-lg bg-el-cream">
                    <button type="button" onClick={() => setOpenId(item.id)} className="block h-full w-full" aria-label={item.name}>
                      <PlaceholderImage label={item.name} src={item.images[0]} />
                    </button>
                    <span
                      className={
                        item.source === "archive"
                          ? "pointer-events-none absolute top-3 left-3 inline-flex h-5 items-center rounded bg-el-black px-2 text-[10px] font-semibold tracking-[0.14em] text-el-gold uppercase"
                          : "pointer-events-none absolute top-3 left-3 inline-flex h-5 items-center rounded border border-el-line bg-el-paper px-2 text-[10px] font-semibold tracking-[0.14em] text-el-taupe-ink uppercase"
                      }
                    >
                      {item.source === "archive" ? "Archive" : "External"}
                    </span>
                    <button
                      type="button"
                      aria-label={`Add ${item.name} to RFQ`}
                      onClick={() => add([item.id])}
                      className="absolute right-3 bottom-3 flex size-9 items-center justify-center rounded-full bg-el-paper opacity-0 shadow-el-sm transition-opacity group-hover:opacity-100"
                    >
                      {lines.some((line) => line.productId === item.id) ? "✓" : <ShoppingBag className="size-4" strokeWidth={1.5} />}
                    </button>
                  </div>
                  <p className="mt-3 text-[11px] leading-4 font-semibold tracking-[0.12em] text-el-taupe-ink uppercase">
                    {eyebrow(item)}
                  </p>
                  <button type="button" onClick={() => setOpenId(item.id)} className="mt-1 block w-full truncate text-left text-[15px] leading-[22px]">
                    {item.name}
                  </button>
                  {fromLabel(item) ? (
                  <p className="mt-1 text-[13px] leading-5 tabular-nums text-el-taupe-ink">{fromLabel(item)}</p>
                  ) : null}
                </motion.div>
              ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </div>
      {openId ? <ProductDialog id={openId} onClose={() => setOpenId(null)} /> : null}
    </>
  )
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex h-8 items-center gap-2 rounded-full border border-el-line px-3 text-[12px]"
    >
      {label}
      <span aria-hidden>×</span>
    </button>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="mt-6">
      <legend className="text-[11px] leading-4 font-semibold tracking-[0.16em] text-el-taupe-ink uppercase">{title}</legend>
      <div className="mt-2">{children}</div>
    </fieldset>
  )
}

function FilterRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string
  count?: number
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="flex h-8 items-center gap-2 text-[13px]">
      <input type="checkbox" checked={checked} onChange={onChange} className="size-4 accent-el-black" />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {count != null ? <span className="text-[12px] tabular-nums text-el-taupe-ink">{count}</span> : null}
    </label>
  )
}
