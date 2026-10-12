"use client"

import { Suspense, useState } from "react"
import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
const AdvisorPanel = dynamic(() => import("@/components/advisor/advisor-panel").then((mod) => mod.AdvisorPanel), { ssr: false })
import { AdvisorProvider } from "./advisor-context"
import { Footer } from "./footer"
import { Topbar } from "./topbar"

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [advisor, setAdvisor] = useState(false)
  if (pathname === "/login") return <>{children}</>

  return (
    <div className="flex min-h-svh flex-col">
      <Suspense fallback={<div className="h-[72px]" />}>
        <Topbar onAsk={() => setAdvisor((open) => !open)} />
      </Suspense>
      <AdvisorProvider open={() => setAdvisor(true)}>
        <div className="flex-1" style={{ paddingRight: "var(--advisor-pad, 0px)" }}>
          {children}
        </div>
      </AdvisorProvider>
      <Footer />
      <AdvisorPanel open={advisor} onClose={() => setAdvisor(false)} />
    </div>
  )
}
