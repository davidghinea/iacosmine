"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Heart, MessageCircle } from "lucide-react"
// local state removed to avoid double increment; rely on parent props

interface PostCardProps {
  post: {
    id: string
    businessName: string
    businessLogo: string
    title: string
    description: string
    ideaBy: string
    ideaByRole: string
    ideaByPhoto: string
    congratulations: number
    hasUserCongratulated: boolean
    commentCount: number
  }
  onCongratulate: () => void
}

export default function PostCard({ post, onCongratulate }: PostCardProps) {
  const liked = post.hasUserCongratulated
  const count = post.congratulations

  const handleClick = () => {
    onCongratulate()
  }

  return (
    <Card className="border">
      <div className="p-5">
        {/* Header with logo and name */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 shrink-0 bg-muted rounded-full flex items-center justify-center">
            <Image
              src={post.businessLogo || "/placeholder.svg"}
              alt={post.businessName}
              width={48}
              height={48}
              className="rounded-full object-contain"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium">{post.businessName}</h3>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  idea by {post.ideaBy}, {post.ideaByRole}
                </span>
                <Image
                  src={post.ideaByPhoto || "/placeholder.svg"}
                  alt={post.ideaBy}
                  width={20}
                  height={20}
                  className="w-5 h-5 rounded-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Post title */}
        <h2 className="text-sm font-semibold mb-2">{post.title}</h2>

        {/* Post description */}
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">{post.description}</p>

        <div className="border-t pt-3">
          <div className="flex items-center justify-between gap-6 py-2">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleClick}
                aria-pressed={liked}
                variant={liked ? "default" : "default"}
                size="sm"
                className={`text-xs h-8 px-3 transition-colors duration-200 hover:opacity-90 cursor-pointer ${
                  liked ? "bg-red-600 hover:bg-red-700 text-white" : ""
                }`}
                title={liked ? "Remove congratulations" : "Congratulate"}
              >
                <Heart
                  className={`w-4 h-4 mr-1 ${liked ? "fill-current" : ""} cursor-pointer`}
                />
                <span className="cursor-pointer">{liked ? "Congratulated" : "Congratulate"}</span>
              </Button>
              <span className="text-xs text-muted-foreground">{count}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{post.commentCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
