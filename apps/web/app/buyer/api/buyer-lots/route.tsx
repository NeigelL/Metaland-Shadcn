import dbConnect from "@/lib/mongodb";
import {  auth, isLogin } from "@/lib/nextAuthOptions";
import { NextResponse, NextRequest } from "next/server";
import { getBuyerLotsDueService } from "@/services/buyerService";



export  async function GET(req:NextRequest) {

  await dbConnect()
  if(!await isLogin()) {
      return new NextResponse("Unauthorized", {status: 401})
  }

  const user = await auth()
  return NextResponse.json(await getBuyerLotsDueService(user?.user_id))
}