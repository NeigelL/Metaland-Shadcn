

import dbConnect from "@/lib/mongodb"
import { auth } from "@/lib/nextAuthOptions";
import { getAgentAmortizationService } from "@/services/agentService";
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
   { params }: { params: any }
) {
  const { id } = await params
  const user = await auth()
  await dbConnect()
  return NextResponse.json(await getAgentAmortizationService(id, user?.user_id))
}