"use client"

import { useState } from "react"
import PostCard from "./post-card"

interface Post {
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

const MOCK_POSTS: Post[] = [
  {
    id: "1",
    businessName: "Adobe",
    businessLogo: "/logos/adobe.jpg",
    title: "Launched New AI Design Assistant",
    description:
      "Our AI-powered design assistant now helps creators generate mockups in seconds. This breakthrough reduces design time by 40% while maintaining creative control and professional quality.",
    ideaBy: "John",
    ideaByRole: "Product Manager",
    ideaByPhoto: "/profiles/john.jpg",
    congratulations: 42,
    hasUserCongratulated: false,
    commentCount: 7,
  },
  {
    id: "2",
    businessName: "Google",
    businessLogo: "/logos/google.jpg",
    title: "Achieved Carbon Neutral Operations",
    description:
      "We're proud to announce that all our data centers now operate on 100% renewable energy. This milestone reflects our commitment to sustainability and fighting climate change.",
    ideaBy: "Sarah",
    ideaByRole: "Sustainability Officer",
    ideaByPhoto: "/profiles/sarah.jpg",
    congratulations: 28,
    hasUserCongratulated: true,
    commentCount: 12,
  },
  {
    id: "3",
    businessName: "Tesla",
    businessLogo: "/logos/tesla.jpg",
    title: "Reached 10 Million EV Milestone",
    description:
      "Our fleet has reached 10 million electric vehicles on the road. This represents a monumental shift toward sustainable transportation and a cleaner future for everyone.",
    ideaBy: "Marcus",
    ideaByRole: "Operations Director",
    ideaByPhoto: "/profiles/marcus.jpg",
    congratulations: 15,
    hasUserCongratulated: false,
    commentCount: 5,
  },
  {
    id: "4",
    businessName: "Amazon",
    businessLogo: "/logos/amazon.jpg",
    title: "Launched One-Hour Delivery Nationwide",
    description:
      "Our new logistics network now supports one-hour delivery in 50 major cities. Through innovative supply chain optimization, we're redefining customer expectations.",
    ideaBy: "Emily",
    ideaByRole: "Logistics Lead",
    ideaByPhoto: "/profiles/sarah.jpg",
    congratulations: 63,
    hasUserCongratulated: false,
    commentCount: 18,
  },
  {
    id: "5",
    businessName: "Apple",
    businessLogo: "/logos/apple.jpg",
    title: "Announced Breakthrough in Battery Technology",
    description:
      "Our new battery technology extends device lifespan by 5x while reducing charging time by 60%. This innovation sets a new industry standard for energy efficiency.",
    ideaBy: "David",
    ideaByRole: "Head of Innovation",
    ideaByPhoto: "/profiles/john.jpg",
    congratulations: 89,
    hasUserCongratulated: false,
    commentCount: 23,
  },
  {
    id: "6",
    businessName: "Meta",
    businessLogo: "/logos/meta.jpg",
    title: "Introduced New Privacy Controls",
    description:
      "We've enhanced user privacy with granular controls for data sharing and third-party access. Users now have complete transparency and control over their digital footprint.",
    ideaBy: "Lisa",
    ideaByRole: "Privacy Lead",
    ideaByPhoto: "/profiles/marcus.jpg",
    congratulations: 34,
    hasUserCongratulated: false,
    commentCount: 9,
  },
  {
    id: "7",
    businessName: "Netflix",
    businessLogo: "/logos/netflix.jpg",
    title: "Crossed 500M Subscribers Globally",
    description:
      "We've reached 500 million subscribers worldwide! This milestone celebrates our commitment to providing world-class entertainment and original content for everyone.",
    ideaBy: "James",
    ideaByRole: "Content Strategy",
    ideaByPhoto: "/profiles/sarah.jpg",
    congratulations: 52,
    hasUserCongratulated: false,
    commentCount: 14,
  },
]

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS)

  const handleCongratulate = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            congratulations: post.hasUserCongratulated ? post.congratulations - 1 : post.congratulations + 1,
            hasUserCongratulated: !post.hasUserCongratulated,
          }
        }
        return post
      }),
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4">
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onCongratulate={() => handleCongratulate(post.id)} />
        ))}
      </div>
    </div>
  )
}
