import { Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { EmptyState } from './EmptyState'

export function AccessDenied() {
  const { t } = useTranslation()
  return (
    <div className="container mx-auto max-w-xl px-4 py-16">
      <EmptyState
        icon={Lock}
        title={t('management.access_denied.title')}
        description={t('management.access_denied.description')}
        action={
          <Link to="/" className="inline-flex h-11 items-center font-semibold text-pl-accent hover:underline">
            {t('management.access_denied.action')}
          </Link>
        }
      />
    </div>
  )
}
