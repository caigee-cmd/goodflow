import { describe, expect, it } from "vitest"
import { filtersFromParams, paramsFromFilters } from "./category-query"
import { DEFAULT_FILTERS } from "./filters"

describe("category source navigation", () => {
  it("opens the All tab by default", () => {
    expect(filtersFromParams(new URLSearchParams()).filters).toEqual(DEFAULT_FILTERS)
    expect(DEFAULT_FILTERS.source).toBe("all")
  })

  it("keeps All selected when only the sort changes", () => {
    const parsed = filtersFromParams(new URLSearchParams("sort=newest"))
    expect(parsed.filters.source).toBe("all")
    expect(parsed.sort).toBe("newest")
  })

  it("keeps explicit archive links working", () => {
    expect(filtersFromParams(new URLSearchParams("source=archive")).filters.source).toBe("archive")
  })

  it("round-trips every source tab without changing the other filters", () => {
    for (const source of ["all", "archive", "external"] as const) {
      const filters = { ...DEFAULT_FILTERS, source }
      const params = paramsFromFilters(filters, "featured")
      expect(filtersFromParams(params).filters).toEqual({ ...filters, q: undefined })
    }
  })
})
