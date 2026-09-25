import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Mail, MapPin, CheckCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PrimaryButton } from '@/components/shared/Bits'

export function Contact() {
  const { t } = useTranslation()
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', contact: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="grain-texture bg-pl-bg text-pl-text min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-heading font-bold text-pl-text mb-3">{t('contact.title')}</h1>
          <p className="text-pl-muted text-lg">{t('contact.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-pl-surface p-8 rounded-2xl shadow-md border border-pl-line text-pl-text">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-pl-accent" />
                    </div>
                    <h2 className="text-2xl font-bold text-pl-text mb-3">{t('contact.success_msg')}</h2>
                    <p className="text-pl-muted">
                      Thanks, {form.name || 'there'}. We'll get back to you shortly.
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: '', contact: '', message: '' }) }}
                      className="mt-6 text-sm font-semibold text-pl-accent hover:underline"
                    >
                      {t('contact.form_title')}
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
                      <label className="block text-sm font-semibold text-pl-text mb-2">{t('contact.full_name')}</label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Amina Juma"
                        className="w-full bg-pl-bg border border-pl-line rounded-xl px-4 py-3 text-sm text-pl-text placeholder:text-pl-muted focus:outline-none focus:border-pl-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-pl-text mb-2">{t('contact.email_address')} / {t('contact.phone_number')}</label>
                      <input
                        required
                        type="text"
                        value={form.contact}
                        onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
                        placeholder="+255 7XX XXX XXX or info@proland.co.tz"
                        className="w-full bg-pl-bg border border-pl-line rounded-xl px-4 py-3 text-sm text-pl-text placeholder:text-pl-muted focus:outline-none focus:border-pl-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-pl-text mb-2">{t('contact.message')}</label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        placeholder={t('contact.subtitle')}
                        className="w-full bg-pl-bg border border-pl-line rounded-xl px-4 py-3 text-sm text-pl-text placeholder:text-pl-muted focus:outline-none focus:border-pl-accent transition-colors resize-none"
                      />
                    </div>
                    <PrimaryButton type="submit" className="w-full h-12 text-base">
                      {t('contact.send_button')}
                    </PrimaryButton>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-pl-surface p-6 rounded-2xl shadow-md border border-pl-line text-pl-text">
              <h3 className="font-bold text-pl-text mb-4">{t('footer.contact_us')}</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-pl-accent shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-pl-text">{t('contact.phone_number')}</div>
                    <a href="tel:+255700000000" className="text-sm text-pl-muted hover:text-pl-accent">+255 700 000 000</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-pl-accent shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-pl-text">{t('contact.email_address')}</div>
                    <a href="mailto:info@proland.co.tz" className="text-sm text-pl-muted hover:text-pl-accent">info@proland.co.tz</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-pl-accent shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-pl-text">{t('contact.office_location')}</div>
                    <p className="text-sm text-pl-muted">{t('footer.address')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
