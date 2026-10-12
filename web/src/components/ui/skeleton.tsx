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
    <div className="flex gap-6" aria-hidden>
      {aspects.map((lane, column) => (
        <div key={column} className="flex min-w-0 flex-1 flex-col gap-6">
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
