import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, Calendar, Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Hero } from '../components/home/Hero'
import { PropertyCard } from '../components/properties/PropertyCard'
import { PrimaryButton, GhostButton } from '../components/shared/Bits'
import { Timeline } from '@/components/ui/timeline'
import { publicProperties } from '../data/mockData'

import { useReducedMotion } from 'framer-motion'

export function useFadeUp() {
  const shouldReduce = useReducedMotion()
  return (delay = 0) => ({
    initial: shouldReduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: shouldReduce ? 0 : 0.6, delay: shouldReduce ? 0 : delay },
  })
}

export function Home() {
  const { t } = useTranslation()
  const fadeUp = useFadeUp()
  const [featured, ...rest] = publicProperties

  const steps = [
    {
      n: '01',
      label: t('home.step_label', { n: '01' }),
      title: t('steps.step1.title'),
      desc: t('steps.step1.desc'),
    },
    {
      n: '02',
      label: t('home.step_label', { n: '02' }),
      title: t('steps.step2.title'),
      desc: t('steps.step2.desc'),
    },
    {
      n: '03',
      label: t('home.step_label', { n: '03' }),
      title: t('steps.step3.title'),
      desc: t('steps.step3.desc'),
    },
  ]

  const trustItems = [
    { icon: ShieldCheck, title: t('trust.verified_title'), desc: t('trust.verified_desc') },
    { icon: Calendar, title: t('trust.visit_title'), desc: t('trust.visit_desc') },
    { icon: Phone, title: t('trust.contact_title'), desc: t('trust.contact_desc') },
  ]

  return (
    <div className="bg-pl-bg text-pl-text min-h-screen">
      <Hero />

      {/* ── Featured Properties ─────────────────────────────────────────────── */}
      <section className="grain-texture py-20 bg-pl-bg" id="featured">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp()} className="flex items-end justify-between mb-10">
            <div>
              <h2
                className="font-heading font-bold text-pl-text"
                style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', letterSpacing: '-0.015em', lineHeight: 1.15 }}
              >
                {t('home.featured_title')}
              </h2>
              <p className="text-pl-muted mt-2 max-w-md">
                {t('home.featured_desc')}
              </p>
            </div>
            <Link to="/properties" className="hidden sm:block shrink-0 ml-8">
              <GhostButton>{t('home.view_all')}</GhostButton>
            </Link>
          </motion.div>

          {/* Editorial asymmetric grid */}
          {featured ? (
            <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4">
              <motion.div {...fadeUp(0)} className="md:col-span-2 md:row-span-2">
                <PropertyCard property={featured} featured />
              </motion.div>

              {rest.slice(0, 2).map((p, i) => (
                <motion.div key={p.id} {...fadeUp(0.1 + i * 0.1)}>
                  <PropertyCard property={p} />
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-pl-muted">{t('properties.zero_results_title')}</p>
          )}

          <div className="mt-6 sm:hidden">
            <Link to="/properties">
              <PrimaryButton className="w-full">{t('home.view_all_props')}</PrimaryButton>
            </Link>
          </div>
        </div>
      </section>

      {/* ── How Proland Works Timeline ───────────────────────────────────────── */}
      <section className="grain-texture bg-pl-ink text-white" id="how-it-works">
        <Timeline
          data={steps.map(step => ({
            title: step.label,
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
            <PrimaryButton className="h-13 px-10">{t('common.browse_properties')}</PrimaryButton>
          </Link>
        </motion.div>
      </section>

      {/* ── Why Proland ────────────────────────────────────────────────────── */}
      <section className="grain-texture py-20 bg-pl-bg">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.h2
            {...fadeUp()}
            className="font-heading font-bold text-pl-text mb-12"
            style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', letterSpacing: '-0.015em' }}
          >
            {t('trust.title')}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustItems.map((item, i) => (
              <motion.div
                key={item.title}
                {...fadeUp(i * 0.1)}
                className="card-hover bg-pl-surface border border-pl-line rounded-lg p-7"
              >
                <div className="w-10 h-10 rounded-md bg-pl-accent flex items-center justify-center mb-5">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-pl-text mb-2 text-base">
                  {item.title}
                </h3>
                <p className="text-pl-muted text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Owner CTA ──────────────────────────────────────────────────────── */}
      <section className="grain-texture py-20 px-4 bg-pl-surface border-t border-pl-line text-pl-text">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.p {...fadeUp()} className="text-xs font-bold uppercase tracking-[0.2em] text-pl-muted mb-4">
            {t('cta.owner_label')}
          </motion.p>
          <motion.h2
            {...fadeUp(0.1)}
            className="font-heading font-bold text-pl-text mb-4"
            style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', letterSpacing: '-0.015em' }}
          >
            {t('cta.owner_title')}
          </motion.h2>
          <motion.p {...fadeUp(0.15)} className="text-pl-muted mb-8 max-w-md mx-auto">
            {t('cta.owner_desc')}
          </motion.p>
          <motion.div {...fadeUp(0.2)}>
            <Link to="/login?role=owner">
              <PrimaryButton className="h-13 px-10 text-base">{t('cta.list_free')}</PrimaryButton>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
