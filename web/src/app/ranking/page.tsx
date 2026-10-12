import { RankingBoard } from "@/components/ranking/ranking-board"
import type { RankingMetric } from "@/lib/types"

const METRIC_IDS: RankingMetric[] = ["searchHeat", "caseClicks", "purchaseVolume"]

export default async function RankingPage({
  searchParams,
}: {
  searchParams: Promise<{ metric?: string }>
}) {
  const { metric } = await searchParams
  const initial = METRIC_IDS.find((id) => id === metric) ?? "searchHeat"

  return (
    <main className="mx-auto max-w-[1360px] px-10 py-14">
      <RankingBoard initialMetric={initial} />
    </main>
  )
}
