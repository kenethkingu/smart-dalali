import { Navigate } from 'react-router-dom'

// The "How It Works" content lives on the Homepage at the #how-it-works section.
// This route redirects there instead of maintaining a second near-duplicate page.
export function HowItWorks() {
  return <Navigate to="/#how-it-works" replace />
}
