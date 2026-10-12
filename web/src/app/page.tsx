import { HomeGallery } from "@/components/cases/home-gallery"
import { HomeSearch } from "@/components/cases/home-search"

export default function HomePage() {
  return (
    <main className="mx-auto max-w-[1360px] px-10 pb-16">
      <header className="relative py-14 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 80% at 50% 30%, rgb(196 165 116 / 0.07), transparent 70%)",
          }}
        />
        <h1 className="font-heading text-[44px] leading-[52px] font-medium tracking-[0.04em] uppercase">
          Discover better merch
        </h1>
        <p className="mt-3 font-heading text-[22px] leading-7 font-normal tracking-[0.08em] text-el-taupe-ink uppercase">
          Discover, imagine, and order with ease
        </p>
        <HomeSearch />
      </header>
      <HomeGallery />
    </main>
  )
}
