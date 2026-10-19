import { HomeGallery } from "@/components/cases/home-gallery"
import { HomeHero } from "@/components/cases/home-hero"

export default function HomePage() {
  return (
    <main className="pb-16">
      <HomeHero />
      <div className="relative z-10 mx-auto max-w-[1360px] px-10 pt-14">
        <HomeGallery />
      </div>
    </main>
  )
}
