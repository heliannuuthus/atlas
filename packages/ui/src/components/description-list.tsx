import { cn } from '../lib/utils'

export function DescriptionList({
  items,
  columns = 2,
  className,
}: {
  items: Array<{ label: React.ReactNode; value: React.ReactNode; wide?: boolean }>
  columns?: 1 | 2 | 3
  className?: string
}) {
  return (
    <dl
      className={cn(
        'grid overflow-hidden rounded-lg border bg-border',
        columns === 1 ? 'grid-cols-1' : columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2',
        className
      )}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            'grid grid-cols-[minmax(7rem,0.35fr)_1fr] gap-px bg-background',
            item.wide && columns > 1 && 'md:col-span-full'
          )}
        >
          <dt className="bg-muted/50 px-4 py-3 text-sm text-muted-foreground">{item.label}</dt>
          <dd className="min-w-0 px-4 py-3 text-sm">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
