"use client"

import Feed from "@/components/personal-components/feed"

export default function Home() {
  return (
    <div className="flex min-h-screen w-full justify-center items-start bg-background">
      {/* Main feed area - flexible for sidebar */}
        <Feed />
    </div>
  )
}
