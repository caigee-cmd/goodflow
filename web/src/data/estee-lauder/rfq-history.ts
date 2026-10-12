export type RfqHistoryStatus = "Quoted" | "In review" | "Closed"

export type RfqHistoryLine = {
  name: string
  qty: number
  unitPrice: number
  terms: "EXW" | "FOB" | "DAP"
}

export type RfqHistoryItem = {
  id: string
  project: string
  sentOn: string
  neededBy: string
  region: string
  status: RfqHistoryStatus
  lines: RfqHistoryLine[]
}

export const RFQ_HISTORY: RfqHistoryItem[] = [
  {
    id: "rfq-2026-014",
    project: "Lunar New Year 2026 VIP Gifting",
    sentOn: "Aug 12, 2026",
    neededBy: "Jan 18, 2026",
    region: "APAC",
    status: "Quoted",
    lines: [
      { name: "Year of the Horse Lacquer Trunk", qty: 3000, unitPrice: 38, terms: "EXW" },
      { name: "Silk Red Envelope Set", qty: 5000, unitPrice: 9.5, terms: "EXW" },
      { name: "Gilded Horse Compact Mirror", qty: 3000, unitPrice: 24, terms: "FOB" },
    ],
  },
  {
    id: "rfq-2025-041",
    project: "Holiday 2025 Press Preview",
    sentOn: "Jun 3, 2025",
    neededBy: "Nov 20, 2025",
    region: "EMEA",
    status: "Closed",
    lines: [
      { name: "Gold-Foil Notebook", qty: 800, unitPrice: 11.2, terms: "DAP" },
      { name: "Brass Pen", qty: 800, unitPrice: 6.4, terms: "DAP" },
    ],
  },
  {
    id: "rfq-2026-022",
    project: "Wellness Week Employee Kit",
    sentOn: "Sep 28, 2026",
    neededBy: "Mar 2, 2027",
    region: "Americas",
    status: "In review",
    lines: [
      { name: "Insulated Travel Cup 350ml", qty: 5000, unitPrice: 7.4, terms: "EXW" },
      { name: "Canvas Tote", qty: 4000, unitPrice: 8.8, terms: "FOB" },
    ],
  },
]

export function rfqHistoryTotal(item: RfqHistoryItem) {
  return item.lines.reduce((sum, line) => sum + line.qty * line.unitPrice, 0)
}
