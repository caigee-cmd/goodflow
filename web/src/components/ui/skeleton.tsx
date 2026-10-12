import { cn } from "cn"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("el-shimmer rounded-md bg-el-cream", className)}
      {...props}
    />
  )
}

export function AccountMenuSkeleton() {
  return (
    <div className="absolute top-11 right-0 w-64 rounded-lg border border-el-line bg-el-paper p-3 shadow-el-md" aria-hidden>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-2 h-3 w-40" />
      <Skeleton className="mt-4 h-3 w-28" />
      <Skeleton className="mt-3 h-3 w-20" />
      <Skeleton className="mt-3 h-3 w-16" />
    </div>
  )
}

export function AccountCenterSkeleton() {
  return (
    <div className="grid w-full grid-cols-[280px_minmax(0,1fr)] items-start gap-6" aria-hidden>
      <div className="h-[min(640px,calc(100svh-13rem))] rounded-2xl bg-el-cream px-5 py-6">
        <Skeleton className="h-3 w-24 bg-el-paper" />
        <div className="mt-5 flex items-center gap-3">
          <Skeleton className="size-12 rounded-full bg-el-paper" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-28 bg-el-paper" />
            <Skeleton className="h-3 w-36 bg-el-paper" />
          </div>
        </div>
        <Skeleton className="mt-4 h-3 w-32 bg-el-paper" />
        <div className="mt-8 space-y-2">
          <Skeleton className="h-9 w-full bg-el-paper" />
          <Skeleton className="h-9 w-full bg-el-paper/70" />
        </div>
      </div>
      <div>
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-3 h-8 w-40" />
        <div className="mt-8 grid grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((row) => (
            <div key={row} className="flex gap-3 rounded-lg bg-el-paper p-3">
              <Skeleton className="size-24" style={{ animationDelay: `${row * 80}ms` }} />
              <div className="flex-1 space-y-2 py-1">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="mt-3 h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function RfqListSkeleton() {
  return (
    <div className="grid grid-cols-[1fr_360px] gap-10" aria-hidden>
      <div className="space-y-4">
        {[0, 1, 2].map((row) => (
          <div key={row} className="grid grid-cols-[96px_1fr] gap-4 rounded-lg bg-el-paper p-4">
            <Skeleton className="size-24" />
            <div className="space-y-2 py-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="h-80 rounded-[10px]" />
    </div>
  )
}

export function RankingSkeleton() {
  return (
    <div className="absolute inset-0" aria-hidden>
      <Skeleton className="absolute top-0 left-1/2 h-[420px] w-[300px] -translate-x-1/2" />
      <Skeleton className="absolute top-9 left-[calc(50%-440px)] h-[340px] w-[250px]" />
      <Skeleton className="absolute top-12 left-[calc(50%+190px)] h-[320px] w-[240px]" />
    </div>
  )
}

export function AdvisorSkeleton() {
  return (
    <div className="space-y-2" aria-hidden>
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-11/12" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  )
}

export function CaseGridSkeleton({ aspects }: { aspects: string[][] }) {
  return (
    <div className="flex gap-4" aria-hidden>
      {aspects.map((lane, column) => (
        <div key={column} className="flex min-w-0 flex-1 flex-col gap-4">
          {lane.map((aspect, index) => (
            <Skeleton
              key={index}
              className="rounded-lg"
              style={{ aspectRatio: aspect, animationDelay: `${(column * 2 + index) * 80}ms` }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(232px,1fr))] gap-6" aria-hidden>
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index}>
          <Skeleton className="aspect-square" style={{ animationDelay: `${index * 70}ms` }} />
          <Skeleton className="mt-3 h-3 w-1/2" style={{ animationDelay: `${index * 70 + 40}ms` }} />
          <Skeleton className="mt-2 h-4 w-4/5" style={{ animationDelay: `${index * 70 + 80}ms` }} />
        </div>
      ))}
    </div>
  )
}

export { Skeleton }
