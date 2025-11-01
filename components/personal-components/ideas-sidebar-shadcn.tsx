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
  Star,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

// shared UI constants to keep sizes consistent and code short
const AVATAR_SIZES = "size-10 sm:size-12 md:size-16";
const ACTION_BTN =
  "size-6 sm:size-8 md:size-9 h-6 sm:h-8 md:h-9 w-6 sm:w-8 md:w-9 cursor-pointer";
const ICON_MD = "size-3 sm:size-4 md:size-5";
const ITEM_ROW =
  "flex items-start gap-2 sm:gap-3 md:gap-3 p-3 sm:p-4 md:p-6 relative";

interface Idea {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  title: string;
  description: string;
  starred?: boolean;
  upvotes?: number;
  downvotes?: number;
  published?: boolean;
  myVote?: "up" | "down" | null;
}

const mockIdeas: Idea[] = [
  {
    id: 1,
    user: {
      name: "Sarah Chen",
      avatar: "/diverse-woman-portrait.png",
    },
    title: "AI-powered code review assistant",
    description:
      "An intelligent system that automatically reviews pull requests, suggests improvements, and catches potential bugs before they reach production. It learns from your team's coding patterns and adapts to your style guide.",
    starred: false,
    upvotes: 0,
    downvotes: 0,
    published: true,
  },
  {
    id: 2,
    user: {
      name: "Marcus Johnson",
      avatar: "/man.jpg",
    },
    title: "Real-time collaboration whiteboard",
    description:
      "A virtual whiteboard that allows teams to brainstorm together in real-time, with features like sticky notes, drawing tools, and the ability to import images and documents. Perfect for remote teams.",
    starred: false,
    upvotes: 0,
    downvotes: 0,
    published: true,
  },
  {
    id: 3,
    user: {
      name: "Emily Rodriguez",
      avatar: "/professional-woman.png",
    },
    title: "Sustainable shopping tracker",
    description:
      "Track the environmental impact of your purchases and get suggestions for more sustainable alternatives. Includes carbon footprint calculations and connects you with eco-friendly brands.",
    starred: false,
    upvotes: 0,
    downvotes: 0,
    published: true,
  },
];

const defaultUser = {
  name: "You",
  avatar: "/placeholder.svg",
};

function IdeaTile({
  idea,
  onToggleStar,
  onToggleExpand,
  onUpvote,
  onDownvote,
  onDelete,
  isPublished,
}: {
  idea: Idea;
  onToggleStar: (id: number) => void;
  onToggleExpand: (id: number) => void;
  onUpvote: (id: number) => void;
  onDownvote: (id: number) => void;
  onDelete: (id: number) => void;
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
          <Button
            variant="ghost"
            size="icon"
            className={ACTION_BTN}
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar(idea.id);
            }}
          >
            <Star className={cn(ICON_MD, idea.starred ? "fill-current" : "")} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              ACTION_BTN,
              "text-green-500 hover:text-green-600 hover:bg-green-500/10"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(idea.id);
            }}
          >
            <Check className={ICON_MD} />
          </Button>
        </div>
      </div>
      {isExpanded && (
        <div className="pr-3 sm:pr-4 md:pr-6 pb-4 sm:pb-6 md:pb-10 pl-[3.75rem] sm:pl-[4.75rem] md:pl-[6.25rem] text-sm sm:text-base md:text-lg text-muted-foreground break-words whitespace-pre-wrap">
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
      className="fixed top-1/2 -translate-y-1/2 transition-all duration-300 flex items-center z-[9999] pointer-events-auto"
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
  const [ideas, setIdeas] = React.useState<Idea[]>(mockIdeas);
  const [expandedId, setExpandedId] = React.useState<number | null>(null);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [newIdeaTitle, setNewIdeaTitle] = React.useState("");
  const [newIdeaDescription, setNewIdeaDescription] = React.useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [ideaToDelete, setIdeaToDelete] = React.useState<number | null>(null);

  const updateIdea = (id: number, updater: (i: Idea) => Idea) =>
    setIdeas((prev) => prev.map((i) => (i.id === id ? updater(i) : i)));

  const sortStarredFirst = (list: Idea[]) =>
    list
      .slice()
      .sort((a, b) => (a.starred === b.starred ? 0 : a.starred ? -1 : 1));

  const toggleStar = (id: number) => {
    setIdeas((prev) =>
      sortStarredFirst(
        prev.map((i) => (i.id === id ? { ...i, starred: !i.starred } : i))
      )
    );
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleUpvote = (id: number) =>
    updateIdea(id, (i) => {
      const up = i.upvotes || 0;
      const down = i.downvotes || 0;
      const vote = i.myVote ?? null;
      if (vote === "up") {
        return { ...i, upvotes: Math.max(0, up - 1), myVote: null };
      }
      if (vote === "down") {
        return {
          ...i,
          upvotes: up + 1,
          downvotes: Math.max(0, down - 1),
          myVote: "up",
        };
      }
      return { ...i, upvotes: up + 1, myVote: "up" };
    });

  const handleDownvote = (id: number) =>
    updateIdea(id, (i) => {
      const up = i.upvotes || 0;
      const down = i.downvotes || 0;
      const vote = i.myVote ?? null;
      if (vote === "down") {
        return { ...i, downvotes: Math.max(0, down - 1), myVote: null };
      }
      if (vote === "up") {
        return {
          ...i,
          downvotes: down + 1,
          upvotes: Math.max(0, up - 1),
          myVote: "down",
        };
      }
      return { ...i, downvotes: down + 1, myVote: "down" };
    });

  const handleDeleteClick = (id: number) => {
    setIdeaToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (ideaToDelete !== null) {
      setIdeas((prevIdeas) =>
        prevIdeas.filter((idea) => idea.id !== ideaToDelete)
      );
      setDeleteDialogOpen(false);
      setIdeaToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setIdeaToDelete(null);
  };

  const handleAddIdea = () => {
    if (!newIdeaTitle.trim()) return;

    const newId = Math.max(...ideas.map((i) => i.id), 0) + 1;
    const newIdea: Idea = {
      id: newId,
      user: defaultUser,
      title: newIdeaTitle.trim(),
      description: newIdeaDescription.trim() || "No description provided.",
      starred: false,
      upvotes: 0,
      downvotes: 0,
      published: true,
    };

    setIdeas((prevIdeas) => [newIdea, ...prevIdeas]);
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
              <div className="flex flex-col">
                {ideas.map((idea) => (
                  <IdeaTile
                    key={idea.id}
                    idea={idea}
                    onToggleStar={toggleStar}
                    onToggleExpand={toggleExpand}
                    onUpvote={handleUpvote}
                    onDownvote={handleDownvote}
                    onDelete={handleDeleteClick}
                    isPublished={idea.published !== false}
                  />
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-foreground/40 p-3 sm:p-4 md:p-6">
          <Button
            className="w-full h-[3.25rem] sm:h-[3.5rem] md:h-[3.75rem] text-base sm:text-lg md:text-xl bg-black text-white hover:bg-black/90 cursor-pointer"
            onClick={() => setIsSheetOpen(true)}
          >
            + Post your idea
          </Button>
        </SidebarFooter>
      </Sidebar>

      {isSheetOpen && (
        <div
          className="fixed inset-y-0 right-0 z-[60] sm:z-50 bg-sidebar border-l border-foreground/30 h-screen flex flex-col"
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
              Finish your idea
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-xs sm:text-sm text-muted-foreground">
              Are you sure you want to finish your idea? This action cannot be
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
                className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto"
                onClick={handleDeleteConfirm}
              >
                Finish
              </Button>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      <SidebarToggleButton />
    </SidebarProvider>
  );
}
