import { Search } from 'lucide-react'
import { Pill } from '../shared/Bits'
import { useTranslation } from 'react-i18next'

export function FiltersBar() {
  const { t } = useTranslation()
  return (
    <div className="bg-pl-bg border-b border-pl-line sticky top-16 z-30 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
            <span className="text-sm font-medium text-pl-muted whitespace-nowrap">{t('common.filter')}:</span>
            <Pill active>{t('hero.filter.all')}</Pill>
            <Pill>{t('hero.filter.houses')}</Pill>
            <Pill>{t('hero.filter.plots')}</Pill>
            <Pill>{t('hero.filter.offices')}</Pill>
            <div className="w-px h-4 bg-pl-line mx-1 shrink-0" />
            <Pill>{t('hero.filter.rent')}</Pill>
            <Pill>{t('hero.filter.buy')}</Pill>
          </div>

          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 text-pl-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder={t('hero.search_placeholder')} 
              className="w-full bg-pl-surface border border-pl-line rounded-full pl-9 pr-4 py-1.5 text-sm text-pl-text placeholder:text-pl-muted outline-none focus:border-pl-ink focus:bg-pl-bg transition-colors"
            />
          </div>

        </div>
      </div>
    </div>
  )
}
