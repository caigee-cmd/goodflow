import type { RankingBoard, RankingItem } from "@/lib/types"

export const METRICS = [
  { id: "searchHeat", label: "Search heat", unit: "SEARCHES" },
  { id: "caseClicks", label: "Case clicks", unit: "CLICKS" },
  { id: "purchaseVolume", label: "Public purchase volume", unit: "UNITS" },
] as const

const item = (
  id: string,
  name: string,
  searchHeat: number,
  searchHeatPrevRank: number | null,
  caseClicks: number,
  purchaseVolume: number,
  productId?: string,
): RankingItem => ({
  id,
  name,
  image: `/demo/ranking/drinkware/${id}.jpg`,
  productId,
  searchHeatPrevRank,
  metrics: { searchHeat, caseClicks, purchaseVolume },
})

export const DRINKWARE: RankingBoard = {
  id: "drinkware",
  label: "Drinkware",
  period: "Jul–Sep 2026",
  items: [
    item("rk-01", "Glass Straw Cup 500ml", 18420, 4, 4120, 154300, "ext-007"),
    item("rk-02", "Smart Temperature Bottle", 16950, 1, 3010, 64900, "ext-010"),
    item("rk-03", "Double-Wall Ceramic Tumbler", 15310, 3, 4860, 131800, "ext-008"),
    item("rk-04", "Insulated Travel Cup 350ml", 13880, 2, 1960, 212000, "ext-009"),
    item("rk-05", "Matte Stoneware Mug", 11240, 5, 2240, 186500, "arc-010"),
    item("rk-06", "Bamboo Lid Glass Tumbler", 9870, 9, 3540, 41300, "ext-007"),
    item("rk-07", "Portable Cold Brew Bottle", 8650, null, 2680, 23700),
    item("rk-08", "Collapsible Silicone Cup", 7420, 6, 860, 87200),
    item("rk-09", "Enamel Camping Mug", 6180, 7, 1180, 98400),
    item("rk-10", "Frosted Glass Coffee Cup", 5030, 8, 1520, 52600),
  ],
}

export const TRENDING_SEARCHES = [
  "glass straw cup",
  "year of the goat",
  "red lacquer",
  "eco packaging",
  "smart bottle",
  "silk pouch",
  "refillable",
  "ceramic tumbler",
  "gold foil",
  "travel kit",
] as const
