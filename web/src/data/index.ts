import { CASES } from "./estee-lauder/cases"
import { BRANDS, CATEGORIES, HOME_CHIPS, OCCASIONS, PRICE_OPTIONS } from "./estee-lauder/dictionaries"
import { PRODUCTS } from "./estee-lauder/products"
import { DRINKWARE, METRICS, TRENDING_SEARCHES } from "./estee-lauder/ranking"

export { BRANDS, CATEGORIES, HOME_CHIPS, OCCASIONS, PRICE_OPTIONS, PRODUCTS, CASES, DRINKWARE, METRICS, TRENDING_SEARCHES }

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
