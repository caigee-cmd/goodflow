"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Lock, Mail } from "lucide-react"
import { brand } from "@/config/brand"

export function SignInForm() {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  function enter() {
    if (pending) return
    setPending(true)
    const page = document.querySelector("main")
    if (page instanceof HTMLElement) {
      page.style.transition = "opacity 350ms cubic-bezier(0.22, 1, 0.36, 1)"
      page.style.opacity = "0"
    }
    window.setTimeout(() => router.push("/"), 600)
  }

  return (
    <form
      className="relative mt-10 w-full max-w-md rounded-[10px] border border-el-line bg-[rgb(255_253_249/0.72)] p-8 shadow-el-md backdrop-blur-xl"
      onSubmit={(event) => {
        event.preventDefault()
        enter()
      }}
    >
      <h1 className="font-serif text-[24px] leading-8 font-normal">Sign in</h1>
      <p className="mt-1 text-[13px] leading-5 text-el-taupe-ink">Use your Estée Lauder account</p>

      <label className="mt-6 block text-[12px] font-medium tracking-[0.08em] text-el-taupe-ink uppercase">
        Email
        <span className="relative mt-2 block">
          <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-el-taupe" strokeWidth={1.5} />
          <input
            name="email"
            type="email"
            autoComplete="username"
            defaultValue={brand.user.email}
            className="h-12 w-full rounded-md border border-el-line bg-el-paper pr-3 pl-10 text-[14px] text-el-black outline-none focus:border-el-gold focus:ring-2 focus:ring-el-gold/40"
          />
        </span>
      </label>

      <label className="mt-4 block text-[12px] font-medium tracking-[0.08em] text-el-taupe-ink uppercase">
        Password
        <span className="relative mt-2 block">
          <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-el-taupe" strokeWidth={1.5} />
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            defaultValue={brand.user.password}
            className="h-12 w-full rounded-md border border-el-line bg-el-paper pr-3 pl-10 text-[14px] text-el-black outline-none focus:border-el-gold focus:ring-2 focus:ring-el-gold/40"
          />
        </span>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="mt-6 flex h-12 w-full items-center justify-center rounded-md bg-el-black text-[12px] font-semibold tracking-[0.12em] text-el-ivory uppercase transition-colors hover:text-el-gold disabled:opacity-70"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : "Sign in"}
      </button>

      <div className="my-5 flex items-center gap-3 text-[11px] tracking-[0.16em] text-el-taupe-ink uppercase">
        <span className="h-px flex-1 bg-el-line" />
        or
        <span className="h-px flex-1 bg-el-line" />
      </div>

      <button
        type="button"
        onClick={enter}
        className="w-full text-[12px] font-semibold tracking-[0.12em] text-el-black uppercase hover:text-el-gold-deep"
      >
        Continue as guest
      </button>
    </form>
  )
}
