import { motion } from 'framer-motion'
import { Check, Info } from 'lucide-react'
import { PrimaryButton } from '@/components/shared/Bits'
import { Link } from 'react-router-dom'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
})

const plans = [
  {
    name: 'Standard Listing',
    price: 'Free',
    description: 'Perfect for single property owners looking to reach verified buyers.',
    features: [
      'List up to 3 properties',
      'Basic photo gallery (up to 5 images)',
      'Direct WhatsApp inquiries',
      'Appear in standard search results',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Premium Listing',
    price: 'TSh 50,000',
    interval: '/ month',
    description: 'Maximize visibility and rent or sell your property faster.',
    features: [
      'List up to 10 properties',
      'Unlimited high-res photos',
      'Featured placement on homepage',
      'Priority in search results',
      'Analytics dashboard (views & clicks)',
    ],
    cta: 'Go Premium',
    popular: true,
  }
]

export function Pricing() {
  return (
    <div className="bg-pl-surface min-h-screen pb-24">
      {/* Hero */}
      <section className="grain-texture bg-pl-ink text-white py-24 px-4 text-center">
        <div className="container mx-auto max-w-2xl">
          <motion.h1 {...fadeUp()} className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p {...fadeUp(0.1)} className="text-lg text-white/70">
            No hidden fees. No commissions on your sales or rentals. 
            Choose the plan that fits your needs.
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
              className={`bg-white rounded-3xl p-8 border ${plan.popular ? 'border-pl-accent shadow-xl relative' : 'border-pl-line shadow-sm'}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-pl-accent text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-pl-ink mb-2">{plan.name}</h3>
              <p className="text-sm text-pl-muted mb-6 h-10">{plan.description}</p>
              <div className="mb-8">
                <span className="text-4xl font-bold text-pl-ink">{plan.price}</span>
                {plan.interval && <span className="text-pl-muted ml-1">{plan.interval}</span>}
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-pl-ink">
                    <Check className="w-5 h-5 text-pl-accent shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/login" className="block">
                <PrimaryButton className={`w-full h-12 ${plan.popular ? '' : 'bg-pl-surface text-pl-ink hover:bg-pl-line'}`}>
                  {plan.cta}
                </PrimaryButton>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ / Info */}
      <section className="container mx-auto px-4 mt-24">
        <motion.div {...fadeUp(0.4)} className="max-w-3xl mx-auto bg-white rounded-2xl border border-pl-line p-8 flex gap-6 items-start">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
            <Info className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h4 className="font-bold text-pl-ink mb-2">Are you a buyer or renter?</h4>
            <p className="text-pl-muted text-sm leading-relaxed">
              Proland is completely free for buyers and renters. You can browse properties, request site visits, and contact verified owners directly via WhatsApp without paying any subscription fees or commissions.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
