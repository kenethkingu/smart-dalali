import { SearchX } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { EmptyState } from './EmptyState'

export function NotFoundState({ backTo }: Readonly<{ backTo: string }>) {
  const { t } = useTranslation()
  return (
    <EmptyState
      icon={SearchX}
      title={t('management.not_found.title')}
      description={t('management.not_found.description')}
      action={
        <Link to={backTo} className="inline-flex h-11 items-center font-semibold text-pl-accent hover:underline">
          {t('common.back')}
        </Link>
      }
    />
  )
}
