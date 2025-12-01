'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw, Settings, Key } from 'lucide-react';

export function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorConfig: Record<string, { 
    title: string; 
    message: string; 
    icon: React.ReactNode;
    hint?: string;
  }> = {
    Configuration: {
      title: 'Configuration Error',
      message: 'The authentication provider is not configured correctly.',
      icon: <Settings className="w-12 h-12 text-yellow-500" />,
      hint: 'Make sure GITHUB_ID and GITHUB_SECRET are set in environment variables.',
    },
    AccessDenied: {
      title: 'Access Denied',
      message: 'You do not have permission to sign in.',
      icon: <Key className="w-12 h-12 text-red-500" />,
      hint: 'Your account is not in the allowed users list.',
    },
    Verification: {
      title: 'Verification Failed',
      message: 'The verification link has expired or has already been used.',
      icon: <AlertTriangle className="w-12 h-12 text-orange-500" />,
    },
    OAuthCallback: {
      title: 'OAuth Error',
      message: 'There was a problem with the OAuth callback.',
      icon: <AlertTriangle className="w-12 h-12 text-red-500" />,
      hint: 'Check that your callback URL is configured correctly in GitHub.',
    },
    OAuthSignin: {
      title: 'OAuth Sign In Error',
      message: 'Could not initiate the sign in process.',
      icon: <AlertTriangle className="w-12 h-12 text-red-500" />,
      hint: 'GITHUB_ID or GITHUB_SECRET may be missing or invalid.',
    },
    Default: {
      title: 'Authentication Error',
      message: 'An unexpected error occurred during authentication.',
      icon: <AlertTriangle className="w-12 h-12 text-red-500" />,
    },
  };

  const config = errorConfig[error || ''] || errorConfig.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-lg w-full space-y-6">
        {/* Error Card */}
        <div className="bg-card border border-border rounded-xl p-8 space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            {config.icon}
            <h1 className="text-2xl font-bold text-foreground">{config.title}</h1>
            <p className="text-muted-foreground">{config.message}</p>
          </div>

          {/* Error Code */}
          {error && (
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Error Code</p>
              <code className="text-sm font-mono text-foreground">{error}</code>
            </div>
          )}

          {/* Hint */}
          {config.hint && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                💡 <strong>Hint:</strong> {config.hint}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <Link 
              href="/auth/signin"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-border rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Link>
            <Link 
              href="/"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-border rounded-lg bg-card hover:bg-accent transition-colors"
            >
              <Home className="w-4 h-4" />
              Go to Home
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-xs text-muted-foreground">
          If this problem persists, please contact the administrator.
        </p>
      </div>
    </div>
  );
}
