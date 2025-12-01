'use client';

import { signIn, getProviders } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Github } from 'lucide-react';

export default function SignInPage() {
  const [providers, setProviders] = useState<Record<string, { id: string; name: string }> | null>(null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const error = searchParams.get('error');

  useEffect(() => {
    getProviders().then(setProviders);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Avro Docs</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to access private documentation
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
            {error === 'AccessDenied' 
              ? 'Access denied. Your account is not authorized.'
              : 'An error occurred during sign in.'}
          </div>
        )}

        <div className="space-y-4">
          {providers && Object.values(providers).map((provider) => (
            <button
              key={provider.id}
              onClick={() => signIn(provider.id, { callbackUrl })}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-lg bg-card hover:bg-accent transition-colors"
            >
              {provider.id === 'github' && <Github className="w-5 h-5" />}
              <span>Sign in with {provider.name}</span>
            </button>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Only authorized users can access this site.
        </p>
      </div>
    </div>
  );
}
