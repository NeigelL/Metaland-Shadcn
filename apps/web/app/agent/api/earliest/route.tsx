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

  try {
    // Validate user_id exists
    if (!user?.user_id) {
      return NextResponse.json({ error: "User ID not found" }, { status: 400 })
    }

    const result = await getAgentEarliestReservation(user.user_id)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching agent earliest reservation:", error)
  }
}