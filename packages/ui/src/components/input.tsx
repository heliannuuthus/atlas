import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@atlas/ui/lib/utils'

export const inputVariants = cva(
  'w-full min-w-0 rounded-3xl border border-transparent bg-input/50 text-foreground outline-none transition-[color,box-shadow,background-color] placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground file:inline-flex file:border-0 file:bg-transparent file:font-medium file:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
  {
    variants: {
      inputSize: {
        sm: 'h-8 px-2.5 py-1 text-xs file:h-6 file:text-xs',
        default: 'h-9 px-3 py-1 text-base file:h-7 file:text-sm md:text-sm',
        lg: 'h-10 px-3.5 py-2 text-base file:h-8 file:text-sm md:text-sm',
      },
    },
    defaultVariants: { inputSize: 'default' },
  }
)

export interface InputProps
  extends Omit<React.ComponentProps<'input'>, 'size'>, VariantProps<typeof inputVariants> {
  size?: React.ComponentProps<'input'>['size']
}

export function Input({ className, type, inputSize, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      data-size={inputSize ?? 'default'}
      className={cn(inputVariants({ inputSize }), className)}
      {...props}
    />
  )
}
