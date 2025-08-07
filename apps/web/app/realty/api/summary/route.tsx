import dbConnect from "@/lib/mongodb"
import {  auth, isLogin } from "@/lib/nextAuthOptions"
import { logAccessService } from "@/services/accessService"
import { getAgentSummaryAmortization } from "@/services/agentService"
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
              metadata : { action: "VIEW AGENT SUMMARY"},
    })
  return NextResponse.json(
    await getAgentSummaryAmortization(
      {
        agent_id: user?.user_id,
        start_date: new Date(params.start_date),
        end_date: new Date(params.end_date),
        group_by: params.group_by ?? "summary"
      }
    )
  )
}