"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

type SavedState = {
  caseIds: string[]
  productIds: string[]
  hydrated: boolean
  toggle: (id: string) => void
  toggleProduct: (id: string) => void
  has: (id: string) => boolean
  hasProduct: (id: string) => boolean
  reset: () => void
  setHydrated: () => void
}

export const useSaved = create<SavedState>()(
  persist(
    (set, get) => ({
      caseIds: [],
      productIds: [],
      hydrated: false,
      toggle: (id) =>
        set((state) => ({
          caseIds: state.caseIds.includes(id)
            ? state.caseIds.filter((item) => item !== id)
            : [id, ...state.caseIds],
        })),
      toggleProduct: (id) =>
        set((state) => ({
          productIds: state.productIds.includes(id)
            ? state.productIds.filter((item) => item !== id)
            : [id, ...state.productIds],
        })),
      has: (id) => get().caseIds.includes(id),
      hasProduct: (id) => get().productIds.includes(id),
      reset: () => set({ caseIds: [], productIds: [] }),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "gf:el:saved:v1",
      skipHydration: true,
      partialize: (state) => ({ caseIds: state.caseIds, productIds: state.productIds }),
    },
  ),
)
