import { Link, useLocation } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Sun, Moon, ChevronDown, Menu, X } from 'lucide-react'
import { Logo } from '../shared/Logo'
import { PrimaryButton, GhostButton } from '../shared/Bits'
import { HoverText } from '../shared/HoverText'
import { useAuth } from '@/lib/auth'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils'

// ── Language Selector ─────────────────────────────────────────────────────────

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'sw', label: 'Kiswahili' },
] as const

function LanguageSelector() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Bug fix 2: use resolvedLanguage, not language.
  // i18n.language can be 'sw-TZ' or 'en-US' from the navigator, which won't
  // strictly equal 'sw' or 'en' and makes the active-state check silently fail.
  const current = i18n.resolvedLanguage ?? i18n.language

  const handleChange = async (code: string) => {
    await i18n.changeLanguage(code)
    setOpen(false)
  }

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Keyboard: close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative">
      {/* Bug fix 3: explicit type="button" prevents accidental form submission */}
      <button
        type="button"
        id="lang-selector-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="lang-selector-listbox"
        aria-label={`Current language: ${current === 'sw' ? 'Kiswahili' : 'English'}. Click to change.`}
        onClick={() => setOpen(o => !o)}
        className={cn(
          'flex items-center gap-1 px-2.5 py-1.5 rounded-lg',
          'text-xs font-bold uppercase tracking-wider',
          'text-pl-muted hover:text-pl-ink dark:hover:text-pl-white',
          'hover:bg-pl-surface dark:hover:bg-pl-surface',
          'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pl-accent',
        )}
      >
        {current === 'sw' ? 'SW' : 'EN'}
        <ChevronDown
          className={cn('w-3 h-3 transition-transform duration-150', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          id="lang-selector-listbox"
          role="listbox"
          aria-label="Select language"
          className={cn(
            'absolute right-0 top-full mt-1.5 z-[60]',
            'w-36 rounded-xl border border-pl-line',
            'bg-pl-bg dark:bg-pl-surface shadow-lg shadow-black/10',
            'py-1 overflow-hidden',
            'animate-in fade-in-0 zoom-in-95 duration-100',
          )}
        >
          {LANGUAGES.map(lang => {
            const isActive = current === lang.code
            return (
              <div key={lang.code} role="option" aria-selected={isActive}>
                {/* Bug fix 3: type="button", explicit aria-pressed */}
                <button
                  type="button"
                  aria-pressed={isActive}
                  disabled={isActive}
                  onClick={() => handleChange(lang.code)}
                  className={cn(
                    'w-full text-left px-4 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'text-pl-accent font-semibold cursor-default'
                      : 'text-pl-ink dark:text-pl-white/80 hover:bg-pl-surface dark:hover:bg-pl-line cursor-pointer',
                  )}
                >
                  {lang.label}
                  {isActive && <span className="sr-only"> (selected)</span>}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Dark Mode Toggle ──────────────────────────────────────────────────────────

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      id="theme-toggle"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      className={cn(
        'w-8 h-8 rounded-lg flex items-center justify-center',
        'text-pl-muted hover:text-pl-ink dark:hover:text-pl-white',
        'hover:bg-pl-surface dark:hover:bg-pl-surface',
        'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pl-accent',
      )}
    >
      {isDark
        ? <Sun  className="w-4 h-4" aria-hidden="true" />
        : <Moon className="w-4 h-4" aria-hidden="true" />
      }
    </button>
  )
}

// ── Navbar ────────────────────────────────────────────────────────────────────

export function Navbar() {
  const { user, logout } = useAuth()
  const { theme } = useTheme()
  const { t } = useTranslation()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Logo tone: white navbar → dark logo; dark navbar → light logo
  const logoTone = theme === 'dark' ? 'light' : 'dark'

  const navLinks = [
    { key: 'nav.home',         to: '/'              },
    { key: 'nav.about',        to: '/about'         },
    { key: 'nav.properties',   to: '/properties'    },
    { key: 'nav.how_it_works', to: '/#how-it-works' },
    { key: 'nav.contact',      to: '/contact'       },
  ] as const

  return (
    <header className="sticky top-0 z-50 w-full border-b border-pl-line bg-pl-bg/80 dark:bg-pl-ink/90 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* Left: Logo + desktop nav */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2" aria-label="Proland — go to homepage">
            <Logo size={24} tone={logoTone} />
          </Link>
          <nav
            className="hidden md:flex items-center gap-6 text-sm font-medium"
            aria-label="Main navigation"
          >
            {navLinks.map(link => {
              const base = link.to.split('#')[0]
              const isActive = link.to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(base) && link.to !== '/#how-it-works'
              return (
                <Link
                  key={link.key}
                  to={link.to}
                  className={cn(
                    'transition-colors',
                    isActive
                      ? 'text-pl-ink dark:text-pl-white font-semibold'
                      : 'text-pl-ink/70 dark:text-pl-white/60 hover:text-pl-ink dark:hover:text-pl-white',
                  )}
                >
                  <HoverText text={t(link.key)} />
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Right: language + theme + auth */}
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <ThemeToggle />

          {/* Auth — desktop */}
          <div className="hidden md:flex items-center gap-3 ml-1">
            {!user ? (
              <>
                <Link to="/login?role=owner">
                  <GhostButton className="rounded-full">{t('nav.list_property')}</GhostButton>
                </Link>
                <Link to="/login">
                  <PrimaryButton className="rounded-full">{t('nav.login')}</PrimaryButton>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={`/${user.role}/dashboard`}
                  className="text-sm font-semibold text-pl-ink dark:text-pl-white hover:underline"
                >
                  {t('nav.dashboard')}
                </Link>
                <GhostButton onClick={logout} className="rounded-full px-4 py-1.5 h-auto text-xs">
                  {t('nav.logout')}
                </GhostButton>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            id="mobile-menu-toggle"
            className="md:hidden ml-1 p-2 rounded-lg text-pl-ink dark:text-pl-white hover:bg-pl-surface dark:hover:bg-pl-surface transition-colors"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div id="mobile-nav" className="md:hidden border-t border-pl-line bg-pl-bg dark:bg-pl-ink px-4 py-4 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.key}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-medium text-pl-ink dark:text-pl-white/80 hover:text-pl-accent transition-colors"
            >
              {t(link.key)}
            </Link>
          ))}
          <div className="pt-3 border-t border-pl-line mt-2 space-y-2">
            {!user ? (
              <>
                <Link to="/login?role=owner" onClick={() => setMobileOpen(false)}>
                  <GhostButton className="w-full">{t('nav.list_property')}</GhostButton>
                </Link>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <PrimaryButton className="w-full">{t('nav.login')}</PrimaryButton>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={`/${user.role}/dashboard`}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-sm font-semibold text-pl-ink dark:text-pl-white hover:underline"
                >
                  {t('nav.dashboard')}
                </Link>
                <GhostButton onClick={() => { logout(); setMobileOpen(false) }} className="w-full">
                  {t('nav.logout')}
                </GhostButton>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
