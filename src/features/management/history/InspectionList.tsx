import { CheckCircle2, XCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { formatDate } from '@/lib/dateFormat'
import { getFileUrl } from '@/lib/objectUrls'
import type { Inspection } from '@/types/management'

export function InspectionList({ inspections }: Readonly<{ inspections: readonly Inspection[] }>) {
  const { t } = useTranslation()
  if (inspections.length === 0) return null
  return (
    <section className="mt-12" aria-labelledby="inspections-heading">
      <h2 id="inspections-heading" className="mb-4 font-heading text-xl font-bold">
        {t('management.inspection.title')}
      </h2>
      <ul className="space-y-4">
        {inspections.map(inspection => {
          const passed = inspection.items.filter(item => item.passed).length
          return (
            <li key={inspection.id} className="rounded-2xl border border-pl-line bg-pl-surface p-5">
              <p className="font-semibold">{t('management.inspection.by', { name: inspection.inspectorName, date: formatDate(inspection.date) })}</p>
              <p className="mb-3 text-sm text-pl-muted">{t('management.inspection.passed_count', { passed, total: inspection.items.length })}</p>
              <ul className="space-y-2">
                {inspection.items.map(item => (
                  <li key={item.label} className="flex items-start gap-2 text-sm">
                    {item.passed ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-pl-accent" aria-hidden="true" />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-pl-muted" aria-hidden="true" />
                    )}
                    <span>
                      <span className="sr-only">{item.passed ? t('management.inspection.pass') : t('management.inspection.fail')}: </span>
                      {t(item.label, { defaultValue: item.label })}
                      {item.note && <span className="block text-pl-muted">{item.note}</span>}
                    </span>
                  </li>
                ))}
              </ul>
              {inspection.photos.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {inspection.photos.map(photo => {
                    const url = getFileUrl(photo.id)
                    return url ? (
                      <img key={photo.id} src={url} alt={photo.name} className="h-16 w-16 rounded-lg border border-pl-line object-cover" />
                    ) : (
                      <span key={photo.id} className="rounded-lg border border-pl-line px-2 py-1 text-xs text-pl-muted">
                        {photo.name}
                      </span>
                    )
                  })}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
