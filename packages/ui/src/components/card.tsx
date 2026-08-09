import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import { cn } from '@atlas/ui/lib/utils'

export const cardVariants = cva(
  'group/card overflow-hidden rounded-4xl bg-card text-sm text-card-foreground ring-1 ring-foreground/5 dark:ring-foreground/10 *:[img:first-child]:rounded-t-4xl *:[img:last-child]:rounded-b-4xl',
  {
    variants: {
      variant: {
        default: 'shadow-md',
        interactive:
          'shadow-md transition-[transform,box-shadow,background-color] duration-150 hover:-translate-y-px hover:bg-accent/20 hover:shadow-[var(--shadow-card-hover)]',
        flat: 'shadow-none ring-border',
      },
      size: {
        default: '[--card-spacing:--spacing(6)]',
        sm: '[--card-spacing:--spacing(4)]',
      },
      spacing: {
        default:
          'flex flex-col gap-(--card-spacing) py-(--card-spacing) has-[>img:first-child]:pt-0',
        compact: 'flex flex-col gap-4 p-4',
        none: 'gap-0 p-0',
      },
    },
    defaultVariants: { variant: 'default', size: 'default', spacing: 'default' },
  }
)

export function Card({
  className,
  variant,
  size,
  spacing,
  asChild = false,
  ...props
}: React.ComponentProps<'div'> &
  VariantProps<typeof cardVariants> & {
    asChild?: boolean
  }) {
  const Component = asChild ? Slot.Root : 'div'
  return (
    <Component
      data-slot="card"
      data-variant={variant ?? 'default'}
      data-size={size ?? 'default'}
      data-spacing={spacing ?? 'default'}
      className={cn(cardVariants({ variant, size, spacing }), className)}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        'group/card-header @container/card-header grid auto-rows-min items-start gap-1.5 rounded-t-4xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)',
        className
      )}
      {...props}
    />
  )
}

export function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('font-heading text-base font-medium', className)}
      {...props}
    />
  )
}

export function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

export function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  )
}

export function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="card-content" className={cn('px-(--card-spacing)', className)} {...props} />
  )
}

export function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        'flex items-center rounded-b-4xl px-(--card-spacing) [.border-t]:pt-(--card-spacing)',
        className
      )}
      {...props}
    />
  )
}
