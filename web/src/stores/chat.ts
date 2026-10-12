"use client"

import { create } from "zustand"

export type ChatStep = { label: string; status: "active" | "complete" }

export type ChatLine = {
  role: "user" | "advisor"
  text: string
  steps?: ChatStep[]
  cards?: string[]
  citations?: string[]
  addAll?: boolean
  exportRfq?: boolean
  followUps?: string[]
}

type ChatState = {
  lines: ChatLine[]
  setLines: (lines: ChatLine[] | ((current: ChatLine[]) => ChatLine[])) => void
  reset: () => void
}

export const useChat = create<ChatState>((set) => ({
  lines: [],
  setLines: (lines) =>
    set((state) => ({ lines: typeof lines === "function" ? lines(state.lines) : lines })),
  reset: () => set({ lines: [] }),
}))
