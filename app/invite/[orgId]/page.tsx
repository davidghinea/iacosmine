"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function InvitePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const orgId = params.orgId as string;
  const role = searchParams.get("role") || "Member";

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const [orgName, setOrgName] = useState("");

  useEffect(() => {
    const handleInvite = async () => {
      try {
        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setStatus("error");
          setMessage("You must be logged in to join an organization.");
          return;
        }

        // Get organization details
        const { data: orgData, error: orgError } = await supabase
          .from("organizations")
          .select("name")
          .eq("id", orgId)
          .single();

        if (orgError || !orgData) {
          setStatus("error");
          setMessage("Organization not found.");
          return;
        }

        setOrgName(orgData.name);

        // Check if user is already a member
        const { data: existingMembership } = await supabase
          .from("memberships")
          .select("id")
          .eq("org_id", orgId)
          .eq("user_id", user.id)
          .single();

        if (existingMembership) {
          setStatus("error");
          setMessage("You are already a member of this organization.");
          return;
        }

        // Add user to memberships
        const { error: insertError } = await supabase
          .from("memberships")
          .insert([
            {
              org_id: orgId,
              user_id: user.id,
              role: role,
            },
          ]);

        if (insertError) {
          console.error("Error joining organization:", insertError);
          setStatus("error");
          setMessage("Failed to join organization. Please try again.");
          return;
        }

        setStatus("success");
        setMessage(`Successfully joined ${orgData.name} as ${role}!`);

        // Redirect to home after 2 seconds
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } catch (err) {
        console.error("Unexpected error:", err);
        setStatus("error");
        setMessage("An unexpected error occurred.");
      }
    };

    handleInvite();
  }, [orgId, role, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex flex-col items-center text-center space-y-4">
          {status === "loading" && (
            <>
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Processing Invitation...
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Please wait while we add you to the organization
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="w-12 h-12 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Success!
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {message}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Redirecting to dashboard...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="w-12 h-12 text-red-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Error
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {message}
              </p>
              <button
                onClick={() => router.push("/")}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Go to Dashboard
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
