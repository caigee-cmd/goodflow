export const Q = {
  archiveLny: "What did we gift APAC VIPs last Lunar New Year?",
  holiday2026: "Show me 2026 holiday gift collections",
  trending: "What's trending in drinkware this season?",
  draftEmail: "Draft the RFQ email",
} as const

export const GREETING =
  "Hi Anna. GoodFlow can read this account's archive, match a brief to products, and turn the short list into a quote. What are you looking for?"

export const HOME_SUGGESTIONS = [Q.holiday2026, Q.trending, Q.archiveLny]

export const FALLBACK = `I'm in demo mode, so I stay on three things:

- **Campaign collections** — holiday, collab, and limited merch
- **Product browse** — image, name, and brand
- **Industry rankings** — what's moving in search heat and volume

Try one of these:`

export const BASKET = ["ext-001", "ext-002", "ext-003", "ext-005"] as const

export const LNY_PROJECT = "Holiday 2026 gifting"
export const LNY_NOTES = "Please quote these 2026 holiday collections."

export type AdvisorTurn = {
  id: string
  steps: string[]
  reply: string
  cards?: string[]
  citations?: string[]
  addAll?: boolean
  exportRfq?: boolean
  followUps?: string[]
}

export function routeAdvisor(text: string): AdvisorTurn {
  const q = text.toLowerCase().replace(/[^a-z0-9$ ]+/g, " ").replace(/\s+/g, " ").trim()
  if (q === Q.archiveLny.toLowerCase() || (/(lunar|lny|new year)/.test(q) && /(last|2026|past|history|did we)/.test(q))) {
    return {
      id: "A1",
      steps: ["Searching xBeauty Archive", "Checking available campaign records"],
      reply: `**xBeauty Archive**

This demo doesn't include previous Lunar New Year archive records yet.

Holiday 2026 collections from the current catalog are ready to browse and request a quote.`,
      cards: [...BASKET],
      followUps: [Q.holiday2026],
    }
  }
  if (
    q === Q.holiday2026.toLowerCase() ||
    /(holiday|christmas|christmas|圣诞|gift collection|2026 holiday)/.test(q) ||
    /(under|budget|\$|2027|similar)/.test(q)
  ) {
    return {
      id: "B1",
      steps: [
        "Reading brief: 2026 holiday collections",
        "Searching current campaign catalog",
        "Shortlisting featured holiday sets",
      ],
      reply: `**Holiday 2026 collections**

These four sets are in the current catalog:

| Collection | Brand |
| --- | --- |
| Charlotte Tilbury2026圣诞礼盒 | Charlotte Tilbury |
| Dior Holiday limited Collection 2026 | Dior |
| LAMER 2026圣诞礼盒 | La Mer |
| YSL2026节日限定礼盒 | YSL |

Unit pricing, MOQ, and lead time are not in this catalog yet — request a quote and sales will reply.`,
      cards: [...BASKET],
      addAll: true,
      followUps: [Q.trending],
    }
  }
  if (q === Q.trending.toLowerCase() || /(trend|ranking|search heat)/.test(q)) {
    return {
      id: "C1",
      steps: ["Reading GoodFlow public data · Jul–Sep 2026", "Ranking 10 drinkware items by search heat · Top 3"],
      reply: `**Drinkware · Jul–Sep 2026**

**Search heat**

1. **Glass Straw Cup 500ml** — 18,420 searches, up 3 places
2. **Smart Temperature Bottle**
3. **Double-Wall Ceramic Tumbler** — also first in case clicks

**Purchase volume**

- **Insulated Travel Cup 350ml** still leads, at **212,000 units**

These ranking figures come from GoodFlow public data, not the campaign catalog.`,
    }
  }
  if (q === Q.draftEmail.toLowerCase() || /(draft|email|rfq|quote)/.test(q)) {
    return {
      id: "B3",
      steps: ["Reading RFQ List", "Drafting email"],
      reply: `**RFQ email**

The request is ready.

Review the item list and quantities, then send. Sales will reply with unit pricing and lead time.`,
      exportRfq: true,
    }
  }
  if (/^(hi|hello|hey|thanks|thank you)$/.test(q)) {
    return {
      id: "HELLO",
      steps: [],
      reply: `I can help with three things:

- **Collections** — holiday, collab, and limited merch
- **Brief** — a short list you can quote
- **Rankings** — what's trending this season`,
      followUps: HOME_SUGGESTIONS,
    }
  }
  return { id: "FALLBACK", steps: [], reply: FALLBACK, followUps: [...HOME_SUGGESTIONS] }
}
