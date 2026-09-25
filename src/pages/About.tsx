import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, Calendar, Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PrimaryButton } from '@/components/shared/Bits'
import { Logo } from '@/components/shared/Logo'
import { TracingBeam } from '@/components/ui/tracing-beam'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
})

export function About() {
  const { t } = useTranslation()

  const stats = [
    { label: t('about.stat_verified'), value: '1,200+' },
    { label: t('about.stat_visits'), value: '950+' },
    { label: t('about.stat_owners'), value: '340+' },
    { label: t('about.stat_satisfaction'), value: '99%' },
  ]

  const whyUs = [
    {
      icon: ShieldCheck,
      title: t('trust.verified_title'),
      desc: t('trust.verified_desc'),
    },
    {
      icon: Calendar,
      title: t('trust.visit_title'),
      desc: t('trust.visit_desc'),
    },
    {
      icon: Phone,
      title: t('trust.contact_title'),
      desc: t('trust.contact_desc'),
    },
  ]

  return (
    <div className="bg-pl-bg text-pl-text min-h-screen">
      {/* Hero */}
      <section className="grain-texture bg-pl-ink text-white py-28 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div {...fadeUp()} className="mb-6 flex justify-center">
            <Logo size={48} tone="light" />
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="text-4xl md:text-6xl font-heading font-bold mb-6 leading-tight">
            {t('about.title')}
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-white/80 text-lg max-w-xl mx-auto">
            {t('about.subtitle')}
          </motion.p>
        </div>
      </section>

      <TracingBeam className="px-6">
        {/* Mission & Vision */}
        <section className="grain-texture py-20 bg-pl-bg">
          <div className="container mx-auto max-w-3xl">
            <motion.h2 {...fadeUp()} className="text-3xl font-heading font-bold text-pl-text mb-6">
              {t('about.mission_title')}
            </motion.h2>
            <motion.div {...fadeUp(0.1)} className="space-y-6 text-pl-muted text-lg leading-relaxed mb-16">
              <p>{t('about.mission_desc')}</p>
            </motion.div>

            <motion.h2 {...fadeUp(0.2)} className="text-3xl font-heading font-bold text-pl-text mb-6">
              {t('about.vision_title')}
            </motion.h2>
            <motion.div {...fadeUp(0.3)} className="space-y-6 text-pl-muted text-lg leading-relaxed">
              <p>{t('about.vision_desc')}</p>
            </motion.div>
          </div>
        </section>

        {/* Why Proland */}
        <section className="grain-texture py-20 rounded-3xl bg-pl-surface border border-pl-line px-6 md:px-12 mx-auto max-w-5xl mb-20 text-pl-text">
          <motion.h2 {...fadeUp()} className="text-3xl font-heading font-bold text-pl-text mb-12 text-center">
            {t('about.why_us_title')}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyUs.map((item, i) => (
              <motion.div key={item.title} {...fadeUp(i * 0.1)} className="card-hover bg-pl-bg p-8 rounded-xl border border-pl-line">
                <div className="w-12 h-12 rounded-xl bg-pl-accent flex items-center justify-center mb-6">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-pl-text mb-3">{item.title}</h3>
                <p className="text-pl-muted leading-relaxed text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Statistics */}
        <section className="grain-texture py-20 mb-20 bg-pl-bg">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <motion.div key={s.label} {...fadeUp(i * 0.1)} className="text-center p-6 bg-pl-surface rounded-2xl border border-pl-line">
                  <div className="text-3xl sm:text-4xl font-heading font-bold text-pl-accent mb-2">{s.value}</div>
                  <div className="text-xs sm:text-sm font-medium text-pl-muted">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </TracingBeam>

      {/* CTA */}
      <section className="grain-texture py-20 px-4 bg-pl-surface text-pl-text border-t border-pl-line">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.h2 {...fadeUp()} className="text-3xl font-heading font-bold mb-4">
            {t('cta.owner_title')}
          </motion.h2>
          <motion.p {...fadeUp(0.1)} className="text-pl-muted mb-8">
            {t('cta.owner_desc')}
          </motion.p>
          <motion.div {...fadeUp(0.2)}>
            <Link to="/properties">
              <PrimaryButton className="h-13 px-10 text-base">
                {t('common.browse_properties')}
              </PrimaryButton>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
