import { brand } from "@/config/brand"
import { product } from "@/data"
import { fmtDate, money, orderBy } from "@/lib/dates"
import { hasPricing, lineTotal, tierFor } from "@/lib/pricing"

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
  const leads = selected
    .map((line) => tierFor(product(line.productId), line.qty)?.leadTimeDays)
    .filter((days): days is number => days != null)
  const maxLead = leads.length ? Math.max(...leads) : undefined
  const priced = selected.every((line) => hasPricing(product(line.productId)))
  const total = priced
    ? selected.reduce((sum, line) => sum + (lineTotal(product(line.productId), line.qty) ?? 0), 0)
    : undefined

  const blocks = selected.map((line, index) => {
    const item = product(line.productId)
    const tier = tierFor(item, line.qty)
    const origin =
      item.source === "archive"
        ? ["Archive", item.campaign].filter(Boolean).join(" · ")
        : ["External Pick", item.maker].filter(Boolean).join(" · ")
    const qty = `Qty ${line.qty.toLocaleString("en-US")}`
    const bits = [qty]
    if (tier) {
      bits.push(`${money(tier.unitPrice)}/unit`, `${tier.leadTimeDays}-day lead time`)
    }
    bits.push(line.terms)
    const rows = [`${index + 1}. ${item.name}`, `   ${origin}`, `   ${bits.join(" · ")}`]
    const sub = lineTotal(item, line.qty)
    if (sub != null) rows.push(`   Subtotal: ${money(sub, 0)}`)
    return rows.join("\n")
  })

  const needed =
    maxLead != null
      ? `Needed by: ${fmtDate(state.neededBy)} (order by ${fmtDate(orderBy(state.neededBy, maxLead))})`
      : `Needed by: ${fmtDate(state.neededBy)}`

  const body = [
    "Hi GoodFlow team,",
    "",
    `Please quote the following items for xBeauty — ${project}.`,
    "",
    needed,
    `Delivery region: ${state.region}`,
    "",
    blocks.join("\n\n"),
    "",
    total != null ? `Estimated total: ${money(total, 0)}` : "Please provide unit pricing, MOQ, and lead time for each item.",
    total != null ? "Pricing is indicative and based on volume tiers; shipping terms affect the final quote." : "",
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
