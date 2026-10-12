export const Q = {
  archiveLny: "What did we gift APAC VIPs last Lunar New Year?",
  lny2027: "Find Lunar New Year 2027 gifts under $60 per unit",
  trending: "What's trending in drinkware this season?",
  draftEmail: "Draft the RFQ email",
} as const

export const GREETING =
  "Hi Anna. GoodFlow can read this account's archive, match a brief to products, and turn the short list into a quote. What are you looking for?"

export const HOME_SUGGESTIONS = [Q.archiveLny, Q.lny2027, Q.trending]

export const FALLBACK =
  "I'm running in demo mode, so right now I'm focused on three things: your gifting archive, budget-fit options and industry rankings. Try one of these:"

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
      reply:
        "For Lunar New Year 2026 (Year of the Horse), APAC gifting was built around three pieces: the Year of the Horse Lacquer Trunk for top-tier VIPs in Greater China [1], the Gilded Horse Compact Mirror sent with La Mer renewal kits [2], and the Silk Red Envelope Set used across APAC counters [3]. Lead times were 45–70 days, with MOQs starting at 3,000.",
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
      reply:
        "2027 is the Year of the Goat. These four fit under $60 and can land by Jan 15, 2027: Lacquer Trunk at $38.00 (70 days), Silk Red Envelope Set at $9.50 (45 days), Cloud-Wool Throw Blanket at $42.00 (60 days), and the Year of the Goat Porcelain Tea Set at $56.00 (75 days). Order by Nov 1, 2026.",
      cards: [...BASKET],
      addAll: true,
      followUps: [Q.trending],
    }
  }
  if (q === Q.trending.toLowerCase() || /(trend|ranking|search heat)/.test(q)) {
    return {
      id: "C1",
      steps: ["Reading GoodFlow public data · Jul–Sep 2026", "Ranking 10 drinkware items by search heat · Top 3"],
      reply:
        "Glass Straw Cup 500ml leads search heat with 18,420 searches, up 3 places. Smart Temperature Bottle is second. Double-Wall Ceramic Tumbler is third in search heat and first in case clicks. By purchase volume, Insulated Travel Cup 350ml still leads with 212,000 units.",
      cards: ["ext-007", "ext-010", "ext-008"],
    }
  }
  if (q === Q.draftEmail.toLowerCase() || /(draft|email|rfq|quote)/.test(q)) {
    return {
      id: "B3",
      steps: ["Reading RFQ List", "Applying volume-tier pricing", "Drafting email"],
      reply: "The draft is ready. Review the quantities, then export the email.",
      exportRfq: true,
    }
  }
  if (/^(hi|hello|hey|thanks|thank you)$/.test(q)) {
    return {
      id: "HELLO",
      steps: [],
      reply:
        "I can look up products already made for this account, match a budget and deadline, or show what's trending.",
      followUps: HOME_SUGGESTIONS,
    }
  }
  return { id: "FALLBACK", steps: [], reply: FALLBACK, followUps: [...HOME_SUGGESTIONS] }
}
