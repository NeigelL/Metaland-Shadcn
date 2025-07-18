import dbConnect from "@/lib/mongodb"
import {  auth, isLogin } from "@/lib/nextAuthOptions"
import { NextResponse, NextRequest } from "next/server"
import { getBuyerLotsService } from "@/services/buyerService"
import { logAccessService } from "@/services/accessService"



export  async function GET(request:NextRequest) {

  await dbConnect()
  if(!await isLogin()) {
      return new NextResponse("Unauthorized", {status: 401})
  }

  const user = await auth()
  await logAccessService({
        request,
        metadata : { action: "VIEWED BUYER LOTS" ,user_id: user?.user_id },
  })
  return NextResponse.json(await getBuyerLotsService(user?.user_id))
}