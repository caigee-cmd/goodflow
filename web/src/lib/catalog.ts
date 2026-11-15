import { OCCASIONS } from "@/data"
import type { Case, HomeChipId, OccasionId, Product } from "@/lib/types"
import { fromPrice, hasPricing, minQty } from "@/lib/pricing"

export function occasionLabel(id?: OccasionId) {
  if (!id) return ""
  return OCCASIONS.find((item) => item.id === id)?.label ?? id
}

export function occasionShort(id?: OccasionId) {
  if (!id) return ""
  return OCCASIONS.find((item) => item.id === id)?.short ?? id
}

export function sortCases(cases: Case[], chip: HomeChipId | "all") {
  const pool = chip === "all" ? cases : cases.filter((item) => item.chips.includes(chip))
  return [...pool].sort((a, b) => {
    const featured = Number(Boolean(b.featured)) - Number(Boolean(a.featured))
    if (featured) return featured
    const ay = a.year ?? 0
    const by = b.year ?? 0
    if (by !== ay) return by - ay
    return a.id.localeCompare(b.id)
  })
}

export function featuredProducts(products: Product[]) {
  return products
    .filter((item) => item.featured)
    .sort((a, b) => (b.clicks ?? 0) - (a.clicks ?? 0))
}

export function fromLabel(product: Product) {
  if (!hasPricing(product)) return ""
  const price = fromPrice(product)!
  const formatted = price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  })
  return `From ${formatted} · MOQ ${minQty(product).toLocaleString("en-US")}`
}

export function campaignShort(product: Product) {
  const bits: string[] = []
  if (product.source === "archive" && product.campaign) {
    const year = product.campaign.match(/\d{4}/)?.[0] ?? (product.year != null ? String(product.year) : "")
    if (year) bits.push(year)
  } else if (product.year != null) {
    bits.push(String(product.year))
  }
  if (product.occasions[0]) bits.push(occasionShort(product.occasions[0]))
  else if (product.theme) bits.push(product.theme)
  return bits.join(" ")
}
