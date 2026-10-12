"use client"

import { useEffect, useMemo, useState } from "react"
import { Heart } from "lucide-react"
import { CASES, PRODUCTS } from "@/data"
import { RFQ_HISTORY, rfqHistoryTotal, type RfqHistoryItem } from "@/data/estee-lauder/rfq-history"
import { brand } from "@/config/brand"
import { money } from "@/lib/dates"
import { cn } from "@/lib/utils"
import { useRfq } from "@/stores/rfq"
import { useSaved } from "@/stores/saved"
import { CaseDialog } from "@/components/cases/case-dialog"
import { ProductDialog } from "@/components/products/product-dialog"
import { PlaceholderImage } from "@/components/media/placeholder-image"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AccountCenterSkeleton } from "@/components/ui/skeleton"

type Tab = "favorites" | "history"

export function AccountCenter() {
  const [tab, setTab] = useState<Tab>("favorites")
  const [caseId, setCaseId] = useState<string | null>(null)
  const [productId, setProductId] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [paneReady, setPaneReady] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 700)
    return () => window.clearTimeout(timer)
  }, [])

  function openTab(next: Tab) {
    if (next === tab) return
    setTab(next)
    setPaneReady(false)
    window.setTimeout(() => setPaneReady(true), 650)
  }

  if (!ready) return <AccountCenterSkeleton />

  return (
    <>
      <div className="grid w-full grid-cols-[280px_minmax(0,1fr)] items-start gap-6">
        <aside className="flex h-[min(640px,calc(100svh-13rem))] flex-col rounded-2xl bg-el-cream px-3 py-6">
          <div className="px-2">
            <p className="text-[11px] leading-4 font-semibold tracking-[0.16em] text-el-taupe-ink uppercase">Account center</p>
            <div className="mt-4 flex items-center gap-3">
              <Avatar className="size-12 shadow-el-sm">
                <AvatarFallback className="bg-[linear-gradient(145deg,#e8d4b0_0%,#c4a574_46%,#8c6b3e_100%)] font-heading text-[16px] tracking-[0.04em] text-el-black">
                  {brand.user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-heading text-[22px] leading-7">{brand.user.name}</p>
                <p className="mt-0.5 text-[12px] text-el-taupe-ink">{brand.user.email}</p>
              </div>
            </div>
            <p className="mt-3 text-[13px] leading-5 text-el-taupe-ink">{brand.user.title}</p>
          </div>
          <nav className="mt-8 flex flex-col gap-0.5">
            <TabButton active={tab === "favorites"} onClick={() => openTab("favorites")}>
              Favorites
            </TabButton>
            <TabButton active={tab === "history"} onClick={() => openTab("history")}>
              History RFQ
            </TabButton>
          </nav>
        </aside>
        <div className="min-w-0">
          {paneReady ? (
            tab === "favorites" ? <FavoritesPane onOpenCase={setCaseId} onOpenProduct={setProductId} /> : <HistoryPane />
          ) : (
            <PaneSkeleton />
          )}
        </div>
      </div>
      {caseId ? <CaseDialog id={caseId} onClose={() => setCaseId(null)} /> : null}
      {productId ? <ProductDialog id={productId} onClose={() => setProductId(null)} /> : null}
    </>
  )
}

function PaneSkeleton() {
  return (
    <div aria-hidden>
      <div className="h-3 w-20 rounded-md bg-el-cream el-shimmer" />
      <div className="mt-3 h-8 w-48 rounded-md bg-el-cream el-shimmer" />
      <div className="mt-8 grid grid-cols-[240px_minmax(0,1fr)] gap-8">
        <div className="space-y-3">
          {[0, 1, 2].map((row) => (
            <div key={row} className="h-12 rounded-md bg-el-cream el-shimmer" style={{ animationDelay: `${row * 80}ms` }} />
          ))}
        </div>
        <div className="h-72 rounded-[10px] bg-el-cream el-shimmer" />
      </div>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-[10px] px-3 py-2 text-left text-[13px] transition-colors",
        active
          ? "bg-el-paper font-medium text-el-black shadow-[0_1px_1px_rgb(26_20_16/0.05),0_0_0_0.5px_rgb(26_20_16/0.06)]"
          : "text-el-taupe-ink hover:bg-el-paper/55 hover:text-el-black",
      )}
    >
      {children}
    </button>
  )
}

function FavoritesPane({
  onOpenCase,
  onOpenProduct,
}: {
  onOpenCase: (id: string) => void
  onOpenProduct: (id: string) => void
}) {
  const ids = useSaved((state) => state.caseIds)
  const productIds = useSaved((state) => state.productIds)
  const toggle = useSaved((state) => state.toggle)
  const toggleProduct = useSaved((state) => state.toggleProduct)
  const saved = ids.map((id) => CASES.find((item) => item.id === id)).filter((item) => item != null)
  const savedProducts = productIds.map((id) => PRODUCTS.find((item) => item.id === id)).filter((item) => item != null)

  return (
    <>
      {saved.length === 0 && savedProducts.length === 0 ? (
        <section className="flex h-[min(640px,calc(100svh-13rem))] flex-col items-center justify-center rounded-2xl bg-el-paper px-10 text-center">
          <Heart className="size-5 text-el-gold-deep" strokeWidth={1.5} />
          <p className="mt-5 text-[11px] leading-4 font-semibold tracking-[0.16em] text-el-taupe-ink uppercase">Favorites</p>
          <h2 className="mt-2 font-heading text-[28px] leading-9">Nothing saved yet</h2>
          <p className="mt-2 max-w-[280px] text-[13px] leading-5 text-el-taupe-ink">
            Tap the heart on a case or product to keep it here.
          </p>
        </section>
      ) : (
        <>
          <p className="text-[11px] leading-4 font-semibold tracking-[0.16em] text-el-taupe-ink uppercase">Favorites</p>
          <h2 className="mt-2 font-heading text-[32px] leading-10">Saved</h2>
          {saved.length ? <p className="mt-8 text-[11px] leading-4 font-semibold tracking-[0.16em] text-el-taupe-ink uppercase">Cases</p> : null}
          <ul className="mt-4 grid grid-cols-2 gap-4">
            {saved.map((item) => (
              <li key={item.id} className="flex gap-3 rounded-lg bg-el-paper p-3">
                <button type="button" onClick={() => onOpenCase(item.id)} className="size-24 shrink-0 overflow-hidden rounded-md bg-el-cream">
                  <PlaceholderImage label={item.title} src={item.cover} className="text-[28px]" />
                </button>
                <div className="min-w-0 flex-1">
                  <button type="button" onClick={() => onOpenCase(item.id)} className="line-clamp-2 text-left text-[14px] leading-5">
                    {item.title}
                  </button>
                  <p className="mt-1 text-[12px] text-el-taupe-ink">{item.client}</p>
                  <button
                    type="button"
                    onClick={() => toggle(item.id)}
                    className="mt-3 inline-flex items-center gap-1 text-[12px] text-el-taupe-ink hover:text-el-black"
                  >
                    <Heart className="size-3.5 fill-el-gold text-el-gold-deep" strokeWidth={1.5} />
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {savedProducts.length ? (
            <>
              <p className="mt-8 text-[11px] leading-4 font-semibold tracking-[0.16em] text-el-taupe-ink uppercase">Products</p>
              <ul className="mt-4 grid grid-cols-2 gap-4">
                {savedProducts.map((item) => (
                  <li key={item.id} className="flex gap-3 rounded-lg bg-el-paper p-3">
                    <button type="button" onClick={() => onOpenProduct(item.id)} className="size-24 shrink-0 overflow-hidden rounded-md bg-el-cream">
                      <PlaceholderImage label={item.name} src={item.images[0]} className="text-[28px]" />
                    </button>
                    <div className="min-w-0 flex-1">
                      <button type="button" onClick={() => onOpenProduct(item.id)} className="line-clamp-2 text-left text-[14px] leading-5">
                        {item.name}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleProduct(item.id)}
                        className="mt-3 inline-flex items-center gap-1 text-[12px] text-el-taupe-ink hover:text-el-black"
                      >
                        <Heart className="size-3.5 fill-el-gold text-el-gold-deep" strokeWidth={1.5} />
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </>
      )}
    </>
  )
}

function HistoryPane() {
  const sent = useRfq((state) => state.history)
  const items = useMemo(() => [...sent, ...RFQ_HISTORY], [sent])
  const [id, setId] = useState(items[0]?.id ?? "")
  const current = items.find((item) => item.id === id) ?? items[0]

  if (!current) {
    return (
      <>
        <p className="text-[11px] leading-4 font-semibold tracking-[0.16em] text-el-taupe-ink uppercase">History RFQ</p>
        <h2 className="mt-2 font-heading text-[32px] leading-10">No requests yet</h2>
      </>
    )
  }

  return (
    <div className="grid grid-cols-[240px_minmax(0,1fr)] items-start">
      <div className="pr-6">
        <p className="text-[11px] leading-4 font-semibold tracking-[0.16em] text-el-taupe-ink uppercase">History RFQ</p>
        <ul className="mt-4 flex flex-col">
          {items.map((item) => {
            const selected = item.id === current.id
            return (
              <li key={item.id} className="border-b border-el-line/70 last:border-b-0">
                <button
                  type="button"
                  onClick={() => setId(item.id)}
                  className={
                    selected
                      ? "w-full border-l-2 border-el-gold bg-el-cream/70 py-3 pr-3 pl-[10px] text-left"
                      : "w-full border-l-2 border-transparent py-3 pr-3 pl-[10px] text-left hover:bg-el-cream/40"
                  }
                >
                  <span className="block text-[13px] leading-5">{item.project}</span>
                  <span className="mt-1 block text-[12px] text-el-taupe-ink">{item.sentOn}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="border-l border-el-line pl-8">
        <HistoryDetail item={current} />
      </div>
    </div>
  )
}

function HistoryDetail({ item }: { item: RfqHistoryItem }) {
  return (
    <div className="rounded-[10px] bg-el-paper p-8">
      <p className="text-[11px] leading-4 font-semibold tracking-[0.16em] text-el-taupe-ink uppercase">{item.id}</p>
      <h2 className="mt-2 font-heading text-[28px] leading-9">{item.project}</h2>
      <p className="mt-3 text-[13px] leading-5 text-el-taupe-ink">
        Sent {item.sentOn} · Needed by {item.neededBy} · {item.region} · {item.status}
      </p>
      <table className="mt-8 w-full text-left text-[13px]">
        <thead className="text-[11px] tracking-[0.12em] text-el-taupe-ink uppercase">
          <tr>
            <th className="py-2 font-semibold">Item</th>
            <th className="py-2 font-semibold">Qty</th>
            <th className="py-2 font-semibold">Unit</th>
            <th className="py-2 font-semibold">Terms</th>
          </tr>
        </thead>
        <tbody>
          {item.lines.map((line) => (
            <tr key={`${item.id}-${line.name}`} className="border-t border-el-line">
              <td className="py-3">{line.name}</td>
              <td className="py-3 tabular-nums">{line.qty.toLocaleString("en-US")}</td>
              <td className="py-3 tabular-nums">{money(line.unitPrice)}</td>
              <td className="py-3">{line.terms}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-6 text-[14px] tabular-nums">Estimated total {money(rfqHistoryTotal(item), 0)}</p>
      <p className="mt-2 text-[12px] leading-[18px] text-el-taupe-ink">Read only. This request has already been sent.</p>
    </div>
  )
}
