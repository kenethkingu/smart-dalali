import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, Calendar, Phone } from 'lucide-react'
import { Hero } from '../components/home/Hero'
import { PropertyCard } from '../components/properties/PropertyCard'
import { PrimaryButton, GhostButton } from '../components/shared/Bits'
import { Timeline } from '@/components/ui/timeline'
import { publicProperties } from '../data/mockData'

import { useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export function useFadeUp() {
  const shouldReduce = useReducedMotion()
  return (delay = 0) => ({
    initial: shouldReduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: shouldReduce ? 0 : 0.6, delay: shouldReduce ? 0 : delay },
  })
}

const steps = [
  {
    n: '01',
    title: 'Find a Property',
    desc: 'Browse our curated list of verified homes and plots across Tanzania. Every listing has been reviewed by our team before it goes live.',
    offset: 'mt-0',
  },
  {
    n: '02',
    title: 'Request a Visit',
    desc: 'Schedule a site visit in one click and communicate directly with the verified owner via WhatsApp. No agents, no middlemen, no commission conversations.',
    offset: 'mt-16 lg:mt-24',
  },
  {
    n: '03',
    title: 'Secure Your Deal',
    desc: "Confirm payment only after you've inspected the property. You have 3 days to decline at no cost — Proland's site-visit policy, not a legal disclaimer.",
    offset: 'mt-8 lg:mt-12',
  },
]

const trustItems = [
  { icon: ShieldCheck, title: 'Verified Listings', desc: 'Every property is admin-reviewed before going public.' },
  { icon: Calendar, title: 'Visit Before You Pay', desc: 'Book a site visit, inspect the property, then decide.' },
  { icon: Phone, title: 'Direct Owner Contact', desc: 'WhatsApp the owner directly — no intermediary fees.' },
]

export function Home() {
  const fadeUp = useFadeUp()
  const { t } = useTranslation()
  // Use all approved properties for the editorial grid
  const [featured, ...rest] = publicProperties

  return (
    <div className="bg-white min-h-screen">
      <Hero />

      {/* ── Featured Properties ─────────────────────────────────────────────── */}
      <section className="grain-texture py-20 bg-white" id="featured">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp()} className="flex items-end justify-between mb-10">
            <div>
              <h2
                className="font-heading font-bold text-pl-ink"
                style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', letterSpacing: '-0.015em', lineHeight: 1.15 }}
              >
                {t('home.featuredProperties', 'Featured Properties')}
              </h2>
              <p className="text-pl-muted mt-2 max-w-md">
                {t('home.featuredDesc', 'Hand-picked listings from verified owners — each reviewed before going live.')}
              </p>
            </div>
            <Link to="/properties" className="hidden sm:block shrink-0 ml-8">
              <GhostButton>{t('home.viewAll', 'View All')}</GhostButton>
            </Link>
          </motion.div>

          {/* Editorial asymmetric grid: first card spans 2 cols × 2 rows */}
          {featured ? (
            <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4">
              {/* Anchor: large featured card */}
              <motion.div {...fadeUp(0)} className="md:col-span-2 md:row-span-2">
                <PropertyCard property={featured} featured />
              </motion.div>

              {/* Supporting cards fill the right column */}
              {rest.slice(0, 2).map((p, i) => (
                <motion.div key={p.id} {...fadeUp(0.1 + i * 0.1)}>
                  <PropertyCard property={p} />
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-pl-muted">No approved properties yet.</p>
          )}

          <div className="mt-6 sm:hidden">
            <Link to="/properties">
              <PrimaryButton className="w-full">{t('home.viewAll', 'View All')}</PrimaryButton>
            </Link>
          </div>
        </div>
      </section>

      {/* ── How Proland Works ──────────────────────────────────────────────── */}
      <section className="grain-texture bg-pl-ink text-white" id="how-it-works">
        <Timeline
          data={steps.map(step => ({
            title: `Step ${step.n}`,
            content: (
              <div>
                <h3 className="font-heading font-bold text-white mb-4 text-2xl">
                  {step.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed max-w-sm">
                  {step.desc}
                </p>
              </div>
            )
          }))}
        />
        
        <motion.div {...fadeUp(0.5)} className="mt-20 pt-12 border-t border-white/20 flex justify-center pb-20">
          <Link to="/properties">
            <PrimaryButton className="h-13 px-10">{t('home.browseProperties', 'Browse Properties')}</PrimaryButton>
          </Link>
        </motion.div>
      </section>
      {/* ── Why Proland ────────────────────────────────────────────────────── */}
      <section className="grain-texture py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.h2
            {...fadeUp()}
            className="font-heading font-bold text-pl-ink mb-12"
            style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', letterSpacing: '-0.015em' }}
          >
            Why Proland
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustItems.map((item, i) => (
              <motion.div
                key={item.title}
                {...fadeUp(i * 0.1)}
                className="card-hover bg-white border border-pl-line rounded-lg p-7"
              >
                <div className="w-10 h-10 rounded-md bg-pl-ink flex items-center justify-center mb-5">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-pl-ink mb-2 text-base">
                  {item.title === 'Verified Listings' ? (
                    <>
                      <motion.span
                        initial={{ color: 'var(--pl-ink)' }}
                        whileInView={{ color: 'var(--pl-accent)' }}
                        viewport={{ once: true, margin: '-10%' }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                      >
                        Verified
                      </motion.span>{' '}
                      Listings
                    </>
                  ) : (
                    item.title
                  )}
                </h3>
                <p className="text-pl-muted text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Owner CTA ──────────────────────────────────────────────────────── */}
      <section className="grain-texture py-20 px-4 bg-pl-surface border-t border-pl-line">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.p {...fadeUp()} className="text-xs font-bold uppercase tracking-[0.2em] text-pl-muted mb-4">
            {t('home.forOwners', 'For Property Owners')}
          </motion.p>
          <motion.h2
            {...fadeUp(0.1)}
            className="font-heading font-bold text-pl-ink mb-4"
            style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', letterSpacing: '-0.015em' }}
          >
            {t('home.haveProperty', 'Have a Property to Sell or Rent?')}
          </motion.h2>
          <motion.p {...fadeUp(0.15)} className="text-pl-muted mb-8 max-w-md mx-auto">
            List for free. Once our team approves your listing, it's live to thousands of verified buyers.
          </motion.p>
          <motion.div {...fadeUp(0.2)}>
            <Link to="/login">
              <PrimaryButton className="h-13 px-10 text-base">{t('home.listForFree', 'List Your Property Free')}</PrimaryButton>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
