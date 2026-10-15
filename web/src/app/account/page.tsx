import { Suspense } from "react"
import { AccountCenter } from "@/components/account/account-center"
import { AccountCenterSkeleton } from "@/components/ui/skeleton"

export default function AccountPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100svh-8.5rem)] max-w-[1180px] items-center px-10 py-12">
      <Suspense fallback={<AccountCenterSkeleton />}>
        <AccountCenter />
      </Suspense>
    </main>
  )
}
