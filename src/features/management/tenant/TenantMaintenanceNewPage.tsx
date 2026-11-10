import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { PrimaryButton } from '@/components/shared/Bits'
import { useAuth } from '@/lib/auth'
import { createTicket, MAX_PHOTOS, TICKET_CATEGORIES, TICKET_URGENCIES, validatePhotos } from '@/services/management/maintenanceService'
import { MAX_TEXT_LENGTH, MAX_TITLE_LENGTH, validateText } from '@/services/management/shared'
import { FormField } from '../shared/FormField'
import { INPUT_CLASS } from '../shared/formStyles'
import { EmptyState } from '../shared/EmptyState'
import { PageHeader } from '../shared/PageHeader'
import { LeaseSwitcher } from './LeaseSwitcher'
import { PhotoPicker } from './PhotoPicker'
import { useActiveLease } from './useActiveLease'
import { Wrench } from 'lucide-react'
import type { TicketCategory, TicketUrgency } from '@/types/management'

type FieldName = 'title' | 'description' | 'photos'
type FieldErrors = Partial<Record<FieldName, string>>

interface Values {
  category: TicketCategory
  title: string
  description: string
  urgency: TicketUrgency
  photos: File[]
}

const INITIAL: Values = { category: 'plumbing', title: '', description: '', urgency: 'normal', photos: [] }

export default function TenantMaintenanceNewPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { leases, lease, select } = useActiveLease()
  const [values, setValues] = useState<Values>(INITIAL)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)

  const message = (code: string | null) => (code ? t(`management.errors.${code}`) : undefined)

  const validateField = (name: FieldName, current: Values): string | undefined => {
    if (name === 'title') return message(validateText(current.title, MAX_TITLE_LENGTH))
    if (name === 'description') return message(validateText(current.description, MAX_TEXT_LENGTH))
    return message(validatePhotos(current.photos, MAX_PHOTOS))
  }

  const blur = (name: FieldName) => setErrors(current => ({ ...current, [name]: validateField(name, values) }))
  const patch = (next: Partial<Values>) => setValues(current => ({ ...current, ...next }))

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const fieldErrors: FieldErrors = {
      title: validateField('title', values),
      description: validateField('description', values),
      photos: validateField('photos', values),
    }
    setErrors(fieldErrors)
    if (Object.values(fieldErrors).some(Boolean) || !user || !lease) return
    setSubmitting(true)
    const result = createTicket(user, { leaseId: lease.id, ...values })
    setSubmitting(false)
    if (result.ok) navigate('/tenant/maintenance')
    else setErrors({ title: t(`management.errors.${result.error}`) })
  }

  if (!lease) {
    return (
      <div className="max-w-2xl">
        <PageHeader title={t('management.maintenance.report')} />
        <EmptyState icon={Wrench} title={t('management.tenant.empty_title')} description={t('management.tenant.empty_description')} />
      </div>
    )
  }

  return (
    <div className="max-w-2xl text-pl-text">
      <PageHeader title={t('management.maintenance.report')} description={t('management.maintenance.report_subtitle')} />
      <LeaseSwitcher leases={leases} value={lease.id} onChange={select} />
      <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-2xl border border-pl-line bg-pl-surface p-5">
        <FormField id="ticket-category" label={t('management.maintenance.category_label')}>
          {props => (
            <select {...props} className={INPUT_CLASS} value={values.category} onChange={e => patch({ category: e.target.value as TicketCategory })}>
              {TICKET_CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {t(`management.maintenance.category.${category}`)}
                </option>
              ))}
            </select>
          )}
        </FormField>
        <FormField id="ticket-title" label={t('management.maintenance.title_label')} error={errors.title}>
          {props => (
            <input
              {...props}
              className={INPUT_CLASS}
              maxLength={MAX_TITLE_LENGTH}
              value={values.title}
              onChange={e => patch({ title: e.target.value })}
              onBlur={() => blur('title')}
            />
          )}
        </FormField>
        <FormField id="ticket-description" label={t('management.maintenance.description_label')} error={errors.description}>
          {props => (
            <textarea
              {...props}
              className={INPUT_CLASS}
              rows={4}
              maxLength={MAX_TEXT_LENGTH}
              value={values.description}
              onChange={e => patch({ description: e.target.value })}
              onBlur={() => blur('description')}
            />
          )}
        </FormField>
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">{t('management.maintenance.urgency_label')}</legend>
          <div className="flex gap-3">
            {TICKET_URGENCIES.map(urgency => (
              <label key={urgency} className="flex min-h-11 flex-1 cursor-pointer items-center gap-2 rounded-xl border border-pl-line bg-pl-bg px-4 text-sm font-semibold has-[:checked]:border-pl-accent">
                <input type="radio" name="urgency" value={urgency} checked={values.urgency === urgency} onChange={() => patch({ urgency })} className="accent-[var(--pl-accent)]" />
                {t(`management.maintenance.urgency.${urgency}`)}
              </label>
            ))}
          </div>
        </fieldset>
        <PhotoPicker
          id="ticket-photos"
          label={t('management.maintenance.photos_label')}
          max={MAX_PHOTOS}
          files={values.photos}
          error={errors.photos}
          onChange={photos => {
            patch({ photos })
            setErrors(current => ({ ...current, photos: message(validatePhotos(photos, MAX_PHOTOS)) }))
          }}
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <PrimaryButton type="submit" isLoading={submitting} className="min-h-11 sm:w-auto">
            {t('management.maintenance.submit')}
          </PrimaryButton>
          <Link to="/tenant/maintenance" className="inline-flex min-h-11 items-center font-semibold text-pl-muted hover:text-pl-text">
            {t('common.cancel')}
          </Link>
        </div>
      </form>
    </div>
  )
}
