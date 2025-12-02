import { Suspense } from 'react';
import { ErrorContent } from '@/components/auth/error-content';

function ErrorLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-lg w-full space-y-6">
        <div className="bg-card border border-border rounded-xl p-8 space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 bg-muted animate-pulse rounded-full" />
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<ErrorLoading />}>
      <ErrorContent />
    </Suspense>
  );
}
