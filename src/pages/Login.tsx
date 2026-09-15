import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, User, ChevronRight } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { PrimaryButton } from '@/components/shared/Bits'
import { Logo } from '@/components/shared/Logo'
import { demoUsers } from '@/data/mockData'
import type { UserRole } from '@/types'

type Tab = 'login' | 'signup'

const demoConfig = [
  { key: 'buyer' as const, label: 'Continue as Buyer', dest: '/buyer/dashboard' },
  { key: 'owner' as const, label: 'Continue as Property Owner', dest: '/owner/dashboard' },
]

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const redirectTo = params.get('redirectTo') || '/'
  const contextProperty = params.get('propertyTitle')

  const [tab, setTab] = useState<Tab>('login')
  // Pre-fill phone with demo buyer number so the "normal" path also lands on populated data
  const [phone, setPhone] = useState('+255712000111')
  const [name, setName] = useState('')
  const [role, setRole] = useState<'buyer' | 'owner'>('buyer')

  const handleDemoLogin = (demoKey: keyof typeof demoUsers, dest: string) => {
    login(demoUsers[demoKey])
    navigate(dest, { replace: true })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // No real OTP backend yet — any submission logs in immediately.
    // The pre-filled phone maps to demoUsers.buyer by convention.
    const userName = tab === 'login' ? 'Amina Hassan' : name
    const userRole: UserRole = tab === 'login' ? 'buyer' : role
    const userId = tab === 'login' ? 'buyer1' : crypto.randomUUID()
    login({ id: userId, name: userName, phone, role: userRole })
    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-pl-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size={40} tone="dark" />
        </div>

        {/* Context hint */}
        {contextProperty && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 mb-6 text-center">
            Log in to request a site visit for <strong>{contextProperty}</strong>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-pl-line overflow-hidden">

          {/* TODO: remove this demo-login panel once real phone/OTP auth is wired
              to an actual backend. Until then, this *is* the login system — it's
              not a dev-only shortcut sitting behind a flag, because there's nothing
              real yet for it to be a shortcut around. */}
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
                >
                  <div className="text-sm font-semibold text-pl-ink group-hover:text-pl-accent transition-colors">
                    {label}
                  </div>
                  <ChevronRight className="w-4 h-4 text-pl-muted group-hover:text-pl-accent shrink-0 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 px-6 py-4">
            <div className="flex-1 h-px bg-pl-line" />
            <span className="text-xs font-semibold text-pl-muted whitespace-nowrap">or sign in with your account</span>
            <div className="flex-1 h-px bg-pl-line" />
          </div>

          {/* Tabs */}
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

          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.form
                key={tab}
                initial={{ opacity: 0, x: tab === 'login' ? -12 : 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {tab === 'signup' && (
                  <div>
                    <label className="block text-sm font-semibold text-pl-ink mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pl-muted" />
                      <input
                        required
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Amina Juma"
                        className="w-full border border-pl-line rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-pl-accent"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-pl-ink mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pl-muted" />
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full border border-pl-line rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-pl-accent"
                    />
                  </div>
                  <p className="text-xs text-pl-muted mt-1.5">You will receive an SMS with a one-time code.</p>
                </div>

                {tab === 'signup' && (
                  <div>
                    <label className="block text-sm font-semibold text-pl-ink mb-3">I am signing up as a…</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['buyer', 'owner'] as const).map(r => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRole(r)}
                          className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                            role === r
                              ? 'border-pl-ink bg-pl-ink text-white'
                              : 'border-pl-line text-pl-muted hover:border-pl-ink/40'
                          }`}
                        >
                          {r === 'buyer' ? '🏠 Buyer' : '🔑 Owner'}
                          <div className="text-xs font-normal mt-0.5 opacity-70">
                            {r === 'buyer' ? 'Browse & book visits' : 'List properties'}
                          </div>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-pl-muted mt-2">
                      Admin accounts are provisioned by Proland staff — not available here.
                    </p>
                  </div>
                )}

                <PrimaryButton type="submit" className="w-full h-11 text-sm mt-1">
                  {tab === 'login' ? 'Log In' : 'Create Account'} <ChevronRight className="w-4 h-4" />
                </PrimaryButton>

                {tab === 'login' && (
                  <p className="text-center text-sm text-pl-muted">
                    Don't have an account?{' '}
                    <button type="button" onClick={() => setTab('signup')} className="font-bold text-pl-ink underline underline-offset-2">
                      Sign Up
                    </button>
                  </p>
                )}
              </motion.form>
            </AnimatePresence>
          </div>
        </div>

        <p className="text-center text-xs text-pl-muted mt-6">
          By continuing, you agree to Proland's{' '}
          <Link to="#" className="underline">Terms</Link> and{' '}
          <Link to="#" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}
