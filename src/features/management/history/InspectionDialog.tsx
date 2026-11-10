import { ClipboardCheck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { GhostButton, PrimaryButton } from '@/components/shared/Bits'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '@/lib/auth'
import { INSPECTION_CHECKLIST, MAX_INSPECTION_PHOTOS, recordInspection } from '@/services/management/inspectionService'
import { FormField } from '../shared/FormField'
import { INPUT_CLASS } from '../shared/formStyles'
import { errorText } from '../shared/errors'
import type { ErrorCode, InspectionItem } from '@/types/management'

interface ChecklistRow {
  label: string
  passed: boolean
  note: string
}

function initialRows(): ChecklistRow[] {
  return INSPECTION_CHECKLIST.map(label => ({ label, passed: true, note: '' }))
}

const PHOTO_ERRORS: readonly ErrorCode[] = ['file_type', 'file_size', 'too_many_files']

function errorField(code: ErrorCode): 'date' | 'photos' | 'inspector' {
  if (code === 'invalid_date') return 'date'
  return PHOTO_ERRORS.includes(code) ? 'photos' : 'inspector'
}

function todayInputValue(): string {
  return new Date().toISOString().slice(0, 10)
}

export function InspectionDialog({ propertyId }: Readonly<{ propertyId: string }>) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [inspector, setInspector] = useState(user?.name ?? '')
  const [date, setDate] = useState(todayInputValue)
  const [rows, setRows] = useState<ChecklistRow[]>(initialRows)
  const [photos, setPhotos] = useState<File[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const updateRow = (label: string, patch: Partial<InspectionItem>) =>
    setRows(current => current.map(row => (row.label === label ? { ...row, ...patch } : row)))

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!user) return
    const result = recordInspection(user, { propertyId, inspectorName: inspector, date, items: rows, photos })
    if (result.ok) {
      setOpen(false)
      setRows(initialRows())
      setPhotos([])
      setErrors({})
      return
    }
    const message = errorText(t, result)
    setErrors({ [errorField(result.error)]: message })
  }

  return (
    <>
      <GhostButton onClick={() => setOpen(true)} className="min-h-11 shrink-0">
        <ClipboardCheck className="h-4 w-4" aria-hidden="true" /> {t('management.inspection.record')}
      </GhostButton>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border border-pl-line bg-pl-surface text-pl-text">
          <DialogHeader>
            <DialogTitle>{t('management.inspection.record')}</DialogTitle>
            <DialogDescription>{t('management.inspection.description')}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <FormField id="insp-name" label={t('management.inspection.inspector')} error={errors.inspector}>
              {props => <input {...props} className={INPUT_CLASS} value={inspector} maxLength={80} onChange={e => setInspector(e.target.value)} />}
            </FormField>
            <FormField id="insp-date" label={t('management.inspection.date')} error={errors.date}>
              {props => <input {...props} type="date" className={INPUT_CLASS} value={date} onChange={e => setDate(e.target.value)} />}
            </FormField>
            <fieldset className="space-y-3">
              <legend className="mb-1 text-sm font-semibold">{t('management.inspection.checklist')}</legend>
              {rows.map(row => (
                <div key={row.label} className="rounded-xl border border-pl-line bg-pl-bg p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm">{t(row.label)}</span>
                    <button
                      type="button"
                      aria-pressed={row.passed}
                      onClick={() => updateRow(row.label, { passed: !row.passed })}
                      className="min-h-11 rounded-full border border-pl-line px-4 text-sm font-semibold hover:border-pl-accent"
                    >
                      {row.passed ? t('management.inspection.pass') : t('management.inspection.fail')}
                    </button>
                  </div>
                  <input
                    className={`${INPUT_CLASS} mt-2`}
                    aria-label={t('management.inspection.note_for', { item: t(row.label) })}
                    placeholder={t('management.inspection.note_placeholder')}
                    value={row.note}
                    maxLength={200}
                    onChange={e => updateRow(row.label, { note: e.target.value })}
                  />
                </div>
              ))}
            </fieldset>
            <FormField
              id="insp-photos"
              label={t('management.inspection.photos')}
              hint={t('management.inspection.photos_hint', { max: MAX_INSPECTION_PHOTOS })}
              error={errors.photos}
            >
              {props => (
                <input
                  {...props}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  className={INPUT_CLASS}
                  onChange={e => setPhotos(Array.from(e.target.files ?? []))}
                />
              )}
            </FormField>
            <PrimaryButton type="submit" className="min-h-11">
              {t('management.inspection.save')}
            </PrimaryButton>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
