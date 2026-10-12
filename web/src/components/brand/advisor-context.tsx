"use client"

import { createContext, useContext } from "react"

const AdvisorContext = createContext<(() => void) | null>(null)

export function AdvisorProvider({ open, children }: { open: () => void; children: React.ReactNode }) {
  return <AdvisorContext.Provider value={open}>{children}</AdvisorContext.Provider>
}

export function useOpenAdvisor() {
  return useContext(AdvisorContext) ?? (() => {})
}
