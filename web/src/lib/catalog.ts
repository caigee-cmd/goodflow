import { OCCASIONS } from "@/data"
import type { Case, HomeChipId, OccasionId, Product } from "@/lib/types"
import { fromPrice } from "@/lib/pricing"

export function occasionLabel(id: OccasionId) {
  return OCCASIONS.find((item) => item.id === id)?.label ?? id
}

export function occasionShort(id: OccasionId) {
  return OCCASIONS.find((item) => item.id === id)?.short ?? id
}

export function sortCases(cases: Case[], chip: HomeChipId | "all") {
  const pool = chip === "all" ? cases : cases.filter((item) => item.chips.includes(chip))
  return [...pool].sort((a, b) => {
    const featured = Number(Boolean(b.featured)) - Number(Boolean(a.featured))
    if (featured) return featured
    if (b.year !== a.year) return b.year - a.year
    return a.id.localeCompare(b.id)
  })
}

export function featuredProducts(products: Product[]) {
  return products
    .filter((item) => item.featured && item.source === "archive")
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5)
}

export function fromLabel(product: Product) {
  const price = fromPrice(product).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  })
  return `From ${price} · MOQ ${product.priceTiers[0].moq.toLocaleString("en-US")}`
}

export function campaignShort(product: Product) {
  if (product.source !== "archive") return ""
  const year = product.campaign.match(/\d{4}/)?.[0] ?? String(product.year)
  return `${year} ${occasionShort(product.occasions[0])}`
}
