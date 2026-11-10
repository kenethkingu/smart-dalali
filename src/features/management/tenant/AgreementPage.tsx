import { ArrowLeft } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { PrimaryButton } from '@/components/shared/Bits'
import { useAuth } from '@/lib/auth'
import { formatDate } from '@/lib/dateFormat'
import { formatTZS } from '@/lib/money'
import { can } from '@/lib/rbac'
import { useContract } from '@/hooks/management/useContract'
import { useLease } from '@/hooks/management/useLeases'
import { buildContract, CLAUSE_KEYS, signContract } from '@/services/management/contractService'
import { leaseResource } from '@/services/management/shared'
import { AccessDenied } from '../shared/AccessDenied'
import { FormField } from '../shared/FormField'
import { INPUT_CLASS } from '../shared/formStyles'
import { InlineNotice } from '../shared/InlineNotice'
import { NotFoundState } from '../shared/NotFoundState'
import { PageHeader } from '../shared/PageHeader'
import { SuccessCheck } from '../shared/SuccessCheck'
import type { Contract, Lease } from '@/types/management'

function SignatureRow({ label, signature }: Readonly<{ label: string; signature?: Contract['ownerSignature'] }>) {
  const { t } = useTranslation()
  return (
    <div className="flex justify-between gap-3 text-sm">
      <dt className="text-pl-muted">{label}</dt>
      <dd className="font-semibold text-pl-text">
        {signature ? t('management.agreement.signed_by', { name: signature.fullName, date: formatDate(signature.signedAt) }) : t('management.agreement.not_signed')}
      </dd>
    </div>
  )
}

function SignForm({ lease }: Readonly<{ lease: Lease }>) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [fullName, setFullName] = useState('')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; consent?: string }>({})
  const [done, setDone] = useState(false)

  const checkName = (value: string) => (value.trim().split(/\s+/).length >= 2 ? undefined : t('management.errors.invalid_name'))

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const next = { name: checkName(fullName), consent: consent ? undefined : t('management.errors.consent_required') }
    setErrors(next)
    if (next.name || next.consent || !user) return
    const result = signContract(user, { leaseId: lease.id, fullName, consent })
    if (result.ok) setDone(true)
    else setErrors({ name: t(`management.errors.${result.error}`) })
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-pl-line bg-pl-surface p-6 text-center">
        <SuccessCheck />
        <p className="mt-3 font-semibold text-pl-text">{t('management.agreement.signed_success')}</p>
      </div>
    )
  }
  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-2xl border border-pl-line bg-pl-surface p-5">
      <h2 className="font-heading text-lg font-bold text-pl-text">{t('management.agreement.sign_title')}</h2>
      <FormField id="sign-name" label={t('management.agreement.full_name')} hint={t('management.agreement.full_name_hint')} error={errors.name}>
        {props => (
          <input
            {...props}
            className={INPUT_CLASS}
            autoComplete="name"
            maxLength={80}
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            onBlur={() => setErrors(current => ({ ...current, name: checkName(fullName) }))}
          />
        )}
      </FormField>
      <div>
        <label className="flex min-h-11 cursor-pointer items-start gap-3 text-sm text-pl-text">
          <input
            type="checkbox"
            checked={consent}
            aria-describedby={errors.consent ? 'sign-consent-error' : undefined}
            onChange={e => setConsent(e.target.checked)}
            className="mt-1 h-5 w-5 accent-[var(--pl-accent)]"
          />
          {t('management.agreement.consent')}
        </label>
        {errors.consent && (
          <p id="sign-consent-error" className="text-xs font-semibold text-pl-danger">
            {errors.consent}
          </p>
        )}
      </div>
      <PrimaryButton type="submit" className="min-h-11 sm:w-auto">
        {t('management.agreement.sign_button')}
      </PrimaryButton>
    </form>
  )
}

export default function AgreementPage() {
  const { leaseId } = useParams()
  const { t } = useTranslation()
  const { user } = useAuth()
  const lease = useLease(leaseId)
  const contract = useContract(leaseId)

  if (!lease) return <NotFoundState backTo="/" />
  if (!can(user, 'contract.view', leaseResource(lease))) return <AccessDenied />
  const view = buildContract(lease)
  if (!view) return <NotFoundState backTo="/" />

  const asOwner = user?.id === lease.ownerId
  const mySignature = asOwner ? contract?.ownerSignature : contract?.tenantSignature
  const canSign = can(user, 'contract.sign', leaseResource(lease)) && lease.status === 'pending-signature' && !mySignature
  const backTo = asOwner ? `/owner/tenancies/${lease.id}` : '/tenant/dashboard'

  return (
    <div className="max-w-3xl text-pl-text">
      <Link to={backTo} className="mb-4 inline-flex min-h-11 items-center text-sm font-medium text-pl-muted hover:text-pl-text">
        <ArrowLeft className="mr-1 h-4 w-4 text-pl-accent" aria-hidden="true" /> {t('common.back')}
      </Link>
      <PageHeader title={t('management.agreement.title')} description={t('management.agreement.subtitle')} />
      <div className="mb-6">
        <InlineNotice>{t('management.agreement.preview_notice')}</InlineNotice>
      </div>

      <article className="mb-6 space-y-5 rounded-2xl border border-pl-line bg-pl-surface p-6">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-3"><dt className="text-pl-muted">{t('management.agreement.owner')}</dt><dd className="font-semibold">{lease.ownerName}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-pl-muted">{t('management.agreement.tenant')}</dt><dd className="font-semibold">{lease.tenantName}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-pl-muted">{t('management.agreement.property')}</dt><dd className="text-right font-semibold">{view.propertyTitle}, {view.propertyLocation}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-pl-muted">{t('management.lease.rent')}</dt><dd className="font-semibold">{t('management.lease.per_month', { amount: formatTZS(lease.monthlyRent) })}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-pl-muted">{t('management.lease.start')}</dt><dd className="font-semibold">{formatDate(lease.startDate)}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-pl-muted">{t('management.lease.end')}</dt><dd className="font-semibold">{lease.endDate ? formatDate(lease.endDate) : t('management.lease.month_to_month')}</dd></div>
        </dl>
        <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed">
          {CLAUSE_KEYS.map(key => (
            <li key={key}>
              <span className="font-semibold">{t(`management.agreement.clause.${key}.title`)}. </span>
              {t(`management.agreement.clause.${key}.body`, { rent: formatTZS(lease.monthlyRent) })}
            </li>
          ))}
        </ol>
      </article>

      <dl className="mb-6 space-y-2 rounded-2xl border border-pl-line bg-pl-surface p-5">
        <SignatureRow label={t('management.agreement.owner')} signature={contract?.ownerSignature} />
        <SignatureRow label={t('management.agreement.tenant')} signature={contract?.tenantSignature} />
      </dl>

      {canSign && <SignForm lease={lease} />}
      {lease.status === 'active' && <InlineNotice variant="success">{t('management.agreement.active_notice')}</InlineNotice>}
      {!canSign && lease.status === 'pending-signature' && mySignature && <InlineNotice>{t('management.agreement.waiting_other')}</InlineNotice>}
    </div>
  )
}
