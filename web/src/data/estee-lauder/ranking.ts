import type { RankingBoard, RankingItem } from "@/lib/types"

const item = (id: string, name: string, caseId: string, theme: string): RankingItem => ({
  id,
  name,
  image: `/demo/cases/${caseId}/cover.jpg`,
  caseId,
  theme,
})

// Editorial order follows the source PDF's theme chapters:
// Minimal, Retro, Playful, Christmas, then Collaboration. No popularity metrics.
export const RANKING: RankingBoard = {
  id: "highlighted-cases",
  label: "Highlighted cases",
  items: [
    item("rk-01", "The Prada Purple PR Gift Box Includes A Film Camera", "case-15", "Minimal"),
    item("rk-02", "Chanel Launches Makeup With A Denim-style Pouch", "case-08", "Retro"),
    item("rk-03", "Sephora Collaboration Series: Denim-style Makeup Storage", "case-10", "Retro"),
    item("rk-04", "Peaceminusone Accessories Blend Daisies And Cloud Cat Motifs", "case-21", "Playful"),
    item("rk-05", "Little Ondine’s Red-And-Blue Accessories Take Centre Stage", "case-20", "Playful"),
    item("rk-06", "Beast’s Christmas Collection: A Cosmic Fantasy Unfolds", "case-06", "Christmas"),
    item("rk-07", "Lamer Adds Blind Box Charms To Its Nautical Christmas", "case-03", "Christmas"),
    item("rk-08", "Freeplus × Hello Kitty Dress Beauty Accessories In Fresh Gingham", "case-29", "Collaboration"),
    item("rk-09", "SkinCeuticals Meets Fiiijuju In A Soft Blue Accessories Collection", "case-26", "Collaboration"),
    item("rk-10", "Kiehl’s ×YUQI：Campus Style Through Denim Accessories", "case-27", "Collaboration"),
  ],
}

