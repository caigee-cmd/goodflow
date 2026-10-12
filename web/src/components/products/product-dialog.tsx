"use client"

import { useState } from "react"
import { Heart, X } from "lucide-react"
import { brand } from "@/config/brand"
import { BRANDS, product } from "@/data"
import { fmtDate, money, orderBy } from "@/lib/dates"
import { lineTotal, nextTier, tierFor } from "@/lib/pricing"
import type { ShippingTerms } from "@/lib/types"
import { demoImage } from "@/lib/demo-images"
import { ImageStage } from "@/components/media/image-stage"
import { PlaceholderImage } from "@/components/media/placeholder-image"
import { Modal, useModalClose } from "@/components/ui/modal"
import { useOpenAdvisor } from "@/components/brand/advisor-context"
import { useRfq } from "@/stores/rfq"
import { useSaved } from "@/stores/saved"

function CloseButton() {
  const close = useModalClose()
  return (
    <button
      type="button"
      aria-label="Close"
      onClick={close}
      className="absolute top-4 right-4 z-10 flex size-10 items-center justify-center rounded-full border border-el-line bg-el-paper"
    >
      <X className="size-4" strokeWidth={1.5} />
    </button>
  )
}

const TERMS: ShippingTerms[] = ["EXW", "FOB", "DAP"]

export function ProductDialog({ id, onClose }: { id: string; onClose: () => void }) {
  const item = product(id)
  const [qty, setQty] = useState(item.priceTiers[0].moq)
  const [terms, setTerms] = useState<ShippingTerms>("EXW")
  const [view, setView] = useState(0)
  const [direction, setDirection] = useState(1)
  const onAsk = useOpenAdvisor()
  const saved = useSaved((state) => state.productIds.includes(id))
  const toggleSaved = useSaved((state) => state.toggleProduct)
  const lines = useRfq((state) => state.lines)
  const add = useRfq((state) => state.add)
  const inList = lines.some((line) => line.productId === id)
  const tier = tierFor(item, qty)
  const upcoming = nextTier(item, qty)
  const safeQty = Math.max(item.priceTiers[0].moq, qty)
  const brandNames = item.brands.map((id) => BRANDS.find((entry) => entry.id === id)?.label ?? id)

  function commit(value: number) {
    setQty(Math.max(item.priceTiers[0].moq, value))
  }

  return (
    <Modal
      label={item.name}
      onClose={onClose}
      className="relative grid h-[86vh] w-[92vw] max-w-[1120px] grid-cols-[1.1fr_1fr] rounded-[10px] bg-el-paper shadow-el-lg"
    >
        <CloseButton />

        <div className="flex flex-col overflow-hidden rounded-l-[10px] bg-el-cream p-8">
          <div className="flex flex-1 items-center justify-center">
            <div className="relative aspect-square w-full max-w-[460px] overflow-hidden">
              <ImageStage label={item.name} src={item.images[view]} direction={direction} />
            </div>
          </div>
          <button
            type="button"
            aria-label={saved ? `Remove ${item.name} from favorites` : `Save ${item.name}`}
            aria-pressed={saved}
            onClick={() => toggleSaved(item.id)}
            className="absolute top-1/2 -right-5 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-el-line bg-el-paper shadow-el-md"
          >
            <Heart className={saved ? "size-4 fill-el-gold text-el-gold-deep" : "size-4 text-el-black"} strokeWidth={1.5} />
          </button>
          {item.images.length > 1 && demoImage(item.images[0]) ? (
            <div className="mt-6 flex justify-center gap-3">
              {item.images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  aria-label={`Image ${index + 1}`}
                  onClick={() => {
                    setDirection(index > view ? 1 : -1)
                    setView(index)
                  }}
                  className={
                    index === view
                      ? "size-16 overflow-hidden rounded-md ring-2 ring-el-gold"
                      : "size-16 overflow-hidden rounded-md opacity-70 ring-1 ring-el-line hover:opacity-100"
                  }
                >
                  <PlaceholderImage label={item.name} seed={`${item.id}-${index}`} src={image} className="text-[18px]" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex min-h-0 flex-col overflow-hidden rounded-r-[10px] p-8">
          <div className="min-h-0 flex-1 overflow-auto pr-8">
            <div className="flex items-center gap-2">
              <span
                className={
                  item.source === "archive"
                    ? "inline-flex h-5 items-center rounded bg-el-black px-2 text-[10px] font-semibold tracking-[0.14em] text-el-gold uppercase"
                    : "inline-flex h-5 items-center rounded border border-el-line bg-el-paper px-2 text-[10px] font-semibold tracking-[0.14em] text-el-taupe-ink uppercase"
                }
              >
                {item.source === "archive" ? "Archive" : "External"}
              </span>
              <p className="text-[11px] leading-4 font-semibold tracking-[0.16em] text-el-taupe-ink uppercase">
                {brandNames.join(" · ")}
              </p>
            </div>
            <h2 className="mt-3 font-heading text-[30px] leading-[38px]">{item.name}</h2>

            {item.source === "archive" ? (
              <>
                <p className="mt-3 text-[14px] leading-[22px]">{item.campaign}</p>
                <blockquote className="mt-4 border-l-2 border-el-gold bg-el-cream p-4">
                  <p className="text-[11px] leading-4 font-semibold tracking-[0.16em] text-el-taupe-ink uppercase">
                    Archive note
                  </p>
                  <p className="mt-2 text-[14px] leading-6">{item.notes}</p>
                </blockquote>
              </>
            ) : (
              <p className="mt-3 text-[14px] leading-[22px] text-el-taupe-ink">
                By {item.maker} · Recommended for {brandNames.join(", ")}
              </p>
            )}

            <dl className="mt-6 grid grid-cols-[140px_1fr] gap-y-3 text-[13px] leading-5">
              {[
                ["Inspiration", item.inspiration],
                ["Material", item.material],
                ["Packaging", item.packaging],
                ["Size", item.size],
              ].map(([label, value]) =>
                value ? (
                  <div key={label} className="contents">
                    <dt className="text-[11px] font-semibold tracking-[0.16em] text-el-taupe-ink uppercase">{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ) : null,
              )}
            </dl>

            <fieldset className="mt-6">
              <legend className="text-[11px] font-semibold tracking-[0.16em] text-el-taupe-ink uppercase">
                Shipping terms
              </legend>
              <div className="mt-2 flex gap-2">
                {TERMS.map((option) => (
                  <label
                    key={option}
                    className={
                      terms === option
                        ? "flex h-9 items-center rounded-md bg-el-black px-4 text-[12px] font-semibold tracking-[0.1em] text-el-ivory"
                        : "flex h-9 items-center rounded-md border border-el-line px-4 text-[12px] font-semibold tracking-[0.1em]"
                    }
                  >
                    <input
                      type="radio"
                      name="terms"
                      className="sr-only"
                      checked={terms === option}
                      onChange={() => setTerms(option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </fieldset>

            <table className="mt-6 w-full text-left text-[13px]">
              <caption className="mb-2 text-left text-[11px] font-semibold tracking-[0.16em] text-el-taupe-ink uppercase">
                Volume pricing
              </caption>
              <thead className="text-[11px] tracking-[0.12em] text-el-taupe-ink uppercase">
                <tr>
                  <th className="py-2 font-semibold">MOQ</th>
                  <th className="py-2 font-semibold">Unit price</th>
                  <th className="py-2 font-semibold">Lead time</th>
                </tr>
              </thead>
              <tbody>
                {item.priceTiers.map((row) => {
                  const current = row.moq === tier.moq
                  return (
                    <tr key={row.moq} className={current ? "border-l-2 border-el-gold bg-el-cream" : ""}>
                      <td className="px-2 py-2 tabular-nums">{row.moq.toLocaleString("en-US")}</td>
                      <td className="py-2 tabular-nums">{money(row.unitPrice)}</td>
                      <td className="py-2 tabular-nums">{row.leadTimeDays} days</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {upcoming ? (
              <button
                type="button"
                onClick={() => commit(upcoming.moq)}
                className="mt-2 text-[13px] text-el-gold-deep underline decoration-el-line underline-offset-4"
              >
                Order {upcoming.moq.toLocaleString("en-US")}+ to unlock {money(upcoming.unitPrice)}/unit
              </button>
            ) : null}

            <div className="mt-6">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-el-taupe-ink uppercase">Quantity</p>
              <div className="mt-2 inline-flex h-11 items-center rounded-md border border-el-line">
                <button type="button" className="w-11" onClick={() => commit(safeQty - 500)} aria-label="Decrease quantity">
                  −
                </button>
                <input
                  aria-label="Quantity"
                  inputMode="numeric"
                  value={qty.toLocaleString("en-US")}
                  onChange={(event) => setQty(Number(event.target.value.replace(/[^\d]/g, "")) || 0)}
                  onBlur={() => commit(qty)}
                  className="w-24 bg-transparent text-center text-[14px] tabular-nums outline-none"
                />
                <button type="button" className="w-11" onClick={() => commit(safeQty + 500)} aria-label="Increase quantity">
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-el-line pt-4">
            <p className="text-[12px] leading-[18px] text-el-taupe-ink tabular-nums">
              Est. {money(lineTotal(item, safeQty), 0)} · Order by{" "}
              {fmtDate(orderBy(brand.rfq.defaultNeededBy, tier.leadTimeDays))} to land by{" "}
              {fmtDate(brand.rfq.defaultNeededBy)}
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onAsk()
                }}
                className="flex h-11 flex-1 items-center justify-center rounded-md border border-el-line text-[12px] font-semibold tracking-[0.12em] uppercase"
              >
                Contact Sales
              </button>
              <button
                type="button"
                onClick={() => add([id])}
                className="flex h-11 flex-1 items-center justify-center rounded-md bg-el-black text-[12px] font-semibold tracking-[0.12em] text-el-ivory uppercase hover:text-el-gold"
              >
                {inList ? "In RFQ List" : "Add to RFQ"}
              </button>
            </div>
          </div>
        </div>
    </Modal>
  )
}
