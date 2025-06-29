import dbConnect from "@/lib/mongodb";
import {  auth, isLogin } from "@/lib/nextAuthOptions";
import { getAgentDueDateAmortization } from "@/services/agentService";
import { NextResponse, NextRequest } from "next/server";


export  async function GET(req:NextRequest) {

  await dbConnect()
  if(!await isLogin()) {
      return new NextResponse("Unauthorized", {status: 401})
  }

  const user = await auth()
  return NextResponse.json(await getAgentDueDateAmortization( user?.user_id ) )
}