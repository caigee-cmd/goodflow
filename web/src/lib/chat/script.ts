export const Q = {
  archiveLny: "What did we gift APAC VIPs last Lunar New Year?",
  lny2027: "Find Lunar New Year 2027 gifts under $60 per unit",
  trending: "What's trending in drinkware this season?",
  draftEmail: "Draft the RFQ email",
} as const

export const GREETING =
  "Hi Anna. GoodFlow can read this account's archive, match a brief to products, and turn the short list into a quote. What are you looking for?"

export const HOME_SUGGESTIONS = [Q.archiveLny, Q.lny2027, Q.trending]

export const FALLBACK = `I'm in demo mode, so I stay on three things:

- **Gifting archive** — what this account already sent
- **Budget fit** — options under a unit price and deadline
- **Industry rankings** — what's moving in search heat and volume

Try one of these:`

export const BASKET = ["arc-001", "arc-003", "ext-002", "ext-005"] as const

export const LNY_PROJECT = "Lunar New Year 2027 VIP Gifting"
export const LNY_NOTES = "Re-run archive pieces with Year of the Goat artwork."

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
      steps: ["Searching Estée Lauder Archive", "Filtering: APAC · Lunar New Year 2026", "Ranking by case clicks · Top 3"],
      reply: `**Lunar New Year 2026 · Year of the Horse**

APAC gifting was built around three pieces.

| Piece | Who it was for | Lead time | MOQ |
| --- | --- | --- | --- |
| Year of the Horse Lacquer Trunk [1] | Top-tier VIPs, Greater China | 70 days | 3,000 |
| Gilded Horse Compact Mirror [2] | La Mer renewal kits | 60 days | 3,000 |
| Silk Red Envelope Set [3] | APAC counters | 45 days | 5,000 |

Lead times ran **45–70 days**, and MOQs started at **3,000**.`,
      citations: ["arc-001", "arc-002", "arc-003"],
      cards: ["arc-001", "arc-002", "arc-003"],
      followUps: [Q.lny2027],
    }
  }
  if (q === Q.lny2027.toLowerCase() || /(under|budget|\$|2027|similar)/.test(q)) {
    return {
      id: "B1",
      steps: [
        "Reading brief: Lunar New Year 2027 · Year of the Goat · ≤ $60/unit",
        "Searching Estée Lauder Archive + External Picks",
        "Checking lead times against Jan 15, 2027 · 10 fit · top 4",
      ],
      reply: `**Lunar New Year 2027 · Year of the Goat**

These four stay **under $60** and can land by **Jan 15, 2027**.

| Piece | Unit price | Lead time |
| --- | --- | --- |
| Lacquer Trunk | $38.00 | 70 days |
| Silk Red Envelope Set | $9.50 | 45 days |
| Cloud-Wool Throw Blanket | $42.00 | 60 days |
| Year of the Goat Porcelain Tea Set | $56.00 | 75 days |

Order by **Nov 1, 2026**.`,
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

- **Insulated Travel Cup 350ml** still leads, at **212,000 units**`,
      cards: ["ext-007", "ext-010", "ext-008"],
    }
  }
  if (q === Q.draftEmail.toLowerCase() || /(draft|email|rfq|quote)/.test(q)) {
    return {
      id: "B3",
      steps: ["Reading RFQ List", "Applying volume-tier pricing", "Drafting email"],
      reply: `**RFQ email**

The request is ready.

- Quantities are at **MOQ**
- Pricing uses the **volume tier** for each line

Review it, then send.`,
      exportRfq: true,
    }
  }
  if (/^(hi|hello|hey|thanks|thank you)$/.test(q)) {
    return {
      id: "HELLO",
      steps: [],
      reply: `I can help with three things:

- **Archive** — products already made for this account
- **Brief** — a budget and a deadline
- **Rankings** — what's trending this season`,
      followUps: HOME_SUGGESTIONS,
    }
  }
  return { id: "FALLBACK", steps: [], reply: FALLBACK, followUps: [...HOME_SUGGESTIONS] }
}
