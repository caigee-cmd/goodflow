"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

type SavedState = {
  caseIds: string[]
  hydrated: boolean
  toggle: (id: string) => void
  has: (id: string) => boolean
  reset: () => void
  setHydrated: () => void
}

export const useSaved = create<SavedState>()(
  persist(
    (set, get) => ({
      caseIds: [],
      hydrated: false,
      toggle: (id) =>
        set((state) => ({
          caseIds: state.caseIds.includes(id)
            ? state.caseIds.filter((item) => item !== id)
            : [id, ...state.caseIds],
        })),
      has: (id) => get().caseIds.includes(id),
      reset: () => set({ caseIds: [] }),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "gf:el:saved:v1",
      skipHydration: true,
      partialize: (state) => ({ caseIds: state.caseIds }),
    },
  ),
)
