import { brand } from "@/config/brand"
import { cn } from "@/lib/utils"

export function Wordmark({ className }: { className?: string }) {
  if (brand.logoSrc) {
    return (
      // Official wordmark, once licensed. Text fallback stays in the tree for the name.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={brand.logoSrc} alt={brand.wordmark} className={cn("h-6 w-auto", className)} />
    )
  }

  return (
    <span
      className={cn(
        "inline-block font-serif font-medium uppercase tracking-[0.28em] mr-[-0.28em]",
        className,
      )}
    >
      {brand.wordmark}
    </span>
  )
}
