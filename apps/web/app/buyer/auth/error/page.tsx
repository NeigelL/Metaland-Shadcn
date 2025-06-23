// app/auth/error/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const messages: Record<string, string> = {
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'You denied the request to sign in.',
    Verification: 'The sign in link is no longer valid.',
    OAuthCallback: 'There was an issue with the sign-in process. Please try again.',
    default: 'Something went wrong during authentication.',
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
        <p className="mt-4 text-gray-700">
          {messages[error ?? 'default'] ?? messages.default}
        </p>
        <a href="/" className="mt-6 inline-block text-blue-600 underline">
          Go back to home
        </a>
      </div>
    </div>
  )
}
