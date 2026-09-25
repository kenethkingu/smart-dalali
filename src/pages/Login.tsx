import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { Logo } from '@/components/shared/Logo'
import { LoginForm } from '@/components/auth/LoginForm'
import { useTheme } from '@/lib/theme'

export function Login() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const redirectTo = params.get('redirectTo') || '/'
  const contextProperty = params.get('propertyTitle')

  const logoTone = theme === 'dark' ? 'light' : 'dark'

  return (
    <div className="min-h-[calc(100vh-64px)] bg-pl-bg text-pl-text flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/">
            <Logo size={40} tone={logoTone} />
          </Link>
        </div>

        <LoginForm 
          contextProperty={contextProperty || undefined} 
          onSuccess={(dest) => {
            if (dest) {
              navigate(dest)
            } else {
              navigate(redirectTo)
            }
          }}
        />
      </div>
    </div>
  )
}
