import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-10 w-[100px]" />
          ))}
      </div>

      {/* Table */}
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-[300px]" />
          <Skeleton className="h-10 w-[200px]" />
        </div>
        <div className="border rounded-lg">
          <Skeleton className="h-10 w-full" />
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-[100px]" />
        <Skeleton className="h-8 w-[200px]" />
      </div>
    </div>
  )
}
