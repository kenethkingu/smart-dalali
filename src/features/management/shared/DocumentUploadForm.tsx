import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { PrimaryButton } from '@/components/shared/Bits'
import { useAuth } from '@/lib/auth'
import { DOCUMENT_TYPES, uploadDocument, validateDocumentFile } from '@/services/management/documentService'
import { FormField } from './FormField'
import { INPUT_CLASS } from './formStyles'
import { InlineNotice } from './InlineNotice'
import { errorText } from './errors'
import type { DocumentType } from '@/types/management'

export interface UploadTarget {
  key: string
  propertyId: string
  leaseId?: string
  label: string
}

interface DocumentUploadFormProps {
  readonly targets: readonly UploadTarget[]
}

export function DocumentUploadForm({ targets }: DocumentUploadFormProps) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [targetKey, setTargetKey] = useState(targets[0]?.key ?? '')
  const [type, setType] = useState<DocumentType>('other')
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | undefined>()
  const [saved, setSaved] = useState(false)
  const target = targets.find(item => item.key === targetKey) ?? targets[0]

  const checkFile = (candidate: File | null): string | undefined => {
    if (!candidate) return t('management.errors.required')
    const code = validateDocumentFile(candidate)
    return code ? t(`management.errors.${code}`) : undefined
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const problem = checkFile(file)
    setFileError(problem)
    if (problem || !file || !user || !target) return
    const result = uploadDocument(user, { propertyId: target.propertyId, leaseId: target.leaseId, type, file })
    if (!result.ok) {
      setFileError(errorText(t, result))
      return
    }
    setSaved(true)
    setFile(null)
    event.currentTarget.reset()
  }

  if (!target) return null
  return (
    <form onSubmit={handleSubmit} noValidate className="mb-8 space-y-4 rounded-2xl border border-pl-line bg-pl-surface p-5">
      <h2 className="font-heading text-lg font-bold text-pl-text">{t('management.documents.upload_title')}</h2>
      {targets.length > 1 && (
        <FormField id="doc-target" label={t('management.documents.for_label')}>
          {props => (
            <select {...props} className={INPUT_CLASS} value={targetKey} onChange={e => setTargetKey(e.target.value)}>
              {targets.map(item => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
            </select>
          )}
        </FormField>
      )}
      <FormField id="doc-type" label={t('management.documents.type_label')}>
        {props => (
          <select {...props} className={INPUT_CLASS} value={type} onChange={e => setType(e.target.value as DocumentType)}>
            {DOCUMENT_TYPES.map(item => (
              <option key={item} value={item}>
                {t(`management.documents.type.${item}`)}
              </option>
            ))}
          </select>
        )}
      </FormField>
      <FormField id="doc-file" label={t('management.documents.file_label')} hint={t('management.documents.file_hint')} error={fileError}>
        {props => (
          <input
            {...props}
            type="file"
            accept="application/pdf,image/jpeg,image/png"
            className={INPUT_CLASS}
            onChange={e => {
              const next = e.target.files?.[0] ?? null
              setFile(next)
              setSaved(false)
              setFileError(next ? checkFile(next) : undefined)
            }}
          />
        )}
      </FormField>
      {saved && <InlineNotice variant="success">{t('management.documents.saved')}</InlineNotice>}
      <PrimaryButton type="submit" className="min-h-11 sm:w-auto">
        {t('management.documents.upload_button')}
      </PrimaryButton>
    </form>
  )
}
