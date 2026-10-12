"use client"

import { Heart, X } from "lucide-react"
import { CASES } from "@/data"
import { PlaceholderImage } from "@/components/media/placeholder-image"
import { Modal } from "@/components/ui/modal"
import { useSaved } from "@/stores/saved"

export function FavoritesDialog({
  onClose,
  onOpenCase,
}: {
  onClose: () => void
  onOpenCase: (id: string) => void
}) {
  const ids = useSaved((state) => state.caseIds)
  const toggle = useSaved((state) => state.toggle)
  const saved = ids.map((id) => CASES.find((item) => item.id === id)).filter((item) => item != null)

  return (
    <Modal
      label="Favorites"
      onClose={onClose}
      className="relative flex h-[78vh] w-[92vw] max-w-[880px] flex-col overflow-hidden rounded-[10px] bg-el-paper p-8 shadow-el-lg"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full border border-el-line bg-el-paper"
      >
        <X className="size-4" strokeWidth={1.5} />
      </button>
      <p className="text-[11px] leading-4 font-semibold tracking-[0.16em] text-el-taupe-ink uppercase">Favorites</p>
      <h2 className="mt-2 font-serif text-[28px] leading-9">Saved cases</h2>
      {saved.length === 0 ? (
        <p className="mt-8 text-[14px] leading-6 text-el-taupe-ink">Nothing saved yet. Tap the heart on a case to keep it here.</p>
      ) : (
        <ul className="mt-6 grid min-h-0 flex-1 grid-cols-2 gap-4 overflow-auto pr-2">
          {saved.map((item) => (
            <li key={item.id} className="flex gap-3 rounded-lg bg-el-cream/50 p-3">
              <button type="button" onClick={() => onOpenCase(item.id)} className="size-24 shrink-0 overflow-hidden rounded-md bg-el-cream">
                <PlaceholderImage label={item.title} src={item.cover} className="text-[28px]" />
              </button>
              <div className="min-w-0 flex-1">
                <button type="button" onClick={() => onOpenCase(item.id)} className="line-clamp-2 text-left text-[14px] leading-5">
                  {item.title}
                </button>
                <p className="mt-1 text-[12px] text-el-taupe-ink">{item.client}</p>
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  className="mt-3 inline-flex items-center gap-1 text-[12px] text-el-taupe-ink hover:text-el-black"
                >
                  <Heart className="size-3.5 fill-el-gold text-el-gold-deep" strokeWidth={1.5} />
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  )
}
