import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showBadge?: boolean;
}

export function Logo({ size = "md", className, showBadge = false }: LogoProps) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10", 
    lg: "h-14 w-14",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const roundedSizes = {
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-xl",
  };

  const badgeSizes = {
    sm: "h-3 w-3 -bottom-0.5 -right-0.5 rounded",
    md: "h-3.5 w-3.5 -bottom-0.5 -right-0.5 rounded-md",
    lg: "h-4 w-4 -bottom-1 -right-1 rounded-md",
  };

  const lockSizes = {
    sm: "h-1.5 w-1.5",
    md: "h-2 w-2",
    lg: "h-2 w-2",
  };

  return (
    <div className={cn("relative inline-flex", className)}>
      <div
        className={cn(
          "bg-foreground flex items-center justify-center",
          sizes[size],
          roundedSizes[size]
        )}
      >
        <span
          className={cn(
            "font-medium text-background select-none",
            textSizes[size]
          )}
        >
          A
        </span>
      </div>
      {showBadge && (
        <div
          className={cn(
            "absolute bg-emerald-500 flex items-center justify-center",
            badgeSizes[size]
          )}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("text-white", lockSizes[size])}
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
      )}
    </div>
  );
}
