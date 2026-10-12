"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { X } from "lucide-react"
import { caseById } from "@/data"
import { occasionLabel } from "@/lib/catalog"
import { ImageStage } from "@/components/media/image-stage"
import { PlaceholderImage } from "@/components/media/placeholder-image"
import { Modal } from "@/components/ui/modal"

export function CaseDialog({
  id,
  onClose,
  onOpenProduct,
}: {
  id: string
  onClose: () => void
  onOpenProduct?: (productId: string) => void
}) {
  const item = caseById(id)
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const occasion = occasionLabel(item.occasions[0])

  function show(next: number) {
    const last = item.images.length - 1
    const wrappedBack = index === 0 && next === last
    const wrappedForward = index === last && next === 0
    setDirection(wrappedBack ? -1 : wrappedForward || next > index ? 1 : -1)
    setIndex(next)
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <Modal
      label={item.title}
      onClose={onClose}
      className="relative grid h-[86vh] w-[92vw] max-w-[1200px] grid-cols-[1fr_300px] gap-8 overflow-hidden rounded-[10px] bg-el-paper p-8 shadow-el-lg"
    >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full border border-el-line bg-el-paper"
        >
          <X className="size-4" strokeWidth={1.5} />
        </button>

        <div className="min-w-0 overflow-auto pr-2">
          <p className="text-[11px] leading-4 font-semibold tracking-[0.16em] text-el-taupe-ink uppercase">
            {occasion} · {item.year} · {item.client}
          </p>
          <h2 className="mt-2 font-serif text-[30px] leading-[38px] tracking-[0.04em] uppercase">{item.title}</h2>
          <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-lg bg-el-cream">
            <ImageStage
              label={item.title}
              seed={`${item.id}-${index}`}
              src={item.images[index]}
              direction={direction}
            />
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => show((index + item.images.length - 1) % item.images.length)}
              className="absolute top-1/2 left-3 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-el-paper/80 text-[18px] backdrop-blur"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => show((index + 1) % item.images.length)}
              className="absolute top-1/2 right-3 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-el-paper/80 text-[18px] backdrop-blur"
            >
              ›
            </button>
          </div>
          <div className="mt-3 flex justify-center gap-2">
            {item.images.map((image, dot) => (
              <button
                key={image}
                type="button"
                aria-label={`Image ${dot + 1}`}
                onClick={() => show(dot)}
                className={dot === index ? "size-1.5 rounded-full bg-el-black" : "size-1.5 rounded-full bg-el-line"}
              />
            ))}
          </div>
          <p className="mt-6 max-w-[680px] text-[14px] leading-6">{item.description}</p>
          <blockquote className="mt-6 border-l-2 border-el-gold bg-el-cream/50 p-4">
            <p className="text-[11px] leading-4 font-semibold tracking-[0.16em] text-el-taupe-ink uppercase">
              Why it worked
            </p>
            <p className="mt-2 text-[14px] leading-6">{item.takeaway}</p>
          </blockquote>
        </div>

        <aside className="flex min-h-0 flex-col border-l border-el-line pl-6">
          <p className="text-[11px] leading-4 font-semibold tracking-[0.16em] text-el-taupe-ink uppercase">In this case</p>
          <div className="mt-4 grid grid-cols-2 gap-4 overflow-auto">
            {item.items.map((piece) => {
              const openable = Boolean(piece.productId && onOpenProduct)
              return (
                <button
                  key={piece.name}
                  type="button"
                  disabled={!openable}
                  onClick={() => piece.productId && onOpenProduct?.(piece.productId)}
                  className="text-center disabled:cursor-default"
                >
                  <div className="mx-auto size-[88px] overflow-hidden rounded-full bg-el-cream">
                    <PlaceholderImage label={piece.name} src={piece.image} className="text-[24px]" />
                  </div>
                  <p className="mt-2 text-[12px] leading-4 font-medium tracking-[0.04em] uppercase">{piece.name}</p>
                  <p className="mt-1 text-[11px] leading-4 text-el-taupe-ink">{piece.spec}</p>
                </button>
              )
            })}
          </div>
          <Link
            href={`/categories?source=all&occasion=${item.occasions[0]}`}
            className="mt-auto flex h-11 items-center justify-center rounded-md bg-el-black text-[12px] font-semibold tracking-[0.12em] text-el-ivory uppercase hover:text-el-gold"
          >
            Browse similar items
          </Link>
        </aside>
    </Modal>
  )
}
