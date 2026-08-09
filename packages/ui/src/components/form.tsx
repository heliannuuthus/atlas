import { createContext, useContext, useId } from 'react'
import { Slot } from '@radix-ui/react-slot'
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'
import { Label } from './field'
import { cn } from '../lib/utils'

export const Form = FormProvider
const FormFieldContext = createContext<{ name: string }>({ name: '' })

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const FormItemContext = createContext<{ id: string }>({ id: '' })
export function FormItem({ className, ...props }: React.ComponentProps<'div'>) {
  const id = useId()
  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={cn('grid gap-2', className)} {...props} />
    </FormItemContext.Provider>
  )
}

function useFormField() {
  const field = useContext(FormFieldContext)
  const item = useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()
  const state = getFieldState(field.name, formState)
  return {
    ...state,
    name: field.name,
    formItemId: `${item.id}-form-item`,
    formDescriptionId: `${item.id}-form-item-description`,
    formMessageId: `${item.id}-form-item-message`,
  }
}

export function FormLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  const { error, formItemId } = useFormField()
  return (
    <Label htmlFor={formItemId} className={cn(error && 'text-destructive', className)} {...props} />
  )
}

export function FormControl({
  ...props
}: React.ComponentProps<typeof import('@radix-ui/react-slot').Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()
  return (
    <Slot
      id={formItemId}
      aria-describedby={error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId}
      aria-invalid={Boolean(error)}
      {...props}
    />
  )
}

export function FormDescription({ className, ...props }: React.ComponentProps<'p'>) {
  const { formDescriptionId } = useFormField()
  return (
    <p
      id={formDescriptionId}
      className={cn('text-xs text-muted-foreground', className)}
      {...props}
    />
  )
}

export function FormMessage({ className, children, ...props }: React.ComponentProps<'p'>) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error.message ?? '') : children
  if (!body) return null
  return (
    <p
      id={formMessageId}
      role="alert"
      className={cn('text-xs text-destructive', className)}
      {...props}
    >
      {body}
    </p>
  )
}
