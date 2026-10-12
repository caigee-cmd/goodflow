import { BRANDS, CATEGORIES, OCCASIONS } from "@/data"
import { DEFAULT_FILTERS, type ProductFilters, type SortId } from "@/lib/filters"
import type { CategoryId, OccasionId } from "@/lib/types"

const SORTS: SortId[] = ["featured", "newest", "price-asc", "clicks"]

function list(value: string | undefined) {
  return value ? value.split(",").filter(Boolean) : []
}

export function filtersFromParams(params: URLSearchParams): { filters: ProductFilters; sort: SortId } {
  const hasAny = [...params.keys()].some((key) => key !== "sort")
  const source = params.get("source")
  const brands = list(params.get("brand") ?? undefined)
  const categories = list(params.get("category") ?? undefined).filter((id): id is CategoryId =>
    CATEGORIES.some((item) => item.id === id),
  )
  const occasions = list(params.get("occasion") ?? undefined).filter((id): id is OccasionId =>
    OCCASIONS.some((item) => item.id === id),
  )
  const price = Number(params.get("maxPrice"))
  const sort = SORTS.find((id) => id === params.get("sort")) ?? "featured"
  const knownBrands = brands.filter((id) => BRANDS.some((item) => item.id === id))

  if (!hasAny) return { filters: DEFAULT_FILTERS, sort }

  return {
    sort,
    filters: {
      source: source === "all" || source === "external" || source === "archive" ? source : "all",
      brands: knownBrands,
      categories,
      occasions,
      maxPrice: [20, 60, 120].includes(price) ? price : null,
      q: params.get("q") ?? undefined,
    },
  }
}

export function paramsFromFilters(filters: ProductFilters, sort: SortId) {
  const params = new URLSearchParams()
  if (filters.source !== "all") params.set("source", filters.source)
  if (filters.brands.length) params.set("brand", filters.brands.join(","))
  if (filters.categories.length) params.set("category", filters.categories.join(","))
  if (filters.occasions.length) params.set("occasion", filters.occasions.join(","))
  if (filters.maxPrice != null) params.set("maxPrice", String(filters.maxPrice))
  if (filters.q) params.set("q", filters.q)
  if (sort !== "featured") params.set("sort", sort)
  return params
}
