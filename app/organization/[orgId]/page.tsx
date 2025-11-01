"use client";

import { use } from "react";
import CompanyProfile from "@/components/pages/CompanyPage";

export default function OrganizationPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = use(params);
  return <CompanyProfile orgId={orgId} />;
}
