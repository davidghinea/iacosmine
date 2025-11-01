"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import PostCard from "../personal-components/post-card";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface Post {
  id: string;
  businessName: string;
  businessLogo: string;
  title: string;
  description: string;
  ideaBy: string;
  ideaByRole: string;
  ideaByPhoto: string;
  congratulations: number;
  hasUserCongratulated: boolean;
  commentCount: number;
}

interface Organization {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: string;
}

interface CompanyProfileProps {
  orgId: string; // Changed from company name to org ID
}

export default function CompanyProfile({ orgId }: CompanyProfileProps) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch organization details
        const { data: orgData, error: orgError } = await supabase
          .from("organizations")
          .select("*")
          .eq("id", orgId)
          .single();

        if (orgError) {
          console.error("Error fetching organization:", orgError);
          setError("Organization not found.");
          setIsLoading(false);
          return;
        }

        setOrganization(orgData);

        // TODO: Fetch posts for this organization when you have a posts table
        // For now, using empty array
        setPosts([]);

        setIsLoading(false);
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred.");
        setIsLoading(false);
      }
    };

    if (orgId) {
      fetchOrganizationData();
    }
  }, [orgId]);

  const handleCongratulate = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              congratulations: post.hasUserCongratulated
                ? post.congratulations - 1
                : post.congratulations + 1,
              hasUserCongratulated: !post.hasUserCongratulated,
            }
          : post
      )
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-6">
          <p className="text-red-600">{error || "Organization not found"}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-lg flex items-center justify-center">
            <Image
              src="/orgs/placeholder.jpg"
              alt={`${organization.name} logo`}
              fill
              className="object-contain rounded-lg"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold truncate">
              {organization.name}
            </h1>
            <p className="text-gray-500 mt-1 text-sm">Organization Profile</p>
            <p className="mt-3 text-sm sm:text-base text-gray-700 leading-relaxed break-words">
              {organization.description || "No description available."}
            </p>
          </div>
        </div>
      </Card>

      <h2 className="text-2xl font-semibold mb-4">
        Posts from {organization.name}
      </h2>
      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onCongratulate={() => handleCongratulate(post.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-gray-500">No posts yet for this organization.</div>
      )}
    </div>
  );
}
