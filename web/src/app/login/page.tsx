import { brand } from "@/config/brand"
import { SignInForm } from "@/components/auth/sign-in-form"
import { Wordmark } from "@/components/brand/wordmark"
import { Separator } from "@/components/ui/separator"
import styles from "./login.module.css"

// Based on the shadcn `login-02` block (two columns, cover image), restyled for Estée Lauder.
const slides = [
  { src: "/demo/login/login-b2.jpg", position: "38% 70%", delay: "-1.5s", caption: "The Fragrance Edit" },
  { src: "/demo/login/login-a2.jpg", position: "55% 60%", delay: "7.5s", caption: "Silk & Light" },
  { src: "/demo/login/login-c2.jpg", position: "60% 70%", delay: "16.5s", caption: "Quiet Rituals" },
]

export default function LoginPage() {
  return (
    <main className="grid min-h-screen grid-cols-[minmax(560px,1fr)_minmax(0,1fr)] bg-el-canvas">
      <section className="relative flex flex-col px-10 py-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 80% at 30% 20%, rgb(196 165 116 / 0.07), transparent 70%)",
          }}
        />
        <div className="relative flex flex-col items-start">
          <Wordmark className="text-[18px] leading-6 text-el-black" />
          <span className="mt-4 block h-px w-10 bg-el-gold" />
          <p className="mt-4 text-[11px] leading-4 font-semibold tracking-[0.16em] text-el-taupe-ink uppercase">
            {brand.productName}
          </p>
        </div>

        <div className="relative flex flex-1 items-center justify-center">
          <div className="w-full max-w-[380px]">
            <SignInForm />
          </div>
        </div>

        <p className="relative text-[12px] leading-[18px] text-el-taupe-ink">
          Powered by GoodFlow · Demo environment
        </p>
      </section>

      <section aria-hidden className="relative overflow-hidden bg-el-cream">
        <Separator orientation="vertical" className="absolute inset-y-0 left-0 z-10 bg-el-gold/40" />
        {slides.map((slide) => (
          <figure
            key={slide.src}
            className={`${styles.slide} absolute inset-0 m-0`}
            style={{ animationDelay: slide.delay }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.src}
              alt=""
              className="h-full w-full object-cover"
              style={{ objectPosition: slide.position }}
            />
            <figcaption className="absolute bottom-10 left-10 flex items-center gap-4 text-[11px] leading-4 font-semibold tracking-[0.16em] text-el-ivory uppercase">
              <span className="block h-px w-8 bg-el-gold" />
              {slide.caption}
            </figcaption>
          </figure>
        ))}
        <p className="absolute top-12 right-10 z-10 text-[11px] leading-4 font-semibold tracking-[0.16em] text-el-ivory/90 uppercase">
          Holiday 2026
        </p>
      </section>
    </main>
  )
}
