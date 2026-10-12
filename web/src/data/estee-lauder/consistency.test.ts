import { describe, expect, it } from "vitest"
import { CASES } from "./cases"
import { PRODUCTS } from "./products"
import { DRINKWARE } from "./ranking"
import { buildRfqEmail } from "@/lib/rfq-email"
import { orderBy } from "@/lib/dates"
import { lineTotal, tierFor } from "@/lib/pricing"
import { DEFAULT_FILTERS, filterProducts, sortProducts } from "@/lib/filters"

const p = (id: string) => PRODUCTS.find((x) => x.id === id)!
const atMoq = (id: string) => ({ id, qty: p(id).priceTiers[0].moq })
const top = (m: "searchHeat" | "caseClicks" | "purchaseVolume") =>
  [...DRINKWARE.items].sort((a, b) => b.metrics[m] - a.metrics[m])[0].name

describe("demo numbers", () => {
  it("B1 basket", () => {
    const lines = ["arc-001", "arc-003", "ext-002", "ext-005"].map(atMoq)
    expect(lines.reduce((s, l) => s + lineTotal(p(l.id), l.qty), 0)).toBe(231_500)
    const maxLead = Math.max(...lines.map((l) => tierFor(p(l.id), l.qty).leadTimeDays))
    expect(orderBy("2027-01-15", maxLead)).toBe("2026-11-01")
  })

  it("trunk tiers", () => {
    expect(lineTotal(p("arc-001"), 3000)).toBe(114_000)
    expect(orderBy("2027-01-15", 70)).toBe("2026-11-06")
    expect(lineTotal(p("arc-001"), 10_000)).toBe(330_000)
    expect(orderBy("2027-01-15", tierFor(p("arc-001"), 10_000).leadTimeDays)).toBe("2026-10-27")
  })

  it("C3 box price", () => {
    expect(p("ext-008").priceTiers[0].unitPrice + p("arc-003").priceTiers[0].unitPrice).toBeCloseTo(19.4)
  })

  it("default categories view", () => {
    const archive = filterProducts(PRODUCTS, DEFAULT_FILTERS)
    expect(archive).toHaveLength(7)
    expect(sortProducts(archive, "featured")[0].id).toBe("arc-001")
    expect(
      PRODUCTS.filter((x) => x.source === "external" && x.brands.includes("estee-lauder")).length,
    ).toBeGreaterThan(0)
  })

  it("B1 candidates", () => {
    const fit = PRODUCTS.filter((x) => x.occasions.includes("lunar-new-year") && x.priceTiers[0].unitPrice <= 60)
    expect(fit).toHaveLength(10)
  })

  it("ranking leaders", () => {
    expect(top("searchHeat")).toBe("Glass Straw Cup 500ml")
    expect(top("caseClicks")).toBe("Double-Wall Ceramic Tumbler")
    expect(top("purchaseVolume")).toBe("Insulated Travel Cup 350ml")
  })

  it("cases", () => {
    expect(CASES.filter((c) => c.occasions.includes("lunar-new-year")).length).toBeGreaterThanOrEqual(4)
    expect(CASES).toHaveLength(20)
  })

  it("catalog shape", () => {
    expect(PRODUCTS).toHaveLength(24)
    expect(DRINKWARE.items).toHaveLength(10)
  })

  it("rfq email snapshot", () => {
    const ids = ["arc-001", "arc-003", "ext-002", "ext-005"]
    const email = buildRfqEmail({
      project: "Lunar New Year 2027 VIP Gifting",
      neededBy: "2027-01-15",
      region: "APAC",
      notes: "Re-run archive pieces with Year of the Goat artwork.",
      lines: ids.map((id) => ({
        productId: id,
        qty: p(id).priceTiers[0].moq,
        terms: "EXW",
        selected: true,
      })),
    })
    expect(email.to).toBe("sales@goodflow.example")
    expect(email.subject).toBe("RFQ — Lunar New Year 2027 VIP Gifting — 4 items")
    expect(email.body).toContain("Estimated total: $231,500")
    expect(email.body).toContain("order by Nov 1, 2026")
    expect(email.body).toContain("Qty 3,000 · $38.00/unit · 70-day lead time · EXW")
    expect(email.body).toContain("Anna Chen")
  })
})
