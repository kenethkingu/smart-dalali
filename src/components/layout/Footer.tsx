import { Link } from 'react-router-dom'
import { Logo } from '@/components/shared/Logo'
import { Globe, AtSign, Share2, Briefcase } from 'lucide-react'

const columns = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'How It Works', to: '/#how-it-works' },
    ],
  },
  {
    title: 'For Buyers',
    links: [
      { label: 'Browse Properties', to: '/properties' },
      { label: 'How Booking Works', to: '/#how-it-works' },
      { label: 'My Requests', to: '/buyer/dashboard' },
    ],
  },
  {
    title: 'For Owners',
    links: [
      { label: 'List Your Property', to: '/login' },
      { label: 'Owner Dashboard', to: '/owner/dashboard' },
      { label: 'Pricing Plans', to: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', to: '#', soon: true },
      { label: 'Privacy Policy', to: '#', soon: true },
    ],
  },
]

const socials = [
  { icon: Globe, href: '#', label: 'Website' },
  { icon: AtSign, href: '#', label: 'Twitter / X' },
  { icon: Share2, href: '#', label: 'Facebook' },
  { icon: Briefcase, href: '#', label: 'LinkedIn' },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-pl-ink text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Logo size={36} tone="light" />
            <p className="text-white/60 text-sm mt-4 leading-relaxed max-w-[180px]">
              Every property verified. Every visit booked. Every payment secure.
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
                      {link.label}
                      {(link as any).soon && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/40 uppercase tracking-wide">
                          Soon
                        </span>
                      )}
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
            © {year} Proland. All rights reserved.
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
