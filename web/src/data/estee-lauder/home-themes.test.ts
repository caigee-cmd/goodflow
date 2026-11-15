import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import { THEME_LABELS } from "@/lib/types"
import { CASES } from "./cases"
import { PRODUCTS } from "./products"
import { HOME_GALLERY_CHIPS, casesForHomeTheme } from "./themes"

const GALLERY_SOURCE = readFileSync(path.resolve(import.meta.dirname, "../../components/cases/home-gallery.tsx"), "utf8")
const DIALOG_SOURCE = readFileSync(path.resolve(import.meta.dirname, "../../components/cases/case-dialog.tsx"), "utf8")

const CHINESE_THEME_LABELS = [
  "极简合集",
  "复古合集",
  "童趣合集",
  "圣诞合集",
  "联名合集",
  "极简 / Minimal",
  "复古 / Retro",
  "童趣 / Playful",
  "圣诞季 / Christmas",
  "联名 / Colab",
  "Popular",
  "Holiday",
  "Beauty",
  "Lifestyle",
  "Corporate",
]

describe("homepage theme tabs and case cards", () => {
  it("uses the shared English theme labels on the homepage filter path", () => {
    expect(THEME_LABELS).toEqual(["Minimal", "Retro", "Playful", "Christmas", "Collaboration"])
    expect(HOME_GALLERY_CHIPS.map((item) => item.label)).toEqual([
      "All",
      "Minimal",
      "Retro",
      "Playful",
      "Christmas",
      "Collaboration",
    ])
    expect(GALLERY_SOURCE).toContain("HOME_GALLERY_CHIPS")
    expect(GALLERY_SOURCE).toContain("casesForHomeTheme")
    for (const label of CHINESE_THEME_LABELS) {
      expect(GALLERY_SOURCE, label).not.toContain(label)
      expect(HOME_GALLERY_CHIPS.some((item) => item.label === label || item.id === label)).toBe(false)
    }
  })

  it("filters the homepage gallery by case theme, not leftover chip ids", () => {
    expect(CASES).toHaveLength(29)
    expect(CASES.every((item) => item.theme && THEME_LABELS.includes(item.theme))).toBe(true)
    expect(casesForHomeTheme(CASES, "all")).toHaveLength(29)
    expect(casesForHomeTheme(CASES, "Christmas")).toHaveLength(6)
    expect(casesForHomeTheme(CASES, "Retro")).toHaveLength(5)
    expect(casesForHomeTheme(CASES, "Minimal")).toHaveLength(6)
    expect(casesForHomeTheme(CASES, "Playful")).toHaveLength(6)
    expect(casesForHomeTheme(CASES, "Collaboration")).toHaveLength(6)
    expect(casesForHomeTheme(CASES, "Christmas").every((item) => item.theme === "Christmas")).toBe(true)
    const byCase = Object.fromEntries(CASES.map((item) => [item.id, item.theme]))
    const byProduct = Object.fromEntries(
      PRODUCTS.map((item, index) => [`case-${String(index + 1).padStart(2, "0")}`, item.theme]),
    )
    expect(byCase).toEqual(byProduct)
  })

  it("shows only the case title on homepage cards and keeps full prose in detail", () => {
    const card = GALLERY_SOURCE.slice(GALLERY_SOURCE.indexOf("function CaseCard"), GALLERY_SOURCE.indexOf("export function HomeGallery"))
    expect(card).toContain("item.title")
    expect(card).not.toContain("item.takeaway")
    expect(card).not.toContain("item.description")
    expect(DIALOG_SOURCE).toContain("item.description")
    expect(DIALOG_SOURCE).toContain("item.takeaway")
    expect(CASES.filter((item) => item.takeaway).length).toBe(28)
    expect(CASES.filter((item) => item.description).length).toBe(28)
  })
})
