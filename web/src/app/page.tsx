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
        <p className="text-[11px] leading-4 font-semibold tracking-[0.16em] text-el-taupe-ink uppercase">
          Product Intelligence
        </p>
        <h1 className="mt-3 font-serif text-[56px] leading-[64px] font-normal tracking-[-0.01em]">
          Discover. Decide. Keep.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[16px] leading-6 text-el-taupe-ink">
          Find the direction in cases and trends. Decide from products this account has made before. Keep the choice for the next brief.
        </p>
        <HomeSearch />
      </header>
      <HomeGallery />
    </main>
  )
}
