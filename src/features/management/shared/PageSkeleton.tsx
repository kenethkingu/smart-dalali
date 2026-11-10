export function PageSkeleton() {
  return (
    <div className="max-w-4xl animate-pulse" aria-busy="true" role="status">
      <div className="mb-3 h-8 w-1/3 rounded-lg bg-pl-surface" />
      <div className="mb-8 h-4 w-1/2 rounded-lg bg-pl-surface" />
      <div className="mb-4 h-32 rounded-2xl bg-pl-surface" />
      <div className="h-32 rounded-2xl bg-pl-surface" />
    </div>
  )
}
