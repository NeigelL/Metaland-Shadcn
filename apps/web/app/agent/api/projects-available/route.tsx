import dbConnect from "@/lib/mongodb"
import {   isLogin } from "@/lib/nextAuthOptions"
import { logAccessService } from "@/services/accessService"
import { getProjectAvailableService } from "@/services/projectService"
import { NextResponse, NextRequest } from "next/server"


export  async function GET(request:NextRequest) {

  await dbConnect()
  if(!await isLogin()) {
      return new NextResponse("Unauthorized", {status: 401})
  }

  await logAccessService({
              request,
              metadata : { action: "PROJECT AVAILABLE AGENT"},
  })

  return NextResponse.json(
    await getProjectAvailableService()
  )
}