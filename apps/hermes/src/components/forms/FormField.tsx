import type { ReactNode } from 'react'
import { Field, FieldDescription, FieldError, Label } from '@atlas/ui/field'

export function FormField({
  label,
  htmlFor,
  required,
  error,
  description,
  children,
}: {
  label: ReactNode
  htmlFor: string
  required?: boolean
  error?: string
  description?: ReactNode
  children: ReactNode
}) {
  return (
    <Field>
      <Label htmlFor={htmlFor}>
        {label}
        {required ? <span className="ml-1 text-destructive">*</span> : null}
      </Label>
      {children}
      {error ? <FieldError>{error}</FieldError> : null}
      {!error && description ? <FieldDescription>{description}</FieldDescription> : null}
    </Field>
  )
}
