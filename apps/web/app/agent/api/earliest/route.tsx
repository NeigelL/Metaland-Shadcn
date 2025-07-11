import dbConnect from "@/lib/mongodb";
import {  auth, isLogin } from "@/lib/nextAuthOptions";
import { logAccessService } from "@/services/accessService";
import { getAgentEarliestReservation } from "@/services/agentService";
import { NextResponse, NextRequest } from "next/server";


export  async function GET(request:NextRequest) {

  await dbConnect()
  if(!await isLogin()) {
      return new NextResponse("Unauthorized", {status: 401})
  }

  const user = await auth()
  await logAccessService({
          request,
          metadata : { action: "GET AGENT EARLIEST RESERVATION" ,user_id: user?.user_id },
    })
  return NextResponse.json(await getAgentEarliestReservation( user?.user_id ) )
}