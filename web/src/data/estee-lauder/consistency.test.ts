import { describe, expect, it } from "vitest"
import { CASES } from "./cases"
import { PRODUCTS } from "./products"
import { RANKING } from "./ranking"
import { buildRfqEmail } from "@/lib/rfq-email"
import { DEFAULT_FILTERS, filterProducts, sortProducts } from "@/lib/filters"
import { hasPricing } from "@/lib/pricing"

const p = (id: string) => PRODUCTS.find((x) => x.id === id)!

describe("trend catalog", () => {
  it("has 29 campaign cases and products", () => {
    expect(CASES).toHaveLength(29)
    expect(PRODUCTS).toHaveLength(29)
    expect(CASES.map((item) => item.id)).toEqual(Array.from({ length: 29 }, (_, i) => `case-${String(i + 1).padStart(2, "0")}`))
    expect(PRODUCTS.map((item) => item.id)).toEqual(Array.from({ length: 29 }, (_, i) => `ext-${String(i + 1).padStart(3, "0")}`))
  })

  it("does not invent commercial fields", () => {
    expect(PRODUCTS.every((item) => !hasPricing(item))).toBe(true)
    expect(PRODUCTS.every((item) => !item.material && !item.packaging && !item.size && !item.category)).toBe(true)
    expect(CASES.every((item) => !item.description && !item.takeaway && item.items.length === 0)).toBe(true)
  })

  it("keeps known campaign facts", () => {
    expect(p("ext-001").name).toBe("Charlotte Tilbury2026圣诞礼盒")
    expect(p("ext-001").brands).toEqual(["charlotte-tilbury"])
    expect(p("ext-002").name).toBe("Dior Holiday limited Collection 2026")
    expect(p("ext-023").name).toBe("SK-II×CRY BABY 联名系列")
    expect(CASES[0].year).toBe(2026)
    expect(CASES[0].occasions).toEqual(["holiday"])
    expect(CASES.filter((item) => item.occasions.includes("holiday")).length).toBeGreaterThanOrEqual(6)
  })

  it("default categories view shows the full catalog", () => {
    const visible = filterProducts(PRODUCTS, DEFAULT_FILTERS)
    expect(DEFAULT_FILTERS.source).toBe("all")
    expect(DEFAULT_FILTERS.brands).toEqual([])
    expect(visible).toHaveLength(29)
    expect(sortProducts(visible, "featured")[0].featured).toBe(true)
  })

  it("ranking has exactly 10 highlighted cases linked to catalog records", () => {
    expect(RANKING.items).toHaveLength(10)
    expect(new Set(RANKING.items.map((item) => item.name)).size).toBe(10)
    expect(RANKING.items.map((item) => item.name)).toEqual([
      "The Prada Purple PR Gift Box Includes A Film Camera",
      "Chanel Launches Makeup With A Denim-style Pouch",
      "Sephora Collaboration Series: Denim-style Makeup Storage",
      "Peaceminusone Accessories Blend Daisies And Cloud Cat Motifs",
      "Little Ondine’s Red-And-Blue Accessories Take Centre Stage",
      "Beast’s Christmas Collection: A Cosmic Fantasy Unfolds",
      "Lamer Adds Blind Box Charms To Its Nautical Christmas",
      "Freeplus × Hello Kitty Dress Beauty Accessories In Fresh Gingham",
      "SkinCeuticals Meets Fiiijuju In A Soft Blue Accessories Collection",
      "Kiehl’s ×YUQI：Campus Style Through Denim Accessories",
    ])
    const caseIds = RANKING.items.map((item) => item.caseId)
    expect(caseIds).toEqual([
      "case-15",
      "case-08",
      "case-10",
      "case-20",
      "case-19",
      "case-06",
      "case-03",
      "case-29",
      "case-26",
      "case-27",
    ])
    expect(caseIds.every((id) => CASES.some((item) => item.id === id))).toBe(true)
    expect(RANKING.items.every((item) => item.image === `/demo/cases/${item.caseId}/cover.jpg`)).toBe(true)
    expect(RANKING.items.every((item) => !("metrics" in item) && !("productId" in item))).toBe(true)
  })

  it("rfq email asks for a quote without invented totals", () => {
    const ids = ["ext-001", "ext-002", "ext-003", "ext-005"]
    const email = buildRfqEmail({
      project: "Holiday 2026 gifting",
      neededBy: "2026-12-01",
      region: "APAC",
      notes: "Please quote these 2026 holiday collections.",
      lines: ids.map((id) => ({
        productId: id,
        qty: 1,
        terms: "EXW",
        selected: true,
      })),
    })
    expect(email.to).toBe("sales@goodflow.example")
    expect(email.subject).toBe("RFQ — Holiday 2026 gifting — 4 items")
    expect(email.body).toContain("Charlotte Tilbury2026圣诞礼盒")
    expect(email.body).toContain("Dior Holiday limited Collection 2026")
    expect(email.body).not.toContain("Estimated total")
    expect(email.body).toContain("Please provide unit pricing, MOQ, and lead time")
    expect(email.body).toContain("Anna Chen")
  })
})
