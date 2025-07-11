import dbConnect from "@/lib/mongodb"
import { auth } from "@/lib/nextAuthOptions"
import AccessLog from "@/models/access_logs"
import { NextRequest } from "next/server"

export async function logAccessService({
  request,
  userId,
  metadata = {}
}: {
  request: NextRequest,
  userId?: string | null,
  metadata?: Record<string, any>
}): Promise<void> {
  try {
    await dbConnect();

    const url = request.url;
    const pathname = request.nextUrl.pathname;
    let resolveIp = null

    let header =request.headers.get('x-forwarded-for')
    if(header) {
      resolveIp = header?.split(',')[0]?.trim();
    }

    let resolvedUserId = userId;
    if (!resolvedUserId) {
      const user = await auth();
      resolvedUserId = user?.user_id ?? null;
    }

    await AccessLog.create({
      user_id: resolvedUserId,
      url,
      pathname,
      ip: resolveIp,
      metadata,
      timestamp: new Date(),
    });
  } catch (error) {
    // Use a logger in production, not console.error
    console.error(
      `Error logging access: ${(error as Error).message} | url: ${request.url}`
    );
  }
}