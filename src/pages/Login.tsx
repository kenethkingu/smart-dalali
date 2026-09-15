import { useSearchParams, Link } from 'react-router-dom'
import { Logo } from '@/components/shared/Logo'
import { LoginForm } from '@/components/auth/LoginForm'

export function Login() {
  const [params] = useSearchParams()
  const redirectTo = params.get('redirectTo') || '/'
  const contextProperty = params.get('propertyTitle')

  return (
    <div className="min-h-[calc(100vh-64px)] bg-pl-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/">
            <Logo size={40} tone="dark" />
          </Link>
        </div>

        <LoginForm 
          contextProperty={contextProperty || undefined} 
          onSuccess={(dest) => {
            if (dest) {
              window.location.href = dest
            } else {
              window.location.href = redirectTo
            }
          }}
        />
      </div>
    </div>
  )
}
