import { getSessionToken } from "@/lib/auth";
import { getUserBySessionToken } from "@/services/auth.service";

export async function getAdminUser() {
  const token = await getSessionToken();

  if (!token) {
    return null;
  }

  const user = await getUserBySessionToken(token);

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return user;
}