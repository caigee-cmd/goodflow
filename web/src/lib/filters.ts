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
  brands: [],
  categories: [],
  occasions: [],
  maxPrice: null,
}

export function matches(product: Product, filters: ProductFilters) {
  if (filters.source !== "all" && product.source !== filters.source) return false
  if (filters.brands.length && !product.brands.some((id) => filters.brands.includes(id))) return false
  if (filters.categories.length && (!product.category || !filters.categories.includes(product.category))) return false
  if (filters.occasions.length && !product.occasions.some((id) => filters.occasions.includes(id))) return false
  if (filters.maxPrice != null) {
    const price = fromPrice(product)
    if (price == null || price > filters.maxPrice) return false
  }
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
      return (b.clicks ?? 0) - (a.clicks ?? 0)
    }
    if (sort === "newest") {
      const ay = a.year ?? 0
      const by = b.year ?? 0
      if (by !== ay) return by - ay
      return (b.clicks ?? 0) - (a.clicks ?? 0)
    }
    if (sort === "price-asc") {
      const pa = fromPrice(a)
      const pb = fromPrice(b)
      if (pa == null && pb == null) return 0
      if (pa == null) return 1
      if (pb == null) return -1
      return pa - pb
    }
    return (b.clicks ?? 0) - (a.clicks ?? 0)
  })
  return copy
}
