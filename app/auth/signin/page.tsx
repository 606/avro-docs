import { Suspense } from 'react';
import { SignInContent } from '@/components/auth/signin-content';

function SignInLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Avro Docs</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to access private documentation
          </p>
        </div>
        <div className="space-y-4">
          <div className="h-12 bg-muted animate-pulse rounded-lg" />
          <div className="h-12 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInLoading />}>
      <SignInContent />
    </Suspense>
  );
}
