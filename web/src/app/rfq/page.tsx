import { RfqList } from "@/components/rfq/rfq-list"

export default function RfqPage() {
  return (
    <main className="mx-auto max-w-[1360px] px-10 py-14">
      <h1 className="font-heading text-[40px] leading-[48px] font-normal">RFQ List</h1>
      <p className="mt-3 max-w-xl text-[14px] leading-[22px] text-el-taupe-ink">
        Request quotes from GoodFlow. Pricing is indicative and based on volume tiers.
      </p>
      <div className="mt-10">
        <RfqList />
      </div>
    </main>
  )
}
