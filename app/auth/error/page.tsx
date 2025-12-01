'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, string> = {
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'You do not have permission to sign in.',
    Verification: 'The verification link has expired or has already been used.',
    Default: 'An error occurred during authentication.',
  };

  const message = errorMessages[error || ''] || errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8 text-center">
        <div className="text-6xl">🔒</div>
        <h1 className="text-2xl font-bold text-foreground">Authentication Error</h1>
        <p className="text-muted-foreground">{message}</p>
        
        <div className="space-y-4">
          <Link 
            href="/auth/signin"
            className="block w-full px-4 py-3 border border-border rounded-lg bg-card hover:bg-accent transition-colors"
          >
            Try Again
          </Link>
          <Link 
            href="/"
            className="block text-sm text-muted-foreground hover:text-foreground"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
