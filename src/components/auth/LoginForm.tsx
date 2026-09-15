import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, User, ChevronRight } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { PrimaryButton } from '@/components/shared/Bits'
import { demoUsers } from '@/data/mockData'
import type { UserRole } from '@/types'

type Tab = 'login' | 'signup'

const demoConfig = [
  { key: 'buyer' as const, label: 'Continue as Buyer', dest: '/buyer/dashboard' },
  { key: 'owner' as const, label: 'Continue as Property Owner', dest: '/owner/dashboard' },
]

interface LoginFormProps {
  onSuccess?: (dest?: string) => void
  contextProperty?: string
}

export function LoginForm({ onSuccess, contextProperty }: LoginFormProps) {
  const { login } = useAuth()

  const [tab, setTab] = useState<Tab>('login')
  const [phone, setPhone] = useState('+255712000111')
  const [name, setName] = useState('')
  const [role, setRole] = useState<'buyer' | 'owner'>('buyer')

  const [isSubmitting, setIsSubmitting] = useState(false)

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
    onSuccess?.('/')
  }

  return (
    <div className="w-full">
      {contextProperty && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 mb-6 text-center">
          Log in to request a site visit for <strong>{contextProperty}</strong>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-pl-line overflow-hidden">
        <div className="p-6 border-b border-pl-line bg-pl-surface/60">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-pl-ink">Try Proland</span>
          </div>
          <p className="text-xs text-pl-muted mb-4">See what it's like as a buyer or property owner.</p>
          <div className="space-y-2">
            {demoConfig.map(({ key, label, dest }) => (
              <button
                key={key}
                onClick={() => handleDemoLogin(key, dest)}
                className="w-full text-left flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-pl-line bg-white hover:border-pl-ink/30 hover:bg-pl-surface transition-colors group"
                disabled={isSubmitting}
              >
                <div className="text-sm font-semibold text-pl-ink group-hover:text-pl-accent transition-colors">
                  {label}
                </div>
                <ChevronRight className="w-4 h-4 text-pl-muted group-hover:text-pl-accent shrink-0 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 px-6 py-4">
          <div className="flex-1 h-px bg-pl-line" />
          <span className="text-xs font-semibold text-pl-muted whitespace-nowrap">or log in with your account</span>
          <div className="flex-1 h-px bg-pl-line" />
        </div>

        <div className="flex border-b border-pl-line">
          {(['login', 'signup'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-bold transition-colors ${
                tab === t
                  ? 'text-pl-ink border-b-2 border-pl-ink -mb-px'
                  : 'text-pl-muted hover:text-pl-ink'
              }`}
            >
              {t === 'login' ? 'Log In' : 'Create Account'}
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
                  <label className="block text-xs font-bold text-pl-muted uppercase tracking-wider mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pl-muted" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-pl-surface border border-pl-line rounded-xl outline-none focus:border-pl-accent focus:bg-white transition-all text-sm font-medium"
                      placeholder="Jane Doe"
                      required={tab === 'signup'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-pl-muted uppercase tracking-wider mb-2">I want to</label>
                  <div className="flex bg-pl-surface p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setRole('buyer')}
                      className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-colors ${role === 'buyer' ? 'bg-white shadow-sm text-pl-ink' : 'text-pl-muted hover:text-pl-ink'}`}
                    >
                      Buy / Rent
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('owner')}
                      className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-colors ${role === 'owner' ? 'bg-white shadow-sm text-pl-ink' : 'text-pl-muted hover:text-pl-ink'}`}
                    >
                      List a Property
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-xs font-bold text-pl-muted uppercase tracking-wider mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pl-muted" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-pl-surface border border-pl-line rounded-xl outline-none focus:border-pl-accent focus:bg-white transition-all text-sm font-medium"
                placeholder="+255 700 000 000"
                required
              />
            </div>
            {tab === 'login' && (
              <p className="text-[11px] text-pl-muted mt-2">
                We'll text you a one-time code to confirm your number.
              </p>
            )}
          </div>

          <PrimaryButton
            type="submit"
            className="w-full h-12 text-sm mt-2"
            isLoading={isSubmitting}
          >
            {tab === 'login' ? 'Send OTP Code' : 'Create Account'}
          </PrimaryButton>
        </form>
      </div>
    </div>
  )
}
