import type { RankingBoard, RankingItem } from "@/lib/types"

const item = (id: string, name: string, caseId: string, theme: string): RankingItem => ({
  id,
  name,
  image: `/demo/cases/${caseId}/cover.jpg`,
  caseId,
  theme,
})

// Editorial order follows the source PDF's theme chapters:
// Minimal, Retro, Playful, Holiday, then Collab. No popularity metrics.
export const RANKING: RankingBoard = {
  id: "highlighted-cases",
  label: "Highlighted cases",
  items: [
    item("rk-01", "The Prada Purple PR Gift Box Includes A Film Camera", "case-15", "极简合集"),
    item("rk-02", "Chanel Launches Makeup With A Denim-style Pouch", "case-08", "复古合集"),
    item("rk-03", "Sephora Collaboration Series: Denim-style Makeup Storage", "case-10", "复古合集"),
    item("rk-04", "Peaceminusone Accessories Blend Daisies And Cloud Cat Motifs", "case-20", "童趣合集"),
    item("rk-05", "Little Ondine’s Red-And-Blue Accessories Take Centre Stage", "case-19", "童趣合集"),
    item("rk-06", "Beast’s Christmas Collection: A Cosmic Fantasy Unfolds", "case-06", "圣诞合集"),
    item("rk-07", "Lamer Adds Blind Box Charms To Its Nautical Christmas", "case-03", "圣诞合集"),
    item("rk-08", "Freeplus × Hello Kitty Dress Beauty Accessories In Fresh Gingham", "case-29", "联名合集"),
    item("rk-09", "SkinCeuticals Meets Fiiijuju In A Soft Blue Accessories Collection", "case-26", "联名合集"),
    item("rk-10", "Kiehl’s ×YUQI：Campus Style Through Denim Accessories", "case-27", "联名合集"),
  ],
}

