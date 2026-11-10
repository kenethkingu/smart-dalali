import { cn } from '@/lib/utils'

interface FilterOption<T extends string> {
  value: T
  label: string
}

interface FilterTabsProps<T extends string> {
  readonly label: string
  readonly options: readonly FilterOption<T>[]
  readonly value: T
  readonly onChange: (value: T) => void
}

export function FilterTabs<T extends string>({ label, options, value, onChange }: FilterTabsProps<T>) {
  return (
    <div role="group" aria-label={label} className="mb-5 flex flex-wrap gap-2">
      {options.map(option => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className={cn(
            'min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors',
            option.value === value
              ? 'border-pl-accent bg-pl-accent text-white'
              : 'border-pl-line bg-pl-bg text-pl-text hover:border-pl-accent',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
