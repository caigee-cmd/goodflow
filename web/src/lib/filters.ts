import type { CategoryId, OccasionId, Product, Source } from "@/lib/types"
import { fromPrice } from "@/lib/pricing"

export type SortId = "featured" | "newest" | "price-asc" | "clicks"

export type ProductFilters = {
  source: "all" | Source
  brands: string[]
  categories: CategoryId[]
  occasions: OccasionId[]
  maxPrice: number | null
  q?: string
}

export const DEFAULT_FILTERS: ProductFilters = {
  source: "all",
  brands: ["estee-lauder"],
  categories: [],
  occasions: [],
  maxPrice: null,
}

export function matches(product: Product, filters: ProductFilters) {
  if (filters.source !== "all" && product.source !== filters.source) return false
  if (filters.brands.length && !product.brands.some((id) => filters.brands.includes(id))) return false
  if (filters.categories.length && !filters.categories.includes(product.category)) return false
  if (filters.occasions.length && !product.occasions.some((id) => filters.occasions.includes(id))) return false
  if (filters.maxPrice != null && fromPrice(product) > filters.maxPrice) return false
  if (filters.q) {
    const q = filters.q.toLowerCase()
    const maker = product.source === "external" ? product.maker : ""
    const campaign = product.source === "archive" ? product.campaign : ""
    const haystack = `${product.name} ${maker} ${campaign}`.toLowerCase()
    if (!haystack.includes(q)) return false
  }
  return true
}

export function filterProducts(products: Product[], filters: ProductFilters) {
  return products.filter((product) => matches(product, filters))
}

export function sortProducts(products: Product[], sort: SortId) {
  const copy = [...products]
  copy.sort((a, b) => {
    if (sort === "featured") {
      const featured = Number(Boolean(b.featured)) - Number(Boolean(a.featured))
      if (featured) return featured
      return b.clicks - a.clicks
    }
    if (sort === "newest") {
      if (b.year !== a.year) return b.year - a.year
      return b.clicks - a.clicks
    }
    if (sort === "price-asc") return fromPrice(a) - fromPrice(b)
    return b.clicks - a.clicks
  })
  return copy
}
