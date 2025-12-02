import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Define which paths require authentication
        const privatePaths = ['/docs/pet-projects', '/docs/obsidian'];
        const path = req.nextUrl.pathname;
        
        // Check if the current path is private
        const isPrivatePath = privatePaths.some(
          (privatePath) => path.startsWith(privatePath)
        );
        
        // If it's a private path, require authentication
        if (isPrivatePath) {
          return !!token;
        }
        
        // Public paths don't require authentication
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    // Match all paths except static files and api routes (except auth)
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
};
