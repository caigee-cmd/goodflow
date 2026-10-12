"use client"

import { useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useChat } from "@/stores/chat"
import { useRfq } from "@/stores/rfq"
import { useSaved } from "@/stores/saved"

export function StoreHydrator() {
  const pathname = usePathname()
  const router = useRouter()
  const search = useSearchParams()

  useEffect(() => {
    void useRfq.persist.rehydrate()
    void useSaved.persist.rehydrate()
    useRfq.getState().setHydrated()
    useSaved.getState().setHydrated()
  }, [])

  useEffect(() => {
    if (search.get("reset") !== "1") return
    useRfq.getState().reset()
    useChat.getState().reset()
    useSaved.getState().reset()
    router.replace(pathname)
  }, [pathname, router, search])

  return null
}
