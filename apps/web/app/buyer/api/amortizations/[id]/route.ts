

import dbConnect from "@/lib/mongodb"
import { auth } from "@/lib/nextAuthOptions"
import { logAccessService } from "@/services/accessService"
import { getAmortizationService } from "@/services/buyerService"
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
   { params }: { params: any }
) {
  const { id } = await params
  const user = await auth()
  await dbConnect()
  await logAccessService({
        request,
        metadata : { action: "VIEWED AMORTIZATION", id, user_id: user?.user_id },
  })
  return NextResponse.json(await getAmortizationService(id, user?.user_id))
}