"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { RFQ_HISTORY, rfqHistoryTotal, type RfqHistoryItem } from "@/data/estee-lauder/rfq-history"
import { money } from "@/lib/dates"
import { Modal } from "@/components/ui/modal"

export function HistoryDialog({ onClose }: { onClose: () => void }) {
  const [id, setId] = useState(RFQ_HISTORY[0].id)
  const current = RFQ_HISTORY.find((item) => item.id === id) ?? RFQ_HISTORY[0]

  return (
    <Modal
      label="History RFQ"
      onClose={onClose}
      className="relative grid h-[78vh] w-[92vw] max-w-[960px] grid-cols-[280px_1fr] overflow-hidden rounded-[10px] bg-el-paper shadow-el-lg"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex size-10 items-center justify-center rounded-full border border-el-line bg-el-paper"
      >
        <X className="size-4" strokeWidth={1.5} />
      </button>
      <aside className="overflow-auto border-r border-el-line bg-el-cream/40 p-5">
        <p className="text-[11px] leading-4 font-semibold tracking-[0.16em] text-el-taupe-ink uppercase">History RFQ</p>
        <ul className="mt-4 flex flex-col gap-2">
          {RFQ_HISTORY.map((item) => {
            const selected = item.id === current.id
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setId(item.id)}
                  className={
                    selected
                      ? "w-full rounded-md bg-el-paper px-3 py-3 text-left shadow-el-sm"
                      : "w-full rounded-md px-3 py-3 text-left hover:bg-el-paper"
                  }
                >
                  <span className="block text-[13px] leading-5">{item.project}</span>
                  <span className="mt-1 block text-[12px] text-el-taupe-ink">{item.sentOn}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </aside>
      <HistoryDetail item={current} />
    </Modal>
  )
}

function HistoryDetail({ item }: { item: RfqHistoryItem }) {
  return (
    <div className="overflow-auto p-8 pr-16">
      <p className="text-[11px] leading-4 font-semibold tracking-[0.16em] text-el-taupe-ink uppercase">{item.id}</p>
      <h2 className="mt-2 font-serif text-[28px] leading-9">{item.project}</h2>
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
            <tr key={line.name} className="border-t border-el-line">
              <td className="py-3">{line.name}</td>
              <td className="py-3 tabular-nums">{line.qty.toLocaleString("en-US")}</td>
              <td className="py-3 tabular-nums">{money(line.unitPrice)}</td>
              <td className="py-3">{line.terms}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-6 text-[14px] tabular-nums">Estimated total {money(rfqHistoryTotal(item), 0)}</p>
      <p className="mt-2 text-[12px] leading-[18px] text-el-taupe-ink">Read only. This request was sent in a previous season.</p>
    </div>
  )
}
