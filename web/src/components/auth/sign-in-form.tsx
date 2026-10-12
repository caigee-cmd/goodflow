"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, Mail } from "lucide-react"
import { brand } from "@/config/brand"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"

const labelClass = "block text-[11px] font-semibold tracking-[0.16em] text-el-taupe-ink uppercase"
const groupClass =
  "mt-2 h-12 rounded-full border-el-line bg-el-paper shadow-none has-[[data-slot=input-group-control]:focus-visible]:border-el-gold has-[[data-slot=input-group-control]:focus-visible]:ring-el-gold/30"

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
      className="flex flex-col"
      onSubmit={(event) => {
        event.preventDefault()
        enter()
      }}
    >
      <h1 className="font-heading text-[40px] leading-[48px] font-medium tracking-[0.04em] text-el-black uppercase">
        Sign in
      </h1>
      <p className="mt-3 font-heading text-[16px] leading-6 font-normal tracking-[0.08em] text-el-taupe-ink uppercase">
        Use your Estée Lauder account
      </p>

      <label className={`${labelClass} mt-10`}>
        Email
        <InputGroup className={groupClass}>
          <InputGroupAddon>
            <Mail className="text-el-taupe" strokeWidth={1.5} />
          </InputGroupAddon>
          <InputGroupInput
            name="email"
            type="email"
            autoComplete="username"
            defaultValue={brand.user.email}
            className="text-[14px] tracking-normal text-el-black normal-case"
          />
        </InputGroup>
      </label>

      <label className={`${labelClass} mt-5`}>
        Password
        <InputGroup className={groupClass}>
          <InputGroupAddon>
            <Lock className="text-el-taupe" strokeWidth={1.5} />
          </InputGroupAddon>
          <InputGroupInput
            name="password"
            type="password"
            autoComplete="current-password"
            defaultValue={brand.user.password}
            className="text-[14px] tracking-normal text-el-black normal-case"
          />
        </InputGroup>
      </label>

      <Button
        type="submit"
        disabled={pending}
        className="mt-8 h-12 w-full rounded-full bg-el-black text-[12px] font-semibold tracking-[0.1em] text-el-ivory uppercase transition-colors duration-500 hover:bg-el-black hover:text-el-gold disabled:opacity-70"
      >
        {pending ? <Spinner /> : "Sign in"}
      </Button>

      <div className="my-6 flex items-center gap-4 text-[11px] font-semibold tracking-[0.16em] text-el-taupe-ink uppercase">
        <Separator className="flex-1 bg-el-line" />
        or
        <Separator className="flex-1 bg-el-line" />
      </div>

      <Button
        type="button"
        variant="ghost"
        onClick={enter}
        className="h-10 w-full rounded-full text-[12px] font-semibold tracking-[0.1em] text-el-black uppercase hover:bg-transparent hover:text-el-gold-deep"
      >
        Continue as guest
      </Button>
    </form>
  )
}
