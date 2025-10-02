import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={cn("text-primary", className)}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="StatsSite Logo"
    >
      <path
        d="M25 87.5V12.5H75"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="35" y="55" width="10" height="20" fill="currentColor" />
      <rect x="50" y="35" width="10" height="40" fill="currentColor" />
      <rect x="65" y="20" width="10" height="55" fill="currentColor" />
    </svg>
  );
}
