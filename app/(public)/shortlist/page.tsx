import { redirect } from "next/navigation";
import { getSessionToken } from "@/lib/auth";
import { getUserBySessionToken } from "@/services/auth.service";
import { getUserShortlistedColleges } from "@/services/shortlist.service";
import ShortlistPageClient from "./ShortlistPageClient";

export default async function ShortlistPage() {
  const token = await getSessionToken();

  if (!token) {
    redirect("/login?redirect=/shortlist");
  }

  const user = await getUserBySessionToken(token);

  if (!user) {
    redirect("/login?redirect=/shortlist");
  }

  const shortlists = await getUserShortlistedColleges(user.id);

  return <ShortlistPageClient shortlists={shortlists} />;
}