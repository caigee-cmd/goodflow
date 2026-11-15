import { CASES } from "./estee-lauder/cases"
import { BRANDS, CATEGORIES, HOME_CHIPS, OCCASIONS, PRICE_OPTIONS } from "./estee-lauder/dictionaries"
import { HOME_GALLERY_CHIPS, THEME_LABELS } from "./estee-lauder/themes"
import { PRODUCTS } from "./estee-lauder/products"
import { RANKING } from "./estee-lauder/ranking"

export { BRANDS, CATEGORIES, HOME_CHIPS, OCCASIONS, PRICE_OPTIONS, PRODUCTS, CASES, RANKING, HOME_GALLERY_CHIPS, THEME_LABELS }

export function product(id: string) {
  const found = PRODUCTS.find((item) => item.id === id)
  if (!found) throw new Error(`Unknown product: ${id}`)
  return found
}

export function caseById(id: string) {
  const found = CASES.find((item) => item.id === id)
  if (!found) throw new Error(`Unknown case: ${id}`)
  return found
}
