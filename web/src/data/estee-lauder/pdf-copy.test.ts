import { describe, expect, it } from "vitest"
import { CASES } from "./cases"
import { PRODUCTS } from "./products"
import { RANKING } from "./ranking"

const MATCHED_IDS = [
  "case-01",
  "case-02",
  "case-03",
  "case-05",
  "case-06",
  "case-07",
  "case-08",
  "case-09",
  "case-10",
  "case-11",
  "case-12",
  "case-13",
  "case-14",
  "case-15",
  "case-16",
  "case-17",
  "case-18",
  "case-19",
  "case-20",
  "case-21",
  "case-22",
  "case-23",
  "case-24",
  "case-25",
  "case-26",
  "case-27",
  "case-28",
  "case-29"
] as const

const PDF_TITLES: Record<string, { title: string; startPage: number; excerpt: string }> = {
  "case-01": {
    "title": "Charlotte Tilbury’s Festive Accessories Meet Hollywood Glamour",
    "startPage": 18,
    "excerpt": "Inspired by Hollywood glamour, Charlotte Tilbury’s 2026 Christmas gift set pairs red and gold packaging with jewel-like drawer handles, revealing makeup, skincare and exclusive accessories."
  },
  "case-02": {
    "title": "Dior’s Star-Shaped Calendar Reveals Festive Treasures",
    "startPage": 14,
    "excerpt": "Dior’s 2026 holiday advent calendar reimagines the iconic Dior star with architectural details inspired by 30 Avenue Montaigne."
  },
  "case-03": {
    "title": "Lamer Adds Blind Box Charms To Its Nautical Christmas",
    "startPage": 17,
    "excerpt": "Lamer’s 2026 Christmas collection transforms gift boxes into ships filled with surprises, painting starry skies and ocean scenes in deep navy, emerald green and gold."
  },
  "case-05": {
    "title": "YSL Pairs Burgundy Gift Packaging With Golden Beauty Accessories",
    "startPage": 15,
    "excerpt": "The YSL 2026 holiday gift set pairs rich burgundy with gold accents, transforming a Christmas tree silhouette into a layered gift-box design."
  },
  "case-06": {
    "title": "Beast’s Christmas Collection: A Cosmic Fantasy Unfolds",
    "startPage": 16,
    "excerpt": "Beast’s 2025 Christmas collection brings “Fruitiverse Adventure” to life with Captain Snow Monster, planets and gemstone motifs across gift boxes and fragrance accessories."
  },
  "case-07": {
    "title": "Amuse Soup Core Edition Brings Comfort On Cold Days",
    "startPage": 8,
    "excerpt": "Amuse introduces the Soup Core Edition, themed around a warm and cozy atmosphere."
  },
  "case-08": {
    "title": "Chanel Launches Makeup With A Denim-style Pouch",
    "startPage": 5,
    "excerpt": "Chanel launches a new collection inspired by denim style. This collection includes the four-color eyeshadow palette, the highlighter palette, the hand cream, the lipstick and other products."
  },
  "case-09": {
    "title": "Fkeme Qixi Gift Box’s Theme: “A LETTER TO ME”",
    "startPage": 7,
    "excerpt": "Fakeme celebrates Qixi with its “A LETTER TO ME” gift box, turning the sentiment of the occasion into a romantic letter to oneself."
  },
  "case-10": {
    "title": "Sephora Collaboration Series: Denim-style Makeup Storage",
    "startPage": 6,
    "excerpt": "Sephora has teamed up with Goodbai Goodees to present the Star Denim Collaboration Collection."
  },
  "case-11": {
    "title": "Songmont’s Lattice Bucket Bag, Styled With A Statement Charm",
    "startPage": 8,
    "excerpt": "Songmont's lattice bucket bag makes a fall/winter debut with an exclusive new colorway."
  },
  "case-12": {
    "title": "ALO Meets Your Daily Outings And Outfits",
    "startPage": 4,
    "excerpt": "ALO introduces a bordeaux-red bag collection, bringing minimalist elegance to everyday outings."
  },
  "case-13": {
    "title": "Blue Bottle's Newest Warm-winter Green Drinkware",
    "startPage": 1,
    "excerpt": "Blue Bottle introduces a Christmas limited-edition collection in winter pine green, bringing an understated touch of seasonal warmth."
  },
  "case-14": {
    "title": "POP MART Launches The Hirono Scented Candle Collection",
    "startPage": 1,
    "excerpt": "This scented candle collection brings Hirono’s soothing spirit into everyday fragrance. Each candle is housed in a square white ceramic vessel, with a sculptural Hirono figure adorning the lid for a refined, tactile finish."
  },
  "case-15": {
    "title": "The Prada Purple PR Gift Box Includes A Film Camera",
    "startPage": 3,
    "excerpt": "The new products of Prada have been launched, along with the PR gift box used for promotional purposes."
  },
  "case-16": {
    "title": "Rarebeauty Holiday Set Comes With A Cute Storage Pouch",
    "startPage": 2,
    "excerpt": "This set combines style with everyday practicality. It includes a pink mini bag, a matte bouncy blush, a liquid blush, and a lip gloss."
  },
  "case-17": {
    "title": "Rhode Snap-on Lip Case Gives The Lip Gloss A Home",
    "startPage": 4,
    "excerpt": "Rhode Spring Limited Edition. The brand integrates the lip gloss storage into the phone case, offering both an all-in-one phone case and a detachable magnetic version."
  },
  "case-18": {
    "title": "3CE×Mikshimai Adds A Standout Touch To Summer Outfits",
    "startPage": 13,
    "excerpt": "3CE has teamed up with Mikshimai to unveil a playful summer collaboration collection."
  },
  "case-19": {
    "title": "Amuse × Monchhichi Turns Vintage Toys Into Collectible Makeup",
    "startPage": 14,
    "excerpt": "A miniature game console filled with cheek colour, a ring concealing lip balm, a beauty capsule waiting to be opened—AMUSE reimagines Monchhichi through the familiar forms of vintage toys."
  },
  "case-20": {
    "title": "Little Ondine’s Red-And-Blue Accessories Take Centre Stage",
    "startPage": 11,
    "excerpt": "Inspired by the sorceress Circe, Little Ondine’s Witch’s Trick makeup gift set creates a mysterious theatrical atmosphere through its tent-shaped box, contrasting red and blue tones, and starburst motifs."
  },
  "case-21": {
    "title": "Peaceminusone Accessories Blend Daisies And Cloud Cat Motifs",
    "startPage": 9,
    "excerpt": "The Peaceminusone × Zo&Friends collection combines signature daisies with ZOA’s flower-shaped footprints across plush toys, bags, charms and home accessories."
  },
  "case-22": {
    "title": "Rom&nd’s Anniversary Mirrors Get A DIY Touch",
    "startPage": 10,
    "excerpt": "rom&nd’s 10th anniversary collection celebrates “Dear Bestie,” thanking its community through a birthday-party theme."
  },
  "case-23": {
    "title": "SK-II×Crybaby：Where The Designer Toy Meets Skincare",
    "startPage": 12,
    "excerpt": "The SK-II × Crybaby collaboration gift box makes its debut for the Qixi Festival season."
  },
  "case-24": {
    "title": "HBN Celebrates Its Anniversary With Silence Wang Keepsakes",
    "startPage": 22,
    "excerpt": "HBN marks its seventh anniversary with a music-inspired gift collection featuring SILENCE WANG."
  },
  "case-25": {
    "title": "Huxley’s Fragrant Holiday Gifts Get A Monchhichi Makeover",
    "startPage": 19,
    "excerpt": "Korean fragrance brand Huxley partners with the lovable Monchhichi for a limited-edition holiday collection, pairing scented hand cream with a Monchhichi-print drawstring pouch."
  },
  "case-26": {
    "title": "SkinCeuticals Meets Fiiijuju In A Soft Blue Accessories Collection",
    "startPage": 21,
    "excerpt": "SkinCeuticals’ “Little Silver Umbrella” sunscreen collaboration with fiiijuju brings sun-care themes and the character’s soft, rounded silhouette to limited-edition packaging and accessories."
  },
  "case-27": {
    "title": "Kiehl’s ×YUQI：Campus Style Through Denim Accessories",
    "startPage": 23,
    "excerpt": "The Kiehl’s × YUQI ambassador gift set captures campus style through a collection of denim-blue accessories."
  },
  "case-28": {
    "title": "Chando × Yuy Adds An Artistic Touch To Beauty Accessories",
    "startPage": 20,
    "excerpt": "The Chando × yuy Limited-Edition Renewal Gift Set pairs Himalayan Essence with character-themed accessories, bringing skincare and illustration together."
  },
  "case-29": {
    "title": "Freeplus × Hello Kitty Dress Beauty Accessories In Fresh Gingham",
    "startPage": 18,
    "excerpt": "Freeplus joins Hello Kitty in a collection featuring light blue gingham and bow motifs across packaging and accessories."
  }
}

describe("PDF-sourced catalog copy", () => {
  it("fills all 28 matched cases with unique nonempty English descriptions", () => {
    const matched = CASES.filter((item) => (MATCHED_IDS as readonly string[]).includes(item.id))
    expect(matched).toHaveLength(28)
    for (const item of matched) {
      const expected = PDF_TITLES[item.id]
      expect(item.title).toBe(expected.title)
      expect(item.description && item.description.length).toBeGreaterThan(80)
      expect(item.description).toContain(expected.excerpt.slice(0, 40))
      expect(item.takeaway).toBeTruthy()
      expect(item.description).toContain(item.takeaway!)
    }
    const descriptions = matched.map((item) => item.description)
    expect(new Set(descriptions).size).toBe(28)
    const takeaways = matched.map((item) => item.takeaway)
    expect(new Set(takeaways).size).toBe(28)
  })

  it("leaves out Maison Margiela because the collection markdown has no case for it", () => {
    expect(CASES.some((entry) => entry.title.includes("Margiela"))).toBe(false)
    expect(PRODUCTS.some((entry) => entry.name.includes("Margiela"))).toBe(false)
  })

  it("keeps product notes aligned to the matching case and includes listed pieces when present", () => {
    for (const caseId of MATCHED_IDS) {
      const item = CASES.find((entry) => entry.id === caseId)!
      const product = PRODUCTS.find((entry) => entry.id === `ext-${caseId.slice(-2).padStart(3, "0")}`)!
      expect(product.name).toBe(item.title)
      expect(product.notes).toContain(item.description!)
      if (item.items.length) {
        expect(product.notes).toContain("Pieces in this set include")
        expect(product.notes).toContain(item.items[0].name)
      }
    }
  })

  it("only sets material, packaging, or inspiration when those phrases appear in the PDF prose", () => {
    for (const product of PRODUCTS) {
      const text = `${product.notes ?? ""} ${product.inspiration ?? ""}`.toLowerCase()
      if (product.material) expect(text).toContain(product.material.toLowerCase())
      if (product.packaging) expect(text.toLowerCase()).toContain(product.packaging.toLowerCase())
      if (product.inspiration) expect(text).toContain(product.inspiration.toLowerCase())
      expect(product.size).toBeUndefined()
    }
  })

  it("keeps ranking titles and case records on the same PDF-supplied names", () => {
    for (const row of RANKING.items) {
      const item = CASES.find((entry) => entry.id === row.caseId)!
      expect(item.title).toBe(row.name)
      expect(item.description).toBeTruthy()
    }
  })
})
