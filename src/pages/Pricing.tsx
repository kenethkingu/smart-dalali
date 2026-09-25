import { motion } from 'framer-motion'
import { Check, Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PrimaryButton } from '@/components/shared/Bits'
import { Link } from 'react-router-dom'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
})

export function Pricing() {
  const { t } = useTranslation()

  const plans = [
    {
      name: t('pricing.basic_plan'),
      price: t('pricing.free'),
      description: t('pricing.subtitle'),
      features: [
        t('hero.trust_text'),
        t('trust.verified_desc'),
        t('trust.contact_desc'),
        t('trust.visit_desc'),
      ],
      cta: t('pricing.get_started'),
      popular: false,
    },
    {
      name: t('pricing.pro_plan'),
      price: 'TSh 50,000',
      interval: t('pricing.per_month'),
      description: t('about.subtitle'),
      features: [
        t('hero.trust_text'),
        t('trust.verified_desc'),
        t('trust.contact_desc'),
        t('trust.visit_desc'),
        t('home.featured_desc'),
      ],
      cta: t('pricing.contact_sales'),
      popular: true,
    }
  ]

  return (
    <div className="bg-pl-bg text-pl-text min-h-screen pb-24">
      {/* Hero */}
      <section className="grain-texture bg-pl-ink text-white py-24 px-4 text-center">
        <div className="container mx-auto max-w-2xl">
          <motion.h1 {...fadeUp()} className="text-4xl md:text-5xl font-heading font-bold mb-6">
            {t('pricing.title')}
          </motion.h1>
          <motion.p {...fadeUp(0.1)} className="text-lg text-white/80">
            {t('pricing.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 -mt-12 relative z-10">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {plans.map((plan, i) => (
            <motion.div 
              key={plan.name}
              {...fadeUp(0.2 + i * 0.1)}
              className={`bg-pl-surface rounded-3xl p-8 border text-pl-text ${plan.popular ? 'border-pl-accent shadow-xl relative' : 'border-pl-line shadow-sm'}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-pl-accent text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full">
                  {t('status.verified')}
                </div>
              )}
              <h3 className="text-xl font-bold text-pl-text mb-2">{plan.name}</h3>
              <p className="text-sm text-pl-muted mb-6 h-10">{plan.description}</p>
              <div className="mb-8">
                <span className="text-4xl font-bold text-pl-text">{plan.price}</span>
                {plan.interval && <span className="text-pl-muted ml-1">{plan.interval}</span>}
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-pl-text">
                    <Check className="w-5 h-5 text-pl-accent shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/login" className="block">
                <PrimaryButton className={`w-full h-12 ${plan.popular ? '' : 'bg-pl-bg text-pl-text hover:bg-pl-line border border-pl-line'}`}>
                  {plan.cta}
                </PrimaryButton>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ / Info */}
      <section className="container mx-auto px-4 mt-24">
        <motion.div {...fadeUp(0.4)} className="max-w-3xl mx-auto bg-pl-surface rounded-2xl border border-pl-line p-8 flex gap-6 items-start text-pl-text">
          <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center shrink-0">
            <Info className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h4 className="font-bold text-pl-text mb-2">{t('cta.owner_label')}</h4>
            <p className="text-pl-muted text-sm leading-relaxed">
              {t('cta.owner_desc')}
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
