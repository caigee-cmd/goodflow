import { brand } from "@/config/brand"

export const addDays = (iso: string, days: number) => {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

export const orderBy = (neededBy: string, leadDays: number) => addDays(neededBy, -leadDays)

export const daysUntil = (iso: string, today = brand.demoToday) =>
  Math.round((Date.parse(iso) - Date.parse(today)) / 86_400_000)

export const fmtDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })

export const money = (n: number, digits: 0 | 2 = 2) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
