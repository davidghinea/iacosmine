"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  ArrowUp,
  ArrowDown,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";

// Track if a sidebar is already mounted
let sidebarInstanceCount = 0;

// shared UI constants to keep sizes consistent and code short
const AVATAR_SIZES = "size-10 sm:size-12 md:size-16";
const ACTION_BTN =
  "size-6 sm:size-8 md:size-9 h-6 sm:h-8 md:h-9 w-6 sm:w-8 md:w-9 cursor-pointer";
const ICON_MD = "size-3 sm:size-4 md:size-5";
const ITEM_ROW =
  "flex items-start gap-2 sm:gap-3 md:gap-3 p-3 sm:p-4 md:p-6 relative";

interface Idea {
  id: string; // Changed from number to string (UUID)
  user: {
    name: string;
    avatar: string;
  };
  title: string;
  description: string;
  upvotes?: number;
  downvotes?: number;
  published?: boolean;
  myVote?: "up" | "down" | null;
  org_id?: string; // Add org_id
  author_id?: string; // Add author_id
}

const defaultUser = {
  name: "You",
  avatar: "/placeholder.svg",
};

function IdeaTile({
  idea,
  onToggleExpand,
  onUpvote,
  onDownvote,
  onDelete,
  isPublished,
}: {
  idea: Idea;
  onToggleExpand: (id: string) => void;
  onUpvote: (id: string) => void;
  onDownvote: (id: string) => void;
  onDelete: (id: string) => void;
  isPublished: boolean;
}) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    onToggleExpand(idea.id);
  };

  return (
    <div className="w-full">
      <div className={ITEM_ROW}>
        <Avatar className={cn(AVATAR_SIZES, "shrink-0")}>
          <AvatarImage
            src={idea.user.avatar || "/placeholder.svg"}
            alt={idea.user.name}
          />
          <AvatarFallback className="text-xs sm:text-sm md:text-xl">
            {idea.user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 pr-1 sm:pr-2">
          <div className="text-xs sm:text-sm md:text-base font-semibold leading-normal mb-1 sm:mb-1.5 md:mb-2 truncate">
            {idea.user.name}
          </div>
          <div className="flex items-center gap-1 min-w-0">
            <button
              onClick={handleExpand}
              className="text-xs sm:text-sm md:text-base leading-snug text-left hover:underline font-medium flex-1 cursor-pointer whitespace-nowrap truncate min-w-0 overflow-hidden pr-2"
            >
              {idea.title}
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 sm:size-6 md:size-7 cursor-pointer shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                handleExpand();
              }}
            >
              <ChevronDown
                className={cn(
                  "size-4 transition-transform",
                  isExpanded ? "rotate-180" : "rotate-0"
                )}
              />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5 shrink-0">
          {isPublished && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className={ACTION_BTN}
                onClick={(e) => {
                  e.stopPropagation();
                  onUpvote(idea.id);
                }}
              >
                <ArrowUp
                  className={cn(
                    ICON_MD,
                    idea.myVote === "up" ? "text-green-600" : "text-black"
                  )}
                />
              </Button>
              <span className="text-[10px] sm:text-xs md:text-xs tabular-nums select-none min-w-6 text-center">
                {(() => {
                  const diff = (idea.upvotes || 0) - (idea.downvotes || 0);
                  if (diff > 0) return `+${diff}`;
                  if (diff < 0) return `${diff}`;
                  return "0";
                })()}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className={ACTION_BTN}
                onClick={(e) => {
                  e.stopPropagation();
                  onDownvote(idea.id);
                }}
              >
                <ArrowDown
                  className={cn(
                    ICON_MD,
                    idea.myVote === "down" ? "text-red-600" : "text-black"
                  )}
                />
              </Button>
            </>
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="pr-3 sm:pr-4 md:pr-6 pb-4 sm:pb-6 md:pb-10 pl-15 sm:pl-19 md:pl-25 text-sm sm:text-base md:text-lg text-muted-foreground wrap-break-word">
          {idea.description}
        </div>
      )}
      <Separator className="bg-foreground/30" />
    </div>
  );
}

function SidebarToggleButton() {
  const { open, toggleSidebar } = useSidebar();

  return (
    <div
      className="fixed top-1/2 -translate-y-1/2 transition-all duration-300 flex items-center z-9999 pointer-events-auto"
      style={{
        // position the control so its right edge aligns with the sidebar's left edge when open,
        // and anchor to the viewport edge when closed.
        right: open ? "var(--sidebar-width)" : "0px",
      }}
    >
      <div className="flex items-center bg-transparent rounded-sm">
        <Button
          variant="ghost"
          size="icon"
          className="size-7 sm:size-8 bg-background/80 hover:bg-background border border-border shadow-sm cursor-pointer"
          onClick={toggleSidebar}
        >
          {open ? (
            <ChevronRight className="size-4 sm:size-5" />
          ) : (
            <ChevronLeft className="size-4 sm:size-5" />
          )}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>

        {/* Vertical IDEAS label (always visible). px-2 gives equal left/right padding.
            gap-3 increases spacing between letters so they remain readable. */}
        <div className="ml-3 px-4 flex flex-col items-center select-none gap-3">
          <span className="text-[10px] sm:text-xs font-medium leading-none tracking-wider">
            I
          </span>
          <span className="text-[10px] sm:text-xs font-medium leading-none tracking-wider">
            D
          </span>
          <span className="text-[10px] sm:text-xs font-medium leading-none tracking-wider">
            E
          </span>
          <span className="text-[10px] sm:text-xs font-medium leading-none tracking-wider">
            A
          </span>
          <span className="text-[10px] sm:text-xs font-medium leading-none tracking-wider">
            S
          </span>
        </div>
      </div>
    </div>
  );
}

export function IdeasSidebarShadcn({
  children,
}: {
  children?: React.ReactNode;
}) {
  const pathname = usePathname();
  const [ideas, setIdeas] = React.useState<Idea[]>([]);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [newIdeaTitle, setNewIdeaTitle] = React.useState("");
  const [newIdeaDescription, setNewIdeaDescription] = React.useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [ideaToDelete, setIdeaToDelete] = React.useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);
  const [isLoadingIdeas, setIsLoadingIdeas] = React.useState(true);
  const [isMember, setIsMember] = React.useState(false);
  const [isCheckingMembership, setIsCheckingMembership] = React.useState(true);
  const [orgId, setOrgId] = React.useState<string | null>(null);
  const [instanceId] = React.useState(() => ++sidebarInstanceCount);
  const [isOwner, setIsOwner] = React.useState(false);

  // Cleanup on unmount
  React.useEffect(() => {
    console.log(`Sidebar instance ${instanceId} mounted`);
    return () => {
      console.log(`Sidebar instance ${instanceId} unmounted`);
      sidebarInstanceCount--;
    };
  }, [instanceId]);

  // Extract orgId from URL
  React.useEffect(() => {
    const match = pathname.match(/\/organization\/([^\/]+)/);
    const extractedOrgId = match ? match[1] : null;
    console.log(
      `Instance ${instanceId} - Extracted orgId from URL:`,
      extractedOrgId,
      "pathname:",
      pathname
    );
    setOrgId(extractedOrgId);
  }, [pathname, instanceId]);

  // Fetch current user and check membership
  React.useEffect(() => {
    const fetchUserAndCheckMembership = async () => {
      if (!orgId) {
        console.log("No orgId available yet");
        setIsCheckingMembership(false);
        return;
      }

      console.log("Checking membership for orgId:", orgId);
      setIsCheckingMembership(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setCurrentUserId(user.id);
        console.log("Current user ID:", user.id);

        // Check if user is a member of this organization
        const { data: membership, error } = await supabase
          .from("memberships")
          .select("id, role")
          .eq("org_id", orgId)
          .eq("user_id", user.id)
          .maybeSingle();

        console.log("Membership query result:", { membership, error });

        if (membership) {
          console.log("User IS a member of org:", orgId);
          setIsMember(true);
          setIsOwner(membership.role === "Owner");
        } else {
          console.log("User is NOT a member of org:", orgId);
          setIsMember(false);
          setIsOwner(false);
        }
      } else {
        console.log("No authenticated user");
      }

      setIsCheckingMembership(false);
    };
    fetchUserAndCheckMembership();
  }, [orgId]);

  // Fetch ideas from Supabase
  React.useEffect(() => {
    if (!orgId) {
      console.log("No orgId provided");
      setIsLoadingIdeas(false);
      return;
    }

    if (isCheckingMembership) {
      console.log("Still checking membership, waiting...");
      return;
    }

    if (!isMember) {
      console.log("User is not a member, not fetching ideas");
      setIsLoadingIdeas(false);
      return;
    }

    const fetchIdeas = async () => {
      console.log("Fetching ideas for org:", orgId);
      setIsLoadingIdeas(true);

      const { data, error } = await supabase
        .from("private_posts")
        .select("*")
        .eq("org_id", orgId)
        .order("created_at", { ascending: false });

      console.log("Fetch ideas result:", { data, error, count: data?.length });

      if (error) {
        console.error("Error fetching ideas:", error);
        setIsLoadingIdeas(false);
        return;
      }

      // Get all unique author IDs from the posts
      const authorIds = [
        ...new Set((data || []).map((p) => p.author_id).filter(Boolean)),
      ];

      let profilesMap: Record<
        string,
        { full_name: string; avatar_url?: string }
      > = {};

      if (authorIds.length > 0) {
        // Fetch all profiles for these author IDs in one go
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url")
          .in("id", authorIds);

        if (profilesError) {
          console.warn(
            "Could not fetch profiles, using fallback names:",
            profilesError
          );
          // Continue without profiles - use fallback names
        } else if (profilesData) {
          // Create a map of authorId -> profile for easy lookup
          profilesMap = profilesData.reduce(
            (
              acc: Record<string, { full_name: string; avatar_url?: string }>,
              profile
            ) => {
              acc[profile.id] = {
                full_name: profile.full_name,
                avatar_url: profile.avatar_url,
              };
              return acc;
            },
            {}
          );
        }
      }

      const ideasWithAuthors = (data || []).map((post: any) => {
        // Try to get the profile from the map, fallback to "Anonymous"
        const profile = profilesMap[post.author_id];
        const authorName = profile?.full_name || "Anonymous";
        const avatarUrl = profile?.avatar_url || "/placeholder.svg";

        return {
          id: post.id,
          user: {
            name: authorName,
            avatar: avatarUrl,
          },
          title: post.title,
          description: post.description || "",
          upvotes: post.upvotes || 0,
          downvotes: post.downvotes || 0,
          published: true,
          myVote: null,
          org_id: post.org_id,
          author_id: post.author_id,
        };
      });

      console.log("Transformed ideas:", ideasWithAuthors.length);
      // Sort starred items first before setting state
      setIdeas(ideasWithAuthors);
      setIsLoadingIdeas(false);
    };

    fetchIdeas();

    // Subscribe to real-time changes with org-specific channel
    const channel = supabase
      .channel(`org_${orgId}_private_posts`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "private_posts",
          filter: `org_id=eq.${orgId}`,
        },
        (payload) => {
          console.log(`Real-time update for org ${orgId}:`, payload);
          fetchIdeas();
        }
      )
      .subscribe();

    return () => {
      console.log(`Unsubscribing from org ${orgId} channel`);
      supabase.removeChannel(channel);
    };
  }, [orgId, isMember, isCheckingMembership]);

  const updateIdea = (id: string, updater: (i: Idea) => Idea) =>
    setIdeas((prev) => prev.map((i) => (i.id === id ? updater(i) : i)));

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleUpvote = async (id: string) => {
    const idea = ideas.find((i) => i.id === id);
    if (!idea) return;

    const newUpvotes =
      idea.myVote === "up"
        ? Math.max(0, (idea.upvotes || 0) - 1)
        : (idea.upvotes || 0) + 1;
    const newDownvotes =
      idea.myVote === "down"
        ? Math.max(0, (idea.downvotes || 0) - 1)
        : idea.downvotes || 0;

    const { error } = await supabase
      .from("private_posts")
      .update({ upvotes: newUpvotes, downvotes: newDownvotes })
      .eq("id", id);

    if (!error) {
      updateIdea(id, (i) => ({
        ...i,
        upvotes: newUpvotes,
        downvotes: newDownvotes,
        myVote: i.myVote === "up" ? null : "up",
      }));
    }
  };

  const handleDownvote = async (id: string) => {
    const idea = ideas.find((i) => i.id === id);
    if (!idea) return;

    const newDownvotes =
      idea.myVote === "down"
        ? Math.max(0, (idea.downvotes || 0) - 1)
        : (idea.downvotes || 0) + 1;
    const newUpvotes =
      idea.myVote === "up"
        ? Math.max(0, (idea.upvotes || 0) - 1)
        : idea.upvotes || 0;

    const { error } = await supabase
      .from("private_posts")
      .update({ upvotes: newUpvotes, downvotes: newDownvotes })
      .eq("id", id);

    if (!error) {
      updateIdea(id, (i) => ({
        ...i,
        upvotes: newUpvotes,
        downvotes: newDownvotes,
        myVote: i.myVote === "down" ? null : "down",
      }));
    }
  };

  const handleDeleteClick = (id: string) => {
    setIdeaToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (ideaToDelete !== null) {
      const { error } = await supabase
        .from("private_posts")
        .delete()
        .eq("id", ideaToDelete);

      if (!error) {
        setIdeas((prevIdeas) =>
          prevIdeas.filter((idea) => idea.id !== ideaToDelete)
        );
      }
      setDeleteDialogOpen(false);
      setIdeaToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setIdeaToDelete(null);
  };

  const handleAddIdea = async () => {
    if (!newIdeaTitle.trim() || !currentUserId || !orgId) return;

    const { data, error } = await supabase
      .from("private_posts")
      .insert([
        {
          org_id: orgId,
          title: newIdeaTitle.trim(),
          description: newIdeaDescription.trim() || null,
          author_id: currentUserId,
          upvotes: 0,
          downvotes: 0,
          vouched: false,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating idea:", error);
      return;
    }

    setNewIdeaTitle("");
    setNewIdeaDescription("");
    setIsSheetOpen(false);
  };

  const handleSheetOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) {
      setNewIdeaTitle("");
      setNewIdeaDescription("");
    }
  };

  // Don't render sidebar if not a member or no orgId
  if (!orgId || (!isMember && !isCheckingMembership)) {
    console.log(
      `Instance ${instanceId} - Not rendering sidebar - orgId:`,
      orgId,
      "isMember:",
      isMember
    );
    return <>{children}</>;
  }

  // Only render the first instance
  if (instanceId > 1) {
    console.log(`Instance ${instanceId} - Skipping duplicate sidebar`);
    return <>{children}</>;
  }

  console.log(`Instance ${instanceId} - Rendering sidebar`);

  return (
    <SidebarProvider
      defaultOpen={false}
      style={
        {
          "--sidebar-width": "clamp(364px, 52vw, 650px)",
        } as React.CSSProperties
      }
    >
      {children}
      <Sidebar
        side="right"
        collapsible="offcanvas"
        className="border-l border-foreground/40"
      >
        <SidebarHeader className="border-b border-foreground/40">
          <div className="flex items-center justify-between p-2 sm:p-3 md:p-4">
            <h2 className="text-base sm:text-lg font-semibold">
              Trending Ideas
            </h2>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              {isLoadingIdeas ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-sm text-muted-foreground">
                    Loading ideas...
                  </div>
                </div>
              ) : ideas.length === 0 ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-sm text-muted-foreground">
                    No ideas yet. Be the first to post!
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  {ideas.map((idea) => (
                    <IdeaTile
                      key={idea.id}
                      idea={idea}
                      onToggleExpand={toggleExpand}
                      onUpvote={handleUpvote}
                      onDownvote={handleDownvote}
                      onDelete={handleDeleteClick}
                      isPublished={idea.published !== false}
                    />
                  ))}
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-foreground/40 p-3 sm:p-4 md:p-6">
          <Button
            className="w-full h-13 sm:h-14 md:h-15 text-base sm:text-lg md:text-xl bg-black text-white hover:bg-black/90 cursor-pointer"
            onClick={() => setIsSheetOpen(true)}
          >
            + Post your idea
          </Button>
        </SidebarFooter>
      </Sidebar>

      {isSheetOpen && (
        <div
          className="fixed inset-y-0 right-0 z-60 sm:z-50 bg-sidebar border-l border-foreground/30 h-screen flex flex-col"
          style={{ width: "var(--sidebar-width)" }}
        >
          <div className="border-b border-foreground/30 p-4 sm:p-5 md:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-sidebar-foreground">
              Post Your Idea
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10">
            <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 h-full">
              <div className="flex flex-col gap-2 sm:gap-3">
                <label
                  htmlFor="idea-title"
                  className="text-sm sm:text-base md:text-lg font-medium text-sidebar-foreground"
                >
                  Title *
                </label>
                <Input
                  id="idea-title"
                  placeholder="Enter your idea title..."
                  value={newIdeaTitle}
                  onChange={(e) => setNewIdeaTitle(e.target.value)}
                  className="w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base md:text-lg"
                />
              </div>
              <div className="flex flex-col gap-2 sm:gap-3 flex-1">
                <label
                  htmlFor="idea-description"
                  className="text-sm sm:text-base md:text-lg font-medium text-sidebar-foreground"
                >
                  Description
                </label>
                <textarea
                  id="idea-description"
                  placeholder="Describe your idea in detail..."
                  value={newIdeaDescription}
                  onChange={(e) => setNewIdeaDescription(e.target.value)}
                  className="flex-1 w-full rounded-md border border-input bg-transparent px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base md:text-lg shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
              </div>
            </div>
          </div>
          <div className="border-t border-foreground/30 p-4 sm:p-5 md:p-6">
            <div className="flex gap-2 sm:gap-3">
              <Button
                variant="outline"
                className="flex-1 h-10 sm:h-11 md:h-12 text-sm sm:text-base md:text-lg cursor-pointer"
                onClick={() => setIsSheetOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 h-10 sm:h-11 md:h-12 text-sm sm:text-base md:text-lg cursor-pointer"
                onClick={handleAddIdea}
                disabled={!newIdeaTitle.trim()}
              >
                Add Idea
              </Button>
            </div>
          </div>
        </div>
      )}

      <DialogPrimitive.Root
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 duration-150 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content
            className={cn(
              "fixed left-[50%] top-[50%] z-50 grid w-[90vw] sm:w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-3 sm:gap-4 border bg-background p-4 sm:p-6 shadow-lg duration-150 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 rounded-lg sm:rounded-lg mx-4"
            )}
          >
            <DialogPrimitive.Title className="text-base sm:text-lg font-semibold">
              Delete idea
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-xs sm:text-sm text-muted-foreground">
              Are you sure you want to delete this idea? This action cannot be
              undone.
            </DialogPrimitive.Description>
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-2 mt-4">
              <DialogPrimitive.Close asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={handleDeleteCancel}
                >
                  Cancel
                </Button>
              </DialogPrimitive.Close>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
                onClick={handleDeleteConfirm}
              >
                Delete
              </Button>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      <SidebarToggleButton />
    </SidebarProvider>
  );
}
