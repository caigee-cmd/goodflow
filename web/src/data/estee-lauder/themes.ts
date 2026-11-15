import { THEME_LABELS, type Case, type ThemeLabel } from "@/lib/types"

export { THEME_LABELS, type ThemeLabel }

/** Shared English display names for PDF theme chapters, used on the homepage tabs and elsewhere. */
export const THEME_FILTERS = THEME_LABELS.map((label) => ({ id: label, label }))

export const HOME_GALLERY_CHIPS: { id: ThemeLabel | "all"; label: string }[] = [
  { id: "all", label: "All" },
  ...THEME_FILTERS,
]

export function isThemeLabel(value: string | undefined): value is ThemeLabel {
  return Boolean(value && (THEME_LABELS as readonly string[]).includes(value))
}

export function casesForHomeTheme(cases: Case[], theme: ThemeLabel | "all") {
  const pool = theme === "all" ? cases : cases.filter((item) => item.theme === theme)
  return [...pool].sort((a, b) => {
    const featured = Number(Boolean(b.featured)) - Number(Boolean(a.featured))
    if (featured) return featured
    const ay = a.year ?? 0
    const by = b.year ?? 0
    if (by !== ay) return by - ay
    return a.id.localeCompare(b.id)
  })
}
