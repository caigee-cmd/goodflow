import type { Case, CaseItem, HomeChipId, OccasionId, Region } from "@/lib/types"

type Slot = {
  id: string
  title: string
  client: string
  kind: Case["kind"]
  occasions: OccasionId[]
  year: number
  region: Region
  coverAspect: Case["coverAspect"]
  featured?: boolean
  description: string
  takeaway: string
  items: [string, string, string?][]
  chips: HomeChipId[]
}

const slots: Slot[] = [
  {
    id: "case-01",
    title: "A golden horse gallops into the New Year.",
    client: "Heritage museum IP",
    kind: "ip",
    occasions: ["lunar-new-year"],
    year: 2026,
    region: "APAC",
    coverAspect: "3/4",
    featured: true,
    description:
      "A Lunar New Year 2026 collection built around a gilded horse from the museum's bronze collection. A desk ornament, lacquer packaging and embroidered red envelopes were sold in limited runs across Greater China.",
    takeaway:
      "It turned a heritage motif into objects people display, not discard. The ornament stayed on desks long after the holiday, keeping the brand in view for months.",
    items: [
      ["Gilded Horse Ornament", "Zinc alloy, gold plating · 9 × 7 cm", "arc-002"],
      ["Red Lacquer Gift Box", "Lacquered paperboard · 22 × 22 × 8 cm", "arc-001"],
      ["Embroidered Red Envelopes", "Silk · set of 6", "arc-003"],
      ["Gold-Foil Greeting Card", "Cotton paper · A6"],
    ],
    chips: ["heritage", "collab"],
  },
  {
    id: "case-02",
    title: "Night repair, day-long glow.",
    client: "Estée Lauder · Global",
    kind: "elc",
    occasions: ["launch"],
    year: 2025,
    region: "Global",
    coverAspect: "4/5",
    featured: true,
    description:
      "A media kit for the 2025 serum relaunch. Midnight-blue boxes went to 1,200 editors and creators, each holding the bottle, a card, and a pouch meant to be kept.",
    takeaway:
      "The box did the explaining. Recipients photographed the unboxing before they wrote about the formula.",
    items: [
      ["Magnetic Media Box", "FSC paperboard · 30 × 22 × 8 cm"],
      ["Serum Sleeve", "Gold-foil paperboard"],
      ["Midnight Pouch", "Cotton velvet · 20 × 14 cm"],
      ["Editor Card", "Cotton paper · A6"],
    ],
    chips: ["elevated", "collab"],
  },
  {
    id: "case-03",
    title: "Sea, salt and a linen tote.",
    client: "La Mer · Seoul",
    kind: "elc",
    occasions: ["launch"],
    year: 2025,
    region: "APAC",
    coverAspect: "1/1",
    description:
      "Guests at the Seoul flagship pop-up left with a sea-washed linen tote. The bag was the souvenir; the sample was inside it.",
    takeaway:
      "A tote people actually carry outlasts a sample they finish. The pop-up stayed visible on the street for weeks.",
    items: [
      ["Ocean Linen Tote", "Washed linen · 42 × 36 cm"],
      ["Sample Sleeve", "Tissue wrap"],
      ["Pop-up Map Card", "Cotton paper · A6"],
      ["Ribbon Tie", "Cotton · 80 cm"],
    ],
    chips: ["everyday", "travel"],
  },
  {
    id: "case-04",
    title: "The Year of the Snake, in porcelain.",
    client: "Estée Lauder · Greater China",
    kind: "elc",
    occasions: ["lunar-new-year", "vip"],
    year: 2025,
    region: "APAC",
    coverAspect: "4/5",
    featured: true,
    description:
      "A pair of gold-rim porcelain cups for VIP tea ceremonies at flagship counters in Shanghai and Taipei, made for the Year of the Snake.",
    takeaway:
      "The ceremony gave the gift a reason to be opened in the store, not later at home.",
    items: [
      ["Porcelain Cup Pair", "Bone china, 24k gold rim · 150 ml × 2"],
      ["Lacquer Box", "Lacquer-finish paperboard"],
      ["Tea Card", "Cotton paper"],
      ["Gold Sleeve", "Foil paper"],
    ],
    chips: ["heritage", "elevated"],
  },
  {
    id: "case-05",
    title: "A candlelit evening in London.",
    client: "Jo Malone London · UK",
    kind: "elc",
    occasions: ["holiday", "vip"],
    year: 2025,
    region: "EMEA",
    coverAspect: "3/4",
    featured: true,
    description:
      "Hand-glazed ceramic candles for a VIP dinner in London. The vessel was the gift; the scent was the evening.",
    takeaway:
      "Guests kept the vessel on the table. The dinner lasted one night; the object stayed.",
    items: [
      ["Midnight Ceramic Candle", "Hand-glazed ceramic · 220 g"],
      ["Ribbon Box", "Rigid box with ribbon"],
      ["Place Card", "Cotton paper"],
      ["Match Sleeve", "Paperboard"],
    ],
    chips: ["feel-good", "elevated"],
  },
  {
    id: "case-06",
    title: "Wellness Week, packed to go.",
    client: "Clinique · North America",
    kind: "elc",
    occasions: ["employee"],
    year: 2025,
    region: "Americas",
    coverAspect: "4/3",
    description:
      "A canvas tote, a bottle and a towel for 4,000 employees during Wellness Week. Everything fit in one mailer.",
    takeaway:
      "Employee gifts that leave the building get used. This one was designed to be carried on Monday.",
    items: [
      ["Canvas Tote", "Organic cotton · 38 × 40 cm"],
      ["Bottle", "Stainless steel · 500 ml"],
      ["Towel", "Cotton · 30 × 50 cm"],
      ["Mailer Box", "Kraft"],
    ],
    chips: ["everyday", "travel"],
  },
  {
    id: "case-07",
    title: "Lipstick, but make it a charm.",
    client: "MAC · Southeast Asia",
    kind: "elc",
    occasions: ["lunar-new-year"],
    year: 2025,
    region: "APAC",
    coverAspect: "1/1",
    description:
      "An enamel snake charm clipped to lipstick cases for the Year of the Snake gift-with-purchase across Greater China and Southeast Asia.",
    takeaway:
      "A small object on a product people already carry turned a seasonal set into something they showed.",
    items: [
      ["Snake Charm", "Zinc alloy, enamel · 4 × 3 cm"],
      ["Backing Card", "Paperboard"],
      ["Lipstick Sleeve", "Printed paper"],
      ["Counter Tray", "Acrylic"],
    ],
    chips: ["collab", "everyday"],
  },
  {
    id: "case-08",
    title: "Gold foil for the front row.",
    client: "Estée Lauder · Paris",
    kind: "elc",
    occasions: ["holiday", "launch"],
    year: 2024,
    region: "EMEA",
    coverAspect: "4/5",
    description:
      "Two gold-foil notebooks and a brass pen for the Holiday 2024 press preview in Paris. Still the most re-requested media gift.",
    takeaway:
      "Editors used the notebook in the room. The brand stayed open on the desk through the show.",
    items: [
      ["Gold-Foil Notebook", "Cotton paper · A5 × 2"],
      ["Brass Pen", "Brass"],
      ["Slipcase", "Paperboard"],
      ["Seat Card", "Cotton paper"],
    ],
    chips: ["elevated", "heritage"],
  },
  {
    id: "case-09",
    title: "Red envelopes worth keeping.",
    client: "Luxury department store",
    kind: "industry",
    occasions: ["lunar-new-year"],
    year: 2026,
    region: "APAC",
    coverAspect: "4/5",
    description:
      "Silk envelopes in a magnetic box, sold beside the Lunar New Year counters. Customers bought them as the gift, not the wrapping.",
    takeaway:
      "When the envelope is nicer than the note inside, people keep the envelope.",
    items: [
      ["Silk Envelope", "Embroidered silk · set of 6"],
      ["Magnetic Box", "Paperboard"],
      ["Gold Card", "Foil paper · A6"],
      ["Tissue", "Printed tissue"],
    ],
    chips: ["heritage", "feel-good"],
  },
  {
    id: "case-10",
    title: "A spa day in a box.",
    client: "Five-star hotel spa",
    kind: "industry",
    occasions: ["vip"],
    year: 2025,
    region: "APAC",
    coverAspect: "3/4",
    description:
      "A boxed set for suite guests: a silk eye mask, a candle and a card for a treatment the next morning.",
    takeaway:
      "The box booked the appointment. Guests opened it at night and used the card in the morning.",
    items: [
      ["Silk Eye Mask", "Mulberry silk"],
      ["Candle", "Soy wax · 80 g"],
      ["Treatment Card", "Cotton paper"],
      ["Ribbon Box", "Rigid box"],
    ],
    chips: ["feel-good", "elevated"],
  },
  {
    id: "case-11",
    title: "When art meets the vanity.",
    client: "Contemporary art museum IP",
    kind: "ip",
    occasions: ["vip"],
    year: 2025,
    region: "EMEA",
    coverAspect: "4/3",
    description:
      "A jewelry dish and a compact, both carrying a motif from the museum's current show, given to patrons after a private view.",
    takeaway:
      "Patrons put the dish on a dresser. The exhibition stayed in the house.",
    items: [
      ["Jewelry Dish", "Porcelain · Ø 12 cm"],
      ["Compact", "Zinc alloy"],
      ["Exhibition Card", "Cotton paper"],
      ["Box", "Rigid box"],
    ],
    chips: ["collab", "heritage"],
  },
  {
    id: "case-12",
    title: "A little bear, a big New Year.",
    client: "Character IP collaboration",
    kind: "ip",
    occasions: ["lunar-new-year"],
    year: 2026,
    region: "APAC",
    coverAspect: "3/4",
    description:
      "A limited Lunar New Year set built around a character people already knew: a pouch, a charm and a red envelope.",
    takeaway:
      "The character did the introduction. The objects were simple enough to make at volume.",
    items: [
      ["Character Pouch", "Cotton velvet"],
      ["Charm", "Enamel"],
      ["Red Envelope", "Gold foil · set of 4"],
      ["Sleeve", "Printed paperboard"],
    ],
    chips: ["collab", "feel-good"],
  },
  {
    id: "case-13",
    title: "Clear glass, clear conscience.",
    client: "Sustainable lifestyle brand",
    kind: "industry",
    occasions: ["launch"],
    year: 2026,
    region: "EMEA",
    coverAspect: "1/1",
    description:
      "A launch kit in borosilicate glass: a straw cup, a card about the material, and a kraft box with no plastic insert.",
    takeaway:
      "The material was the claim. Guests could see through the gift.",
    items: [
      ["Glass Straw Cup", "Borosilicate · 500 ml"],
      ["Material Card", "Recycled paper"],
      ["Kraft Box", "Kraft, no plastic insert"],
      ["Glass Straw", "Borosilicate", "ext-007"],
    ],
    chips: ["everyday", "feel-good"],
  },
  {
    id: "case-14",
    title: "Moonlight in a tin.",
    client: "Premium tea house",
    kind: "industry",
    occasions: ["vip"],
    year: 2025,
    region: "APAC",
    coverAspect: "4/5",
    description:
      "A mid-autumn tin for regulars: tea, a porcelain dish, and a card with the harvest date.",
    takeaway:
      "Regulars kept the dish and refilled the tin. The gift had a second use.",
    items: [
      ["Tea Tin", "Tinplate"],
      ["Porcelain Dish", "Pearl glaze · Ø 12 cm"],
      ["Harvest Card", "Cotton paper"],
      ["Sleeve", "Paper"],
    ],
    chips: ["heritage", "feel-good"],
  },
  {
    id: "case-15",
    title: "One tote, every free journey.",
    client: "Lifestyle retailer",
    kind: "industry",
    occasions: ["employee"],
    year: 2025,
    region: "Americas",
    coverAspect: "3/4",
    description:
      "A staff tote for a year of travel perks. The bag was issued once and used for the rest of the year.",
    takeaway:
      "One object, used often, beat a stack of smaller gifts no one kept.",
    items: [
      ["Travel Tote", "Canvas · 40 × 36 cm"],
      ["Luggage Tag", "Vegan leather"],
      ["Staff Card", "Cotton paper"],
      ["Mailer", "Kraft", "ext-004"],
    ],
    chips: ["travel", "everyday"],
  },
  {
    id: "case-16",
    title: "A winter forest on the desk.",
    client: "Boutique hotel group",
    kind: "industry",
    occasions: ["holiday"],
    year: 2025,
    region: "EMEA",
    coverAspect: "4/5",
    description:
      "A holiday desk set for returning guests: a candle, a notebook and a card for a late checkout.",
    takeaway:
      "The notebook stayed in the room. Guests wrote in it and some took it home.",
    items: [
      ["Forest Candle", "Soy wax · 180 g"],
      ["Notebook", "Cotton paper · A5"],
      ["Checkout Card", "Cotton paper"],
      ["Box", "Rigid box"],
    ],
    chips: ["feel-good", "elevated"],
  },
  {
    id: "case-17",
    title: "The animated holiday.",
    client: "Animation studio IP",
    kind: "ip",
    occasions: ["holiday"],
    year: 2024,
    region: "Americas",
    coverAspect: "4/3",
    description:
      "A holiday set drawn from a winter film: a pouch, a notebook and a card with a still from the last scene.",
    takeaway:
      "The still did the remembering. The objects were ordinary enough to produce on time.",
    items: [
      ["Character Pouch", "Velvet"],
      ["Notebook", "Paper · A6"],
      ["Still Card", "Cotton paper"],
      ["Sleeve", "Printed paperboard"],
    ],
    chips: ["collab", "feel-good"],
  },
  {
    id: "case-18",
    title: "Silk for a good night's sleep.",
    client: "Luxury bedding brand",
    kind: "industry",
    occasions: ["vip"],
    year: 2026,
    region: "EMEA",
    coverAspect: "3/4",
    description:
      "A silk sleep set for top clients: an eye mask and a pillowcase in the same cloth, boxed with a ribbon.",
    takeaway:
      "Matching the two pieces made the set feel considered, not assembled.",
    items: [
      ["Silk Eye Mask", "Mulberry silk, 22 momme"],
      ["Pillowcase", "50 × 75 cm"],
      ["Ribbon Box", "Rigid box"],
      ["Care Card", "Cotton paper", "ext-011"],
    ],
    chips: ["feel-good", "elevated"],
  },
  {
    id: "case-19",
    title: "Pixels and powder.",
    client: "Game IP collaboration",
    kind: "ip",
    occasions: ["launch"],
    year: 2026,
    region: "Global",
    coverAspect: "1/1",
    description:
      "A launch kit for a game collaboration: a charm, a card with a code, and a box that photographed well on a desk.",
    takeaway:
      "The code was the product. The object was what people posted.",
    items: [
      ["Pixel Charm", "Enamel"],
      ["Code Card", "Cotton paper"],
      ["Desk Box", "Rigid box"],
      ["Sleeve", "Foil paper"],
    ],
    chips: ["collab", "everyday"],
  },
  {
    id: "case-20",
    title: "A garden that travels.",
    client: "Botanical garden IP",
    kind: "ip",
    occasions: ["employee"],
    year: 2025,
    region: "EMEA",
    coverAspect: "4/5",
    description:
      "A staff gift from a year of garden collaborations: a notebook, a seed card and a linen pouch.",
    takeaway:
      "The seed card gave the pouch a reason. People planted it or kept the card.",
    items: [
      ["Linen Pouch", "Washed linen"],
      ["Notebook", "Cotton paper · A6"],
      ["Seed Card", "Recycled paper"],
      ["Mailer", "Kraft"],
    ],
    chips: ["heritage", "travel"],
  },
]

function toCase(slot: Slot): Case {
  const items: CaseItem[] = slot.items.map(([name, spec, productId], i) => ({
    name,
    spec,
    image: `/demo/cases/${slot.id}/items/0${i + 1}.jpg`,
    productId,
  }))
  return {
    id: slot.id,
    title: slot.title,
    client: slot.client,
    kind: slot.kind,
    occasions: slot.occasions,
    year: slot.year,
    region: slot.region,
    cover: `/demo/cases/${slot.id}/cover.jpg`,
    coverAspect: slot.coverAspect,
    images: [1, 2, 3, 4].map((i) => `/demo/cases/${slot.id}/0${i}.jpg`),
    description: slot.description,
    takeaway: slot.takeaway,
    items,
    featured: slot.featured,
    chips: slot.chips,
  }
}

export const CASES: Case[] = slots.map(toCase)
