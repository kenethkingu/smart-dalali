import { Link } from 'react-router-dom'
import { Logo } from '../shared/Logo'
import { PrimaryButton, GhostButton } from '../shared/Bits'
import { HoverText } from '../shared/HoverText'
import { useAuth } from '@/lib/auth'

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Logo & Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <Logo size={24} />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-pl-ink/80">
            <Link to="/" className="text-pl-ink/80 transition-colors"><HoverText text="Home" /></Link>
            <Link to="/about" className="text-pl-ink/80 transition-colors"><HoverText text="About Us" /></Link>
            <Link to="/properties" className="text-pl-ink/80 transition-colors"><HoverText text="Properties" /></Link>
            <Link to="/#how-it-works" className="text-pl-ink/80 transition-colors"><HoverText text="How It Works" /></Link>
            <Link to="/contact" className="text-pl-ink/80 transition-colors"><HoverText text="Contact" /></Link>
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link to="/login?role=owner">
                <GhostButton className="hidden md:inline-flex rounded-full">List Your Property</GhostButton>
              </Link>
              <Link to="/login">
                <PrimaryButton className="rounded-full">Log In / Sign Up</PrimaryButton>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to={`/${user.role}/dashboard`} className="text-sm font-semibold hover:underline">
                Dashboard
              </Link>
              <GhostButton onClick={logout} className="rounded-full px-4 py-1.5 h-auto text-xs">
                Log Out
              </GhostButton>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
