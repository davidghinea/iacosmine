import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-0 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter:blur(0)]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Logo + Name */}
        <div className="flex items-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <img
              src="/logos/logo.jpg"
              alt="Connex"
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium">Connex</span>
          </Link>
        </div>

        {/* Sign In (compact) */}
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="h-9 gap-2 px-2">
            <Link href="/login" className="inline-flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-sm">Sign in</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
