import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, User, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/auth'
import { PrimaryButton } from '@/components/shared/Bits'
import { demoUsers } from '@/data/mockData'
import type { UserRole } from '@/types'

type Tab = 'login' | 'signup'

interface LoginFormProps {
  onSuccess?: (dest?: string) => void
  contextProperty?: string
}

export function LoginForm({ onSuccess, contextProperty }: LoginFormProps) {
  const { login } = useAuth()
  const { t } = useTranslation()

  const [tab, setTab] = useState<Tab>('login')
  const [phone, setPhone] = useState('+255712000111')
  const [name, setName] = useState('')
  const [role, setRole] = useState<UserRole>('buyer')

  const [isSubmitting, setIsSubmitting] = useState(false)

  const demoConfig = [
    { key: 'buyer' as const, label: t('login.demo_buyer'), dest: '/buyer/dashboard' },
    { key: 'owner' as const, label: t('login.demo_owner'), dest: '/owner/dashboard' },
    { key: 'agent' as const, label: t('login.demo_agent'), dest: '/agent/dashboard' },
    { key: 'admin' as const, label: t('login.demo_admin'), dest: '/admin/dashboard' },
  ]

  const handleDemoLogin = async (demoKey: keyof typeof demoUsers, dest: string) => {
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 600))
    login(demoUsers[demoKey])
    onSuccess?.(dest)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 600))
    
    const userName = tab === 'login' ? 'Amina Hassan' : name
    const userRole: UserRole = tab === 'login' ? 'buyer' : role
    const userId = tab === 'login' ? 'buyer1' : crypto.randomUUID()
    login({ id: userId, name: userName, phone, role: userRole })
    onSuccess?.(userRole === 'admin' ? '/admin/dashboard' : userRole === 'agent' ? '/agent/dashboard' : userRole === 'owner' ? '/owner/dashboard' : '/')
  }

  return (
    <div className="w-full text-pl-text">
      {contextProperty && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 text-sm text-amber-600 dark:text-amber-400 mb-6 text-center">
          {t('login.subtitle')} (<strong>{contextProperty}</strong>)
        </div>
      )}

      <div className="bg-pl-surface rounded-2xl shadow-lg border border-pl-line overflow-hidden">
        <div className="p-6 border-b border-pl-line bg-pl-bg/50">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-pl-text">{t('login.demo_heading')}</span>
          </div>
          <p className="text-xs text-pl-muted mb-4">{t('login.subtitle')}</p>
          <div className="grid grid-cols-2 gap-2">
            {demoConfig.map(({ key, label, dest }) => (
              <button
                key={key}
                onClick={() => handleDemoLogin(key, dest)}
                className="w-full text-left flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-pl-line bg-pl-surface hover:border-pl-accent hover:bg-pl-bg transition-colors group"
                disabled={isSubmitting}
              >
                <div className="text-xs font-semibold text-pl-text group-hover:text-pl-accent transition-colors truncate">
                  {label}
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-pl-muted group-hover:text-pl-accent shrink-0 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 px-6 py-4">
          <div className="flex-1 h-px bg-pl-line" />
          <span className="text-xs font-semibold text-pl-muted whitespace-nowrap">{t('login.divider_text')}</span>
          <div className="flex-1 h-px bg-pl-line" />
        </div>

        <div className="flex border-b border-pl-line">
          {(['login', 'signup'] as Tab[]).map(tTab => (
            <button
              key={tTab}
              onClick={() => setTab(tTab)}
              className={`flex-1 py-3 text-sm font-bold transition-colors ${
                tab === tTab
                  ? 'text-pl-text border-b-2 border-pl-accent -mb-px'
                  : 'text-pl-muted hover:text-pl-text'
              }`}
            >
              {tTab === 'login' ? t('nav.login') : t('login.sign_in_button')}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 pb-8 space-y-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {tab === 'signup' && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-pl-muted uppercase tracking-wider mb-2">{t('contact.full_name')}</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pl-muted" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-pl-bg border border-pl-line rounded-xl outline-none focus:border-pl-accent transition-all text-sm font-medium text-pl-text placeholder:text-pl-muted"
                      placeholder="Amina Hassan"
                      required={tab === 'signup'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-pl-muted uppercase tracking-wider mb-2">{t('common.status')}</label>
                  <div className="grid grid-cols-3 bg-pl-bg p-1 rounded-xl gap-1 border border-pl-line">
                    <button
                      type="button"
                      onClick={() => setRole('buyer')}
                      className={`py-2 px-2 text-xs font-bold rounded-lg transition-colors text-center ${role === 'buyer' ? 'bg-pl-surface shadow-sm text-pl-text border border-pl-line' : 'text-pl-muted hover:text-pl-text'}`}
                    >
                      {t('nav.role_buyer')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('owner')}
                      className={`py-2 px-2 text-xs font-bold rounded-lg transition-colors text-center ${role === 'owner' ? 'bg-pl-surface shadow-sm text-pl-text border border-pl-line' : 'text-pl-muted hover:text-pl-text'}`}
                    >
                      {t('nav.role_owner')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('agent')}
                      className={`py-2 px-2 text-xs font-bold rounded-lg transition-colors text-center ${role === 'agent' ? 'bg-pl-surface shadow-sm text-pl-text border border-pl-line' : 'text-pl-muted hover:text-pl-text'}`}
                    >
                      {t('nav.role_agent')}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-xs font-bold text-pl-muted uppercase tracking-wider mb-2">{t('login.email_label')}</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pl-muted" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-pl-bg border border-pl-line rounded-xl outline-none focus:border-pl-accent transition-all text-sm font-medium text-pl-text placeholder:text-pl-muted"
                placeholder={t('login.email_placeholder')}
                required
              />
            </div>
          </div>

          <PrimaryButton
            type="submit"
            className="w-full h-12 text-sm mt-2"
            isLoading={isSubmitting}
          >
            {tab === 'login' ? t('login.sign_in_button') : t('nav.login')}
          </PrimaryButton>
        </form>
      </div>
    </div>
  )
}
