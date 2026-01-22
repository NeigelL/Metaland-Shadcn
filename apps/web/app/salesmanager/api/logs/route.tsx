import dbConnect from "@/lib/mongodb"
import { auth, isLogin } from "@/lib/nextAuthOptions"
import { NextResponse, NextRequest } from "next/server"
import { logAccessService } from "@/services/accessService"



export async function GET(request: NextRequest) {

  await dbConnect()
  if (!await isLogin()) {
    return new NextResponse("Unauthorized", { status: 401 })
  }
  const user = await auth()
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get("url") || ""
  if (url) {
    await logAccessService({
      request,
      metadata: { action: "SOCKET LOG ACCESS " + url, user_id: user?.user_id },
    })
  }
  return NextResponse.json({ success: true })
}