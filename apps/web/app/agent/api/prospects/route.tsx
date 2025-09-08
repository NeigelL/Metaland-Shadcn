import dbConnect from "@/lib/mongodb"
import {   auth, isLogin } from "@/lib/nextAuthOptions"
import { logAccessService } from "@/services/accessService"
import { deleteAgentLeadService, getAgentLeadsService, saveAgentLeadService } from "@/services/agentService"
import { NextResponse, NextRequest } from "next/server"


export  async function GET(request:NextRequest) {

  await dbConnect()
  if(!await isLogin()) {
      return new NextResponse("Unauthorized", {status: 401})
  }
  await logAccessService({
              request,
              metadata : { action: "PROSPECT AVAILABLE"},
  })
  const user = await auth()
  return NextResponse.json(
    await getAgentLeadsService(user.id)
  )
}

export  async function POST(request:NextRequest) {

  await dbConnect()
  if(!await isLogin()) {
      return new NextResponse("Unauthorized", {status: 401})
  }

  const data = await request.json()
  await logAccessService({
      request,
      metadata : { action: "PROSPECT POST AGENT", data: data}
  })

  switch(data.action) {
    case "SAVE":
      return NextResponse.json(
        await saveAgentLeadService(data)
      )
    break;

    case "DELETE":
      await deleteAgentLeadService(data.leadId)
      if(!data.leadId) {
        return new NextResponse("Bad Request", {status: 400})
      }

      if(data.leadId) {
        return NextResponse.json({
          message: "Deleted successfully",
          success: true
        })
      }
      default:
      return new NextResponse("Bad Request", {status: 400})
  }
}

