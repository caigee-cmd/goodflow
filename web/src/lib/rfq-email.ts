import { brand } from "@/config/brand"
import { product } from "@/data"
import { fmtDate, money, orderBy } from "@/lib/dates"
import { lineTotal, tierFor } from "@/lib/pricing"

export type RfqEmailInput = {
  project: string
  neededBy: string
  region: string
  notes: string
  lines: { productId: string; qty: number; terms: string; selected: boolean }[]
}

export function buildRfqEmail(state: RfqEmailInput): { to: string; subject: string; body: string } {
  const selected = state.lines.filter((line) => line.selected)
  const project = state.project || "Gift sourcing"
  const leads = selected.map((line) => tierFor(product(line.productId), line.qty).leadTimeDays)
  const maxLead = leads.length ? Math.max(...leads) : 0
  const total = selected.reduce((sum, line) => sum + lineTotal(product(line.productId), line.qty), 0)

  const blocks = selected.map((line, index) => {
    const item = product(line.productId)
    const tier = tierFor(item, line.qty)
    const origin =
      item.source === "archive" ? `Archive · ${item.campaign}` : `External Pick · ${item.maker}`
    return [
      `${index + 1}. ${item.name}`,
      `   ${origin}`,
      `   Qty ${line.qty.toLocaleString("en-US")} · ${money(tier.unitPrice)}/unit · ${tier.leadTimeDays}-day lead time · ${line.terms}`,
      `   Subtotal: ${money(lineTotal(item, line.qty), 0)}`,
    ].join("\n")
  })

  const body = [
    "Hi GoodFlow team,",
    "",
    `Please quote the following items for Estée Lauder — ${project}.`,
    "",
    `Needed by: ${fmtDate(state.neededBy)} (order by ${fmtDate(orderBy(state.neededBy, maxLead))})`,
    `Delivery region: ${state.region}`,
    "",
    blocks.join("\n\n"),
    "",
    `Estimated total: ${money(total, 0)}`,
    "Pricing is indicative and based on volume tiers; shipping terms affect the final quote.",
    "",
    state.notes ? `Notes: ${state.notes}` : "",
    state.notes ? "" : "",
    "Best regards,",
    brand.user.name,
    brand.user.title,
    brand.user.email,
  ]
    .filter((line, index, all) => !(line === "" && all[index - 1] === "" && all[index - 2] === ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")

  return {
    to: brand.rfq.to,
    subject: `RFQ — ${project} — ${selected.length} items`,
    body: body.trim() + "\n",
  }
}
