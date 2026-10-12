"use client"

import { PlaceholderImage } from "@/components/media/placeholder-image"

export function DetailsRail({
  title,
  image,
  material,
  size,
  body,
  onContact,
  onOpenProduct,
}: {
  title: string
  image?: string
  material?: string
  size?: string
  body?: string
  onContact: () => void
  onOpenProduct?: () => void
}) {
  return (
    <aside className="sticky top-24 w-[300px] shrink-0 self-start">
      <section className="rounded-[10px] bg-el-paper p-5">
        <h2 className="text-[11px] leading-4 font-semibold tracking-[0.16em] text-el-taupe-ink uppercase">Details</h2>
        <button
          type="button"
          onClick={onOpenProduct}
          disabled={!onOpenProduct}
          className="mt-4 block w-full text-left disabled:cursor-default"
        >
          <span className="block aspect-square overflow-hidden rounded-md bg-el-cream">
            <PlaceholderImage label={title} src={image} className="text-[40px]" />
          </span>
          <span className="mt-4 block font-heading text-[18px] leading-6 font-medium tracking-[0.06em] uppercase">
            {title}
          </span>
        </button>
        {material ? <p className="mt-3 text-[13px] leading-5 text-el-taupe-ink">{material}</p> : null}
        {size && size !== material ? <p className="mt-1 text-[13px] leading-5 text-el-taupe-ink">{size}</p> : null}
        {body ? <p className="mt-4 text-[13px] leading-5">{body}</p> : null}
        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={onContact}
            className="flex h-11 items-center justify-center rounded-md bg-el-black text-[12px] font-semibold tracking-[0.12em] text-el-ivory uppercase"
          >
            Contact Sales
          </button>
          <button
            type="button"
            disabled
            className="flex h-11 items-center justify-center rounded-md border border-el-line text-[12px] font-semibold tracking-[0.12em] text-el-taupe uppercase"
          >
            Add to My Picks
          </button>
          <button
            type="button"
            disabled
            className="flex h-11 items-center justify-center rounded-md border border-el-line text-[12px] font-semibold tracking-[0.12em] text-el-taupe uppercase"
          >
            Download Intent PDF
          </button>
        </div>
      </section>
    </aside>
  )
}
