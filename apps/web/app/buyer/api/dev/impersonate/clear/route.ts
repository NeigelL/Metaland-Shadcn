// app/api/dev/impersonate/clear/route.ts
import { clearImpersonationCookies } from "@/lib/impersonate";

export async function POST() {
  return await clearImpersonationCookies();
}
