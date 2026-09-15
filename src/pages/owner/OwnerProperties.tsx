import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { properties } from '@/data/mockData'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { PrimaryButton, Pill } from '@/components/shared/Bits'
import type { Property } from '@/types'

export function OwnerProperties() {
  const { user } = useAuth()
  const [filter, setFilter] = useState<'all' | Property['status']>('all')

  const myProperties = properties.filter(p => p.ownerId === user?.id)
  const filtered = myProperties.filter(p => filter === 'all' || p.status === filter)

  return (
    <div className="max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-pl-ink mb-1">My Properties</h1>
          <p className="text-pl-muted">Manage your listed properties and their status.</p>
        </div>
        <Link to="/owner/properties/new">
          <PrimaryButton>List New Property</PrimaryButton>
        </Link>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <Pill active={filter === 'all'} onClick={() => setFilter('all')}>
          All Properties
        </Pill>
        <Pill active={filter === 'approved'} onClick={() => setFilter('approved')}>
          Approved
        </Pill>
        <Pill active={filter === 'pending'} onClick={() => setFilter('pending')}>
          Pending Review
        </Pill>
        <Pill active={filter === 'rejected'} onClick={() => setFilter('rejected')}>
          Rejected
        </Pill>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-pl-line p-12 text-center text-pl-muted">
          No {filter !== 'all' ? filter : ''} properties found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(property => (
            <div key={property.id} className="relative">
              <PropertyCard property={property} />
              <div className="mt-2 flex justify-end">
                <Link to={`/owner/properties/${property.id}/edit`} className="text-sm font-semibold text-pl-accent hover:text-pl-accent-dark">
                  Edit Property
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
