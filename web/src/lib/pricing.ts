import type { Product } from "@/lib/types"

export const hasPricing = (p: Product) => Boolean(p.priceTiers?.length)

export const tierFor = (p: Product, qty: number) => {
  const tiers = p.priceTiers
  if (!tiers?.length) return undefined
  return [...tiers].reverse().find((t) => qty >= t.moq) ?? tiers[0]
}

export const nextTier = (p: Product, qty: number) => p.priceTiers?.find((t) => t.moq > qty)

export const fromPrice = (p: Product) => p.priceTiers?.[0]?.unitPrice

export const lineTotal = (p: Product, qty: number) => {
  const tier = tierFor(p, qty)
  return tier ? qty * tier.unitPrice : undefined
}

export const minQty = (p: Product) => p.priceTiers?.[0]?.moq ?? 1
