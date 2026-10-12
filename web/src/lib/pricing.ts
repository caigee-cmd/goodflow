import type { Product } from "@/lib/types"

export const tierFor = (p: Product, qty: number) =>
  [...p.priceTiers].reverse().find((t) => qty >= t.moq) ?? p.priceTiers[0]

export const nextTier = (p: Product, qty: number) => p.priceTiers.find((t) => t.moq > qty)

export const fromPrice = (p: Product) => p.priceTiers[0].unitPrice

export const lineTotal = (p: Product, qty: number) => qty * tierFor(p, qty).unitPrice
