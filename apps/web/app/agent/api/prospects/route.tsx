import dbConnect from "@/lib/mongodb"
import {   auth, isLogin } from "@/lib/nextAuthOptions"
import { logAccessService } from "@/services/accessService"
import { getLeadsService, saveLeadService } from "@/services/agentService"
import { getProjectAvailableService } from "@/services/projectService"
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
    await getLeadsService(user.id)
  )
}

export  async function POST(request:NextRequest) {

  await dbConnect()
  if(!await isLogin()) {
      return new NextResponse("Unauthorized", {status: 401})
  }

  await logAccessService({
              request,
              metadata : { action: "PROSPECT POST AGENT"},
  })
  const data = await request.json()

  return NextResponse.json(
    await saveLeadService(data)
  )
}

