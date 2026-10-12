"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { brand } from "@/config/brand"
import { product } from "@/data"
import type { Region, RfqLine, ShippingTerms } from "@/lib/types"

type RfqState = {
  lines: RfqLine[]
  project: string
  neededBy: string
  region: Region
  notes: string
  hydrated: boolean
  add: (ids: string[], opts?: { project?: string; notes?: string }) => { added: number; skipped: number }
  update: (id: string, patch: Partial<Pick<RfqLine, "qty" | "terms" | "selected">>) => void
  remove: (id: string) => void
  setMeta: (patch: Partial<Pick<RfqState, "project" | "neededBy" | "region" | "notes">>) => void
  reset: () => void
  setHydrated: () => void
}

const empty = {
  lines: [] as RfqLine[],
  project: "",
  neededBy: brand.rfq.defaultNeededBy,
  region: brand.rfq.defaultRegion,
  notes: "",
}

export const useRfq = create<RfqState>()(
  persist(
    (set) => ({
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
