import dbConnect from "@/lib/mongodb"
import { auth, isLogin } from "@/lib/nextAuthOptions"
import { NextResponse, NextRequest } from "next/server"
import { logAccessService } from "@/services/accessService"
import { getAgentBuyerLotsService } from "@/services/agentService"



export async function GET(request: NextRequest) {

  await dbConnect()
  if (!await isLogin()) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const user = await auth()
  await logAccessService({
    request,
    metadata: { action: "VIEWED AGENT BUYER LOTS", user_id: user?.user_id },
  })
  return NextResponse.json(await getAgentBuyerLotsService(user?.user_id))
}