"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

const errorMessages: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "Access was denied. You may not have permission to sign in.",
  Verification: "The verification link has expired or has already been used.",
  OAuthSignin: "Error starting the OAuth sign-in flow.",
  OAuthCallback: "Error during the OAuth callback. Please try again.",
  OAuthCreateAccount: "Could not create an account with this OAuth provider.",
  EmailCreateAccount: "Could not create an account with this email.",
  Callback: "Error during the authentication callback.",
  OAuthAccountNotLinked: "This email is already associated with another account.",
  EmailSignin: "Error sending the verification email.",
  CredentialsSignin: "Invalid credentials. Please check your email and password.",
  SessionRequired: "You need to be signed in to access this page.",
  Default: "An authentication error occurred. Please try again.",
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  
  const errorMessage = error 
    ? errorMessages[error] || errorMessages.Default 
    : errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Authentication Error
          </h1>
          <p className="text-muted-foreground">
            {errorMessage}
          </p>
          {error && (
            <p className="text-xs text-muted-foreground/60 font-mono">
              Error code: {error}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button asChild>
            <Link href="/api/auth/signin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Try Again
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}
