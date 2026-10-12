"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { brand } from "@/config/brand"
import { product } from "@/data"
import type { RfqHistoryItem } from "@/data/estee-lauder/rfq-history"
import { fmtDate } from "@/lib/dates"
import { tierFor } from "@/lib/pricing"
import type { Region, RfqLine, ShippingTerms } from "@/lib/types"

type RfqState = {
  lines: RfqLine[]
  project: string
  neededBy: string
  region: Region
  notes: string
  history: RfqHistoryItem[]
  hydrated: boolean
  add: (ids: string[], opts?: { project?: string; notes?: string }) => { added: number; skipped: number }
  update: (id: string, patch: Partial<Pick<RfqLine, "qty" | "terms" | "selected">>) => void
  remove: (id: string) => void
  setMeta: (patch: Partial<Pick<RfqState, "project" | "neededBy" | "region" | "notes">>) => void
  submit: () => { ok: boolean; id?: string }
  reset: () => void
  setHydrated: () => void
}

const empty = {
  lines: [] as RfqLine[],
  project: "",
  neededBy: brand.rfq.defaultNeededBy,
  region: brand.rfq.defaultRegion,
  notes: "",
  history: [] as RfqHistoryItem[],
}

export const useRfq = create<RfqState>()(
  persist(
    (set, get) => ({
      ...empty,
      hydrated: false,
      add: (ids, opts) => {
        let added = 0
        let skipped = 0
        set((state) => {
          const lines = [...state.lines]
          for (const id of ids) {
            if (lines.some((line) => line.productId === id)) {
              skipped += 1
              continue
            }
            lines.push({
              productId: id,
              qty: product(id).priceTiers[0].moq,
              terms: "EXW",
              selected: true,
              addedAt: Date.now(),
            })
            added += 1
          }
          return {
            lines,
            project: state.project || opts?.project || "",
            notes: state.notes || opts?.notes || "",
          }
        })
        return { added, skipped }
      },
      update: (id, patch) =>
        set((state) => ({
          lines: state.lines.map((line) => (line.productId === id ? { ...line, ...patch } : line)),
        })),
      remove: (id) => set((state) => ({ lines: state.lines.filter((line) => line.productId !== id) })),
      setMeta: (patch) => set(patch),
      submit: () => {
        const state = get()
        const selected = state.lines.filter((line) => line.selected)
        if (selected.length === 0) return { ok: false }
        const id = `rfq-${Date.now().toString(36)}`
        const item: RfqHistoryItem = {
          id,
          project: state.project.trim() || "Gift sourcing",
          sentOn: fmtDate(brand.demoToday),
          neededBy: fmtDate(state.neededBy),
          region: state.region,
          status: "Sent",
          lines: selected.map((line) => {
            const current = product(line.productId)
            const tier = tierFor(current, line.qty)
            return {
              name: current.name,
              qty: line.qty,
              unitPrice: tier.unitPrice,
              terms: line.terms,
            }
          }),
        }
        const remaining = state.lines.filter((line) => !line.selected)
        set({
          history: [item, ...state.history],
          lines: remaining,
          ...(remaining.length === 0
            ? {
                project: "",
                notes: "",
                neededBy: brand.rfq.defaultNeededBy,
                region: brand.rfq.defaultRegion,
              }
            : {}),
        })
        return { ok: true, id }
      },
      reset: () => set(empty),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "gf:el:rfq:v1",
      skipHydration: true,
      partialize: (state) => ({
        lines: state.lines,
        project: state.project,
        neededBy: state.neededBy,
        region: state.region,
        notes: state.notes,
        history: state.history,
      }),
    },
  ),
)

export function rfqSummary(lines: RfqLine[]) {
  const selected = lines.filter((line) => line.selected)
  const leads = selected.map((line) => ({
    days: product(line.productId).priceTiers.find((tier) => line.qty >= tier.moq)?.leadTimeDays ?? 0,
    productId: line.productId,
    name: product(line.productId).name,
  }))
  const longest = [...leads].sort((a, b) => b.days - a.days)[0]
  return {
    count: selected.length,
    totalQty: selected.reduce((sum, line) => sum + line.qty, 0),
    longest,
  }
}

export type { ShippingTerms }
