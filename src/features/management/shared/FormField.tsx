import type { ReactNode } from 'react'

export interface FieldControlProps {
  id: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean
}

interface FormFieldProps {
  readonly id: string
  readonly label: string
  readonly error?: string
  readonly hint?: string
  readonly children: (props: FieldControlProps) => ReactNode
}

export function FormField({ id, label, error, hint, children }: FormFieldProps) {
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-pl-text">
        {label}
      </label>
      {children({ id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined })}
      {hint && (
        <p id={hintId} className="text-xs text-pl-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs font-semibold text-pl-danger">
          {error}
        </p>
      )}
    </div>
  )
}
