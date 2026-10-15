import Image from "next/image"
import { demoImage } from "@/lib/demo-images"
import { cn } from "@/lib/utils"

const WASHES = ["#E7D3B4", "#EFE2CE", "#D8C4A4", "#E4D2BC", "#F3E6D4", "#CDB892"]

export function PlaceholderImage({
  label,
  seed = label,
  src,
  className,
  priority = false,
}: {
  label: string
  seed?: string
  src?: string
  className?: string
  priority?: boolean
}) {
  const real = demoImage(src)
  if (real) {
    return (
      <div className={cn("relative h-full w-full overflow-hidden bg-el-cream", className)}>
        <Image
          src={real}
          alt={label}
          fill
          preload={priority}
          loading={priority ? "eager" : "lazy"}
          sizes="(max-width: 768px) 100vw, 480px"
          className="object-cover"
        />
      </div>
    )
  }
  const initial = label.trim().charAt(0).toUpperCase() || "·"
  const wash = WASHES[[...seed].reduce((sum, char) => sum + char.charCodeAt(0), 0) % WASHES.length]
  const shift = seed.charCodeAt(0) % 24
  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-el-cream", className)}>
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(60% 70% at ${30 + shift}% ${40 + (shift % 12)}%, ${wash}, transparent 72%)`,
        }}
      />
      <span className="absolute inset-0 flex items-center justify-center font-serif text-[40px] leading-none text-el-gold-deep">
        {initial}
      </span>
    </div>
  )
}
