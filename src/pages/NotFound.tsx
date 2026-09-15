import { Link } from 'react-router-dom'
import { PrimaryButton } from '@/components/shared/Bits'

export function NotFound() {
  return (
    <div className="bg-pl-surface min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center bg-white rounded-2xl border border-pl-line p-10 shadow-sm">
        <h1 className="text-3xl font-heading font-bold text-pl-ink mb-4">Page Not Found</h1>
        <p className="text-pl-muted mb-8 text-lg">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <Link to="/">
          <PrimaryButton className="w-full h-12 text-base">
            Back to Home
          </PrimaryButton>
        </Link>
      </div>
    </div>
  )
}
