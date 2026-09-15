import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, Calendar, Phone } from 'lucide-react'
import { PrimaryButton } from '@/components/shared/Bits'
import { Logo } from '@/components/shared/Logo'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
})

const stats = [
  { label: 'Properties Listed', value: '1,200+' },
  { label: 'Cities Covered', value: '8' },
  { label: 'Verified Owners', value: '340+' },
  { label: 'Successful Visits', value: '950+' },
]

const whyUs = [
  {
    icon: ShieldCheck,
    title: 'Verified Listings',
    desc: 'Every property is reviewed and approved by our admin team before it goes public — no ghost listings, no scams.',
  },
  {
    icon: Calendar,
    title: 'Site Visit Before Payment',
    desc: "You book a site visit, inspect the property, and only pay once you're satisfied. We never ask you to pay sight unseen.",
  },
  {
    icon: Phone,
    title: 'Direct Owner Contact',
    desc: 'Chat directly with the verified property owner via WhatsApp — no middleman charging a commission on the conversation.',
  },
]

import { TracingBeam } from '@/components/ui/tracing-beam'

export function About() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-pl-ink text-white py-28 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div {...fadeUp()} className="mb-6 flex justify-center">
            <Logo size={48} tone="light" />
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="text-4xl md:text-6xl font-heading font-bold mb-6 leading-tight">
            Every property verified.
            <br />
            Every visit booked.
            <br />
            Every payment secure.
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-white/70 text-lg max-w-xl mx-auto">
            Proland is building the trust layer that Tanzanian real estate has always needed.
          </motion.p>
        </div>
      </section>

      <TracingBeam className="px-6">
        {/* Our Story */}
        <section className="py-20">
          <div className="container mx-auto max-w-3xl">
            <motion.h2 {...fadeUp()} className="text-3xl font-heading font-bold text-pl-ink mb-6">
              Our Story
            </motion.h2>
            <motion.div {...fadeUp(0.1)} className="space-y-4 text-pl-muted text-lg leading-relaxed">
              <p>
                Property searching in Tanzania has a trust problem. Buyers routinely encounter listings
                that don't exist at the posted price, agents who collect "viewing fees" and disappear,
                and owners who receive low-quality inquiries from people who never intended to pay.
                The complaints are consistent across every major platform — and they stem from the same
                root cause: <strong className="text-pl-ink">no one is verifying anything before it goes live.</strong>
              </p>
              <p>
                Proland was built to fix that. Before any listing appears on our platform, a member of
                our admin team reviews it — confirming the property exists, the price is real, and the
                owner is legitimate. It takes longer than a self-serve classifieds upload, and that's
                the point: every listing that clears our queue is one fewer scam for a buyer to navigate.
              </p>
              <p>
                We also built the booking side from scratch: request a site visit, see the property in
                person, then confirm payment. In that order. Never the other way around.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Why Proland */}
        <section className="py-20 rounded-3xl bg-pl-surface px-6 md:px-12 mx-auto max-w-5xl mb-20">
          <motion.h2 {...fadeUp()} className="text-3xl font-heading font-bold text-pl-ink mb-12 text-center">
            Why Choose Proland
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyUs.map((item, i) => (
              <motion.div key={item.title} {...fadeUp(i * 0.1)} className="card-hover bg-white p-8 rounded-lg border border-pl-line">
                <div className="w-12 h-12 rounded-xl bg-pl-ink flex items-center justify-center mb-6">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-pl-ink mb-3">{item.title}</h3>
                <p className="text-pl-muted leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Statistics */}
        <section className="py-20 mb-20">
          <div className="container mx-auto max-w-4xl">
            <motion.h2 {...fadeUp()} className="text-3xl font-heading font-bold text-pl-ink mb-12 text-center">
              Proland by the Numbers
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <motion.div key={s.label} {...fadeUp(i * 0.1)} className="text-center">
                  <div className="text-4xl font-heading font-bold text-pl-ink mb-2">{s.value}</div>
                  <div className="text-sm font-medium text-pl-muted">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </TracingBeam>

      {/* CTA */}
      <section className="py-20 px-4 bg-pl-ink text-white">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.h2 {...fadeUp()} className="text-3xl font-heading font-bold mb-4">
            Ready to find your next property?
          </motion.h2>
          <motion.p {...fadeUp(0.1)} className="text-white/70 mb-8">
            Browse hundreds of verified homes, plots, and offices across Tanzania.
          </motion.p>
          <motion.div {...fadeUp(0.2)}>
            <Link to="/properties">
              <PrimaryButton className="h-14 px-10 text-lg">
                Browse Properties
              </PrimaryButton>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
