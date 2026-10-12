import Image from "next/image"
import { demoImage } from "@/lib/demo-images"
import { cn } from "@/lib/utils"

const TONES = ["#E7D3B4", "#D8C4A4", "#CDB892", "#EFE2CE", "#C4A574", "#B7A48C"]

export function PlaceholderCup({
  name,
  seed,
  src,
  className,
}: {
  name: string
  seed: string
  src?: string
  className?: string
}) {
  const real = demoImage(src)
  if (real) {
    return (
      <div className={cn("relative h-full w-full", className)}>
        <Image src={real} alt={name} fill sizes="240px" className="object-cover" />
      </div>
    )
  }
  const tone = TONES[seed.charCodeAt(seed.length - 1) % TONES.length]
  const initial = name.trim().charAt(0).toUpperCase()

  return (
    <svg viewBox="0 0 160 200" className={cn("h-full w-full", className)} aria-hidden>
      <rect width="160" height="200" fill="#EFE8DC" />
      <path d="M46 36h68l-6 118H52L46 36z" fill={tone} />
      <path d="M52 42h56l-5 106H57L52 42z" fill="#FFFDF9" fillOpacity="0.35" />
      <path d="M114 58h16c10 0 16 8 16 18s-6 18-16 18h-14" fill="none" stroke={tone} strokeWidth="8" />
      <rect x="58" y="158" width="44" height="6" rx="1" fill={tone} />
      <text
        x="80"
        y="112"
        textAnchor="middle"
        fill="#8C6B3E"
        fontFamily="var(--font-bodoni), serif"
        fontSize="36"
      >
        {initial}
      </text>
    </svg>
  )
}
