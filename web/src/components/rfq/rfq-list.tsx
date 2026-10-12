"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Clock, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { product } from "@/data"
import { fmtDate, money, orderBy } from "@/lib/dates"
import { buildRfqEmail } from "@/lib/rfq-email"
import { lineTotal, nextTier, tierFor } from "@/lib/pricing"
import type { Region, ShippingTerms } from "@/lib/types"
import { PlaceholderImage } from "@/components/media/placeholder-image"
import { Modal } from "@/components/ui/modal"
import { RfqListSkeleton } from "@/components/ui/skeleton"
import { useRfq } from "@/stores/rfq"

const TERMS: ShippingTerms[] = ["EXW", "FOB", "DAP"]
const REGIONS: Region[] = ["APAC", "EMEA", "Americas", "Global"]

export function RfqList() {
  const lines = useRfq((state) => state.lines)
  const project = useRfq((state) => state.project)
  const neededBy = useRfq((state) => state.neededBy)
  const region = useRfq((state) => state.region)
  const notes = useRfq((state) => state.notes)
  const hydrated = useRfq((state) => state.hydrated)
  const update = useRfq((state) => state.update)
  const remove = useRfq((state) => state.remove)
  const setMeta = useRfq((state) => state.setMeta)
  const [exporting, setExporting] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("export") !== "1") return
    setExporting(true)
    const url = new URL(window.location.href)
    url.searchParams.delete("export")
    window.history.replaceState(null, "", url)
  }, [])

  const selected = lines.filter((line) => line.selected)
  const total = selected.reduce((sum, line) => sum + lineTotal(product(line.productId), line.qty), 0)
  const longest = useMemo(() => {
    const leads = selected.map((line) => {
      const item = product(line.productId)
      return { days: tierFor(item, line.qty).leadTimeDays, name: item.name }
    })
    return [...leads].sort((a, b) => b.days - a.days)[0]
  }, [selected])

  if (!hydrated) return <RfqListSkeleton />
  if (lines.length === 0) {
    return (
      <div className="py-20 text-center">
        <h2 className="font-serif text-[24px] leading-8">Your RFQ List is empty</h2>
        <Link
          href="/categories"
          className="mt-6 inline-flex h-11 items-center rounded-md bg-el-black px-6 text-[12px] font-semibold tracking-[0.12em] text-el-ivory uppercase"
        >
          Browse Categories
        </Link>
      </div>
    )
  }

  const email = buildRfqEmail({ project, neededBy, region, notes, lines })

  return (
    <>
      <div className="grid grid-cols-[1fr_360px] items-start gap-10">
        <div className="space-y-4">
          {lines.map((line) => {
            const item = product(line.productId)
            const tier = tierFor(item, line.qty)
            const upcoming = nextTier(item, line.qty)
            return (
              <article key={line.productId} className="grid grid-cols-[24px_96px_1fr_auto] gap-4 rounded-lg bg-el-paper p-4">
                <input
                  type="checkbox"
                  checked={line.selected}
                  aria-label={`Select ${item.name}`}
                  onChange={(event) => update(line.productId, { selected: event.target.checked })}
                  className="mt-1 size-4 accent-el-black"
                />
                <div className="size-24 overflow-hidden rounded-md bg-el-cream">
                  <PlaceholderImage label={item.name} src={item.images[0]} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-el-taupe-ink uppercase">
                    {item.source === "archive" ? "Archive" : "External"}
                  </p>
                  <h2 className="mt-1 text-[15px] leading-[22px]">{item.name}</h2>
                  <p className="text-[12px] leading-[18px] text-el-taupe-ink">{item.size}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <select
                      aria-label="Shipping terms"
                      value={line.terms}
                      onChange={(event) => update(line.productId, { terms: event.target.value as ShippingTerms })}
                      className="h-9 rounded-md border border-el-line bg-el-paper px-2 text-[13px]"
                    >
                      {TERMS.map((term) => (
                        <option key={term}>{term}</option>
                      ))}
                    </select>
                    <div className="inline-flex h-9 items-center rounded-md border border-el-line">
                      <button
                        type="button"
                        className="w-8"
                        aria-label="Decrease quantity"
                        onClick={() => update(line.productId, { qty: Math.max(item.priceTiers[0].moq, line.qty - 500) })}
                      >
                        −
                      </button>
                      <span className="w-16 text-center text-[13px] tabular-nums">{line.qty.toLocaleString("en-US")}</span>
                      <button
                        type="button"
                        className="w-8"
                        aria-label="Increase quantity"
                        onClick={() => update(line.productId, { qty: line.qty + 500 })}
                      >
                        +
                      </button>
                    </div>
                    {upcoming ? (
                      <button
                        type="button"
                        className="text-[12px] text-el-gold-deep underline decoration-el-line underline-offset-4"
                        onClick={() => update(line.productId, { qty: upcoming.moq })}
                      >
                        {upcoming.moq.toLocaleString("en-US")}+ unlocks {money(upcoming.unitPrice)}
                      </button>
                    ) : null}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[13px] tabular-nums text-el-taupe-ink">{money(tier.unitPrice)}</p>
                  <p className="mt-1 text-[16px] font-semibold tabular-nums">{money(lineTotal(item, line.qty), 0)}</p>
                  <button type="button" aria-label={`Remove ${item.name}`} className="mt-3" onClick={() => remove(line.productId)}>
                    <Trash2 className="size-4 text-el-taupe-ink" strokeWidth={1.5} />
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        <aside className="sticky top-24 rounded-[10px] border border-el-line bg-el-paper p-5">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-el-taupe-ink uppercase">Summary</p>
          <label className="mt-4 block text-[12px] text-el-taupe-ink">
            Project
            <input
              value={project}
              onChange={(event) => setMeta({ project: event.target.value })}
              className="mt-1 h-10 w-full rounded-md border border-el-line bg-el-paper px-3 text-[14px] text-el-black"
            />
          </label>
          <p className="mt-4 text-[13px] text-el-taupe-ink">{selected.length} selected · {selected.reduce((sum, line) => sum + line.qty, 0).toLocaleString("en-US")} units</p>
          <p className="mt-1 text-[24px] font-semibold tabular-nums">Est. total {money(total, 0)}</p>
          <label className="mt-4 block text-[12px] text-el-taupe-ink">
            Needed by
            <input
              type="date"
              value={neededBy}
              onChange={(event) => setMeta({ neededBy: event.target.value })}
              className="mt-1 h-10 w-full rounded-md border border-el-line px-3 text-[14px] text-el-black"
            />
          </label>
          <label className="mt-3 block text-[12px] text-el-taupe-ink">
            Delivery region
            <select
              value={region}
              onChange={(event) => setMeta({ region: event.target.value as Region })}
              className="mt-1 h-10 w-full rounded-md border border-el-line px-3 text-[14px] text-el-black"
            >
              {REGIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="mt-3 block text-[12px] text-el-taupe-ink">
            Notes
            <textarea
              value={notes}
              rows={3}
              onChange={(event) => setMeta({ notes: event.target.value })}
              className="mt-1 w-full rounded-md border border-el-line px-3 py-2 text-[14px] text-el-black"
            />
          </label>
          {longest ? (
            <p className="mt-4 flex gap-2 rounded-md bg-el-cream p-3 text-[12px] leading-[18px]">
              <Clock className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} />
              Order by {fmtDate(orderBy(neededBy, longest.days))} — longest lead time {longest.days} days ({longest.name})
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => {
              setCopied(false)
              setExporting(true)
            }}
            className="mt-4 flex h-11 w-full items-center justify-center rounded-md bg-el-black text-[12px] font-semibold tracking-[0.12em] text-el-ivory uppercase"
          >
            Export RFQ
          </button>
          <p className="mt-2 text-center text-[11px] text-el-taupe-ink">Indicative pricing · Final quote from GoodFlow sales</p>
        </aside>
      </div>

      {exporting ? (
        <Modal label="Export RFQ" onClose={() => setExporting(false)} className="w-full max-w-[720px] rounded-[10px] bg-el-paper p-6 shadow-el-lg">
            <h2 className="font-serif text-[30px] leading-[38px]">Export RFQ</h2>
            <label className="mt-4 block text-[12px] text-el-taupe-ink">
              To
              <input readOnly value={email.to} className="mt-1 h-10 w-full rounded-md border border-el-line bg-el-cream px-3 text-[14px]" />
            </label>
            <label className="mt-3 block text-[12px] text-el-taupe-ink">
              Subject
              <input readOnly value={email.subject} className="mt-1 h-10 w-full rounded-md border border-el-line px-3 text-[14px]" />
            </label>
            <textarea readOnly value={email.body} className="mt-3 h-[360px] w-full rounded-md border border-el-line p-3 font-mono text-[13px] leading-5" />
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(`To: ${email.to}\nSubject: ${email.subject}\n\n${email.body}`)
                setCopied(true)
                toast("Copied to clipboard")
              }}
              className="mt-4 h-11 rounded-md bg-el-black px-6 text-[12px] font-semibold tracking-[0.12em] text-el-ivory uppercase"
            >
              {copied ? "Copied" : "Copy email"}
            </button>
        </Modal>
      ) : null}
    </>
  )
}
