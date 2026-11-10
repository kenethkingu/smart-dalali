import { useTranslation } from 'react-i18next'
import { propertyLabel } from '../shared/PropertyLabel'
import { INPUT_CLASS } from '../shared/formStyles'
import type { Lease } from '@/types/management'

interface LeaseSwitcherProps {
  readonly leases: readonly Lease[]
  readonly value: string
  readonly onChange: (leaseId: string) => void
}

export function LeaseSwitcher({ leases, value, onChange }: LeaseSwitcherProps) {
  const { t } = useTranslation()
  if (leases.length < 2) return null
  return (
    <div className="mb-6 max-w-sm">
      <label htmlFor="lease-switcher" className="mb-1.5 block text-sm font-semibold text-pl-text">
        {t('management.tenant.switch_home')}
      </label>
      <select id="lease-switcher" className={INPUT_CLASS} value={value} onChange={e => onChange(e.target.value)}>
        {leases.map(lease => (
          <option key={lease.id} value={lease.id}>
            {propertyLabel(lease.propertyId, lease.unitNumber)}
          </option>
        ))}
      </select>
    </div>
  )
}
