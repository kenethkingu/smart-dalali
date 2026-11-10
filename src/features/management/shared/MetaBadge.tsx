import { useTranslation } from 'react-i18next'
import { StatusBadge } from './StatusBadge'
import type { StatusMeta } from './statusMeta'

export function MetaBadge({ meta }: Readonly<{ meta: StatusMeta }>) {
  const { t } = useTranslation()
  return <StatusBadge icon={meta.icon} label={t(meta.labelKey)} emphasis={meta.emphasis} />
}
