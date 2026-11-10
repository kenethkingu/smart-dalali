import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FormField } from '../shared/FormField'
import { INPUT_CLASS } from '../shared/formStyles'

interface PhotoPickerProps {
  readonly id: string
  readonly label: string
  readonly max: number
  readonly files: readonly File[]
  readonly error?: string
  readonly onChange: (files: File[]) => void
}

export function PhotoPicker({ id, label, max, files, error, onChange }: PhotoPickerProps) {
  const { t } = useTranslation()
  const previews = useMemo(() => files.map(file => ({ key: `${file.name}-${file.size}-${file.lastModified}`, name: file.name, url: URL.createObjectURL(file) })), [files])
  useEffect(() => () => previews.forEach(preview => URL.revokeObjectURL(preview.url)), [previews])

  return (
    <FormField id={id} label={label} hint={t('management.maintenance.photos_hint', { max })} error={error}>
      {props => (
        <>
          <input
            {...props}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className={INPUT_CLASS}
            onChange={e => onChange(Array.from(e.target.files ?? []))}
          />
          {previews.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {previews.map(preview => (
                <img key={preview.key} src={preview.url} alt={preview.name} className="h-16 w-16 rounded-lg border border-pl-line object-cover" />
              ))}
            </div>
          )}
        </>
      )}
    </FormField>
  )
}
