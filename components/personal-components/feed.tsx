"use client";

import { useState, useEffect } from "react";
import PostCard from "./post-card";
import { supabase } from "@/lib/supabase";
import { Building2, UserPlus, X, Copy, Check } from "lucide-react";
import { useRouter } from "next/navigation";

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
    hasUserCongratulated: false,
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
];

// new: organization type + mock joined organizations
interface Organization {
  id: string;
  name: string;
  avatar: string;
  role?: string; // Add role to track user's role in org
}

export default function Feed() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [joinedOrgs, setJoinedOrgs] = useState<Organization[]>([]);
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  // Fetch user's organizations
  useEffect(() => {
    const fetchUserOrganizations = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("User not authenticated:", userError);
          setIsLoadingOrgs(false);
          return;
        }

        // Query memberships joined with organizations
        const { data, error } = await supabase
          .from("memberships")
          .select(
            `
            org_id,
            role,
            organizations (
              id,
              name
            )
          `
          )
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching organizations:", error);
          setIsLoadingOrgs(false);
          return;
        }

        // Transform data to Organization format
        const orgs: Organization[] =
          data?.map((membership: any) => ({
            id: membership.organizations.id,
            name: membership.organizations.name,
            avatar: "/orgs/placeholder.jpg",
            role: membership.role, // Include role
          })) || [];

        setJoinedOrgs(orgs);
        setIsLoadingOrgs(false);
      } catch (err) {
        console.error("Unexpected error fetching organizations:", err);
        setIsLoadingOrgs(false);
      }
    };

    fetchUserOrganizations();

    // Subscribe to real-time changes in memberships
    const channel = supabase
      .channel("memberships_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "memberships",
        },
        async (payload) => {
          console.log("Membership change detected:", payload);
          fetchUserOrganizations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setSelectedOrg(null);
      setMenuPosition(null);
    };

    if (selectedOrg) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [selectedOrg]);

  const handleOrgClick = (
    org: Organization,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setSelectedOrg(org);
    setMenuPosition({
      top: rect.top,
      left: rect.right + 8,
    });
  };

  const handleCongratulate = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            congratulations: post.hasUserCongratulated
              ? post.congratulations - 1
              : post.congratulations + 1,
            hasUserCongratulated: !post.hasUserCongratulated,
          };
        }
        return post;
      })
    );
  };

  // new: dialog & form state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [orgDescription, setOrgDescription] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) {
      setFormError("Name is required.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      // Get the current authenticated user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setFormError("You must be logged in to create an organization.");
        setIsSubmitting(false);
        return;
      }

      // Insert into organizations table
      const { data, error } = await supabase
        .from("organizations")
        .insert([
          {
            name: orgName.trim(),
            description: orgDescription.trim() || null,
            owner_id: user.id,
          },
        ])
        .select();

      if (error) {
        console.error("Error creating organization:", error);
        setFormError("Failed to create organization. Please try again.");
        setIsSubmitting(false);
        return;
      }

      console.log("Organization created successfully:", data);

      // Insert into memberships table with the new org's ID
      if (data && data.length > 0) {
        const newOrgId = data[0].id;

        const { error: membershipError } = await supabase
          .from("memberships")
          .insert([
            {
              org_id: newOrgId,
              user_id: user.id,
              role: "Owner",
            },
          ]);

        if (membershipError) {
          console.error("Error creating membership:", membershipError);
          setFormError("Organization created but failed to assign ownership.");
          setIsSubmitting(false);
          return;
        }

        console.log("Membership created successfully");
      }

      // reset and close
      setOrgName("");
      setOrgDescription("");
      setFormError(null);
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Unexpected error:", err);
      setFormError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Invite modal state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteOrgId, setInviteOrgId] = useState<string | null>(null);
  const [inviteOrgName, setInviteOrgName] = useState<string>("");
  const [inviteRole, setInviteRole] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const handleOpenInviteModal = (orgId: string, orgName: string) => {
    setInviteOrgId(orgId);
    setInviteOrgName(orgName);
    setInviteRole("");
    setIsCopied(false);
    setIsInviteModalOpen(true);
    setSelectedOrg(null);
    setMenuPosition(null);
  };

  const handleCopyInviteLink = async () => {
    if (!inviteOrgId || !inviteRole.trim()) return;

    const baseUrl = window.location.origin;
    const link = `${baseUrl}/invite/${inviteOrgId}?role=${encodeURIComponent(
      inviteRole.trim()
    )}`;

    try {
      await navigator.clipboard.writeText(link);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <>
      <div className="w-full max-w-2xl mx-auto py-8 px-4">
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onCongratulate={() => handleCongratulate(post.id)}
            />
          ))}
        </div>
      </div>

      {/* Joined organizations - single large pill with scrollable list inside */}
      <div className="fixed bottom-20 left-6 z-50 w-full max-w-[260px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-3">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
          Linked Organizations
        </h3>
        <div className="max-h-48 overflow-y-auto space-y-2">
          {isLoadingOrgs ? (
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
              Loading...
            </div>
          ) : joinedOrgs.length === 0 ? (
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
              No organizations yet
            </div>
          ) : (
            joinedOrgs.map((org) => (
              <button
                key={org.id}
                type="button"
                className="w-full flex items-center gap-3 px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-left focus:outline-none transition"
                onClick={(e) => handleOrgClick(org, e)}
              >
                <img
                  src={org.avatar}
                  alt={org.name}
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
                <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                  {org.name}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Organization menu popup */}
      {selectedOrg && menuPosition && (
        <div
          className="fixed z-[60] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-2 min-w-[220px]"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-2 px-2 py-1">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 truncate">
              {selectedOrg.name}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedOrg(null);
                setMenuPosition(null);
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/organization/${selectedOrg.id}`);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition"
            >
              <Building2 className="w-4 h-4" />
              <span>View organization profile</span>
            </button>

            {selectedOrg.role === "Owner" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenInviteModal(selectedOrg.id, selectedOrg.name);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition"
              >
                <UserPlus className="w-4 h-4" />
                <span>Invite members to organization</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Floating "Create an Organization" pill button (opens dialog) */}
      <button
        type="button"
        aria-label="Create an Organization"
        onClick={() => setIsDialogOpen(true)}
        className="fixed bottom-6 left-6 z-50 max-w-[260px] w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition px-5 py-3 rounded-2xl flex items-center justify-center font-medium"
      >
        + Create an Organization
      </button>

      {/* Modal / Dialog (shadcn-like styling) */}
      {isDialogOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-org-title"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        >
          {/* backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              if (!isSubmitting) {
                setIsDialogOpen(false);
                setFormError(null);
              }
            }}
          />

          {/* dialog panel */}
          <div className="relative w-full max-w-md mx-4 sm:mx-0 bg-white dark:bg-gray-900 rounded-lg shadow-lg ring-1 ring-black/10 dark:ring-white/10 z-10 overflow-hidden">
            <div className="p-6">
              <h2
                id="create-org-title"
                className="text-lg font-semibold text-gray-900 dark:text-gray-100"
              >
                Create an Organization
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Add a name and a short description for your organization.
              </p>

              <form
                onSubmit={handleCreateOrganization}
                className="mt-4 space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Name
                  </label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                    placeholder="Acme Corp"
                    autoFocus
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Description
                  </label>
                  <textarea
                    value={orgDescription}
                    onChange={(e) => setOrgDescription(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Short description about the organization's mission..."
                    disabled={isSubmitting}
                  />
                </div>

                {formError && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {formError}
                  </p>
                )}

                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setFormError(null);
                    }}
                    className="px-3 py-2 rounded-md text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="invite-modal-title"
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center"
        >
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsInviteModalOpen(false)}
          />

          <div className="relative w-full max-w-md mx-4 sm:mx-0 bg-white dark:bg-gray-900 rounded-lg shadow-lg ring-1 ring-black/10 dark:ring-white/10 z-10 overflow-hidden">
            <div className="p-6">
              <h2
                id="invite-modal-title"
                className="text-lg font-semibold text-gray-900 dark:text-gray-100"
              >
                Invite Members
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Create an invite link for{" "}
                <span className="font-medium">{inviteOrgName}</span>
              </p>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Role *
                  </label>
                  <input
                    type="text"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="block w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Developer, Designer, Manager"
                    autoFocus
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Assign a role to new members joining via this link
                  </p>
                </div>

                {inviteRole.trim() && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Invite Link:
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs bg-white dark:bg-gray-900 px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 truncate">
                        {`${
                          window.location.origin
                        }/invite/${inviteOrgId}?role=${encodeURIComponent(
                          inviteRole.trim()
                        )}`}
                      </code>
                      <button
                        onClick={handleCopyInviteLink}
                        className="shrink-0 p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                        title="Copy link"
                      >
                        {isCopied ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-3 py-2 rounded-md text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
