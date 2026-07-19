import type { ReactNode } from 'react'
import { CircleAlert } from 'lucide-react'

export function StatusPage({
  title,
  description,
  icon,
  actions,
}: {
  title: ReactNode
  description?: ReactNode
  icon?: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon ?? <CircleAlert className="size-6" />}
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      {description ? <p className="max-w-lg text-sm text-muted-foreground">{description}</p> : null}
      {actions ? <div className="mt-2 flex flex-wrap justify-center gap-2">{actions}</div> : null}
    </div>
  )
}
