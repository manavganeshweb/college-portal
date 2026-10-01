import { redirect } from "next/navigation";

import { getSessionToken } from "@/lib/auth";
import { getUserBySessionToken } from "@/services/auth.service";
import { getUserApplications } from "@/services/application.service";

import ApplicationsPageClient from "./ApplicationsPageClient";

export default async function ApplicationsPage() {
  const token = await getSessionToken();

  if (!token) {
    redirect("/login?redirect=/applications");
  }

  const user = await getUserBySessionToken(token);

  if (!user) {
    redirect("/login?redirect=/applications");
  }

  const applications = await getUserApplications(user.id);

  return <ApplicationsPageClient applications={applications} />;
}