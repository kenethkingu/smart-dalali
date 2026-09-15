import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Building2 } from 'lucide-react'
import { properties as initialProperties } from '@/data/mockData'
import type { Property } from '@/types'
import { formatPrice, PrimaryButton, DangerButton } from '@/components/shared/Bits'

export function AdminProperties() {
  const [queue, setQueue] = useState<Property[]>(
    initialProperties.filter(p => p.status === 'pending')
  )
  const [done, setDone] = useState<{ property: Property; action: 'approved' | 'rejected' }[]>([])

  const decide = (id: string, action: 'approved' | 'rejected') => {
    const property = queue.find(p => p.id === id)
    if (!property) return
    setQueue(prev => prev.filter(p => p.id !== id))
    setDone(prev => [{ property, action }, ...prev])
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-pl-ink mb-1 flex items-center gap-2">
          <Building2 className="w-8 h-8" /> Property Approval Queue
        </h1>
        <p className="text-pl-muted">Review pending listings — approve to make them public, reject to return them to the owner.</p>
      </div>

      {queue.length === 0 && done.length === 0 ? (
        <div className="bg-white rounded-2xl border border-pl-line p-12 text-center">
          <CheckCircle className="w-12 h-12 text-pl-accent mx-auto mb-4" />
          <h2 className="text-xl font-bold text-pl-ink mb-2">Queue is clear!</h2>
          <p className="text-pl-muted">All pending listings have been reviewed. Check back later.</p>
        </div>
      ) : (
        <>
          {/* Pending queue */}
          {queue.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-pl-ink">Pending ({queue.length})</h2>
              </div>
              <div className="space-y-4">
                <AnimatePresence>
                  {queue.map(property => (
                    <motion.div
                      key={property.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -40, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="bg-white rounded-2xl border border-pl-line p-6"
                    >
                      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-pl-ink text-lg mb-1">{property.title}</h3>
                          <p className="text-sm text-pl-muted mb-2">{property.location}</p>
                          <p className="text-sm text-pl-ink font-semibold mb-3">
                            TSh {formatPrice(property.price)}{property.priceUnit === 'month' ? '/mo' : ''}
                            <span className="text-pl-muted font-normal ml-2">•</span>
                            <span className="text-pl-muted font-normal ml-2 capitalize">{property.type}</span>
                            {property.type === 'house' && property.bedrooms && <span className="text-pl-muted font-normal ml-2">• {property.bedrooms} bed</span>}
                          </p>
                          <p className="text-sm text-pl-muted line-clamp-2">{property.description}</p>
                          {property.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {property.amenities.map(a => (
                                <span key={a} className="text-[11px] px-2 py-0.5 rounded-full bg-pl-surface border border-pl-line text-pl-muted">
                                  {a}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <DangerButton
                            onClick={() => decide(property.id, 'rejected')}
                            className="h-10 px-4"
                          >
                            <XCircle className="w-4 h-4" /> Reject
                          </DangerButton>
                          <PrimaryButton
                            onClick={() => decide(property.id, 'approved')}
                            className="h-10 px-4"
                          >
                            <CheckCircle className="w-4 h-4" /> Approve
                          </PrimaryButton>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Reviewed section */}
          {done.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-pl-ink mb-4">Reviewed Today ({done.length})</h2>
              <div className="space-y-2">
                {done.map(({ property, action }) => (
                  <div key={property.id} className={`rounded-xl border p-4 flex items-center justify-between ${action === 'approved' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                    <span className="text-sm font-semibold text-pl-ink">{property.title}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${action === 'approved' ? 'text-pl-accent-dark' : 'text-pl-danger'}`}>
                      {action === 'approved' ? '✓ Approved' : '✗ Rejected'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
