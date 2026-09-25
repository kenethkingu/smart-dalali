import { Link } from 'react-router-dom'
import { Logo } from '@/components/shared/Logo'
import { Globe, AtSign, Share2, Briefcase } from 'lucide-react'
import { HoverText } from '@/components/shared/HoverText'
import { useAuth } from '@/lib/auth'
import { useTranslation } from 'react-i18next'

const socials = [
  { icon: Globe, href: 'https://proland.co.tz', label: 'Website' },
  { icon: AtSign, href: 'https://twitter.com/proland', label: 'Twitter / X' },
  { icon: Share2, href: 'https://facebook.com/proland', label: 'Facebook' },
  { icon: Briefcase, href: 'https://linkedin.com/company/proland', label: 'LinkedIn' },
]

export function Footer() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  const columns = [
    {
      title: t('footer.quick_links'),
      links: [
        { label: t('nav.about'), to: '/about' },
        { label: t('nav.contact'), to: '/contact' },
        { label: t('nav.pricing'), to: '/pricing' },
      ],
    },
    {
      title: t('cta.owner_label'),
      links: [
        { label: t('nav.properties'), to: '/properties' },
        { label: t('nav.how_it_works'), to: '/#how-it-works' },
        ...(user?.role === 'buyer' ? [{ label: t('buyer_dashboard.title'), to: '/buyer/dashboard' }] : []),
      ],
    },
    {
      title: t('cta.owner_title'),
      links: [
        { label: t('nav.list_property'), to: '/login?role=owner' },
        ...(user?.role === 'owner' ? [{ label: t('owner_dashboard.title'), to: '/owner/dashboard' }] : []),
      ],
    },
    {
      title: t('footer.property_types'),
      links: [
        { label: t('hero.filter.houses'), to: '/properties?type=house' },
        { label: t('hero.filter.plots'), to: '/properties?type=plot' },
        { label: t('hero.filter.offices'), to: '/properties?type=office' },
        ...(user?.role === 'agent' ? [{ label: t('agent_dashboard.title'), to: '/agent/dashboard' }] : []),
      ],
    },
  ]

  return (
    <footer className="grain-texture bg-pl-ink text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Logo size={36} tone="light" />
            <p className="text-white/60 text-sm mt-4 leading-relaxed max-w-[220px]">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Link columns */}
          {columns.map(col => (
            <div key={col.title}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-1"
                    >
                      <HoverText text={link.label} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © {year} Proland. {t('footer.rights_reserved')}
          </p>
          <div className="flex items-center gap-4">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-colors"
              >
                <Icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
