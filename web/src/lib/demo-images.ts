// Images that actually exist under public/demo. Any other path falls back to a placeholder.
const CASE_IDS = ["case-01", "case-02", "case-03", "case-04", "case-05", "case-06", "case-07", "case-08", "case-09", "case-10", "case-11", "case-12", "case-13", "case-14", "case-15", "case-16", "case-17", "case-18", "case-19", "case-20"]
const PRODUCT_IDS = [
  "arc-001", "arc-002", "arc-003", "arc-004", "arc-005", "arc-006", "arc-007", "arc-008", "arc-009", "arc-010", "arc-011", "arc-012", "ext-001", "ext-002", "ext-003", "ext-004", "ext-005", "ext-006", "ext-007", "ext-008", "ext-009", "ext-010", "ext-011", "ext-012",
]
const RANKING_IDS = ["rk-01", "rk-02", "rk-03", "rk-04", "rk-05", "rk-06", "rk-07", "rk-08", "rk-09", "rk-10"]

const AVAILABLE = new Set([
  ...CASE_IDS.flatMap((id) => [
    `/demo/cases/${id}/cover.jpg`,
    ...[1, 2, 3, 4].map((n) => `/demo/cases/${id}/0${n}.jpg`),
    ...[1, 2, 3, 4].map((n) => `/demo/cases/${id}/items/0${n}.jpg`),
  ]),
  ...PRODUCT_IDS.flatMap((id) => [1, 2, 3].map((n) => `/demo/products/${id}/0${n}.jpg`)),
  ...RANKING_IDS.map((id) => `/demo/ranking/drinkware/${id}.jpg`),
])

export function demoImage(src?: string) {
  return src && AVAILABLE.has(src) ? src : undefined
}
