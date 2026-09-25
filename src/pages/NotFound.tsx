import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PrimaryButton } from '@/components/shared/Bits'

export function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="bg-pl-bg text-pl-text min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center bg-pl-surface text-pl-text rounded-2xl border border-pl-line p-10 shadow-md">
        <h1 className="text-3xl font-heading font-bold text-pl-text mb-4">404 — {t('properties.zero_results_title')}</h1>
        <p className="text-pl-muted mb-8 text-base">
          {t('properties.zero_results_desc')}
        </p>
        <Link to="/">
          <PrimaryButton className="w-full h-12 text-base">
            {t('common.back')} {t('nav.home')}
          </PrimaryButton>
        </Link>
      </div>
    </div>
  )
}
