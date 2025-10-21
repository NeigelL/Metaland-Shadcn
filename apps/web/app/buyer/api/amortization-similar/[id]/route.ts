

import dbConnect from "@/lib/mongodb"
import { auth } from "@/lib/nextAuthOptions"
import { logAccessService } from "@/services/accessService"
import { getSimilarAmortizationService } from "@/services/buyerService"
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
        metadata : { action: "GET AMORTIZATION SIMILAR", id, user_id: user?.user_id },
  })
  return NextResponse.json(await getSimilarAmortizationService(id, user?.user_id))
}