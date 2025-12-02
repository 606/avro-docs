'use client';

import { signIn, getProviders } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Github, AlertTriangle, Settings, Lock, Mail } from 'lucide-react';

// Provider icons as SVG components
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const DiscordIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#5865F2">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

export function SignInContent() {
  const [providers, setProviders] = useState<Record<string, { id: string; name: string; type: string }> | null>(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const error = searchParams.get('error');

  useEffect(() => {
    getProviders().then((p) => {
      setProviders(p as any);
      setLoading(false);
    });
  }, []);

  const oauthProviders = providers 
    ? Object.values(providers).filter(p => p.type === 'oauth')
    : [];
  const hasPasswordAuth = providers?.password;
  const hasProviders = oauthProviders.length > 0 || hasPasswordAuth;

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    
    const result = await signIn('password', {
      password,
      redirect: false,
      callbackUrl,
    });

    if (result?.error) {
      setPasswordError('Invalid password');
    } else if (result?.url) {
      window.location.href = result.url;
    }
  };

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case 'github':
        return <Github className="w-5 h-5" />;
      case 'google':
        return <GoogleIcon />;
      case 'discord':
        return <DiscordIcon />;
      default:
        return <Mail className="w-5 h-5" />;
    }
  };

  const getProviderStyle = (providerId: string) => {
    switch (providerId) {
      case 'github':
        return 'bg-[#24292f] hover:bg-[#24292f]/90 text-white border-[#24292f]';
      case 'google':
        return 'bg-white hover:bg-gray-50 text-gray-900 border-gray-300';
      case 'discord':
        return 'bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-[#5865F2]';
      default:
        return 'bg-card hover:bg-accent border-border';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Avro Docs</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to access private documentation
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Sign in failed</p>
              <p className="text-sm opacity-90">
                {error === 'AccessDenied' 
                  ? 'Your account is not authorized to access this site.'
                  : error === 'CredentialsSignin'
                  ? 'Invalid password. Please try again.'
                  : error === 'OAuthSignin'
                  ? 'Could not start the sign in process. Check OAuth configuration.'
                  : 'An error occurred during sign in.'}
              </p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            <div className="h-12 bg-muted animate-pulse rounded-lg" />
            <div className="h-12 bg-muted animate-pulse rounded-lg" />
          </div>
        )}

        {/* No Providers Configured */}
        {!loading && !hasProviders && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-yellow-500" />
              <h2 className="text-lg font-semibold text-foreground">Setup Required</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Authentication is not configured. Add one of these to your environment:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <code className="bg-muted px-1 rounded text-xs">GITHUB_ID</code> + <code className="bg-muted px-1 rounded text-xs">GITHUB_SECRET</code></li>
              <li>• <code className="bg-muted px-1 rounded text-xs">GOOGLE_ID</code> + <code className="bg-muted px-1 rounded text-xs">GOOGLE_SECRET</code></li>
              <li>• <code className="bg-muted px-1 rounded text-xs">DISCORD_ID</code> + <code className="bg-muted px-1 rounded text-xs">DISCORD_SECRET</code></li>
              <li>• <code className="bg-muted px-1 rounded text-xs">ADMIN_PASSWORD</code> (simple password auth)</li>
            </ul>
          </div>
        )}

        {/* OAuth Sign In Buttons */}
        {!loading && oauthProviders.length > 0 && (
          <div className="space-y-3">
            {oauthProviders.map((provider) => (
              <button
                key={provider.id}
                onClick={() => signIn(provider.id, { callbackUrl })}
                className={`w-full flex items-center justify-center gap-3 px-4 py-3 border rounded-lg transition-colors ${getProviderStyle(provider.id)}`}
              >
                {getProviderIcon(provider.id)}
                <span>Continue with {provider.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Divider */}
        {!loading && oauthProviders.length > 0 && hasPasswordAuth && (
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>
        )}

        {/* Password Sign In */}
        {!loading && hasPasswordAuth && (
          <form onSubmit={handlePasswordSignIn} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter site password"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              {passwordError && (
                <p className="text-sm text-destructive">{passwordError}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Lock className="w-4 h-4" />
              Sign in with Password
            </button>
          </form>
        )}

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          Only authorized users can access private content.
        </p>
      </div>
    </div>
  );
}
