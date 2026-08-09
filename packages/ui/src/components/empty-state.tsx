import { Inbox } from 'lucide-react'
import { cn } from '../lib/utils'

export function EmptyState({
  title = '暂无数据',
  description,
  icon,
  action,
  className,
}: {
  title?: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex min-h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center',
        className
      )}
    >
      {icon ?? <Inbox className="size-8 text-muted-foreground/60" />}
      <strong className="text-sm">{title}</strong>
      {description ? <p className="max-w-md text-xs text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}
