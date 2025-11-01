import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-0 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter:blur(0)]:bg-background/60">
      <div className="flex h-20 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <img
              src="/logos/logo.jpg"
              alt="Logo"
              className="h-10 w-10 rounded-full object-cover"
            />
          </Link>
        </div>

        {/* Navigation and Sign In */}
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="h-12 gap-2 px-3">
            <Link href="/login">
            <Avatar className="h-16 w-16 overflow-hidden">
              <AvatarImage
                src="/logos/logo.sign.in.jpg"
                alt="User"
                className="object-cover scale-200"
              />
              <AvatarFallback className="bg-zinc-200 text-zinc-500 text-xs font-medium">
                <svg className="h-full w-full p-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">Sign In</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

