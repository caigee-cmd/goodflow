import { brand } from "@/config/brand"
import { SignInForm } from "@/components/auth/sign-in-form"
import { Wordmark } from "@/components/brand/wordmark"

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden bg-el-canvas px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[#e7dccb] bg-cover bg-center"
        style={{ backgroundImage: "url(/demo/login-cover.jpg)" }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-el-ivory/78" />
      <div
        aria-hidden
        className="el-glow pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(60% 50% at 50% 35%, rgb(196 165 116 / 0.18), transparent 70%), radial-gradient(40% 40% at 80% 90%, rgb(196 165 116 / 0.10), transparent 70%)",
        }}
      />
      <div className="relative mt-24 flex flex-col items-center text-center">
        <Wordmark className="text-[40px] leading-[48px] text-el-black" />
        <span className="mt-4 block h-px w-10 bg-el-gold" />
        <p className="mt-4 text-[12px] leading-4 tracking-[0.32em] text-el-taupe-ink uppercase">
          {brand.productName}
        </p>
      </div>
      <SignInForm />
      <p className="relative mt-auto mb-6 text-[11px] leading-4 text-el-taupe-ink">
        Powered by GoodFlow · Demo environment
      </p>
    </main>
  )
}
