export type BrandId = string

export type OccasionId = "lunar-new-year" | "holiday" | "vip" | "launch" | "employee"

export type HomeChipId =
  | "collab"
  | "elevated"
  | "everyday"
  | "travel"
  | "feel-good"
  | "heritage"

export type CategoryId =
  | "drinkware"
  | "home-scent"
  | "beauty-accessories"
  | "textiles"
  | "stationery"
  | "festive"

export type Region = "APAC" | "EMEA" | "Americas" | "Global"
export type Source = "archive" | "external"
export type ShippingTerms = "EXW" | "FOB" | "DAP"

export type PriceTier = { moq: number; unitPrice: number; leadTimeDays: number }

type ProductBase = {
  id: string
  name: string
  brands: BrandId[]
  category?: CategoryId
  occasions: OccasionId[]
  year?: number
  images: string[]
  inspiration?: string
  material?: string
  packaging?: string
  size?: string
  priceTiers?: PriceTier[]
  clicks?: number
  featured?: boolean
  theme?: string
  notes?: string
}

export type ArchiveProduct = ProductBase & {
  source: "archive"
  campaign?: string
  regions?: Region[]
}

export type ExternalProduct = ProductBase & {
  source: "external"
  maker: string
}

export type Product = ArchiveProduct | ExternalProduct

export type CaseItem = { name: string; spec?: string; image?: string; productId?: string }

export type Case = {
  id: string
  title: string
  client: string
  kind: "elc" | "industry" | "ip"
  occasions: OccasionId[]
  year?: number
  region?: Region
  cover: string
  coverAspect: "3/4" | "4/5" | "1/1" | "4/3"
  images: string[]
  description?: string
  takeaway?: string
  items: CaseItem[]
  featured?: boolean
  chips: HomeChipId[]
}

export type RankingItem = {
  id: string
  name: string
  image: string
  caseId: string
  theme?: string
  notes?: string
}

export type RankingBoard = {
  id: string
  label: string
  items: RankingItem[]
}

export type RfqLine = {
  productId: string
  qty: number
  terms: ShippingTerms
  selected: boolean
  addedAt: number
}
