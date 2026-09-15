import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Mail, MapPin, CheckCircle } from 'lucide-react'
import { PrimaryButton } from '@/components/shared/Bits'

export function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', contact: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock submit — no backend yet
    setSubmitted(true)
  }

  return (
    <div className="bg-pl-surface min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-heading font-bold text-pl-ink mb-3">Get in Touch</h1>
          <p className="text-pl-muted text-lg">Have a question? We usually respond within a few hours.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-pl-line">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-pl-accent" />
                    </div>
                    <h2 className="text-2xl font-bold text-pl-ink mb-3">Message Sent!</h2>
                    <p className="text-pl-muted">
                      Thanks, {form.name || 'there'}. We'll get back to you at {form.contact || 'the contact you provided'} within a few hours.
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: '', contact: '', message: '' }) }}
                      className="mt-6 text-sm font-semibold text-pl-accent hover:text-pl-accent-dark underline underline-offset-2"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-semibold text-pl-ink mb-2">Your Name</label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Amina Juma"
                        className="w-full border border-pl-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pl-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-pl-ink mb-2">Phone or Email</label>
                      <input
                        required
                        type="text"
                        value={form.contact}
                        onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
                        placeholder="+255 7XX XXX XXX or you@example.com"
                        className="w-full border border-pl-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pl-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-pl-ink mb-2">Message</label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        placeholder="Tell us how we can help..."
                        className="w-full border border-pl-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pl-accent transition-colors resize-none"
                      />
                    </div>
                    <PrimaryButton type="submit" className="w-full h-12 text-base">
                      Send Message
                    </PrimaryButton>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-pl-line">
              <h3 className="font-bold text-pl-ink mb-4">Contact Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-pl-accent shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-pl-ink">Phone</div>
                    <a href="tel:+255700000000" className="text-sm text-pl-muted hover:text-pl-accent">+255 700 000 000</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-pl-accent shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-pl-ink">Email</div>
                    <a href="mailto:hello@proland.tz" className="text-sm text-pl-muted hover:text-pl-accent">hello@proland.tz</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-pl-accent shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-pl-ink">Office</div>
                    <p className="text-sm text-pl-muted">Msasani, Dar es Salaam, Tanzania</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-pl-ink text-white p-6 rounded-2xl">
              <h3 className="font-bold mb-2">Quick Response via WhatsApp</h3>
              <p className="text-white/70 text-sm mb-4">
                Prefer WhatsApp? Use the floating button in the bottom right — we're available Monday–Saturday, 8am–7pm.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
