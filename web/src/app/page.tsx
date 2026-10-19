import { HomeGallery } from "@/components/cases/home-gallery"
import { HomeSearch } from "@/components/cases/home-search"
import { HomeFloatingImages } from "@/components/cases/home-floating-images"

export default function HomePage() {
  return (
    <main className="mx-auto max-w-[1360px] px-10 pb-16">
      <header className="relative flex min-h-[620px] flex-col items-center justify-center py-14 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 80% at 50% 30%, rgb(196 165 116 / 0.07), transparent 70%)",
          }}
        />
        <HomeFloatingImages />
        <h1 className="relative z-10 font-heading text-[44px] leading-[52px] font-medium tracking-[0.04em] uppercase">
          Discover better merch
        </h1>
        <p className="relative z-10 mt-3 font-heading text-[22px] leading-7 font-normal tracking-[0.08em] text-el-taupe-ink uppercase">
          Discover, imagine, and order with ease
        </p>
        <div className="relative z-10 w-full">
          <HomeSearch />
        </div>
      </header>
      <HomeGallery />
    </main>
  )
}
