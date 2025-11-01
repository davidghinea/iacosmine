"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ChevronUp,
  ChevronDown,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Idea {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  title: string;
  description: string;
  starred?: boolean; // Add starred property
}

const mockIdeas: Idea[] = [
  {
    id: "1",
    user: {
      name: "Sarah Chen",
      avatar: "/diverse-woman-portrait.png",
    },
    title: "AI-powered code review assistant",
    description:
      "A tool that automatically reviews pull requests and suggests improvements based on best practices and team conventions.",
    starred: false,
  },
  {
    id: "2",
    user: {
      name: "Marcus Johnson",
      avatar: "/man.jpg",
    },
    title: "Real-time collaboration whiteboard",
    description:
      "An infinite canvas for teams to brainstorm together with built-in video chat and AI-generated diagrams.",
    starred: false,
  },
  {
    id: "3",
    user: {
      name: "Priya Patel",
      avatar: "/professional-woman.png",
    },
    title: "Smart meeting scheduler",
    description:
      "Automatically finds the best meeting times across multiple calendars and time zones with preference learning.",
    starred: false,
  },
];

export function IdeasSidebar() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [ideas, setIdeas] = useState<Idea[]>(mockIdeas);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleStar = (id: string) => {
    setIdeas((prevIdeas) => {
      const updatedIdeas = prevIdeas.map((idea) =>
        idea.id === id ? { ...idea, starred: !idea.starred } : idea
      );
      
      // Sort: starred items first
      return updatedIdeas.sort((a, b) => {
        if (a.starred && !b.starred) return -1;
        if (!a.starred && b.starred) return 1;
        return 0;
      });
    });
  };

  return (
    <div
      className={`${
        isCollapsed ? "w-0" : "w-96"
      } bg-sidebar border-l border-sidebar-border h-screen overflow-y-auto transition-all duration-300 relative shrink-0`}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -left-10 top-4 h-8 w-8 z-10"
      >
        {isCollapsed ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>

      {!isCollapsed && (
        <>
          <div className="p-4 border-b border-sidebar-border">
            <h2 className="text-lg font-semibold text-sidebar-foreground">
              Trending Ideas
            </h2>
          </div>
          <div>
            {ideas.map((idea) => (
              <div
                key={idea.id}
                className="border-b border-sidebar-border bg-sidebar"
              >
                <div className="p-4 flex items-start gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage
                      src={idea.user.avatar || "/placeholder.svg"}
                      alt={idea.user.name}
                    />
                    <AvatarFallback>{idea.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-sidebar-foreground">
                      {idea.user.name}
                    </div>
                    <button
                      onClick={() => toggleExpand(idea.id)}
                      className="text-sm text-sidebar-foreground hover:underline text-left mt-1"
                    >
                      {idea.title}
                    </button>
                    {expandedId === idea.id && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        {idea.description}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => toggleStar(idea.id)}
                    >
                      <Star 
                        className={`h-4 w-4 ${idea.starred ? 'fill-current' : ''}`}
                      />
                    </Button>

                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}