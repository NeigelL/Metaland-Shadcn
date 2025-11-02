import dbConnect from "@/lib/mongodb"
import {  auth, isLogin } from "@/lib/nextAuthOptions"
import { logAccessService } from "@/services/accessService"
import { getAgentSalesSummary } from "@/services/agentService"
import { NextResponse, NextRequest } from "next/server"


export  async function POST(request:NextRequest) {
  await dbConnect()
  if(!await isLogin()) {
      return new NextResponse("Unauthorized", {status: 401})
  }
  const {params} = await request.json()

  const user = await auth()
  await logAccessService({
              request,
              metadata : { action: "VIEW AGENT SALES SUMMARY", userId: user?.user_id || null },
    })
  return NextResponse.json(
    await getAgentSalesSummary(
      {
        start_date: params.start_date,
        end_date: params.end_date,
      }
    )
  )
}