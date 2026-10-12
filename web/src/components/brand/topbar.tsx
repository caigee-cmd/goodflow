"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Sparkles } from "lucide-react"
import { LayoutGroup, motion } from "motion/react"
import { brand } from "@/config/brand"
import { cn } from "@/lib/utils"
import { useChat } from "@/stores/chat"
import { useRfq } from "@/stores/rfq"
import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar"
import { Wordmark } from "./wordmark"

const NAV = [
  { href: "/", label: "Home" },
  { href: "/categories", label: "Products" },
  { href: "/categories?source=archive", label: "Archive" },
  { href: "/ranking", label: "Ranking" },
  { href: "/rfq", label: "RFQ List" },
]

export function Topbar({ onAsk }: { onAsk: () => void }) {
  const pathname = usePathname()
  const params = useSearchParams()
  const source = params.get("source")
  const router = useRouter()
  const count = useRfq((state) => state.lines.length)
  const hydrated = useRfq((state) => state.hydrated)
  const reset = useRfq((state) => state.reset)
  const resetChat = useChat((state) => state.reset)
  const [menu, setMenu] = useState(false)

  return (
    <header className="sticky top-0 z-40 h-[72px] border-b border-el-line bg-el-canvas">
      <div className="mx-auto flex h-full max-w-[1360px] items-center gap-8 px-10">
        <Link href="/" className="text-el-black text-[18px] leading-6" aria-label={brand.wordmark}>
          <Wordmark />
        </Link>
        <LayoutGroup>
          <nav className="flex items-center gap-6">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : item.label === "Archive"
                    ? pathname.startsWith("/categories") && source === "archive"
                    : item.label === "Products"
                      ? pathname.startsWith("/categories") && source !== "archive"
                      : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative text-[12px] leading-4 font-semibold tracking-[0.14em] text-el-black uppercase",
                    active ? "" : "opacity-100 hover:text-el-gold-deep",
                  )}
                >
                  {item.label}
                  {item.href === "/rfq" && hydrated && count > 0 ? (
                    <motion.span
                      key={count}
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.25, 1] }}
                      transition={{ duration: 0.28 }}
                      className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-el-gold px-1 text-[10px] text-el-black"
                    >
                      {count}
                    </motion.span>
                  ) : null}
                  {active ? (
                    <motion.span layoutId="nav-underline" className="absolute -bottom-1.5 left-0 h-px w-full bg-el-gold" />
                  ) : null}
                </Link>
              )
            })}
          </nav>
        </LayoutGroup>
        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            onClick={onAsk}
            data-ask="true"
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-el-gold px-4 text-[12px] font-semibold tracking-[0.12em] text-el-gold-deep uppercase"
          >
            <Sparkles className="size-3.5" strokeWidth={1.5} />
            Ask
          </button>
          <div className="relative">
            <button
              type="button"
              aria-label={brand.user.name}
              aria-expanded={menu}
              onClick={() => setMenu((open) => !open)}
              className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-el-gold focus-visible:ring-offset-2 focus-visible:ring-offset-el-canvas"
            >
              <Avatar size="lg" className="size-9 shadow-el-sm">
                <AvatarFallback className="bg-[linear-gradient(145deg,#e8d4b0_0%,#c4a574_46%,#8c6b3e_100%)] font-heading text-[13px] tracking-[0.04em] text-el-black">
                  {brand.user.initials}
                </AvatarFallback>
                <AvatarBadge className="bg-el-gold ring-el-canvas" />
              </Avatar>
            </button>
            {menu ? (
              <div className="absolute top-11 right-0 w-64 rounded-lg border border-el-line bg-el-paper p-3 text-[13px] shadow-el-md">
                <p className="font-medium">{brand.user.name}</p>
                <p className="mt-1 text-[12px] text-el-taupe-ink">{brand.user.email}</p>
                <Link href="/account" className="mt-3 block hover:text-el-gold-deep" onClick={() => setMenu(false)}>
                  Account center
                </Link>
                <button
                  type="button"
                  className="mt-2 block text-left hover:text-el-gold-deep"
                  onClick={() => {
                    reset()
                    resetChat()
                    setMenu(false)
                    router.replace(pathname)
                  }}
                >
                  Reset demo
                </button>
                <Link href="/login" className="mt-2 block hover:text-el-gold-deep" onClick={() => setMenu(false)}>
                  Sign out
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}
